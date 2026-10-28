export type BudgetTier = 'budget' | 'balanced' | 'luxury';
export type TravelGroup = 'solo' | 'couple' | 'family' | 'friends' | 'business';
export type TravelPace = 'relaxed' | 'balanced' | 'fast-paced';
export type TimeSlot = 'morning' | 'afternoon' | 'evening';
export type ActivityCategory =
  | 'sightseeing'
  | 'dining'
  | 'culture'
  | 'art'
  | 'outdoor'
  | 'shopping'
  | 'leisure'
  | 'transport';

export interface TripPreferences {
  destination: string;
  startDate: string;
  durationDays: number;
  budgetTier: BudgetTier;
  currency: string;
  travelGroup: TravelGroup;
  pace: TravelPace;
  interests: string[];
  dietary: string[];
  specialRequests?: string;
}

export interface ActivityItem {
  id: string;
  timeSlot: TimeSlot;
  title: string;
  description: string;
  location: string;
  category: ActivityCategory;
  duration: string;
  estimatedCost: number;
  costLabel: string;
  insiderTip?: string;
  bookingRequired?: boolean;
  completed?: boolean;
}

export interface DiningRecommendation {
  id: string;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  restaurantName: string;
  cuisine: string;
  priceLevel: '$' | '$$' | '$$$' | '$$$$';
  mustTryDish: string;
  location: string;
  reservationTip?: string;
}

export interface DayPlan {
  dayNumber: number;
  date: string;
  themeTitle: string;
  summary: string;
  morning: ActivityItem[];
  afternoon: ActivityItem[];
  evening: ActivityItem[];
  dining: DiningRecommendation[];
  transitTip: string;
  dayNotes?: string;
  estimatedDayCost: number;
}

export interface BudgetBreakdown {
  accommodation: number;
  foodAndDining: number;
  activitiesAndAttractions: number;
  localTransportation: number;
  emergencyBuffer: number;
  totalEstimatedCost: number;
  currency: string;
  costPerPersonPerDay: number;
  budgetSavingTips: string[];
}

export interface PackingItem {
  id: string;
  item: string;
  category: 'essentials' | 'clothing' | 'electronics' | 'health';
  packed: boolean;
}

export interface DestinationGuide {
  bestTimeToVisit: string;
  currentSeasonWeather: string;
  suggestedAttire: string;
  localEtiquette: string[];
  essentialPhrases: { phrase: string; translation: string; pronunciation?: string }[];
  emergencyContacts: { service: string; number: string }[];
  packingChecklist: PackingItem[];
}

export interface Itinerary {
  id: string;
  title: string;
  destination: string;
  createdAt: string;
  updatedAt: string;
  preferences: TripPreferences;
  overview: string;
  highlights: string[];
  days: DayPlan[];
  budgetBreakdown: BudgetBreakdown;
  destinationGuide: DestinationGuide;
  status: 'planning' | 'upcoming' | 'completed';
}

export interface CuratedSampleTrip {
  id: string;
  destination: string;
  title: string;
  durationDays: number;
  budgetTier: BudgetTier;
  tagline: string;
  tags: string[];
  estimatedCostUSD: number;
  highlights: string[];
  itinerary: Itinerary;
}
