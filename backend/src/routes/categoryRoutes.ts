import express from 'express';
import {
  getCategories,
  addCategory,
  updateCategory,
  deleteCategory,
} from '../controllers/categoryController';
import { protect, admin } from '../middleware/authMiddleware';
import { upload } from '../middleware/uploadMiddleware';
import { categoryValidator } from '../validators/categoryValidators';
import { validateRequest } from '../middleware/validateRequest';

const router = express.Router();

router.get('/', getCategories);
router.post('/', protect, admin, upload.single('image'), categoryValidator, validateRequest, addCategory);
router.put('/:id', protect, admin, upload.single('image'), categoryValidator, validateRequest, updateCategory);
router.delete('/:id', protect, admin, deleteCategory);

export default router;
