import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn } from 'lucide-react';
import client from '../api/client';
import { useAuthStore } from '../store/authStore';
import { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { motion } from 'framer-motion';

const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormInputs = z.infer<typeof loginSchema>;

const Login = () => {
    const navigate = useNavigate();
    const login = useAuthStore((state) => state.login);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormInputs>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: LoginFormInputs) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await client.post('/auth/login', data);
            const { user } = response.data;
            login(user); // Token is set in HttpOnly cookie
            if (user.role === 'admin') {
                navigate('/admin');
            } else {
                navigate('/');
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Login failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#050511] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Ambient Background */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-indigo-500/10 blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-purple-500/10 blur-[120px]" />
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="max-w-md w-full space-y-8 relative z-10 backdrop-blur-xl bg-white/5 border border-white/10 p-8 sm:p-10 rounded-3xl shadow-2xl"
            >
                <div className="text-center">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
                        className="mx-auto h-16 w-16 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/30"
                    >
                        <LogIn className="h-8 w-8 text-white" />
                    </motion.div>
                    <h2 className="mt-6 text-3xl font-bold text-white tracking-tight">Welcome Back</h2>
                    <p className="mt-2 text-sm text-gray-400">
                        Don't have an account?{' '}
                        <Link to="/register" className="font-medium text-indigo-400 hover:text-indigo-300 transition-colors">
                            Sign up for free
                        </Link>
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
                    <div className="space-y-5">
                        <div className="group">
                            <label htmlFor="email" className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">
                                Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                autoComplete="email"
                                className="block w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all group-hover:bg-white/10"
                                placeholder="you@example.com"
                                {...register('email')}
                            />
                            {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
                        </div>

                        <div className="group">
                            <label htmlFor="password" className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">
                                Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                autoComplete="current-password"
                                className="block w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all group-hover:bg-white/10"
                                placeholder="••••••••"
                                {...register('password')}
                            />
                            {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>}
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <Link to="/forgot-password" className="text-sm font-medium text-indigo-400 hover:text-indigo-300 transition-colors">
                            Forgot your password?
                        </Link>
                    </div>

                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-red-500/10 border border-red-500/20 text-red-200 text-sm p-3 rounded-lg text-center"
                        >
                            {error}
                        </motion.div>
                    )}

                    <div className="space-y-4">
                        <motion.button
                            type="submit"
                            disabled={isLoading}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="relative w-full group overflow-hidden rounded-xl p-[1px] focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-[#050511]"
                        >
                            <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
                            <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-xl bg-slate-950 px-3 py-3.5 text-sm font-bold text-white backdrop-blur-3xl transition-all group-hover:bg-slate-950/80">
                                {isLoading ? 'Signing in...' : 'Sign in'}
                            </span>
                        </motion.button>

                        <div className="flex items-center gap-4 py-2">
                            <div className="h-px flex-1 bg-white/10"></div>
                            <span className="text-sm text-gray-500">Or continue with</span>
                            <div className="h-px flex-1 bg-white/10"></div>
                        </div>

                        <div className="flex justify-center w-full">
                            <GoogleLogin
                                theme="filled_black"
                                text="continue_with"
                                shape="rectangular"
                                width="350px" // Setting a fixed reasonable max-width or keeping 100% via CSS if possible, but 100% prop works too
                                onSuccess={async (credentialResponse) => {
                                    try {
                                        const response = await client.post('/auth/google', {
                                            token: credentialResponse.credential
                                        });
                                        const { user } = response.data;
                                        login(user);
                                        if (user.role === 'admin') {
                                            navigate('/admin');
                                        } else {
                                            navigate('/');
                                        }
                                    } catch (err) {
                                        console.error('Google login failed', err);
                                        setError('Google login failed');
                                    }
                                }}
                                onError={() => {
                                    setError('Google login failed');
                                }}
                            />
                        </div>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default Login;
