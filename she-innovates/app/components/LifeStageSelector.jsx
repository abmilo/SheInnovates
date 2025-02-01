export function LifeStageSelector({ stages, currentStage, onStageChange }) {
    return (
      <div className="flex justify-center">
        <select
          value={currentStage}
          onChange={(e) => onStageChange(e.target.value)}
          className="block w-full max-w-xs px-3 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
        >
          {stages.map((stage) => (
            <option key={stage.id} value={stage.id}>
              {stage.label}
            </option>
          ))}
        </select>
      </div>
    )
  }
  
  