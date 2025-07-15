import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { BookOpenIcon } from './icons/BookOpenIcon';
import { View } from '../types';

interface LoginPageProps {
  setView: React.Dispatch<React.SetStateAction<View>>;
}

const LoginPage: React.FC<LoginPageProps> = ({ setView }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
    } else {
      setView('user'); // On successful login, App.tsx will re-render and show user view.
    }
    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 p-10 bg-gray-800 rounded-2xl shadow-2xl shadow-purple-500/20 animate-fade-in">
        <div>
          <BookOpenIcon className="mx-auto h-12 w-auto text-purple-400"/>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-400">
            Need an account?{' '}
            <button onClick={() => setView('signup')} className="font-medium text-purple-400 hover:text-purple-300">
              Sign Up
            </button>
          </p>
        </div>
        
        <form className="space-y-6" onSubmit={handleLogin}>
          <div className="rounded-md shadow-sm">
            <div className="mb-4">
              <label htmlFor="email-address" className="sr-only">Email address</label>
              <input
                id="email-address" name="email" type="email" autoComplete="email" required
                value={email} onChange={(e) => setEmail(e.target.value)}
                className="appearance-none relative block w-full px-3 py-3 border border-gray-700 bg-gray-900 text-white placeholder-gray-500 focus:outline-none focus:ring-purple-500 focus:border-purple-500 focus:z-10 sm:text-sm rounded-md"
                placeholder="Email address"
              />
            </div>
            <div>
              <label htmlFor="password-input" className="sr-only">Password</label>
              <input
                id="password-input" name="password" type="password" autoComplete="current-password" required
                value={password} onChange={(e) => setPassword(e.target.value)}
                className="appearance-none relative block w-full px-3 py-3 border border-gray-700 bg-gray-900 text-white placeholder-gray-500 focus:outline-none focus:ring-purple-500 focus:border-purple-500 focus:z-10 sm:text-sm rounded-md"
                placeholder="Password"
              />
            </div>
          </div>
          
          {error && <p className="text-sm text-red-400 text-center animate-fade-in">{error}</p>}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-purple-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;