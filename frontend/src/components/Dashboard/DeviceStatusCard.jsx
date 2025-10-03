import React from 'react';
import ControlPanel from './ControlPanel';

const DeviceStatusCard = ({ device, blockName }) => {
  const getStatusColor = (status, type) => {
    if (type === 'tank' || type === 'sump') {
      if (status < 20) return 'text-red-600';
      if (status < 50) return 'text-yellow-600';
      return 'text-green-600';
    }
    return status === 'ON' || status === 'OPEN' ? 'text-green-600' : 'text-gray-600';
  };

  const getIcon = (type) => {
    switch(type) {
      case 'tank': return '🚰';
      case 'pump': return '⚙️';
      case 'valve': return '🔧';
      case 'sump': return '💧';
      default: return '📦';
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-xl transition-shadow border-l-4 border-blue-500">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{getIcon(device.type)}</span>
          <h4 className="font-semibold text-gray-800">{device.name}</h4>
        </div>
        <span className="text-xs bg-gray-100 px-2 py-1 rounded">{device.type}</span>
      </div>
      
      <div className={`text-2xl font-bold mb-2 ${getStatusColor(device.value, device.type)}`}>
        {device.type === 'tank' || device.type === 'sump' ? `${device.value}%` : device.value}
      </div>

      {(device.type === 'pump' || device.type === 'valve') && (
        <ControlPanel 
          blockName={blockName} 
          deviceType={device.type} 
          deviceName={device.id} 
          currentStatus={device.value} 
        />
      )}

      {(device.type === 'tank' || device.type === 'sump') && (
        <div className="mt-2">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full ${
                device.value < 20 ? 'bg-red-500' :
                device.value < 50 ? 'bg-yellow-500' : 'bg-green-500'
              }`}
              style={{ width: `${device.value}%` }}
            ></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeviceStatusCard;
