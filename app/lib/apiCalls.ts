import axios from "axios";
import { ModelRequest, ModelResponse } from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const startModel = async (
  request: ModelRequest
): Promise<ModelResponse> => {
  try {
    console.log("request", request);
    const response = await axios.post(
      "http://localhost:8000/detect-roofs/",
      request
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getJob = async (jobId: string): Promise<ModelResponse> => {
  try {
    const response = await axios.get(
      `http://localhost:8000/job-status/${jobId}`
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
