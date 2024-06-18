# Client API Documentation

This document provides an overview of the components and functionalities within the `client-api`. The `client-api` is responsible for handling frontend requests, generating images using Azure Maps, and interacting with various Azure services.

## Table of Contents

1. [Overview](#overview)
2. [Directory Structure](#directory-structure)
   - [azure_utils](#azure_utils)
   - [image_generation](#image_generation)
   - [.env_example](#env_example)
   - [Dockerfile](#dockerfile)
   - [main](#main)
   - [models](#models)
   - [requirements](#requirements)
3. [API Endpoints](#api-endpoints)
   - [detect-roofs](#detect-roofs)
   - [job-status](#job-status)
   - [jobs](#jobs)
4. [Setup](#setup)

## Overview

The `client-api` handles requests from the frontend and performs tasks such as generating images within a specified region using Azure Maps. It interacts with Azure Blob Storage, Cosmos DB, and Storage Queue to manage data and job statuses.

## Directory Structure

### `azure_utils`

Contains classes and functions for communicating with Azure Blob Storage, Cosmos DB, and Storage Queue.

### `image_generation`

Responsible for generating images via Azure Maps within the specified region.

### `.env_example`

An example `.env` file. Create your own `.env` file and populate it with the required variables.

### `Dockerfile`

Defines the environment for running the client API locally.

### `main`

The main API that communicates with the frontend. It includes the following endpoints:

- `detect-roofs`: Use this endpoint to detect roofs within a specified region.
- `job-status`: Retrieve the status of a specific job.
- `jobs`: Retrieve the status of all jobs.

### `models`

Defines the classes representing the data received from the frontend.

### `requirements`

A list of dependencies required to run the client API.

## API Endpoints

### `detect-roofs`

**Description**: Detect roofs within a specified region.
**Endpoint**: `/detect-roofs`
**Method**: `POST`
**Request Body**: JSON object containing coordinates, radius and email.

### `job-status`

**Description**: Get the status of a specific job.
**Endpoint**: `/job-status/{job_id}`
**Method**: `GET`
**Parameters**: `job_id` - The ID of the job.

### `jobs`

**Description**: Get all the completed jobs.
**Endpoint**: `/jobs`
**Method**: `GET`
