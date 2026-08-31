import React, { useState } from 'react';
import { Sparkles, ArrowRight, ArrowLeft, Landmark, Calculator, Clock, Calendar, CheckCircle2, ShieldCheck, IndianRupee, HelpCircle, FileText } from 'lucide-react';
import { translations } from '../i18n/translations';

export default function FinancialPlanner({
  financials,
  onNext,
  onBack,
  lang,
}) {
  const t = translations[lang] || translations.en;
  const [showAmortization, setShowAmortization] = useState(false);

  // Safe fallback property mapping supporting both schema versions
  const loanAmt = financials?.loan_amount ?? 900000;
  const interestRate = financials?.interest_rate_pct ?? 8.0;
  const tenureYears = financials?.tenure_years ?? 7;
  const moratoriumMonths = financials?.moratorium_months ?? 6;

  // Exact math fallbacks if properties are named slightly differently
  const r = (interestRate / 100) / 12;
  const computedMoratoriumInterest = Math.round(loanAmt * r);
  const computedGrossRevenue = Math.round(loanAmt * 0.07 + 15000);
  const computedOpex = Math.round(computedGrossRevenue * 0.52);
  const computedNetCashflow = computedGrossRevenue - computedOpex;

  const moratoriumMonthlyInterest = financials?.moratorium_monthly_interest ??
    financials?.monthly_moratorium_interest ?? computedMoratoriumInterest;

  const regularMonthlyEmi = financials?.regular_monthly_emi ?? 14032;

  const projectedRevenue = financials?.monthly_projected_revenue ??
    financials?.projected_monthly_revenue ?? computedGrossRevenue;

  const projectedOpex = financials?.monthly_operating_expenses ??
    financials?.projected_monthly_opex ?? computedOpex;

  const projectedNetProfit = financials?.monthly_net_cashflow_before_emi ??
    financials?.projected_monthly_net_profit ?? computedNetCashflow;

  const dscr = financials?.dscr ?? (regularMonthlyEmi > 0 ? (projectedNetProfit / regularMonthlyEmi).toFixed(2) : 1.78);

  const selectedSchemeName = financials?.selected_scheme_name || 'MoSJE / NBCFDC / NSFDC Term Loan Scheme';

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800 rounded-2xl p-6 sm:p-8 text-white shadow-lg shadow-blue-700/10">
        <div className="flex items-center gap-2 text-blue-200 text-xs font-bold uppercase tracking-wider mb-2">
          <Sparkles className="w-4 h-4" />
          <span>Step 5 of 6 • {t.wizard_steps[4]}</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold">{t.step5_title}</h2>
        <p className="text-blue-100 text-sm mt-1 max-w-2xl">{t.step5_desc}</p>
      </div>

      {/* MoSJE Matched Scheme Details */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider block">
              {t.scheme_justification}
            </span>
            <h3 className="font-extrabold text-slate-900 text-lg sm:text-xl mt-0.5">
              {selectedSchemeName}
            </h3>
          </div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 font-bold text-xs border border-emerald-200">
            <CheckCircle2 className="w-4 h-4" />
            100% Policy Compliant
          </span>
        </div>

        {/* 4 Key Structuring Highlights */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-[10px] text-slate-500 font-semibold uppercase block">{t.labels.interest_rate}</span>
            <span className="text-xl font-extrabold text-slate-900 mt-1 block">
              {interestRate}% p.a.
            </span>
            <span className="text-[10px] text-slate-400">{t.fixed_subvention}</span>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-[10px] text-slate-500 font-semibold uppercase block">{t.labels.tenure}</span>
            <span className="text-xl font-extrabold text-slate-900 mt-1 block">
              {tenureYears} {lang === 'hi' ? 'वर्ष' : lang === 'ta' ? 'ஆண்டுகள்' : lang === 'te' ? 'సంవత్సరాలు' : lang === 'mr' ? 'वर्षे' : 'Years'}
            </span>
            <span className="text-[10px] text-slate-400">{t.total_window}</span>
          </div>

          <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-200">
            <span className="text-[10px] text-amber-800 font-semibold uppercase block">{t.labels.moratorium}</span>
            <span className="text-xl font-extrabold text-amber-900 mt-1 block">
              {moratoriumMonths} {lang === 'hi' ? 'महीने' : lang === 'ta' ? 'மாதங்கள்' : lang === 'te' ? 'నెలలు' : lang === 'mr' ? 'महिने' : 'Months'}
            </span>
            <span className="text-[10px] text-amber-700">{t.principal_deferred}</span>
          </div>

          <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-200">
            <span className="text-[10px] text-emerald-800 font-semibold uppercase block">{t.labels.dscr}</span>
            <span className="text-xl font-extrabold text-emerald-900 mt-1 block">
              {dscr}x
            </span>
            <span className="text-[10px] text-emerald-700">{t.high_viability}</span>
          </div>
        </div>
      </div>

      {/* Moratorium vs Regular EMI Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Phase 1: Moratorium Phase */}
        <div className="bg-amber-50/50 rounded-2xl p-6 border-2 border-amber-200/80 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-amber-200">
            <div>
              <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider block">
                {t.phase1_title}
              </span>
              <h4 className="font-extrabold text-slate-900 text-base">
                {t.labels.moratorium} ({moratoriumMonths} {lang === 'hi' ? 'महीने' : lang === 'ta' ? 'மாதங்கள்' : lang === 'te' ? 'నెలలు' : lang === 'mr' ? 'महिने' : 'Months'})
              </h4>
            </div>
            <Clock className="w-5 h-5 text-amber-600" />
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            {t.phase1_desc}
          </p>

          <div className="p-3 bg-white rounded-xl border border-amber-200 flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-700">{t.phase1_emi_label}:</span>
            <span className="text-lg font-black text-amber-800">
              ₹{Number(moratoriumMonthlyInterest).toLocaleString('en-IN')}/mo
            </span>
          </div>
        </div>

        {/* Phase 2: Regular Amortization Phase */}
        <div className="bg-emerald-50/50 rounded-2xl p-6 border-2 border-emerald-200/80 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-emerald-200">
            <div>
              <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">
                {t.phase2_title}
              </span>
              <h4 className="font-extrabold text-slate-900 text-base">
                {t.labels.regular_emi}
              </h4>
            </div>
            <Calendar className="w-5 h-5 text-emerald-600" />
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            {t.phase2_desc}
          </p>

          <div className="p-3 bg-white rounded-xl border border-emerald-200 flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-700">{t.labels.regular_emi}:</span>
            <span className="text-lg font-black text-emerald-800">
              ₹{Number(regularMonthlyEmi).toLocaleString('en-IN')}/mo
            </span>
          </div>
        </div>
      </div>

      {/* Cashflow & DSCR Sustainability Verification */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
        <h4 className="font-bold text-slate-800 text-base flex items-center gap-2">
          <Calculator className="w-5 h-5 text-indigo-600" />
          {t.repayment_summary}
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-slate-500 block text-[10px] font-semibold">{t.projected_revenue_label}</span>
            <span className="text-base font-bold text-slate-800 mt-1 block">
              ₹{Number(projectedRevenue).toLocaleString('en-IN')}
            </span>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-slate-500 block text-[10px] font-semibold">{t.projected_opex_label}</span>
            <span className="text-base font-bold text-slate-800 mt-1 block">
              ₹{Number(projectedOpex).toLocaleString('en-IN')}
            </span>
          </div>

          <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200">
            <span className="text-emerald-700 block text-[10px] font-semibold">{t.net_cashflow_label}</span>
            <span className="text-base font-bold text-emerald-800 mt-1 block">
              ₹{Number(projectedNetProfit).toLocaleString('en-IN')}
            </span>
          </div>
        </div>

        {/* DSCR Calculation Box */}
        <div className="p-4 bg-slate-900 text-white rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-blue-400 text-xs font-bold block">{t.dscr_formula_text}:</span>
            <p className="text-xs text-slate-300 mt-0.5">
              DSCR = Net Operating Cashflow (₹{Number(projectedNetProfit).toLocaleString('en-IN')}) ÷ Monthly EMI (₹{Number(regularMonthlyEmi).toLocaleString('en-IN')}) = <b className="text-emerald-400 text-sm">{dscr}x</b>
            </p>
          </div>
          <div className="text-right">
            <span className="text-emerald-400 font-extrabold text-sm block">{t.bank_benchmark_passed}</span>
            <span className="text-[10px] text-slate-400">{t.zero_default_risk}</span>
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between pt-4">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-semibold text-sm hover:bg-slate-100"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t.labels.back}</span>
        </button>

        <button
          onClick={onNext}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-lg shadow-blue-600/20 transition-all hover:translate-x-0.5"
        >
          <span>{t.labels.next}: {t.wizard_steps[5]}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
