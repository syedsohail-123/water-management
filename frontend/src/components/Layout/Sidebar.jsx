import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <div className="w-64 bg-gray-800 text-white p-4">
      <h2 className="text-xl font-bold mb-4">Admin Dashboard</h2>
      <nav>
        <Link to="/dashboard" className="block py-2 px-4 hover:bg-gray-700 rounded">Dashboard</Link>
        <Link to="/users" className="block py-2 px-4 hover:bg-gray-700 rounded">Users</Link>
        <Link to="/devices" className="block py-2 px-4 hover:bg-gray-700 rounded">Device Management</Link>
      </nav>
    </div>
  );
};

export default Sidebar;