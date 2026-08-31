import React, { useState } from 'react';
import {
  Sparkles, ArrowLeft, Download, CheckCircle, AlertTriangle, XCircle,
  FileText, ShieldCheck, Printer, RefreshCw, Award, Landmark, Check
} from 'lucide-react';
import { translations } from '../i18n/translations';
import { downloadDPRPdf } from '../services/api';

export default function DecisionVerdict({
  fullData,
  onBack,
  onReset,
  lang,
}) {
  const t = translations[lang] || translations.en;
  const [downloading, setDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  if (!fullData) return null;

  const vd = fullData.verdict;
  const fin = fullData.financials;
  const loc = fullData.location;

  const isGo = vd.verdict === 'GO';
  const isCaution = vd.verdict === 'CAUTION';
  const isNoGo = vd.verdict === 'NO_GO';

  const handleDownload = async () => {
    try {
      setDownloading(true);
      await downloadDPRPdf(fullData);
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 4000);
    } catch (e) {
      alert('Error downloading PDF DPR: ' + e.message);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header Verdict Card */}
      <div
        className={`rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden ${
          isGo
            ? 'bg-gradient-to-r from-emerald-600 via-green-600 to-teal-700 shadow-emerald-600/20'
            : isCaution
            ? 'bg-gradient-to-r from-amber-600 via-yellow-600 to-amber-700 shadow-amber-600/20'
            : 'bg-gradient-to-r from-rose-600 via-red-600 to-rose-700 shadow-rose-600/20'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold uppercase tracking-wider">
              {isGo && <CheckCircle className="w-3.5 h-3.5" />}
              {isCaution && <AlertTriangle className="w-3.5 h-3.5" />}
              {isNoGo && <XCircle className="w-3.5 h-3.5" />}
              <span>Evidence-First Viability Verdict</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
              {vd.headline}
            </h2>

            <p className="text-white/90 text-sm max-w-xl">
              Evaluated for <b>{fullData.business_name}</b> in <b>{loc.village}, {loc.district}</b> with ₹{fin.available_margin_capital?.toLocaleString('en-IN')} equity.
            </p>
          </div>

          {/* Viability Gauge Badge */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl text-center min-w-[140px] shrink-0">
            <span className="text-[11px] font-bold uppercase tracking-wider block text-white/80">
              Viability Score
            </span>
            <div className="text-4xl font-black mt-0.5">
              {vd.viability_score}<span className="text-xl font-normal text-white/70">/100</span>
            </div>
            <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full inline-block mt-1 font-semibold">
              Bank Ready: {vd.bankable_readiness_score}%
            </span>
          </div>
        </div>
      </div>

      {/* Action Download & Summary Strip */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-bold text-slate-800 text-base flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            Official MoSJE Detailed Project Report (DPR)
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Complete bankable project report formatted with scheme clauses, SWOT, amortization, and banker verification fields.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleDownload}
            disabled={downloading}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm text-white transition-all shadow-md ${
              downloadSuccess
                ? 'bg-emerald-600 shadow-emerald-600/20'
                : 'bg-blue-600 hover:bg-blue-700 shadow-blue-600/20 hover:translate-y-[-1px]'
            }`}
          >
            {downloading ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : downloadSuccess ? (
              <Check className="w-4 h-4 stroke-[3]" />
            ) : (
              <Download className="w-4 h-4" />
            )}
            <span>
              {downloading
                ? 'Generating PDF...'
                : downloadSuccess
                ? 'Downloaded!'
                : t.labels.download_dpr}
            </span>
          </button>
        </div>
      </div>

      {/* Granular Strengths & Critical Advice Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Key Positive Drivers */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <CheckCircle className="w-5 h-5 text-emerald-600" />
            <h4 className="font-bold text-slate-800 text-sm">Key Feasibility Drivers</h4>
          </div>
          <ul className="space-y-2 text-xs text-slate-700">
            {vd.key_positives?.map((pos, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                <span>{pos}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Critical Mitigation Advice */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
            <h4 className="font-bold text-slate-800 text-sm">Actionable Banker & Operational Advice</h4>
          </div>
          <ul className="space-y-2 text-xs text-slate-700">
            {vd.critical_advice?.map((adv, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                <span>{adv}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Snapshot Banking Card */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-md space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Landmark className="w-5 h-5 text-blue-400" />
            <h4 className="font-bold text-sm">Bank Loan Appraisal Summary</h4>
          </div>
          <span className="text-xs bg-slate-800 text-slate-300 px-3 py-1 rounded-full">
            Scheme ID: {fin.selected_scheme_id}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div>
            <span className="text-slate-400 block">Total Outlay</span>
            <span className="text-base font-bold text-white mt-0.5 block">
              ₹{fin.total_project_cost?.toLocaleString('en-IN')}
            </span>
          </div>
          <div>
            <span className="text-slate-400 block">Concessional Loan</span>
            <span className="text-base font-bold text-blue-400 mt-0.5 block">
              ₹{fin.loan_amount?.toLocaleString('en-IN')}
            </span>
          </div>
          <div>
            <span className="text-slate-400 block">Regular Monthly EMI</span>
            <span className="text-base font-bold text-emerald-400 mt-0.5 block">
              ₹{fin.regular_monthly_emi?.toLocaleString('en-IN')}
            </span>
          </div>
          <div>
            <span className="text-slate-400 block">Moratorium Period</span>
            <span className="text-base font-bold text-amber-400 mt-0.5 block">
              {fin.moratorium_months} Months Grace
            </span>
          </div>
        </div>
      </div>

      {/* Footer Navigation & Restart */}
      <div className="flex items-center justify-between pt-4">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-semibold text-sm hover:bg-slate-100"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t.labels.back}</span>
        </button>

        <button
          onClick={onReset}
          className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-100 transition-all"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Analyze Another Business Idea</span>
        </button>
      </div>
    </div>
  );
}
