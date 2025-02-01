"use client"

import { motion } from "framer-motion"
import { useState } from "react"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

const defaultOverviewData = {
  student: { income: 1200, expenses: 1000, savings: 200 },
  career: { income: 5000, expenses: 3500, savings: 1500 },
  family: { income: 8000, expenses: 6000, savings: 2000 },
  homeowner: { income: 10000, expenses: 7000, savings: 3000 },
  retirement: { income: 6000, expenses: 4000, savings: 2000 },
}

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
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-white">
          Financial Overview - {stage.charAt(0).toUpperCase() + stage.slice(1)} Stage
        </h2>
        <div className="flex items-center space-x-2">
          <Switch id="custom-mode" checked={isCustom} onCheckedChange={setIsCustom} />
          <Label htmlFor="custom-mode" className="text-white">
            Custom Mode
          </Label>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {Object.entries(data).map(([key, value]) => (
          <motion.div
            key={key}
            className="text-center bg-white bg-opacity-10 rounded-lg p-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <h3 className="text-lg font-medium capitalize text-white mb-2">{key}</h3>
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
            {key !== "income" && (
              <p className="text-sm text-white mt-2">({calculatePercentage(value, data.income)} of income)</p>
            )}
          </motion.div>
        ))}
      </div>
      {isCustom && (
        <div className="mt-4 flex justify-end">
          <Button onClick={resetCustomData} variant="secondary">
            Reset to Default
          </Button>
        </div>
      )}
      <motion.div
        className="mt-4 text-sm text-white opacity-80"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        {isCustom
          ? "Enter your income and expenses to see how it affects your savings. Savings are automatically calculated as Income - Expenses."
          : "This overview provides a snapshot of typical financial figures for the selected life stage. Switch to Custom Mode to input your own values."}
      </motion.div>
    </motion.div>
  )
}




{/*

"use client"

import { motion } from "framer-motion"
import { type FC, useState } from "react"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

type Stage = "student" | "career" | "family" | "homeowner" | "retirement"

interface FinancialData {
  income: number
  expenses: number
  savings: number
}

interface FinancialOverviewProps {
  stage: Stage
}

const defaultOverviewData: Record<Stage, FinancialData> = {
  student: { income: 1200, expenses: 1000, savings: 200 },
  career: { income: 5000, expenses: 3500, savings: 1500 },
  family: { income: 8000, expenses: 6000, savings: 2000 },
  homeowner: { income: 10000, expenses: 7000, savings: 3000 },
  retirement: { income: 6000, expenses: 4000, savings: 2000 },
}

export const FinancialOverview: FC<FinancialOverviewProps> = ({ stage }) => {
  const [isCustom, setIsCustom] = useState(false)
  const [customData, setCustomData] = useState<Record<Stage, FinancialData>>(
    () =>
      Object.fromEntries(Object.entries(defaultOverviewData).map(([key, value]) => [key, { ...value }])) as Record<
        Stage,
        FinancialData
      >,
  )

  const data = isCustom ? customData[stage] : defaultOverviewData[stage]

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount)
  }

  const calculatePercentage = (value: number, total: number) => {
    return total > 0 ? ((value / total) * 100).toFixed(1) + "%" : "0%"
  }

  const handleInputChange = (key: keyof FinancialData) => (e: React.ChangeEvent<HTMLInputElement>) => {
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
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-white">
          Financial Overview - {stage.charAt(0).toUpperCase() + stage.slice(1)} Stage
        </h2>
        <div className="flex items-center space-x-2">
          <Switch id="custom-mode" checked={isCustom} onCheckedChange={setIsCustom} />
          <Label htmlFor="custom-mode" className="text-white">
            Custom Mode
          </Label>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {Object.entries(data).map(([key, value]) => (
          <motion.div
            key={key}
            className="text-center bg-white bg-opacity-10 rounded-lg p-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <h3 className="text-lg font-medium capitalize text-white mb-2">{key}</h3>
            {isCustom ? (
              <input
                type="number"
                value={value}
                onChange={handleInputChange(key as keyof FinancialData)}
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
            {key !== "income" && (
              <p className="text-sm text-white mt-2">({calculatePercentage(value, data.income)} of income)</p>
            )}
          </motion.div>
        ))}
      </div>
      {isCustom && (
        <div className="mt-4 flex justify-end">
          <Button onClick={resetCustomData} variant="secondary">
            Reset to Default
          </Button>
        </div>
      )}
      <motion.div
        className="mt-4 text-sm text-white opacity-80"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        {isCustom
          ? "Enter your income and expenses to see how it affects your savings. Savings are automatically calculated as Income - Expenses."
          : "This overview provides a snapshot of typical financial figures for the selected life stage. Switch to Custom Mode to input your own values."}
      </motion.div>
    </motion.div>
  )
}

*/}