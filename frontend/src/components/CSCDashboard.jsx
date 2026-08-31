import React, { useState, useEffect } from 'react';
import {
  Building2, PlusCircle, Users, FileText, CheckCircle2, Download,
  RefreshCw, Search, MapPin, IndianRupee, ArrowRight, Sparkles
} from 'lucide-react';
import { fetchAllProposalsApi, downloadDPRByIdApi } from '../services/api';
import { translations } from '../i18n/translations';

export default function CSCDashboard({
  currentUser,
  onStartNewApplication,
  lang,
}) {
  const t = translations[lang] || translations.en;
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [downloadingId, setDownloadingId] = useState(null);

  const loadProposals = async () => {
    setLoading(true);
    try {
      const data = await fetchAllProposalsApi();
      setProposals(data || []);
    } catch (err) {
      console.error('Failed to load proposals:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProposals();
  }, []);

  const handleDownload = async (prop) => {
    if (!prop?.id) {
      alert('Proposal ID not found.');
      return;
    }
    setDownloadingId(prop.id);
    try {
      await downloadDPRByIdApi(prop.id, prop.applicant_name || 'Applicant');
    } catch (err) {
      alert('Failed to download PDF DPR: ' + (err?.response?.data?.detail || err.message));
    } finally {
      setDownloadingId(null);
    }
  };

  const filtered = (proposals || []).filter((p) =>
    p.applicant_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.business_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.village?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-emerald-300 text-xs font-bold uppercase tracking-wider mb-2">
            <Building2 className="w-4 h-4 text-emerald-400" />
            <span>{t.role_csc}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {t.csc_title}
          </h2>
          <p className="text-emerald-100 text-xs sm:text-sm mt-1 max-w-2xl">
            {t.csc_subtitle}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onStartNewApplication}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm shadow-lg shadow-emerald-500/30 transition-all hover:scale-[1.02]"
          >
            <PlusCircle className="w-5 h-5" />
            <span>{t.new_assisted_app}</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-[11px] font-semibold text-slate-500 block uppercase tracking-wider">
            {t.villagers_assisted}
          </span>
          <span className="text-2xl font-black text-slate-900 mt-1 block">
            {proposals.length}
          </span>
          <span className="text-[10px] text-slate-400 mt-0.5 block">Synced to Supabase DB</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-[11px] font-semibold text-emerald-600 block uppercase tracking-wider">
            {t.total_loan_unlocked}
          </span>
          <span className="text-2xl font-black text-emerald-600 mt-1 block">
            ₹{(proposals.reduce((acc, p) => acc + (p.loan_amount || 0), 0) / 100000).toFixed(1)}L
          </span>
          <span className="text-[10px] text-emerald-600/80 mt-0.5 block">Concessional MoSJE Credit</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-[11px] font-semibold text-blue-600 block uppercase tracking-wider">
            CSC VLE Operator
          </span>
          <span className="text-sm font-bold text-slate-800 mt-1 block truncate">
            {currentUser?.full_name || 'VLE Center Operator'}
          </span>
          <span className="text-[10px] text-slate-400 block mt-0.5">VLE ID: {currentUser?.id?.slice(0, 8)}</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <span className="text-[11px] font-semibold text-indigo-600 block uppercase tracking-wider">
            Top Rural Sector
          </span>
          <span className="text-base font-black text-indigo-900 mt-1 block">
            {t.biz_dairy}
          </span>
          <span className="text-[10px] text-indigo-500 block">High margin value-add</span>
        </div>
      </div>

      {/* Assisted Villagers Table */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <h3 className="font-extrabold text-slate-900 text-base">
              {t.villagers_assisted}
            </h3>
            <p className="text-xs text-slate-500">
              Download printable DPRs or review bank submission status for each applicant.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder={t.search_placeholder}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50"
              />
            </div>
            <button
              onClick={loadProposals}
              className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600"
              title="Refresh"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
              <tr>
                <th className="py-3 px-3">{t.labels.full_name}</th>
                <th className="py-3 px-3">{t.labels.village} / {t.labels.district}</th>
                <th className="py-3 px-3">Proposed Business</th>
                <th className="py-3 px-3">{t.labels.own_equity}</th>
                <th className="py-3 px-3">{t.labels.loan_amount}</th>
                <th className="py-3 px-3">MoSJE Scheme</th>
                <th className="py-3 px-3">Verdict</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400">
                    <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-emerald-600" />
                    Loading proposals from Supabase...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400">
                    No assisted proposals found. Click "+ New Assisted Village Application" to start!
                  </td>
                </tr>
              ) : (
                filtered.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/80 transition-all">
                    <td className="py-3 px-3 font-bold text-slate-900">{p.applicant_name}</td>
                    <td className="py-3 px-3 text-slate-600">{p.village}, {p.district}</td>
                    <td className="py-3 px-3 font-semibold text-slate-800">{p.business_name}</td>
                    <td className="py-3 px-3 text-slate-700">₹{p.available_margin_capital?.toLocaleString('en-IN')}</td>
                    <td className="py-3 px-3 font-extrabold text-emerald-700">₹{p.loan_amount?.toLocaleString('en-IN')}</td>
                    <td className="py-3 px-3 text-slate-600">
                      <span className="bg-blue-50 text-blue-800 px-2 py-0.5 rounded-full text-[10px] font-bold">
                        {p.selected_scheme_name?.split(' ')[0]} {p.selected_scheme_name?.split(' ')[1]}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                          p.viability_verdict === 'GO'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {p.viability_verdict} ({p.viability_score}/100)
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => handleDownload(p)}
                        disabled={downloadingId === p.id}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-[11px] shadow-sm transition-all"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>{downloadingId === p.id ? 'Generating...' : 'PDF DPR'}</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
