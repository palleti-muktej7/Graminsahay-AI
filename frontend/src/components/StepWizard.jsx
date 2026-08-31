import React from 'react';
import { Check, MapPin, Briefcase, Compass, ShieldAlert, Calculator, Award } from 'lucide-react';
import { translations } from '../i18n/translations';

export default function StepWizard({ currentStep, setStep, lang }) {
  const t = translations[lang] || translations.en;
  const steps = [
    { num: 1, title: t.wizard_steps[0], icon: MapPin },
    { num: 2, title: t.wizard_steps[1], icon: Briefcase },
    { num: 3, title: t.wizard_steps[2], icon: Compass },
    { num: 4, title: t.wizard_steps[3], icon: ShieldAlert },
    { num: 5, title: t.wizard_steps[4], icon: Calculator },
    { num: 6, title: t.wizard_steps[5], icon: Award },
  ];

  return (
    <div className="w-full bg-white border-b border-slate-200 py-3 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto flex items-center justify-between overflow-x-auto no-scrollbar gap-2 sm:gap-4">
        {steps.map((s, idx) => {
          const Icon = s.icon;
          const isDone = currentStep > s.num;
          const isActive = currentStep === s.num;

          return (
            <button
              key={s.num}
              onClick={() => setStep(s.num)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                  : isDone
                  ? 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                  isActive
                    ? 'bg-white text-blue-600 font-bold'
                    : isDone
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-200 text-slate-600'
                }`}
              >
                {isDone ? <Check className="w-3 h-3 stroke-[3]" /> : s.num}
              </div>
              <span className="hidden md:inline">{s.title}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
