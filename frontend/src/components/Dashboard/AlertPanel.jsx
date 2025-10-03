import React, { useEffect, useState } from 'react';

const AlertPanel = ({ blockAData, blockBData }) => {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    const newAlerts = [];
    
    // Check Block A
    if (blockAData.tank1 < 20) newAlerts.push({ type: 'warning', message: 'Block A Tank 1 level low (<20%)' });
    if (blockAData.tank1 > 90) newAlerts.push({ type: 'danger', message: 'Block A Tank 1 level high (>90%)' });
    if (blockAData.tank2 < 20) newAlerts.push({ type: 'warning', message: 'Block A Tank 2 level low (<20%)' });
    if (blockAData.tank2 > 90) newAlerts.push({ type: 'danger', message: 'Block A Tank 2 level high (>90%)' });
    if (blockAData.sump < 15) newAlerts.push({ type: 'critical', message: 'Block A Sump level critical (<15%)' });
    
    // Check Block B
    if (blockBData.tank1 < 20) newAlerts.push({ type: 'warning', message: 'Block B Tank 1 level low (<20%)' });
    if (blockBData.tank1 > 90) newAlerts.push({ type: 'danger', message: 'Block B Tank 1 level high (>90%)' });
    if (blockBData.sump < 15) newAlerts.push({ type: 'critical', message: 'Block B Sump level critical (<15%)' });
    
    setAlerts(newAlerts);
  }, [blockAData, blockBData]);

  if (alerts.length === 0) return null;

  return (
    <div className="bg-white p-4 rounded-lg shadow mb-6">
      <h3 className="text-lg font-semibold mb-3 text-red-600">⚠️ Alerts</h3>
      <div className="space-y-2">
        {alerts.map((alert, index) => (
          <div
            key={index}
            className={`p-3 rounded ${
              alert.type === 'critical' ? 'bg-red-100 text-red-800' :
              alert.type === 'danger' ? 'bg-orange-100 text-orange-800' :
              'bg-yellow-100 text-yellow-800'
            }`}
          >
            {alert.message}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AlertPanel;
