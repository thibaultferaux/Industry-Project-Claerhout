import math
import logging
from time import sleep

from azure_utils.storage_queue import get_queue_client, fetch_urls_from_queue, receive_job_from_queue, delete_job_from_queue
from azure_utils.cosmos import update_job_results, set_job_status
from azure_utils.blob_storage import get_container_client
from img_processing.processing import handle_image_batch
import asyncio

import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from jinja2 import Environment, FileSystemLoader
import os
from dotenv import load_dotenv
import requests

load_dotenv()

smtp_server = os.getenv('SMTP_SERVER')
smtp_port = os.getenv('SMTP_PORT')
username = os.getenv('SMTP_USERNAME')
password = os.getenv('SMTP_PASSWORD')

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

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
    env = Environment(loader=FileSystemLoader('.'))
    template = env.get_template('email.html')
    to_email = job["email"]
    logging.info(f"Sending email from {username} to {to_email}")
    logging.info(f"JOB: {job}")
    subject = 'Resultaten Roof Radar'
    latitude = job["coordinates"][0]
    longitude = job["coordinates"][1]
    azureMapsKey = os.getenv('AZURE_MAPS_KEY')
    url = f"https://atlas.microsoft.com/search/address/reverse/json?api-version=1.0&subscription-key={azureMapsKey}&language=nl-BE&query={latitude},{longitude}"
    response = requests.get(url)
    # Check if the request was successful
    if response.status_code == 200:
        # Parse the response JSON
        data = response.json()

        # Check if there are any addresses in the response
        if "addresses" in data and len(data["addresses"]) > 0:
            # Extract the municipality
            municipality = data["addresses"][0]["address"].get("municipality", "niet gevonden")
            print(f"Municipality: {municipality}")
        else:
            print("No addresses found in the response.")
    else:
        print(f"Error: Unable to fetch data. Status code: {response.status_code}")

    env = Environment(loader=FileSystemLoader('.'))
    template = env.get_template('email.html')
    data = {
        "regio": municipality,
        "straal": f"{job['radius']/1000:.1f}".replace('.', ',') + "km",
        "aantal": job["totalFlatRoofs"],
        "oppervlakte": f"{round(job['totalSurfaceAreaFlatRoofs'])} m²",
        "omtrek": f"{round(job['totalCircumferenceFlatRoofs'])} m",
        "ratio": f"{round(job['ratioFlatRoofs']*100)}%"
    }
    html_content = template.render(data)
    msg = MIMEMultipart('alternative')
    msg['From'] = username
    msg['To'] = to_email
    msg['Subject'] = subject
    msg.attach(MIMEText(html_content, 'html'))
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

    queue_client = get_queue_client(f"job-{job_id}")
    container_client = get_container_client(job_id)

    try:
        while True:
            urls = await fetch_urls_from_queue(queue_client)
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
