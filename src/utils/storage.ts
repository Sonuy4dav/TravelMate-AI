import { Itinerary } from '../types/itinerary';
import { SAMPLE_TRIPS } from '../data/sampleTrips';

const STORAGE_KEY = 'travelmate_saved_trips_v1';
const ACTIVE_TRIP_KEY = 'travelmate_active_trip_id_v1';

export function getSavedTrips(): Itinerary[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      // Seed with initial curated sample trips for rich immediate experience
      const initial = SAMPLE_TRIPS.map((st) => st.itinerary);
      saveAllTrips(initial);
      return initial;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to load trips from localStorage', err);
    return SAMPLE_TRIPS.map((st) => st.itinerary);
  }
}

export function saveAllTrips(trips: Itinerary[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trips));
  } catch (err) {
    console.error('Failed to save trips to localStorage', err);
  }
}

export function saveTrip(trip: Itinerary): void {
  const trips = getSavedTrips();
  const existingIdx = trips.findIndex((t) => t.id === trip.id);
  const updatedTrip = { ...trip, updatedAt: new Date().toISOString() };

  if (existingIdx >= 0) {
    trips[existingIdx] = updatedTrip;
  } else {
    trips.unshift(updatedTrip);
  }
  saveAllTrips(trips);
  setActiveTripId(trip.id);
}

export function deleteTrip(tripId: string): Itinerary[] {
  const trips = getSavedTrips().filter((t) => t.id !== tripId);
  saveAllTrips(trips);
  return trips;
}

export function getActiveTripId(): string | null {
  try {
    return localStorage.getItem(ACTIVE_TRIP_KEY);
  } catch {
    return null;
  }
}

export function setActiveTripId(id: string): void {
  try {
    localStorage.setItem(ACTIVE_TRIP_KEY, id);
  } catch {
    // ignore
  }
}
