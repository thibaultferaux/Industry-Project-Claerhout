import math
from fastapi import FastAPI
import numpy as np
import logging
import json

from azure_utils.storage_queue import get_queue_client, fetch_urls_from_queue
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

app = FastAPI()

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

@app.get("/")
async def root():
    return {"message": "Hello World"}

@app.post("/process/")
async def process_queue(job_id: str):
    logging.info(f"Processing queue with id: {job_id}")

    queue_client = get_queue_client(job_id)
    container_client = get_container_client(job_id)

    async def process_images():
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
                    # Delete the queue
                    logging.info(f"Deleting queue {job_id}")
                    queue_client.delete_queue()
                    # Delete the blob container
                    # container_client.delete_container()

                    to_email = 'thibault.feraux@hotmail.com'
                    logging.info(f"Sending email from {username} to {to_email}")
                    subject = 'Resultaten Roof Radar'
                    body = json.dumps(job, indent=4)
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
                    return

        except Exception as e:
            logging.error(f"Error processing images for job {job_id}: {e}")
            # Update job status to failed
            await set_job_status(job_id, "error")

    asyncio.create_task(process_images())

    return {"message": "Processing job with id: " + job_id}



