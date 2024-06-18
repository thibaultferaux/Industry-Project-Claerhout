# Next.js Frontend for Roof Detection

This document provides an overview of the Next.js 14 frontend application for detecting flat roofs. The frontend features a map interface for inputting location and radius, interacts with an AI model to get results, and displays the completed jobs on a separate page.

## Table of Contents

1. [Overview](#overview)
2. [Features](#features)
3. [Pages](#pages)
   - [Root Page `/`](#root-page-)
   - [Results Page `/results`](#results-page-results)
4. [Setup](#setup)
5. [Usage](#usage)

## Overview

The Next.js frontend application provides an interface for users to detect flat roofs based on specified location coordinates and radius. The application communicates with a backend AI model to fetch results and displays them. Additionally, it maintains a history of completed jobs.

## Features

- **Map Interface**: Users can input a location and radius using an interactive map.
- **Results Display**: Displays the AI model results including the number, surface area, perimeter, and ratio of flat roofs.
- **Job History**: Shows a list of all completed jobs on a separate results page.

## Pages

### Root Page `/`
The root page is the main interface where users can:
- Input location coordinates and radius using a map interface.
- Submit the input to retrieve results from the AI model.
- View the calculated results, which include:
  - Number of flat roofs
  - Surface area of flat roofs
  - Perimeter of flat roofs
  - Ratio of flat roofs

### Results Page `/results`
The results page displays a list of all completed jobs from the past. Each job entry includes:
- Location
- Radius
- Results summary (number of flat roofs, surface area, perimeter, ratio)
- Date of completion
