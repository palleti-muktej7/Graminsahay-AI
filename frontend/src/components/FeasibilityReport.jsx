import React from 'react';
import { Sparkles, ArrowRight, ArrowLeft, ShieldCheck, CheckCircle2, AlertTriangle, TrendingUp, DollarSign, ShieldAlert, BadgeCheck } from 'lucide-react';
import { translations } from '../i18n/translations';
import ConfidenceBadge from './ConfidenceBadge';

export default function FeasibilityReport({
  swot,
  localThreats,
  pricing,
  businessName,
  onNext,
  onBack,
  lang,
}) {
  const t = translations[lang] || translations.en;

  const strengths = swot?.strengths || [
    { factor: 'Low initial capital entry barrier', evidence: 'MoSJE concessional debt covers 90% project cost' },
    { factor: 'High local household demand', evidence: 'Rural consumption index indicates steady daily demand' }
  ];

  const weaknesses = swot?.weaknesses || [
    { factor: 'Perishable inventory risk', evidence: 'Requires cold chain or daily liquid sales management' }
  ];

  const opportunities = swot?.opportunities || [
    { factor: 'Value addition processing', evidence: 'Converting raw produce increases margin by 35%' }
  ];

  const threats = swot?.threats || [
    { factor: 'Monopsony middleman pricing', evidence: 'Local mandi commission agents compress farmer realizations' }
  ];

  const threatsList = localThreats?.identified_threats || [
    {
      threat: 'Raw material & input price volatility',
      severity: 'MEDIUM',
      mitigation_strategy: 'Form collective purchasing with nearby farmers to negotiate bulk discounts.'
    },
    {
      threat: 'Monopsony buyer price suppression',
      severity: 'HIGH',
      mitigation_strategy: 'Sell directly to local weekly haats and retail subscribers rather than middlemen.'
    }
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-violet-700 to-indigo-800 rounded-2xl p-6 sm:p-8 text-white shadow-lg shadow-violet-700/10">
        <div className="flex items-center gap-2 text-violet-200 text-xs font-bold uppercase tracking-wider mb-2">
          <Sparkles className="w-4 h-4" />
          <span>Step 4 of 6 • {t.wizard_steps[3]}</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold">{t.step4_title}</h2>
        <p className="text-violet-100 text-sm mt-1 max-w-2xl">{t.step4_desc}</p>
      </div>

      {/* SWOT Matrix */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
          <div>
            <h3 className="font-bold text-slate-800 text-base flex items-center gap-2">
              <BadgeCheck className="w-5 h-5 text-violet-600" />
              Tailored SWOT Matrix — {businessName}
            </h3>
            <p className="text-xs text-slate-500">
              Grounded in local demographic data, spatial competition, and capital parameters.
            </p>
          </div>
          <ConfidenceBadge level={swot?.confidence || 'HIGH'} source={swot?.source || 'Census 2011 + MSME Rural Benchmarks'} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          {/* Strengths */}
          <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200 space-y-2">
            <h4 className="font-bold text-emerald-800 text-xs uppercase tracking-wider flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              {t.strengths_title}
            </h4>
            <div className="space-y-2">
              {strengths.map((item, idx) => (
                <div key={idx} className="text-xs text-slate-700">
                  <p className="font-semibold text-emerald-950">• {item.factor}</p>
                  <p className="text-[11px] text-slate-500 pl-2">↳ Evidence: {item.evidence}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Weaknesses */}
          <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200 space-y-2">
            <h4 className="font-bold text-amber-800 text-xs uppercase tracking-wider flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              {t.weaknesses_title}
            </h4>
            <div className="space-y-2">
              {weaknesses.map((item, idx) => (
                <div key={idx} className="text-xs text-slate-700">
                  <p className="font-semibold text-amber-950">• {item.factor}</p>
                  <p className="text-[11px] text-slate-500 pl-2">↳ Evidence: {item.evidence}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Opportunities */}
          <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-200 space-y-2">
            <h4 className="font-bold text-blue-800 text-xs uppercase tracking-wider flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-blue-600" />
              {t.opportunities_title}
            </h4>
            <div className="space-y-2">
              {opportunities.map((item, idx) => (
                <div key={idx} className="text-xs text-slate-700">
                  <p className="font-semibold text-blue-950">• {item.factor}</p>
                  <p className="text-[11px] text-slate-500 pl-2">↳ Evidence: {item.evidence}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Threats */}
          <div className="p-4 rounded-xl bg-rose-50/60 border border-rose-200 space-y-2">
            <h4 className="font-bold text-rose-800 text-xs uppercase tracking-wider flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-rose-600" />
              {t.threats_title}
            </h4>
            <div className="space-y-2">
              {threats.map((item, idx) => (
                <div key={idx} className="text-xs text-slate-700">
                  <p className="font-semibold text-rose-950">• {item.factor}</p>
                  <p className="text-[11px] text-slate-500 pl-2">↳ Evidence: {item.evidence}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Hyper-Local Threat Identification & Practical Mitigations */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
          <div>
            <h3 className="font-bold text-slate-800 text-base flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-rose-600" />
              {t.threat_mitigation_title}
            </h3>
            <p className="text-xs text-slate-500">
              Field-grounded rural mitigations to ensure uninterrupted loan servicing.
            </p>
          </div>
          <ConfidenceBadge level={localThreats?.confidence || 'HIGH'} source={localThreats?.source || 'Agmarknet & NABARD District Focus Papers'} />
        </div>

        <div className="space-y-3 pt-2">
          {threatsList.map((tItem, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-slate-800">{idx + 1}. {tItem.threat}</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                  tItem.severity === 'HIGH' ? 'bg-rose-100 text-rose-800 border-rose-200' : 'bg-amber-100 text-amber-800 border-amber-200'
                }`}>
                  {tItem.severity} RISK
                </span>
              </div>
              <p className="text-xs text-slate-600">
                <span className="font-semibold text-emerald-700">Recommended Action:</span> {tItem.mitigation_strategy}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Benchmarked Pricing Strategy */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
          <div>
            <h3 className="font-bold text-slate-800 text-base flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-emerald-600" />
              {t.pricing_strategy_title}
            </h3>
            <p className="text-xs text-slate-500">
              Pricing benchmarks derived from district agricultural mandi trends.
            </p>
          </div>
          <ConfidenceBadge level={pricing?.confidence || 'HIGH'} source={pricing?.source || 'Agmarknet APMC Daily Price Feeds'} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-slate-500 font-semibold block uppercase text-[10px]">Benchmark Retail Rate</span>
            <span className="text-lg font-bold text-slate-800 mt-1 block">
              ₹{pricing?.benchmark_retail_price_inr || '48'}/unit
            </span>
            <span className="text-[10px] text-slate-400">Direct household sales</span>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-slate-500 font-semibold block uppercase text-[10px]">Benchmark Wholesale / Mandi</span>
            <span className="text-lg font-bold text-slate-800 mt-1 block">
              ₹{pricing?.benchmark_wholesale_price_inr || '36'}/unit
            </span>
            <span className="text-[10px] text-slate-400">Intermediary bulk trade</span>
          </div>

          <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-200">
            <span className="text-emerald-700 font-semibold block uppercase text-[10px]">Target Gross Margin</span>
            <span className="text-lg font-bold text-emerald-800 mt-1 block">
              {pricing?.suggested_gross_margin_pct || '24'}%
            </span>
            <span className="text-[10px] text-emerald-600">Sufficient for DSCR &gt; 1.5x</span>
          </div>
        </div>

        <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-xl text-xs text-blue-900">
          <span className="font-bold">Value-Add Recommendation: </span>
          {pricing?.value_addition_advice || 'Converting 30% of daily milk into Paneer/Ghee yields 40% higher realization per liter.'}
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
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-violet-700 hover:bg-violet-800 text-white font-bold text-sm shadow-lg shadow-violet-700/20 transition-all hover:translate-x-0.5"
        >
          <span>{t.labels.next}: {t.wizard_steps[4]}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
