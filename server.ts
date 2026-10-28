import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import path from 'path';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const app = express();
app.use(express.json({ limit: '10mb' }));

const port = Number(process.env.PORT) || 3000;

// Initialize GoogleGenAI server-side with User-Agent telemetry
const apiKey = process.env.GEMINI_API_KEY || '';
const ai = apiKey
  ? new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

// Helper to sanitize or validate JSON
function cleanJsonOutput(text: string): string {
  let cleaned = text.trim();
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.replace(/^```json\s*/, '').replace(/\s*```$/, '');
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```\s*/, '').replace(/\s*```$/, '');
  }
  return cleaned;
}

// Fallback generator when Gemini API is unavailable or quota is exceeded
function generateFallbackItinerary(prefs: any) {
  const destination = prefs.destination || 'Kyoto, Japan';
  const duration = Math.min(Math.max(Number(prefs.durationDays) || 3, 1), 14);
  const currency = prefs.currency || 'USD';
  const budgetTier = prefs.budgetTier || 'balanced';

  const multiplier = budgetTier === 'luxury' ? 3.2 : budgetTier === 'budget' ? 0.6 : 1.4;
  const baseDayCost = 140 * multiplier;

  const sampleThemes = [
    {
      theme: 'Historic Landmarks & Heritage',
      summary: `Discover iconic architectural marvels, historic quarters, and foundational history of ${destination}.`,
      morning: 'Explore primary heritage landmark and historic sanctuary grounds before midday crowds arrive.',
      afternoon: 'Stroll through preserved artisan alleyways, craft workshops, and traditional tea houses.',
      evening: 'Scenic riverbank or promenade walk followed by authentic neighborhood dining.',
    },
    {
      theme: 'Gastronomy, Markets & Culinary Delights',
      summary: `A feast for the senses exploring bustling central markets, street food, and authentic regional culinary specialties.`,
      morning: 'Visit the oldest central food hall or produce market to taste fresh local morning specialties.',
      afternoon: 'Guided food trail through historic districts with local coffee roasters and artisan bakeries.',
      evening: 'Evening tapas, izakaya, or bistro crawl tasting signature local dinner favorites.',
    },
    {
      theme: 'Arts, Modern Culture & Scenic Vistas',
      summary: `Immerse in contemporary creative districts, celebrated galleries, and panoramic city viewpoints.`,
      morning: 'Modern art center or landmark architecture tour with quiet garden spaces.',
      afternoon: 'Boutique shopping district with local designers, bookshops, and scenic coffee stops.',
      evening: 'Sunset viewpoint followed by dinner at a panoramic rooftop or scenic neighborhood terrace.',
    },
    {
      theme: 'Nature Escapes & Hidden Enclaves',
      summary: `Escape the bustle into peaceful botanic gardens, serene coastal paths, or lush mountain lookouts.`,
      morning: 'Morning walk in botanical sanctuary or scenic forest trail with crisp morning air.',
      afternoon: 'Lakeside or hilltop historic village with quaint cafes and quiet craft shops.',
      evening: 'Relaxing hot spring, wellness bathhouse, or peaceful evening garden illumination.',
    },
    {
      theme: 'Neighborhood Immersion & Local Life',
      summary: `Live like a local in residential quarters, hidden bookstores, and cozy community squares.`,
      morning: 'Neighborhood flea market or local community bakery crawl.',
      afternoon: 'Independent museums, vintage record shops, and leafy canal pathways.',
      evening: 'Farewell celebratory dinner featuring authentic regional multi-course tasting menu.',
    },
  ];

  const days = [];
  const startTimestamp = prefs.startDate ? new Date(prefs.startDate).getTime() : Date.now();

  for (let i = 1; i <= duration; i++) {
    const template = sampleThemes[(i - 1) % sampleThemes.length];
    const currentDate = new Date(startTimestamp + (i - 1) * 86400000).toISOString().split('T')[0];

    days.push({
      dayNumber: i,
      date: currentDate,
      themeTitle: `Day ${i}: ${template.theme}`,
      summary: template.summary,
      morning: [
        {
          id: `d${i}-act-1`,
          timeSlot: 'morning',
          title: `${destination} Historic Discovery`,
          description: template.morning,
          location: `${destination} Central District`,
          category: 'sightseeing',
          duration: '2.5 hours',
          estimatedCost: Math.round(20 * multiplier),
          costLabel: `${currency} ${Math.round(20 * multiplier)} entrance`,
          insiderTip: 'Arrive 15 minutes before opening for serene photography without tour groups.',
          bookingRequired: false,
          completed: false,
        },
      ],
      afternoon: [
        {
          id: `d${i}-act-2`,
          timeSlot: 'afternoon',
          title: `Artisan Neighborhood & Heritage Walk`,
          description: template.afternoon,
          location: `${destination} Old Quarter`,
          category: 'culture',
          duration: '3 hours',
          estimatedCost: Math.round(15 * multiplier),
          costLabel: `${currency} ${Math.round(15 * multiplier)} activities`,
          insiderTip: 'Wear comfortable walking shoes; historic cobblestone streets are best explored on foot.',
          bookingRequired: false,
          completed: false,
        },
      ],
      evening: [
        {
          id: `d${i}-act-3`,
          timeSlot: 'evening',
          title: `Atmospheric Evening Walk & Nightscape`,
          description: template.evening,
          location: `${destination} Waterfront / Historic Square`,
          category: 'leisure',
          duration: '2 hours',
          estimatedCost: Math.round(10 * multiplier),
          costLabel: 'Free / Refreshments',
          insiderTip: 'Great time for long-exposure photography and listening to street musicians.',
          bookingRequired: false,
          completed: false,
        },
      ],
      dining: [
        {
          id: `d${i}-dine-1`,
          mealType: 'breakfast',
          restaurantName: `Morning Corner Cafe & Bakery`,
          cuisine: 'Local Breakfast & Specialty Coffee',
          priceLevel: '$',
          mustTryDish: 'Freshly baked regional pastry with house roast coffee',
          location: 'Walking distance from central station',
          reservationTip: 'Walk-ins welcome; grab an outdoor patio seat',
        },
        {
          id: `d${i}-dine-2`,
          mealType: 'lunch',
          restaurantName: `Artisan Market Kitchen`,
          cuisine: 'Traditional Regional Cuisine',
          priceLevel: '$$',
          mustTryDish: 'Seasonal chef specialty plate featuring local harvest',
          location: 'Adjacent to artisan craft district',
          reservationTip: 'Best to stop by around 12:15 PM before peak rush',
        },
        {
          id: `d${i}-dine-3`,
          mealType: 'dinner',
          restaurantName: `Heritage Bistro & Wine Room`,
          cuisine: 'Elevated Regional Dining',
          priceLevel: budgetTier === 'luxury' ? '$$$$' : '$$$',
          mustTryDish: 'Signature braised house specialty with regional dessert',
          location: 'Historic cobblestone promenade',
          reservationTip: 'Advance reservation recommended 1–2 days prior',
        },
      ],
      transitTip: 'Walkable central core; use local transit card or day pass for cross-town travel.',
      estimatedDayCost: Math.round(baseDayCost),
    });
  }

  const totalCost = Math.round(baseDayCost * duration);
  const accom = Math.round(totalCost * 0.42);
  const food = Math.round(totalCost * 0.28);
  const activities = Math.round(totalCost * 0.16);
  const transit = Math.round(totalCost * 0.08);
  const buffer = Math.round(totalCost * 0.06);

  return {
    id: `trip-${Date.now()}`,
    title: `${duration}-Day Curated Journey in ${destination}`,
    destination: destination,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    preferences: prefs,
    overview: `Experience the finest cultural heritage, culinary wonders, and scenic enclaves of ${destination}. Tailored for ${prefs.travelGroup || 'adventurous'} travelers at a ${prefs.pace || 'balanced'} pace with a ${budgetTier} budget.`,
    highlights: [
      `Immersive exploration of ${destination}'s most celebrated historic sanctuaries and architecture.`,
      `Curated food and market tastings showcasing authentic regional culinary traditions.`,
      `Scenic sunset vantage points and evening walking routes through atmospheric quarters.`,
      `Practical transit tips and insider local advice to avoid tourist bottlenecks.`,
    ],
    days: days,
    budgetBreakdown: {
      accommodation: accom,
      foodAndDining: food,
      activitiesAndAttractions: activities,
      localTransportation: transit,
      emergencyBuffer: buffer,
      totalEstimatedCost: totalCost,
      currency: currency,
      costPerPersonPerDay: Math.round(totalCost / duration),
      budgetSavingTips: [
        'Purchase a multi-day unlimited public transit pass on arrival to save up to 40% on single-ride tickets.',
        'Book major museum and landmark entrance tickets online 48 hours in advance for skip-the-line privileges and discounts.',
        'Enjoy generous lunch set menus (prix fixe) at high-end dining establishments for half the dinner price.',
        'Carry a refillable water bottle and take advantage of free walking tours and public scenic plazas.',
      ],
    },
    destinationGuide: {
      bestTimeToVisit: 'Spring (cherry blossoms / mild breeze) and Autumn (foliage & harvest season) offer ideal 18°C–23°C weather.',
      currentSeasonWeather: 'Pleasant daytime temperatures with cool evenings. Occasional light precipitation.',
      suggestedAttire: 'Comfortable broken-in walking shoes, smart casual layered clothing, compact travel umbrella.',
      localEtiquette: [
        'Respect quiet zones on public trains and buses; silence mobile devices.',
        'Tipping customs follow local standards; check restaurant bills before offering gratuities.',
        'Dress modestly when entering historic shrines, cathedrals, or sacred heritage complexes.',
        'Carry a small bag for personal litter as public bins may be clustered near transit stations.',
      ],
      essentialPhrases: [
        { phrase: 'Hello / Good day', translation: 'Local greeting', pronunciation: 'Friendly tone' },
        { phrase: 'Thank you very much', translation: 'Expressing gratitude', pronunciation: 'Warm & polite' },
        { phrase: 'Please / Excuse me', translation: 'Getting attention', pronunciation: 'Soft & courteous' },
        { phrase: 'How much is this?', translation: 'Market pricing', pronunciation: 'Clear inquiry' },
        { phrase: 'Where is the station?', translation: 'Directions', pronunciation: 'Helpful query' },
      ],
      emergencyContacts: [
        { service: 'Police & Public Safety', number: '112 / 911 / Local emergency' },
        { service: 'Medical & Ambulance', number: '119 / Local medical hotline' },
        { service: 'Tourist Assistance Center', number: '+1-800-TOURIST' },
      ],
      packingChecklist: [
        { id: 'pack-1', item: 'Passport & Travel Insurance documents (physical & digital copies)', category: 'essentials', packed: false },
        { id: 'pack-2', item: 'Universal power plug adapter & high-capacity power bank', category: 'electronics', packed: false },
        { id: 'pack-3', item: 'Ergonomic broken-in walking sneakers', category: 'clothing', packed: false },
        { id: 'pack-4', item: 'Breathable weather-resistant light shell jacket', category: 'clothing', packed: false },
        { id: 'pack-5', item: 'Personal first aid & essential prescription medications', category: 'health', packed: false },
        { id: 'pack-6', item: 'Offline navigation maps downloaded on phone', category: 'electronics', packed: false },
      ],
    },
    status: 'planning',
  };
}

// API: Generate Itinerary
app.post('/api/itinerary/generate', async (req: Request, res: Response) => {
  const prefs = req.body;
  if (!prefs || !prefs.destination) {
    res.status(400).json({ error: 'Destination is required.' });
    return;
  }

  const duration = Math.min(Math.max(Number(prefs.durationDays) || 3, 1), 14);
  const currency = prefs.currency || 'USD';
  const budgetTier = prefs.budgetTier || 'balanced';
  const travelGroup = prefs.travelGroup || 'solo';
  const pace = prefs.pace || 'balanced';
  const interests = Array.isArray(prefs.interests) && prefs.interests.length > 0 ? prefs.interests.join(', ') : 'Culture, Food, Scenic Highlights';
  const dietary = Array.isArray(prefs.dietary) && prefs.dietary.length > 0 ? prefs.dietary.join(', ') : 'No specific restrictions';
  const specialRequests = prefs.specialRequests || 'None';

  // If AI client is available, call Gemini 3.8 Flash
  if (ai) {
    try {
      const prompt = `You are TravelMate AI, an elite, worldly travel concierge and itinerary architect.
Generate an extraordinary, highly realistic, meticulously planned ${duration}-day travel itinerary for:
- Destination: ${prefs.destination}
- Start Date: ${prefs.startDate || 'Upcoming month'}
- Duration: ${duration} Days
- Budget Level: ${budgetTier} (Currency: ${currency})
- Travel Group: ${travelGroup}
- Pace: ${pace} (e.g. relaxed means spacious timing, fast-paced means high density)
- Interests: ${interests}
- Dietary Preferences: ${dietary}
- Special Notes / Constraints: ${specialRequests}

CRITICAL RULES:
1. Provide REAL, authentic, verifiable locations, historic landmarks, neighborhood names, and beloved restaurants in ${prefs.destination}.
2. Ensure realistic geographic clustering each day so travelers don't spend all day crisscrossing town.
3. Every day MUST have:
   - "themeTitle" (e.g. "Day 1: Historic Shrines & Gion Evening Lanterns")
   - "summary": 1-2 sentence overview of the day
   - "morning": array of 1-2 activities
   - "afternoon": array of 1-2 activities
   - "evening": array of 1-2 activities
   - "dining": array of 3 meals (breakfast, lunch, dinner) with realistic authentic restaurant names, cuisine type, priceLevel ($, $$, $$$, $$$$), mustTryDish, and reservation tips.
   - "transitTip": concrete public transit / walking guidance for that specific day
   - "estimatedDayCost": realistic numeric total in ${currency}
4. Provide a realistic "budgetBreakdown" in ${currency} with accommodation, foodAndDining, activitiesAndAttractions, localTransportation, emergencyBuffer, totalEstimatedCost, costPerPersonPerDay, and 4 practical budgetSavingTips.
5. Provide a "destinationGuide" with bestTimeToVisit, currentSeasonWeather, suggestedAttire, 4 localEtiquette tips, 5 essentialPhrases with translation/pronunciation, 3 emergencyContacts, and 6 packingChecklist items categorized by 'essentials'|'clothing'|'electronics'|'health'.

Return STRICTLY valid JSON conforming to the schema without markdown or extra commentary.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.7,
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              overview: { type: Type.STRING },
              highlights: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              days: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    dayNumber: { type: Type.INTEGER },
                    date: { type: Type.STRING },
                    themeTitle: { type: Type.STRING },
                    summary: { type: Type.STRING },
                    morning: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          id: { type: Type.STRING },
                          timeSlot: { type: Type.STRING },
                          title: { type: Type.STRING },
                          description: { type: Type.STRING },
                          location: { type: Type.STRING },
                          category: { type: Type.STRING },
                          duration: { type: Type.STRING },
                          estimatedCost: { type: Type.NUMBER },
                          costLabel: { type: Type.STRING },
                          insiderTip: { type: Type.STRING },
                          bookingRequired: { type: Type.BOOLEAN },
                        },
                        required: ['id', 'timeSlot', 'title', 'description', 'location', 'category', 'duration', 'estimatedCost', 'costLabel'],
                      },
                    },
                    afternoon: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          id: { type: Type.STRING },
                          timeSlot: { type: Type.STRING },
                          title: { type: Type.STRING },
                          description: { type: Type.STRING },
                          location: { type: Type.STRING },
                          category: { type: Type.STRING },
                          duration: { type: Type.STRING },
                          estimatedCost: { type: Type.NUMBER },
                          costLabel: { type: Type.STRING },
                          insiderTip: { type: Type.STRING },
                          bookingRequired: { type: Type.BOOLEAN },
                        },
                        required: ['id', 'timeSlot', 'title', 'description', 'location', 'category', 'duration', 'estimatedCost', 'costLabel'],
                      },
                    },
                    evening: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          id: { type: Type.STRING },
                          timeSlot: { type: Type.STRING },
                          title: { type: Type.STRING },
                          description: { type: Type.STRING },
                          location: { type: Type.STRING },
                          category: { type: Type.STRING },
                          duration: { type: Type.STRING },
                          estimatedCost: { type: Type.NUMBER },
                          costLabel: { type: Type.STRING },
                          insiderTip: { type: Type.STRING },
                          bookingRequired: { type: Type.BOOLEAN },
                        },
                        required: ['id', 'timeSlot', 'title', 'description', 'location', 'category', 'duration', 'estimatedCost', 'costLabel'],
                      },
                    },
                    dining: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          id: { type: Type.STRING },
                          mealType: { type: Type.STRING },
                          restaurantName: { type: Type.STRING },
                          cuisine: { type: Type.STRING },
                          priceLevel: { type: Type.STRING },
                          mustTryDish: { type: Type.STRING },
                          location: { type: Type.STRING },
                          reservationTip: { type: Type.STRING },
                        },
                        required: ['id', 'mealType', 'restaurantName', 'cuisine', 'priceLevel', 'mustTryDish', 'location'],
                      },
                    },
                    transitTip: { type: Type.STRING },
                    estimatedDayCost: { type: Type.NUMBER },
                  },
                  required: ['dayNumber', 'themeTitle', 'summary', 'morning', 'afternoon', 'evening', 'dining', 'transitTip', 'estimatedDayCost'],
                },
              },
              budgetBreakdown: {
                type: Type.OBJECT,
                properties: {
                  accommodation: { type: Type.NUMBER },
                  foodAndDining: { type: Type.NUMBER },
                  activitiesAndAttractions: { type: Type.NUMBER },
                  localTransportation: { type: Type.NUMBER },
                  emergencyBuffer: { type: Type.NUMBER },
                  totalEstimatedCost: { type: Type.NUMBER },
                  currency: { type: Type.STRING },
                  costPerPersonPerDay: { type: Type.NUMBER },
                  budgetSavingTips: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                },
                required: ['accommodation', 'foodAndDining', 'activitiesAndAttractions', 'localTransportation', 'emergencyBuffer', 'totalEstimatedCost', 'currency', 'costPerPersonPerDay', 'budgetSavingTips'],
              },
              destinationGuide: {
                type: Type.OBJECT,
                properties: {
                  bestTimeToVisit: { type: Type.STRING },
                  currentSeasonWeather: { type: Type.STRING },
                  suggestedAttire: { type: Type.STRING },
                  localEtiquette: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                  essentialPhrases: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        phrase: { type: Type.STRING },
                        translation: { type: Type.STRING },
                        pronunciation: { type: Type.STRING },
                      },
                      required: ['phrase', 'translation'],
                    },
                  },
                  emergencyContacts: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        service: { type: Type.STRING },
                        number: { type: Type.STRING },
                      },
                      required: ['service', 'number'],
                    },
                  },
                  packingChecklist: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        id: { type: Type.STRING },
                        item: { type: Type.STRING },
                        category: { type: Type.STRING },
                        packed: { type: Type.BOOLEAN },
                      },
                      required: ['id', 'item', 'category'],
                    },
                  },
                },
                required: ['bestTimeToVisit', 'currentSeasonWeather', 'suggestedAttire', 'localEtiquette', 'essentialPhrases', 'emergencyContacts', 'packingChecklist'],
              },
            },
            required: ['title', 'overview', 'highlights', 'days', 'budgetBreakdown', 'destinationGuide'],
          },
        },
      });

      const responseText = response.text || '';
      const parsed = JSON.parse(cleanJsonOutput(responseText));

      const finalItinerary = {
        id: `trip-${Date.now()}`,
        destination: prefs.destination,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        preferences: prefs,
        status: 'planning',
        ...parsed,
      };

      res.json(finalItinerary);
      return;
    } catch (err: any) {
      console.warn('Gemini API call failed or encountered quota limit; using robust fallback itinerary.', err?.message);
    }
  }

  // Graceful fallback
  const fallback = generateFallbackItinerary(prefs);
  res.json(fallback);
});

// API: Swap or regenerate an activity
app.post('/api/itinerary/swap-activity', async (req: Request, res: Response) => {
  const { destination, timeSlot, currentTitle, preference } = req.body;

  if (ai) {
    try {
      const prompt = `The traveler is in ${destination || 'the city'} and wants an alternative activity for the ${timeSlot || 'afternoon'} slot.
Current activity was: "${currentTitle || 'Sightseeing'}".
User preference / swap reason: "${preference || 'Give me an exciting alternative'}".

Suggest ONE compelling alternative activity. Return valid JSON with:
{
  "title": string,
  "description": string,
  "location": string,
  "category": "sightseeing"|"dining"|"culture"|"outdoor"|"shopping"|"leisure",
  "duration": string,
  "estimatedCost": number,
  "costLabel": string,
  "insiderTip": string,
  "bookingRequired": boolean
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.8,
        },
      });

      const parsed = JSON.parse(cleanJsonOutput(response.text || '{}'));
      res.json({
        id: `swap-${Date.now()}`,
        timeSlot: timeSlot || 'afternoon',
        ...parsed,
      });
      return;
    } catch (err: any) {
      console.warn('Swap activity AI call failed; returning fallback.', err?.message);
    }
  }

  // Fallback swap
  res.json({
    id: `swap-${Date.now()}`,
    timeSlot: timeSlot || 'afternoon',
    title: `Local Artisan Studio & Cultural Workshop in ${destination || 'the City'}`,
    description: `Engage with master craftsmen in an intimate studio space, exploring authentic local arts and tasting regional teas.`,
    location: `${destination || 'City'} Historic Quarter`,
    category: 'culture',
    duration: '2 hours',
    estimatedCost: 25,
    costLabel: '$25 admission & materials',
    insiderTip: 'Small group experience; photo-friendly and includes souvenir craft.',
    bookingRequired: false,
  });
});

// API: Trip Assistant / Ask Questions
app.post('/api/itinerary/ask-assistant', async (req: Request, res: Response) => {
  const { destination, question, tripContext } = req.body;

  if (!question) {
    res.status(400).json({ error: 'Question is required.' });
    return;
  }

  if (ai) {
    try {
      const prompt = `You are TravelMate AI, a knowledgeable local expert and travel advisor.
The user is planning a trip to ${destination || 'their destination'}.
Trip context: ${tripContext ? JSON.stringify(tripContext).slice(0, 500) : 'General trip planning'}
User question: "${question}"

Provide a direct, practical, insightful answer (150-250 words) with bullet points where appropriate. Include real local tips, timing advice, or warnings if relevant.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
      });

      res.json({ answer: response.text });
      return;
    } catch (err: any) {
      console.warn('AI advisor call failed; using fallback.', err?.message);
    }
  }

  res.json({
    answer: `For ${destination || 'your destination'}, public transit cards or day passes are typically the most economical option. Major attractions recommend advance online booking 24–48 hours ahead to avoid queues. Remember to carry a small amount of local currency for cash-only neighborhood bakeries and markets, and download offline transit maps prior to arriving!`,
  });
});

// Setup Vite or static serving
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`TravelMate AI server running at http://0.0.0.0:${port}`);
  });
}

startServer();
