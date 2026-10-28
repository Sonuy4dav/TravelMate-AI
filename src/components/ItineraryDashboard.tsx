import React, { useState } from 'react';
import {
  Calendar,
  MapPin,
  Clock,
  Sparkles,
  Plus,
  Edit2,
  Trash2,
  RefreshCw,
  CheckCircle2,
  Share2,
  Bookmark,
  DollarSign,
  Utensils,
  Navigation,
  Luggage,
  BookOpen,
  MessageSquare,
  HelpCircle,
  FileText,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { Itinerary, DayPlan, ActivityItem, TimeSlot, BudgetBreakdown, PackingItem } from '../types/itinerary';
import { ActivityModal } from './ActivityModal';
import { SwapActivityModal } from './SwapActivityModal';
import { ExportModal } from './ExportModal';
import { BudgetVisualizer } from './BudgetVisualizer';
import { PackingChecklist } from './PackingChecklist';
import { DestinationGuideView } from './DestinationGuideView';
import { TripAdvisorPanel } from './TripAdvisorPanel';

interface ItineraryDashboardProps {
  itinerary: Itinerary;
  onUpdateItinerary: (updated: Itinerary) => void;
  onSaveTrip: (itinerary: Itinerary) => void;
  onNewTripClick: () => void;
  isSaved: boolean;
}

type TabType = 'timeline' | 'budget' | 'packing' | 'guide' | 'advisor';

export const ItineraryDashboard: React.FC<ItineraryDashboardProps> = ({
  itinerary,
  onUpdateItinerary,
  onSaveTrip,
  onNewTripClick,
  isSaved,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('timeline');
  const [selectedDayNumber, setSelectedDayNumber] = useState<number | 'all'>('all');

  // Modals state
  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);
  const [editingActivity, setEditingActivity] = useState<ActivityItem | null>(null);
  const [targetDayNumber, setTargetDayNumber] = useState<number>(1);
  const [targetSlot, setTargetSlot] = useState<TimeSlot>('morning');

  const [isSwapModalOpen, setIsSwapModalOpen] = useState(false);
  const [swapTargetActivity, setSwapTargetActivity] = useState<ActivityItem | null>(null);
  const [swapTargetDayNumber, setSwapTargetDayNumber] = useState<number>(1);

  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  // Toggle activity completed state
  const handleToggleComplete = (dayNum: number, activityId: string) => {
    const updatedDays = itinerary.days.map((day) => {
      if (day.dayNumber !== dayNum) return day;

      const toggleSlot = (list: ActivityItem[]) =>
        list.map((act) => (act.id === activityId ? { ...act, completed: !act.completed } : act));

      return {
        ...day,
        morning: toggleSlot(day.morning),
        afternoon: toggleSlot(day.afternoon),
        evening: toggleSlot(day.evening),
      };
    });

    onUpdateItinerary({ ...itinerary, days: updatedDays });
  };

  // Open modal to add activity
  const handleOpenAddActivity = (dayNum: number, slot: TimeSlot = 'morning') => {
    setEditingActivity(null);
    setTargetDayNumber(dayNum);
    setTargetSlot(slot);
    setIsActivityModalOpen(true);
  };

  // Open modal to edit activity
  const handleOpenEditActivity = (dayNum: number, activity: ActivityItem) => {
    setEditingActivity(activity);
    setTargetDayNumber(dayNum);
    setTargetSlot(activity.timeSlot);
    setIsActivityModalOpen(true);
  };

  // Delete activity
  const handleDeleteActivity = (dayNum: number, activityId: string) => {
    const updatedDays = itinerary.days.map((day) => {
      if (day.dayNumber !== dayNum) return day;
      return {
        ...day,
        morning: day.morning.filter((a) => a.id !== activityId),
        afternoon: day.afternoon.filter((a) => a.id !== activityId),
        evening: day.evening.filter((a) => a.id !== activityId),
      };
    });

    onUpdateItinerary({ ...itinerary, days: updatedDays });
  };

  // Save activity (create or update)
  const handleSaveActivity = (activity: ActivityItem) => {
    const updatedDays = itinerary.days.map((day) => {
      if (day.dayNumber !== targetDayNumber) return day;

      // Remove from old slot if editing
      const cleanMorning = day.morning.filter((a) => a.id !== activity.id);
      const cleanAfternoon = day.afternoon.filter((a) => a.id !== activity.id);
      const cleanEvening = day.evening.filter((a) => a.id !== activity.id);

      if (activity.timeSlot === 'morning') cleanMorning.push(activity);
      if (activity.timeSlot === 'afternoon') cleanAfternoon.push(activity);
      if (activity.timeSlot === 'evening') cleanEvening.push(activity);

      return {
        ...day,
        morning: cleanMorning,
        afternoon: cleanAfternoon,
        evening: cleanEvening,
      };
    });

    onUpdateItinerary({ ...itinerary, days: updatedDays });
  };

  // Open swap modal
  const handleOpenSwapModal = (dayNum: number, activity: ActivityItem) => {
    setSwapTargetDayNumber(dayNum);
    setSwapTargetActivity(activity);
    setIsSwapModalOpen(true);
  };

  // Apply swapped activity
  const handleApplySwap = (newActivity: ActivityItem) => {
    if (!swapTargetActivity) return;

    const updatedDays = itinerary.days.map((day) => {
      if (day.dayNumber !== swapTargetDayNumber) return day;

      const swapInList = (list: ActivityItem[]) =>
        list.map((act) => (act.id === swapTargetActivity.id ? newActivity : act));

      return {
        ...day,
        morning: swapInList(day.morning),
        afternoon: swapInList(day.afternoon),
        evening: swapInList(day.evening),
      };
    });

    onUpdateItinerary({ ...itinerary, days: updatedDays });
  };

  // Update budget
  const handleUpdateBudget = (updatedBudget: BudgetBreakdown) => {
    onUpdateItinerary({ ...itinerary, budgetBreakdown: updatedBudget });
  };

  // Update packing items
  const handleUpdatePacking = (updatedItems: PackingItem[]) => {
    onUpdateItinerary({
      ...itinerary,
      destinationGuide: {
        ...itinerary.destinationGuide,
        packingChecklist: updatedItems,
      },
    });
  };

  // Filtered days for display
  const displayedDays =
    selectedDayNumber === 'all'
      ? itinerary.days
      : itinerary.days.filter((d) => d.dayNumber === selectedDayNumber);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Hero Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500 mb-1.5 flex-wrap">
              <span className="font-semibold text-indigo-600">{itinerary.destination}</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono tabular-nums">{itinerary.days.length} Days</span>
              <span aria-hidden="true">·</span>
              <span className="capitalize">{itinerary.preferences.budgetTier} Budget</span>
              <span aria-hidden="true">·</span>
              <span className="capitalize">{itinerary.preferences.travelGroup} Party</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {itinerary.title}
            </h1>
            <p className="mt-2 text-sm text-slate-600 max-w-3xl leading-relaxed">
              {itinerary.overview}
            </p>
          </div>

          {/* Action CTAs */}
          <div className="flex items-center gap-2.5 shrink-0 flex-wrap no-print">
            <button
              onClick={() => onSaveTrip(itinerary)}
              className={`flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                isSaved
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                  : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <Bookmark className="w-3.5 h-3.5" />
              <span>{isSaved ? 'Trip Saved' : 'Save Trip'}</span>
            </button>

            <button
              onClick={() => setIsExportModalOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Export & Share</span>
            </button>

            <button
              onClick={onNewTripClick}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors shadow-xs cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Plan Another Trip</span>
            </button>
          </div>
        </div>

        {/* Highlights List */}
        {itinerary.highlights && itinerary.highlights.length > 0 && (
          <div className="mt-6 pt-5 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-slate-600">
            {itinerary.highlights.map((h, idx) => (
              <div key={idx} className="flex items-start gap-2">
                <span className="font-mono text-indigo-600 font-bold">✓</span>
                <span>{h}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Navigation Tabs (Top-Level View Switcher) */}
      <div className="border-b border-slate-200 no-print flex items-center justify-between gap-4 overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-6">
          {[
            { id: 'timeline', label: 'Day-by-Day Itinerary', icon: Calendar },
            { id: 'budget', label: 'Budget & Cost Breakdown', icon: DollarSign },
            { id: 'packing', label: 'Packing Checklist', icon: Luggage },
            { id: 'guide', label: 'Destination Guide', icon: BookOpen },
            { id: 'advisor', label: 'AI Concierge & Q&A', icon: MessageSquare },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`py-3 text-xs sm:text-sm font-semibold border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap cursor-pointer ${
                  active
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* TAB 1: Day-by-Day Timeline View */}
      {activeTab === 'timeline' && (
        <div className="space-y-6">
          {/* Day Selector Ribbon */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar no-print">
            <button
              onClick={() => setSelectedDayNumber('all')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                selectedDayNumber === 'all'
                  ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
              }`}
            >
              All Days ({itinerary.days.length})
            </button>

            {itinerary.days.map((day) => (
              <button
                key={day.dayNumber}
                onClick={() => setSelectedDayNumber(day.dayNumber)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                  selectedDayNumber === day.dayNumber
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                }`}
              >
                Day {day.dayNumber}
              </button>
            ))}
          </div>

          {/* Days Loop */}
          <div className="space-y-8">
            {displayedDays.map((day) => (
              <div
                key={day.dayNumber}
                className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs"
              >
                {/* Day Header */}
                <div className="p-6 bg-slate-50/70 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <span className="font-mono font-bold text-indigo-600">Day {day.dayNumber}</span>
                      <span aria-hidden="true">·</span>
                      <span>{day.date}</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono tabular-nums">
                        Est. Cost: {itinerary.budgetBreakdown.currency} {day.estimatedDayCost}
                      </span>
                    </div>
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 mt-0.5">
                      {day.themeTitle}
                    </h3>
                    <p className="text-xs text-slate-600 mt-1">{day.summary}</p>
                  </div>

                  <button
                    onClick={() => handleOpenAddActivity(day.dayNumber)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-lg transition-colors cursor-pointer self-start sm:self-center shrink-0 no-print"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Stop</span>
                  </button>
                </div>

                {/* Transit Advice Ribbon */}
                {day.transitTip && (
                  <div className="px-6 py-2.5 bg-blue-50/60 border-b border-blue-100/80 flex items-center gap-2 text-xs text-blue-900">
                    <Navigation className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    <span>
                      <strong>Transit Note:</strong> {day.transitTip}
                    </span>
                  </div>
                )}

                {/* Day Schedule Content */}
                <div className="p-6 space-y-6">
                  {/* Slots: Morning, Afternoon, Evening */}
                  {(['morning', 'afternoon', 'evening'] as TimeSlot[]).map((slotKey) => {
                    const slotActivities = day[slotKey];
                    if (slotActivities.length === 0) return null;

                    return (
                      <div key={slotKey} className="space-y-3">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-1">
                          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 capitalize">
                            {slotKey} Activities
                          </span>
                          <button
                            type="button"
                            onClick={() => handleOpenAddActivity(day.dayNumber, slotKey)}
                            className="text-[11px] text-indigo-600 hover:text-indigo-800 font-medium cursor-pointer no-print"
                          >
                            + Add {slotKey} stop
                          </button>
                        </div>

                        <div className="space-y-3">
                          {slotActivities.map((act) => (
                            <div
                              key={act.id}
                              className={`p-4 rounded-xl border transition-all ${
                                act.completed
                                  ? 'bg-slate-50 border-slate-200 opacity-60'
                                  : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs'
                              }`}
                            >
                              <div className="flex items-start justify-between gap-3">
                                <div className="flex items-start gap-3 flex-1">
                                  {/* Completed toggle checkbox */}
                                  <button
                                    type="button"
                                    onClick={() => handleToggleComplete(day.dayNumber, act.id)}
                                    title={act.completed ? 'Mark unvisited' : 'Mark visited'}
                                    className={`mt-0.5 w-5 h-5 rounded-md border flex items-center justify-center transition-colors cursor-pointer shrink-0 ${
                                      act.completed
                                        ? 'bg-emerald-600 border-emerald-600 text-white'
                                        : 'border-slate-300 hover:border-indigo-600 bg-white'
                                    }`}
                                  >
                                    {act.completed && <CheckCircle2 className="w-3.5 h-3.5" />}
                                  </button>

                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 flex-wrap">
                                      <h4
                                        className={`text-sm font-bold ${
                                          act.completed
                                            ? 'line-through text-slate-500'
                                            : 'text-slate-900'
                                        }`}
                                      >
                                        {act.title}
                                      </h4>
                                      <span className="text-[11px] font-mono tabular-nums text-slate-400">
                                        {act.duration}
                                      </span>
                                      <span aria-hidden="true" className="text-slate-300">
                                        ·
                                      </span>
                                      <span className="text-[11px] font-mono tabular-nums text-slate-600">
                                        {act.costLabel}
                                      </span>
                                      {act.bookingRequired && (
                                        <span className="text-[10px] text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                                          Pre-booking advised
                                        </span>
                                      )}
                                    </div>

                                    <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                                      <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                                      <span>{act.location}</span>
                                    </div>

                                    <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                                      {act.description}
                                    </p>

                                    {act.insiderTip && (
                                      <div className="mt-2.5 p-2.5 bg-amber-50/50 rounded-lg border border-amber-200/60 text-xs text-amber-900">
                                        <strong>Local Insider Tip:</strong> {act.insiderTip}
                                      </div>
                                    )}
                                  </div>
                                </div>

                                {/* Stop Actions */}
                                <div className="flex items-center gap-1 shrink-0 no-print">
                                  <button
                                    type="button"
                                    onClick={() => handleOpenSwapModal(day.dayNumber, act)}
                                    title="Swap with AI alternative"
                                    className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
                                  >
                                    <RefreshCw className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleOpenEditActivity(day.dayNumber, act)}
                                    title="Edit stop"
                                    className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
                                  >
                                    <Edit2 className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteActivity(day.dayNumber, act.id)}
                                    title="Delete stop"
                                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors cursor-pointer"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}

                  {/* Dining Recommendations Strip */}
                  {day.dining && day.dining.length > 0 && (
                    <div className="mt-6 pt-5 border-t border-slate-100">
                      <div className="flex items-center gap-2 mb-3">
                        <Utensils className="w-4 h-4 text-emerald-600" />
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                          Recommended Dining for Day {day.dayNumber}
                        </h4>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {day.dining.map((dine) => (
                          <div
                            key={dine.id}
                            className="p-3 bg-emerald-50/30 border border-emerald-100 rounded-lg text-xs"
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-emerald-900 uppercase text-[10px]">
                                {dine.mealType}
                              </span>
                              <span className="font-mono text-emerald-700 font-bold">
                                {dine.priceLevel}
                              </span>
                            </div>
                            <h5 className="font-bold text-slate-900 mt-1">{dine.restaurantName}</h5>
                            <span className="text-slate-500 text-[11px] block">{dine.cuisine}</span>
                            <div className="mt-2 text-slate-700">
                              <strong className="text-slate-900">Must try:</strong> {dine.mustTryDish}
                            </div>
                            {dine.reservationTip && (
                              <div className="mt-1 text-[11px] text-emerald-800 italic">
                                {dine.reservationTip}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: Budget Breakdown */}
      {activeTab === 'budget' && (
        <BudgetVisualizer
          budget={itinerary.budgetBreakdown}
          durationDays={itinerary.days.length}
          onUpdateBudget={handleUpdateBudget}
        />
      )}

      {/* TAB 3: Packing Checklist */}
      {activeTab === 'packing' && (
        <PackingChecklist
          items={itinerary.destinationGuide.packingChecklist}
          destination={itinerary.destination}
          onUpdateItems={handleUpdatePacking}
        />
      )}

      {/* TAB 4: Destination Guide */}
      {activeTab === 'guide' && (
        <DestinationGuideView
          guide={itinerary.destinationGuide}
          destination={itinerary.destination}
        />
      )}

      {/* TAB 5: AI Trip Advisor */}
      {activeTab === 'advisor' && <TripAdvisorPanel itinerary={itinerary} />}

      {/* Modals */}
      <ActivityModal
        isOpen={isActivityModalOpen}
        onClose={() => setIsActivityModalOpen(false)}
        onSave={handleSaveActivity}
        dayNumber={targetDayNumber}
        initialActivity={editingActivity}
        defaultTimeSlot={targetSlot}
        currency={itinerary.budgetBreakdown.currency}
      />

      <SwapActivityModal
        isOpen={isSwapModalOpen}
        onClose={() => setIsSwapModalOpen(false)}
        activity={swapTargetActivity}
        destination={itinerary.destination}
        onConfirmSwap={handleApplySwap}
      />

      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        itinerary={itinerary}
      />
    </div>
  );
};
