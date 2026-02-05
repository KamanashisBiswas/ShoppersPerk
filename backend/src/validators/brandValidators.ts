import { body } from 'express-validator';

export const brandValidator = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required'),
  
  body('description')
    .optional()
    .trim()
    .isString()
    .withMessage('Description must be a string'),

  body('isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive must be a boolean')
    .toBoolean(),
];
