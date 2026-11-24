import { useState } from 'react';
import { Heart, Sparkles, Send, Utensils, Calendar, CheckSquare, MessageCircleHeart } from 'lucide-react';
import type { ProfileData, MoodData, CountdownItem, EventItem, MealItem, NoteItem, UserRole } from '../types';

const EMOJI_OPTIONS = ['🥰', '😊', '😴', '🥳', '😭', '🥺', '☕', '🍕', '🤒'];

interface DashboardProps {
  role: UserRole;
  profile: ProfileData;
  daysTogether: number;
  moods: Record<string, MoodData>;
  countdown: CountdownItem;
  events: EventItem[];
  meals: MealItem[];
  notes: NoteItem[];
  onUpdateMood: (emoji: string, text: string) => void;
  onSendHug: () => void;
  onNavigateTab: (tab: string) => void;
}

export default function Dashboard({
  role,
  profile,
  daysTogether,
  moods,
  countdown,
  events,
  meals,
  notes,
  onUpdateMood,
  onSendHug,
  onNavigateTab
}: DashboardProps) {
  const currentPartnerName = role === 'Partner A' ? profile.partner_a_name : profile.partner_b_name;
  const partnerName = role === 'Partner A' ? profile.partner_b_name : profile.partner_a_name;

  const myMood = moods[role || 'Partner A'] || { emoji: '😊', text: 'Gut drauf', updated_at: 'Gerade eben' };
  const partnerRole = role === 'Partner A' ? 'Partner B' : 'Partner A';
  const partnerMood = moods[partnerRole] || { emoji: '🥰', text: 'Denke an dich!', updated_at: 'Vorhin' };

  const [isEditingMood, setIsEditingMood] = useState(false);
  const [selectedEmoji, setSelectedEmoji] = useState(myMood.emoji);
  const [statusText, setStatusText] = useState(myMood.text);
  const [showHeartBurst, setShowHeartBurst] = useState(false);

  // Compute days until countdown
  const targetTime = new Date(countdown.target_date).getTime();
  const now = new Date().getTime();
  const diffDays = Math.max(0, Math.ceil((targetTime - now) / (1000 * 60 * 60 * 24)));

  // Next upcoming event
  const nextEvent = events.length > 0 ? events[0] : null;

  // Today's meal
  const todayDayName = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'][new Date().getDay()];
  const todaysMeal = meals.find(m => m.day === todayDayName);

  const handleSaveMood = () => {
    onUpdateMood(selectedEmoji, statusText);
    setIsEditingMood(false);
  };

  const triggerHug = () => {
    setShowHeartBurst(true);
    onSendHug();
    setTimeout(() => setShowHeartBurst(false), 1500);
  };

  return (
    <div className="space-y-4 animate-in">
      {/* Love Counter Hero Card */}
      <div className="glass-panel p-5 rounded-3xl relative overflow-hidden text-center shadow-sm">
        <div className="absolute top-[-30px] right-[-30px] w-28 h-28 bg-[var(--color-primary-light)] rounded-full blur-2xl opacity-60" />
        <div className="absolute bottom-[-30px] left-[-30px] w-28 h-28 bg-[var(--color-secondary)] rounded-full blur-2xl opacity-40" />

        <div className="relative z-10">
          <span className="text-xs uppercase tracking-widest font-bold text-gray-400">Unsere Liebesgeschichte</span>
          <div className="text-4xl font-extrabold gradient-text my-1 flex items-center justify-center gap-2">
            <span>{daysTogether}</span>
            <span className="text-2xl font-bold text-gray-600">Tage</span>
            <Heart size={28} className="text-pink-500 animate-bounce" fill="currentColor" />
          </div>
          <p className="text-xs text-gray-500">
            Jeder einzelne Tag mit dir ist besonders ✨
          </p>
        </div>
      </div>

      {/* Countdown Card */}
      {countdown && (
        <div
          onClick={() => onNavigateTab('calendar')}
          className="cursor-pointer bg-gradient-to-r from-pink-400 via-rose-400 to-purple-400 text-white p-4 rounded-3xl shadow-md flex items-center justify-between transition-transform active:scale-98"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
              <Sparkles size={24} className="animate-spin text-white" style={{ animationDuration: '6s' }} />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-pink-100">Vorfreude-Zähler</span>
              <h3 className="font-bold text-sm leading-tight text-white">{countdown.title}</h3>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-black">{diffDays}</div>
            <div className="text-[10px] font-semibold text-pink-100 uppercase">Tage</div>
          </div>
        </div>
      )}

      {/* Mood Sharing Widget */}
      <div className="glass-panel p-4 rounded-3xl shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-lg">💖</span>
            <h3 className="text-sm font-bold text-gray-700">Stimmungs-Radar</h3>
          </div>
          <button
            onClick={() => setIsEditingMood(!isEditingMood)}
            className="text-xs font-bold text-[var(--color-primary-dark)] hover:underline"
          >
            {isEditingMood ? 'Abbrechen' : 'Mein Status'}
          </button>
        </div>

        {isEditingMood ? (
          <div className="bg-white/80 p-3 rounded-2xl border border-pink-100 space-y-3">
            <div className="flex justify-between items-center overflow-x-auto pb-1 gap-1">
              {EMOJI_OPTIONS.map(emoji => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => setSelectedEmoji(emoji)}
                  className={`text-2xl p-1.5 rounded-xl transition-all ${
                    selectedEmoji === emoji ? 'bg-pink-100 scale-125 shadow-sm' : 'hover:bg-gray-100'
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={statusText}
                onChange={e => setStatusText(e.target.value)}
                placeholder="Wie fühlst du dich gerade?"
                maxLength={35}
                className="flex-1 bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-pink-400"
              />
              <button
                type="button"
                onClick={handleSaveMood}
                className="bg-[var(--color-primary)] text-white px-3 py-2 rounded-xl text-xs font-bold shadow-sm flex items-center gap-1 active:scale-95"
              >
                <Send size={12} /> Speichern
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {/* My Mood */}
            <div className="bg-white/80 p-3 rounded-2xl border border-pink-100 text-center relative flex flex-col justify-between">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">
                Ich ({currentPartnerName})
              </span>
              <div className="text-3xl my-1.5">{myMood.emoji}</div>
              <p className="text-xs font-bold text-gray-700 line-clamp-1">{myMood.text || 'Kein Status'}</p>
              <span className="text-[9px] text-gray-400 mt-1">{myMood.updated_at}</span>
            </div>

            {/* Partner's Mood */}
            <div className="bg-gradient-to-br from-pink-50 to-purple-50 p-3 rounded-2xl border border-purple-100 text-center relative flex flex-col justify-between">
              <span className="text-[10px] font-bold text-purple-600 uppercase tracking-wide">
                {partnerName}
              </span>
              <div className="text-3xl my-1.5">{partnerMood.emoji}</div>
              <p className="text-xs font-bold text-gray-700 line-clamp-1">{partnerMood.text || 'Kein Status'}</p>
              <span className="text-[9px] text-gray-400 mt-1">{partnerMood.updated_at}</span>
            </div>
          </div>
        )}
      </div>

      {/* Virtual Hug & Love Button */}
      <div className="glass-panel p-4 rounded-3xl shadow-sm text-center relative overflow-hidden">
        {showHeartBurst && (
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-20">
            <span className="text-5xl animate-ping">💖</span>
          </div>
        )}
        <div className="flex items-center justify-between">
          <div className="text-left">
            <div className="flex items-center gap-1.5">
              <Heart size={16} className="text-pink-500" fill="currentColor" />
              <span className="text-xs font-extrabold text-gray-700">Umarmungs-Konto</span>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">
              Bereits <strong className="text-pink-600 font-bold">{profile.hugs_count}</strong> Umarmungen getauscht!
            </p>
          </div>
          <button
            onClick={triggerHug}
            className="bg-gradient-to-r from-pink-500 to-rose-400 text-white px-4 py-2 rounded-2xl text-xs font-bold shadow-md hover:shadow-lg active:scale-95 flex items-center gap-1.5 transition-transform"
          >
            <span>Drück mich!</span> 🤗
          </button>
        </div>
      </div>

      {/* Quick Access Grid */}
      <div className="grid grid-cols-2 gap-3">
        {/* Next Date */}
        <div
          onClick={() => onNavigateTab('calendar')}
          className="glass-panel p-3.5 rounded-2xl cursor-pointer hover:bg-white/90 transition-all border border-pink-50"
        >
          <div className="flex items-center gap-2 mb-1.5 text-pink-500">
            <Calendar size={16} />
            <span className="text-xs font-bold text-gray-600">Nächstes Date</span>
          </div>
          <p className="text-xs font-bold text-gray-800 line-clamp-1">
            {nextEvent ? nextEvent.title : 'Kein Date eingetragen'}
          </p>
          <span className="text-[10px] text-gray-400 font-medium">
            {nextEvent ? nextEvent.date : 'Hier klicken zum Planen'}
          </span>
        </div>

        {/* Today's Meal */}
        <div
          onClick={() => onNavigateTab('meals')}
          className="glass-panel p-3.5 rounded-2xl cursor-pointer hover:bg-white/90 transition-all border border-pink-50"
        >
          <div className="flex items-center gap-2 mb-1.5 text-purple-500">
            <Utensils size={16} />
            <span className="text-xs font-bold text-gray-600">Heute kochen</span>
          </div>
          <p className="text-xs font-bold text-gray-800 line-clamp-1">
            {todaysMeal?.meal_name ? todaysMeal.meal_name : 'Noch nichts geplant'}
          </p>
          <span className="text-[10px] text-gray-400 font-medium">
            {todaysMeal?.cook ? `${todaysMeal.cook}` : 'Hier tippen zum Auswählen'}
          </span>
        </div>

        {/* Shopping list shortcut */}
        <div
          onClick={() => onNavigateTab('lists')}
          className="glass-panel p-3.5 rounded-2xl cursor-pointer hover:bg-white/90 transition-all border border-pink-50"
        >
          <div className="flex items-center gap-2 mb-1.5 text-emerald-500">
            <CheckSquare size={16} />
            <span className="text-xs font-bold text-gray-600">Einkaufsliste</span>
          </div>
          <p className="text-xs font-bold text-gray-800">Offene Besorgungen</p>
          <span className="text-[10px] text-gray-400 font-medium">Zur gemeinsamen Liste</span>
        </div>

        {/* Notes / Sweet love notes */}
        <div
          onClick={() => onNavigateTab('lists')}
          className="glass-panel p-3.5 rounded-2xl cursor-pointer hover:bg-white/90 transition-all border border-pink-50"
        >
          <div className="flex items-center gap-2 mb-1.5 text-amber-500">
            <MessageCircleHeart size={16} />
            <span className="text-xs font-bold text-gray-600">Liebeszettel</span>
          </div>
          <p className="text-xs font-bold text-gray-800 line-clamp-1">
            {notes.length > 0 ? notes[0].content : 'Hinterlasse eine Notiz'}
          </p>
          <span className="text-[10px] text-gray-400 font-medium">{notes.length} Notizen</span>
        </div>
      </div>
    </div>
  );
}
