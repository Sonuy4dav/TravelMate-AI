import React, { useState } from 'react';
import { MessageSquare, Send, Sparkles, HelpCircle, Compass, CheckCircle2 } from 'lucide-react';
import { askTripAdvisorAPI } from '../services/api';
import { Itinerary } from '../types/itinerary';

interface TripAdvisorPanelProps {
  itinerary: Itinerary;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

export const TripAdvisorPanel: React.FC<TripAdvisorPanelProps> = ({ itinerary }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: `Hello! I'm your local AI travel concierge for ${itinerary.destination}. Ask me about neighborhood transit cards, local customs, reservation policies, tipping etiquette, or spontaneous recommendations!`,
      timestamp: 'Just now',
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const QUICK_QUESTIONS = [
    `What transit pass or card should I buy in ${itinerary.destination}?`,
    `What are the tipping and dining etiquette customs here?`,
    `How do I get from the airport to the city center?`,
    `Are credit cards widely accepted or should I carry cash?`,
  ];

  const handleSend = async (questionText?: string) => {
    const textToSend = questionText || inputValue.trim();
    if (!textToSend || isLoading) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!questionText) setInputValue('');
    setIsLoading(true);

    try {
      const response = await askTripAdvisorAPI({
        destination: itinerary.destination,
        question: textToSend,
        tripContext: {
          daysCount: itinerary.days.length,
          budgetTier: itinerary.preferences.budgetTier,
          travelGroup: itinerary.preferences.travelGroup,
          pace: itinerary.preferences.pace,
        },
      });

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        text: response.answer,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        sender: 'assistant',
        text: `Public transit passes or rechargeable IC smart cards are usually available right at the arrival airport station. For ${itinerary.destination}, we recommend booking major museum admissions online 48 hours prior to skip queues!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs flex flex-col h-[600px]">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Trip Advisor & Local Q&A Concierge
            </h3>
            <span className="text-xs text-slate-500">
              Personalized guidance for {itinerary.destination}
            </span>
          </div>
        </div>
      </div>

      {/* Quick Prompts Bar */}
      <div className="p-3 bg-indigo-50/40 border-b border-indigo-100 flex items-center gap-2 overflow-x-auto no-scrollbar">
        <span className="text-xs font-semibold text-indigo-700 shrink-0">Ask quickly:</span>
        {QUICK_QUESTIONS.map((q, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleSend(q)}
            disabled={isLoading}
            className="text-xs px-2.5 py-1 bg-white hover:bg-indigo-50 border border-indigo-200 text-indigo-900 rounded-md whitespace-nowrap transition-colors cursor-pointer shrink-0 disabled:opacity-50"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 p-6 overflow-y-auto space-y-4">
        {messages.map((m) => {
          const isUser = m.sender === 'user';
          return (
            <div
              key={m.id}
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-xl p-4 text-xs sm:text-sm leading-relaxed ${
                  isUser
                    ? 'bg-slate-900 text-white rounded-br-none'
                    : 'bg-slate-100 text-slate-800 rounded-bl-none'
                }`}
              >
                <div className="whitespace-pre-wrap">{m.text}</div>
                <div
                  className={`mt-1.5 text-[10px] text-right ${
                    isUser ? 'text-slate-400' : 'text-slate-400'
                  }`}
                >
                  {m.timestamp}
                </div>
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-center gap-2 text-xs text-slate-500 p-3 bg-slate-50 rounded-lg max-w-[60%]">
            <div className="w-3.5 h-3.5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
            <span>Consulting local destination intelligence...</span>
          </div>
        )}
      </div>

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="p-4 border-t border-slate-200 bg-white flex items-center gap-2"
      >
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder={`Ask anything about ${itinerary.destination}...`}
          className="flex-1 text-xs sm:text-sm border border-slate-300 rounded-lg px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <button
          type="submit"
          disabled={!inputValue.trim() || isLoading}
          className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white font-semibold text-xs rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer disabled:cursor-not-allowed"
        >
          <Send className="w-3.5 h-3.5" />
          <span>Ask</span>
        </button>
      </form>
    </div>
  );
};
