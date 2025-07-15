import React from 'react';
import { View, Profile } from '../types';
import { HeadphonesIcon } from './icons/HeadphonesIcon';
import { UserIcon } from './icons/UserIcon';

interface HeaderProps {
  profile: Profile | null;
  currentView: View;
  onNavigate: (view: View) => void;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ profile, currentView, onNavigate, onLogout }) => {
  return (
    <header className="bg-gray-900/80 backdrop-blur-sm sticky top-0 z-40 shadow-lg shadow-purple-500/10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => onNavigate('user')}>
            <HeadphonesIcon className="h-8 w-8 text-purple-400" />
            <span className="text-2xl font-bold tracking-tight text-white">Aura Audiobooks</span>
          </div>
          <div className="flex items-center space-x-4">
            {profile ? (
              <>
                {profile.is_admin && currentView !== 'admin' && (
                  <button
                    onClick={() => onNavigate('admin')}
                    className="px-4 py-2 text-sm font-medium rounded-md text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                  >
                    Admin Dashboard
                  </button>
                )}
                {profile.is_admin && currentView === 'admin' && (
                  <button
                    onClick={() => onNavigate('user')}
                    className="px-4 py-2 text-sm font-medium rounded-md text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                  >
                    User View
                  </button>
                )}
                <div className="flex items-center space-x-3">
                   {profile.avatar_url ? (
                    <img src={profile.avatar_url} alt={profile.username} className="w-8 h-8 rounded-full object-cover bg-gray-700" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
                      <UserIcon className="w-5 h-5 text-gray-400" />
                    </div>
                  )}
                  <div className="hidden sm:flex items-center space-x-2">
                    <span className="text-sm text-gray-300">Welcome, {profile.username}</span>
                    {profile.is_subscribed && (
                        <span className="px-2 py-0.5 text-xs font-semibold text-purple-200 bg-purple-600/50 rounded-full">Subscribed</span>
                    )}
                  </div>
                </div>
                <button
                  onClick={onLogout}
                  className="px-4 py-2 text-sm font-medium rounded-md text-gray-300 hover:bg-red-600 hover:text-white transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => onNavigate('login')}
                  className="px-4 py-2 text-sm font-medium rounded-md text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                >
                  Login
                </button>
                <button
                  onClick={() => onNavigate('signup')}
                  className="px-4 py-2 text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 transition-colors"
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;