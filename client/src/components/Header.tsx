import { Heart, Settings, UserCheck } from 'lucide-react';
import type { ProfileData, UserRole } from '../types';

interface HeaderProps {
  profile: ProfileData;
  role: UserRole;
  daysTogether: number;
  onOpenSettings: () => void;
  onToggleRole: () => void;
}

export default function Header({ profile, role, daysTogether, onOpenSettings, onToggleRole }: HeaderProps) {
  const currentPartnerName = role === 'Partner A' ? profile.partner_a_name : profile.partner_b_name;
  const otherPartnerName = role === 'Partner A' ? profile.partner_b_name : profile.partner_a_name;

  return (
    <header className="glass-panel sticky top-0 z-30 px-4 py-3 rounded-b-3xl shadow-sm border-b border-white/60 mb-4">
      <div className="flex items-center justify-between">
        {/* User Role Switcher Chip */}
        <button
          onClick={onToggleRole}
          title="Klicke um zwischen Partner A und B zu wechseln"
          className="flex items-center gap-1.5 bg-white/90 hover:bg-white text-xs font-bold text-gray-700 px-3 py-1.5 rounded-full shadow-sm border border-pink-100 transition-all active:scale-95"
        >
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
          <UserCheck size={14} className="text-[var(--color-primary)]" />
          <span>Ich: <span className="text-[var(--color-primary-dark)]">{currentPartnerName}</span></span>
        </button>

        {/* Days badge */}
        <div className="flex items-center gap-1 bg-pink-50/80 text-pink-600 px-3 py-1 rounded-full text-xs font-extrabold shadow-inner">
          <Heart size={12} fill="currentColor" className="text-pink-500 animate-pulse" />
          <span>{daysTogether} Tage</span>
        </div>

        {/* Settings button */}
        <button
          onClick={onOpenSettings}
          className="p-2 text-gray-400 hover:text-gray-700 hover:bg-white/80 rounded-full transition-colors"
          title="Einstellungen"
        >
          <Settings size={18} />
        </button>
      </div>

      <div className="text-center mt-2">
        <h1 className="text-xl font-extrabold gradient-text tracking-tight">
          {profile.partner_a_name} & {profile.partner_b_name}
        </h1>
        <p className="text-[11px] font-semibold text-gray-400">
          Verbunden mit <span className="text-gray-600">{otherPartnerName}</span> 💕
        </p>
      </div>
    </header>
  );
}
