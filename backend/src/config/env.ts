import dotenv from 'dotenv';
dotenv.config();

/**
 * Centralized, validated environment configuration.
 *
 * Importing this module fails fast at startup if a required secret is missing,
 * instead of silently falling back to an insecure default (e.g. a JWT signed
 * with the literal string "secret").
 */

const required = (name: string): string => {
    const value = process.env[name];
    if (!value || value.trim() === '') {
        throw new Error(
            `Missing required environment variable: ${name}. ` +
            `Set it in the backend .env file before starting the server.`
        );
    }
    return value;
};

const optional = (name: string, fallback: string): string => {
    const value = process.env[name];
    return value && value.trim() !== '' ? value : fallback;
};

export const env = {
    nodeEnv: optional('NODE_ENV', 'development'),
    isProduction: process.env.NODE_ENV === 'production',
    port: optional('PORT', '3000'),

    // Required secrets — the server refuses to start without these.
    jwtSecret: required('JWT_SECRET'),

    frontendUrl: optional('FRONTEND_URL', 'http://localhost:5173'),

    // Payment keys are optional at startup (payments can be disabled);
    // the payment controller rejects requests when they are not configured.
    razorpay: {
        keyId: process.env.RAZORPAY_KEY_ID,
        keySecret: process.env.RAZORPAY_KEY_SECRET,
    },
};

/**
 * Shared cookie options for the auth JWT. Kept in one place so the flags used
 * when setting and clearing the cookie never drift apart.
 */
export const authCookieOptions = {
    httpOnly: true,
    secure: env.isProduction,
    sameSite: (env.isProduction ? 'none' : 'lax') as 'none' | 'lax',
};
