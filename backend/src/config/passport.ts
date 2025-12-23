import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import * as userService from '../services/userService';

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID || 'PLACEHOLDER_ID',
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'PLACEHOLDER_SECRET',
            callbackURL: '/api/auth/google/callback',
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                const email = profile.emails?.[0].value;
                if (!email) return done(new Error('No email found'), undefined);

                // Check if user exists
                let user = await userService.getUserByEmail(email);

                if (!user) {
                    // Create new user
                    user = await userService.createUser({
                        email,
                        first_name: profile.name?.givenName || 'User',
                        last_name: profile.name?.familyName || '',
                        password_hash: 'GOOGLE_AUTH', // Placeholder for OAuth users
                    });
                }

                return done(null, user);
            } catch (error) {
                return done(error, undefined);
            }
        }
    )
);

export default passport;
