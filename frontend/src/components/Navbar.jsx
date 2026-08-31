import React, { useState } from 'react';
import { Sparkles, Globe, Volume2, ShieldCheck, User, LogIn, LogOut, FileText, ChevronDown, Building2, Landmark } from 'lucide-react';
import { translations } from '../i18n/translations';

export default function Navbar({
  lang,
  setLang,
  onVoiceClick,
  isListening,
  currentUser,
  onOpenAuth,
  onLogout,
  onGoHome,
}) {
  const t = translations[lang] || translations.en;
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const languages = [
    { code: 'en', label: 'English' },
    { code: 'hi', label: 'हिंदी (Hindi)' },
    { code: 'ta', label: 'தமிழ் (Tamil)' },
    { code: 'te', label: 'తెలుగు (Telugu)' },
    { code: 'mr', label: 'मराठी (Marathi)' },
  ];

  const getRoleBadge = (role) => {
    switch (role) {
      case 'bank_officer':
        return { label: 'Bank Officer', bg: 'bg-indigo-100 text-indigo-800 border-indigo-200' };
      case 'csc_vle':
        return { label: 'CSC VLE Center', bg: 'bg-emerald-100 text-emerald-800 border-emerald-200' };
      default:
        return { label: 'Rural Entrepreneur', bg: 'bg-blue-100 text-blue-800 border-blue-200' };
    }
  };

  const badge = currentUser ? getRoleBadge(currentUser.role) : null;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo & MoSJE badge */}
        <div
          onClick={onGoHome}
          className="flex items-center gap-3 cursor-pointer select-none"
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-700 to-indigo-700 flex items-center justify-center text-white shadow-md shadow-blue-600/20">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg text-slate-900 tracking-tight">{t.app_title}</span>
              <span className="bg-slate-100 text-slate-700 border border-slate-200 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider hidden sm:inline-block">
                MoSJE Govt. Portal
              </span>
            </div>
            <p className="text-xs text-slate-500 hidden sm:block">
              {t.tagline}
            </p>
          </div>
        </div>

        {/* Right Actions: Voice, Language, Auth */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Voice Assistant Button */}
          <button
            onClick={onVoiceClick}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all shadow-sm ${
              isListening
                ? 'bg-rose-500 text-white animate-pulse shadow-rose-500/30'
                : 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
            }`}
            title={t.labels.voice_assistant}
          >
            <Volume2 className="w-4 h-4" />
            <span className="hidden md:inline">
              {isListening ? 'Listening...' : t.labels.voice_assistant}
            </span>
          </button>

          {/* Language Selector */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
            <Globe className="w-4 h-4 text-slate-500 ml-1.5" />
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value)}
              className="bg-transparent text-xs font-semibold text-slate-700 border-none outline-none pr-2 py-1 cursor-pointer"
            >
              {languages.map((l) => (
                <option key={l.code} value={l.code}>
                  {l.label}
                </option>
              ))}
            </select>
          </div>

          {/* Real User Auth Button / Profile Menu */}
          {currentUser ? (
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200/80 border border-slate-200 text-slate-800 text-xs font-bold transition-all"
              >
                <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-bold">
                  {currentUser.full_name?.charAt(0) || 'U'}
                </div>
                <div className="text-left hidden sm:block">
                  <span className="block max-w-[110px] truncate leading-tight font-bold">{currentUser.full_name}</span>
                  <span className="text-[9px] text-slate-500 font-medium block">{badge?.label}</span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
              </button>

              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 text-xs z-50 animate-in fade-in zoom-in-95">
                  <div className="px-3 py-2 border-b border-slate-100">
                    <p className="font-bold text-slate-800 truncate">{currentUser.full_name}</p>
                    <p className="text-[10px] text-slate-500 truncate">📱 {currentUser.phone || '9876543210'}</p>
                    <span className={`inline-block mt-1 text-[9px] font-extrabold px-2 py-0.5 rounded-full border ${badge?.bg}`}>
                      {badge?.label}
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      onLogout();
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-rose-600 hover:bg-rose-50 rounded-xl transition-all font-bold mt-1"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => onOpenAuth('entrepreneur')}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-md shadow-blue-600/20"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Portal Sign In</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
