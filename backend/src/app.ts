import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import passport from './config/passport';
import routes from './routes/index';
import uploadRoutes from './routes/uploadRoutes';
import path from 'path';

import cookieParser from 'cookie-parser';

const app = express();

// Middleware
app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }
}));
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:5174'],
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());

// Static files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
app.use('/api', routes);
app.use('/api/upload', uploadRoutes);
import addressRoutes from './routes/addressRoutes';
app.use('/api/addresses', addressRoutes);

// Health Check
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

export default app;
