"use client";
import { motion } from "framer-motion";
import { DollarSign, ArrowDownRight, PiggyBank } from 'lucide-react';

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
      className="bg-gradient-to-br from-blue-800 to-blue-900 rounded-2xl shadow-xl p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.02 }}
    >
      <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
        <DollarSign className="mr-2" />
        Financial Overview
      </h2>
      <div className="grid grid-cols-3 gap-6">
        {[
          { label: 'Income', value: data.income, icon: <ArrowDownRight /> },
          { label: 'Expenses', value: data.expenses, icon: <PiggyBank /> },
          { label: 'Savings', value: data.savings, icon: <DollarSign /> }
        ].map(({ label, value, icon }) => (
          <motion.div
            key={label}
            className="text-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="mb-2 text-blue-200 flex justify-center">{icon}</div>
            <p className="text-sm text-blue-200">{label}</p>
            <p className="text-3xl font-bold text-yellow-400">${value}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
