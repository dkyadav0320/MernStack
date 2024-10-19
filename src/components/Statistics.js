import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Statistics = ({ selectedMonth }) => {
  const [statistics, setStatistics] = useState({});

  useEffect(() => {
    const fetchStatistics = async () => {
      const response = await axios.get(`http://localhost:5000/api/statistics`, {
        params: { month: selectedMonth }
      });
      setStatistics(response.data);
    };
    fetchStatistics();
  }, [selectedMonth]);

  return (
    <div>
      <h3>Statistics</h3>
      <p>Total Sales Amount: ${statistics.totalSales}</p>
      <p>Total Sold Items: {statistics.totalSoldItems}</p>
      <p>Total Not Sold Items: {statistics.totalNotSoldItems}</p>
    </div>
  );
};

export default Statistics;
