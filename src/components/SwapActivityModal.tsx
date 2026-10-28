import React, { useState } from 'react';
import { X, Sparkles, RefreshCw, Check, ArrowRight } from 'lucide-react';
import { ActivityItem } from '../types/itinerary';
import { swapActivityAPI } from '../services/api';

interface SwapActivityModalProps {
  isOpen: boolean;
  onClose: () => void;
  activity: ActivityItem | null;
  destination: string;
  onConfirmSwap: (newActivity: ActivityItem) => void;
}

const PRESET_REASONS = [
  'Rainy day / Indoor alternative',
  'More budget-friendly or free activity',
  'Foodie / Gastronomy experience',
  'Scenic outdoor / Nature escape',
  'Off-the-beaten-path hidden gem',
  'More relaxing & low-energy pace',
];

export const SwapActivityModal: React.FC<SwapActivityModalProps> = ({
  isOpen,
  onClose,
  activity,
  destination,
  onConfirmSwap,
}) => {
  if (!isOpen || !activity) return null;

  const [selectedPreset, setSelectedPreset] = useState(PRESET_REASONS[0]);
  const [customPrompt, setCustomPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [suggestion, setSuggestion] = useState<ActivityItem | null>(null);

  const handleGenerateSuggestion = async () => {
    setIsGenerating(true);
    try {
      const pref = customPrompt.trim() ? customPrompt.trim() : selectedPreset;
      const result = await swapActivityAPI({
        destination,
        timeSlot: activity.timeSlot,
        currentTitle: activity.title,
        preference: pref,
      });
      setSuggestion({
        ...result,
        id: `swap-${Date.now()}`,
        timeSlot: activity.timeSlot,
        completed: false,
      });
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleApply = () => {
    if (suggestion) {
      onConfirmSwap(suggestion);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-indigo-100 text-indigo-700 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">AI Activity Alternative</h2>
              <span className="text-xs text-slate-500">Regenerate or swap a specific stop</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          {/* Current Activity Box */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Current Stop ({activity.timeSlot})
            </div>
            <div className="text-sm font-bold text-slate-800 mt-0.5">{activity.title}</div>
            <div className="text-xs text-slate-500 mt-1 line-clamp-2">{activity.description}</div>
          </div>

          {/* Preset Buttons */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">
              What kind of alternative are you looking for?
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {PRESET_REASONS.map((reason) => (
                <button
                  key={reason}
                  type="button"
                  onClick={() => {
                    setSelectedPreset(reason);
                    setCustomPrompt('');
                  }}
                  className={`p-2 text-left text-xs font-medium rounded-lg border transition-all cursor-pointer ${
                    selectedPreset === reason && !customPrompt
                      ? 'border-indigo-600 bg-indigo-50/60 text-indigo-900'
                      : 'border-slate-200 hover:border-slate-300 text-slate-700'
                  }`}
                >
                  {reason}
                </button>
              ))}
            </div>
          </div>

          {/* Custom Instruction */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Or Custom Preference
            </label>
            <input
              type="text"
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              placeholder="e.g., Kid-friendly science museum, quiet photography spot..."
              className="w-full text-xs sm:text-sm border border-slate-300 rounded-lg p-2.5"
            />
          </div>

          {/* Suggestion Result Box if generated */}
          {suggestion && (
            <div className="p-4 bg-indigo-50/70 border border-indigo-200 rounded-xl space-y-2 animate-in fade-in">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-700">AI Suggested Alternative</span>
                <span className="text-xs font-mono tabular-nums text-slate-600">
                  {suggestion.costLabel} · {suggestion.duration}
                </span>
              </div>
              <h4 className="text-sm font-bold text-slate-900">{suggestion.title}</h4>
              <p className="text-xs text-slate-600">{suggestion.description}</p>
              {suggestion.insiderTip && (
                <div className="text-xs text-indigo-900 bg-white/80 p-2 rounded-md border border-indigo-100">
                  <span className="font-semibold">Local tip:</span> {suggestion.insiderTip}
                </div>
              )}
            </div>
          )}

          {/* Action buttons */}
          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={handleGenerateSuggestion}
              disabled={isGenerating}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-lg transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
              <span>{isGenerating ? 'Consulting Gemini AI...' : suggestion ? 'Generate Another' : 'Get AI Alternative'}</span>
            </button>

            {suggestion && (
              <button
                type="button"
                onClick={handleApply}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors shadow-xs cursor-pointer"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Replace This Activity</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
