import React, { useState } from 'react';
import {
  Sparkles, Award, FileText, Download, CheckCircle, AlertTriangle, XCircle,
  TrendingUp, Compass, ArrowLeft, RefreshCw, Landmark, IndianRupee, ShieldCheck, MapPin, CheckCircle2
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

  const verdict = fullData?.verdict || {
    verdict: 'GO',
    viability_score: 92,
    bankable_readiness_score: 95,
    summary_verdict: '🟢 HIGHLY RECOMMENDED — Strong Market & Financial Viability',
    key_success_factors: [
      'Catchment population (16,000+) provides adequate recurring customer base',
      'DSCR is 1.78x (exceeds bank benchmark of 1.4x for safety)',
      '10% beneficiary equity provides ₹9,00,000 MoSJE concessional debt leverage',
      '6-month moratorium buffers cashflow during enterprise gestation'
    ],
    recommended_channel_scheme: 'MoSJE / NBCFDC Term Loan Scheme (8.0% p.a., 7-Yr Tenure)',
  };

  const applicant = fullData?.entrepreneur?.full_name || 'Ramesh Kumar';
  const bizName = fullData?.business_name || 'Dairy Farming & Milk Processing';
  const location = fullData?.location || { village: 'Melattur', district: 'Thanjavur', state: 'Tamil Nadu' };
  const financials = fullData?.financials || {
    available_margin_capital: 100000,
    total_project_cost: 1000000,
    loan_amount: 900000,
    interest_rate_pct: 8.0,
    regular_monthly_emi: 14032,
    dscr: 1.78
  };

  const handleDownloadDPR = async () => {
    setDownloading(true);
    try {
      if (fullData) {
        await downloadDPRPdf(fullData);
      } else {
        alert('DPR generation payload not loaded. Please try recalculating.');
      }
    } catch (err) {
      alert('Failed to generate PDF DPR. Please ensure backend is running.');
    } finally {
      setDownloading(false);
    }
  };

  const getVerdictStyle = () => {
    switch (verdict.verdict) {
      case 'GO':
        return {
          bg: 'bg-emerald-50 border-emerald-300 text-emerald-950',
          badge: 'bg-emerald-600 text-white',
          icon: CheckCircle,
          title: t.verdict_go_text || 'HIGHLY RECOMMENDED',
        };
      case 'CAUTION':
        return {
          bg: 'bg-amber-50 border-amber-300 text-amber-950',
          badge: 'bg-amber-600 text-white',
          icon: AlertTriangle,
          title: t.verdict_caution_text || 'CONDITIONALLY VIABLE',
        };
      default:
        return {
          bg: 'bg-rose-50 border-rose-300 text-rose-950',
          badge: 'bg-rose-600 text-white',
          icon: XCircle,
          title: t.verdict_nogo_text || 'HIGH RISK / NOT RECOMMENDED',
        };
    }
  };

  const vStyle = getVerdictStyle();
  const Icon = vStyle.icon;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-emerald-300 text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>Step 6 of 6 • {t.wizard_steps[5]}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {t.step6_title}
          </h2>
          <p className="text-emerald-100 text-xs sm:text-sm mt-1 max-w-2xl">
            {t.step6_desc}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleDownloadDPR}
            disabled={downloading}
            className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-sm shadow-xl shadow-blue-600/30 transition-all hover:scale-[1.02]"
          >
            <FileText className="w-5 h-5 text-blue-200" />
            <span>{downloading ? 'Generating Official DPR...' : t.labels.download_dpr}</span>
          </button>
        </div>
      </div>

      {/* Main Verdict Card */}
      <div className={`rounded-3xl p-6 sm:p-8 border-2 shadow-sm ${vStyle.bg} space-y-6`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center">
              <Icon className="w-7 h-7 text-emerald-600" />
            </div>
            <div>
              <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider mb-1 ${vStyle.badge}`}>
                {verdict.verdict} VERDICT
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                {vStyle.title}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-slate-500 block">{t.labels.verdict_score}</span>
              <span className="text-3xl font-black text-slate-900">{verdict.viability_score}/100</span>
            </div>
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-slate-500 block">Bankable Readiness</span>
              <span className="text-3xl font-black text-emerald-700">{verdict.bankable_readiness_score}%</span>
            </div>
          </div>
        </div>

        {/* Project Summary Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white p-4 rounded-2xl border border-slate-200 text-xs">
          <div>
            <span className="text-slate-400 block text-[10px] font-semibold">{t.labels.full_name}:</span>
            <span className="font-bold text-slate-800">{applicant}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] font-semibold">Business Unit:</span>
            <span className="font-bold text-slate-800">{bizName}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] font-semibold">{t.labels.total_project_cost}:</span>
            <span className="font-bold text-slate-800">₹{financials.total_project_cost?.toLocaleString('en-IN')}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] font-semibold">{t.labels.loan_amount}:</span>
            <span className="font-extrabold text-blue-700">₹{financials.loan_amount?.toLocaleString('en-IN')} (90%)</span>
          </div>
        </div>

        {/* Key Success Factors & Bank Feasibility Evidence */}
        <div className="space-y-3">
          <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            Key Success Factors & Bank Appraisal Highlights:
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {verdict.key_success_factors?.map((factor, idx) => (
              <div key={idx} className="p-3 bg-white rounded-xl border border-slate-200 text-xs text-slate-800 flex items-start gap-2">
                <span className="text-emerald-600 font-bold mt-0.5">✓</span>
                <span className="font-medium leading-relaxed">{factor}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Official DPR Download CTA Card */}
        <div className="p-5 bg-gradient-to-r from-slate-900 to-indigo-950 rounded-2xl text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-lg">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-blue-400 text-xs font-bold uppercase tracking-wider">
              <Landmark className="w-4 h-4" />
              <span>{t.dpr_ready_banner}</span>
            </div>
            <p className="text-xs text-slate-300">
              Includes executive summary, location demographics, competitor density, SWOT, moratorium amortization, and bank DSCR.
            </p>
          </div>

          <button
            onClick={handleDownloadDPR}
            disabled={downloading}
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shrink-0 shadow-md transition-all"
          >
            <Download className="w-4 h-4" />
            <span>{downloading ? 'Downloading PDF...' : t.labels.download_dpr}</span>
          </button>
        </div>
      </div>

      {/* Navigation & Reset Buttons */}
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
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm shadow-md transition-all"
        >
          <RefreshCw className="w-4 h-4 text-blue-400" />
          <span>{t.start_new_plan}</span>
        </button>
      </div>
    </div>
  );
}
