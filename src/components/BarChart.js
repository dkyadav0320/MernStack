import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import axios from 'axios';

const BarChartComponent = ({ selectedMonth }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchBarChartData = async () => {
      const response = await axios.get(`http://localhost:5000/api/bar-chart`, {
        params: { month: selectedMonth }
      });
      const chartData = Object.entries(response.data).map(([range, count]) => ({ range, count }));
      setData(chartData);
    };
    fetchBarChartData();
  }, [selectedMonth]);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="range" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="count" fill="#8884d8" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default BarChartComponent;
