import { useState } from 'react';
import { ShoppingBag, Heart, Plus, Trash2, Check, MessageSquareHeart } from 'lucide-react';
import type { ShoppingItem, BucketItem, NoteItem, ProfileData, UserRole } from '../types';

interface ListsViewProps {
  shopping: ShoppingItem[];
  bucket: BucketItem[];
  notes: NoteItem[];
  profile: ProfileData;
  role: UserRole;
  onAddShopping: (item: string, category: string) => void;
  onToggleShopping: (id: number, isBought: boolean) => void;
  onDeleteShopping: (id: number) => void;
  onAddBucket: (title: string, category: string) => void;
  onToggleBucket: (id: number, isDone: boolean) => void;
  onDeleteBucket: (id: number) => void;
  onAddNote: (content: string, author: string, color: string) => void;
  onDeleteNote: (id: number) => void;
}

export default function ListsView({
  shopping,
  bucket,
  notes,
  profile,
  role,
  onAddShopping,
  onToggleShopping,
  onDeleteShopping,
  onAddBucket,
  onToggleBucket,
  onDeleteBucket,
  onAddNote,
  onDeleteNote
}: ListsViewProps) {
  const [activeSubTab, setActiveSubTab] = useState<'shopping' | 'bucket' | 'notes'>('shopping');

  // Form states
  const [newShoppingItem, setNewShoppingItem] = useState('');
  const [newBucketTitle, setNewBucketTitle] = useState('');
  const [newNoteContent, setNewNoteContent] = useState('');
  const [newNoteColor, setNewNoteColor] = useState('#fef3c7');

  const currentAuthorName = role === 'Partner A' ? profile.partner_a_name : profile.partner_b_name;

  const handleAddShopping = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newShoppingItem.trim()) return;
    onAddShopping(newShoppingItem.trim(), 'Supermarkt');
    setNewShoppingItem('');
  };

  const handleAddBucket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBucketTitle.trim()) return;
    onAddBucket(newBucketTitle.trim(), 'Abenteuer');
    setNewBucketTitle('');
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteContent.trim()) return;
    onAddNote(newNoteContent.trim(), currentAuthorName, newNoteColor);
    setNewNoteContent('');
  };

  return (
    <div className="space-y-4 animate-in">
      {/* Header and Sub-Tab Switcher */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-extrabold text-gray-800">Gemeinsames</h2>
          <p className="text-xs text-gray-400 font-medium">Einkäufe, Träume & Liebesnotizen</p>
        </div>
      </div>

      {/* Pill Switcher */}
      <div className="flex bg-white/80 p-1 rounded-2xl shadow-xs border border-gray-100">
        <button
          onClick={() => setActiveSubTab('shopping')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
            activeSubTab === 'shopping' ? 'bg-[var(--color-primary)] text-white shadow-sm' : 'text-gray-500 hover:text-gray-800'
          }`}
        >
          <ShoppingBag size={14} /> Einkaufen ({shopping.filter(s => !s.is_bought).length})
        </button>
        <button
          onClick={() => setActiveSubTab('bucket')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
            activeSubTab === 'bucket' ? 'bg-[var(--color-primary)] text-white shadow-sm' : 'text-gray-500 hover:text-gray-800'
          }`}
        >
          <Heart size={14} /> Bucket List
        </button>
        <button
          onClick={() => setActiveSubTab('notes')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
            activeSubTab === 'notes' ? 'bg-[var(--color-primary)] text-white shadow-sm' : 'text-gray-500 hover:text-gray-800'
          }`}
        >
          <MessageSquareHeart size={14} /> Zettel ({notes.length})
        </button>
      </div>

      {/* SUB-TAB 1: SHOPPING LIST */}
      {activeSubTab === 'shopping' && (
        <div className="space-y-3 animate-in">
          {/* Add input */}
          <form onSubmit={handleAddShopping} className="flex gap-2">
            <input
              type="text"
              required
              placeholder="Was brauchen wir? (z.B. Schokolade 🍫)"
              value={newShoppingItem}
              onChange={e => setNewShoppingItem(e.target.value)}
              className="flex-1 bg-white border border-gray-200 rounded-2xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-pink-400 shadow-xs"
            />
            <button
              type="submit"
              className="bg-[var(--color-primary)] text-white px-4 rounded-2xl text-xs font-bold shadow-md hover:bg-[var(--color-primary-dark)] flex items-center gap-1"
            >
              <Plus size={16} />
            </button>
          </form>

          {/* List items */}
          <div className="space-y-2">
            {shopping.length === 0 ? (
              <div className="glass-panel p-8 text-center text-gray-400 rounded-3xl">
                <ShoppingBag size={32} className="mx-auto mb-2 opacity-30" />
                <p className="text-xs">Alles erledigt! Der Kühlschrank ist voll 🎉</p>
              </div>
            ) : (
              shopping.map(item => (
                <div
                  key={item.id}
                  className={`glass-panel p-3 rounded-2xl flex items-center justify-between transition-all border ${
                    item.is_bought ? 'opacity-60 bg-gray-50/70 border-gray-100' : 'border-white/80'
                  }`}
                >
                  <button
                    onClick={() => onToggleShopping(item.id, !item.is_bought)}
                    className="flex items-center gap-2.5 flex-1 text-left"
                  >
                    <div
                      className={`w-5 h-5 rounded-lg border flex items-center justify-center transition-colors ${
                        item.is_bought
                          ? 'bg-emerald-500 border-emerald-500 text-white'
                          : 'border-gray-300 bg-white hover:border-pink-400'
                      }`}
                    >
                      {item.is_bought && <Check size={14} />}
                    </div>
                    <span
                      className={`text-xs font-bold ${
                        item.is_bought ? 'line-through text-gray-400' : 'text-gray-800'
                      }`}
                    >
                      {item.item}
                    </span>
                  </button>

                  <button
                    onClick={() => onDeleteShopping(item.id)}
                    className="text-gray-300 hover:text-rose-500 p-1 rounded-lg"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* SUB-TAB 2: BUCKET LIST */}
      {activeSubTab === 'bucket' && (
        <div className="space-y-3 animate-in">
          {/* Add Bucket Goal */}
          <form onSubmit={handleAddBucket} className="flex gap-2">
            <input
              type="text"
              required
              placeholder="Unser nächster Traum (z.B. Reise nach Rom 🏛️)"
              value={newBucketTitle}
              onChange={e => setNewBucketTitle(e.target.value)}
              className="flex-1 bg-white border border-gray-200 rounded-2xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-pink-400 shadow-xs"
            />
            <button
              type="submit"
              className="bg-purple-500 text-white px-4 rounded-2xl text-xs font-bold shadow-md hover:bg-purple-600 flex items-center gap-1"
            >
              <Plus size={16} />
            </button>
          </form>

          {/* Bucket items */}
          <div className="space-y-2">
            {bucket.map(b => (
              <div
                key={b.id}
                className={`glass-panel p-3.5 rounded-2xl flex items-center justify-between transition-all border ${
                  b.is_done ? 'bg-purple-50/60 border-purple-100' : 'border-white/80'
                }`}
              >
                <button
                  onClick={() => onToggleBucket(b.id, !b.is_done)}
                  className="flex items-center gap-3 flex-1 text-left"
                >
                  <div
                    className={`w-6 h-6 rounded-full border flex items-center justify-center transition-all ${
                      b.is_done
                        ? 'bg-purple-500 border-purple-500 text-white'
                        : 'border-pink-300 bg-white hover:bg-pink-50'
                    }`}
                  >
                    <Heart size={12} fill={b.is_done ? 'white' : 'transparent'} />
                  </div>
                  <div>
                    <span
                      className={`text-xs font-extrabold ${
                        b.is_done ? 'line-through text-purple-400' : 'text-gray-800'
                      }`}
                    >
                      {b.title}
                    </span>
                    <span className="text-[10px] block text-gray-400">{b.category}</span>
                  </div>
                </button>

                <button
                  onClick={() => onDeleteBucket(b.id)}
                  className="text-gray-300 hover:text-rose-500 p-1.5 rounded-lg"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-TAB 3: NOTES / LIEBESZETTEL */}
      {activeSubTab === 'notes' && (
        <div className="space-y-4 animate-in">
          {/* Add note card */}
          <form onSubmit={handleAddNote} className="glass-panel p-4 rounded-3xl shadow-sm space-y-3">
            <span className="text-xs font-bold text-gray-600 block">
              Liebesbotschaft für deinen Schatz hinterlassen 💌
            </span>
            <textarea
              required
              rows={2}
              placeholder="Schreib etwas Liebes..."
              value={newNoteContent}
              onChange={e => setNewNoteContent(e.target.value)}
              className="w-full bg-white/80 border border-gray-200 rounded-2xl p-3 text-xs focus:outline-none focus:border-pink-400"
            />
            <div className="flex items-center justify-between">
              {/* Color picker */}
              <div className="flex gap-2">
                {[
                  { color: '#fef3c7', name: 'Gelb' },
                  { color: '#fce7f3', name: 'Rosa' },
                  { color: '#e0e7ff', name: 'Blau' },
                  { color: '#dcfce7', name: 'Grün' }
                ].map(c => (
                  <button
                    key={c.color}
                    type="button"
                    onClick={() => setNewNoteColor(c.color)}
                    style={{ backgroundColor: c.color }}
                    className={`w-6 h-6 rounded-full border-2 transition-transform ${
                      newNoteColor === c.color ? 'scale-125 border-gray-600' : 'border-white'
                    }`}
                  />
                ))}
              </div>

              <button
                type="submit"
                className="bg-[var(--color-primary)] text-white px-4 py-2 rounded-xl text-xs font-bold shadow-md hover:bg-[var(--color-primary-dark)]"
              >
                Anpinnen 📌
              </button>
            </div>
          </form>

          {/* Sticky Notes Grid */}
          <div className="grid grid-cols-2 gap-3">
            {notes.map(note => (
              <div
                key={note.id}
                style={{ backgroundColor: note.color || '#fef3c7' }}
                className="p-3.5 rounded-2xl shadow-sm border border-black/5 flex flex-col justify-between relative group min-h-[110px]"
              >
                <button
                  onClick={() => onDeleteNote(note.id)}
                  className="absolute top-2 right-2 text-gray-400 hover:text-rose-500 opacity-60 hover:opacity-100"
                >
                  <Trash2 size={12} />
                </button>
                <p className="text-xs font-semibold text-gray-800 line-clamp-4 leading-relaxed pr-3">
                  "{note.content}"
                </p>
                <div className="mt-3 pt-1 border-t border-black/5 flex items-center justify-between text-[9px] text-gray-500 font-bold">
                  <span>{note.author}</span>
                  <span>{note.created_at}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
