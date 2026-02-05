
import express from 'express';
import {
  getCarouselItems,
  addCarouselItem,
  updateCarouselItem,
  deleteCarouselItem,
} from '../controllers/carouselController';
import { protect, admin } from '../middleware/authMiddleware';

import { upload } from '../middleware/uploadMiddleware';
import { carouselValidator } from '../validators/carouselValidators';
import { validateRequest } from '../middleware/validateRequest';

const router = express.Router();

router.get('/', getCarouselItems);
router.post('/', protect, admin, upload.single('image'), carouselValidator, validateRequest, addCarouselItem); // Protected: Ops/Admin
router.put('/:id', protect, admin, upload.single('image'), carouselValidator, validateRequest, updateCarouselItem);
router.delete('/:id', protect, admin, deleteCarouselItem);

export default router;
