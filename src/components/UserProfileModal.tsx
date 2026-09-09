import React, { useState } from 'react';
import {
  User,
  Bookmark,
  LogOut,
  X,
  Clock,
  ExternalLink,
  BookOpen,
  Shield,
  Sliders,
  Edit2,
  Check,
  Database,
  Key,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { soundFx } from '../utils/audio';

export const UserProfileModal: React.FC = () => {
  const {
    isProfileModalOpen,
    setIsProfileModalOpen,
    currentUser,
    logout,
    updateUserProfile,
    writeUps,
    setSelectedWriteUp,
    toggleSaveArticle,
    setIsAdminOpen,
    setIsAuthModalOpen,
  } = useApp();

  const [isEditing, setIsEditing] = useState(false);
  const [nameInput, setNameInput] = useState(currentUser?.name || '');
  const [avatarInput, setAvatarInput] = useState(currentUser?.avatar || '');
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  if (!isProfileModalOpen || !currentUser) return null;

  const displayName = currentUser.name || currentUser.username || currentUser.email || 'Operator';
  const displayRole = (currentUser.role || 'researcher').toUpperCase();
  const savedArticles = (Array.isArray(writeUps) ? writeUps : []).filter((w) =>
    currentUser.savedArticles?.includes(w.id)
  );

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    soundFx.playKeyClick();
    const res = await updateUserProfile(nameInput, avatarInput);
    if (res.success) {
      setSaveStatus('Profile updated.');
      setIsEditing(false);
      setTimeout(() => setSaveStatus(null), 2500);
    } else {
      setSaveStatus('Update failed.');
    }
  };

  return (
    <div
      id="profile-modal-overlay"
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={() => setIsProfileModalOpen(false)}
    >
      <div
        id="profile-modal-card"
        className="w-full max-w-xl bg-[#090d16] border border-zinc-700/80 rounded-xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 bg-zinc-950 border-b border-zinc-800 flex items-center justify-between font-mono">
          <div className="flex items-center gap-2 text-xs">
            <Shield className="w-4 h-4 text-emerald-400" />
            <span className="font-bold text-white tracking-wider">
              OPERATOR PROFILE // {displayName.toUpperCase()}
            </span>
          </div>
          <button
            onClick={() => setIsProfileModalOpen(false)}
            className="p-1 text-zinc-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 font-mono text-xs max-h-[85vh] overflow-y-auto">
          {saveStatus && (
            <div className="p-2.5 rounded bg-emerald-950/50 border border-emerald-500/40 text-emerald-300 flex items-center gap-2">
              <Check className="w-4 h-4" />
              <span>{saveStatus}</span>
            </div>
          )}

          {/* User ID Card */}
          <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-emerald-400 font-bold text-base overflow-hidden shrink-0">
                  {currentUser.avatar ? (
                    <img
                      src={currentUser.avatar}
                      alt={displayName}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                  ) : (
                    (displayName[0] || 'O').toUpperCase()
                  )}
                </div>
                <div>
                  <div className="text-sm font-bold text-white flex items-center gap-2">
                    <span>{displayName}</span>
                    <span
                      className={`text-[9px] px-2 py-0.5 rounded border font-mono ${
                        currentUser.role === 'admin'
                          ? 'bg-amber-950/60 text-amber-300 border-amber-500/40'
                          : currentUser.role === 'analyst'
                          ? 'bg-cyan-950/60 text-cyan-300 border-cyan-500/40'
                          : 'bg-emerald-950/60 text-emerald-300 border-emerald-500/40'
                      }`}
                    >
                      {displayRole}
                    </span>
                  </div>
                  <div className="text-zinc-400 text-[11px] mt-0.5">
                    {currentUser.email} • @{currentUser.username}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-auto">
                <button
                  onClick={() => {
                    soundFx.playKeyClick();
                    setIsEditing(!isEditing);
                    setNameInput(currentUser.name || '');
                    setAvatarInput(currentUser.avatar || '');
                  }}
                  className="p-2 rounded border border-zinc-800 hover:bg-zinc-900 text-zinc-400 hover:text-zinc-200 transition-colors"
                  title="Edit Profile"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                {currentUser.role === 'admin' && (
                  <button
                    onClick={() => {
                      soundFx.playKeyClick();
                      setIsProfileModalOpen(false);
                      setIsAdminOpen(true);
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-amber-950/30 border border-amber-500/40 text-amber-300 hover:bg-amber-950/60 transition-colors cursor-pointer"
                    title="Open Admin CMS Control Center"
                  >
                    <Sliders className="w-3.5 h-3.5 text-amber-400" />
                    <span>ADMIN CMS</span>
                  </button>
                )}
                <button
                  onClick={() => {
                    soundFx.playKeyClick();
                    logout();
                    setIsProfileModalOpen(false);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-rose-950/30 border border-rose-500/40 text-rose-400 hover:bg-rose-950/60 transition-colors cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>LOGOUT</span>
                </button>
              </div>
            </div>

            {/* Profile Editing Form */}
            {isEditing && (
              <form
                onSubmit={handleSaveProfile}
                className="pt-3 border-t border-zinc-800/80 space-y-3 animate-in fade-in"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] text-zinc-400 uppercase">Display Name</label>
                    <input
                      type="text"
                      value={nameInput}
                      onChange={(e) => setNameInput(e.target.value)}
                      className="w-full mt-1 p-2 rounded bg-zinc-900 border border-zinc-800 text-zinc-200 outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-zinc-400 uppercase">Avatar URL</label>
                    <input
                      type="url"
                      value={avatarInput}
                      onChange={(e) => setAvatarInput(e.target.value)}
                      placeholder="https://..."
                      className="w-full mt-1 p-2 rounded bg-zinc-900 border border-zinc-800 text-zinc-200 outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="py-1.5 px-3 rounded border border-zinc-800 text-zinc-400 hover:text-zinc-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="py-1.5 px-3 rounded bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            )}

            {/* Telemetry metadata tags */}
            <div className="pt-2 border-t border-zinc-900 flex flex-wrap gap-2 text-[10px]">
              <span className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-400 flex items-center gap-1">
                <Database className="w-3 h-3 text-emerald-400" />
                Provider: {currentUser.provider === 'supabase' ? 'Supabase Auth' : 'Local Sandbox Engine'}
              </span>
              <span className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-400 flex items-center gap-1">
                <Clock className="w-3 h-3 text-cyan-400" />
                Joined: {currentUser.createdAt ? new Date(currentUser.createdAt).toLocaleDateString() : 'Active'}
              </span>
              <span className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-400 flex items-center gap-1">
                <Shield className="w-3 h-3 text-amber-400" />
                Clearance: Level {currentUser.role === 'admin' ? '3 (Admin)' : currentUser.role === 'researcher' ? '2 (Researcher)' : '1 (Analyst)'}
              </span>
            </div>
          </div>

          {/* Bookmarked articles */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-zinc-400 font-bold flex items-center gap-1.5">
                <Bookmark className="w-3.5 h-3.5 text-emerald-400" /> SAVED RESEARCH WRITE-UPS ({savedArticles.length})
              </span>
            </div>

            {savedArticles.length === 0 ? (
              <div className="p-6 text-center text-zinc-500 border border-dashed border-zinc-800 rounded-lg text-xs">
                No bookmarked articles yet. Click the bookmark icon on any security write-up to save it here.
              </div>
            ) : (
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {savedArticles.map((article) => (
                  <div
                    key={article.id}
                    className="p-3 rounded-lg bg-zinc-950 border border-zinc-800/80 flex items-center justify-between gap-3 hover:border-zinc-700 transition-colors"
                  >
                    <div
                      onClick={() => {
                        soundFx.playKeyClick();
                        setIsProfileModalOpen(false);
                        setSelectedWriteUp(article);
                      }}
                      className="cursor-pointer overflow-hidden"
                    >
                      <div className="font-bold text-white truncate hover:text-emerald-300">
                        {article.title}
                      </div>
                      <div className="text-[10px] text-zinc-500">
                        {article.category} • {article.readingTime}
                      </div>
                    </div>
                    <button
                      onClick={() => toggleSaveArticle(article.id)}
                      className="p-1 text-zinc-500 hover:text-rose-400 transition-colors"
                      title="Remove bookmark"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
