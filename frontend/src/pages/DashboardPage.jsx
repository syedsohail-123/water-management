import React, { useState, useEffect } from 'react';
import axios from 'axios';
import HistoricalChart from '../components/Dashboard/HistoricalChart';
import AlertPanel from '../components/Dashboard/AlertPanel';
import StatCard from '../components/Dashboard/StatCard';
import DeviceStatusCard from '../components/Dashboard/DeviceStatusCard';

const DashboardPage = () => {
  const [blockAData, setBlockAData] = useState({
    tank1: 0, tank2: 0, pump1: 'OFF', pump2: 'OFF', valve1: 'CLOSED', valve2: 'CLOSED', sump: 0
  });
  const [blockBData, setBlockBData] = useState({
    tank1: 0, pump1: 'OFF', valve1: 'CLOSED', sump: 0
  });
  const [connected, setConnected] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/blocks');
        setBlockAData(response.data.blockA);
        setBlockBData(response.data.blockB);
        setConnected(true);
        setLastUpdate(new Date());
      } catch (error) {
        console.error('Error fetching data:', error);
        setConnected(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 2000);
    return () => clearInterval(interval);
  }, []);

  const blockADevices = [
    { id: 'tank1', name: 'Tank 1', type: 'tank', value: blockAData.tank1 },
    { id: 'tank2', name: 'Tank 2', type: 'tank', value: blockAData.tank2 },
    { id: 'pump1', name: 'Pump 1', type: 'pump', value: blockAData.pump1 },
    { id: 'pump2', name: 'Pump 2', type: 'pump', value: blockAData.pump2 },
    { id: 'valve1', name: 'Valve 1', type: 'valve', value: blockAData.valve1 },
    { id: 'valve2', name: 'Valve 2', type: 'valve', value: blockAData.valve2 },
    { id: 'sump', name: 'Sump', type: 'sump', value: blockAData.sump }
  ];

  const blockBDevices = [
    { id: 'tank1', name: 'Tank 1', type: 'tank', value: blockBData.tank1 },
    { id: 'pump1', name: 'Pump 1', type: 'pump', value: blockBData.pump1 },
    { id: 'valve1', name: 'Valve 1', type: 'valve', value: blockBData.valve1 },
    { id: 'sump', name: 'Sump', type: 'sump', value: blockBData.sump }
  ];

  const totalDevices = blockADevices.length + blockBDevices.length;
  const activeDevices = [
    ...blockADevices.filter(d => d.value === 'ON' || d.value === 'OPEN'),
    ...blockBDevices.filter(d => d.value === 'ON' || d.value === 'OPEN')
  ].length;
  const avgWaterLevel = Math.round(
    (blockAData.tank1 + blockAData.tank2 + blockBData.tank1) / 3
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">IoT Dashboard</h1>
            <p className="text-gray-600 mt-1">Real-time monitoring and control</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-xs text-gray-500">Last Update</p>
              <p className="text-sm font-semibold">{lastUpdate.toLocaleTimeString()}</p>
            </div>
            <div className={`px-4 py-2 rounded-full text-sm font-semibold ${
              connected ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              <span className={`inline-block w-2 h-2 rounded-full mr-2 ${
                connected ? 'bg-green-500 animate-pulse' : 'bg-red-500'
              }`}></span>
              {connected ? 'Connected' : 'Disconnected'}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <StatCard 
          title="Total Devices" 
          value={totalDevices} 
          icon="📊" 
          color="from-blue-500 to-blue-600"
        />
        <StatCard 
          title="Active Devices" 
          value={activeDevices} 
          icon="⚡" 
          color="from-green-500 to-green-600"
        />
        <StatCard 
          title="Avg Water Level" 
          value={`${avgWaterLevel}%`} 
          icon="💧" 
          color="from-cyan-500 to-cyan-600"
        />
        <StatCard 
          title="Total Blocks" 
          value="2" 
          icon="🏢" 
          color="from-purple-500 to-purple-600"
        />
      </div>

      {/* Alerts */}
      <AlertPanel blockAData={blockAData} blockBData={blockBData} />

      {/* Block A */}
      <div className="mb-8">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-8 bg-blue-500 rounded"></div>
            <h2 className="text-2xl font-bold text-gray-800">Block A</h2>
            <span className="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
              {blockADevices.length} devices
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {blockADevices.map(device => (
              <DeviceStatusCard key={device.id} device={device} blockName="blockA" />
            ))}
          </div>
        </div>
      </div>

      {/* Block B */}
      <div className="mb-8">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-8 bg-green-500 rounded"></div>
            <h2 className="text-2xl font-bold text-gray-800">Block B</h2>
            <span className="text-sm bg-green-100 text-green-800 px-3 py-1 rounded-full">
              {blockBDevices.length} devices
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {blockBDevices.map(device => (
              <DeviceStatusCard key={device.id} device={device} blockName="blockB" />
            ))}
          </div>
        </div>
      </div>

      {/* Historical Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <HistoricalChart blockName="blockA" />
        <HistoricalChart blockName="blockB" />
      </div>
    </div>
  );
};

export default DashboardPage;
