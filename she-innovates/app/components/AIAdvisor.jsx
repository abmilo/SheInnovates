"use client"

import { useState } from "react"

export function AIAdvisor({ stage }) {
  const [input, setInput] = useState("")
  const [response, setResponse] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()
    // In a real application, this would call an API endpoint to get AI-generated advice
    setResponse(`Here's some advice for your ${stage} stage: ${input}`)
    setInput("")
  }

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-2xl font-semibold mb-4">AI Financial Advisor</h2>
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
          className="w-full bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-indigo-700 transition duration-300"
        >
          Get Advice
        </button>
      </form>
      {response && (
        <div className="mt-4 p-4 bg-gray-100 rounded-lg">
          <p>{response}</p>
        </div>
      )}
    </div>
  )
}

