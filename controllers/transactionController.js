const axios = require('axios');
const Transaction = require('../models/Transaction');

// Initialize database by fetching from third-party API
exports.initializeDatabase = async (req, res) => {
  try {
    const response = await axios.get(process.env.THIRD_PARTY_API);
    const transactions = response.data;

    // Clear existing data
    await Transaction.deleteMany({});

    // Seed new data
    await Transaction.insertMany(transactions);
    res.status(200).json({ message: 'Database initialized with seed data' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to initialize database', error });
  }
};

// List transactions with search and pagination
exports.listTransactions = async (req, res) => {
  const { month, search = '', page = 1, perPage = 10 } = req.query;

  // Convert month string to integer for comparison
  const startDate = new Date(`2023-${month}-01`);
  const endDate = new Date(`2023-${month}-31`);

  try {
    const query = {
      dateOfSale: { $gte: startDate, $lte: endDate },
      $or: [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { price: { $regex: search, $options: 'i' } }
      ]
    };

    const transactions = await Transaction.find(query)
      .skip((page - 1) * perPage)
      .limit(parseInt(perPage));
    const total = await Transaction.countDocuments(query);

    res.status(200).json({ transactions, total, page, perPage });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch transactions', error });
  }
};

// Get statistics for selected month
exports.getStatistics = async (req, res) => {
  const { month } = req.query;
  const startDate = new Date(`2023-${month}-01`);
  const endDate = new Date(`2023-${month}-31`);

  try {
    const totalSales = await Transaction.aggregate([
      { $match: { dateOfSale: { $gte: startDate, $lte: endDate }, sold: true } },
      { $group: { _id: null, totalAmount: { $sum: '$price' } } }
    ]);

    const totalSoldItems = await Transaction.countDocuments({
      dateOfSale: { $gte: startDate, $lte: endDate },
      sold: true
    });

    const totalNotSoldItems = await Transaction.countDocuments({
      dateOfSale: { $gte: startDate, $lte: endDate },
      sold: false
    });

    res.status(200).json({
      totalSales: totalSales[0]?.totalAmount || 0,
      totalSoldItems,
      totalNotSoldItems
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch statistics', error });
  }
};

// Get bar chart data for price ranges
exports.getBarChart = async (req, res) => {
  const { month } = req.query;
  const startDate = new Date(`2023-${month}-01`);
  const endDate = new Date(`2023-${month}-31`);

  const priceRanges = [
    { range: '0-100', min: 0, max: 100 },
    { range: '101-200', min: 101, max: 200 },
    { range: '201-300', min: 201, max: 300 },
    { range: '301-400', min: 301, max: 400 },
    { range: '401-500', min: 401, max: 500 },
    { range: '501-600', min: 501, max: 600 },
    { range: '601-700', min: 601, max: 700 },
    { range: '701-800', min: 701, max: 800 },
    { range: '801-900', min: 801, max: 900 },
    { range: '901-above', min: 901, max: Infinity }
  ];

  try {
    const barChart = {};

    for (let range of priceRanges) {
      const count = await Transaction.countDocuments({
        dateOfSale: { $gte: startDate, $lte: endDate },
        price: { $gte: range.min, $lt: range.max }
      });
      barChart[range.range] = count;
    }

    res.status(200).json(barChart);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch bar chart data', error });
  }
};

// Get pie chart data for categories
exports.getPieChart = async (req, res) => {
  const { month } = req.query;
  const startDate = new Date(`2023-${month}-01`);
  const endDate = new Date(`2023-${month}-31`);

  try {
    const pieChart = await Transaction.aggregate([
      { $match: { dateOfSale: { $gte: startDate, $lte: endDate } } },
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);

    res.status(200).json(pieChart);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch pie chart data', error });
  }
};

// Combined API for statistics, bar chart, and pie chart
exports.getCombinedData = async (req, res) => {
  try {
    const [statistics, barChart, pieChart] = await Promise.all([
      this.getStatistics(req, res),
      this.getBarChart(req, res),
      this.getPieChart(req, res)
    ]);

    res.status(200).json({ statistics, barChart, pieChart });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch combined data', error });
  }
};
