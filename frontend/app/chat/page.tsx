"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  sendChatMessage,
  ChatResponse,
  getUploadedPDFs,
  UploadedPDFsResponse,
} from "@/services/api";
import FloatingLines from "@/components/FloatingLines";

interface Message {
  role: "user" | "assistant";
  content: string;
  sources?: string[];
}

export default function ChatPage() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploadedPDFs, setUploadedPDFs] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const fetchUploadedPDFs = async () => {
      try {
        const response: UploadedPDFsResponse = await getUploadedPDFs();
        setUploadedPDFs(response.pdfs);
      } catch (error) {
        console.error("Failed to fetch uploaded PDFs:", error);
      }
    };
    fetchUploadedPDFs();
  }, []);

  const floatingLinesProps = useMemo(
    () => ({
      linesGradient: ["#6366f1", "#38bdf8", "#bef264"],
      animationSpeed: 1.2,
      interactive: true,
      parallax: true,
      parallaxStrength: 0.3,
      topWavePosition: { x: 10.0, y: 0.2, rotate: -0.4 },
      middleWavePosition: { x: 5.0, y: 0.5, rotate: 0.2 },
    }),
    []
  );

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage: Message = { role: "user", content: input.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response: ChatResponse = await sendChatMessage(userMessage.content);
      setMessages((prev) => [
        ...prev,
        response.error
          ? { role: "assistant", content: `Error: ${response.error}` }
          : {
              role: "assistant",
              content: response.answer,
              sources: response.sources,
            },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col">
      {/* Animated Background */}
      <div className="absolute inset-0 -z-30">
        <FloatingLines
          linesGradient={["#6366f1", "#38bdf8", "#bef264"]}
          animationSpeed={1.2}
          interactive
          parallax
          parallaxStrength={0.3}
          topWavePosition={{ x: 10.0, y: 0.2, rotate: -0.4 }}
          middleWavePosition={{ x: 5.0, y: 0.5, rotate: 0.2 }}
        />
      </div>

      {/* Soft color glass overlay */}
      <div
        className="absolute inset-0 -z-20 bg-gradient-to-br 
        from-indigo-500/10 via-sky-400/10 to-yellow-300/10 
        backdrop-blur-sm"
      />

      {/* Header */}
      <motion.header
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative bg-white/60 backdrop-blur-2xl 
        border-b border-white/40 
        shadow-[0_8px_30px_rgba(0,0,0,0.08)]"
      >
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold text-indigo-700">
              AI Document Chat
            </h1>
            <p className="text-xs text-gray-600">
              Grounded answers from your PDFs
            </p>
            {uploadedPDFs.length > 0 && (
              <div className="mt-2">
                <p className="text-xs text-gray-500 mb-1">Uploaded PDFs:</p>
                <div className="flex flex-wrap gap-1">
                  {uploadedPDFs.map((pdf, idx) => (
                    <span
                      key={idx}
                      className="text-xs bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full"
                    >
                      {pdf}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div className="flex gap-4 text-sm">
            <button
              onClick={() => router.push("/upload")}
              className="text-indigo-600 hover:text-green-500 font-medium transition"
            >
              Upload
            </button>
            <button
              onClick={() => router.push("/")}
              className="text-gray-600 hover:text-indigo-600 font-medium transition"
            >
              Home
            </button>
          </div>
        </div>
      </motion.header>

      {/* Messages */}
      <main className="relative flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-4 py-10">
          {messages.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mx-auto max-w-xl text-center 
              bg-yellow-100/60 backdrop-blur-2xl 
              rounded-3xl border border-white/40 
              shadow-[0_10px_40px_rgba(254,240,138,0.35)] p-8"
            >
              <h2 className="text-xl font-semibold text-indigo-800 mb-2">
                Ask your documents
              </h2>
              <p className="text-sm text-gray-600">
                Press <span className="font-mono">Enter</span> to send ·{" "}
                <span className="font-mono">Shift+Enter</span> for new line
              </p>
            </motion.div>
          ) : (
            <div className="space-y-6">
              <AnimatePresence initial={false}>
                {messages.map((m, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                    className={`flex ${
                      m.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-3xl rounded-2xl px-6 py-4 ${
                        m.role === "user"
                          ? `
                          bg-indigo-500/80 backdrop-blur-xl text-white 
                          border border-white/30
                          shadow-[0_10px_40px_-10px_rgba(99,102,241,0.6)]
                          `
                          : `
                          bg-sky-100/70 backdrop-blur-xl text-gray-900 
                          border border-white/40
                          shadow-[0_8px_30px_rgba(0,0,0,0.08)]
                          `
                      }`}
                    >
                      <div className="whitespace-pre-wrap leading-relaxed">
                        {m.content}
                      </div>

                      {m.sources && (
                        <div className="mt-4 pt-3 border-t border-white/40">
                          <p className="text-xs text-gray-600 mb-2">Sources</p>
                          <div className="flex flex-wrap gap-2">
                            {m.sources.map((s, idx) => (
                              <span
                                key={idx}
                                className="text-xs 
                                bg-green-200/70 backdrop-blur-md 
                                text-green-900 
                                border border-white/40 
                                px-3 py-1 rounded-full"
                              >
                                {s}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {loading && (
                <div className="flex justify-start">
                  <div
                    className="bg-sky-100/70 backdrop-blur-xl 
                  rounded-2xl px-6 py-4 
                  border border-white/40 
                  shadow-md"
                  >
                    <div className="flex space-x-1">
                      <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" />
                      <span className="w-2 h-2 bg-green-400 rounded-full animate-bounce delay-150" />
                      <span className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce delay-300" />
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
      </main>

      {/* Input */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative bg-white/60 backdrop-blur-2xl 
        border-t border-white/40 
        shadow-[0_-8px_30px_rgba(0,0,0,0.06)]"
      >
        <div className="max-w-4xl mx-auto px-4 py-4 flex gap-4 items-end">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={1}
            placeholder="Ask a question…"
            className="flex-1 resize-none 
            bg-sky-50/70 backdrop-blur-xl 
            border border-white/50 
            rounded-2xl px-4 py-3 
            focus:ring-2 focus:ring-indigo-400 
            focus:outline-none max-h-[200px] 
            shadow-inner"
          />

          <motion.button
            onClick={handleSend}
            disabled={!input.trim() || loading}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 rounded-full
            bg-indigo-500 hover:bg-green-400
            disabled:bg-gray-400
            text-white font-semibold
            transition-colors duration-300
            shadow-[0_8px_30px_rgba(99,102,241,0.5)]
            flex items-center justify-center"
          >
            Send
          </motion.button>
        </div>
      </motion.footer>
    </div>
  );
}
