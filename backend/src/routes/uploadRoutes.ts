
import { Router } from 'express';
import { upload } from '../middleware/upload';

const router = Router();

router.post('/', upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    // Construct URL
    // In production, this should be the full domain or CDN URL
    // For local dev, we'll return a relative path or full localhost URL
    // Let's return the path that the static middleware will serve
    const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;

    res.json({
        message: 'File uploaded successfully',
        url: fileUrl
    });
});

export default router;
