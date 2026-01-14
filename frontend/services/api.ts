import axios from "axios";

// Prefer environment variable, fall back to localhost for development
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ||
  "http://localhost:8000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  // Reasonable timeout for chat requests
  timeout: 30000,
});

export interface UploadResponse {
  filename: string;
  chunks: number;
  status: string;
}

export interface ChatRequest {
  question: string;
}

export interface ChatResponse {
  question: string;
  answer: string;
  sources: string[];
  error?: string;
}

export const uploadPDF = async (file: File): Promise<UploadResponse> => {
  const formData = new FormData();
  formData.append("file", file);

  try {
    // For FormData uploads, create request without default JSON Content-Type header.
    // Axios will automatically set multipart/form-data with boundary.
    const response = await axios.post<UploadResponse>(
      `${API_BASE_URL}/upload`,
      formData,
      {
        timeout: 60000, // 60 second timeout for large files
        headers: {
          // Explicitly don't set Content-Type - browser will set it with boundary
        },
        // Add withCredentials if needed for CORS / auth
        withCredentials: false,
      }
    );

    return response.data;
  } catch (error: any) {
    // Log full error for debugging
    console.error("Upload error details:", {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      headers: error.response?.headers,
      request: error.request,
    });
    throw error;
  }
};

export const sendChatMessage = async (
  question: string
): Promise<ChatResponse> => {
  const response = await api.post<ChatResponse>("/chat", { question });
  return response.data;
};

// Test backend connection
export const testConnection = async (): Promise<boolean> => {
  try {
    const response = await axios.get("http://localhost:8000/health");
    return response.data.status === "up";
  } catch (error) {
    console.error("Backend connection test failed:", error);
    return false;
  }
};
