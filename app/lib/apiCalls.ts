import axios from "axios"
import { ModelRequest, ModelResponse } from "./types"

export const startModel = async (request: ModelRequest): Promise<ModelResponse> => {
  try {
    const response = await axios.post("http://roof-detection-client-api:8000/detect-roofs/", request);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export const getJob = async (jobId: string): Promise<ModelResponse> => {
  try {
    const response = await axios.get(`http://roof-detection-client-api:8000/job-status/${jobId}`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}