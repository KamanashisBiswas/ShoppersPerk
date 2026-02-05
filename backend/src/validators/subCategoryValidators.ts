import { body } from 'express-validator';

export const subCategoryValidator = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required'),
  
  body('parentCategory')
    .trim()
    .notEmpty()
    .withMessage('Parent Category is required')
    .isMongoId()
    .withMessage('Invalid Parent Category ID'),
  
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
