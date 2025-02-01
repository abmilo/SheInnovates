"use client";

import { motion } from "framer-motion";

export function GoalTracker({ stage }) {
  const goalData = {
    student: [
      { name: "Emergency Fund", target: 1000, current: 500 },
      { name: "Textbooks", target: 500, current: 300 },
    ],
    career: [
      { name: "Down Payment", target: 20000, current: 5000 },
      { name: "Professional Development", target: 2000, current: 1500 },
    ],
    family: [
      { name: "College Fund", target: 50000, current: 10000 },
      { name: "Family Vacation", target: 5000, current: 2000 },
    ],
    homeowner: [
      { name: "Home Renovation", target: 30000, current: 15000 },
      { name: "Property Taxes", target: 5000, current: 4000 },
    ],
    retirement: [
      { name: "Retirement Fund", target: 1000000, current: 500000 },
      { name: "Travel Fund", target: 50000, current: 30000 },
    ],
  };

  const goals = goalData[stage];

  return (
    <motion.div
      className="bg-gradient-to-r from-blue-800 to-pittBlue shadow rounded-lg p-6"
      initial={{ opacity: 0, y: 20 }} // Fade-in effect
      animate={{ opacity: 1, y: 0 }} //
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.02 }} // Slight hover scale-up effect
    >
      <h2 className="text-2xl font-semibold mb-4 text-white">Goal Tracker</h2>
      <div className="space-y-4">
        {goals.map(
          (
            goal,
            index // map through goal
          ) => (
            <motion.div
              key={index}
              className="border-b pb-4 last:border-b-0"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <h3 className="text-lg font-medium text-pittYellow">
                {goal.name}
              </h3>
              <motion.p
                className="text-sm text-pittYellow"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                ${goal.current.toLocaleString()} / $
                {goal.target.toLocaleString()}
              </motion.p>

              <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-pittYellow rounded-full"
                  initial={{ width: "0%" }}
                  animate={{ width: `${(goal.current / goal.target) * 100}%` }}
                  transition={{ duration: 0.7, ease: "easeOut" }}
                ></motion.div>
              </div>
            </motion.div>
          )
        )}
      </div>
    </motion.div>
  );
}
