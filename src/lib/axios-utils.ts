import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from "axios";
const baseUrl: string = import.meta.env.VITE_BASE_URL;

import { getAccessToken } from "./utils";

interface ErrorResponse {
  error?: string;
  message?: string;
  conflicts?: any;
}

// Custom error interface for better typing
export interface CustomError extends Error {
  status?: number;
  data?: ErrorResponse;
}

// Create axios instance with base configuration
const client: AxiosInstance = axios.create({
  baseURL: baseUrl,
  timeout: 300000,
  headers: {
    "Content-Type": "application/json",
  },
});

client.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    // check the config content
    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    } else {
      config.headers["Content-Type"] = "application/json";
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for standardized data extraction and error handling
client.interceptors.response.use(
  (response) => response.data, // Extract data from successful responses
  (error: AxiosError) => {
    const responseData = error.response?.data as ErrorResponse;
    const customError: CustomError = new Error(
      responseData?.error ||
        responseData?.message ||
        error.message ||
        `HTTP error! Status: ${error.response?.status || "unknown"}`
    );

    customError.status = error.response?.status;
    customError.data = responseData;

    if (error.response?.status && error.response.status >= 500) {
      console.error("Server error:", error.response.status, error.response.data);
    }

    return Promise.reject(customError);
  }
);

// Typed request function - now much simpler because interceptors handle the work
export const request = async <T = any>(options: AxiosRequestConfig): Promise<T> => {
  return client(options) as Promise<T>;
};
