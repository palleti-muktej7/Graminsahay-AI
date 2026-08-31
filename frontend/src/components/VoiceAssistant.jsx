import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Volume2, X, Sparkles, CornerDownLeft } from 'lucide-react';
import { translations } from '../i18n/translations';

export default function VoiceAssistant({
  isOpen,
  onClose,
  lang,
  onApplyVoiceQuery,
}) {
  const t = translations[lang] || translations.en;
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [recognition, setRecognition] = useState(null);
  const [audioFeedback, setAudioFeedback] = useState('');

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recog = new SpeechRecognition();
      recog.continuous = false;
      recog.interimResults = true;
      
      const langMap = {
        en: 'en-IN',
        hi: 'hi-IN',
        ta: 'ta-IN',
        te: 'te-IN',
        mr: 'mr-IN',
      };
      recog.lang = langMap[lang] || 'en-IN';

      recog.onresult = (event) => {
        const text = Array.from(event.results)
          .map((r) => r[0].transcript)
          .join('');
        setTranscript(text);
      };

      recog.onerror = (event) => {
        setIsListening(false);
      };

      recog.onend = () => {
        setIsListening(false);
      };

      setRecognition(recog);
    }
  }, [lang]);

  const toggleListen = () => {
    if (!recognition) {
      alert('Speech Recognition is not supported on this browser. Try Chrome/Edge.');
      return;
    }
    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      setTranscript('');
      recognition.start();
      setIsListening(true);
    }
  };

  const handleSpeakSample = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      const langMap = {
        en: 'en-IN',
        hi: 'hi-IN',
        ta: 'ta-IN',
        te: 'te-IN',
        mr: 'mr-IN',
      };
      utterance.lang = langMap[lang] || 'en-IN';
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleProcessQuery = () => {
    if (!transcript.trim()) return;
    onApplyVoiceQuery(transcript);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-200 relative animate-in fade-in zoom-in duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-50 text-blue-600 mb-1 shadow-inner">
            <Sparkles className="w-8 h-8" />
          </div>

          <h3 className="text-xl font-extrabold text-slate-900">
            {t.labels.voice_assistant} (Vernacular Copilot)
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Speak in your language. For example: "I have ₹1 Lakh and want to start a Dairy business in Thanjavur".
          </p>

          {/* Big Mic Button */}
          <div className="py-4">
            <button
              onClick={toggleListen}
              className={`w-20 h-20 rounded-full flex items-center justify-center text-white transition-all shadow-xl mx-auto ${
                isListening
                  ? 'bg-rose-500 animate-pulse shadow-rose-500/40 scale-110'
                  : 'bg-gradient-to-tr from-blue-600 to-indigo-600 hover:scale-105 shadow-blue-600/30'
              }`}
            >
              {isListening ? <MicOff className="w-8 h-8" /> : <Mic className="w-8 h-8" />}
            </button>
            <span className="text-xs font-semibold text-slate-500 block mt-2">
              {isListening ? '🎙️ Listening... Speak now' : 'Click to Start Speaking'}
            </span>
          </div>

          {/* Transcript Box */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-left min-h-[70px] max-h-[120px] overflow-y-auto">
            <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
              Recognized Speech:
            </span>
            <p className="text-xs text-slate-800 font-medium">
              {transcript || <span className="text-slate-400 italic">Nothing heard yet...</span>}
            </p>
          </div>

          {/* Quick Demo Queries */}
          <div className="text-left space-y-1.5 pt-2">
            <span className="text-[11px] font-bold text-slate-500 uppercase">Sample Quick Queries:</span>
            <div className="flex flex-col gap-1 text-xs">
              <button
                type="button"
                onClick={() => setTranscript('Dairy farming with ₹100,000 margin in Thanjavur')}
                className="text-left p-2 rounded-lg bg-slate-100/70 hover:bg-blue-50 text-slate-700 hover:text-blue-700 text-[11px]"
              >
                🥛 "Dairy farming with ₹100,000 margin in Thanjavur"
              </button>
              <button
                type="button"
                onClick={() => setTranscript('Tailoring and garments with ₹25,000 margin in Barabanki')}
                className="text-left p-2 rounded-lg bg-slate-100/70 hover:bg-blue-50 text-slate-700 hover:text-blue-700 text-[11px]"
              >
                🧵 "Tailoring and garments with ₹25,000 margin in Barabanki"
              </button>
            </div>
          </div>

          {/* Apply Button */}
          <div className="pt-3">
            <button
              onClick={handleProcessQuery}
              disabled={!transcript.trim()}
              className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-xs shadow-md shadow-blue-600/20 transition-all flex items-center justify-center gap-2"
            >
              <span>Process & Update Parameters</span>
              <CornerDownLeft className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
