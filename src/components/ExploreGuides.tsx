import React from 'react';
import { Compass, Sparkles, MapPin, Calendar, ArrowRight, DollarSign } from 'lucide-react';
import { SAMPLE_TRIPS } from '../data/sampleTrips';
import { Itinerary } from '../types/itinerary';

interface ExploreGuidesProps {
  onSelectCuratedTrip: (itinerary: Itinerary) => void;
  onPlanCustomTrip: (destination: string) => void;
}

export const ExploreGuides: React.FC<ExploreGuidesProps> = ({
  onSelectCuratedTrip,
  onPlanCustomTrip,
}) => {
  const POPULAR_IDEAS = [
    {
      city: 'Rome, Italy',
      title: 'Eternal City & Trastevere Evenings',
      duration: '4 Days',
      style: 'Historic & Foodie',
      highlight: 'Colosseum underground, Vatican museums, fresh handmade cacio e pepe.',
    },
    {
      city: 'Tokyo, Japan',
      title: 'Futuristic Metropolises & Old Shitamachi',
      duration: '6 Days',
      style: 'Modern & Culinary',
      highlight: 'Shinjuku golden gai, Tsukiji outer market, Meiji shrine forest.',
    },
    {
      city: 'Swiss Alps, Switzerland',
      title: 'Jungfrau Region Alpine Valleys',
      duration: '5 Days',
      style: 'Scenic & Hiking',
      highlight: 'Lauterbrunnen waterfalls, cogwheel trains to Grindelwald, fondue chalets.',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 mb-1.5">
          <span>CURATED TRAVEL COLLECTIONS</span>
          <span aria-hidden="true">·</span>
          <span>TESTED ROUTES</span>
          <span aria-hidden="true">·</span>
          <span>AUTHENTIC LOCAL SPOTS</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Curated Travel Guides & Inspirations
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
          Explore complete day-by-day itineraries curated by destination specialists. Load any guide to adapt it to your dates and preferences.
        </p>
      </div>

      {/* Featured Full Sample Guides */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {SAMPLE_TRIPS.map((st) => (
          <div
            key={st.id}
            className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-7 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-xs font-semibold text-indigo-600">
                  {st.destination}
                </span>
                <span className="text-xs font-mono font-bold text-slate-500 tabular-nums">
                  {st.durationDays} Days · ${st.estimatedCostUSD}
                </span>
              </div>

              <h3 className="text-xl font-bold text-slate-900 tracking-tight">{st.title}</h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">{st.tagline}</p>

              <div className="mt-4 pt-4 border-t border-slate-100 space-y-1.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                  Key Experiences:
                </span>
                {st.highlights.slice(0, 3).map((hl, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-slate-600">
                    <span className="text-indigo-600 font-bold font-mono">·</span>
                    <span>{hl}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
              <div className="flex gap-1.5 flex-wrap">
                {st.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[11px] text-slate-600 bg-slate-100 px-2 py-0.5 rounded"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <button
                onClick={() => onSelectCuratedTrip(st.itinerary)}
                className="flex items-center gap-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 px-3.5 py-2 rounded-lg transition-colors cursor-pointer shrink-0"
              >
                <span>Explore Itinerary</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Inspiration Generators */}
      <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl">
        <h3 className="text-base font-bold text-slate-900 mb-3">
          Explore Other World-Class Destinations
        </h3>
        <p className="text-xs text-slate-500 mb-5 max-w-xl">
          Instantly generate a customized day-by-day plan with smart local clustering and budget allocations.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {POPULAR_IDEAS.map((idea) => (
            <div
              key={idea.city}
              className="p-4 bg-white border border-slate-200 rounded-xl flex flex-col justify-between"
            >
              <div>
                <span className="text-xs font-bold text-indigo-600">{idea.city}</span>
                <h4 className="text-sm font-bold text-slate-900 mt-1">{idea.title}</h4>
                <p className="text-xs text-slate-500 mt-1">{idea.highlight}</p>
              </div>

              <button
                onClick={() => onPlanCustomTrip(idea.city)}
                className="mt-4 w-full py-1.5 px-3 text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-indigo-50 hover:text-indigo-700 border border-slate-200 hover:border-indigo-200 rounded-lg transition-colors cursor-pointer"
              >
                Generate Plan for {idea.city.split(',')[0]}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
