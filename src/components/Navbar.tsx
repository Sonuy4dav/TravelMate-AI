import React from 'react';
import { Compass, Plus, Bookmark, MapPin, Sparkles } from 'lucide-react';

interface NavbarProps {
  activeTab: 'planner' | 'itinerary' | 'saved' | 'explore';
  setActiveTab: (tab: 'planner' | 'itinerary' | 'saved' | 'explore') => void;
  hasActiveTrip: boolean;
  onNewTrip: () => void;
  savedCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  hasActiveTrip,
  onNewTrip,
  savedCount,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark */}
        <button
          onClick={() => setActiveTab(hasActiveTrip ? 'itinerary' : 'planner')}
          className="flex items-center gap-2.5 text-slate-900 hover:text-indigo-600 transition-colors shrink-0 text-left cursor-pointer"
        >
          <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-sm">
            <Compass className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div>
            <span className="text-lg font-bold tracking-tight text-slate-900 block leading-tight">
              TravelMate<span className="text-indigo-600"> AI</span>
            </span>
            <span className="text-[11px] text-slate-400 font-medium block leading-none">
              Smart Itinerary Architect
            </span>
          </div>
        </button>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600">
          <button
            onClick={() => setActiveTab('planner')}
            className={`transition-colors whitespace-nowrap shrink-0 pb-1 border-b-2 cursor-pointer ${
              activeTab === 'planner'
                ? 'text-indigo-600 border-indigo-600 font-semibold'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            Trip Planner
          </button>

          {hasActiveTrip && (
            <button
              onClick={() => setActiveTab('itinerary')}
              className={`transition-colors whitespace-nowrap shrink-0 pb-1 border-b-2 cursor-pointer ${
                activeTab === 'itinerary'
                  ? 'text-indigo-600 border-indigo-600 font-semibold'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              Current Itinerary
            </button>
          )}

          <button
            onClick={() => setActiveTab('saved')}
            className={`transition-colors whitespace-nowrap shrink-0 pb-1 border-b-2 cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'saved'
                ? 'text-indigo-600 border-indigo-600 font-semibold'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>Saved Trips</span>
            {savedCount > 0 && (
              <span className="text-xs font-mono tabular-nums text-slate-400">
                ({savedCount})
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('explore')}
            className={`transition-colors whitespace-nowrap shrink-0 pb-1 border-b-2 cursor-pointer ${
              activeTab === 'explore'
                ? 'text-indigo-600 border-indigo-600 font-semibold'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            Curated Guides
          </button>
        </nav>

        {/* Zone 3: 1 Primary Action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onNewTrip}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 active:scale-[0.98] transition-all whitespace-nowrap shadow-sm cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Plan New Trip</span>
          </button>
        </div>
      </div>
    </header>
  );
};
