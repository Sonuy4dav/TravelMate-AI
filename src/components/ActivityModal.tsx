import React, { useState } from 'react';
import { X, Clock, MapPin, DollarSign, Tag, Lightbulb } from 'lucide-react';
import { ActivityItem, ActivityCategory, TimeSlot } from '../types/itinerary';

interface ActivityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (activity: ActivityItem) => void;
  dayNumber: number;
  initialActivity?: ActivityItem | null;
  defaultTimeSlot?: TimeSlot;
  currency: string;
}

export const ActivityModal: React.FC<ActivityModalProps> = ({
  isOpen,
  onClose,
  onSave,
  dayNumber,
  initialActivity,
  defaultTimeSlot = 'morning',
  currency,
}) => {
  if (!isOpen) return null;

  const [title, setTitle] = useState(initialActivity?.title || '');
  const [description, setDescription] = useState(initialActivity?.description || '');
  const [location, setLocation] = useState(initialActivity?.location || '');
  const [timeSlot, setTimeSlot] = useState<TimeSlot>(initialActivity?.timeSlot || defaultTimeSlot);
  const [category, setCategory] = useState<ActivityCategory>(initialActivity?.category || 'sightseeing');
  const [duration, setDuration] = useState(initialActivity?.duration || '2 hours');
  const [estimatedCost, setEstimatedCost] = useState(initialActivity?.estimatedCost ?? 15);
  const [costLabel, setCostLabel] = useState(
    initialActivity?.costLabel || `${currency} 15 admission`
  );
  const [insiderTip, setInsiderTip] = useState(initialActivity?.insiderTip || '');
  const [bookingRequired, setBookingRequired] = useState(initialActivity?.bookingRequired || false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const activity: ActivityItem = {
      id: initialActivity?.id || `act-${Date.now()}`,
      timeSlot,
      title: title.trim(),
      description: description.trim(),
      location: location.trim() || 'Central District',
      category,
      duration: duration.trim() || '2 hours',
      estimatedCost: Number(estimatedCost) || 0,
      costLabel: costLabel.trim() || (estimatedCost > 0 ? `${currency} ${estimatedCost}` : 'Free'),
      insiderTip: insiderTip.trim() || undefined,
      bookingRequired,
      completed: initialActivity?.completed || false,
    };

    onSave(activity);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              {initialActivity ? 'Edit Activity' : `Add Activity to Day ${dayNumber}`}
            </h2>
            <span className="text-xs text-slate-500">Customize your personalized schedule</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {/* Time Slot & Category */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Time Slot</label>
              <select
                value={timeSlot}
                onChange={(e) => setTimeSlot(e.target.value as TimeSlot)}
                className="w-full text-xs sm:text-sm border border-slate-300 rounded-lg p-2 bg-white"
              >
                <option value="morning">Morning</option>
                <option value="afternoon">Afternoon</option>
                <option value="evening">Evening</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ActivityCategory)}
                className="w-full text-xs sm:text-sm border border-slate-300 rounded-lg p-2 bg-white"
              >
                <option value="sightseeing">Sightseeing</option>
                <option value="culture">Culture & History</option>
                <option value="outdoor">Nature & Outdoor</option>
                <option value="dining">Food & Drink</option>
                <option value="shopping">Shopping</option>
                <option value="leisure">Leisure & Relax</option>
              </select>
            </div>
          </div>

          {/* Activity Title */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Activity Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Fushimi Inari Sunset Hike"
              className="w-full text-xs sm:text-sm border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Location & Duration */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Location / Area</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g., Higashiyama District"
                className="w-full text-xs sm:text-sm border border-slate-300 rounded-lg p-2"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Duration</label>
              <input
                type="text"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="e.g., 2 hours"
                className="w-full text-xs sm:text-sm border border-slate-300 rounded-lg p-2"
              />
            </div>
          </div>

          {/* Cost */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Estimated Cost ({currency})
              </label>
              <input
                type="number"
                min="0"
                value={estimatedCost}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setEstimatedCost(val);
                  setCostLabel(val === 0 ? 'Free' : `${currency} ${val} admission`);
                }}
                className="w-full text-xs sm:text-sm border border-slate-300 rounded-lg p-2 font-mono tabular-nums"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Cost Label</label>
              <input
                type="text"
                value={costLabel}
                onChange={(e) => setCostLabel(e.target.value)}
                placeholder="e.g., Free / $15 ticket"
                className="w-full text-xs sm:text-sm border border-slate-300 rounded-lg p-2"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Description</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What to see, key highlights, or walking route..."
              className="w-full text-xs sm:text-sm border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Insider Tip */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Insider Local Tip (Optional)
            </label>
            <input
              type="text"
              value={insiderTip}
              onChange={(e) => setInsiderTip(e.target.value)}
              placeholder="e.g., Arrive 15 mins before gate opens to beat crowds"
              className="w-full text-xs sm:text-sm border border-slate-300 rounded-lg p-2"
            />
          </div>

          {/* Booking required checkbox */}
          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="bookingReq"
              checked={bookingRequired}
              onChange={(e) => setBookingRequired(e.target.checked)}
              className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4 cursor-pointer"
            />
            <label htmlFor="bookingReq" className="text-xs text-slate-700 cursor-pointer">
              Advance booking or ticket reservation recommended
            </label>
          </div>

          {/* Modal Footer */}
          <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors shadow-xs cursor-pointer"
            >
              {initialActivity ? 'Update Activity' : 'Add Activity'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
