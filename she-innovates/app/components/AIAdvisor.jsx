"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export function AIAdvisor({ stage }) {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [advice, setAdvice] = useState("");
  const API_KEY = "AIzaSyAn4Pge_p1NfSdpJeL7a96EeRIjNbuoL_w";
  async function callFinancialAI() {
    if (!input.trim()) return;

    setIsLoading(true);
    setAdvice("");
    try {
      console.log("Calling AI Financial API...");

      const prompt = `You are an AI financial advisor. The user is at the "${stage}" stage of their financial journey. Provide personalized financial advice based on this question:\n\n"${input}". Additionally, remove any formatting like **, __, or --.`;

      const payload = {
        contents: [{ parts: [{ text: prompt }] }],
      };

      const API_URL =
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" +
        API_KEY;

      const res = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(`Error: ${error.error.message || res.status}`);
      }

      const data = await res.json();
      console.log(data["candidates"][0]["content"]["parts"][0]["text"]);
      setAdvice(data["candidates"][0]["content"]["parts"][0]["text"]);
    } catch (err) {
      console.error("Error calling OpenAI API:", err.message);
      setAdvice(
        "An error occurred while processing your request. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    setResponse(`Here's financial advice for your ${stage} stage:`);
    callFinancialAI();
  };

  return (
    <motion.div
      className="bg-pittBlue shadow rounded-lg p-6"
      initial={{ opacity: 0, y: 20 }} // Fade-in effect
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.02 }} // Slight hover scale-up effect
    >
      <h2 className="text-2xl font-semibold mb-4 text-white">
        AI Financial Advisor
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask for financial advice..."
          className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none"
          rows="4"
        />
        <motion.button
          type="submit"
          className="w-full bg-pittYellow text-white font-bold py-2 px-4 rounded-lg hover:bg-yellow-600 transition duration-300"
          disabled={isLoading}
          whileTap={{ scale: 0.95 }}
        >
          {isLoading ? "Loading..." : "Get Advice"}
        </motion.button>
      </form>
      {response && (
        <motion.div
          className="mt-4 p-4 bg-gray-100 rounded-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <p className="font-semibold">{response}</p>
          <p>{advice}</p>
        </motion.div>
      )}
    </motion.div>
  );
}
