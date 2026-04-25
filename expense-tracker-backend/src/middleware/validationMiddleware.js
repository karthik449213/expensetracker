const {body,param,query,validationResult } =require('express-validator');


// this is the validation maidddleware logic
const handleValidationErrors=(req,res,next) =>{
    const errors =validationRet(req);
    if(!errors.isEmpty()){
        return res.status(400).json({
            success:false,
            message:'Validation Failed',
            errors:errors.array(),
        });

    }
    next();

};

//logic for expense validation rules
const validateCreateExpense = [
  body('amount')
    .isFloat({ min: 0.01, max: 999999.99 })
    .withMessage('Amount must be between 0.01 and 999,999.99'),
  body('category')
    .isIn(['Food', 'Transportation', 'Entertainment', 'Shopping', 'Utilities', 'Healthcare', 'Education', 'Other'])
    .withMessage('Invalid category'),
  body('date')
    .isISO8601()
    .withMessage('Invalid date format'),
  body('note')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Note cannot exceed 500 characters')
    .escape(),
  body('paymentMethod')
    .isIn(['Cash', 'Card', 'UPI', 'Bank Transfer', 'Other'])
    .withMessage('Invalid payment method'),
  body('isRecurring')
    .optional()
    .isBoolean()
    .withMessage('isRecurring must be boolean'),
];

module.exports = {
  validateCreateExpense,
  handleValidationErrors,
};