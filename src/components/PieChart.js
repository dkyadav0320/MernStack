import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import axios from 'axios';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const PieChartComponent = ({ selectedMonth }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchPieChartData = async () => {
      const response = await axios.get(`http://localhost:5000/api/pie-chart`, {
        params: { month: selectedMonth }
      });
      const chartData = response.data.map(item => ({ name: item._id, value: item.count }));
      setData(chartData);
    };
    fetchPieChartData();
  }, [selectedMonth]);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={100}
          fill="#8884d8"
          label
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default PieChartComponent;
