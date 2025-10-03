import React from 'react';

const WaterLevelGauge = ({ level }) => {
  const getLevelColor = (level) => {
    if (level >= 80) return 'bg-green-500';
    if (level >= 50) return 'bg-yellow-500';
    if (level >= 20) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const getLevelText = (level) => {
    if (level >= 80) return 'Optimal';
    if (level >= 50) return 'Good';
    if (level >= 20) return 'Low';
    return 'Critical';
  };

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-48 h-48">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          {/* Background circle */}
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="8"
          />
          
          {/* Progress circle */}
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke={level >= 80 ? '#10b981' : level >= 50 ? '#f59e0b' : level >= 20 ? '#f97316' : '#ef4444'}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={`${(level / 100) * 283} 283`}
            transform="rotate(-90 50 50)"
          />
        </svg>
        
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-gray-800">{level}%</span>
          <span className={`text-sm font-medium ${getLevelColor(level).replace('bg-', 'text-')}`}>
            {getLevelText(level)}
          </span>
        </div>
      </div>
      
      <div className="mt-4 w-full">
        <div className="flex justify-between text-xs text-gray-600 mb-1">
          <span>0%</span>
          <span>25%</span>
          <span>50%</span>
          <span>75%</span>
          <span>100%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className={`h-2 rounded-full ${getLevelColor(level)}`}
            style={{ width: `${Math.min(level, 100)}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default WaterLevelGauge;