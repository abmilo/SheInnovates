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
    <div className="bg-pittBlue shadow rounded-lg p-6">
      <h2 className="text-2xl font-semibold mb-4 text-white">
        Financial Overview
      </h2>
      <div className="grid grid-cols-3 gap-4">
        {Object.entries(data).map(([key, value]) => (
          <div key={key} className="text-center">
            <h3 className="text-lg font-medium capitalize text-white">{key}</h3>
            <p className="text-3xl font-bold text-pittYellow">${value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
