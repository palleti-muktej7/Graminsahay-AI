import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import L from 'leaflet';
import { Sparkles, ArrowRight, ArrowLeft, Users, Home, Store, Compass, ShieldCheck, MapPin } from 'lucide-react';
import { translations } from '../i18n/translations';
import ConfidenceBadge from './ConfidenceBadge';

// Fix standard Leaflet default icon issues in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Custom user center icon
const userIcon = new L.DivIcon({
  className: 'custom-user-icon',
  html: `<div style="background-color: #2563eb; width: 22px; height: 22px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 10px rgba(37,99,235,0.6);"></div>`,
  iconSize: [22, 22],
  iconAnchor: [11, 11],
});

// Custom competitor icon
const competitorIcon = new L.DivIcon({
  className: 'custom-competitor-icon',
  html: `<div style="background-color: #ef4444; width: 16px; height: 16px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 6px rgba(239,68,68,0.6);"></div>`,
  iconSize: [16, 16],
  iconAnchor: [8, 8],
});

export default function CompetitorMap({
  location,
  marketReach,
  competitors,
  businessName,
  onNext,
  onBack,
  lang,
}) {
  const t = translations[lang] || translations.en;
  const lat = location.latitude || 10.787;
  const lon = location.longitude || 79.1378;
  const radiusKm = location.radius_km || 10;

  const compList = competitors?.competitors_list || [];
  const compCount = competitors?.competitor_count || 0;
  const density = competitors?.density_level || 'MEDIUM';

  const densityColors = {
    LOW: 'text-emerald-700 bg-emerald-50 border-emerald-200',
    MEDIUM: 'text-amber-700 bg-amber-50 border-amber-200',
    HIGH: 'text-rose-700 bg-rose-50 border-rose-200',
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-cyan-700 to-blue-800 rounded-2xl p-6 sm:p-8 text-white shadow-lg shadow-cyan-700/10">
        <div className="flex items-center gap-2 text-cyan-200 text-xs font-bold uppercase tracking-wider mb-2">
          <Sparkles className="w-4 h-4" />
          <span>Step 3 of 6 • {t.wizard_steps[2]}</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold">{t.step3_title}</h2>
        <p className="text-cyan-100 text-sm mt-1 max-w-2xl">{t.step3_desc}</p>
      </div>

      {/* Catchment & Saturation Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold mb-1">
            <Users className="w-4 h-4 text-blue-600" />
            <span>{t.catchment_population}</span>
          </div>
          <span className="text-xl font-extrabold text-slate-800">
            {marketReach?.estimated_population?.toLocaleString('en-IN') || '18,500'}
          </span>
          <span className="text-[11px] text-slate-400 block mt-0.5">In {radiusKm} km radius</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold mb-1">
            <Home className="w-4 h-4 text-indigo-600" />
            <span>{t.households_in_area}</span>
          </div>
          <span className="text-xl font-extrabold text-slate-800">
            {marketReach?.estimated_households?.toLocaleString('en-IN') || '4,200'}
          </span>
          <span className="text-[11px] text-slate-400 block mt-0.5">Avg 4.5 members/hh</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold mb-1">
            <Users className="w-4 h-4 text-emerald-600" />
            <span>{t.potential_customers}</span>
          </div>
          <span className="text-xl font-extrabold text-emerald-600">
            {marketReach?.potential_target_customers?.toLocaleString('en-IN') || '2,800'}
          </span>
          <span className="text-[11px] text-slate-400 block mt-0.5">Target demographic</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold mb-1">
            <Store className="w-4 h-4 text-amber-600" />
            <span>{t.competitor_density}</span>
          </div>
          <span className="text-xl font-extrabold text-slate-800">
            {compCount} Units
          </span>
          <span
            className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full border mt-1 ${
              densityColors[density] || densityColors.MEDIUM
            }`}
          >
            {density} Saturation
          </span>
        </div>
      </div>

      {/* Interactive Map Card */}
      <div className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
          <div>
            <h3 className="font-bold text-slate-800 text-base flex items-center gap-2">
              <Compass className="w-5 h-5 text-blue-600" />
              {t.step3_title}
            </h3>
            <p className="text-xs text-slate-500">
              {location.village}, {location.district} ({location.state}) • Catchment Radius: {radiusKm} km
            </p>
          </div>

          <ConfidenceBadge level={competitors?.confidence || 'HIGH'} source={competitors?.source || 'OpenStreetMap POIs'} />
        </div>

        {/* Leaflet Map Box */}
        <div className="h-96 w-full rounded-xl overflow-hidden border border-slate-200 relative z-0">
          <MapContainer
            center={[lat, lon]}
            zoom={radiusKm > 10 ? 11 : 12}
            scrollWheelZoom={false}
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {/* Proposed Business Location */}
            <Marker position={[lat, lon]} icon={userIcon}>
              <Popup>
                <div className="text-xs font-sans">
                  <b className="text-blue-600">Proposed Site</b>
                  <p className="mt-1 font-semibold">{businessName}</p>
                  <p className="text-slate-500">{location.village}, {location.district}</p>
                </div>
              </Popup>
            </Marker>

            {/* Catchment Radius Circle */}
            <Circle
              center={[lat, lon]}
              radius={radiusKm * 1000}
              pathOptions={{
                color: '#2563eb',
                fillColor: '#3b82f6',
                fillOpacity: 0.1,
                weight: 2,
                dashArray: '4, 4',
              }}
            />

            {/* Existing Competitors Pins */}
            {compList.map((comp, idx) => (
              <Marker
                key={idx}
                position={[comp.latitude, comp.longitude]}
                icon={competitorIcon}
              >
                <Popup>
                  <div className="text-xs font-sans">
                    <b className="text-rose-600">Competitor Unit</b>
                    <p className="mt-1 font-semibold">{comp.name}</p>
                    <p className="text-slate-500">{comp.category}</p>
                    <p className="text-slate-400 text-[10px] mt-0.5">~{comp.distance_km} km away</p>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs text-slate-600 bg-slate-50 p-3 rounded-xl">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 font-medium">
              <span className="w-3 h-3 rounded-full bg-blue-600 inline-block border border-white" />
              {t.map_legend_center}
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <span className="w-3 h-3 rounded-full bg-rose-500 inline-block border border-white" />
              {t.map_legend_competitors}
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <span className="w-3 h-3 rounded-full bg-blue-200 border border-blue-500 inline-block" />
              {radiusKm} km {t.labels.radius}
            </span>
          </div>

          <span className="text-[11px] text-slate-400">
            Source: {competitors?.source || 'OpenStreetMap live Overpass API'}
          </span>
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
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-cyan-700 hover:bg-cyan-800 text-white font-bold text-sm shadow-lg shadow-cyan-700/20 transition-all hover:translate-x-0.5"
        >
          <span>{t.labels.next}: {t.wizard_steps[3]}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
