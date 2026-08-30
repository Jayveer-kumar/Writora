import { body , validationResult } from "express-validator";

// Validation rules 
export const signupValidationRules = [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Invalid email format'),
  body('password').isLength({ min: 6 }).withMessage('Password must be 6+ chars'),
  
];

export const loginValidationRules =[
  body('email').isEmail().withMessage('Invalid email format'),
  body('password').isLength({ min: 6 }).withMessage('Password must be 6+ chars')
]

// Middleware to check errors 
export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next(); // Sab sahi hai, controller pe jao
  }
  return res.status(400).json({ errors: errors.array() }); // Error hai to yahi se rok do
};
