import React, { useState } from 'react';
import { X, Printer, Copy, Check, Download, FileText, Share2 } from 'lucide-react';
import { Itinerary } from '../types/itinerary';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  itinerary: Itinerary;
}

export const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose, itinerary }) => {
  if (!isOpen) return null;

  const [copied, setCopied] = useState(false);

  // Generate clean Markdown representation
  const generateMarkdown = () => {
    let md = `# ${itinerary.title}\n`;
    md += `**Destination**: ${itinerary.destination} | **Duration**: ${itinerary.days.length} Days | **Budget Tier**: ${itinerary.preferences.budgetTier}\n\n`;
    md += `## Overview\n${itinerary.overview}\n\n`;

    md += `## Trip Highlights\n`;
    itinerary.highlights.forEach((h) => {
      md += `- ${h}\n`;
    });
    md += `\n`;

    md += `## Estimated Budget Breakdown\n`;
    md += `- Total Estimated Cost: ${itinerary.budgetBreakdown.currency} ${itinerary.budgetBreakdown.totalEstimatedCost.toLocaleString()}\n`;
    md += `- Accommodation: ${itinerary.budgetBreakdown.currency} ${itinerary.budgetBreakdown.accommodation.toLocaleString()}\n`;
    md += `- Food & Dining: ${itinerary.budgetBreakdown.currency} ${itinerary.budgetBreakdown.foodAndDining.toLocaleString()}\n`;
    md += `- Activities: ${itinerary.budgetBreakdown.currency} ${itinerary.budgetBreakdown.activitiesAndAttractions.toLocaleString()}\n`;
    md += `- Local Transit: ${itinerary.budgetBreakdown.currency} ${itinerary.budgetBreakdown.localTransportation.toLocaleString()}\n`;
    md += `- Daily Per-Person Est.: ${itinerary.budgetBreakdown.currency} ${itinerary.budgetBreakdown.costPerPersonPerDay}\n\n`;

    md += `## Day-by-Day Schedule\n\n`;
    itinerary.days.forEach((day) => {
      md += `### ${day.themeTitle} (${day.date})\n`;
      md += `${day.summary}\n\n`;

      if (day.morning.length > 0) {
        md += `#### Morning\n`;
        day.morning.forEach((act) => {
          md += `- **${act.title}** (${act.duration}, ${act.costLabel}): ${act.description}`;
          if (act.insiderTip) md += ` *(Tip: ${act.insiderTip})*`;
          md += `\n`;
        });
        md += `\n`;
      }

      if (day.afternoon.length > 0) {
        md += `#### Afternoon\n`;
        day.afternoon.forEach((act) => {
          md += `- **${act.title}** (${act.duration}, ${act.costLabel}): ${act.description}`;
          if (act.insiderTip) md += ` *(Tip: ${act.insiderTip})*`;
          md += `\n`;
        });
        md += `\n`;
      }

      if (day.evening.length > 0) {
        md += `#### Evening\n`;
        day.evening.forEach((act) => {
          md += `- **${act.title}** (${act.duration}, ${act.costLabel}): ${act.description}`;
          if (act.insiderTip) md += ` *(Tip: ${act.insiderTip})*`;
          md += `\n`;
        });
        md += `\n`;
      }

      if (day.dining.length > 0) {
        md += `#### Dining Recommendations\n`;
        day.dining.forEach((d) => {
          md += `- **${d.mealType.toUpperCase()}**: ${d.restaurantName} (${d.cuisine}, ${d.priceLevel}) - *Must try: ${d.mustTryDish}*\n`;
        });
        md += `\n`;
      }

      md += `*Transit Tip*: ${day.transitTip}\n\n---\n\n`;
    });

    md += `## Practical Destination Tips\n`;
    md += `- **Best Time to Visit**: ${itinerary.destinationGuide.bestTimeToVisit}\n`;
    md += `- **Weather & Attire**: ${itinerary.destinationGuide.suggestedAttire}\n`;

    return md;
  };

  const handleCopyMarkdown = () => {
    navigator.clipboard.writeText(generateMarkdown());
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownloadJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(itinerary, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `${itinerary.destination.toLowerCase().replace(/[^a-z0-9]/g, '_')}_itinerary.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs no-print">
      <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-indigo-100 text-indigo-700 flex items-center justify-center">
              <Share2 className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Export & Share Itinerary</h2>
              <span className="text-xs text-slate-500">Take your travel plan on the road</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
            <h3 className="text-sm font-bold text-slate-900">{itinerary.title}</h3>
            <p className="text-xs text-slate-500 mt-1 line-clamp-2">{itinerary.overview}</p>
            <div className="mt-3 flex items-center gap-3 text-xs text-slate-600">
              <span className="font-mono tabular-nums">{itinerary.days.length} Days</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono tabular-nums">
                Est. {itinerary.budgetBreakdown.currency} {itinerary.budgetBreakdown.totalEstimatedCost.toLocaleString()}
              </span>
              <span aria-hidden="true">·</span>
              <span>{itinerary.destination}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Print / Save PDF */}
            <button
              onClick={handlePrint}
              className="p-3 border border-slate-200 hover:border-slate-400 rounded-xl flex flex-col items-center text-center group transition-colors cursor-pointer"
            >
              <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors mb-2">
                <Printer className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-slate-900">Print / PDF</span>
              <span className="text-[11px] text-slate-400 mt-0.5">Clean print layout</span>
            </button>

            {/* Copy Markdown */}
            <button
              onClick={handleCopyMarkdown}
              className="p-3 border border-slate-200 hover:border-slate-400 rounded-xl flex flex-col items-center text-center group transition-colors cursor-pointer"
            >
              <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors mb-2">
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </div>
              <span className="text-xs font-bold text-slate-900">
                {copied ? 'Copied!' : 'Copy Markdown'}
              </span>
              <span className="text-[11px] text-slate-400 mt-0.5">Notion / Docs ready</span>
            </button>

            {/* Download JSON */}
            <button
              onClick={handleDownloadJSON}
              className="p-3 border border-slate-200 hover:border-slate-400 rounded-xl flex flex-col items-center text-center group transition-colors cursor-pointer"
            >
              <div className="w-9 h-9 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition-colors mb-2">
                <Download className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-slate-900">Download Data</span>
              <span className="text-[11px] text-slate-400 mt-0.5">JSON format</span>
            </button>
          </div>

          <div className="text-xs text-slate-500 bg-amber-50/60 p-3 rounded-lg border border-amber-200/60">
            <strong>Traveler Pro-Tip:</strong> Printing or saving the PDF to your phone gives you full offline access to your day-by-day itinerary without requiring international cellular roaming data!
          </div>
        </div>

        <div className="flex justify-end p-4 bg-slate-50 border-t border-slate-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
