import { Router } from 'express';
import { upload } from '../middleware/upload';
import { authenticateJWT, isAdmin } from '../middleware/authMiddleware';

const router = Router();

// Only authenticated admins may upload images (used by the product admin panel).
router.post('/', authenticateJWT, isAdmin, upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    // In production this should point at the public domain or a CDN URL.
    const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;

    res.json({
        message: 'File uploaded successfully',
        url: fileUrl
    });
});

export default router;
