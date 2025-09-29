import express from 'express';
import {
  registerNominee,
  loginNominee,
  getNomineeProfile,
  updateNomineeProfile,
  uploadDocument,
  getNomineeDocuments,
  deleteDocument,
  updateLinkedUserStatus,
  logoutNominee,
  upload
} from '../controllers/nomineeController.js';
import { verifyNomineeToken, requireVerifiedNominee, requireLinkedUserVerified } from '../middleware/nomineeMiddleware.js';

const router = express.Router();

// Public routes (no authentication required)
router.post('/register', registerNominee);
router.post('/login', loginNominee);

// Protected routes (authentication required)
router.use(verifyNomineeToken); // All routes below require nominee authentication

// Profile routes
router.get('/profile', getNomineeProfile);
router.put('/profile', updateNomineeProfile);

// Document routes
router.post('/documents/upload', upload.single('file'), uploadDocument);
router.get('/documents', getNomineeDocuments);
router.delete('/documents/:documentId', deleteDocument);

// Linked user status routes
router.put('/linked-user/status', updateLinkedUserStatus);

// Logout
router.post('/logout', logoutNominee);

export default router;
