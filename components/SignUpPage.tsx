import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { BookOpenIcon } from './icons/BookOpenIcon';
import { View } from '../types';

interface SignUpPageProps {
  setView: React.Dispatch<React.SetStateAction<View>>;
}

const SignUpPage: React.FC<SignUpPageProps> = ({ setView }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (username.length < 3) {
      setError('Username must be at least 3 characters long.');
      return;
    }
    
    setLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username: username,
        },
      },
    });

    if (error) {
      setError(error.message);
    } else if (data.user) {
      alert('Sign up successful! Please check your email for verification to complete the process.');
      setView('login'); // Navigate to login page after sign up.
    }
    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 p-10 bg-gray-800 rounded-2xl shadow-2xl shadow-purple-500/20 animate-fade-in">
        <div>
          <BookOpenIcon className="mx-auto h-12 w-auto text-purple-400"/>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
            Create a new account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-400">
            Already have an account?{' '}
            <button onClick={() => setView('login')} className="font-medium text-purple-400 hover:text-purple-300">
              Sign In
            </button>
          </p>
        </div>
        
        <form className="space-y-6" onSubmit={handleSignUp}>
          <div className="rounded-md shadow-sm">
            <div className="mb-4">
              <label htmlFor="username" className="sr-only">Username</label>
              <input
                id="username" name="username" type="text" autoComplete="username" required
                value={username} onChange={(e) => setUsername(e.target.value)}
                className="appearance-none relative block w-full px-3 py-3 border border-gray-700 bg-gray-900 text-white placeholder-gray-500 focus:outline-none focus:ring-purple-500 focus:border-purple-500 focus:z-10 sm:text-sm rounded-md"
                placeholder="Username"
              />
            </div>
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
                id="password-input" name="password" type="password" autoComplete="new-password" required
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
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUpPage;
