import { useState } from 'react';
import { X, UserCheck, Heart, Check, RefreshCw } from 'lucide-react';
import type { ProfileData, UserRole } from '../types';

interface SettingsModalProps {
  profile: ProfileData;
  role: UserRole;
  onClose: () => void;
  onSetRole: (role: UserRole) => void;
  onUpdateProfileKey: (key: string, value: string) => void;
  onResetData: () => void;
}

export default function SettingsModal({
  profile,
  role,
  onClose,
  onSetRole,
  onUpdateProfileKey,
  onResetData
}: SettingsModalProps) {
  const [partnerAName, setPartnerAName] = useState(profile.partner_a_name);
  const [partnerBName, setPartnerBName] = useState(profile.partner_b_name);
  const [startDate, setStartDate] = useState(profile.start_date);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfileKey('partner_a_name', partnerAName.trim() || 'Partner A');
    onUpdateProfileKey('partner_b_name', partnerBName.trim() || 'Partner B');
    onUpdateProfileKey('start_date', startDate);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in">
      <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <div className="flex items-center gap-2">
            <Heart size={20} className="text-pink-500" fill="currentColor" />
            <h3 className="text-base font-extrabold text-gray-800">App-Einstellungen</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-700 rounded-full"
          >
            <X size={20} />
          </button>
        </div>

        {/* User Role Switcher */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-500 block">Aktuell eingeloggt als:</label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => onSetRole('Partner A')}
              className={`p-3 rounded-2xl border text-center transition-all ${
                role === 'Partner A'
                  ? 'border-pink-500 bg-pink-50 text-pink-700 font-extrabold shadow-sm'
                  : 'border-gray-200 text-gray-600 hover:border-gray-300'
              }`}
            >
              <UserCheck size={18} className="mx-auto mb-1 text-pink-500" />
              <span className="text-xs">{partnerAName}</span>
              <span className="text-[10px] block text-gray-400">Partner A</span>
            </button>

            <button
              type="button"
              onClick={() => onSetRole('Partner B')}
              className={`p-3 rounded-2xl border text-center transition-all ${
                role === 'Partner B'
                  ? 'border-purple-500 bg-purple-50 text-purple-700 font-extrabold shadow-sm'
                  : 'border-gray-200 text-gray-600 hover:border-gray-300'
              }`}
            >
              <UserCheck size={18} className="mx-auto mb-1 text-purple-500" />
              <span className="text-xs">{partnerBName}</span>
              <span className="text-[10px] block text-gray-400">Partner B</span>
            </button>
          </div>
        </div>

        {/* Profile Edit Form */}
        <form onSubmit={handleSave} className="space-y-3 pt-2">
          <div>
            <label className="text-xs font-bold text-gray-500">Name Partner A</label>
            <input
              type="text"
              required
              value={partnerAName}
              onChange={e => setPartnerAName(e.target.value)}
              className="w-full mt-1 border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-pink-400"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-gray-500">Name Partner B</label>
            <input
              type="text"
              required
              value={partnerBName}
              onChange={e => setPartnerBName(e.target.value)}
              className="w-full mt-1 border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-pink-400"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-gray-500">Zusammen seit (Jahrestag)</label>
            <input
              type="date"
              required
              value={startDate}
              onChange={e => setStartDate(e.target.value)}
              className="w-full mt-1 border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-pink-400"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white py-2.5 rounded-xl text-xs font-bold shadow-md flex items-center justify-center gap-1.5 transition-all"
          >
            {savedSuccess ? (
              <>
                <Check size={16} /> Gespeichert!
              </>
            ) : (
              'Änderungen speichern'
            )}
          </button>
        </form>

        {/* Server & Status Info */}
        <div className="pt-2 border-t border-gray-100 text-center space-y-2">
          <div className="flex items-center justify-center gap-2 text-[11px] text-gray-500">
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse" />
            <span>FastAPI Backend & SQLite synchronisiert</span>
          </div>

          <button
            onClick={onResetData}
            className="text-[11px] text-gray-400 hover:text-rose-500 font-bold flex items-center justify-center gap-1 mx-auto mt-2"
          >
            <RefreshCw size={12} /> Standard-Daten wiederherstellen
          </button>

          <p className="text-[10px] text-gray-300">Couple Link MVP v2.0</p>
        </div>
      </div>
    </div>
  );
}
