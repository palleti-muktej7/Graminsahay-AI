import React from 'react';
import {
  Sparkles, ArrowRight, ArrowLeft, CheckCircle2, AlertOctagon, TrendingUp, AlertTriangle,
  Tag, Lightbulb, ShieldAlert, DollarSign
} from 'lucide-react';
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

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-violet-700 to-purple-800 rounded-2xl p-6 sm:p-8 text-white shadow-lg shadow-violet-700/10">
        <div className="flex items-center gap-2 text-violet-200 text-xs font-bold uppercase tracking-wider mb-2">
          <Sparkles className="w-4 h-4" />
          <span>Step 4 of 6 • {t.wizard_steps[3]}</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold">{t.step4_title}</h2>
        <p className="text-violet-100 text-sm mt-1 max-w-2xl">{t.step4_desc}</p>
      </div>

      {/* Grounded SWOT Analysis Matrix */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="font-bold text-slate-800 text-base">
              Tailored SWOT Matrix for {businessName}
            </h3>
            <p className="text-xs text-slate-500">
              Synthesized from your specific margin capital, experience, and local village catchment.
            </p>
          </div>
          <ConfidenceBadge level={swot?.confidence || 'HIGH'} source={swot?.data_source} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Strengths */}
          <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <h4 className="font-bold text-emerald-900 text-xs uppercase tracking-wider">
                Strengths (Internal Advantages)
              </h4>
            </div>
            <ul className="space-y-1.5 text-xs text-emerald-900/90">
              {swot?.strengths?.map((item, idx) => (
                <li key={idx} className="flex items-start gap-1.5">
                  <span className="text-emerald-500 font-bold">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Weaknesses */}
          <div className="p-4 rounded-xl bg-rose-50/70 border border-rose-200">
            <div className="flex items-center gap-2 mb-2">
              <AlertOctagon className="w-4 h-4 text-rose-600" />
              <h4 className="font-bold text-rose-900 text-xs uppercase tracking-wider">
                Weaknesses (Capital & Capacity Bottlenecks)
              </h4>
            </div>
            <ul className="space-y-1.5 text-xs text-rose-900/90">
              {swot?.weaknesses?.map((item, idx) => (
                <li key={idx} className="flex items-start gap-1.5">
                  <span className="text-rose-500 font-bold">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Opportunities */}
          <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-blue-600" />
              <h4 className="font-bold text-blue-900 text-xs uppercase tracking-wider">
                Opportunities (Value-Add & Market Expansion)
              </h4>
            </div>
            <ul className="space-y-1.5 text-xs text-blue-900/90">
              {swot?.opportunities?.map((item, idx) => (
                <li key={idx} className="flex items-start gap-1.5">
                  <span className="text-blue-500 font-bold">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Threats */}
          <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <h4 className="font-bold text-amber-900 text-xs uppercase tracking-wider">
                Threats (Market & Supply Chain Risks)
              </h4>
            </div>
            <ul className="space-y-1.5 text-xs text-amber-900/90">
              {swot?.threats?.map((item, idx) => (
                <li key={idx} className="flex items-start gap-1.5">
                  <span className="text-amber-500 font-bold">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Local Threat Identification & Actionable Mitigations */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
          <ShieldAlert className="w-5 h-5 text-rose-600" />
          <div>
            <h3 className="font-bold text-slate-800 text-base">
              Identified Supply Chain Bottlenecks & Practical Mitigations
            </h3>
            <p className="text-xs text-slate-500">
              Specific risk-mitigation roadmaps to safeguard working capital.
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {localThreats?.map((th, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-slate-50 transition-all space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-rose-500" />
                  {th.threat_title}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-100 text-rose-700">
                  Risk Factor #{idx + 1}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
                <div>
                  <span className="font-bold text-slate-600 block mb-0.5">Cause & Unit Impact:</span>
                  <p className="text-slate-500">{th.impact} ({th.cause})</p>
                </div>
                <div className="bg-white p-2.5 rounded-lg border border-emerald-200">
                  <span className="font-bold text-emerald-800 flex items-center gap-1 mb-0.5">
                    <Lightbulb className="w-3.5 h-3.5 text-emerald-600" />
                    Recommended Mitigation Strategy:
                  </span>
                  <p className="text-slate-700">{th.mitigation_strategy}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pricing Recommendations & Value-Addition Benchmarks */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Tag className="w-5 h-5 text-blue-600" />
            <div>
              <h3 className="font-bold text-slate-800 text-base">
                Product Pricing Strategy & Agmarknet Benchmarks
              </h3>
              <p className="text-xs text-slate-500">
                Ground reference pricing for {pricing?.product_name}
              </p>
            </div>
          </div>
          <ConfidenceBadge level={pricing?.confidence || 'HIGH'} source={pricing?.data_source} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-xs font-semibold text-slate-500 block">Regional Benchmark Price</span>
            <span className="text-2xl font-extrabold text-slate-800">
              ₹{pricing?.regional_benchmark_price?.toFixed(2)}
            </span>
            <span className="text-[11px] text-slate-400 block mt-1">Official wholesale / retail parity</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-xs font-semibold text-slate-500 block">Estimated Unit Cost</span>
            <span className="text-2xl font-extrabold text-slate-800">
              ₹{pricing?.estimated_cost_price?.toFixed(2)}
            </span>
            <span className="text-[11px] text-slate-400 block mt-1">Raw material & input cost</span>
          </div>

          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200">
            <span className="text-xs font-semibold text-emerald-700 block">Suggested Selling Price</span>
            <span className="text-2xl font-extrabold text-emerald-700">
              ₹{pricing?.suggested_selling_price?.toFixed(2)}
            </span>
            <span className="text-[11px] text-emerald-600 block mt-1 font-medium">
              Gross Margin: ~{(((pricing?.suggested_selling_price - pricing?.estimated_cost_price) / pricing?.suggested_selling_price) * 100).toFixed(0)}%
            </span>
          </div>
        </div>

        {/* Pricing Strategy Note */}
        <div className="bg-blue-50/70 p-3 rounded-xl border border-blue-200 text-xs text-blue-900 flex items-start gap-2">
          <DollarSign className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">Recommended Pricing Tactic: </span>
            <span>{pricing?.pricing_strategy}</span>
          </div>
        </div>

        {/* Value-Add Opportunities Card */}
        {pricing?.value_add_suggestions && Object.keys(pricing.value_add_suggestions).length > 0 && (
          <div className="pt-2">
            <span className="text-xs font-bold text-slate-700 block mb-2">
              🚀 High-Margin Value Addition Alternatives (vs Raw Commodity):
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {Object.entries(pricing.value_add_suggestions).map(([item, price], idx) => (
                <div key={idx} className="p-3 bg-indigo-50/60 rounded-xl border border-indigo-200 text-xs">
                  <span className="font-bold text-indigo-900 block">{item}</span>
                  <span className="text-base font-extrabold text-indigo-700 mt-1 block">
                    ₹{price.toLocaleString('en-IN')}
                  </span>
                  <span className="text-[10px] text-indigo-500">Premium Realization Target</span>
                </div>
              ))}
            </div>
          </div>
        )}
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
