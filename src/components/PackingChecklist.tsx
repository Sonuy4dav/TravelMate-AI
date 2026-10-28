import React, { useState } from 'react';
import { CheckSquare, Square, Plus, Trash2, Luggage, Check, ShieldCheck } from 'lucide-react';
import { PackingItem } from '../types/itinerary';

interface PackingChecklistProps {
  items: PackingItem[];
  destination: string;
  onUpdateItems: (items: PackingItem[]) => void;
}

export const PackingChecklist: React.FC<PackingChecklistProps> = ({
  items,
  destination,
  onUpdateItems,
}) => {
  const [newItemText, setNewItemText] = useState('');
  const [newCategory, setNewCategory] = useState<'essentials' | 'clothing' | 'electronics' | 'health'>('essentials');

  const packedCount = items.filter((i) => i.packed).length;
  const progressPercent = items.length > 0 ? Math.round((packedCount / items.length) * 100) : 0;

  const toggleItem = (id: string) => {
    onUpdateItems(
      items.map((i) => (i.id === id ? { ...i, packed: !i.packed } : i))
    );
  };

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemText.trim()) return;

    const newItem: PackingItem = {
      id: `pack-${Date.now()}`,
      item: newItemText.trim(),
      category: newCategory,
      packed: false,
    };

    onUpdateItems([...items, newItem]);
    setNewItemText('');
  };

  const handleDeleteItem = (id: string) => {
    onUpdateItems(items.filter((i) => i.id !== id));
  };

  const handleMarkAllPacked = () => {
    const allPacked = packedCount === items.length;
    onUpdateItems(items.map((i) => ({ ...i, packed: !allPacked })));
  };

  const categories: { key: 'essentials' | 'clothing' | 'electronics' | 'health'; title: string }[] = [
    { key: 'essentials', title: 'Travel Essentials & Documents' },
    { key: 'clothing', title: 'Apparel & Footwear' },
    { key: 'electronics', title: 'Electronics & Adapters' },
    { key: 'health', title: 'Health, Wellness & Toiletries' },
  ];

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-6">
      {/* Header & Progress */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
        <div>
          <h3 className="text-base font-bold text-slate-900">
            Smart Packing Checklist for {destination}
          </h3>
          <span className="text-xs text-slate-500">
            Tailored to climate, expected activities, and local travel norms
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <span className="text-xs font-mono font-bold text-slate-900 tabular-nums">
              {packedCount} / {items.length} Packed
            </span>
            <div className="w-28 sm:w-36 h-2 bg-slate-100 rounded-full overflow-hidden mt-1">
              <div
                className="h-full bg-emerald-500 transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          <button
            onClick={handleMarkAllPacked}
            className="text-xs px-3 py-1.5 border border-slate-200 hover:bg-slate-50 rounded-lg text-slate-700 font-medium transition-colors cursor-pointer shrink-0"
          >
            {packedCount === items.length ? 'Uncheck All' : 'Mark All Packed'}
          </button>
        </div>
      </div>

      {/* Add Item Form */}
      <form onSubmit={handleAddItem} className="flex flex-col sm:flex-row gap-2">
        <input
          type="text"
          value={newItemText}
          onChange={(e) => setNewItemText(e.target.value)}
          placeholder="Add custom packing item (e.g. Rain poncho, earplugs)..."
          className="flex-1 text-xs sm:text-sm border border-slate-300 rounded-lg px-3.5 py-2"
        />
        <select
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value as any)}
          className="text-xs border border-slate-300 rounded-lg px-2.5 py-2 bg-white"
        >
          <option value="essentials">Essentials</option>
          <option value="clothing">Clothing</option>
          <option value="electronics">Electronics</option>
          <option value="health">Health</option>
        </select>
        <button
          type="submit"
          className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Item</span>
        </button>
      </form>

      {/* Grouped Checklist */}
      <div className="space-y-5">
        {categories.map((cat) => {
          const catItems = items.filter((i) => i.category === cat.key);
          if (catItems.length === 0) return null;

          return (
            <div key={cat.key} className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                {cat.title} ({catItems.filter((i) => i.packed).length}/{catItems.length})
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {catItems.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => toggleItem(item.id)}
                    className={`p-3 rounded-lg border transition-all flex items-center justify-between group cursor-pointer ${
                      item.packed
                        ? 'bg-slate-50 border-slate-200 text-slate-400 line-through'
                        : 'bg-white border-slate-200 hover:border-slate-300 text-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 overflow-hidden">
                      <div
                        className={`w-4 h-4 rounded border flex items-center justify-center transition-colors shrink-0 ${
                          item.packed
                            ? 'bg-emerald-600 border-emerald-600 text-white'
                            : 'border-slate-300 bg-white'
                        }`}
                      >
                        {item.packed && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                      <span className="text-xs sm:text-sm truncate select-none">{item.item}</span>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteItem(item.id);
                      }}
                      className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-rose-600 transition-opacity cursor-pointer shrink-0"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
