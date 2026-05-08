'use client';

import Link from 'next/link';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Leaf, LogIn, UserPlus } from 'lucide-react';
import { useAuthStore } from '@/store/auth';

const navLinks = [
  { href: '/#features', label: 'Features' },
  { href: '/#how-it-works', label: 'How It Works' },
  { href: '/#impact', label: 'Impact' },
  { href: '/#faq', label: 'FAQ' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuthStore();

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="fixed top-0 left-0 right-0 z-50"
    >
      <div className="mx-auto max-w-7xl px-6 py-4">
        <div
          className="flex items-center justify-between rounded-2xl px-6 py-3"
          style={{
            background: 'rgba(10, 14, 26, 0.85)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(148, 163, 184, 0.08)',
          }}
        >
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/25 group-hover:shadow-indigo-500/40 transition-shadow">
              <Leaf className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold gradient-text">FoodBridge AI</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm text-slate-400 hover:text-white transition-colors duration-200"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <Link
                  href="/dashboard"
                  className="text-sm font-medium text-indigo-400 hover:text-indigo-300 transition-colors px-4 py-2"
                >
                  Dashboard
                </Link>
                <button
                  onClick={logout}
                  className="text-sm text-slate-400 hover:text-white transition-colors px-4 py-2"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="flex items-center gap-2 text-sm text-slate-300 hover:text-white transition-colors px-4 py-2"
                >
                  <LogIn className="w-4 h-4" />
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="btn-glow text-sm py-2.5 px-5"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-slate-300 hover:text-white"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="md:hidden mt-2 rounded-2xl p-6 space-y-4"
              style={{
                background: 'rgba(10, 14, 26, 0.95)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(148, 163, 184, 0.08)',
              }}
            >
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="block text-slate-300 hover:text-white py-2"
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </a>
              ))}
              <div className="pt-4 border-t border-slate-800 flex flex-col gap-3">
                {isAuthenticated ? (
                  <>
                    <Link href="/dashboard" className="text-indigo-400 py-2">
                      Dashboard
                    </Link>
                    <button onClick={logout} className="text-slate-400 py-2 text-left">
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link href="/login" className="text-slate-300 py-2">
                      Sign In
                    </Link>
                    <Link href="/register" className="btn-glow text-center py-2.5">
                      Get Started
                    </Link>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
}
