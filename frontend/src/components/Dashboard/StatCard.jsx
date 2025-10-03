import React from 'react';

const StatCard = ({ title, value, icon, color, trend }) => {
  return (
    <div className={`bg-gradient-to-br ${color} p-6 rounded-xl shadow-lg text-white`}>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm opacity-80">{title}</p>
          <h3 className="text-3xl font-bold mt-2">{value}</h3>
          {trend && (
            <p className="text-xs mt-2 opacity-90">
              {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}% from last hour
            </p>
          )}
        </div>
        <div className="text-4xl opacity-80">{icon}</div>
      </div>
    </div>
  );
};

export default StatCard;
