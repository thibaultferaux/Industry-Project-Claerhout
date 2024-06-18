# Roof Detection Documentation

This document provides an overview of the components and functionalities within the `roof-detection` directory. The `roof-detection` component is responsible for all tasks related to the AI model used for detecting flat roofs.

## Table of Contents

1. [Overview](#overview)
2. [Directory Structure](#directory-structure)
   - [model/best.pt](#modelbestpt)
   - [test-images](#test-images)
   - [data.yaml](#datayaml)
   - [predict-images](#predict-images)
   - [predict-perimeter](#predict-perimeter)
   - [predict-ratio](#predict-ratio)
   - [predict-surface-area](#predict-surface-area)
   - [train-model](#train-model)
3. [Usage](#usage)
4. [Setup](#setup)

## Overview

The `roof-detection` directory contains all the necessary files and scripts for training and using the AI model. When the application runs, it utilizes the AI model to detect flat roofs. This section does not interact with external files during the application runtime but focuses on the AI model preparation and testing.

## Directory Structure

### `model/best-v2.pt`
This file is our latest trained AI model with the best performance for detecting flat roofs.

### `test-images`
Contains images used for testing the AI model.

### `data.yaml`
A YAML file used for training the AI model. It includes:
- Absolute paths to folders containing images for training the AI model.
- Information about the different classes.
- Images must be available locally or can be fetched from the provided URL.

### `predict-images`
Directory to store results when predicting outcomes on a set of images.

### `predict-perimeter`
Script to calculate the perimeter of flat roofs in specified images.

### `predict-ratio`
Script to calculate the ratio of flat to sloped roofs in specified images.

### `predict-surface-area`
Script to calculate the surface area of flat roofs in specified images.

### `train-model`
Script to train the AI model locally.

## Usage

- **Model Testing**: Place the images you want to test in the `test-images` directory and use the corresponding prediction scripts to evaluate the AI model's performance.
- **Model Training**: Use the `train-model` script along with the `data.yaml` file to train the AI model locally. Ensure that the image paths in `data.yaml` are correctly set up.