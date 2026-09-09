import React, { useState } from 'react';
import { Shield, Lock, User, Key, X, AlertCircle, CheckCircle2, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { soundFx } from '../utils/audio';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, setIsAuthModalOpen, login, signup, setIsAdminOpen } = useApp();
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('ramsec2026');
  const [email, setEmail] = useState('ram@sec.local');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  if (!isAuthModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    soundFx.playKeyClick();

    if (isLoginMode) {
      const res = login(username, password);
      if (res.success) {
        setSuccess('Authentication approved. Access granted.');
        setTimeout(() => {
          setIsAuthModalOpen(false);
          if (username.toLowerCase() === 'admin') {
            setIsAdminOpen(true);
          }
        }, 500);
      } else {
        setError(res.error || 'Authentication challenge failed.');
      }
    } else {
      const res = signup(username, password, email);
      if (res.success) {
        setSuccess('Account provisioned. Session active.');
        setTimeout(() => {
          setIsAuthModalOpen(false);
        }, 500);
      } else {
        setError(res.error || 'Account creation rejected.');
      }
    }
  };

  const handleFillAdminCreds = () => {
    soundFx.playKeyClick();
    setIsLoginMode(true);
    setUsername('admin');
    setPassword('ramsec2026');
    setError(null);
  };

  const handleFillGuestCreds = () => {
    soundFx.playKeyClick();
    setIsLoginMode(true);
    setUsername('analyst');
    setPassword('analyst123');
    setError(null);
  };

  return (
    <div
      id="auth-modal-overlay"
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={() => setIsAuthModalOpen(false)}
    >
      <div
        id="auth-modal-card"
        className="w-full max-w-md bg-[#090d16] border border-zinc-700/80 rounded-xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 bg-zinc-950 border-b border-zinc-800 flex items-center justify-between font-mono">
          <div className="flex items-center gap-2 text-xs">
            <Shield className="w-4 h-4 text-emerald-400" />
            <span className="font-bold text-white tracking-wider">
              {isLoginMode ? 'SESSION AUTHENTICATION' : 'PROVISION READER ACCOUNT'}
            </span>
          </div>
          <button
            onClick={() => setIsAuthModalOpen(false)}
            className="p-1 text-zinc-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5 font-mono text-xs">
          {error && (
            <div className="p-3 rounded-lg bg-rose-950/40 border border-rose-500/40 text-rose-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="p-3 rounded-lg bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{success}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-zinc-400 uppercase text-[10px] tracking-wider flex items-center gap-1">
                <User className="w-3.5 h-3.5" /> USERNAME / IDENTIFIER
              </label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full rounded-lg bg-zinc-950 border border-zinc-800 p-3 text-zinc-200 outline-none focus:border-emerald-500/50"
                placeholder="e.g. admin"
              />
            </div>

            {!isLoginMode && (
              <div className="space-y-1.5">
                <label className="text-zinc-400 uppercase text-[10px] tracking-wider">
                  EMAIL ADDRESS
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg bg-zinc-950 border border-zinc-800 p-3 text-zinc-200 outline-none focus:border-emerald-500/50"
                  placeholder="analyst@domain.com"
                />
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-zinc-400 uppercase text-[10px] tracking-wider flex items-center gap-1">
                <Key className="w-3.5 h-3.5" /> PASSPHRASE KEY
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg bg-zinc-950 border border-zinc-800 p-3 text-zinc-200 outline-none focus:border-emerald-500/50 font-sans"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-all cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>{isLoginMode ? 'VERIFY CREDENTIALS' : 'CREATE ACCOUNT'}</span>
            </button>
          </form>

          {/* Quick Fill Testing Credentials buttons */}
          <div className="pt-3 border-t border-zinc-800/80 space-y-2">
            <div className="text-[10px] text-zinc-500 uppercase tracking-wider">
              EVALUATION CREDENTIAL SHORTCUTS:
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleFillAdminCreds}
                className="flex-1 py-1.5 px-2 rounded border border-amber-500/30 bg-amber-950/20 text-amber-300 text-[10px] hover:bg-amber-950/40 transition-colors"
              >
                Auto-fill Admin (admin / ramsec2026)
              </button>
              <button
                type="button"
                onClick={handleFillGuestCreds}
                className="flex-1 py-1.5 px-2 rounded border border-zinc-800 bg-zinc-900 text-zinc-400 text-[10px] hover:text-zinc-200 transition-colors"
              >
                Guest Analyst
              </button>
            </div>
          </div>

          <div className="text-center pt-2">
            <button
              onClick={() => {
                soundFx.playKeyClick();
                setIsLoginMode(!isLoginMode);
                setError(null);
              }}
              className="text-zinc-400 hover:text-emerald-400 text-[11px] underline"
            >
              {isLoginMode
                ? 'Need an account to bookmark write-ups? Register here'
                : 'Already have credentials? Return to login'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
