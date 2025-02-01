"use client";

import { motion } from "framer-motion";

export function FinancialOverview({ stage }) {
  const overviewData = {
    student: { income: 1200, expenses: 1000, savings: 200 },
    career: { income: 5000, expenses: 3500, savings: 1500 },
    family: { income: 8000, expenses: 6000, savings: 2000 },
    homeowner: { income: 10000, expenses: 7000, savings: 3000 },
    retirement: { income: 6000, expenses: 4000, savings: 2000 },
  };

  const data = overviewData[stage];

  return (
    <motion.div
      className="bg-gradient-to-r from-pittBlue to-blue-800 shadow rounded-lg p-6"
      initial={{ opacity: 0, y: 20 }} // Fade-in effect
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.02 }} // Slight hover scale-up effect
    >
      <h2 className="text-2xl font-semibold mb-4 text-white">
        Financial Overview
      </h2>
      <div className="grid grid-cols-3 gap-4">
        {Object.entries(data).map(([key, value]) => (
          <motion.div
            key={key}
            className="text-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <h3 className="text-lg font-medium capitalize text-white">{key}</h3>
            <motion.p
              className="text-3xl font-bold text-pittYellow"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              ${value}
            </motion.p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
