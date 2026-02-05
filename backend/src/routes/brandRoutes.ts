import express from 'express';
import {
  getBrands,
  addBrand,
  updateBrand,
  deleteBrand,
} from '../controllers/brandController';
import { protect, admin } from '../middleware/authMiddleware';
import { upload } from '../middleware/uploadMiddleware';
import { brandValidator } from '../validators/brandValidators';
import { validateRequest } from '../middleware/validateRequest';

const router = express.Router();

router.get('/', getBrands);
router.post('/', protect, admin, upload.single('image'), brandValidator, validateRequest, addBrand);
router.put('/:id', protect, admin, upload.single('image'), brandValidator, validateRequest, updateBrand);
router.delete('/:id', protect, admin, deleteBrand);

export default router;
