const Expense = require('../models/Expense');

/**
 * Create a new expense
 * POST /api/expenses
 */
const createExpense = async (req, res, next) => {
  try {
    const { amount, category, date, note, paymentMethod, isRecurring } = req.body;

    // Validate required fields
    if (!amount || !category || !date) {
      return res.status(400).json({
        success: false,
        message: 'Please provide amount, category, and date',
      });
    }

    // Validate amount
    if (isNaN(amount) || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Amount must be a positive number',
      });
    }

    // Create expense
    const expense = new Expense({
      userId: req.userId,
      amount,
      category,
      date: new Date(date),
      note,
      paymentMethod,
      isRecurring,
    });

    await expense.save();

    res.status(201).json({
      success: true,
      message: 'Expense created successfully',
      expense,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all expenses for logged-in user
 * GET /api/expenses?category=Food&startDate=2024-01-01&endDate=2024-01-31
 */
const getExpenses = async (req, res, next) => {
  try {
    const { category, startDate, endDate, page = 1, limit = 10 } = req.query;

    // Build filter query
    const filter = { userId: req.userId };

    if (category) {
      filter.category = category;
    }

    if (startDate || endDate) {
      filter.date = {};
      if (startDate) {
        filter.date.$gte = new Date(startDate);
      }
      if (endDate) {
        filter.date.$lte = new Date(endDate);
      }
    }

    // Calculate pagination
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    // Get total count for pagination
    const total = await Expense.countDocuments(filter);

    // Get expenses
    const expenses = await Expense.find(filter)
      .sort({ date: -1 })
      .skip(skip)
      .limit(limitNum);

    res.status(200).json({
      success: true,
      total,
      page: pageNum,
      limit: limitNum,
      pages: Math.ceil(total / limitNum),
      expenses,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get single expense by ID
 * GET /api/expenses/:id
 */
const getExpenseById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const expense = await Expense.findOne({
      _id: id,
      userId: req.userId,
    });

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: 'Expense not found',
      });
    }

    res.status(200).json({
      success: true,
      expense,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update expense
 * PUT /api/expenses/:id
 */
const updateExpense = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { amount, category, date, note, paymentMethod, isRecurring } = req.body;

    // Validate amount if provided
    if (amount !== undefined && (isNaN(amount) || amount <= 0)) {
      return res.status(400).json({
        success: false,
        message: 'Amount must be a positive number',
      });
    }

    // Find and update expense
    const expense = await Expense.findOneAndUpdate(
      { _id: id, userId: req.userId },
      {
        ...(amount !== undefined && { amount }),
        ...(category && { category }),
        ...(date && { date: new Date(date) }),
        ...(note !== undefined && { note }),
        ...(paymentMethod && { paymentMethod }),
        ...(isRecurring !== undefined && { isRecurring }),
      },
      { new: true, runValidators: true }
    );

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: 'Expense not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Expense updated successfully',
      expense,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete expense
 * DELETE /api/expenses/:id
 */
const deleteExpense = async (req, res, next) => {
  try {
    const { id } = req.params;

    const expense = await Expense.findOneAndDelete({
      _id: id,
      userId: req.userId,
    });

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: 'Expense not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Expense deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get expense summary/dashboard
 * GET /api/expenses/summary/dashboard
 */
const getExpenseSummary = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;

    // Build date filter
    const dateFilter = { userId: req.userId };
    if (startDate || endDate) {
      dateFilter.date = {};
      if (startDate) {
        dateFilter.date.$gte = new Date(startDate);
      }
      if (endDate) {
        dateFilter.date.$lte = new Date(endDate);
      }
    }

    // Get total expenses
    const allExpenses = await Expense.find(dateFilter);
    const totalExpenses = allExpenses.reduce((sum, exp) => sum + exp.amount, 0);

    // Get category-wise aggregation
    const categoryWise = await Expense.aggregate([
      {
        $match: dateFilter,
      },
      {
        $group: {
          _id: '$category',
          total: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { total: -1 },
      },
    ]);

    // Get monthly summary
    const monthlySummary = await Expense.aggregate([
      {
        $match: dateFilter,
      },
      {
        $group: {
          _id: {
            year: { $year: '$date' },
            month: { $month: '$date' },
          },
          total: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { '_id.year': -1, '_id.month': -1 },
      },
    ]);

    // Get top categories
    const topCategories = categoryWise.slice(0, 5);

    res.status(200).json({
      success: true,
      summary: {
        totalExpenses,
        totalTransactions: allExpenses.length,
        categoryWise,
        topCategories,
        monthlySummary,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createExpense,
  getExpenses,
  getExpenseById,
  updateExpense,
  deleteExpense,
  getExpenseSummary,
};
