import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';

const signInSchema = yup.object().shape({
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup
    .string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
});

const signUpSchema = yup.object().shape({
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup
    .string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
  username: yup
    .string()
    .min(3, 'Username must be at least 3 characters')
    .required('Username is required'),
  fullName: yup
    .string()
    .min(2, 'Full name must be at least 2 characters')
    .required('Full name is required'),
});

const AuthForm: React.FC = () => {
  const [isSignIn, setIsSignIn] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const { signIn, signUp } = useAuth();
  const { theme } = useTheme();

  const schema = isSignIn ? signInSchema : signUpSchema;
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const themeClasses = {
    light: 'bg-white text-gray-900 border-gray-200',
    dark: 'bg-gray-800 text-white border-gray-700',
    gray: 'bg-gray-200 text-gray-900 border-gray-300',
    chroma:
      'bg-gray-900/95 text-gray-100 border-gray-800/50 backdrop-blur-xl',
  };

  const inputClasses = {
    light: 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500',
    dark: 'bg-gray-700 border-gray-600 text-white placeholder-gray-400',
    gray: 'bg-gray-100 border-gray-400 text-gray-900 placeholder-gray-600',
    chroma:
      'bg-gray-800/50 border-gray-700/50 text-gray-100 placeholder-gray-400 backdrop-blur-sm',
  };

  const onSubmit = async (data: any) => {
    setLoading(true);
    setErrorMessage('');
    try {
      if (isSignIn) {
        await signIn(data.email, data.password);
      } else {
        await signUp(data.email, data.password, data.username, data.fullName);
      }
    } catch (error) {
      console.error('Auth error:', error);

      // Handle specific Supabase errors
      if (error instanceof Error) {
        const errorMessage = error.message.toLowerCase();

        if (
          errorMessage.includes('over_email_send_rate_limit') ||
          errorMessage.includes('rate limit')
        ) {
          setErrorMessage(
            'Too many requests. Please wait 40 seconds before trying again.'
          );
        } else if (errorMessage.includes('email not confirmed')) {
          setErrorMessage(
            'Please check your email and click the confirmation link to verify your account before signing in.'
          );
        } else if (errorMessage.includes('invalid login credentials')) {
          setErrorMessage('Invalid email or password. Please check your credentials.');
        } else if (errorMessage.includes('user already registered')) {
          setErrorMessage(
            'An account with this email already exists. Try signing in instead.'
          );
        } else if (errorMessage.includes('signup is disabled')) {
          setErrorMessage('Account registration is currently disabled.');
        } else if (
          errorMessage.includes('profile setup failed') ||
          errorMessage.includes('failed to create user profile')
        ) {
          setErrorMessage(
            'Account created successfully! Please check your email for confirmation, then sign in.'
          );
        } else {
          setErrorMessage('An error occurred. Please try again.');
        }
      } else {
        setErrorMessage('An unexpected error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsSignIn(!isSignIn);
    setErrorMessage('');
    reset();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`w-full max-w-md ${themeClasses[theme]} rounded-2xl shadow-2xl border backdrop-blur-lg bg-opacity-90`}
      >
        <div className="p-8">
          <div className="text-center mb-8">
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent"
            >
              SocialChat
            </motion.h1>
            <p className="mt-2 text-gray-600">
              {isSignIn ? 'Welcome back!' : 'Join the conversation'}
            </p>
          </div>

          {errorMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl"
            >
              <p className="text-sm text-red-600 text-center">{errorMessage}</p>
            </motion.div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  {...register('email')}
                  className={`${inputClasses[theme]} w-full pl-10 pr-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200`}
                  placeholder="Enter your email"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.email.message}
                </p>
              )}
            </div>

            {!isSignIn && (
              <>
                <div>
                  <label
                    htmlFor="username"
                    className="block text-sm font-medium mb-2"
                  >
                    Username
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      id="username"
                      type="text"
                      autoComplete="username"
                      {...register('username')}
                      className={`${inputClasses[theme]} w-full pl-10 pr-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200`}
                      placeholder="Choose a username"
                    />
                  </div>
                  {errors.username && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.username.message}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="fullName"
                    className="block text-sm font-medium mb-2"
                  >
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      id="fullName"
                      type="text"
                      autoComplete="name"
                      {...register('fullName')}
                      className={`${inputClasses[theme]} w-full pl-10 pr-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200`}
                      placeholder="Enter your full name"
                    />
                  </div>
                  {errors.fullName && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.fullName.message}
                    </p>
                  )}
                </div>
              </>
            )}

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium mb-2"
              >
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete={
                    isSignIn ? 'current-password' : 'new-password'
                  }
                  {...register('password')}
                  className={`${inputClasses[theme]} w-full pl-10 pr-12 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200`}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-xl font-medium hover:from-purple-700 hover:to-pink-700 transition-all duration-200 disabled:opacity-50"
            >
              {loading ? 'Loading...' : isSignIn ? 'Sign In' : 'Sign Up'}
            </motion.button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              {isSignIn
                ? "Don't have an account?"
                : 'Already have an account?'}
              <button
                onClick={toggleMode}
                className="ml-1 text-purple-600 hover:text-purple-800 font-medium"
              >
                {isSignIn ? 'Sign Up' : 'Sign In'}
              </button>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AuthForm;