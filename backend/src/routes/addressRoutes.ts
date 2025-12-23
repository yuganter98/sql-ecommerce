import express from 'express';
import { authenticateJWT } from '../middleware/authMiddleware';
import * as addressController from '../controllers/addressController';

const router = express.Router();

router.use(authenticateJWT);

router.get('/', addressController.getAddresses);
router.post('/', addressController.addAddress);
router.delete('/:id', addressController.deleteAddress);

export default router;
