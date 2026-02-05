
import { body } from 'express-validator';

export const carouselValidator = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required'),
  
  body('subtitle')
    .optional()
    .trim()
    .isString()
    .withMessage('Subtitle must be a string'),
    
  body('description')
    .optional()
    .trim()
    .isString()
    .withMessage('Description must be a string'),
    
  body('href')
    .optional()
    .trim()
    .isString()
    .withMessage('Href must be a valid string'),

  body('order')
    .optional()
    .isInt()
    .withMessage('Order must be an integer')
    .toInt(), // Sanitize to integer
];
