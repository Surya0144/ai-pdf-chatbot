"use client";

import { useRouter } from "next/navigation";
import { motion, Variants } from "framer-motion";
import Aurora from "../components/Aurora";

const containerVariants: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" as const },
  },
};

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-4">
      {/* Aurora background */}
      <div className="absolute inset-0 -z-30">
        <Aurora
          colorStops={["#5227FF", "#7cff67", "#5227FF", "#376f77", "#d4e3ab"]}
          amplitude={0.9}
          blend={0.55}
        />
      </div>

      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-black/30 -z-20" />

      {/* Floating animated background orbs */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <motion.div
          animate={{ x: [0, 40, 0], y: [0, 30, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-32 -left-32 h-72 w-72 rounded-full bg-white/10 blur-3xl"
        />
        <motion.div
          animate={{ x: [0, -50, 0], y: [0, -40, 0] }}
          transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-40 -right-40 h-80 w-80 rounded-full bg-blue-300/20 blur-3xl"
        />
      </div>

      {/* Main card */}
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        whileHover={{ scale: 1.01 }}
        className="relative z-10 max-w-2xl w-full bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 p-8 md:p-12"
      >
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          {/* Title */}
          <motion.h1
            variants={itemVariants}
            className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight text-center"
          >
            AI Document Search
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-lg text-gray-600 text-center mb-8"
          >
            Upload PDFs, chat with your documents, and get answers in seconds.
          </motion.p>

          {/* How it works */}
          <motion.div
            variants={itemVariants}
            whileHover={{ y: -4 }}
            className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-indigo-100 rounded-2xl p-6 shadow-sm mb-6"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-3 flex items-center justify-center gap-2">
              <motion.span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-green-600 text-white text-sm font-bold shadow-md">
                AI
              </motion.span>
              <span>How it works</span>
            </h2>

            <ol className="list-decimal list-inside space-y-2 text-gray-700">
              <li>Upload your PDF documents.</li>
              <li>We process and index them securely.</li>
              <li>Ask questions in natural language.</li>
              <li>Get trustworthy answers grounded in your docs.</li>
            </ol>
          </motion.div>

          {/* Buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push("/upload")}
              className="relative flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg shadow-indigo-500/30 overflow-hidden"
            >
              <motion.span
                animate={{ y: [0, -2, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="flex items-center justify-center gap-2"
              >
                Upload Documents
                <span className="text-xl">↑</span>
              </motion.span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push("/chat")}
              className="flex-1 bg-white/80 hover:bg-white text-gray-900 font-semibold py-3 px-6 rounded-xl border border-gray-200 shadow-md"
            >
              <motion.span
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 1.8, repeat: Infinity }}
                className="flex items-center justify-center gap-2"
              >
                Start Chatting
                <span className="text-xl">💬</span>
              </motion.span>
            </motion.button>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}
