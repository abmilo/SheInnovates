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
    setAdvice(""); // Reset advice while loading
    try {
      console.log("Calling AI Financial API...");
  
      const prompt = `You are an AI financial advisor. The user is at the "${stage}" stage of their financial journey. Provide personalized financial advice based on this question:\n\n"${input}". Additionally, remove any formatting like **, __, or --. Format the response as a list of bullet points.`;
  
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
      const aiResponse = data["candidates"][0]["content"]["parts"][0]["text"];
      console.log(aiResponse);
  
      // Clean up the response by removing Markdown bullet point symbols (e.g., "*")
      const bulletPoints = aiResponse
        .split("\n")
        .filter((line) => line.trim() !== "") // Remove any empty lines
        .map((line) => {
          // Remove the Markdown asterisk "*" and extra spaces before each line
          const cleanLine = line.replace(/^\s*\*+\s*/, '').trim();
          return `• ${cleanLine}`;
        });
  
      setAdvice(bulletPoints); // Set the cleaned-up bullet points as the advice
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
    className="bg-gradient-to-br from-blue-800 to-blue-900 rounded-2xl shadow-xl p-6 m-20"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    whileHover={{ scale: 1.01 }}
  >
    <h2 className="text-2xl font-bold text-white mb-6">AI Financial Advisor</h2>
    <form onSubmit={handleSubmit} className="space-y-4">
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Ask for financial advice..."
        className="w-full px-4 py-3 rounded-lg bg-white/10 text-white placeholder-blue-200 border-2 border-blue-700 focus:border-blue-500 focus:ring focus:ring-blue-500/20"
        rows="4"
      />
      <motion.button
        type="submit"
        className="w-full bg-yellow-400 hover:bg-yellow-500 text-blue-900 font-bold py-3 px-6 rounded-lg shadow-lg"
        disabled={isLoading}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {isLoading ? "Loading..." : "Get Advice"}
      </motion.button>
    </form>
    {response && (
      <motion.div
        className="mt-4 p-4 bg-white/10 rounded-lg text-white"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <p className="font-semibold">{response}</p>
        <ul>
          {advice && advice.length > 0 ? (
            advice.map((point, index) => (
              <li key={index} className="mb-2">
                {point}
              </li>
            ))
          ) : (
            <p>No advice available at the moment.</p>
          )}
        </ul>
      </motion.div>
    )}
  </motion.div>

);
  
}
