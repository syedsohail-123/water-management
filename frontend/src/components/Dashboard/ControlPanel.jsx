import React from 'react';
import axios from 'axios';

const ControlPanel = ({ blockName, deviceType, deviceName, currentStatus }) => {
  const handleControl = async (action) => {
    try {
      await axios.post('http://localhost:8000/api/control', {
        block: blockName,
        device: deviceName,
        action: action
      });
      alert(`${deviceName} ${action} command sent`);
    } catch (error) {
      console.error('Control error:', error);
      alert('Failed to send command');
    }
  };

  if (deviceType === 'pump') {
    return (
      <div className="flex gap-2">
        <button
          onClick={() => handleControl('ON')}
          className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-sm"
          disabled={currentStatus === 'ON'}
        >
          Turn ON
        </button>
        <button
          onClick={() => handleControl('OFF')}
          className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
          disabled={currentStatus === 'OFF'}
        >
          Turn OFF
        </button>
      </div>
    );
  }

  if (deviceType === 'valve') {
    return (
      <div className="flex gap-2">
        <button
          onClick={() => handleControl('OPEN')}
          className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-sm"
          disabled={currentStatus === 'OPEN'}
        >
          Open
        </button>
        <button
          onClick={() => handleControl('CLOSE')}
          className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
          disabled={currentStatus === 'CLOSED'}
        >
          Close
        </button>
      </div>
    );
  }

  return null;
};

export default ControlPanel;
