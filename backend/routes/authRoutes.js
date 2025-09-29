import express from 'express';
import { register , login, logout , viewusers, getUserProfile } from '../controllers/authController.js';
import auth from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.get('/viewusers' , viewusers);
router.get('/profile', auth, getUserProfile);

export default router;