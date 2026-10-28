import React from 'react';
import { Sun, ShieldAlert, BookOpen, PhoneCall, Volume2, Sparkles, MapPin } from 'lucide-react';
import { DestinationGuide } from '../types/itinerary';

interface DestinationGuideViewProps {
  guide: DestinationGuide;
  destination: string;
}

export const DestinationGuideView: React.FC<DestinationGuideViewProps> = ({ guide, destination }) => {
  return (
    <div className="space-y-6">
      {/* Weather & Attire Card */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-xs">
          <div className="flex items-center gap-2 mb-2">
            <Sun className="w-4 h-4 text-amber-500" />
            <h4 className="text-sm font-bold text-slate-900">Best Time to Visit & Climate</h4>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{guide.bestTimeToVisit}</p>
          <div className="mt-3 pt-3 border-t border-slate-100">
            <span className="text-xs font-semibold text-slate-500 block mb-0.5">Seasonal Weather:</span>
            <span className="text-xs text-slate-600">{guide.currentSeasonWeather}</span>
          </div>
        </div>

        <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-xs">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-indigo-500" />
            <h4 className="text-sm font-bold text-slate-900">Suggested Attire & Dress Code</h4>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{guide.suggestedAttire}</p>
          <div className="mt-3 pt-3 border-t border-slate-100 text-xs text-slate-500">
            Comfortable broken-in footwear is essential for historic stone stairs and city walking routes.
          </div>
        </div>
      </div>

      {/* Local Etiquette Guidelines */}
      <div className="p-6 bg-white border border-slate-200 rounded-xl shadow-xs">
        <h4 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
          <span>Cultural Norms & Local Etiquette in {destination}</span>
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {guide.localEtiquette.map((rule, idx) => (
            <div
              key={idx}
              className="p-3 bg-slate-50 border border-slate-100 rounded-lg text-xs text-slate-700 flex items-start gap-2.5"
            >
              <span className="font-mono text-indigo-600 font-bold shrink-0">#{idx + 1}</span>
              <span>{rule}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Essential Phrases Table */}
      <div className="p-6 bg-white border border-slate-200 rounded-xl shadow-xs">
        <div className="flex items-center gap-2 mb-3">
          <BookOpen className="w-4 h-4 text-indigo-600" />
          <h4 className="text-sm font-bold text-slate-900">Essential Local Phrases</h4>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 font-semibold uppercase text-[10px]">
                <th className="py-2 px-3">Phrase</th>
                <th className="py-2 px-3">Meaning / Translation</th>
                <th className="py-2 px-3">Pronunciation Guide</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {guide.essentialPhrases.map((p, idx) => (
                <tr key={idx} className="hover:bg-slate-50">
                  <td className="py-2.5 px-3 font-bold text-slate-900">{p.phrase}</td>
                  <td className="py-2.5 px-3 text-slate-600">{p.translation}</td>
                  <td className="py-2.5 px-3 text-indigo-600 font-mono text-[11px]">
                    {p.pronunciation || '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Emergency Contacts Directory */}
      <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-xs">
        <div className="flex items-center gap-2 mb-3">
          <PhoneCall className="w-4 h-4 text-rose-500" />
          <h4 className="text-sm font-bold text-slate-900">Emergency & Tourist Helpline Directory</h4>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {guide.emergencyContacts.map((contact, idx) => (
            <div key={idx} className="p-3 bg-rose-50/40 border border-rose-100 rounded-lg">
              <span className="text-[11px] font-semibold text-rose-900 block">{contact.service}</span>
              <span className="text-sm font-bold font-mono tabular-nums text-slate-900 mt-0.5 block">
                {contact.number}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
