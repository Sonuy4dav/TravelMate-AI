import { Itinerary, TripPreferences, ActivityItem } from '../types/itinerary';

export async function generateItineraryAPI(prefs: TripPreferences): Promise<Itinerary> {
  const response = await fetch('/api/itinerary/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(prefs),
  });

  if (!response.ok) {
    throw new Error(`Failed to generate itinerary: ${response.statusText}`);
  }

  return response.json();
}

export async function swapActivityAPI(payload: {
  destination: string;
  timeSlot: string;
  currentTitle: string;
  preference: string;
}): Promise<ActivityItem> {
  const response = await fetch('/api/itinerary/swap-activity', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Failed to swap activity: ${response.statusText}`);
  }

  return response.json();
}

export async function askTripAdvisorAPI(payload: {
  destination: string;
  question: string;
  tripContext?: any;
}): Promise<{ answer: string }> {
  const response = await fetch('/api/itinerary/ask-assistant', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Failed to query trip advisor: ${response.statusText}`);
  }

  return response.json();
}
