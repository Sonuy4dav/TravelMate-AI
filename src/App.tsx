import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { TripPlannerWizard } from './components/TripPlannerWizard';
import { ItineraryDashboard } from './components/ItineraryDashboard';
import { SavedTripsManager } from './components/SavedTripsManager';
import { ExploreGuides } from './components/ExploreGuides';
import { Itinerary, TripPreferences } from './types/itinerary';
import { SAMPLE_TRIPS } from './data/sampleTrips';
import {
  getSavedTrips,
  saveTrip,
  deleteTrip as deleteStoredTrip,
  saveAllTrips,
  getActiveTripId,
  setActiveTripId,
} from './utils/storage';
import { generateItineraryAPI } from './services/api';
import { Compass, CheckCircle2 } from 'lucide-react';

export default function App() {
  const [navTab, setNavTab] = useState<'planner' | 'itinerary' | 'saved' | 'explore'>('planner');
  const [savedTrips, setSavedTrips] = useState<Itinerary[]>([]);
  const [activeTrip, setActiveTrip] = useState<Itinerary | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Initialize saved trips on mount
  useEffect(() => {
    const loaded = getSavedTrips();
    setSavedTrips(loaded);

    const activeId = getActiveTripId();
    if (activeId) {
      const found = loaded.find((t) => t.id === activeId);
      if (found) {
        setActiveTrip(found);
      } else if (loaded.length > 0) {
        setActiveTrip(loaded[0]);
      }
    } else if (loaded.length > 0) {
      setActiveTrip(loaded[0]);
    }
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Generate itinerary handler
  const handleGenerateItinerary = async (prefs: TripPreferences) => {
    setIsLoading(true);
    try {
      const generated = await generateItineraryAPI(prefs);
      setActiveTrip(generated);
      saveTrip(generated);
      setSavedTrips(getSavedTrips());
      setNavTab('itinerary');
      showToast('Personalized Itinerary Generated Successfully!');
    } catch (err: any) {
      console.error('Failed to generate itinerary', err);
      // Fallback to sample or alert
      const sample = SAMPLE_TRIPS[0].itinerary;
      setActiveTrip({
        ...sample,
        destination: prefs.destination,
        title: `${prefs.durationDays}-Day Trip to ${prefs.destination}`,
      });
      setNavTab('itinerary');
      showToast('Itinerary created with curated recommendations.');
    } finally {
      setIsLoading(false);
    }
  };

  // Select sample trip
  const handleSelectSample = (tripId: string) => {
    const found = SAMPLE_TRIPS.find((s) => s.id === tripId);
    if (found) {
      setActiveTrip(found.itinerary);
      saveTrip(found.itinerary);
      setSavedTrips(getSavedTrips());
      setNavTab('itinerary');
      showToast(`Loaded ${found.destination} curated itinerary.`);
    }
  };

  // Update existing itinerary in place
  const handleUpdateItinerary = (updated: Itinerary) => {
    setActiveTrip(updated);
    saveTrip(updated);
    setSavedTrips(getSavedTrips());
  };

  // Save trip button in dashboard
  const handleSaveTrip = (trip: Itinerary) => {
    saveTrip(trip);
    setSavedTrips(getSavedTrips());
    showToast('Trip itinerary saved to your account!');
  };

  // Select trip from saved manager
  const handleSelectTrip = (trip: Itinerary) => {
    setActiveTrip(trip);
    setActiveTripId(trip.id);
    setNavTab('itinerary');
  };

  // Delete trip
  const handleDeleteTrip = (tripId: string) => {
    const remaining = deleteStoredTrip(tripId);
    setSavedTrips(remaining);
    if (activeTrip?.id === tripId) {
      setActiveTrip(remaining.length > 0 ? remaining[0] : null);
    }
    showToast('Trip removed from saved itineraries.');
  };

  // Duplicate trip
  const handleDuplicateTrip = (trip: Itinerary) => {
    const duplicated: Itinerary = {
      ...trip,
      id: `trip-copy-${Date.now()}`,
      title: `${trip.title} (Copy)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    saveTrip(duplicated);
    setSavedTrips(getSavedTrips());
    setActiveTrip(duplicated);
    setNavTab('itinerary');
    showToast('Duplicated itinerary created.');
  };

  // Go to new trip wizard
  const handleNewTrip = () => {
    setNavTab('planner');
  };

  const isCurrentTripSaved = Boolean(
    activeTrip && savedTrips.some((t) => t.id === activeTrip.id)
  );

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col font-sans">
      {/* Top Navigation */}
      <Navbar
        activeTab={navTab}
        setActiveTab={setNavTab}
        hasActiveTrip={Boolean(activeTrip)}
        onNewTrip={handleNewTrip}
        savedCount={savedTrips.length}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-lg border border-slate-700 text-xs font-semibold flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1">
        {navTab === 'planner' && (
          <TripPlannerWizard
            onGenerate={handleGenerateItinerary}
            isLoading={isLoading}
            onSelectSample={handleSelectSample}
          />
        )}

        {navTab === 'itinerary' && activeTrip && (
          <ItineraryDashboard
            itinerary={activeTrip}
            onUpdateItinerary={handleUpdateItinerary}
            onSaveTrip={handleSaveTrip}
            onNewTripClick={handleNewTrip}
            isSaved={isCurrentTripSaved}
          />
        )}

        {navTab === 'itinerary' && !activeTrip && (
          <div className="max-w-2xl mx-auto px-4 py-16 text-center">
            <h3 className="text-lg font-bold text-slate-800">No Active Itinerary Selected</h3>
            <p className="text-xs text-slate-500 mt-1">
              Start planning your journey or load a curated sample trip to explore.
            </p>
            <button
              onClick={() => setNavTab('planner')}
              className="mt-4 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 cursor-pointer"
            >
              Go to Trip Planner
            </button>
          </div>
        )}

        {navTab === 'saved' && (
          <SavedTripsManager
            trips={savedTrips}
            activeTripId={activeTrip?.id || null}
            onSelectTrip={handleSelectTrip}
            onDeleteTrip={handleDeleteTrip}
            onDuplicateTrip={handleDuplicateTrip}
            onNewTrip={handleNewTrip}
          />
        )}

        {navTab === 'explore' && (
          <ExploreGuides
            onSelectCuratedTrip={(itinerary) => {
              setActiveTrip(itinerary);
              saveTrip(itinerary);
              setSavedTrips(getSavedTrips());
              setNavTab('itinerary');
              showToast(`Loaded ${itinerary.destination} itinerary.`);
            }}
            onPlanCustomTrip={(dest) => {
              setNavTab('planner');
            }}
          />
        )}
      </main>

      {/* Quiet Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 mt-12 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-indigo-600" />
            <span className="font-semibold text-slate-800">TravelMate AI</span>
            <span aria-hidden="true">·</span>
            <span>Personalized Travel Itinerary Planner</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <span>Powered by Gemini Intelligence</span>
            <span aria-hidden="true">·</span>
            <span>Tabular Budgets & Day-by-Day Schedules</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
