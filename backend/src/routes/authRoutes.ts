import express from 'express';
import { registerUser, loginUser } from '../controllers/authController';
import { validateRequest } from '../middleware/validateRequest';
import { registerValidator, loginValidator } from '../validators/authValidators';

const router = express.Router();

router.post('/register', registerValidator, validateRequest, registerUser);
router.post('/login', loginValidator, validateRequest, loginUser);

export default router;
