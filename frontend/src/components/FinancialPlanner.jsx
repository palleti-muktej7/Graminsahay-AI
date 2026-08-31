import React, { useState } from 'react';
import {
  Sparkles, ArrowRight, ArrowLeft, Landmark, Percent, Calendar, Clock,
  Coins, CheckCircle, ShieldCheck, DollarSign, BarChart3, TrendingUp
} from 'lucide-react';
import { translations } from '../i18n/translations';

export default function FinancialPlanner({
  financials,
  onNext,
  onBack,
  lang,
}) {
  const t = translations[lang] || translations.en;
  const [scheduleView, setScheduleView] = useState('yearly'); // 'yearly' or 'monthly'

  const fin = financials;
  if (!fin) return null;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-700 to-indigo-800 rounded-2xl p-6 sm:p-8 text-white shadow-lg shadow-blue-700/10">
        <div className="flex items-center gap-2 text-blue-200 text-xs font-bold uppercase tracking-wider mb-2">
          <Sparkles className="w-4 h-4" />
          <span>Step 5 of 6 • {t.wizard_steps[4]}</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold">{t.step5_title}</h2>
        <p className="text-blue-100 text-sm mt-1 max-w-2xl">{t.step5_desc}</p>
      </div>

      {/* Selected Government Scheme Card */}
      <div className="bg-white rounded-2xl p-6 border-2 border-blue-500/30 bg-gradient-to-br from-white to-blue-50/30 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800">
              Matched Official Scheme
            </span>
            <h3 className="text-xl font-extrabold text-slate-900 mt-1">
              {fin.selected_scheme_name}
            </h3>
            <p className="text-xs text-slate-500">
              Nodal Channel: {fin.nodal_agency}
            </p>
          </div>

          <div className="text-left sm:text-right">
            <span className="text-xs text-slate-500 block">Concessional Interest Rate</span>
            <span className="text-2xl font-black text-blue-600">
              {fin.interest_rate_pct}% p.a.
            </span>
          </div>
        </div>

        {/* 4 Core Scheme Parameters */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3 bg-white rounded-xl border border-slate-200">
            <span className="text-[11px] font-semibold text-slate-500 block">Project Outlay</span>
            <span className="text-base font-extrabold text-slate-800">
              ₹{fin.total_project_cost?.toLocaleString('en-IN')}
            </span>
            <span className="text-[10px] text-slate-400">100% Capital Base</span>
          </div>

          <div className="p-3 bg-white rounded-xl border border-slate-200">
            <span className="text-[11px] font-semibold text-slate-500 block">Own Equity Margin (10%)</span>
            <span className="text-base font-extrabold text-emerald-600">
              ₹{fin.available_margin_capital?.toLocaleString('en-IN')}
            </span>
            <span className="text-[10px] text-emerald-600 font-medium">Beneficiary Share</span>
          </div>

          <div className="p-3 bg-white rounded-xl border border-slate-200">
            <span className="text-[11px] font-semibold text-slate-500 block">Loan Component (90%)</span>
            <span className="text-base font-extrabold text-blue-600">
              ₹{fin.loan_amount?.toLocaleString('en-IN')}
            </span>
            <span className="text-[10px] text-blue-600 font-medium">MoSJE Loan Share</span>
          </div>

          <div className="p-3 bg-white rounded-xl border border-slate-200">
            <span className="text-[11px] font-semibold text-slate-500 block">Tenure & Moratorium</span>
            <span className="text-base font-extrabold text-indigo-600">
              {fin.tenure_years} Yrs ({fin.moratorium_months} Mo. Grace)
            </span>
            <span className="text-[10px] text-indigo-500">{fin.tenure_months} Total Months</span>
          </div>
        </div>

        {/* Capital Split: Asset vs Working Capital */}
        <div className="pt-2">
          <span className="text-xs font-bold text-slate-700 block mb-1.5">
            Capital Outlay Breakdown:
          </span>
          <div className="w-full bg-slate-100 h-3 rounded-full flex overflow-hidden">
            <div
              className="bg-blue-600 h-full"
              style={{ width: `${(fin.capital_asset_component / fin.total_project_cost) * 100}%` }}
              title="Machinery & Fixed Assets"
            />
            <div
              className="bg-emerald-500 h-full"
              style={{ width: `${(fin.working_capital_component / fin.total_project_cost) * 100}%` }}
              title="Working Capital Buffer"
            />
          </div>
          <div className="flex justify-between text-[11px] text-slate-600 mt-1">
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
              Fixed Capital Assets: <b>₹{fin.capital_asset_component?.toLocaleString('en-IN')}</b> (70%)
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              Working Capital Margin: <b>₹{fin.working_capital_component?.toLocaleString('en-IN')}</b> (30%)
            </span>
          </div>
        </div>
      </div>

      {/* Cashflow & DSCR Repayment Capacity Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Moratorium Grace Phase */}
        <div className="bg-amber-50/80 rounded-2xl p-5 border border-amber-200 space-y-2">
          <div className="flex items-center gap-2 text-amber-800">
            <Clock className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wider">Phase 1: Moratorium</span>
          </div>
          <span className="text-2xl font-extrabold text-amber-900 block">
            ₹{fin.moratorium_monthly_interest?.toLocaleString('en-IN')} /mo
          </span>
          <p className="text-xs text-amber-800">
            Applicable for first <b>{fin.moratorium_months} months</b>. Principal repayment is paused; only simple interest is serviced to stabilize early launch operations.
          </p>
        </div>

        {/* Regular EMI Phase */}
        <div className="bg-blue-50/80 rounded-2xl p-5 border border-blue-200 space-y-2">
          <div className="flex items-center gap-2 text-blue-800">
            <Calendar className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wider">Phase 2: Regular EMI</span>
          </div>
          <span className="text-2xl font-extrabold text-blue-900 block">
            ₹{fin.regular_monthly_emi?.toLocaleString('en-IN')} /mo
          </span>
          <p className="text-xs text-blue-800">
            From <b>Month {fin.moratorium_months + 1} to Month {fin.tenure_months}</b>. Includes reducing principal + interest component.
          </p>
        </div>

        {/* DSCR Score */}
        <div className="bg-emerald-50/80 rounded-2xl p-5 border border-emerald-200 space-y-2">
          <div className="flex items-center gap-2 text-emerald-800">
            <TrendingUp className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wider">Repayment Safety (DSCR)</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-emerald-900">
              {fin.dscr}x
            </span>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-800">
              {fin.dscr >= 1.5 ? 'EXCELLENT' : 'ADEQUATE'}
            </span>
          </div>
          <p className="text-xs text-emerald-800">
            Estimated Monthly Net Profit (₹{fin.monthly_net_cashflow_before_emi?.toLocaleString('en-IN')}) provides strong coverage for the ₹{fin.regular_monthly_emi?.toLocaleString('en-IN')} EMI.
          </p>
        </div>
      </div>

      {/* Amortization Schedule Table */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
          <div>
            <h3 className="font-bold text-slate-800 text-base">
              Repayment Roadmap & Amortization Schedule
            </h3>
            <p className="text-xs text-slate-500">
              Complete debt reduction tracking accounting for the {fin.moratorium_months}-month moratorium.
            </p>
          </div>

          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
            <button
              onClick={() => setScheduleView('yearly')}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                scheduleView === 'yearly'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Yearly Summary ({fin.tenure_years} Yrs)
            </button>
            <button
              onClick={() => setScheduleView('monthly')}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                scheduleView === 'monthly'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Month 1–12 Detail
            </button>
          </div>
        </div>

        {/* Schedule Display */}
        <div className="overflow-x-auto">
          {scheduleView === 'yearly' ? (
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Year</th>
                  <th className="py-2.5 px-3">Principal Repaid</th>
                  <th className="py-2.5 px-3">Interest Paid</th>
                  <th className="py-2.5 px-3">Total Annual Outflow</th>
                  <th className="py-2.5 px-3">Closing Loan Balance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {fin.yearly_summaries?.map((y) => (
                  <tr key={y.year} className="hover:bg-slate-50">
                    <td className="py-2.5 px-3 font-bold text-slate-800">Year {y.year}</td>
                    <td className="py-2.5 px-3 text-slate-700">₹{y.principal_repaid?.toLocaleString('en-IN')}</td>
                    <td className="py-2.5 px-3 text-slate-500">₹{y.interest_paid?.toLocaleString('en-IN')}</td>
                    <td className="py-2.5 px-3 font-semibold text-slate-800">₹{y.total_payment?.toLocaleString('en-IN')}</td>
                    <td className="py-2.5 px-3 font-bold text-blue-600">₹{y.closing_balance?.toLocaleString('en-IN')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Month</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">Opening Balance</th>
                  <th className="py-2.5 px-3">Interest Paid</th>
                  <th className="py-2.5 px-3">Principal Paid</th>
                  <th className="py-2.5 px-3">Monthly Outflow</th>
                  <th className="py-2.5 px-3">Closing Balance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {fin.repayment_schedule_preview?.map((m) => (
                  <tr
                    key={m.month}
                    className={`hover:bg-slate-50 ${m.is_moratorium ? 'bg-amber-50/40' : ''}`}
                  >
                    <td className="py-2.5 px-3 font-bold text-slate-800">Month {m.month}</td>
                    <td className="py-2.5 px-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          m.is_moratorium
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {m.is_moratorium ? 'Moratorium Grace' : 'Regular EMI'}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-slate-600">₹{m.opening_balance?.toLocaleString('en-IN')}</td>
                    <td className="py-2.5 px-3 text-slate-500">₹{m.interest_payable?.toLocaleString('en-IN')}</td>
                    <td className="py-2.5 px-3 text-slate-700">₹{m.principal_payable?.toLocaleString('en-IN')}</td>
                    <td className="py-2.5 px-3 font-bold text-slate-900">₹{m.total_monthly_commitment?.toLocaleString('en-IN')}</td>
                    <td className="py-2.5 px-3 font-bold text-blue-600">₹{m.closing_balance?.toLocaleString('en-IN')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
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
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-sm shadow-lg shadow-blue-700/20 transition-all hover:translate-x-0.5"
        >
          <span>{t.labels.next}: {t.wizard_steps[5]}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
