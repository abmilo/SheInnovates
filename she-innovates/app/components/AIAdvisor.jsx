"use client";

import { useState } from "react";

export function AIAdvisor({ stage }) {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [advice, setAdvice] = useState("");

  const GEMINI_API_KEY = "AIzaSyAn4Pge_p1NfSdpJeL7a96EeRIjNbuoL_w";

  async function callFinancialAI() {
    if (!input.trim()) return;

    setIsLoading(true);
    setAdvice(""); // this clears previous response
    try {
      console.log("Calling AI Financial API...");

      const prompt = `You are an AI financial advisor. The user is at the "${stage}" stage of their financial journey. Provide personalized financial advice based on this question:\n\n"${input}. Aditionally remove any formatting for example: bold, italics, underline, that includefs **, __, or --.`;

      const payload = {
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
      };

      const API_URL =
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" +
        GEMINI_API_KEY;

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
      const aiResponse =
        data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        "No advice available.";
      setAdvice(aiResponse);
    } catch (err) {
      console.error("Error calling AI API:", err.message);
      setAdvice("An error occurred while fetching advice. Please try again.");
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
    <div className="bg-pittBlue shadow rounded-lg p-6">
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
        <button
          type="submit"
          className="w-full bg-pittYellow text-white font-bold py-2 px-4 rounded-lg hover:bg-pittBlue transition duration-300"
          disabled={isLoading}
        >
          {isLoading ? "Loading..." : "Get Advice"}
        </button>
      </form>
      {response && (
        <div className="mt-4 p-4 bg-gray-100 rounded-lg">
          <p className="font-semibold">{response}</p>
          <p>{advice}</p>
        </div>
      )}
    </div>
  );
}
