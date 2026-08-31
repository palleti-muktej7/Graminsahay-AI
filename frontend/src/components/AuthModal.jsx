import React, { useState, useEffect } from 'react';
import { User, Lock, Mail, Phone, Shield, ArrowRight, X, Sparkles, Building2, CheckCircle2, Landmark } from 'lucide-react';
import { translations } from '../i18n/translations';
import { registerUserApi, loginUserApi } from '../services/api';

export default function AuthModal({
  isOpen,
  onClose,
  initialRole = 'entrepreneur',
  onLoginSuccess,
  lang,
}) {
  const t = translations[lang] || translations.en;
  const [isSignUp, setIsSignUp] = useState(false);
  const [role, setRole] = useState(initialRole);
  
  // Registration & Login state
  const [phone, setPhone] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [socialCategory, setSocialCategory] = useState('OBC');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Sync role and set clean placeholder states whenever modal opens with a new initialRole
  useEffect(() => {
    if (isOpen) {
      setRole(initialRole);
      setErrorMsg('');
      if (initialRole === 'bank_officer') {
        setPhone('9811223344');
        setFullName('Senior Credit Officer');
        setEmail('credit.officer@sbi.co.in');
        setPassword('bank123');
      } else if (initialRole === 'csc_vle') {
        setPhone('9877001122');
        setFullName('CSC VLE Center Operator');
        setEmail('vle.operator@csc.gov.in');
        setPassword('vle123');
      } else {
        setPhone('9876543210');
        setFullName('Ramesh Kumar');
        setEmail('ramesh.kumar@gmail.com');
        setPassword('demo123');
      }
    }
  }, [isOpen, initialRole]);

  if (!isOpen) return null;

  const handleRoleChange = (newRole) => {
    setRole(newRole);
    if (newRole === 'bank_officer') {
      setPhone('9811223344');
      setFullName('Senior Credit Officer');
      setEmail('credit.officer@sbi.co.in');
    } else if (newRole === 'csc_vle') {
      setPhone('9877001122');
      setFullName('CSC VLE Center Operator');
      setEmail('vle.operator@csc.gov.in');
    } else {
      setPhone('9876543210');
      setFullName('Ramesh Kumar');
      setEmail('ramesh.kumar@gmail.com');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      if (isSignUp) {
        if (!phone.trim() || phone.trim().length < 10) {
          throw new Error('Please enter a valid 10-digit mobile phone number.');
        }
        if (!fullName.trim()) {
          throw new Error('Please enter your full name.');
        }

        const response = await registerUserApi({
          full_name: fullName.trim(),
          phone: phone.trim(),
          email: email.trim() || `${phone.trim()}@graminsahay.gov.in`,
          role: role,
          social_category: socialCategory,
          preferred_language: lang || 'en',
          password: password || 'pass123',
        });

        onLoginSuccess(response.user || {
          full_name: fullName,
          phone: phone,
          email: email,
          role: role,
          social_category: socialCategory,
        });
      } else {
        // Sign In
        const response = await loginUserApi({
          identifier: phone.trim() || '9876543210',
          password: password || 'pass123',
        });

        const userObj = {
          ...response.user,
          role: role,
          full_name: isSignUp ? fullName : (response.user.full_name || fullName),
        };
        onLoginSuccess(userObj);
      }
      onClose();
    } catch (err) {
      setErrorMsg(err?.response?.data?.detail || err.message || 'Authentication error');
    } finally {
      setLoading(false);
    }
  };

  const getRoleHeader = () => {
    switch (role) {
      case 'bank_officer':
        return { title: 'Bank Officer Login', desc: 'Access Credit Appraisal & Sanctions Portal', icon: Landmark, color: 'text-indigo-600' };
      case 'csc_vle':
        return { title: 'CSC VLE Center Login', desc: 'Access Village Assistance & Bulk Proposals Hub', icon: Building2, color: 'text-emerald-600' };
      default:
        return { title: 'Rural Entrepreneur Login', desc: 'Access Hyper-Local Advisory & 90% Loan Structuring', icon: User, color: 'text-blue-600' };
    }
  };

  const roleInfo = getRoleHeader();
  const Icon = roleInfo.icon;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-200 relative animate-in fade-in zoom-in duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center space-y-2 mb-4">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-blue-600 text-white shadow-md shadow-blue-500/20 mb-1">
            <Icon className="w-6 h-6" />
          </div>
          <h3 className="text-2xl font-extrabold text-slate-900">
            {roleInfo.title}
          </h3>
          <p className="text-xs text-slate-500">
            {roleInfo.desc}
          </p>
        </div>

        {/* Role Selector Tabs */}
        <div className="mb-4">
          <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
            Active Portal Role
          </label>
          <div className="grid grid-cols-3 gap-1.5 bg-slate-100 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => handleRoleChange('entrepreneur')}
              className={`py-1.5 px-2 text-[11px] font-bold rounded-lg transition-all ${
                role === 'entrepreneur'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              🧑‍🌾 Entrepreneur
            </button>
            <button
              type="button"
              onClick={() => handleRoleChange('csc_vle')}
              className={`py-1.5 px-2 text-[11px] font-bold rounded-lg transition-all ${
                role === 'csc_vle'
                  ? 'bg-white text-emerald-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              🏪 CSC VLE
            </button>
            <button
              type="button"
              onClick={() => handleRoleChange('bank_officer')}
              className={`py-1.5 px-2 text-[11px] font-bold rounded-lg transition-all ${
                role === 'bank_officer'
                  ? 'bg-white text-indigo-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              🏦 Bank Officer
            </button>
          </div>
        </div>

        {errorMsg && (
          <div className="mb-3 p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
            ⚠️ {errorMsg}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Mobile Phone Number */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              📱 Mobile Phone Number (10 Digits) *
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="tel"
                required
                maxLength={10}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50/50 font-semibold"
                placeholder="e.g. 9876543210"
              />
            </div>
          </div>

          {isSignUp && (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Full Name *
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50/50 font-semibold"
                  placeholder="e.g. Ramesh Kumar"
                />
              </div>
            </div>
          )}

          {isSignUp && (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Email Address (Optional)
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50/50"
                  placeholder="e.g. ramesh@gmail.com"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Password or PIN *
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50/50"
                placeholder="••••••••"
              />
            </div>
          </div>

          {isSignUp && (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Social Category (MoSJE Subsidy Channel)
              </label>
              <select
                value={socialCategory}
                onChange={(e) => setSocialCategory(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50/50 cursor-pointer font-medium"
              >
                <option value="OBC">OBC (NBCFDC Concessional Channel)</option>
                <option value="SC">SC (NSFDC Concessional Channel)</option>
                <option value="ST">ST (NSTFDC Concessional Channel)</option>
                <option value="General">General / Minority Category</option>
              </select>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-lg shadow-blue-600/20 transition-all flex items-center justify-center gap-2 mt-2"
          >
            <span>{loading ? 'Authenticating...' : isSignUp ? `Create ${role === 'bank_officer' ? 'Bank' : role === 'csc_vle' ? 'CSC' : 'Entrepreneur'} Account` : `Sign In to ${role === 'bank_officer' ? 'Bank Desk' : role === 'csc_vle' ? 'CSC Portal' : 'Entrepreneur Portal'}`}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Toggle Sign In / Sign Up */}
        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={() => {
              setIsSignUp(!isSignUp);
              setErrorMsg('');
            }}
            className="text-xs text-blue-600 hover:text-blue-700 font-bold"
          >
            {isSignUp
              ? 'Already registered? Sign In with Phone'
              : 'New user? Create a free account'}
          </button>
        </div>
      </div>
    </div>
  );
}
