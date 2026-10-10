import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { ChatMessage } from '../types/index.ts';

export const AgronomyAssistant: React.FC = () => {
  const { user, language, setLanguage } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const isTamil = language === 'ta';

  const suggestedQuestions = isTamil
    ? [
        'தக்காளி இலைகளில் கருகல் நோய் ஏற்பட்டால் என்ன செய்வது?',
        'மழை பெய்யும் முன் பூச்சிக்கொல்லி தெளிக்கலாமா?',
        'நெல் பயிருக்கு தழைச்சத்து எப்போது இட வேண்டும்?',
        'சொட்டு நீர் பாசனத்தில் தண்ணீரை எப்படி சேமிப்பது?',
      ]
    : [
        'When should I water my tomato crop?',
        'What are common symptoms of Early Blight?',
        'Why are my crop leaves turning yellow?',
        'How do I control whiteflies with organic Neem oil?',
      ];

  useEffect(() => {
    async function fetchHistory() {
      try {
        const res = await fetch(`/api/assistant/chat?userId=${user?.userId || 'farmer_rajesh_01'}`);
        const data = await res.json();
        if (data.messages && data.messages.length > 0) {
          setMessages(data.messages);
        } else {
          setMessages([
            {
              id: 'init_msg',
              role: 'assistant',
              content: isTamil
                ? 'வணக்கம்! நான் அக்ரிசென்ஸ் AI உதவியாளர். உங்கள் பயிர், பாசனம், நோய் மேலாண்மை குறித்து எது வேண்டுமானாலும் கேளுங்கள்.'
                : 'Hello! I am your AgriSense AI Agronomist. Ask me anything about crop diseases, irrigation schedules, or field preparations.',
              timestamp: new Date().toISOString(),
              language,
            },
          ]);
        }
      } catch (e) {
        console.error(e);
      }
    }
    fetchHistory();
  }, [user?.userId, language]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query || loading) return;

    const userMsg: ChatMessage = {
      id: 'usr_' + Date.now(),
      role: 'user',
      content: query,
      timestamp: new Date().toISOString(),
      language,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/assistant/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user?.userId || 'farmer_rajesh_01',
          message: query,
          language,
        }),
      });

      const data = await res.json();
      if (data.message) {
        setMessages((prev) => [...prev, data.message]);
      }
    } catch (e) {
      setMessages((prev) => [
        ...prev,
        {
          id: 'err_' + Date.now(),
          role: 'assistant',
          content: isTamil
            ? 'மன்னிக்கவும், தகவலைப் பெற முடியவில்லை. மீண்டும் முயற்சிக்கவும்.'
            : 'Unable to connect to agronomy server. Please try again.',
          timestamp: new Date().toISOString(),
          language,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const toggleVoiceSimulation = () => {
    setIsVoiceActive(!isVoiceActive);
    if (!isVoiceActive) {
      setTimeout(() => {
        setIsVoiceActive(false);
        handleSend(isTamil ? 'இலைகளில் மஞ்சள் நிற புள்ளிகள் உள்ளன' : 'Why are my lower leaves turning yellow?');
      }, 2500);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col h-[760px] bg-white rounded-3xl border border-slate-200/80 shadow-md overflow-hidden pb-safe">
      {/* Header */}
      <div className="px-5 py-4 bg-[#f0f3ff] border-b border-slate-200/80 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#00652c] text-white flex items-center justify-center shadow-xs">
            <span className="material-symbols-outlined text-[24px]">smart_toy</span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="font-headline font-bold text-sm text-[#111c2d]">
                AgriSense AI Agronomist
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.2 rounded-full bg-[#d3ffd5] text-[#00652c]">
                24/7 Voice & Chat
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              {isTamil ? 'தமிழ் & English மொழிகளில் பதிலளிக்கும்' : 'Field Advisory in Tamil & English'}
            </p>
          </div>
        </div>

        {/* Bilingual Switcher */}
        <div className="flex items-center bg-white rounded-full p-0.5 border border-slate-200 shadow-2xs">
          <button
            onClick={() => setLanguage('en')}
            className={`px-2.5 py-1 rounded-full text-xs font-bold transition-all ${
              !isTamil ? 'bg-[#00652c] text-white shadow-xs' : 'text-slate-600'
            }`}
          >
            EN
          </button>
          <button
            onClick={() => setLanguage('ta')}
            className={`px-2.5 py-1 rounded-full text-xs font-bold transition-all ${
              isTamil ? 'bg-[#00652c] text-white shadow-xs' : 'text-slate-600'
            }`}
          >
            தமிழ்
          </button>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-[#f9f9ff]">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex items-start gap-2.5 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {m.role === 'assistant' && (
              <div className="w-8 h-8 rounded-xl bg-[#00652c] text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                <span className="material-symbols-outlined text-[18px]">smart_toy</span>
              </div>
            )}

            <div
              className={`max-w-xl p-4 rounded-2xl text-xs leading-relaxed ${
                m.role === 'user'
                  ? 'bg-[#00652c] text-white font-medium rounded-tr-xs shadow-xs'
                  : 'bg-white text-[#111c2d] border border-slate-200/80 rounded-tl-xs shadow-xs'
              }`}
            >
              <p className="whitespace-pre-wrap">{m.content}</p>
              <span
                className={`block text-[9px] mt-1.5 ${
                  m.role === 'user' ? 'text-emerald-200 text-right' : 'text-slate-400'
                }`}
              >
                {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#00652c] text-white flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[18px]">smart_toy</span>
            </div>
            <div className="p-3 bg-white border border-slate-200 rounded-2xl text-xs text-slate-500 flex items-center gap-2 shadow-xs">
              <span className="material-symbols-outlined text-[16px] animate-spin text-[#00652c]">
                progress_activity
              </span>
              <span>{isTamil ? 'பதிலை உருவாக்குகிறது...' : 'Consulting agronomy models...'}</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Voice Recording Active simulation banner */}
      {isVoiceActive && (
        <div className="bg-[#fe932c]/20 border-t border-[#fe932c]/40 px-4 py-2 flex items-center justify-between text-xs text-[#663500] animate-pulse">
          <span className="flex items-center gap-2 font-bold">
            <span className="material-symbols-outlined text-[18px] text-[#ba1a1a]">mic</span>
            <span>{isTamil ? 'குரல் பதிவு செய்யப்படுகிறது...' : 'Listening in Tamil & English... Speak now'}</span>
          </span>
          <button onClick={() => setIsVoiceActive(false)} className="text-[10px] font-bold underline">
            Cancel
          </button>
        </div>
      )}

      {/* Suggested Questions Pills */}
      <div className="px-4 py-2 bg-white border-t border-slate-100 flex items-center gap-2 overflow-x-auto no-scrollbar">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider shrink-0">
          {isTamil ? 'பரிந்துரை:' : 'Quick:'}
        </span>
        {suggestedQuestions.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(q)}
            disabled={loading}
            className="text-[11px] font-semibold bg-[#f0f3ff] hover:bg-[#dee8ff] text-[#111c2d] px-3 py-1 rounded-full shrink-0 border border-slate-200/60 transition-colors"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Input Form with Voice Button */}
      <div className="p-3 bg-white border-t border-slate-200">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <button
            type="button"
            onClick={toggleVoiceSimulation}
            className={`p-2.5 rounded-xl border transition-colors ${
              isVoiceActive
                ? 'bg-red-500 text-white border-red-600 animate-pulse'
                : 'bg-[#dee8ff] text-[#00652c] border-slate-200 hover:bg-[#d8e3fb]'
            }`}
            title="Voice input in Tamil / English"
          >
            <span className="material-symbols-outlined text-[20px]">mic</span>
          </button>

          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              isTamil
                ? 'பயிர் பாதுகாப்பு குறித்து தமிழில் கேட்கவும்...'
                : 'Ask AgriSense about crops, fertilizers, pests...'
            }
            className="flex-1 text-xs px-4 py-3 rounded-xl bg-[#f0f3ff] border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#00652c]/20 text-[#111c2d]"
          />

          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="px-4 py-3 rounded-xl bg-[#00652c] hover:bg-[#15803d] text-white font-bold text-xs shadow-sm disabled:opacity-50 transition-all flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-[18px]">send</span>
            <span className="hidden sm:inline">Send</span>
          </button>
        </form>
      </div>
    </div>
  );
};
