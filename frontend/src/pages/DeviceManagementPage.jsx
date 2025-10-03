import React, { useState } from 'react';

const DeviceManagementPage = () => {
  const [blocks, setBlocks] = useState(['blockA', 'blockB']);
  const [selectedBlock, setSelectedBlock] = useState('blockA');
  const [devices, setDevices] = useState({
    blockA: [
      { id: 'tank1', type: 'tank', name: 'Tank 1' },
      { id: 'tank2', type: 'tank', name: 'Tank 2' },
      { id: 'pump1', type: 'pump', name: 'Pump 1' },
      { id: 'pump2', type: 'pump', name: 'Pump 2' },
      { id: 'valve1', type: 'valve', name: 'Valve 1' },
      { id: 'valve2', type: 'valve', name: 'Valve 2' },
      { id: 'sump', type: 'sump', name: 'Sump' }
    ],
    blockB: [
      { id: 'tank1', type: 'tank', name: 'Tank 1' },
      { id: 'pump1', type: 'pump', name: 'Pump 1' },
      { id: 'valve1', type: 'valve', name: 'Valve 1' },
      { id: 'sump', type: 'sump', name: 'Sump' }
    ]
  });

  const [newBlock, setNewBlock] = useState('');
  const [newDevice, setNewDevice] = useState({ name: '', type: 'tank' });

  const addBlock = () => {
    if (newBlock && !blocks.includes(newBlock)) {
      setBlocks([...blocks, newBlock]);
      setDevices({ ...devices, [newBlock]: [] });
      setNewBlock('');
      alert(`Block ${newBlock} added successfully`);
    }
  };

  const addDevice = () => {
    if (newDevice.name) {
      const deviceId = newDevice.name.toLowerCase().replace(/\s+/g, '');
      const device = { id: deviceId, type: newDevice.type, name: newDevice.name };
      setDevices({
        ...devices,
        [selectedBlock]: [...(devices[selectedBlock] || []), device]
      });
      setNewDevice({ name: '', type: 'tank' });
      alert(`Device ${newDevice.name} added to ${selectedBlock}`);
    }
  };

  const removeDevice = (deviceId) => {
    if (window.confirm('Are you sure you want to remove this device?')) {
      setDevices({
        ...devices,
        [selectedBlock]: devices[selectedBlock].filter(d => d.id !== deviceId)
      });
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Device Management</h1>

      {/* Add New Block */}
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h2 className="text-xl font-semibold mb-4">Add New Block</h2>
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Block name (e.g., blockC)"
            value={newBlock}
            onChange={(e) => setNewBlock(e.target.value)}
            className="flex-1 p-2 border rounded"
          />
          <button
            onClick={addBlock}
            className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Add Block
          </button>
        </div>
      </div>

      {/* Block Selection */}
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h2 className="text-xl font-semibold mb-4">Select Block</h2>
        <div className="flex gap-2 flex-wrap">
          {blocks.map(block => (
            <button
              key={block}
              onClick={() => setSelectedBlock(block)}
              className={`px-4 py-2 rounded ${
                selectedBlock === block
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              {block}
            </button>
          ))}
        </div>
      </div>

      {/* Add Device to Selected Block */}
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h2 className="text-xl font-semibold mb-4">Add Device to {selectedBlock}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Device name"
            value={newDevice.name}
            onChange={(e) => setNewDevice({ ...newDevice, name: e.target.value })}
            className="p-2 border rounded"
          />
          <select
            value={newDevice.type}
            onChange={(e) => setNewDevice({ ...newDevice, type: e.target.value })}
            className="p-2 border rounded"
          >
            <option value="tank">Tank</option>
            <option value="pump">Pump</option>
            <option value="valve">Valve</option>
            <option value="sump">Sump</option>
          </select>
          <button
            onClick={addDevice}
            className="px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Add Device
          </button>
        </div>
      </div>

      {/* Device List */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Devices in {selectedBlock}</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left">Device Name</th>
                <th className="px-4 py-2 text-left">Type</th>
                <th className="px-4 py-2 text-left">ID</th>
                <th className="px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {(devices[selectedBlock] || []).map(device => (
                <tr key={device.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-2">{device.name}</td>
                  <td className="px-4 py-2">
                    <span className={`px-2 py-1 rounded text-xs ${
                      device.type === 'tank' ? 'bg-blue-100 text-blue-800' :
                      device.type === 'pump' ? 'bg-green-100 text-green-800' :
                      device.type === 'valve' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-purple-100 text-purple-800'
                    }`}>
                      {device.type}
                    </span>
                  </td>
                  <td className="px-4 py-2 font-mono text-sm">{device.id}</td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => removeDevice(device.id)}
                      className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DeviceManagementPage;
