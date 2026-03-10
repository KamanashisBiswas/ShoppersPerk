import { body } from 'express-validator';

export const productValidator = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ max: 100 })
    .withMessage('Name must be less than 100 characters'),

  body('description')
    .trim()
    .notEmpty()
    .withMessage('Description is required')
    .isLength({ max: 2000 })
    .withMessage('Description must be less than 2000 characters'),

  body('category')
    .notEmpty()
    .withMessage('Category is required')
    .isMongoId()
    .withMessage('Invalid Category ID'),

  body('subCategory')
    .notEmpty()
    .withMessage('SubCategory is required')
    .isMongoId()
    .withMessage('Invalid SubCategory ID'),

  body('brand')
    .notEmpty()
    .withMessage('Brand is required')
    .isMongoId()
    .withMessage('Invalid Brand ID'),

  body('isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive must be a boolean')
    .toBoolean(),

  // Variation validation could be complex if sent as stringified JSON in FormData.
  // We will assume the controller parses it first or validation handles string check if using simple JSON body.
  // Since we use FormData for images, 'variation' might come as a JSON string.
  // Validation for variation is often easier done manually in controller or via custom validator if it's a string.
  // Here we assume it might be pre-parsed or we check existence.
  body('variation')
    .custom((value) => {
        if (!value) throw new Error('Variation is required');
        
        // If it's a string (FormData), we might need to rely on controller to parse it first
        // OR we can try to parse it here if express-validator runs after body-parser but before manual parsing? 
        // Typically with multer, req.body is populated. If it's a string, we validate it's valid JSON.
        
        let variations = value;
        if (typeof value === 'string') {
            try {
                variations = JSON.parse(value);
            } catch (e) {
                throw new Error('Invalid variation format');
            }
        }

        if (!Array.isArray(variations) || variations.length === 0) {
            throw new Error('At least one variation is required');
        }

        for (const v of variations) {
            if (!v.size && !v.color) {
                throw new Error('Each variation must have either size or color');
            }
            if (!v.basePrice || isNaN(Number(v.basePrice)) || Number(v.basePrice) < 0) {
                throw new Error('Valid basePrice is required for each variation');
            }
            if (!v.stock || isNaN(Number(v.stock)) || Number(v.stock) < 0) {
                throw new Error('Valid stock is required for each variation');
            }
        }
        return true;
    }),
];
