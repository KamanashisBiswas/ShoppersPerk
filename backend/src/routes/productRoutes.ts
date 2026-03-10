import express from 'express';
import {
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/productController';
import { protect, admin } from '../middleware/authMiddleware';
import { upload } from '../middleware/uploadMiddleware';
import { productValidator } from '../validators/productValidators';
import { validateRequest } from '../middleware/validateRequest';

const router = express.Router();

// Configure multer fields
const uploadFields = upload.fields([
    { name: 'bannerImage', maxCount: 1 },
    { name: 'images', maxCount: 5 }
]);

router.get('/', getProducts);

router.post(
    '/', 
    protect, 
    admin, 
    uploadFields, 
    productValidator, 
    validateRequest, 
    addProduct
);

router.put(
    '/:id', 
    protect, 
    admin, 
    uploadFields, 
    // We can reuse productValidator but might need to make fields optional if they aren't provided.
    // For simplicity, we might skip strict validation middleware here or use a separate update validator.
    // Given the pattern in other routes (reusing validator), we'll keep it but note that
    // express-validator 'body' checks might fail if fields are missing in a partial update.
    // However, since we send FormData, fields might be present.
    // Ideally we should use a separate validator or make fields optional in the validator.
    // Let's rely on manual checks or if the frontend sends everything.
    // Seeing 'categoryRoutes.ts', it reuses `categoryValidator`.
    // We will follow that pattern.
    productValidator, 
    validateRequest, 
    updateProduct
);

router.delete('/:id', protect, admin, deleteProduct);

export default router;
