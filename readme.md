# Flat Roof Detection Project

This project is designed to detect flat roofs based on coordinates and a specified radius. The application processes images to identify flat roofs and provides various metrics to the user.

## Table of Contents

1. [Project Overview](#project-overview)
2. [Directory Structure](#directory-structure)
   - [app](#app)
   - [client-api](#client-api)
   - [processing-api](#processing-api)
   - [roof-detection](#roof-detection)
   - [docker-compose](#docker-compose)
3. [Functionality](#functionality)
4. [Usage](#usage)
5. [Setup](#setup)

## Project Overview

This project leverages Azure Maps and an AI model to detect flat roofs within a specified radius of given coordinates. The results include the number of flat roofs, their surface area, perimeter, and the ratio of flat roofs in the area.

## Directory Structure

### `app`

The `app` directory contains the frontend application, responsible for the user interface and handling user interactions.

### `client-api`

The `client-api` handles requests from the frontend. Its responsibilities include:

- Generating images using Azure Maps.
- Storing images in Azure Blob Storage and Storage Queue.
- Creating jobs in Cosmos DB.

### `processing-api`

The `processing-api` processes images from the storage queue using the AI model. It performs the following tasks:

- Processing images to detect flat roofs.
- Calculating relevant metrics.
- Writing results to Cosmos DB.
- Sending an email notification upon job completion.

### `roof-detection`

This directory focuses on training the AI model and performing calculations using the model to detect flat roofs.

### `docker-compose`

The `docker-compose` file facilitates running the project locally. It sets up all necessary services and configurations for local development.

## Functionality

The application can detect flat roofs based on user-provided coordinates and a specified radius. It provides the following results to the user:

- **Number of flat roofs**: Total count of detected flat roofs.
- **Surface area of flat roofs**: Combined surface area of all detected flat roofs.
- **Perimeter of flat roofs**: Combined perimeter length of all detected flat roofs.
- **Ratio of flat roofs**: Proportion of flat roofs within the specified area.

## Usage

To use this project locally, the provided `docker-compose` configuration sets up the required services and dependencies.

## Setup

Follow these steps to set up and run the project locally:

1. Clone the repository.
   ```sh
   git clone <repository-url>
   ```
2. Navigate to the project directory.
   ```sh
   cd <project-directory>
   ```
3. Run the following command to start the project.
   ```sh
    docker-compose up
    ```
This will start all necessary services and make the application available for use.