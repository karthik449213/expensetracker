const mongoose = require('mongoose');

const budgetSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: [
        'Food',
        'Transportation',
        'Entertainment',
        'Shopping',
        'Utilities',
        'Healthcare',
        'Education',
        'Other',
      ],
    },
    limit: {
      type: Number,
      required: true,
      min: 0,
    },
    spent: {
      type: Number,
      default: 0,
      min: 0,
    },
    month: {
      type: String, // Format: "2026-04"
      required: true,
    },
    alertThreshold: {
      type: Number,
      default: 80, // Alert at 80% of budget
      min: 0,
      max: 100,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Budget', budgetSchema);