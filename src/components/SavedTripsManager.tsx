import React from 'react';
import { Calendar, MapPin, DollarSign, ArrowRight, Trash2, Copy, Bookmark, Plus } from 'lucide-react';
import { Itinerary } from '../types/itinerary';

interface SavedTripsManagerProps {
  trips: Itinerary[];
  activeTripId: string | null;
  onSelectTrip: (trip: Itinerary) => void;
  onDeleteTrip: (tripId: string) => void;
  onDuplicateTrip: (trip: Itinerary) => void;
  onNewTrip: () => void;
}

export const SavedTripsManager: React.FC<SavedTripsManagerProps> = ({
  trips,
  activeTripId,
  onSelectTrip,
  onDeleteTrip,
  onDuplicateTrip,
  onNewTrip,
}) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Saved Itineraries</h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Access your curated itineraries, customize stops, and plan future journeys
          </p>
        </div>

        <button
          onClick={onNewTrip}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors shadow-xs cursor-pointer self-start sm:self-center"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Plan New Trip</span>
        </button>
      </div>

      {trips.length === 0 ? (
        <div className="p-12 text-center bg-white border border-slate-200 rounded-2xl">
          <Bookmark className="w-8 h-8 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">No Saved Trips Yet</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Design your first personalized itinerary using the Trip Planner Wizard or choose a curated sample guide.
          </p>
          <button
            onClick={onNewTrip}
            className="mt-4 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors cursor-pointer"
          >
            Create Your First Itinerary
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {trips.map((trip) => {
            const isActive = trip.id === activeTripId;
            return (
              <div
                key={trip.id}
                className={`bg-white border rounded-xl overflow-hidden shadow-xs hover:shadow-sm transition-all flex flex-col justify-between ${
                  isActive ? 'border-indigo-500 ring-1 ring-indigo-500' : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="p-5">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-xs font-semibold text-indigo-600 truncate">
                      {trip.destination}
                    </span>
                    <span className="text-[11px] font-mono tabular-nums text-slate-400">
                      {trip.days.length} Days
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 line-clamp-1 hover:text-indigo-600 transition-colors">
                    {trip.title}
                  </h3>

                  <p className="text-xs text-slate-500 mt-1.5 line-clamp-2 leading-relaxed">
                    {trip.overview}
                  </p>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                    <div>
                      <span className="text-[11px] text-slate-400 block">Est. Budget:</span>
                      <span className="font-mono font-bold text-slate-900 tabular-nums">
                        {trip.budgetBreakdown.currency} {trip.budgetBreakdown.totalEstimatedCost.toLocaleString()}
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-[11px] text-slate-400 block">Style:</span>
                      <span className="capitalize font-medium text-slate-700">
                        {trip.preferences.budgetTier} · {trip.preferences.travelGroup}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => onSelectTrip(trip)}
                    className="flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors cursor-pointer"
                  >
                    <span>{isActive ? 'Currently Active' : 'Open Itinerary'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onDuplicateTrip(trip)}
                      title="Duplicate itinerary"
                      className="p-1 text-slate-400 hover:text-slate-700 rounded transition-colors cursor-pointer"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onDeleteTrip(trip.id)}
                      title="Delete saved trip"
                      className="p-1 text-slate-400 hover:text-rose-600 rounded transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
