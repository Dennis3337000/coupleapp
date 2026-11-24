import { useState } from 'react';
import { MapPin, Train, Car, Plane, Heart, Sparkles } from 'lucide-react';
import type { ProfileData, UserRole } from '../types';

interface DistanceViewProps {
  profile: ProfileData;
  role: UserRole;
  onUpdateCity: (partnerKey: 'partner_a_city' | 'partner_b_city', city: string) => void;
  onSendHug: () => void;
}

// City coordinates database for precise realistic distance
const CITY_COORDS: Record<string, { lat: number; lon: number }> = {
  'Berlin': { lat: 52.5200, lon: 13.4050 },
  'München': { lat: 48.1351, lon: 11.5820 },
  'Hamburg': { lat: 53.5511, lon: 9.9937 },
  'Köln': { lat: 50.9375, lon: 6.9603 },
  'Frankfurt': { lat: 50.1109, lon: 8.6821 },
  'Stuttgart': { lat: 48.7758, lon: 9.1829 },
  'Düsseldorf': { lat: 51.2277, lon: 6.7735 },
  'Leipzig': { lat: 51.3397, lon: 12.3731 },
  'Dresden': { lat: 51.0504, lon: 13.7373 },
  'Hannover': { lat: 52.3759, lon: 9.7320 },
  'Nürnberg': { lat: 49.4521, lon: 11.0767 },
  'Wien': { lat: 48.2082, lon: 16.3738 },
  'Zürich': { lat: 47.3769, lon: 8.5417 },
  'Salzburg': { lat: 47.8095, lon: 13.0550 },
  'Innsbruck': { lat: 47.2692, lon: 11.4041 },
  'Paris': { lat: 48.8566, lon: 2.3522 },
  'London': { lat: 51.5074, lon: -0.1278 },
  'Rom': { lat: 41.9028, lon: 12.4964 },
  'Barcelona': { lat: 41.3879, lon: 2.1699 },
  'Amsterdam': { lat: 52.3676, lon: 4.9041 }
};

function calculateHaversine(cityA: string, cityB: string): number {
  const coordA = CITY_COORDS[cityA];
  const coordB = CITY_COORDS[cityB];

  if (!coordA || !coordB) {
    // Fallback pseudo distance if unknown city
    if (cityA.toLowerCase() === cityB.toLowerCase()) return 0;
    const hash = (cityA.length + cityB.length) * 37;
    return 120 + (hash % 600);
  }

  const R = 6371; // Earth radius in km
  const dLat = ((coordB.lat - coordA.lat) * Math.PI) / 180;
  const dLon = ((coordB.lon - coordA.lon) * Math.PI) / 180;
  const lat1 = (coordA.lat * Math.PI) / 180;
  const lat2 = (coordB.lat * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

export default function DistanceView({
  profile,
  onUpdateCity,
  onSendHug
}: DistanceViewProps) {
  const [cityA, setCityA] = useState(profile.partner_a_city || 'Berlin');
  const [cityB, setCityB] = useState(profile.partner_b_city || 'München');
  const [hugSent, setHugSent] = useState(false);

  const distanceKm = calculateHaversine(cityA, cityB);

  // Approximate travel times
  const trainHours = Math.max(1, Math.round((distanceKm / 130) * 10) / 10);
  const carHours = Math.max(1, Math.round((distanceKm / 100) * 10) / 10);
  const flightHours = Math.max(1, Math.round((distanceKm / 650 + 1) * 10) / 10);

  const handleCityAChange = (c: string) => {
    setCityA(c);
    onUpdateCity('partner_a_city', c);
  };

  const handleCityBChange = (c: string) => {
    setCityB(c);
    onUpdateCity('partner_b_city', c);
  };

  const triggerHug = () => {
    setHugSent(true);
    onSendHug();
    setTimeout(() => setHugSent(false), 2000);
  };

  return (
    <div className="space-y-4 animate-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-extrabold text-gray-800">Distanz-Radar</h2>
          <p className="text-xs text-gray-400 font-medium">Liebe kennt keine Entfernung 💕</p>
        </div>
      </div>

      {/* Main Distance Visual Card */}
      <div className="glass-panel p-6 rounded-3xl shadow-sm text-center relative overflow-hidden">
        <div className="absolute top-[-30px] left-[-30px] w-36 h-36 bg-[var(--color-primary-light)] rounded-full blur-3xl opacity-50" />
        <div className="absolute bottom-[-30px] right-[-30px] w-36 h-36 bg-[var(--color-secondary)] rounded-full blur-3xl opacity-40" />

        <div className="relative z-10">
          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
            Luftlinie zwischen euch
          </span>

          {distanceKm === 0 ? (
            <div className="my-3">
              <span className="text-4xl font-extrabold gradient-text">Am selben Ort! 🥰</span>
              <p className="text-xs text-gray-500 mt-1">Ihr seid zusammen in einer Stadt.</p>
            </div>
          ) : (
            <div className="my-2">
              <div className="text-5xl font-black gradient-text tracking-tight flex items-center justify-center gap-1">
                <span>{distanceKm}</span>
                <span className="text-2xl font-bold text-gray-500">km</span>
              </div>
              <p className="text-xs text-gray-500 mt-0.5">
                {profile.partner_a_name} ({cityA}) ↔ {profile.partner_b_name} ({cityB})
              </p>
            </div>
          )}

          {/* Connected Bridge Graphics */}
          <div className="my-6 px-4 relative flex items-center justify-between">
            {/* Animated dotted connecting line */}
            <div className="absolute left-8 right-8 top-1/2 h-0.5 border-t-2 border-dashed border-pink-300 -translate-y-1/2 z-0" />

            {/* City A Dot */}
            <div className="z-10 flex flex-col items-center">
              <div className="w-11 h-11 bg-pink-100 border-2 border-pink-400 rounded-2xl flex items-center justify-center shadow-md text-pink-600">
                <MapPin size={20} />
              </div>
              <span className="text-xs font-black text-gray-800 mt-1">{cityA}</span>
              <span className="text-[10px] text-gray-400 font-bold">{profile.partner_a_name}</span>
            </div>

            {/* Animated Heart in the middle */}
            <div className="z-10 bg-white p-2 rounded-full shadow-md border border-pink-200 animate-pulse">
              <Heart size={18} fill="#ff9a9e" className="text-[var(--color-primary)]" />
            </div>

            {/* City B Dot */}
            <div className="z-10 flex flex-col items-center">
              <div className="w-11 h-11 bg-purple-100 border-2 border-purple-400 rounded-2xl flex items-center justify-center shadow-md text-purple-600">
                <MapPin size={20} />
              </div>
              <span className="text-xs font-black text-gray-800 mt-1">{cityB}</span>
              <span className="text-[10px] text-gray-400 font-bold">{profile.partner_b_name}</span>
            </div>
          </div>

          {/* Travel Times Grid */}
          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-gray-100">
            <div className="bg-white/70 p-2.5 rounded-2xl border border-pink-50 text-center">
              <Train size={16} className="mx-auto mb-1 text-pink-500" />
              <span className="text-[9px] uppercase font-bold text-gray-400 block">Bahn</span>
              <span className="text-xs font-black text-gray-700">~{trainHours} Std</span>
            </div>
            <div className="bg-white/70 p-2.5 rounded-2xl border border-pink-50 text-center">
              <Car size={16} className="mx-auto mb-1 text-purple-500" />
              <span className="text-[9px] uppercase font-bold text-gray-400 block">Auto</span>
              <span className="text-xs font-black text-gray-700">~{carHours} Std</span>
            </div>
            <div className="bg-white/70 p-2.5 rounded-2xl border border-pink-50 text-center">
              <Plane size={16} className="mx-auto mb-1 text-blue-500" />
              <span className="text-[9px] uppercase font-bold text-gray-400 block">Flug</span>
              <span className="text-xs font-black text-gray-700">~{flightHours} Std</span>
            </div>
          </div>
        </div>
      </div>

      {/* City Pickers */}
      <div className="glass-panel p-4 rounded-3xl shadow-sm space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500">
          Standorte anpassen
        </h3>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-[10px] font-bold text-pink-600 block mb-1">
              Stadt von {profile.partner_a_name}:
            </label>
            <select
              value={cityA}
              onChange={e => handleCityAChange(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-xl px-2.5 py-2 text-xs font-bold text-gray-700 focus:outline-none focus:border-pink-400"
            >
              {Object.keys(CITY_COORDS).map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[10px] font-bold text-purple-600 block mb-1">
              Stadt von {profile.partner_b_name}:
            </label>
            <select
              value={cityB}
              onChange={e => handleCityBChange(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-xl px-2.5 py-2 text-xs font-bold text-gray-700 focus:outline-none focus:border-purple-400"
            >
              {Object.keys(CITY_COORDS).map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Sweet Long Distance Button */}
      <div className="text-center pt-1">
        <button
          onClick={triggerHug}
          className="w-full bg-gradient-to-r from-pink-500 via-rose-400 to-purple-400 text-white py-3.5 rounded-2xl text-xs font-extrabold shadow-md hover:shadow-lg active:scale-98 transition-all flex items-center justify-center gap-2"
        >
          {hugSent ? (
            <>
              <Sparkles size={16} className="animate-spin" /> Umarmung über {distanceKm} km gesendet! 💕
            </>
          ) : (
            <>
              <Heart size={16} fill="white" /> Virtuelle Umarmung über die Distanz schicken
            </>
          )}
        </button>
      </div>
    </div>
  );
}
