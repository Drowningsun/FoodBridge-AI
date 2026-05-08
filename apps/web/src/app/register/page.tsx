'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Leaf, Mail, Lock, User, Phone, MapPin, ArrowRight, Building, Truck, Heart } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuthStore } from '@/store/auth';

const roles = [
  { value: 'donor', label: 'Donor', icon: Heart, desc: 'Donate surplus food' },
  { value: 'ngo', label: 'NGO', icon: Building, desc: 'Receive donations' },
  { value: 'volunteer', label: 'Volunteer', icon: Truck, desc: 'Deliver food' },
];

export default function RegisterPage() {
  const [form, setForm] = useState({
    name: '', email: '', password: '', role: 'donor', phone: '', city: '',
  });
  const { register, isLoading } = useAuthStore();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await register(form);
      toast.success('Account created successfully!');
      router.push('/dashboard');
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12 relative">
      <div className="absolute inset-0" style={{ background: 'var(--gradient-hero)' }}>
        <div className="blob w-96 h-96 bg-purple-600 top-10 left-20 opacity-10" />
        <div className="blob w-80 h-80 bg-emerald-600 bottom-10 right-20 opacity-10" style={{ animationDelay: '-7s' }} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-10 w-full max-w-lg relative z-10"
      >
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2.5 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/25">
              <Leaf className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold gradient-text">FoodBridge AI</span>
          </Link>
          <h1 className="text-2xl font-bold text-white mb-2">Create Your Account</h1>
          <p className="text-sm text-slate-400">Join the food waste revolution</p>
        </div>

        {/* Role selector */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {roles.map((role) => (
            <button
              key={role.value}
              type="button"
              onClick={() => setForm({ ...form, role: role.value })}
              className={`p-4 rounded-xl text-center transition-all ${
                form.role === role.value
                  ? 'bg-indigo-500/20 border border-indigo-500/40 text-indigo-300'
                  : 'bg-slate-800/50 border border-slate-700/30 text-slate-400 hover:border-slate-600'
              }`}
            >
              <role.icon className="w-5 h-5 mx-auto mb-2" />
              <div className="text-xs font-medium">{role.label}</div>
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-slate-400 mb-2">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="input-field pl-11"
                  placeholder="John Doe"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-2">Phone</label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="input-field pl-11"
                  placeholder="+91 9876543210"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm text-slate-400 mb-2">Email</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="input-field pl-11"
                placeholder="you@example.com"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-slate-400 mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="input-field pl-11"
                placeholder="Min 8 characters"
                required
                minLength={8}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-slate-400 mb-2">City</label>
            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                className="input-field pl-11"
                placeholder="Mumbai"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="btn-glow w-full flex items-center justify-center gap-2 py-3.5 mt-2 disabled:opacity-50"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>Create Account <ArrowRight className="w-4 h-4" /></>
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-slate-400">
            Already have an account?{' '}
            <Link href="/login" className="text-indigo-400 hover:text-indigo-300 font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
