const express = require('express');
const router = express.Router();
const {
  initializeDatabase,
  listTransactions,
  getStatistics,
  getBarChart,
  getPieChart,
  getCombinedData
} = require('../controllers/transactionController');

// Routes
router.get('/initialize', initializeDatabase);
router.get('/transactions', listTransactions);
router.get('/statistics', getStatistics);
router.get('/bar-chart', getBarChart);
router.get('/pie-chart', getPieChart);
router.get('/combined', getCombinedData);

module.exports = router;
