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
            <span>Catchment Population</span>
          </div>
          <span className="text-xl font-extrabold text-slate-800">
            {marketReach?.estimated_population?.toLocaleString('en-IN') || '18,500'}
          </span>
          <span className="text-[11px] text-slate-400 block mt-0.5">In {radiusKm} km radius</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold mb-1">
            <Home className="w-4 h-4 text-indigo-600" />
            <span>Households in Area</span>
          </div>
          <span className="text-xl font-extrabold text-slate-800">
            {marketReach?.estimated_households?.toLocaleString('en-IN') || '4,200'}
          </span>
          <span className="text-[11px] text-slate-400 block mt-0.5">Avg 4.5 members/hh</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold mb-1">
            <Users className="w-4 h-4 text-emerald-600" />
            <span>Potential Customers</span>
          </div>
          <span className="text-xl font-extrabold text-emerald-600">
            {marketReach?.potential_target_customers?.toLocaleString('en-IN') || '2,800'}
          </span>
          <span className="text-[11px] text-slate-400 block mt-0.5">Target demographic</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold mb-1">
            <Store className="w-4 h-4 text-rose-600" />
            <span>Competitor Units</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-extrabold text-slate-800">{compCount}</span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${densityColors[density]}`}>
              {density} DENSITY
            </span>
          </div>
          <span className="text-[11px] text-slate-400 block mt-0.5">Within radius</span>
        </div>
      </div>

      {/* Map & Competitor List Split View */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Interactive Leaflet Map Container */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Compass className="w-4 h-4 text-blue-600" />
              <h3 className="font-bold text-slate-800 text-sm">
                Geospatial Catchment Map (Radius: {radiusKm} km)
              </h3>
            </div>
            <ConfidenceBadge
              level={competitors?.confidence || 'HIGH'}
              source={competitors?.data_source}
              showSource={false}
            />
          </div>

          <div className="w-full h-80 sm:h-96 rounded-xl overflow-hidden relative border border-slate-200">
            <MapContainer
              center={[lat, lon]}
              zoom={11}
              scrollWheelZoom={false}
              className="h-full w-full"
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              {/* Catchment Radius Circle */}
              <Circle
                center={[lat, lon]}
                radius={radiusKm * 1000}
                pathOptions={{ color: '#2563eb', fillColor: '#3b82f6', fillOpacity: 0.1, weight: 2 }}
              />

              {/* Proposed Business Location (Blue) */}
              <Marker position={[lat, lon]} icon={userIcon}>
                <Popup>
                  <div className="text-xs">
                    <p className="font-bold text-blue-700">📍 Proposed Location</p>
                    <p className="text-slate-600 font-semibold">{location.village}, {location.district}</p>
                    <p className="text-slate-500 mt-1">Target: {businessName}</p>
                  </div>
                </Popup>
              </Marker>

              {/* Competitor Markers (Red) */}
              {compList.map((c, idx) => (
                <Marker key={idx} position={[c.lat, c.lon]} icon={competitorIcon}>
                  <Popup>
                    <div className="text-xs">
                      <p className="font-bold text-rose-600">🏪 {c.name}</p>
                      <p className="text-slate-600">{c.business_type}</p>
                      <p className="text-slate-500 mt-1">Distance: <b>{c.distance_km} km</b></p>
                      <p className="text-[10px] text-slate-400 italic">Source: {c.source}</p>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>

            {/* Map Legend Floating Tag */}
            <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-md px-3 py-2 rounded-lg border border-slate-200 text-[11px] font-semibold text-slate-700 z-[1000] shadow-sm flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-blue-600 border border-white" />
                <span>Your Proposed Unit</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-rose-500 border border-white" />
                <span>Existing Competitors</span>
              </div>
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
            <span>{competitors?.explanation}</span>
            <span className="italic text-[11px]">Source: {competitors?.data_source}</span>
          </div>
        </div>

        {/* Nearby Competitors List Sidebar */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
              <h3 className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
                <Store className="w-4 h-4 text-slate-600" />
                Identified Units ({compList.length})
              </h3>
              <span className="text-[10px] font-bold text-slate-500 uppercase">
                Sorted by Proximity
              </span>
            </div>

            <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
              {compList.length === 0 ? (
                <p className="text-xs text-slate-400 italic p-4 text-center">
                  No direct competitors found in immediate radius.
                </p>
              ) : (
                compList.map((c, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-xl border border-slate-100 bg-slate-50 hover:bg-blue-50/50 transition-all text-xs"
                  >
                    <div className="flex items-start justify-between">
                      <span className="font-bold text-slate-800">{c.name}</span>
                      <span className="font-bold text-blue-600 whitespace-nowrap">
                        {c.distance_km} km
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">{c.business_type}</p>
                    <div className="mt-1 flex items-center gap-1 text-[10px] text-slate-400">
                      <span>{c.verified ? '✓ Verified OSM POI' : '• District Udyam Proxy'}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100">
            <span className="text-xs font-bold text-slate-700 block mb-1">Primary Sales Channels:</span>
            <div className="flex flex-wrap gap-1.5">
              {marketReach?.primary_channels?.map((ch, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md text-[10px] font-medium"
                >
                  {ch}
                </span>
              ))}
            </div>
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
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-cyan-700 hover:bg-cyan-800 text-white font-bold text-sm shadow-lg shadow-cyan-700/20 transition-all hover:translate-x-0.5"
        >
          <span>{t.labels.next}: {t.wizard_steps[3]}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
