"use client";

import { useState } from "react";
import { LifeStageSelector } from "./components/LifeStageSelector";
import { FinancialOverview } from "./components/FinancialOverview";
import { GoalTracker } from "./components/GoalTracker";
import { AIAdvisor } from "./components/AIAdvisor";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
const lifeStages = [
  { id: "student", label: "Student" },
  { id: "career", label: "Career Start" },
  { id: "family", label: "Family Planning" },
  { id: "homeowner", label: "Homeownership" },
  { id: "retirement", label: "Retirement" },
];

export default function Dashboard() {
  const [currentStage, setCurrentStage] = useState("career");

  return (
    <div className="min-h-screen bg-blue-200">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <LifeStageSelector
            stages={lifeStages}
            currentStage={currentStage}
            onStageChange={setCurrentStage}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <FinancialOverview stage={currentStage} />
          <GoalTracker stage={currentStage} />
          <div className="md:col-span-2">
            <AIAdvisor stage={currentStage} />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
