import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Volume2, X, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';
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
  const [feedbackMsg, setFeedbackMsg] = useState('');

  const langMap = {
    en: 'en-IN',
    hi: 'hi-IN',
    ta: 'ta-IN',
    te: 'te-IN',
    mr: 'mr-IN',
  };

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recog = new SpeechRecognition();
      recog.continuous = false;
      recog.interimResults = true;
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
      alert('Speech Recognition is supported in Chrome, Edge, Safari, and Android browsers.');
      return;
    }
    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      setTranscript('');
      setFeedbackMsg('');
      try {
        recognition.start();
        setIsListening(true);
      } catch (err) {
        setIsListening(false);
      }
    }
  };

  const speakFeedback = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = langMap[lang] || 'en-IN';
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleProcessQuery = () => {
    if (!transcript.trim()) return;
    const result = onApplyVoiceQuery(transcript);
    
    // Voice confirmation text in chosen language
    let confirmText = `Configured: ${transcript}`;
    if (lang === 'hi') {
      confirmText = `आपकी आवाज़ से व्यवसाय और पूंजी सफलतापूर्वक दर्ज कर दी गई है।`;
    } else if (lang === 'ta') {
      confirmText = `குரல் மூலம் தொழில் மற்றும் மூலதன விவரங்கள் வெற்றிகரமாக அமைக்கப்பட்டன.`;
    } else if (lang === 'te') {
      confirmText = `వాయిస్ ద్వారా వ్యాపారం మరియు పెట్టుబడి వివరాలు విజయవంతంగా నమోదు చేయబడ్డాయి.`;
    } else if (lang === 'mr') {
      confirmText = `आपल्या आवाजाद्वारे व्यवसाय आणि भांडवल यशस्वीरीत्या निवडले गेले आहे.`;
    }

    setFeedbackMsg(confirmText);
    speakFeedback(confirmText);
    setTimeout(() => {
      onClose();
    }, 1200);
  };

  if (!isOpen) return null;

  const sampleQueries = {
    en: [
      'Dairy farming with ₹100,000 margin in Thanjavur',
      'Tailoring boutique shop with ₹30,000 in Barabanki',
      'Poultry farming with ₹50,000 margin in Pune',
    ],
    hi: [
      'तंजौर में 1 लाख रुपये से डेयरी फार्मिंग का व्यापार',
      'बाराबंकी में 30 हजार रुपये से सिलाई बुटीक की दुकान',
      'पुणे में 50 हजार रुपये की पूंजी से मुर्गी पालन',
    ],
    ta: [
      'தஞ்சாவூரில் 1 லட்சம் முதலீட்டில் பால் பண்ணை',
      '30 ஆயிரம் ரூபாயில் தையல் கடை',
    ],
    te: [
      'గుంటూరులో 1 లక్ష పెట్టుబడితో పాల వ్యాపారం',
      '50 వేలతో కోళ్ల ఫారం',
    ],
    mr: [
      'पुण्यात 1 लाख भांडवलात डेअरी व्यवसाय',
      '30 हजार रुपयात टेलरिंग दुकान',
    ]
  };

  const activeSamples = sampleQueries[lang] || sampleQueries.en;

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
            {t.labels.speak_query}
          </p>

          {/* Big Mic Button */}
          <div className="py-2">
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
              {isListening ? '🎙️ Listening... Speak your business idea now' : 'Click Microphone to Start Speaking'}
            </span>
          </div>

          {/* Transcript Box */}
          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-left min-h-[75px] max-h-[120px] overflow-y-auto">
            <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
              Recognized Speech:
            </span>
            <p className="text-xs text-slate-900 font-semibold leading-relaxed">
              {transcript || <span className="text-slate-400 font-normal italic">Speak your business, margin amount, or village location...</span>}
            </p>
          </div>

          {feedbackMsg && (
            <div className="p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{feedbackMsg}</span>
            </div>
          )}

          {transcript && (
            <button
              onClick={handleProcessQuery}
              className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-600/20 transition-all flex items-center justify-center gap-2"
            >
              <span>Apply Voice Command & Configure Evaluation</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}

          {/* Quick Vernacular Samples */}
          <div className="text-left space-y-1.5 pt-2 border-t border-slate-100">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Sample Voice Queries ({lang.toUpperCase()}):
            </span>
            <div className="flex flex-col gap-1 text-xs">
              {activeSamples.map((sample, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setTranscript(sample)}
                  className="text-left p-2 rounded-xl bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-blue-700 text-[11px] font-medium transition-all"
                >
                  💬 "{sample}"
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
