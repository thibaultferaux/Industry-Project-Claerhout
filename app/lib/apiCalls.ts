import axios from "axios";
import { Job, ModelRequest, ModelResponse } from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const startModel = async (
  request: ModelRequest
): Promise<ModelResponse> => {
  try {
    const response = await axios.post(
      API_URL + "detect-roofs/",
      request
    );
    console.log("Start model response", response.data)
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getJob = async (jobId: string): Promise<Job> => {
  try {
    const response = await axios.get(
      `${API_URL}job-status/${jobId}`
    );
    console.log("Get job response", response.data)
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
