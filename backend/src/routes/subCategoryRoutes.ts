import express from 'express';
import {
  getSubCategories,
  addSubCategory,
  updateSubCategory,
  deleteSubCategory,
} from '../controllers/subCategoryController';
import { protect, admin } from '../middleware/authMiddleware';
import { upload } from '../middleware/uploadMiddleware';
import { subCategoryValidator } from '../validators/subCategoryValidators';
import { validateRequest } from '../middleware/validateRequest';

const router = express.Router();

router.get('/', getSubCategories);
router.post('/', protect, admin, upload.single('image'), subCategoryValidator, validateRequest, addSubCategory);
router.put('/:id', protect, admin, upload.single('image'), subCategoryValidator, validateRequest, updateSubCategory);
router.delete('/:id', protect, admin, deleteSubCategory);

export default router;
