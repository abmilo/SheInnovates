"use client"

import { motion } from "framer-motion"
import { useState } from "react"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { DollarSign, ArrowDownRight, PiggyBank } from 'lucide-react';

const defaultOverviewData = {
  student: { income: 1200, expenses: 1000, savings: 200 },
  career: { income: 5000, expenses: 3500, savings: 1500 },
  family: { income: 8000, expenses: 6000, savings: 2000 },
  homeowner: { income: 10000, expenses: 7000, savings: 3000 },
  retirement: { income: 6000, expenses: 4000, savings: 2000 },
}

// Toggle Switch Component
const ToggleSwitch = ({ isChecked, onToggle }) => {
  return (
    <label className="relative inline-flex items-center cursor-pointer">
      <input type="checkbox" checked={isChecked} onChange={onToggle} className="sr-only peer" />
      <div className="w-14 h-8 bg-gray-400 rounded-full peer-checked:bg-blue-600 transition-all relative">
        <div
          className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform duration-300 ${
            isChecked ? "translate-x-6" : "translate-x-0"
          }`}
        ></div>
      </div>
    </label>
  );
};

export const FinancialOverview = ({ stage }) => {
  const [isCustom, setIsCustom] = useState(false)
  const [customData, setCustomData] = useState(() =>
    Object.fromEntries(Object.entries(defaultOverviewData).map(([key, value]) => [key, { ...value }]))
  )

  const data = isCustom ? customData[stage] : defaultOverviewData[stage]

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount)
  }

  const calculatePercentage = (value, total) => {
    return total > 0 ? ((value / total) * 100).toFixed(1) + "%" : "0%"
  }

  const handleInputChange = (key) => (e) => {
    const value = Number.parseFloat(e.target.value) || 0
    setCustomData((prevData) => ({
      ...prevData,
      [stage]: {
        ...prevData[stage],
        [key]: value,
        savings: key === "expenses" ? prevData[stage].income - value : value - prevData[stage].expenses,
      },
    }))
  }

  const resetCustomData = () => {
    setCustomData((prevData) => ({
      ...prevData,
      [stage]: { ...defaultOverviewData[stage] },
    }))
  }

  return (
    <motion.div
      className="bg-gradient-to-r from-blue-600 to-blue-800 shadow-lg rounded-lg p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.02 }}
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-white flex items-center">
          Financial Overview - {stage.charAt(0).toUpperCase() + stage.slice(1)} Stage
        </h2>
      </div>

      {/* Custom Mode Toggle */}
      <div className="flex items-center space-x-3 mb-4">
        <ToggleSwitch isChecked={isCustom} onToggle={() => setIsCustom(!isCustom)} />
        <span className="text-lg text-white">{isCustom ? "Custom Mode: ON" : "Custom Mode: OFF"}</span>
      </div>

      {/* Financial Overview Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Income', value: data.income, icon: <ArrowDownRight />, key: "income" },
          { label: 'Expenses', value: data.expenses, icon: <DollarSign />, key: "expenses" },
          { label: 'Savings', value: data.savings, icon: <PiggyBank />, key: "savings" }
        ].map(({ label, value, icon, key }) => (
          <motion.div
            key={key}
            className="text-center bg-white bg-opacity-10 rounded-lg p-4 flex flex-col items-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <div className="flex items-center space-x-2 text-white mb-2">
              {icon}
              <h3 className="text-lg font-medium capitalize">{label}</h3>
            </div>
            {isCustom ? (
              <input
                type="number"
                value={value}
                onChange={handleInputChange(key)}
                className="w-full p-2 rounded bg-white bg-opacity-20 text-white text-center"
                disabled={key === "savings"}
                placeholder="Enter amount"
              />
            ) : (
              <motion.p
                className="text-3xl font-bold text-yellow-300"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                {formatCurrency(value)}
              </motion.p>
            )}
          </motion.div>
        ))}
      </div>

      {/* Reset Button */}
      {isCustom && (
        <div className="mt-4 text-center">
          <Button onClick={resetCustomData} className="bg-white text-blue-700 font-bold px-4 py-2 rounded-lg">
            Reset to Default
          </Button>
        </div>
      )}
    </motion.div>
  )
}