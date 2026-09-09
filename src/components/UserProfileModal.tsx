import React from 'react';
import { User, Bookmark, LogOut, X, Clock, ExternalLink, BookOpen, Shield } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { soundFx } from '../utils/audio';

export const UserProfileModal: React.FC = () => {
  const {
    isProfileModalOpen,
    setIsProfileModalOpen,
    currentUser,
    logout,
    writeUps,
    setSelectedWriteUp,
    toggleSaveArticle,
  } = useApp();

  if (!isProfileModalOpen || !currentUser) return null;

  const displayName = currentUser.name || currentUser.username || currentUser.email || 'Operator';
  const displayRole = (currentUser.role || 'researcher').toUpperCase();
  const savedArticles = writeUps.filter((w) => currentUser.savedArticles?.includes(w.id));

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
            <User className="w-4 h-4 text-emerald-400" />
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
        <div className="p-6 space-y-6 font-mono text-xs">
          <div className="flex items-center justify-between p-4 rounded-xl bg-zinc-950 border border-zinc-800">
            <div>
              <div className="text-sm font-bold text-white flex items-center gap-2">
                <span>{displayName}</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-400 border border-emerald-500/40">
                  {displayRole}
                </span>
              </div>
              <div className="text-zinc-400 text-[11px] mt-0.5">{currentUser.email}</div>
            </div>
            <button
              onClick={() => {
                soundFx.playKeyClick();
                logout();
                setIsProfileModalOpen(false);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-rose-950/30 border border-rose-500/40 text-rose-400 hover:bg-rose-950/60 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>TERMINATE SESSION</span>
            </button>
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
