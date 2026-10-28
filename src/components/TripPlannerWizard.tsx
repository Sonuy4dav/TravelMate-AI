import React, { useState } from 'react';
import {
  MapPin,
  Calendar,
  Wallet,
  Users,
  Compass,
  Sparkles,
  Utensils,
  Footprints,
  Clock,
  ArrowRight,
  Info,
} from 'lucide-react';
import { TripPreferences, BudgetTier, TravelGroup, TravelPace } from '../types/itinerary';

interface TripPlannerWizardProps {
  onGenerate: (prefs: TripPreferences) => Promise<void>;
  isLoading: boolean;
  onSelectSample: (tripId: string) => void;
}

const POPULAR_DESTINATIONS = [
  { city: 'Kyoto', country: 'Japan', desc: 'Ancient Temples & Zen' },
  { city: 'Paris', country: 'France', desc: 'Art, Cafes & Seine' },
  { city: 'Rome', country: 'Italy', desc: 'Colosseum & Gelato' },
  { city: 'Tokyo', country: 'Japan', desc: 'Neon & Culinary Wonders' },
  { city: 'Barcelona', country: 'Spain', desc: 'Gaudí & Tapas' },
  { city: 'Swiss Alps', country: 'Switzerland', desc: 'Alpine Peaks & Chalets' },
  { city: 'New York City', country: 'USA', desc: 'Museums, Skyline & Broadway' },
  { city: 'Bali', country: 'Indonesia', desc: 'Tropical Coast & Temples' },
];

const CURRENCIES = ['USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD', 'INR', 'CHF', 'SGD'];

const INTEREST_OPTIONS = [
  'Culture & History',
  'Local Gastronomy',
  'Nature & Scenic',
  'Art & Museums',
  'Shopping & Markets',
  'Nightlife & Entertainment',
  'Relaxation & Wellness',
  'Hidden Gems & Local Life',
  'Photography & Architecture',
];

const DIETARY_OPTIONS = [
  'None / All Food',
  'Vegetarian',
  'Vegan',
  'Halal',
  'Gluten-Free',
  'Kosher',
  'Seafood Lover',
];

export const TripPlannerWizard: React.FC<TripPlannerWizardProps> = ({
  onGenerate,
  isLoading,
  onSelectSample,
}) => {
  const [destination, setDestination] = useState('');
  const [startDate, setStartDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 14);
    return d.toISOString().split('T')[0];
  });
  const [durationDays, setDurationDays] = useState(4);
  const [budgetTier, setBudgetTier] = useState<BudgetTier>('balanced');
  const [currency, setCurrency] = useState('USD');
  const [travelGroup, setTravelGroup] = useState<TravelGroup>('couple');
  const [pace, setPace] = useState<TravelPace>('balanced');
  const [interests, setInterests] = useState<string[]>([
    'Culture & History',
    'Local Gastronomy',
    'Nature & Scenic',
  ]);
  const [dietary, setDietary] = useState<string[]>(['None / All Food']);
  const [specialRequests, setSpecialRequests] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const toggleInterest = (interest: string) => {
    setInterests((prev) =>
      prev.includes(interest) ? prev.filter((i) => i !== interest) : [...prev, interest]
    );
  };

  const toggleDietary = (item: string) => {
    if (item === 'None / All Food') {
      setDietary(['None / All Food']);
      return;
    }
    const filtered = dietary.filter((d) => d !== 'None / All Food');
    if (filtered.includes(item)) {
      const next = filtered.filter((d) => d !== item);
      setDietary(next.length === 0 ? ['None / All Food'] : next);
    } else {
      setDietary([...filtered, item]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!destination.trim()) {
      setErrorMsg('Please enter a destination to plan your trip.');
      return;
    }
    setErrorMsg('');

    const prefs: TripPreferences = {
      destination: destination.trim(),
      startDate,
      durationDays,
      budgetTier,
      currency,
      travelGroup,
      pace,
      interests: interests.length > 0 ? interests : ['Culture & History', 'Local Gastronomy'],
      dietary,
      specialRequests: specialRequests.trim() || undefined,
    };

    await onGenerate(prefs);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 sm:py-10">
      {/* Title & Introduction */}
      <div className="mb-8 text-center sm:text-left">
        <div className="flex items-center justify-center sm:justify-start gap-2 text-xs font-semibold text-indigo-600 mb-2">
          <span>AI-POWERED TRIP ITINERARY PLANNER</span>
          <span aria-hidden="true">·</span>
          <span>INTELLIGENT CLUSTERING</span>
          <span aria-hidden="true">·</span>
          <span>ESTIMATED BUDGETS</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Where will your next journey take you?
        </h1>
        <p className="mt-2 text-sm sm:text-base text-slate-600 max-w-2xl">
          Enter your travel dates, budget, and travel preferences. TravelMate AI builds a balanced,
          day-by-day plan with authentic dining spots, neighborhood routes, and cost estimates.
        </p>
      </div>

      {/* Quick Curated Inspiration Strip */}
      <div className="mb-8 p-4 bg-white border border-slate-200 rounded-xl">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Instant Sample Itineraries
          </span>
          <span className="text-xs text-slate-400">Pre-built & ready to explore</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => onSelectSample('sample-kyoto-5d')}
            className="flex items-start gap-3 p-3 text-left rounded-lg border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/40 transition-all cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-md bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-xs shrink-0">
              5D
            </div>
            <div>
              <div className="text-sm font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">
                Kyoto Cultural Immersion
              </div>
              <div className="text-xs text-slate-500 mt-0.5">
                5 Days · Zen Temples, Arashiyama Bamboo, Gion Kaiseki · $1,450
              </div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => onSelectSample('sample-paris-4d')}
            className="flex items-start gap-3 p-3 text-left rounded-lg border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/40 transition-all cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-md bg-blue-100 text-blue-800 flex items-center justify-center font-bold text-xs shrink-0">
              4D
            </div>
            <div>
              <div className="text-sm font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">
                Paris Art & Gastronomy
              </div>
              <div className="text-xs text-slate-500 mt-0.5">
                4 Days · Louvre, Left Bank Bistros, Montmartre Sunset · $1,680
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Form Container */}
      <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 shadow-sm space-y-7">
        {/* Step 1: Destination */}
        <div>
          <label htmlFor="destination" className="block text-sm font-bold text-slate-900 mb-1.5">
            1. Destination City or Region <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <MapPin className="w-5 h-5 text-indigo-500" />
            </div>
            <input
              id="destination"
              type="text"
              value={destination}
              onChange={(e) => {
                setDestination(e.target.value);
                if (errorMsg) setErrorMsg('');
              }}
              placeholder="e.g., Tokyo, Rome, Barcelona, Swiss Alps, New York"
              className="w-full pl-11 pr-4 py-2.5 text-sm sm:text-base border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
            />
          </div>

          {/* Quick pick chips */}
          <div className="mt-3 flex items-center gap-1.5 flex-wrap">
            <span className="text-xs text-slate-400 mr-1">Popular:</span>
            {POPULAR_DESTINATIONS.map((dest) => (
              <button
                key={dest.city}
                type="button"
                onClick={() => setDestination(`${dest.city}, ${dest.country}`)}
                className={`text-xs px-2.5 py-1 rounded-md border transition-all cursor-pointer ${
                  destination.toLowerCase().includes(dest.city.toLowerCase())
                    ? 'bg-indigo-600 text-white border-indigo-600'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-slate-300 hover:text-slate-900'
                }`}
              >
                {dest.city}
              </button>
            ))}
          </div>

          {errorMsg && (
            <p className="mt-2 text-xs font-medium text-rose-600 flex items-center gap-1">
              <Info className="w-3.5 h-3.5" />
              {errorMsg}
            </p>
          )}
        </div>

        {/* Step 2: Travel Dates & Duration */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2 border-t border-slate-100">
          <div>
            <label htmlFor="startDate" className="block text-sm font-bold text-slate-900 mb-1.5">
              2. Departure / Start Date
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Calendar className="w-4 h-4" />
              </div>
              <input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full pl-10 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <p className="text-xs text-slate-400 mt-1">Used to provide accurate seasonal weather and daylight tips.</p>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="durationDays" className="text-sm font-bold text-slate-900">
                Trip Duration: <span className="text-indigo-600 font-mono tabular-nums">{durationDays} Days</span>
              </label>
              <span className="text-xs text-slate-400 font-mono tabular-nums">1 to 14 days</span>
            </div>
            <input
              id="durationDays"
              type="range"
              min="1"
              max="14"
              value={durationDays}
              onChange={(e) => setDurationDays(Number(e.target.value))}
              className="w-full accent-indigo-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-slate-400 mt-1 font-mono tabular-nums">
              <span>Weekend (2-3d)</span>
              <span>Week (7d)</span>
              <span>Extended (14d)</span>
            </div>
          </div>
        </div>

        {/* Step 3: Budget Tier & Currency */}
        <div className="pt-2 border-t border-slate-100">
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-bold text-slate-900">
              3. Budget Level & Currency
            </label>
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-slate-500">Currency:</span>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="text-xs border border-slate-300 rounded-md px-2 py-1 bg-white font-mono tabular-nums text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                {CURRENCIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              {
                id: 'budget',
                label: 'Budget / Backpacker',
                price: '$',
                desc: 'Hostels, public transit, street food & free landmarks',
              },
              {
                id: 'balanced',
                label: 'Balanced / Comfort',
                price: '$$',
                desc: '3-4★ boutique hotels, authentic bistros & top sights',
              },
              {
                id: 'luxury',
                label: 'Luxury / Premium',
                price: '$$$$',
                desc: '5★ luxury resorts, fine dining & private curated tours',
              },
            ].map((tier) => (
              <button
                key={tier.id}
                type="button"
                onClick={() => setBudgetTier(tier.id as BudgetTier)}
                className={`p-3.5 rounded-lg border text-left transition-all cursor-pointer ${
                  budgetTier === tier.id
                    ? 'border-indigo-600 bg-indigo-50/50 ring-1 ring-indigo-600'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900">{tier.label}</span>
                  <span className="font-mono text-xs font-bold text-indigo-600">{tier.price}</span>
                </div>
                <p className="text-xs text-slate-500 mt-1">{tier.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Step 4: Travel Group & Pace */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2 border-t border-slate-100">
          <div>
            <label className="block text-sm font-bold text-slate-900 mb-2">
              4. Travel Party / Group
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
              {[
                { id: 'solo', label: 'Solo' },
                { id: 'couple', label: 'Couple' },
                { id: 'family', label: 'Family' },
                { id: 'friends', label: 'Friends' },
                { id: 'business', label: 'Business' },
              ].map((grp) => (
                <button
                  key={grp.id}
                  type="button"
                  onClick={() => setTravelGroup(grp.id as TravelGroup)}
                  className={`py-2 px-1 text-center text-xs font-medium rounded-lg border transition-all cursor-pointer ${
                    travelGroup === grp.id
                      ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                      : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {grp.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-900 mb-2">
              5. Daily Itinerary Pace
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'relaxed', label: 'Relaxed', desc: '1-2 sights/day' },
                { id: 'balanced', label: 'Balanced', desc: '3-4 sights/day' },
                { id: 'fast-paced', label: 'Fast-Paced', desc: 'Packed stops' },
              ].map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setPace(p.id as TravelPace)}
                  className={`py-2 px-1 text-center text-xs font-medium rounded-lg border transition-all cursor-pointer ${
                    pace === p.id
                      ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                      : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div>{p.label}</div>
                  <div className={`text-[10px] mt-0.5 ${pace === p.id ? 'text-slate-300' : 'text-slate-400'}`}>
                    {p.desc}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Step 5: Interests & Themes (Multi-select) */}
        <div className="pt-2 border-t border-slate-100">
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-bold text-slate-900">
              6. Travel Interests & Themes
            </label>
            <span className="text-xs text-slate-400">Select all that apply</span>
          </div>

          <div className="flex flex-wrap gap-2">
            {INTEREST_OPTIONS.map((interest) => {
              const selected = interests.includes(interest);
              return (
                <button
                  key={interest}
                  type="button"
                  onClick={() => toggleInterest(interest)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all cursor-pointer ${
                    selected
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-100'
                  }`}
                >
                  {interest}
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 6: Dietary & Special Notes */}
        <div className="pt-2 border-t border-slate-100 space-y-4">
          <div>
            <label className="block text-sm font-bold text-slate-900 mb-2">
              7. Dietary Preferences (for dining picks)
            </label>
            <div className="flex flex-wrap gap-2">
              {DIETARY_OPTIONS.map((item) => {
                const selected = dietary.includes(item);
                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => toggleDietary(item)}
                    className={`px-3 py-1 text-xs font-medium rounded-lg border transition-all cursor-pointer ${
                      selected
                        ? 'bg-slate-800 text-white border-slate-800'
                        : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    {item}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label htmlFor="specialRequests" className="block text-xs font-bold text-slate-700 mb-1">
              Special Notes / Physical Accessibility (Optional)
            </label>
            <input
              id="specialRequests"
              type="text"
              value={specialRequests}
              onChange={(e) => setSpecialRequests(e.target.value)}
              placeholder="e.g., Stroller friendly, walking limited to 10k steps, love rooftop views, celebrate anniversary..."
              className="w-full px-3.5 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-4 border-t border-slate-100">
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3.5 px-6 rounded-lg font-semibold text-sm sm:text-base text-white flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer ${
              isLoading
                ? 'bg-indigo-400 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99]'
            }`}
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Designing Your Personalized Itinerary...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Generate Personalized Itinerary</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </>
            )}
          </button>
          <p className="text-center text-xs text-slate-400 mt-2">
            Generated using Gemini 3.8 Flash intelligence with localized timing, transit, and authentic food recommendations.
          </p>
        </div>
      </form>
    </div>
  );
};
