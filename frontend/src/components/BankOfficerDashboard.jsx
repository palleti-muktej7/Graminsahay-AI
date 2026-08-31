import React, { useState, useEffect } from 'react';
import {
  Landmark, CheckCircle, AlertTriangle, XCircle, FileText, Download,
  Filter, Search, RefreshCw, Eye, ShieldCheck, User, Calendar, MapPin, IndianRupee, ArrowRight
} from 'lucide-react';
import { fetchAllProposalsApi, downloadDPRByIdApi, updateProposalStatusApi } from '../services/api';

export default function BankOfficerDashboard({ currentUser, lang }) {
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterVerdict, setFilterVerdict] = useState('ALL'); // ALL, GO, CAUTION, NO_GO
  const [filterStatus, setFilterStatus] = useState('ALL'); // ALL, PENDING, SANCTIONED, CLARIFICATION, DECLINED
  const [selectedProposal, setSelectedProposal] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [downloadingDpr, setDownloadingDpr] = useState(false);
  const [actionSuccessMsg, setActionSuccessMsg] = useState('');

  const loadProposals = async () => {
    setLoading(true);
    try {
      const data = await fetchAllProposalsApi();
      setProposals(data);
      if (data.length > 0) {
        if (!selectedProposal) {
          setSelectedProposal(data[0]);
        } else {
          const updated = data.find((p) => p.id === selectedProposal.id);
          if (updated) setSelectedProposal(updated);
        }
      }
    } catch (err) {
      console.error('Failed to load proposals:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProposals();
  }, []);

  const handleDownloadDPR = async (prop) => {
    if (!prop?.id) {
      alert('Proposal ID not found.');
      return;
    }
    setDownloadingDpr(true);
    try {
      await downloadDPRByIdApi(prop.id, prop.applicant_name || 'Applicant');
    } catch (err) {
      alert('Failed to download PDF DPR: ' + (err?.response?.data?.detail || err.message));
    } finally {
      setDownloadingDpr(false);
    }
  };

  const handleAction = async (id, action) => {
    setActionLoading(true);
    setActionSuccessMsg('');
    try {
      await updateProposalStatusApi(id, action, `Actioned by ${currentUser?.full_name || 'Bank Credit Officer'}`);
      setActionSuccessMsg(`Application permanently updated to "${action}" in Supabase database!`);
      
      // Update local state immediately
      setProposals((prev) =>
        prev.map((p) => (p.id === id ? { ...p, status: action } : p))
      );
      if (selectedProposal?.id === id) {
        setSelectedProposal((prev) => ({ ...prev, status: action }));
      }
      setTimeout(() => setActionSuccessMsg(''), 5000);
    } catch (err) {
      alert('Failed to update status in database: ' + err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const filtered = proposals.filter((p) => {
    const matchSearch =
      p.applicant_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.business_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.district?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchVerdict = filterVerdict === 'ALL' || p.viability_verdict === filterVerdict;
    const matchStatus = filterStatus === 'ALL' || (p.status || 'PENDING') === filterStatus;
    return matchSearch && matchVerdict && matchStatus;
  });

  const getStatusBadge = (status) => {
    const s = (status || 'PENDING').toUpperCase();
    if (s === 'SANCTIONED') {
      return { label: '✓ SANCTIONED', bg: 'bg-emerald-100 text-emerald-800 border-emerald-300' };
    }
    if (s === 'CLARIFICATION' || s === 'QUERY') {
      return { label: '⚠️ QUERY RAISED', bg: 'bg-amber-100 text-amber-800 border-amber-300' };
    }
    if (s === 'DECLINED') {
      return { label: '✕ DECLINED', bg: 'bg-rose-100 text-rose-800 border-rose-300' };
    }
    return { label: '⏳ PENDING APPRAISAL', bg: 'bg-slate-100 text-slate-700 border-slate-300' };
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-blue-300 text-xs font-bold uppercase tracking-wider mb-2">
            <Landmark className="w-4 h-4 text-blue-400" />
            <span>Bank Credit Officer & MoSJE Appraisal Desk</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Rural Loan Appraisal & Sanction Portal
          </h2>
          <p className="text-blue-200 text-xs sm:text-sm mt-1 max-w-2xl">
            Review live rural enterprise proposals from Supabase PostgreSQL. Audit DSCR repayment feasibility, moratorium grace compliance, and issue bank sanctions.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadProposals}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all border border-white/20"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh Live Database</span>
          </button>
        </div>
      </div>

      {actionSuccessMsg && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold rounded-2xl animate-in fade-in flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            <span>{actionSuccessMsg}</span>
          </div>
          <span className="text-[10px] text-emerald-700 font-semibold">Persisted in Supabase</span>
        </div>
      )}

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-[11px] font-semibold text-slate-500 block uppercase tracking-wider">
            Total Applications in DB
          </span>
          <span className="text-2xl font-black text-slate-900 mt-1 block">
            {proposals.length}
          </span>
          <span className="text-[10px] text-slate-400 mt-0.5 block">Stored in Supabase</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-[11px] font-semibold text-emerald-600 block uppercase tracking-wider">
            🟢 Sanctioned Loans
          </span>
          <span className="text-2xl font-black text-emerald-600 mt-1 block">
            {proposals.filter((p) => p.status === 'SANCTIONED').length}
          </span>
          <span className="text-[10px] text-emerald-600/80 mt-0.5 block">Approved in Database</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-[11px] font-semibold text-blue-600 block uppercase tracking-wider">
            Total Concessional Outlay
          </span>
          <span className="text-2xl font-black text-blue-600 mt-1 block">
            ₹{(proposals.reduce((acc, p) => acc + (p.loan_amount || 0), 0) / 100000).toFixed(1)}L
          </span>
          <span className="text-[10px] text-blue-600/80 mt-0.5 block">MoSJE Scheme Leverage</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-[11px] font-semibold text-indigo-600 block uppercase tracking-wider">
            Credit Officer
          </span>
          <span className="text-sm font-bold text-slate-800 mt-1 block truncate">
            {currentUser?.full_name || 'Credit Appraisal Officer'}
          </span>
          <span className="text-[10px] text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full inline-block mt-0.5 font-bold">
            Branch Appraisal Unit
          </span>
        </div>
      </div>

      {/* Main Split: Application Table & Detailed Appraisal Drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Applications List (Left 7 Cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search by applicant, business, or district..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50"
              />
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-1">
              {['ALL', 'PENDING', 'SANCTIONED', 'DECLINED'].map((st) => (
                <button
                  key={st}
                  onClick={() => setFilterStatus(st)}
                  className={`px-2.5 py-1 text-[10px] font-bold rounded-lg transition-all ${
                    filterStatus === st
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* List of Proposal Cards */}
          <div className="space-y-3 max-h-[550px] overflow-y-auto pr-1">
            {loading ? (
              <div className="p-8 text-center text-xs text-slate-400">
                <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-blue-600" />
                Loading live proposals from Supabase...
              </div>
            ) : filtered.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400">
                No loan proposals found in database matching criteria.
              </div>
            ) : (
              filtered.map((prop) => {
                const isSelected = selectedProposal?.id === prop.id;
                const statusBadge = getStatusBadge(prop.status);

                return (
                  <div
                    key={prop.id}
                    onClick={() => setSelectedProposal(prop)}
                    className={`p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/40 shadow-sm'
                        : 'border-slate-100 bg-slate-50/60 hover:border-slate-200 hover:bg-white'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 text-sm">
                            {prop.applicant_name}
                          </span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
                            {prop.business_name}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {prop.village}, {prop.district} ({prop.state})
                        </p>
                      </div>

                      <div className="text-right">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black ${
                            prop.viability_verdict === 'GO'
                              ? 'bg-emerald-100 text-emerald-800'
                              : prop.viability_verdict === 'CAUTION'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {prop.viability_verdict} ({prop.viability_score}/100)
                        </span>
                        <span className="text-xs font-black text-blue-700 block mt-1">
                          ₹{prop.loan_amount?.toLocaleString('en-IN')} Loan
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-[11px] pt-3 mt-2 border-t border-slate-200/60 text-slate-600">
                      <div>
                        <span className="text-slate-400 block text-[10px]">Scheme:</span>
                        <span className="font-semibold truncate block">
                          {prop.selected_scheme_name?.split(' ')[0]} {prop.selected_scheme_name?.split(' ')[1]}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">DSCR Ratio:</span>
                        <span className="font-bold text-emerald-700">{prop.dscr}x</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">EMI / Moratorium:</span>
                        <span className="font-bold text-slate-800">₹{prop.regular_monthly_emi?.toLocaleString('en-IN')} ({prop.moratorium_months}m grace)</span>
                      </div>
                    </div>

                    {/* Permanent Database Status Strip */}
                    <div className="mt-2.5 pt-2 border-t border-slate-200/60 text-xs flex items-center justify-between">
                      <span className="text-slate-500 text-[10px]">Database Decision:</span>
                      <span
                        className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border ${statusBadge.bg}`}
                      >
                        {statusBadge.label}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Selected Proposal Appraisal Details (Right 5 Cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between space-y-4">
          {selectedProposal ? (
            <>
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 block">
                      Appraisal File # {selectedProposal.id?.slice(0, 8)}
                    </span>
                    <h3 className="text-lg font-black text-slate-900 mt-0.5">
                      {selectedProposal.applicant_name}
                    </h3>
                  </div>
                  <div className="text-right">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-black block ${
                        selectedProposal.viability_verdict === 'GO'
                          ? 'bg-emerald-100 text-emerald-800'
                          : selectedProposal.viability_verdict === 'CAUTION'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {selectedProposal.viability_verdict}
                    </span>
                    <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border inline-block mt-1 ${getStatusBadge(selectedProposal.status).bg}`}>
                      {getStatusBadge(selectedProposal.status).label}
                    </span>
                  </div>
                </div>

                {/* Financial Appraisal Parameters */}
                <div className="space-y-2.5 text-xs">
                  <div className="p-3 bg-slate-50 rounded-xl space-y-1.5">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Proposed Enterprise:</span>
                      <span className="font-bold text-slate-800">{selectedProposal.business_name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Location / Village:</span>
                      <span className="font-semibold text-slate-700">{selectedProposal.village}, {selectedProposal.district}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Total Project Outlay:</span>
                      <span className="font-bold text-slate-900">₹{selectedProposal.total_project_cost?.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Beneficiary Equity (10%):</span>
                      <span className="font-bold text-emerald-600">₹{selectedProposal.available_margin_capital?.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">MoSJE Loan Amount (90%):</span>
                      <span className="font-extrabold text-blue-700">₹{selectedProposal.loan_amount?.toLocaleString('en-IN')}</span>
                    </div>
                  </div>

                  {/* Scheme & Repayment Audit */}
                  <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-100 space-y-1.5">
                    <div className="flex justify-between">
                      <span className="text-blue-900 font-semibold">Matched Scheme:</span>
                      <span className="font-bold text-blue-900">{selectedProposal.selected_scheme_name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-800">Interest Rate / Tenure:</span>
                      <span className="font-bold text-slate-800">{selectedProposal.interest_rate_pct}% p.a. • {selectedProposal.tenure_years} Yrs</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-800">Moratorium Grace:</span>
                      <span className="font-bold text-amber-700">{selectedProposal.moratorium_months} Months Principal Grace</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-800">Regular Monthly EMI:</span>
                      <span className="font-extrabold text-slate-900">₹{selectedProposal.regular_monthly_emi?.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between items-center pt-1 border-t border-blue-200">
                      <span className="text-blue-900 font-bold">DSCR Repayment Ratio:</span>
                      <span className="font-black text-emerald-700 text-sm">{selectedProposal.dscr}x (Viable)</span>
                    </div>
                  </div>
                </div>

                {/* Download Official DPR Button */}
                <button
                  onClick={() => handleDownloadDPR(selectedProposal)}
                  disabled={downloadingDpr}
                  className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <FileText className="w-4 h-4 text-blue-400" />
                  <span>{downloadingDpr ? 'Generating PDF from Database...' : 'Download Bank Appraisal DPR (PDF)'}</span>
                </button>
              </div>

              {/* Action Buttons for Bank Officer */}
              <div className="pt-3 border-t border-slate-100 space-y-2">
                <span className="text-[11px] font-bold text-slate-600 block">
                  Update Sanction Decision in Database:
                </span>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    disabled={actionLoading}
                    onClick={() => handleAction(selectedProposal.id, 'SANCTIONED')}
                    className={`py-2.5 rounded-xl font-bold text-[11px] shadow-sm transition-all text-white ${
                      selectedProposal.status === 'SANCTIONED'
                        ? 'bg-emerald-700 ring-2 ring-emerald-400'
                        : 'bg-emerald-600 hover:bg-emerald-700'
                    }`}
                  >
                    ✓ Sanction
                  </button>
                  <button
                    disabled={actionLoading}
                    onClick={() => handleAction(selectedProposal.id, 'CLARIFICATION')}
                    className={`py-2.5 rounded-xl font-bold text-[11px] shadow-sm transition-all text-white ${
                      selectedProposal.status === 'CLARIFICATION'
                        ? 'bg-amber-600 ring-2 ring-amber-300'
                        : 'bg-amber-500 hover:bg-amber-600'
                    }`}
                  >
                    ⚠️ Query
                  </button>
                  <button
                    disabled={actionLoading}
                    onClick={() => handleAction(selectedProposal.id, 'DECLINED')}
                    className={`py-2.5 rounded-xl font-bold text-[11px] shadow-sm transition-all text-white ${
                      selectedProposal.status === 'DECLINED'
                        ? 'bg-rose-700 ring-2 ring-rose-400'
                        : 'bg-rose-600 hover:bg-rose-700'
                    }`}
                  >
                    ✕ Decline
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="p-8 text-center text-xs text-slate-400">
              Select a proposal from the list to view full credit appraisal details.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
