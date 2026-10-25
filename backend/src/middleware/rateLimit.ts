import { Request, Response, NextFunction } from 'express';

/**
 * Minimal in-memory, fixed-window rate limiter.
 *
 * Deliberately dependency-free. Because state lives in process memory it is
 * per-instance only — fine for this app, but a multi-instance deployment should
 * swap in a shared store (e.g. Redis via `express-rate-limit`).
 */
interface Bucket {
    count: number;
    resetAt: number;
}

export const rateLimit = (options: { windowMs: number; max: number; message?: string }) => {
    const { windowMs, max, message = 'Too many requests, please try again later.' } = options;
    const hits = new Map<string, Bucket>();

    // Drop expired buckets periodically so the map cannot grow unbounded.
    const sweep = setInterval(() => {
        const now = Date.now();
        for (const [key, bucket] of hits) {
            if (bucket.resetAt <= now) hits.delete(key);
        }
    }, windowMs);
    sweep.unref?.();

    return (req: Request, res: Response, next: NextFunction) => {
        const key = req.ip || req.socket.remoteAddress || 'unknown';
        const now = Date.now();
        const bucket = hits.get(key);

        if (!bucket || bucket.resetAt <= now) {
            hits.set(key, { count: 1, resetAt: now + windowMs });
            return next();
        }

        bucket.count += 1;
        if (bucket.count > max) {
            res.setHeader('Retry-After', String(Math.ceil((bucket.resetAt - now) / 1000)));
            return res.status(429).json({ message });
        }
        next();
    };
};
