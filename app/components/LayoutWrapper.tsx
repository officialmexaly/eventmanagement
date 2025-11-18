"use client";

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import Navbar from './Navbar';
import Footer from './Footer';
import AIAgent from './AIAgent';
import CustomAI from './CustomAI';
import Chat from './Chat';
import { useApp } from './AppContext';
import { LogIn, X } from 'lucide-react';

const LayoutWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname();
  const { user, isAdmin, setUser, setIsAdmin } = useApp();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginForm, setLoginForm] = useState({ name: '', email: '' });

  // Don't show navbar/footer on admin page for cleaner admin interface
  const isAdminPage = pathname?.startsWith('/admin');

  const handleLogin = () => {
    setShowLoginModal(true);
  };

  const handleLogout = () => {
    setUser(null);
    setIsAdmin(false);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginForm.name && loginForm.email) {
      const newUser = {
        id: Date.now().toString(),
        name: loginForm.name,
        email: loginForm.email,
      };
      setUser(newUser);

      // Check if admin (simple check for demo - in production use proper auth)
      if (loginForm.email.toLowerCase().includes('admin')) {
        setIsAdmin(true);
      }

      setShowLoginModal(false);
      setLoginForm({ name: '', email: '' });
    }
  };

  return (
    <>
      {!isAdminPage && (
        <Navbar
          user={user}
          isAdmin={isAdmin}
          onLogin={handleLogin}
          onLogout={handleLogout}
        />
      )}

      <main className={!isAdminPage ? 'min-h-screen' : ''}>
        {children}
      </main>

      {!isAdminPage && <Footer />}

      {/* AI Agents - Available on all pages */}
      <AIAgent />
      <CustomAI />

      {/* Chat System - Available for logged-in users */}
      {user && <Chat />}

      {/* Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative">
            <button
              onClick={() => setShowLoginModal(false)}
              className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>

            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <LogIn className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-800">Welcome Back</h2>
              <p className="text-gray-600 mt-2">Sign in to continue to EventHub</p>
            </div>

            <form onSubmit={handleLoginSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={loginForm.name}
                  onChange={(e) => setLoginForm({ ...loginForm, name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="John Doe"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={loginForm.email}
                  onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="john@example.com"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Use email with 'admin' to login as administrator
                </p>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
              >
                Sign In
              </button>
            </form>

            <p className="text-center text-sm text-gray-600 mt-6">
              Don't have an account?{' '}
              <button className="text-purple-600 font-semibold hover:text-purple-700">
                Sign Up
              </button>
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default LayoutWrapper;
