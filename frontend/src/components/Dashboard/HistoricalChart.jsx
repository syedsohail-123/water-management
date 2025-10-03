import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import axios from 'axios';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const HistoricalChart = ({ blockName }) => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/history/${blockName}?limit=20`);
        const data = response.data.reverse();
        
        setChartData({
          labels: data.map(item => new Date(item.timestamp).toLocaleTimeString()),
          datasets: [
            {
              label: 'Tank 1',
              data: data.map(item => item.tank1),
              borderColor: 'rgb(59, 130, 246)',
              backgroundColor: 'rgba(59, 130, 246, 0.1)',
            },
            blockName === 'blockA' && {
              label: 'Tank 2',
              data: data.map(item => item.tank2),
              borderColor: 'rgb(16, 185, 129)',
              backgroundColor: 'rgba(16, 185, 129, 0.1)',
            }
          ].filter(Boolean)
        });
      } catch (error) {
        console.error('Error fetching history:', error);
      }
    };

    fetchHistory();
    const interval = setInterval(fetchHistory, 10000);
    return () => clearInterval(interval);
  }, [blockName]);

  if (!chartData) return <div>Loading chart...</div>;

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-2">Historical Data - {blockName}</h3>
      <Line data={chartData} options={{ responsive: true, maintainAspectRatio: true }} />
    </div>
  );
};

export default HistoricalChart;
