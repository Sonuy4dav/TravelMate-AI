import React, { useState } from 'react';
import { DollarSign, PieChart, TrendingUp, CheckCircle, Lightbulb, Wallet, Plus, Trash2 } from 'lucide-react';
import { BudgetBreakdown } from '../types/itinerary';

interface BudgetVisualizerProps {
  budget: BudgetBreakdown;
  durationDays: number;
  onUpdateBudget: (updated: BudgetBreakdown) => void;
}

export const BudgetVisualizer: React.FC<BudgetVisualizerProps> = ({
  budget,
  durationDays,
  onUpdateBudget,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [accom, setAccom] = useState(budget.accommodation);
  const [food, setFood] = useState(budget.foodAndDining);
  const [activities, setActivities] = useState(budget.activitiesAndAttractions);
  const [transit, setTransit] = useState(budget.localTransportation);
  const [buffer, setBuffer] = useState(budget.emergencyBuffer);

  const total = accom + food + activities + transit + buffer;
  const perDay = durationDays > 0 ? Math.round(total / durationDays) : total;

  const categories = [
    {
      name: 'Accommodation',
      amount: budget.accommodation,
      color: 'bg-indigo-600',
      textColor: 'text-indigo-600',
      percent: Math.round((budget.accommodation / budget.totalEstimatedCost) * 100) || 0,
      desc: 'Hotels, ryokans, apartments or villas',
    },
    {
      name: 'Food & Dining',
      amount: budget.foodAndDining,
      color: 'bg-emerald-500',
      textColor: 'text-emerald-600',
      percent: Math.round((budget.foodAndDining / budget.totalEstimatedCost) * 100) || 0,
      desc: 'Breakfast, market lunches, cafes & dinner reservations',
    },
    {
      name: 'Activities & Attractions',
      amount: budget.activitiesAndAttractions,
      color: 'bg-amber-500',
      textColor: 'text-amber-600',
      percent: Math.round((budget.activitiesAndAttractions / budget.totalEstimatedCost) * 100) || 0,
      desc: 'Museum passes, temple entrances & guided experiences',
    },
    {
      name: 'Local Transportation',
      amount: budget.localTransportation,
      color: 'bg-sky-500',
      textColor: 'text-sky-600',
      percent: Math.round((budget.localTransportation / budget.totalEstimatedCost) * 100) || 0,
      desc: 'Subway IC passes, regional trains, trams & ferries',
    },
    {
      name: 'Emergency Buffer',
      amount: budget.emergencyBuffer,
      color: 'bg-slate-400',
      textColor: 'text-slate-600',
      percent: Math.round((budget.emergencyBuffer / budget.totalEstimatedCost) * 100) || 0,
      desc: 'Souvenirs, unexpected transit, snacks & sundries',
    },
  ];

  const handleSaveAdjustments = () => {
    onUpdateBudget({
      ...budget,
      accommodation: accom,
      foodAndDining: food,
      activitiesAndAttractions: activities,
      localTransportation: transit,
      emergencyBuffer: buffer,
      totalEstimatedCost: total,
      costPerPersonPerDay: perDay,
    });
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-xs">
          <span className="text-xs font-semibold text-slate-500 block">Total Estimated Cost</span>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono tabular-nums">
              {budget.currency} {budget.totalEstimatedCost.toLocaleString()}
            </span>
          </div>
          <span className="text-xs text-slate-400 mt-1 block">
            For {durationDays} days total itinerary
          </span>
        </div>

        <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-xs">
          <span className="text-xs font-semibold text-slate-500 block">Estimated Cost / Day</span>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-extrabold text-indigo-600 font-mono tabular-nums">
              {budget.currency} {budget.costPerPersonPerDay.toLocaleString()}
            </span>
            <span className="text-xs text-slate-500">/ day</span>
          </div>
          <span className="text-xs text-slate-400 mt-1 block">
            Covers stays, meals, transit & admissions
          </span>
        </div>

        <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-xs flex flex-col justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 block">Budget Customization</span>
            <span className="text-xs text-slate-600 mt-1 block">
              Adjust allocations based on your target spend.
            </span>
          </div>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="mt-3 text-xs font-semibold text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 py-1.5 px-3 rounded-lg border border-indigo-200 transition-colors w-fit cursor-pointer"
          >
            {isEditing ? 'Close Adjustments' : 'Adjust Category Budgets'}
          </button>
        </div>
      </div>

      {/* Editing Form */}
      {isEditing && (
        <div className="p-6 bg-slate-50 border border-slate-200 rounded-xl space-y-4">
          <h4 className="text-sm font-bold text-slate-900">Fine-tune Your Category Budgets</h4>
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Accommodation</label>
              <input
                type="number"
                value={accom}
                onChange={(e) => setAccom(Number(e.target.value))}
                className="w-full text-xs font-mono tabular-nums p-2 bg-white border border-slate-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Food & Dining</label>
              <input
                type="number"
                value={food}
                onChange={(e) => setFood(Number(e.target.value))}
                className="w-full text-xs font-mono tabular-nums p-2 bg-white border border-slate-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Activities</label>
              <input
                type="number"
                value={activities}
                onChange={(e) => setActivities(Number(e.target.value))}
                className="w-full text-xs font-mono tabular-nums p-2 bg-white border border-slate-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Transportation</label>
              <input
                type="number"
                value={transit}
                onChange={(e) => setTransit(Number(e.target.value))}
                className="w-full text-xs font-mono tabular-nums p-2 bg-white border border-slate-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Buffer</label>
              <input
                type="number"
                value={buffer}
                onChange={(e) => setBuffer(Number(e.target.value))}
                className="w-full text-xs font-mono tabular-nums p-2 bg-white border border-slate-300 rounded-lg"
              />
            </div>
          </div>
          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-slate-600 font-mono tabular-nums">
              Calculated Total: <strong>{budget.currency} {total.toLocaleString()}</strong> ({budget.currency} {perDay}/day)
            </span>
            <button
              onClick={handleSaveAdjustments}
              className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors cursor-pointer"
            >
              Save New Budget
            </button>
          </div>
        </div>
      )}

      {/* Visual Proportional Bar */}
      <div className="p-6 bg-white border border-slate-200 rounded-xl shadow-xs">
        <h4 className="text-sm font-bold text-slate-900 mb-3">Allocation Breakdown</h4>
        <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden flex">
          {categories.map((c, idx) => (
            <div
              key={idx}
              className={`${c.color} h-full transition-all duration-300`}
              style={{ width: `${Math.max(c.percent, 3)}%` }}
              title={`${c.name}: ${c.percent}%`}
            />
          ))}
        </div>

        {/* Categories Table / List */}
        <div className="mt-5 divide-y divide-slate-100">
          {categories.map((c, idx) => (
            <div key={idx} className="py-3 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className={`w-3 h-3 rounded-full ${c.color} shrink-0`} />
                <div>
                  <span className="text-xs font-bold text-slate-900 block">{c.name}</span>
                  <span className="text-[11px] text-slate-500">{c.desc}</span>
                </div>
              </div>
              <div className="text-right shrink-0">
                <span className="text-xs font-bold text-slate-900 font-mono tabular-nums block">
                  {budget.currency} {c.amount.toLocaleString()}
                </span>
                <span className="text-[11px] text-slate-400 font-mono tabular-nums">
                  {c.percent}% of total
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI Budget Saving Advice */}
      {budget.budgetSavingTips && budget.budgetSavingTips.length > 0 && (
        <div className="p-6 bg-white border border-slate-200 rounded-xl shadow-xs">
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="w-4 h-4 text-amber-500" />
            <h4 className="text-sm font-bold text-slate-900">Local Money-Saving Strategies</h4>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {budget.budgetSavingTips.map((tip, idx) => (
              <div
                key={idx}
                className="p-3 bg-slate-50 border border-slate-100 rounded-lg text-xs text-slate-700 flex items-start gap-2.5"
              >
                <span className="font-mono text-indigo-600 font-bold shrink-0">0{idx + 1}.</span>
                <span>{tip}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
