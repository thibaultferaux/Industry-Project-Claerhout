import math
import logging
from time import sleep

from azure_utils.storage_queue import get_queue_client, fetch_urls_from_queue, receive_job_from_queue, delete_job_from_queue, get_error_queue_client
from azure_utils.cosmos import update_job_results, set_job_status
from azure_utils.blob_storage import get_container_client
from img_processing.processing import handle_image_batch
import asyncio

import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
import os
from dotenv import load_dotenv

load_dotenv()

smtp_server = os.getenv('SMTP_SERVER')
smtp_port = os.getenv('SMTP_PORT')
username = os.getenv('SMTP_USERNAME')
password = os.getenv('SMTP_PASSWORD')

logging.basicConfig(level=logging.INFO,format='%(asctime)s - %(levelname)s - %(message)s')

# Functions to split tiles
def lat_lon_to_tile(latitude, longitude, zoom):
    lat_rad = math.radians(latitude)
    n = 2.0 ** zoom
    xtile = int((longitude + 180.0) / 360.0 * n)
    ytile = int((1.0 - math.log(math.tan(lat_rad) + (1 / math.cos(lat_rad))) / math.pi) / 2.0 * n)
    return xtile, ytile

def meters_to_pixels(radius_meters, latitude, zoom_level):
    meters_per_pixel = 156543.03392 * math.cos(latitude * math.pi / 180) / (2 ** zoom_level)
    return int(radius_meters / meters_per_pixel)

def email(job):
    to_email = job["email"]
    logging.info(f"Sending email from {username} to {to_email}")
    subject = 'Resultaten Roof Radar'
    body = f'hier zijn de resultaten van roof radar op de coordinaten: {job["coordinates"][0]},{job["coordinates"][1]} \n\n Aantal platte daken: {job["totalFlatRoofs"]} \n Aantal hellende daken: {job["totalSlopedRoofs"]} \n totale oppervlakte platte daken: {round(job["totalSurfaceAreaFlatRoofs"])}m² \n totale omtrek platte daken: {round(job["totalCircumferenceFlatRoofs"])}m \n ratio platte daken tov hellende daken: {round(job["ratioFlatRoofs"]*100,2)}%'
    logging.debug(f"Email body: {body}")
    msg = MIMEMultipart()
    msg['From'] = username
    msg['To'] = to_email
    msg['Subject'] = subject
    msg.attach(MIMEText(body, 'plain'))
    logging.debug(f"Email message: {msg.as_string()}")
    try:
        server = smtplib.SMTP(smtp_server, smtp_port)
        server.starttls()  # Secure the connection
        server.login(username, password)
        server.sendmail(username, to_email, msg.as_string())
        logging.info("Email sent successfully")
    except Exception as e:
        logging.error(f"Failed to send email: {e}")

async def process_queue(message: str, job_queue_client):
    job_id = message.content
    logging.info(f"Processing queue with id: {job_id}")

    queue_client = get_queue_client(job_id)
    container_client = get_container_client(job_id)
    error_client = get_error_queue_client()

    try:
        while True:
            urls = await fetch_urls_from_queue(queue_client, error_client)
            if not urls:
                logging.info(f"No more images to process for job {job_id}")
                break

            # When urls are retrieved, process the images
            logging.info(f"Processing {len(urls)} images for job {job_id}")
            results = await handle_image_batch(urls, container_client)
            logging.debug(f"Image Batch Results: {results}")
            job = await update_job_results(job_id, results, len(urls))
            logging.info(f"Processed {len(urls)} images for job {job_id}")

            # Check if all images have been processed
            if (job["totalImages"] == job["imagesProcessed"]):
                # Update job status to completed
                logging.info(f"Job {job_id} completed")
                await set_job_status(job_id, "completed")
                # Delete the queues
                logging.info(f"Deleting queue {job_id}")
                queue_client.delete_queue()
                delete_job_from_queue(job_queue_client)
                # Delete the blob container
                # container_client.delete_container()
                email(job)
                return

    except Exception as e:
        logging.error(f"Error processing images for job {job_id}: {e}")
        # Update job status to failed
        await set_job_status(job_id, "error")

    return


def listen_to_queue():
    job_queue_client = get_queue_client("jobs")
    while True:
        logging.info("Listening to queue")
        jobs = receive_job_from_queue(job_queue_client)
        #check if job is not empty
        if jobs and jobs[0]:
            job = jobs[0]
            logging.info(f"Received job {job}")
            logging.info(f"Received job {job.content}")
            # Run the process_queue function
            asyncio.run(process_queue(job, job_queue_client))

        sleep(10)

if __name__ == "__main__":
    listen_to_queue()
