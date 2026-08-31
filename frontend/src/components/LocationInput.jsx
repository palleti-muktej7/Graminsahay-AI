import React, { useState } from 'react';
import { MapPin, User, ArrowRight, Sparkles, Navigation, Locate } from 'lucide-react';
import { translations } from '../i18n/translations';

export default function LocationInput({
  entrepreneur,
  setEntrepreneur,
  location,
  setLocation,
  onNext,
  lang,
}) {
  const t = translations[lang] || translations.en;
  const [detectingGps, setDetectingGps] = useState(false);

  const handleAutoDetectLocation = () => {
    if ('geolocation' in navigator) {
      setDetectingGps(true);
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLocation((prev) => ({
            ...prev,
            latitude: parseFloat(pos.coords.latitude.toFixed(4)),
            longitude: parseFloat(pos.coords.longitude.toFixed(4)),
          }));
          setDetectingGps(false);
        },
        (err) => {
          setDetectingGps(false);
          alert('GPS detection unavailable or permission denied. Please enter village and district manually.');
        },
        { timeout: 8000 }
      );
    } else {
      alert('Geolocation is not supported by your browser.');
    }
  };

  const commonDistricts = [
    { district: 'Thanjavur', state: 'Tamil Nadu', village: 'Melattur', block: 'Papanasam', lat: 10.787, lon: 79.1378, pincode: '614205' },
    { district: 'Barabanki', state: 'Uttar Pradesh', village: 'Zaidpur', block: 'Siddhaur', lat: 26.9274, lon: 81.1834, pincode: '225414' },
    { district: 'Pune', state: 'Maharashtra', village: 'Manchar', block: 'Ambegaon', lat: 18.5204, lon: 73.8567, pincode: '410503' },
    { district: 'Guntur', state: 'Andhra Pradesh', village: 'Tenali Rural', block: 'Tenali', lat: 16.3067, lon: 80.4365, pincode: '522201' },
    { district: 'Patna', state: 'Bihar', village: 'Danapur Diara', block: 'Danapur', lat: 25.5941, lon: 85.1376, pincode: '801503' },
  ];

  const handleSelectDistrict = (item) => {
    setLocation((prev) => ({
      ...prev,
      district: item.district,
      state: item.state,
      village: item.village,
      block: item.block,
      pincode: item.pincode,
      latitude: item.lat,
      longitude: item.lon,
    }));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-blue-700/10">
        <div className="flex items-center gap-2 text-blue-200 text-xs font-bold uppercase tracking-wider mb-2">
          <Sparkles className="w-4 h-4" />
          <span>Step 1 of 6 • {t.wizard_steps[0]}</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black">{t.step1_title}</h2>
        <p className="text-blue-100 text-xs sm:text-sm mt-1 max-w-2xl">{t.step1_desc}</p>
      </div>

      {/* District Suggestions & GPS auto-detect */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
            <Navigation className="w-3.5 h-3.5 text-blue-600" />
            {t.select_district}
          </span>
          {commonDistricts.map((item, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSelectDistrict(item)}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all border ${
                location.district.toLowerCase() === item.district.toLowerCase()
                  ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
              }`}
            >
              {item.district} ({item.state})
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={handleAutoDetectLocation}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs shrink-0 transition-all"
        >
          <Locate className={`w-3.5 h-3.5 text-blue-600 ${detectingGps ? 'animate-spin' : ''}`} />
          <span>{detectingGps ? t.detecting_gps : t.use_gps}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Applicant Profile Form */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <User className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-slate-800 text-base">{t.applicant_info}</h3>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {t.labels.full_name} *
            </label>
            <input
              type="text"
              required
              value={entrepreneur.full_name}
              onChange={(e) => setEntrepreneur({ ...entrepreneur, full_name: e.target.value })}
              className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50/50"
              placeholder="e.g. Ramesh Kumar"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {t.labels.category}
              </label>
              <select
                value={entrepreneur.category}
                onChange={(e) => setEntrepreneur({ ...entrepreneur, category: e.target.value })}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50/50 cursor-pointer"
              >
                <option value="OBC">OBC (NBCFDC)</option>
                <option value="SC">SC (NSFDC)</option>
                <option value="ST">ST (NSTFDC)</option>
                <option value="General">General / Minority</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {t.labels.experience}
              </label>
              <input
                type="number"
                min="0"
                max="30"
                value={entrepreneur.prior_experience_years}
                onChange={(e) => setEntrepreneur({ ...entrepreneur, prior_experience_years: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50/50"
              />
            </div>
          </div>
        </div>

        {/* Village & Geolocation Form */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <MapPin className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-slate-800 text-base">{t.village_location}</h3>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {t.labels.village} *
              </label>
              <input
                type="text"
                required
                value={location.village}
                onChange={(e) => setLocation({ ...location, village: e.target.value })}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50/50"
                placeholder="e.g. Melattur"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {t.labels.block}
              </label>
              <input
                type="text"
                value={location.block}
                onChange={(e) => setLocation({ ...location, block: e.target.value })}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50/50"
                placeholder="e.g. Papanasam"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {t.labels.district} *
              </label>
              <input
                type="text"
                required
                value={location.district}
                onChange={(e) => setLocation({ ...location, district: e.target.value })}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50/50"
                placeholder="e.g. Thanjavur"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {t.labels.state} *
              </label>
              <input
                type="text"
                required
                value={location.state}
                onChange={(e) => setLocation({ ...location, state: e.target.value })}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50/50"
                placeholder="e.g. Tamil Nadu"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-1">
              <span>{t.labels.radius}:</span>
              <span className="font-extrabold text-blue-600">{location.radius_km} km</span>
            </div>
            <input
              type="range"
              min="3"
              max="20"
              step="1"
              value={location.radius_km}
              onChange={(e) => setLocation({ ...location, radius_km: parseFloat(e.target.value) })}
              className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
              <span>3 km ({t.core_village})</span>
              <span>10 km ({t.block_catchment})</span>
              <span>20 km ({t.sub_district})</span>
            </div>
          </div>
        </div>
      </div>

      {/* Next Step Button */}
      <div className="flex justify-end pt-4">
        <button
          onClick={onNext}
          className="flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black text-sm shadow-xl shadow-blue-600/20 transition-all hover:translate-x-0.5"
        >
          <span>{t.labels.next}: {t.wizard_steps[1]}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
