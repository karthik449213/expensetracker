const express = require('express');
const {
  createExpense,
  getExpenses,
  getExpenseById,
  updateExpense,
  deleteExpense,
  getExpenseSummary,
} = require('../controllers/expenseController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

/**
 * @route   GET /api/expenses/summary/dashboard
 * @desc    Get expense summary and dashboard data
 * @access  Private
 * @query   { startDate, endDate }
 */
router.get('/summary/dashboard', getExpenseSummary);

/**
 * @route   POST /api/expenses
 * @desc    Create a new expense
 * @access  Private
 * @body    { amount, category, date, note, paymentMethod, isRecurring }
 */
router.post('/', createExpense);

/**
 * @route   GET /api/expenses
 * @desc    Get all expenses for logged-in user
 * @access  Private
 * @query   { category, startDate, endDate, page, limit }
 */
router.get('/', getExpenses);

/**
 * @route   GET /api/expenses/:id
 * @desc    Get single expense by ID
 * @access  Private
 * @param   { id }
 */
router.get('/:id', getExpenseById);

/**
 * @route   PUT /api/expenses/:id
 * @desc    Update expense
 * @access  Private
 * @param   { id }
 * @body    { amount, category, date, note, paymentMethod, isRecurring }
 */
router.put('/:id', updateExpense);

/**
 * @route   DELETE /api/expenses/:id
 * @desc    Delete expense
 * @access  Private
 * @param   { id }
 */
router.delete('/:id', deleteExpense);

module.exports = router;
