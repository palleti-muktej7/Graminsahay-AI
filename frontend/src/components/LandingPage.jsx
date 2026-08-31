import React from 'react';
import {
  Sparkles, ArrowRight, Landmark, Building2, User
} from 'lucide-react';
import { translations } from '../i18n/translations';

export default function LandingPage({
  onOpenAuth,
  lang,
}) {
  const t = translations[lang] || translations.en;

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 text-white p-8 sm:p-14 shadow-2xl border border-blue-900/40">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-600/20 via-transparent to-transparent pointer-events-none" />
        
        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-400/30 text-blue-300 text-xs font-bold uppercase tracking-wider backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span>{t.sub_tagline}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            {t.landing_hero_title}
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            {t.landing_hero_desc}
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => onOpenAuth('entrepreneur')}
              className="flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-sm shadow-xl shadow-blue-600/30 transition-all hover:translate-y-[-1px]"
            >
              <span>🧑‍🌾 {t.sign_in_entrepreneur}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onOpenAuth('csc_vle')}
              className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-sm shadow-xl shadow-emerald-600/30 transition-all hover:translate-y-[-1px]"
            >
              <Building2 className="w-4 h-4" />
              <span>🏪 {t.sign_in_csc}</span>
            </button>

            <button
              onClick={() => onOpenAuth('bank_officer')}
              className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-extrabold text-sm border border-slate-700 transition-all"
            >
              <Landmark className="w-4 h-4 text-blue-400" />
              <span>🏦 {t.sign_in_bank}</span>
            </button>
          </div>
        </div>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-10 border-t border-slate-800/80 mt-10">
          <div className="p-3 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm">
            <span className="text-2xl font-black text-blue-400 block">10%</span>
            <span className="text-xs font-semibold text-slate-300">{t.labels.own_equity}</span>
          </div>
          <div className="p-3 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm">
            <span className="text-2xl font-black text-emerald-400 block">90%</span>
            <span className="text-xs font-semibold text-slate-300">{t.labels.loan_amount}</span>
          </div>
          <div className="p-3 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm">
            <span className="text-2xl font-black text-amber-400 block">6.5% - 8%</span>
            <span className="text-xs font-semibold text-slate-300">{t.labels.interest_rate}</span>
          </div>
          <div className="p-3 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm">
            <span className="text-2xl font-black text-indigo-400 block">6 Mo.</span>
            <span className="text-xs font-semibold text-slate-300">{t.labels.moratorium}</span>
          </div>
        </div>
      </section>

      {/* 3 User Gateways */}
      <section className="space-y-4">
        <div className="text-center max-w-xl mx-auto space-y-1">
          <h2 className="text-2xl font-black text-slate-900">
            {t.portal_gateways}
          </h2>
          <p className="text-xs text-slate-500">
            {t.portal_gateways_desc}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Gateway 1 */}
          <div
            onClick={() => onOpenAuth('entrepreneur')}
            className="p-6 bg-white rounded-3xl border border-slate-200 shadow-sm hover:border-blue-500 hover:shadow-lg transition-all cursor-pointer flex flex-col justify-between space-y-4 group"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xl group-hover:scale-110 transition-transform">
                🧑‍🌾
              </div>
              <h3 className="font-extrabold text-slate-900 text-lg">{t.role_entrepreneur}</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                {t.role_entrepreneur_desc}
              </p>
            </div>
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-blue-600">
              <span>{t.sign_in_entrepreneur}</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>

          {/* Gateway 2 */}
          <div
            onClick={() => onOpenAuth('csc_vle')}
            className="p-6 bg-white rounded-3xl border border-slate-200 shadow-sm hover:border-emerald-500 hover:shadow-lg transition-all cursor-pointer flex flex-col justify-between space-y-4 group"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-xl group-hover:scale-110 transition-transform">
                🏪
              </div>
              <h3 className="font-extrabold text-slate-900 text-lg">{t.role_csc}</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                {t.role_csc_desc}
              </p>
            </div>
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-emerald-600">
              <span>{t.sign_in_csc}</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>

          {/* Gateway 3 */}
          <div
            onClick={() => onOpenAuth('bank_officer')}
            className="p-6 bg-white rounded-3xl border border-slate-200 shadow-sm hover:border-indigo-500 hover:shadow-lg transition-all cursor-pointer flex flex-col justify-between space-y-4 group"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xl group-hover:scale-110 transition-transform">
                🏦
              </div>
              <h3 className="font-extrabold text-slate-900 text-lg">{t.role_bank}</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                {t.role_bank_desc}
              </p>
            </div>
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-indigo-600">
              <span>{t.sign_in_bank}</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </div>
      </section>

      {/* 6 Core Modules Overview */}
      <section className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="space-y-1">
          <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider block">
            {t.labels.evidence_first}
          </span>
          <h2 className="text-2xl font-extrabold text-slate-900">
            6-Point Hyper-Local Feasibility & Financial Blueprint
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">1</div>
            <h4 className="font-bold text-slate-900 text-sm">{t.wizard_steps[0]}</h4>
            <p className="text-slate-500">{t.step1_desc}</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">2</div>
            <h4 className="font-bold text-slate-900 text-sm">{t.wizard_steps[1]}</h4>
            <p className="text-slate-500">{t.step2_desc}</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="w-8 h-8 rounded-xl bg-violet-100 text-violet-700 flex items-center justify-center font-bold">3</div>
            <h4 className="font-bold text-slate-900 text-sm">{t.wizard_steps[2]}</h4>
            <p className="text-slate-500">{t.step3_desc}</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">4</div>
            <h4 className="font-bold text-slate-900 text-sm">{t.wizard_steps[3]}</h4>
            <p className="text-slate-500">{t.step4_desc}</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">5</div>
            <h4 className="font-bold text-slate-900 text-sm">{t.wizard_steps[4]}</h4>
            <p className="text-slate-500">{t.step5_desc}</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">6</div>
            <h4 className="font-bold text-slate-900 text-sm">{t.wizard_steps[5]}</h4>
            <p className="text-slate-500">{t.step6_desc}</p>
          </div>
        </div>
      </section>
    </div>
  );
}
