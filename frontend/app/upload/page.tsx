"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { uploadPDF, UploadResponse, testConnection } from "@/services/api";
import FloatingLines from "@/components/FloatingLines";

export default function UploadPage() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [backendConnected, setBackendConnected] = useState<boolean | null>(
    null
  );

  useEffect(() => {
    testConnection()
      .then(setBackendConnected)
      .catch(() => setBackendConnected(false));
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type !== "application/pdf") {
        setMessage({ type: "error", text: "Please select a PDF file" });
        return;
      }
      setFile(selectedFile);
      setMessage(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage({ type: "error", text: "Please select a file first" });
      return;
    }

    setUploading(true);
    setMessage(null);

    try {
      const response: UploadResponse = await uploadPDF(file);
      setMessage({
        type: "success",
        text: `Successfully uploaded ${response.filename}! ${response.chunks} chunks created.`,
      });
      setFile(null);

      const fileInput = document.getElementById(
        "file-input"
      ) as HTMLInputElement;
      if (fileInput) fileInput.value = "";
    } catch (error: any) {
      let errorMessage = "Upload failed";

      if (error.response) {
        errorMessage =
          error.response.data?.detail ||
          error.response.data?.message ||
          `Server error: ${error.response.status}`;
      } else if (error.request) {
        errorMessage =
          "Network error: Could not reach the server. Please try again later.";
      } else {
        errorMessage = error.message || "Unknown error occurred";
      }

      setMessage({ type: "error", text: `Upload failed: ${errorMessage}` });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden p-4">
      {/* FloatingLines background */}
      <div className="absolute inset-0 -z-30">
        <FloatingLines
          linesGradient={["#7547f5", "#2fc182", "#b8f547"]}
          animationSpeed={1.5}
          interactive
          bendRadius={5}
          bendStrength={-1.2}
          mouseDamping={0.1}
          parallax
          parallaxStrength={0.4}
          topWavePosition={{ x: 10.0, y: 0.5, rotate: -0.4 }}
          middleWavePosition={{ x: 5.0, y: 0.0, rotate: 0.2 }}
        />
      </div>

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/30 -z-20" />

      {/* Page content */}
      <div className="relative max-w-3xl mx-auto pt-8 z-10">
        <button
          onClick={() => router.push("/")}
          className="inline-flex items-center gap-2 text-indigo-100 hover:text-white font-medium mb-6 transition-colors"
        >
          <span className="text-lg">←</span>
          <span>Back to Home</span>
        </button>

        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="bg-white/85 backdrop-blur-xl rounded-3xl shadow-2xl p-8 md:p-12 border border-white/60"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                Upload PDF Documents
              </h1>
              <p className="text-gray-600">
                Make your PDFs searchable and ready for intelligent Q&A.
              </p>
            </div>

            <div className="hidden md:flex h-12 w-12 items-center justify-center rounded-full bg-indigo-600 text-white shadow-lg shadow-indigo-500/40">
              PDF
            </div>
          </div>

          <AnimatePresence>
            {backendConnected === false && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800"
              >
                <p className="font-semibold">⚠️ Backend Connection Issue</p>
                <p className="text-sm mt-1">
                  Cannot reach the backend server. Please try again later.
                </p>
              </motion.div>
            )}

            {backendConnected === true && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800"
              >
                <p className="text-sm">✓ Backend connected</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* File input */}
          <div className="space-y-6">
            <div>
              <label
                htmlFor="file-input"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Select PDF File
              </label>
              <input
                id="file-input"
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                disabled={uploading}
                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0
                  file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700
                  hover:file:bg-indigo-100 cursor-pointer bg-white/70
                  border border-gray-200 rounded-xl"
              />
              {file && (
                <p className="mt-2 text-sm text-gray-600">
                  Selected: <span className="font-medium">{file.name}</span> (
                  {(file.size / 1024 / 1024).toFixed(2)} MB)
                </p>
              )}
            </div>

            {/* Status message */}
            <AnimatePresence>
              {message && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className={`p-4 rounded-lg ${
                    message.type === "success"
                      ? "bg-green-50 border border-green-200 text-green-800"
                      : "bg-red-50 border border-red-200 text-red-800"
                  }`}
                >
                  {message.text}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Upload button */}
            <motion.button
              whileHover={{ scale: !file || uploading ? 1 : 1.02 }}
              whileTap={{ scale: !file || uploading ? 1 : 0.98 }}
              onClick={handleUpload}
              disabled={!file || uploading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400
                disabled:cursor-not-allowed text-white font-semibold py-3 px-6
                rounded-xl shadow-lg shadow-indigo-500/30 transition-colors
                flex items-center justify-center gap-2"
            >
              {uploading ? (
                <>
                  <span className="h-4 w-4 border-2 border-white/60 border-t-transparent rounded-full animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  Upload Document <span className="text-lg">↑</span>
                </>
              )}
            </motion.button>

            {/* Footer */}
            <div className="mt-8 pt-8 border-t border-gray-200 flex items-center justify-between flex-wrap gap-3">
              <p className="text-sm text-gray-500">
                Once uploaded, you can start chatting with your documents.
              </p>
              <button
                onClick={() => router.push("/chat")}
                className="text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-1"
              >
                Go to Chat <span>→</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
