import React, { useState } from 'react';
import { X, Sparkles, Mail, Lock, User, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const AuthModal: React.FC = () => {
  const { openAuthModal, setOpenAuthModal, loginAsGuest } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  if (!openAuthModal) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      loginAsGuest(name || (isSignUp ? 'New Student' : 'Alex Rivers'), email || 'student@edugenie.ai');
      setLoading(false);
      setOpenAuthModal(false);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/65 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-indigo-100 relative">
        {/* Decorative Top Banner */}
        <div className="gradient-bg p-6 text-white relative">
          <button
            onClick={() => setOpenAuthModal(false)}
            className="absolute top-4 right-4 p-1.5 text-white/80 hover:text-white rounded-full bg-white/10 hover:bg-white/20 transition"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 bg-white/20 backdrop-blur-md rounded-xl">
              <Sparkles className="w-5 h-5 text-amber-300" />
            </div>
            <span className="text-xs uppercase tracking-widest font-bold text-indigo-100">EduGenie Portal</span>
          </div>
          <h2 className="text-xl font-extrabold">{isSignUp ? 'Create Student Account' : 'Welcome Back Student'}</h2>
          <p className="text-xs text-indigo-100/90 mt-1">Unlock AI-powered learning, notes, and exam prep</p>
        </div>

        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Alex Rivers"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@university.edu"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl shadow-lg shadow-indigo-200 transition flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>{isSignUp ? 'Sign Up with EduGenie' : 'Sign In'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="relative my-5 text-center">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200" /></div>
            <span className="relative bg-white px-3 text-xs text-slate-400">or quick access</span>
          </div>

          <button
            onClick={() => {
              loginAsGuest('Guest Student', 'guest@edugenie.ai');
              setOpenAuthModal(false);
            }}
            className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded-xl transition flex items-center justify-center gap-2"
          >
            <span>Continue as Guest Demo User</span>
          </button>

          <div className="mt-5 text-center text-xs text-slate-500">
            {isSignUp ? (
              <span>Already have an account? <button onClick={() => setIsSignUp(false)} className="text-indigo-600 font-semibold hover:underline">Sign In</button></span>
            ) : (
              <span>Don't have an account? <button onClick={() => setIsSignUp(true)} className="text-indigo-600 font-semibold hover:underline">Sign Up</button></span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
