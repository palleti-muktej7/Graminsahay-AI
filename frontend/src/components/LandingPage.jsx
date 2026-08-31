import React from 'react';
import {
  Sparkles, ArrowRight, ShieldCheck, Landmark, Building2, User,
  TrendingUp, CheckCircle, Compass, Calculator, FileText, ChevronRight
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
            <span>Ministry of Social Justice & Empowerment (MoSJE) • SIH 2026</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            AI-Driven Hyper-Local Business Advisory & Concessional Loan Structuring
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            GraminSahay AI empowers rural micro-entrepreneurs with evidence-grounded market intelligence (5–10km radius), competitor mapping via live geospatial data, and automatic MoSJE scheme structuring with 10% equity and 90% concessional loans.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => onOpenAuth('entrepreneur')}
              className="flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-sm shadow-xl shadow-blue-600/30 transition-all hover:translate-y-[-1px]"
            >
              <span>🧑‍🌾 Rural Entrepreneur Login</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onOpenAuth('csc_vle')}
              className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-sm shadow-xl shadow-emerald-600/30 transition-all hover:translate-y-[-1px]"
            >
              <Building2 className="w-4 h-4" />
              <span>🏪 CSC VLE Center Portal</span>
            </button>

            <button
              onClick={() => onOpenAuth('bank_officer')}
              className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-extrabold text-sm border border-slate-700 transition-all"
            >
              <Landmark className="w-4 h-4 text-blue-400" />
              <span>🏦 Bank Credit Officer Desk</span>
            </button>
          </div>
        </div>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-10 border-t border-slate-800/80 mt-10">
          <div className="p-3 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm">
            <span className="text-2xl font-black text-blue-400 block">10%</span>
            <span className="text-xs font-semibold text-slate-300">Own Margin Equity</span>
          </div>
          <div className="p-3 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm">
            <span className="text-2xl font-black text-emerald-400 block">90%</span>
            <span className="text-xs font-semibold text-slate-300">Concessional Loan</span>
          </div>
          <div className="p-3 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm">
            <span className="text-2xl font-black text-amber-400 block">6.5% - 8%</span>
            <span className="text-xs font-semibold text-slate-300">MoSJE Interest Subsidy</span>
          </div>
          <div className="p-3 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm">
            <span className="text-2xl font-black text-indigo-400 block">6 Mo.</span>
            <span className="text-xs font-semibold text-slate-300">Moratorium Grace Period</span>
          </div>
        </div>
      </section>

      {/* 3 User Gateways */}
      <section className="space-y-4">
        <div className="text-center max-w-xl mx-auto space-y-1">
          <h2 className="text-2xl font-black text-slate-900">
            Authorized Stakeholder Gateways
          </h2>
          <p className="text-xs text-slate-500">
            Sign in with your verified credentials to access your authorized portal.
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
              <h3 className="font-extrabold text-slate-900 text-lg">Rural Micro-Entrepreneur</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Analyze local village demand, calculate eligible 90% concessional loans, review moratorium cash flows, and download your formal Detailed Project Report (DPR).
              </p>
            </div>
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-blue-600">
              <span>Sign In as Entrepreneur</span>
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
              <h3 className="font-extrabold text-slate-900 text-lg">CSC VLE Center Hub</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Operate the assisted kiosk mode for local villagers. Create proposals on behalf of villagers, manage panchayat applications, and batch-export bank DPRs.
              </p>
            </div>
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-emerald-600">
              <span>Sign In as CSC VLE</span>
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
              <h3 className="font-extrabold text-slate-900 text-lg">Bank Credit Appraisal Desk</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                For branch managers & MoSJE channelizing officers. Audit live submitted loan applications, inspect DSCR, review risk flags, and record sanction approvals.
              </p>
            </div>
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-indigo-600">
              <span>Sign In as Bank Officer</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </div>
      </section>

      {/* 6 Core Modules Overview */}
      <section className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="space-y-1">
          <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider block">
            Evidence-First Architecture
          </span>
          <h2 className="text-2xl font-extrabold text-slate-900">
            6-Point Hyper-Local Feasibility & Financial Blueprint
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">1</div>
            <h4 className="font-bold text-slate-900 text-sm">Market Catchment Reach</h4>
            <p className="text-slate-500">Estimates actual rural population, household count, and conversion in 5–10 km radius with Census citations.</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">2</div>
            <h4 className="font-bold text-slate-900 text-sm">Geospatial Competitor Mapping</h4>
            <p className="text-slate-500">Queries OpenStreetMap Overpass POIs to calculate saturation and plot nearby commercial units on Leaflet maps.</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="w-8 h-8 rounded-xl bg-violet-100 text-violet-700 flex items-center justify-center font-bold">3</div>
            <h4 className="font-bold text-slate-900 text-sm">Tailored SWOT & Value-Add</h4>
            <p className="text-slate-500">Synthesizes opportunities like converting raw milk to paneer/ghee for 35–45% higher margins.</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">4</div>
            <h4 className="font-bold text-slate-900 text-sm">Threat & Risk Identification</h4>
            <p className="text-slate-500">Identifies input price volatility, monopsony middlemen, and off-season slumps with practical mitigations.</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">5</div>
            <h4 className="font-bold text-slate-900 text-sm">MoSJE Scheme Calculator</h4>
            <p className="text-slate-500">Auto-routes to Micro Finance (≤ ₹1.4L @ 6.5%) vs Term Loan (&gt; ₹1.4L @ 8%) with moratorium amortization.</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">6</div>
            <h4 className="font-bold text-slate-900 text-sm">Bankable DPR PDF Generator</h4>
            <p className="text-slate-500">Instantly exports official MoSJE Detailed Project Report with DSCR calculations and signature appraisal blocks.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
