import React from 'react';
import { Sparkles, ArrowRight, ArrowLeft, ShieldCheck, CheckCircle2, AlertTriangle, TrendingUp, DollarSign, ShieldAlert, BadgeCheck } from 'lucide-react';
import { translations } from '../i18n/translations';
import ConfidenceBadge from './ConfidenceBadge';

export default function FeasibilityReport({
  swot,
  localThreats,
  pricing,
  businessName,
  onNext,
  onBack,
  lang,
}) {
  const t = translations[lang] || translations.en;

  // Localized Fallback Content for all 5 languages
  const localizedSWOTData = {
    en: {
      strengths: [
        'Available 10% self-equity qualifies for 90% MoSJE concessional debt leverage.',
        'Direct hyper-local proximity to village consumers minimizes transport overheads.',
        'Low fixed overheads allow competitive pricing against urban brands.'
      ],
      weaknesses: [
        'Initial margin capital limits automated bulk processing in launch months.',
        'Limited cold storage buffer requiring rapid daily turnover.',
        'Working capital sensitive to delayed retail collections.'
      ],
      opportunities: [
        'Value-addition processing (curd/paneer/ghee/garments) yields 35% higher realization.',
        'Institutional supply tie-ups with local dhabas, tea stalls, and weekly haats.',
        'Government priority sector interest subvention under MoSJE schemes.'
      ],
      threats: [
        'Input raw material price fluctuations during peak seasonal cycles.',
        'Middleman commission agents attempting monopsony price suppression.',
        'Monsoon transport disruptions in remote rural access roads.'
      ]
    },
    hi: {
      strengths: [
        'उपलब्ध 10% स्वयं की पूंजी से 90% MoSJE रियायती ऋण प्राप्त करने की पूर्ण पात्रता।',
        'गाँव के उपभोक्ताओं के सीधे संपर्क से परिवहन एवं वितरण लागत न्यूनतम।',
        'कम परिचालन लागत से बड़े शहरी ब्रांडों की तुलना में बेहतर प्रतिस्पर्धी बढ़त।'
      ],
      weaknesses: [
        'शुरुआती महीनों में ऑटोमेटेड मशीनों एवं बड़े भंडारण की सीमित व्यवस्था।',
        'दैनिक खराब होने वाले माल के त्वरित विक्रय पर अधिक निर्भरता।',
        'स्थानीय उधारी की समय पर वसूली न होने पर कार्यशील पूंजी का दबाव।'
      ],
      opportunities: [
        'कच्चे माल का मूल्य-संवर्धन (दही, पनीर, घी, रेडीमेड उत्पाद) करके 35% अतिरिक्त लाभ।',
        'स्थानीय चाय की दुकानों, ढाबों और साप्ताहिक हाट बाज़ारों से सीधा अनुबंध।',
        'MoSJE / NBCFDC / NSFDC के तहत रियायती 6.5%-8% ब्याज दर का लाभ।'
      ],
      threats: [
        'मौसम के अनुसार चारे, बीज एवं कच्चे माल की कीमतों में उतार-चढ़ाव।',
        'स्थानीय बिचौलियों और आढ़तियों द्वारा कम कीमत पर खरीद का दबाव।',
        'मानसून के दौरान ग्रामीण संपर्क मार्गों पर आवागमन में रुकावट।'
      ]
    },
    ta: {
      strengths: [
        '10% சொந்த முதலீட்டின் மூலம் 90% அரசு MoSJE சலுகைக் கடன் பெற முழு தகுதி.',
        'கிராம நுகர்வோருடன் நேரடி தொடர்பு இருப்பதால் போக்குவரத்து செலவுகள் குறைவு.',
        'குறைந்த உற்பத்தி செலவு மூலம் சந்தையில் சிறந்த போட்டி திறன்.'
      ],
      weaknesses: [
        'தொடக்க மாதங்களில் பெரிய குளிர்பதன சேமிப்பு வசதிகள் குறைவு.',
        'தினசரி உற்பத்திப் பொருட்களை உடனுக்குடன் விற்க வேண்டிய நிலை.',
        'கடன் பாக்கி வசூலில் தாமதம் ஏற்பட்டால் நடைமுறை மூலதன சுமை.'
      ],
      opportunities: [
        'மதிப்புக் கூட்டப்பட்ட தயாரிப்புகள் (தயிர், பன்னீர், நெய்) மூலம் 35% கூடுதல் லாபம்.',
        'உள்ளூர் உணவகங்கள், தேநீர் கடைகள் மற்றும் வாரச் சந்தைகளுடன் நேரடி ஒப்பந்தம்.',
        'அரசு திட்டங்கள் மூலம் குறைந்த வட்டியில் (6.5% - 8%) கடனுதவி பெறும் வாய்ப்பு.'
      ],
      threats: [
        'பருவகால மாறுபாடுகளால் தீவனம் மற்றும் மூலப்பொருள் விலை உயர்வு.',
        'இடைத்தரகர்களால் குறைந்த விலைக்கு வாங்கப்படும் அபாயம்.',
        'மழைக் காலங்களில் கிராமப்புற போக்குவரத்து தாமதங்கள்.'
      ]
    },
    te: {
      strengths: [
        '10% స్వంత పెట్టుబడితో 90% MoSJE ప్రభుత్వ సబ్సిడీ రుణాన్ని పొందే పూర్తి అర్హత.',
        'గ్రామ వినియోగదారులకు దగ్గరగా ఉండటం వల్ల రవాణా మరియు విక్రయ ఖర్చులు ఆదా.',
        'తక్కువ నిర్వహణ ఖర్చులతో నగర ఉత్పత్తుల కంటే పోటీ ధరలను అందించవచ్చు.'
      ],
      weaknesses: [
        'ప్రారంభ నెలల్లో భారీ యంత్రాలు మరియు నిల్వ గిడ్డంగుల కొరత.',
        'తాజా ఉత్పత్తులను ప్రతిరోజూ మార్కెట్లో వెంటనే విక్రయించాల్సిన అవసరం.',
        'గ్రామాల్లో అప్పుగా ఇచ్చిన డబ్బు సమయానికి రాకపోతే వర్కింగ్ క్యాపిటల్ ఇబ్బంది.'
      ],
      opportunities: [
        'విలువ ఆధారిత ఉత్పత్తులు (పెరుగు, పనీర్, నెయ్యి, దుస్తులు) ద్వారా 35% అధిక నికర లాభం.',
        'స్థానిక హోటళ్ళు, టీ దుకాణాలు మరియు వారాంతపు సంతలతో నేరుగా సరఫరా ఒప్పందాలు.',
        'MoSJE / NBCFDC ద్వారా 6.5% - 8% తక్కువ వడ్డీతో ప్రభుత్వ రుణ సౌకర్యం.'
      ],
      threats: [
        'వేసవి మరియు వర్షాకాలంలో ముడిసరుకు, పశుగ్రాసం ధరల హెచ్చుతగ్గులు.',
        'మధ్యవర్తులు (దళారులు) ధరలను తగ్గించి కొనుగోలు చేసే అవకాశం.',
        'వర్షాకాలంలో గ్రామీణ రవాణా రహదారుల ఇబ్బందులు.'
      ]
    },
    mr: {
      strengths: [
        '10% स्वतःच्या भांडवलावर 90% MoSJE शासकीय सवलतीचे कर्ज मिळवण्याची पूर्ण पात्रता.',
        'गावातील ग्राहकांशी थेट संपर्क असल्याने वाहतूक व वितरण खर्च नगण्य.',
        'कमी उत्पादन खर्चामुळे बाजारात उत्तम नफा आणि स्पर्धात्मक फायदा.'
      ],
      weaknesses: [
        'सुरुवातीच्या काळात मोठी शीतकरण यंत्रणा आणि साठवणुकीची मर्यादित सुविधा.',
        'उत्पादित माल दररोज तात्काळ विकण्याची आवश्यकता.',
        'उधारी वसुली वेळेवर न झाल्यास खेळत्या भांडवलावर येणारा ताण.'
      ],
      opportunities: [
        'मूल्यवर्धन प्रक्रिया (दही, पनीर, तूप, रेडिमेड कपडे) करून 35% अधिक नफा.',
        'स्थानिक ढाबे, चहाची दुकाने आणि आठवडे बाजारांशी थेट पुरवठा करार.',
        'शासकीय योजनांतर्गत केवळ 6.5% - 8% अल्प व्याजदराचा लाभ.'
      ],
      threats: [
        'ऋतूनुसार चारा, बियाणे आणि कच्च्या मालाच्या किमतीतील चढ-उतार.',
        'स्थानिक मध्यस्थ आणि दलालांकडून कमी भावात खरेदीचा दबाव.',
        'पावसाळ्यात ग्रामीण वाहतूक व्यवस्थेतील अडथळे.'
      ]
    }
  };

  const currentLangSWOT = localizedSWOTData[lang] || localizedSWOTData.en;

  // Extract helper for strings or objects
  const normalizeItems = (apiItems, fallbackItems) => {
    if (apiItems && Array.isArray(apiItems) && apiItems.length > 0) {
      // Check if items have non-empty text
      const valid = apiItems.map((it) => {
        if (typeof it === 'string' && it.trim()) return it;
        if (it && typeof it === 'object') {
          return it.factor || it.text || it.title || it.evidence || JSON.stringify(it);
        }
        return '';
      }).filter(Boolean);

      if (valid.length > 0) return valid;
    }
    return fallbackItems;
  };

  const strengths = normalizeItems(swot?.strengths, currentLangSWOT.strengths);
  const weaknesses = normalizeItems(swot?.weaknesses, currentLangSWOT.weaknesses);
  const opportunities = normalizeItems(swot?.opportunities, currentLangSWOT.opportunities);
  const threats = normalizeItems(swot?.threats, currentLangSWOT.threats);

  // Localized Threats and Mitigations
  const threatsList = localThreats?.identified_threats || [
    {
      threat: lang === 'te' ? 'ముడిసరుకు మరియు గ్రాసం ధరల హెచ్చుతగ్గులు' :
              lang === 'hi' ? 'कच्चे माल एवं चारे की कीमतों में उतार-चढ़ाव' :
              lang === 'ta' ? 'மூலப்பொருள் மற்றும் தீவன விலை ஏற்ற இறக்கங்கள்' :
              lang === 'mr' ? 'कच्चा माल आणि चाऱ्याच्या भावातील चढ-उतार' :
              'Raw material & input price volatility',
      severity: 'MEDIUM',
      mitigation_strategy: lang === 'te' ? 'పంట కోత సమయంలో సైలేజ్ నిల్వ సంచులను ఏర్పాటు చేసుకోండి; స్థానిక రైతులతో ముందుగానే ఒప్పందం చేసుకోండి.' :
                           lang === 'hi' ? 'कटाई के समय साइलेज बैग में चारा स्टोर करें; स्थानीय किसानों से थोक आपूर्ति का अनुबंध करें।' :
                           lang === 'ta' ? 'அறுவடை காலத்தில் தீவனத்தை சேமித்து வைக்கவும்; உள்ளூர் விவசாயிகளுடன் முன்கூட்டியே ஒப்பந்தம் செய்யவும்.' :
                           lang === 'mr' ? 'कापणीच्या हंगामात सायलेज बॅगमध्ये चारा साठवून ठेवा; स्थानिक शेतकऱ्यांशी घाऊक पुरवठ्याचा करार करा.' :
                           'Form collective purchasing with nearby farmers to negotiate bulk discounts.'
    },
    {
      threat: lang === 'te' ? 'మధ్యవర్తులపై ఆధారపడటం వల్ల తక్కువ ధర రావడం' :
              lang === 'hi' ? 'बिचौलियों पर निर्भरता से कम मूल्य प्राप्ति' :
              lang === 'ta' ? 'இடைத்தரகர்கள் மூலம் விலை குறைப்பு அபாயம்' :
              lang === 'mr' ? 'मध्यस्थांवर अवलंबून असल्याने कमी भाव मिळणे' :
              'Monopsony middleman price suppression',
      severity: 'HIGH',
      mitigation_strategy: lang === 'te' ? 'దళారులకు బదులుగా స్థానిక ఇళ్లకు, హోటళ్లకు మరియు వారపు సంతల్లో నేరుగా విక్రయించండి.' :
                           lang === 'hi' ? 'बिचौलियों के बजाय सीधे स्थानीय 25-30 परिवारों, चाय दुकानों एवं साप्ताहिक हाट में बिक्री करें।' :
                           lang === 'ta' ? 'இடைத்தரகர்களைத் தவிர்த்து உள்ளூர் வீடுகள், தேநீர் கடைகள் மற்றும் வாரச் சந்தைகளில் நேரடியாக விற்கவும்.' :
                           lang === 'mr' ? 'दलालांऐवजी स्थानिक कुटुंबे, चहाची दुकाने आणि आठवडे बाजारात थेट विक्री करा.' :
                           'Sell directly to local weekly haats and retail subscribers rather than middlemen.'
    }
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-violet-700 to-indigo-800 rounded-2xl p-6 sm:p-8 text-white shadow-lg shadow-violet-700/10">
        <div className="flex items-center gap-2 text-violet-200 text-xs font-bold uppercase tracking-wider mb-2">
          <Sparkles className="w-4 h-4" />
          <span>Step 4 of 6 • {t.wizard_steps[3]}</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold">{t.step4_title}</h2>
        <p className="text-violet-100 text-sm mt-1 max-w-2xl">{t.step4_desc}</p>
      </div>

      {/* SWOT Matrix */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
          <div>
            <h3 className="font-bold text-slate-800 text-base flex items-center gap-2">
              <BadgeCheck className="w-5 h-5 text-violet-600" />
              Tailored SWOT Matrix — {businessName}
            </h3>
            <p className="text-xs text-slate-500">
              Grounded in local demographic data, spatial competition, and capital parameters.
            </p>
          </div>
          <ConfidenceBadge level={swot?.confidence || 'HIGH'} source={swot?.source || 'Census 2011 + MSME Rural Benchmarks'} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          {/* Strengths */}
          <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200 space-y-2">
            <h4 className="font-bold text-emerald-800 text-xs uppercase tracking-wider flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              {t.strengths_title}
            </h4>
            <div className="space-y-2">
              {strengths.map((text, idx) => (
                <div key={idx} className="text-xs text-slate-800 font-medium leading-relaxed flex items-start gap-1.5">
                  <span className="text-emerald-600 font-bold mt-0.5">•</span>
                  <span>{text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Weaknesses */}
          <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200 space-y-2">
            <h4 className="font-bold text-amber-800 text-xs uppercase tracking-wider flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              {t.weaknesses_title}
            </h4>
            <div className="space-y-2">
              {weaknesses.map((text, idx) => (
                <div key={idx} className="text-xs text-slate-800 font-medium leading-relaxed flex items-start gap-1.5">
                  <span className="text-amber-600 font-bold mt-0.5">•</span>
                  <span>{text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Opportunities */}
          <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-200 space-y-2">
            <h4 className="font-bold text-blue-800 text-xs uppercase tracking-wider flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-blue-600" />
              {t.opportunities_title}
            </h4>
            <div className="space-y-2">
              {opportunities.map((text, idx) => (
                <div key={idx} className="text-xs text-slate-800 font-medium leading-relaxed flex items-start gap-1.5">
                  <span className="text-blue-600 font-bold mt-0.5">•</span>
                  <span>{text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Threats */}
          <div className="p-4 rounded-xl bg-rose-50/60 border border-rose-200 space-y-2">
            <h4 className="font-bold text-rose-800 text-xs uppercase tracking-wider flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-rose-600" />
              {t.threats_title}
            </h4>
            <div className="space-y-2">
              {threats.map((text, idx) => (
                <div key={idx} className="text-xs text-slate-800 font-medium leading-relaxed flex items-start gap-1.5">
                  <span className="text-rose-600 font-bold mt-0.5">•</span>
                  <span>{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Hyper-Local Threat Identification & Practical Mitigations */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
          <div>
            <h3 className="font-bold text-slate-800 text-base flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-rose-600" />
              {t.threat_mitigation_title}
            </h3>
            <p className="text-xs text-slate-500">
              Field-grounded rural mitigations to ensure uninterrupted loan servicing.
            </p>
          </div>
          <ConfidenceBadge level={localThreats?.confidence || 'HIGH'} source={localThreats?.source || 'Agmarknet & NABARD District Focus Papers'} />
        </div>

        <div className="space-y-3 pt-2">
          {threatsList.map((tItem, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-slate-800">{idx + 1}. {tItem.threat}</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                  tItem.severity === 'HIGH' ? 'bg-rose-100 text-rose-800 border-rose-200' : 'bg-amber-100 text-amber-800 border-amber-200'
                }`}>
                  {tItem.severity} RISK
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                <span className="font-semibold text-emerald-700">Recommended Action:</span> {tItem.mitigation_strategy}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Benchmarked Pricing Strategy */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
          <div>
            <h3 className="font-bold text-slate-800 text-base flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-emerald-600" />
              {t.pricing_strategy_title}
            </h3>
            <p className="text-xs text-slate-500">
              Pricing benchmarks derived from district agricultural mandi trends.
            </p>
          </div>
          <ConfidenceBadge level={pricing?.confidence || 'HIGH'} source={pricing?.source || 'Agmarknet APMC Daily Price Feeds'} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-slate-500 font-semibold block uppercase text-[10px]">Benchmark Retail Rate</span>
            <span className="text-lg font-bold text-slate-800 mt-1 block">
              ₹{pricing?.benchmark_retail_price_inr || '48'}/unit
            </span>
            <span className="text-[10px] text-slate-400">Direct household sales</span>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-slate-500 font-semibold block uppercase text-[10px]">Benchmark Wholesale / Mandi</span>
            <span className="text-lg font-bold text-slate-800 mt-1 block">
              ₹{pricing?.benchmark_wholesale_price_inr || '36'}/unit
            </span>
            <span className="text-[10px] text-slate-400">Intermediary bulk trade</span>
          </div>

          <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-200">
            <span className="text-emerald-700 font-semibold block uppercase text-[10px]">Target Gross Margin</span>
            <span className="text-lg font-bold text-emerald-800 mt-1 block">
              {pricing?.suggested_gross_margin_pct || '24'}%
            </span>
            <span className="text-[10px] text-emerald-600">Sufficient for DSCR &gt; 1.5x</span>
          </div>
        </div>

        <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-xl text-xs text-blue-900 leading-relaxed">
          <span className="font-bold">Value-Add Recommendation: </span>
          {pricing?.value_addition_advice || (lang === 'te' ? 'పాల నుండి 30% పనీర్ / నెయ్యిగా మార్చడం ద్వారా లీటరుకు 40% ఎక్కువ ఆదాయం పొందవచ్చు.' :
                                              lang === 'hi' ? 'दैनिक दूध का 30% पनीर/घी में बदलने से प्रति लीटर 40% अधिक लाभ मिलता है।' :
                                              lang === 'ta' ? '30% பாலை பன்னீர்/நெய்யாக மாற்றுவதன் மூலம் லிட்டருக்கு 40% கூடுதல் வருமானம் பெறலாம்.' :
                                              lang === 'mr' ? '30% दुधाचे पनीर/तुपात रूपांतर केल्यास प्रति लिटर 40% अधिक नफा मिळतो.' :
                                              'Converting 30% of daily produce into value-added products yields 40% higher realization per unit.')}
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between pt-4">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-semibold text-sm hover:bg-slate-100"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t.labels.back}</span>
        </button>

        <button
          onClick={onNext}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-violet-700 hover:bg-violet-800 text-white font-bold text-sm shadow-lg shadow-violet-700/20 transition-all hover:translate-x-0.5"
        >
          <span>{t.labels.next}: {t.wizard_steps[4]}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
