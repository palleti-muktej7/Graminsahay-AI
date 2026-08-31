import React from 'react';
import { Sparkles, ArrowRight, ArrowLeft, Milk, ShoppingBag, Scissors, Egg, Cpu, Wrench, IndianRupee, Layers } from 'lucide-react';
import { translations } from '../i18n/translations';

export default function BusinessSelect({
  selectedBusiness,
  setSelectedBusiness,
  capital,
  setCapital,
  businessProfiles,
  onNext,
  onBack,
  lang,
}) {
  const t = translations[lang] || translations.en;

  const getBusinessIcon = (id) => {
    switch (id) {
      case 'dairy_farming':
        return Milk;
      case 'poultry_farming':
        return Egg;
      case 'rural_kirana_retail':
        return ShoppingBag;
      case 'tailoring_garments':
        return Scissors;
      case 'agro_processing_mill':
        return Layers;
      case 'two_wheeler_workshop':
        return Wrench;
      default:
        return Cpu;
    }
  };

  const capitalPresets = [25000, 50000, 100000, 200000, 500000];

  // Calculate live numbers
  const totalProject = capital / 0.10;
  const loanAmount = totalProject * 0.90;
  const isMicroFinance = totalProject <= 140000;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-700 rounded-2xl p-6 sm:p-8 text-white shadow-lg shadow-emerald-600/10">
        <div className="flex items-center gap-2 text-emerald-200 text-xs font-bold uppercase tracking-wider mb-2">
          <Sparkles className="w-4 h-4" />
          <span>Step 2 of 6 • {t.wizard_steps[1]}</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold">{t.step2_title}</h2>
        <p className="text-emerald-100 text-sm mt-1 max-w-2xl">{t.step2_desc}</p>
      </div>

      {/* Available Margin Capital Setup */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
          <div>
            <h3 className="font-bold text-slate-800 text-base flex items-center gap-2">
              <IndianRupee className="w-5 h-5 text-emerald-600" />
              {t.labels.available_capital}
            </h3>
            <p className="text-xs text-slate-500">
              Government schemes require 10% beneficiary margin equity.
            </p>
          </div>
          <div className="text-right">
            <span className="text-2xl font-extrabold text-emerald-600">
              ₹{capital.toLocaleString('en-IN')}
            </span>
          </div>
        </div>

        {/* Quick Capital Preset Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-slate-500 mr-1">Quick Select:</span>
          {capitalPresets.map((val) => (
            <button
              key={val}
              type="button"
              onClick={() => setCapital(val)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                capital === val
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
              }`}
            >
              ₹{(val / 100000).toFixed(val < 100000 ? 2 : 1)} Lakh
            </button>
          ))}
        </div>

        {/* Capital Slider */}
        <div>
          <input
            type="range"
            min="10000"
            max="500000"
            step="5000"
            value={capital}
            onChange={(e) => setCapital(parseFloat(e.target.value))}
            className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
          />
        </div>

        {/* Financial Structuring Live Breakdown Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
            <span className="text-[11px] font-semibold text-slate-500 uppercase block">
              1. Your Contribution (10%)
            </span>
            <span className="text-lg font-bold text-slate-800">
              ₹{capital.toLocaleString('en-IN')}
            </span>
          </div>

          <div className="bg-blue-50 p-3 rounded-xl border border-blue-200">
            <span className="text-[11px] font-semibold text-blue-700 uppercase block">
              2. Total Project Outlay (100%)
            </span>
            <span className="text-lg font-bold text-blue-800">
              ₹{totalProject.toLocaleString('en-IN')}
            </span>
          </div>

          <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-200">
            <span className="text-[11px] font-semibold text-emerald-700 uppercase block">
              3. Eligible Loan (90%)
            </span>
            <span className="text-lg font-bold text-emerald-800">
              ₹{loanAmount.toLocaleString('en-IN')}
            </span>
          </div>
        </div>

        {/* Auto Scheme Category Flag */}
        <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-3 flex items-center justify-between text-xs">
          <div>
            <span className="font-bold text-amber-900">Auto Scheme Routing: </span>
            <span className="text-amber-800">
              {isMicroFinance
                ? 'MoSJE Micro Finance Scheme (≤ ₹1.40 Lakh Outlay • 6.5% p.a. • 3-Yr Tenure • 3-Mo Moratorium)'
                : 'MoSJE Term Loan Scheme (> ₹1.40 Lakh Outlay • 8.0% p.a. • 7-Yr Tenure • 6-Mo Moratorium)'}
            </span>
          </div>
        </div>
      </div>

      {/* Business Category Selection Grid */}
      <div className="space-y-3">
        <h3 className="font-bold text-slate-800 text-base">
          Select Business Sector to Analyze
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {businessProfiles.map((biz) => {
            const Icon = getBusinessIcon(biz.id);
            const isSelected = selectedBusiness === biz.id;

            return (
              <div
                key={biz.id}
                onClick={() => setSelectedBusiness(biz.id)}
                className={`cursor-pointer rounded-2xl p-5 border-2 transition-all text-left relative flex flex-col justify-between ${
                  isSelected
                    ? 'border-emerald-600 bg-emerald-50/40 shadow-md shadow-emerald-600/10'
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        isSelected
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                      {biz.category.split('&')[0]}
                    </span>
                  </div>

                  <h4 className="font-bold text-slate-900 text-sm mb-1">{biz.name}</h4>
                  <p className="text-xs text-slate-500 line-clamp-2 mb-3">
                    Typical gross margin ~{biz.typical_margin_pct}%. Value-add: {biz.value_add_opportunities?.[0]}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-600">
                  <span>Min Capital: ₹{biz.min_suggested_capital?.toLocaleString('en-IN')}</span>
                  <span className={`font-bold ${isSelected ? 'text-emerald-700' : 'text-slate-400'}`}>
                    {isSelected ? '✓ Selected' : 'Select'}
                  </span>
                </div>
              </div>
            );
          })}
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
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-lg shadow-emerald-600/20 transition-all hover:translate-x-0.5"
        >
          <span>{t.labels.next}: {t.wizard_steps[2]}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
