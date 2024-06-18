# Processing API Documentation

This document provides an overview of the components and functionalities within the `processing-api`. The `processing-api` is responsible for processing images from the storage queue using an AI model, calculating relevant metrics, updating Cosmos DB, and sending email notifications.

## Table of Contents

1. [Overview](#overview)
2. [Directory Structure](#directory-structure)
   - [azure_utils](#azure_utils)
   - [image_generation](#image_generation)
   - [.env_example](#env_example)
   - [Dockerfile](#dockerfile)
   - [email.html](#emailhtml)
   - [main](#main)
   - [requirements](#requirements)
3. [Setup](#setup)

## Overview

The `processing-api` processes images from the storage queue, performs calculations using an AI model to determine metrics such as perimeter and surface area, updates the results in Cosmos DB, and sends an email notification upon job completion.

## Directory Structure

### `azure_utils`
Contains classes and functions for communicating with Azure Blob Storage, Cosmos DB, and Storage Queue.

### `image_generation`
Processes images using the AI model and calculates results such as perimeter and surface area.

### `.env_example`
An example `.env` file. Create your own `.env` file and populate it with the required variables.

### `Dockerfile`
Defines the environment for running the processing API locally.

### `email.html`
Template for formatting the email notifications sent to users.

### `main`
Processes images from the storage queue, sends email notifications, and updates Cosmos DB with the results.

### `requirements`
A list of dependencies required to run the processing API.
