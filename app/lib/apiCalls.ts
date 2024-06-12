import axios from "axios";
import { Job, ModelRequest, ModelResponse } from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const apiKeyHeader = {
  headers: {
    "x-api-key": process.env.API_KEY,
  },
};

export const startModel = async (
  request: ModelRequest
): Promise<ModelResponse> => {
  try {
    const response = await axios.post(API_URL + "detect-roofs/", request, apiKeyHeader);
    console.log("Start model response", response.data);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getJob = async (jobId: string): Promise<Job> => {
  try {
    const response = await axios.get(`${API_URL}job-status/${jobId}`, apiKeyHeader);
    console.log("Get job response", response.data);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getJobs = async (): Promise<Job[]> => {
  try {
    const response = await axios.get(`${API_URL}jobs`, apiKeyHeader);
    console.log("Get jobs response", response.data);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getLocationName = async (
  coordinates: [number, number]
): Promise<string> => {
  const [latitude, longitude] = coordinates;
  const azureKey = process.env.AZURE_MAPS_KEY;

  try {
    const response = await axios.get(
      `https://atlas.microsoft.com/search/address/reverse/json?api-version=1.0&subscription-key=${azureKey}&language=nl-BE&query=${latitude},${longitude}`
    );
    console.log("Get location name response", response.data);
    return response.data.addresses[0].address.municipality;
  } catch (error) {
    console.error(error);
    throw error;
   }
};
