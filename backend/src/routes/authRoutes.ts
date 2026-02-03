import express from 'express';
import { registerUser, loginUser, forgotPassword, resetPassword } from '../controllers/authController';
import { validateRequest } from '../middleware/validateRequest';
import { registerValidator, loginValidator } from '../validators/authValidators';

const router = express.Router();

router.post('/register', registerValidator, validateRequest, registerUser);
router.post('/login', loginValidator, validateRequest, loginUser);
router.post('/forgotpassword', forgotPassword);
router.put('/resetpassword/:resettoken', resetPassword);

export default router;
