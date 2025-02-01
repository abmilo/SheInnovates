"use client";

import { motion } from "framer-motion";
import { Target } from 'lucide-react';

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
      className="bg-gradient-to-br from-blue-800 to-blue-900 rounded-2xl shadow-xl p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.02 }}
    >
      <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
        <Target className="mr-2" />
        Goal Tracker
      </h2>
      <div className="space-y-6">
        {goals.map((goal, index) => (
          <motion.div
            key={index}
            className="space-y-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="flex justify-between text-blue-200">
              <span>{goal.name}</span>
              <span>${goal.current}/${goal.target}</span>
            </div>
            <div className="h-2 bg-blue-700 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-yellow-400 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${(goal.current / goal.target) * 100}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
