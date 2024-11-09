import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const Dashboard: React.FC = () => {
  const statsData = [
    { name: 'Total Vendors', value: 250, icon: '👥' },
    { name: 'Total Users', value: 1000, icon: '👤' },
    { name: 'Total Uploads', value: 3700, icon: '⬆️' },
    { name: 'Total Revenue', value: 250000, icon: '💰' },
  ];

  const pieChartData = [
    { name: 'Users', value: 1000 },
    { name: 'Vendors', value: 250 },
    { name: 'Posts', value: 3700 },
    { name: 'Revenue', value: 250000 },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <div className="bg-gray-200 p-6 h-screen overflow-auto">
      <h2 className="text-2xl font-bold mb-6 bg-white p-2 rounded shadow">DASHBOARD</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statsData.map((stat) => (
          <div key={stat.name} className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500">{stat.name}</p>
                <p className="text-2xl font-bold">
                  {stat.name === 'Total Revenue' ? `₹${stat.value}` : stat.value}
                </p>
              </div>
              <span className="text-3xl">{stat.icon}</span>
            </div>
          </div>
        ))}
      </div>
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-xl font-bold mb-4">Overview</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={pieChartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {pieChartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
          {pieChartData.map((item, index) => (
            <div key={item.name} className="flex items-center">
              <div
                className="w-4 h-4 rounded-full mr-2"
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              ></div>
              <span>{item.name}: {item.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;