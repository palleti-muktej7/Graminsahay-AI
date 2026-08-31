import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import LandingPage from './components/LandingPage';
import StepWizard from './components/StepWizard';
import LocationInput from './components/LocationInput';
import BusinessSelect from './components/BusinessSelect';
import CompetitorMap from './components/CompetitorMap';
import FeasibilityReport from './components/FeasibilityReport';
import FinancialPlanner from './components/FinancialPlanner';
import DecisionVerdict from './components/DecisionVerdict';
import VoiceAssistant from './components/VoiceAssistant';
import AuthModal from './components/AuthModal';
import BankOfficerDashboard from './components/BankOfficerDashboard';
import CSCDashboard from './components/CSCDashboard';
import { getBusinessProfiles, evaluateFullProposal } from './services/api';
import { translations } from './i18n/translations';
import { RefreshCw, Building2 } from 'lucide-react';

export default function App() {
  const [lang, setLang] = useState('en');
  const [currentStep, setCurrentStep] = useState(1);
  const [isVoiceOpen, setIsVoiceOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authInitialRole, setAuthInitialRole] = useState('entrepreneur');

  // Load real authenticated user from localStorage (or null for Landing Page)
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('graminsahay_auth_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Business Profiles dataset from API
  const [businessProfiles, setBusinessProfiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Application State for Entrepreneur / Assisted applicant
  const [entrepreneur, setEntrepreneur] = useState({
    full_name: 'Ramesh Kumar',
    gender: 'Male',
    category: 'OBC',
    prior_experience_years: 2,
    available_margin_capital: 100000,
    preferred_language: 'en',
  });

  const [location, setLocation] = useState({
    state: 'Tamil Nadu',
    district: 'Thanjavur',
    block: 'Papanasam',
    village: 'Melattur',
    pincode: '614205',
    latitude: 10.787,
    longitude: 79.1378,
    radius_km: 10.0,
  });

  const [selectedBusiness, setSelectedBusiness] = useState('dairy_farming');
  const [capital, setCapital] = useState(100000);

  // Evaluated Response from Backend
  const [fullAdvisoryData, setFullAdvisoryData] = useState(null);

  // Assisted mode flag (when CSC VLE is creating on behalf of a villager)
  const [isAssistedMode, setIsAssistedMode] = useState(false);

  // Fetch initial business profiles on mount
  useEffect(() => {
    async function loadData() {
      try {
        const res = await getBusinessProfiles();
        setBusinessProfiles(res);
      } catch (err) {
        setBusinessProfiles([
          {
            id: 'dairy_farming',
            name: 'Dairy Farming & Milk Processing',
            category: 'Agriculture & Animal Husbandry',
            min_suggested_capital: 50000,
            typical_margin_pct: 22.0,
            value_add_opportunities: ['Paneer & Ghee Production', 'Doorstep Milk Subscription'],
          },
          {
            id: 'poultry_farming',
            name: 'Broiler & Layer Poultry Farm',
            category: 'Animal Husbandry & Food',
            min_suggested_capital: 60000,
            typical_margin_pct: 24.0,
            value_add_opportunities: ['Country Egg Boxes', 'Direct Dressing Counter'],
          },
          {
            id: 'rural_kirana_retail',
            name: 'Rural Kirana & General Store',
            category: 'Retail & Commerce',
            min_suggested_capital: 30000,
            typical_margin_pct: 14.0,
            value_add_opportunities: ['Micro-ATM AePS Point', 'Fresh Farm Produce'],
          },
          {
            id: 'tailoring_garments',
            name: 'Tailoring, Boutique & Readymade Garments',
            category: 'Textiles & Handloom',
            min_suggested_capital: 20000,
            typical_margin_pct: 45.0,
            value_add_opportunities: ['School Uniform Contracts', 'Bridal Blouse Embroidery'],
          },
          {
            id: 'agro_processing_mill',
            name: 'Mini Flour Mill & Spice Grinding Unit',
            category: 'Agro-Processing & FoodTech',
            min_suggested_capital: 45000,
            typical_margin_pct: 32.0,
            value_add_opportunities: ['Cold Pressed Mustard Oil', 'Packaged Turmeric Brand'],
          },
          {
            id: 'two_wheeler_workshop',
            name: 'Two-Wheeler & Agri-Machinery Repair Workshop',
            category: 'Automotive & Technical Services',
            min_suggested_capital: 35000,
            typical_margin_pct: 40.0,
            value_add_opportunities: ['Solar Pump Servicing', 'Tubeless Puncture Kiosk'],
          },
        ]);
      }
    }
    loadData();
  }, []);

  // Update localStorage & state on login
  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    try {
      localStorage.setItem('graminsahay_auth_user', JSON.stringify(user));
    } catch {}
    setFullAdvisoryData(null);
    setCurrentStep(1);
    setIsAssistedMode(false);

    if (user.role === 'entrepreneur') {
      setEntrepreneur({
        full_name: user.full_name,
        gender: 'Male',
        category: user.social_category || 'OBC',
        prior_experience_years: 2,
        available_margin_capital: 100000,
        preferred_language: lang,
      });
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem('graminsahay_auth_user');
    } catch {}
    setFullAdvisoryData(null);
    setCurrentStep(1);
    setIsAssistedMode(false);
  };

  // Launch new assisted application from CSC portal
  const handleStartCSCApplication = () => {
    setIsAssistedMode(true);
    setEntrepreneur({
      full_name: 'Village Beneficiary',
      gender: 'Male',
      category: 'OBC',
      prior_experience_years: 1,
      available_margin_capital: 50000,
      preferred_language: lang,
    });
    setCapital(50000);
    setFullAdvisoryData(null);
    setCurrentStep(1);
  };

  // Open Auth with preselected role
  const handleOpenAuthWithRole = (role) => {
    setAuthInitialRole(role);
    setIsAuthOpen(true);
  };

  // Trigger Backend Advisory Evaluation when transitioning from Step 2 to Step 3
  const handleEvaluate = async (targetStep = 3) => {
    setLoading(true);
    setError(null);
    try {
      const payload = {
        entrepreneur: {
          ...entrepreneur,
          available_margin_capital: capital,
          preferred_language: lang,
        },
        location: location,
        business_id: selectedBusiness,
        custom_margin_capital: capital,
        radius_km: location.radius_km,
      };

      const result = await evaluateFullProposal(payload);
      setFullAdvisoryData(result);
      setCurrentStep(targetStep);
    } catch (err) {
      setError('Could not connect to advisory engine. Ensure backend is running.');
      setCurrentStep(targetStep);
    } finally {
      setLoading(false);
    }
  };

  const handleVoiceQuery = (query) => {
    const qLower = query.toLowerCase();
    if (qLower.includes('dairy') || qLower.includes('milk')) {
      setSelectedBusiness('dairy_farming');
    } else if (qLower.includes('tailor') || qLower.includes('cloth') || qLower.includes('garment')) {
      setSelectedBusiness('tailoring_garments');
    } else if (qLower.includes('kirana') || qLower.includes('shop') || qLower.includes('retail')) {
      setSelectedBusiness('rural_kirana_retail');
    } else if (qLower.includes('poultry') || qLower.includes('chicken') || qLower.includes('egg')) {
      setSelectedBusiness('poultry_farming');
    } else if (qLower.includes('mill') || qLower.includes('flour') || qLower.includes('spice')) {
      setSelectedBusiness('agro_processing_mill');
    }

    if (qLower.includes('100000') || qLower.includes('1 lakh') || qLower.includes('1,00,000')) {
      setCapital(100000);
    } else if (qLower.includes('50000') || qLower.includes('50 thousand') || qLower.includes('50,000')) {
      setCapital(50000);
    } else if (qLower.includes('25000') || qLower.includes('25 thousand')) {
      setCapital(25000);
    } else if (qLower.includes('200000') || qLower.includes('2 lakh')) {
      setCapital(200000);
    }

    if (qLower.includes('thanjavur')) {
      setLocation((prev) => ({ ...prev, district: 'Thanjavur', village: 'Melattur', state: 'Tamil Nadu', lat: 10.787, lon: 79.1378 }));
    } else if (qLower.includes('barabanki')) {
      setLocation((prev) => ({ ...prev, district: 'Barabanki', village: 'Zaidpur', state: 'Uttar Pradesh', lat: 26.9274, lon: 81.1834 }));
    } else if (qLower.includes('pune')) {
      setLocation((prev) => ({ ...prev, district: 'Pune', village: 'Manchar', state: 'Maharashtra', lat: 18.5204, lon: 73.8567 }));
    }
  };

  const currentBiz = businessProfiles.find((b) => b.id === selectedBusiness) || businessProfiles[0];
  const bName = currentBiz?.name || 'Dairy Farming';
  const userRole = currentUser?.role;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      {/* Top Navbar */}
      <Navbar
        lang={lang}
        setLang={setLang}
        onVoiceClick={() => setIsVoiceOpen(true)}
        isListening={false}
        currentUser={currentUser}
        onOpenAuth={() => handleOpenAuthWithRole('entrepreneur')}
        onLogout={handleLogout}
        onGoHome={() => {
          if (!currentUser) setCurrentStep(1);
        }}
      />

      {/* Assisted Mode Banner for CSC VLE */}
      {isAssistedMode && (
        <div className="bg-emerald-50 border-b border-emerald-200 py-2.5 px-4 text-xs text-emerald-900 flex items-center justify-between">
          <span className="font-bold flex items-center gap-1.5">
            <Building2 className="w-4 h-4 text-emerald-600" />
            Assisted Mode: Creating MoSJE Proposal for Village Beneficiary
          </span>
          <button
            onClick={() => setIsAssistedMode(false)}
            className="text-[11px] underline font-semibold text-emerald-700 hover:text-emerald-900"
          >
            ← Return to CSC Village Hub
          </button>
        </div>
      )}

      {/* Render StepWizard ONLY for Entrepreneur flow */}
      {currentUser && (userRole === 'entrepreneur' || isAssistedMode) && (
        <StepWizard
          currentStep={currentStep}
          setStep={(s) => {
            if (s >= 3 && !fullAdvisoryData) {
              handleEvaluate(s);
            } else {
              setCurrentStep(s);
            }
          }}
          lang={lang}
        />
      )}

      {/* Main Content Area */}
      <main className="flex-1 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        {loading && (
          <div className="flex flex-col items-center justify-center p-12 bg-white rounded-3xl border border-slate-200 shadow-sm max-w-md mx-auto my-12 text-center space-y-3">
            <RefreshCw className="w-10 h-10 text-blue-600 animate-spin" />
            <h3 className="text-base font-bold text-slate-800">
              Querying Live OpenStreetMap & MoSJE Schemes...
            </h3>
            <p className="text-xs text-slate-500">
              Analyzing competitor density, demand proxies, and computing moratorium amortization.
            </p>
          </div>
        )}

        {!loading && (
          <>
            {/* VIEW 0: OFFICIAL LANDING PAGE (If not logged in) */}
            {!currentUser && (
              <LandingPage
                onOpenAuth={handleOpenAuthWithRole}
                lang={lang}
              />
            )}

            {/* VIEW 1: BANK OFFICER APPRAISAL PORTAL */}
            {currentUser && userRole === 'bank_officer' && (
              <BankOfficerDashboard currentUser={currentUser} lang={lang} />
            )}

            {/* VIEW 2: CSC VLE VILLAGE ASSISTANCE PORTAL */}
            {currentUser && userRole === 'csc_vle' && !isAssistedMode && (
              <CSCDashboard
                currentUser={currentUser}
                onStartNewApplication={handleStartCSCApplication}
                lang={lang}
              />
            )}

            {/* VIEW 3: RURAL ENTREPRENEUR 6-STEP WIZARD */}
            {currentUser && (userRole === 'entrepreneur' || isAssistedMode) && (
              <>
                {currentStep === 1 && (
                  <LocationInput
                    entrepreneur={entrepreneur}
                    setEntrepreneur={setEntrepreneur}
                    location={location}
                    setLocation={setLocation}
                    onNext={() => setCurrentStep(2)}
                    lang={lang}
                  />
                )}

                {currentStep === 2 && (
                  <BusinessSelect
                    selectedBusiness={selectedBusiness}
                    setSelectedBusiness={setSelectedBusiness}
                    capital={capital}
                    setCapital={setCapital}
                    businessProfiles={businessProfiles}
                    onNext={() => handleEvaluate(3)}
                    onBack={() => setCurrentStep(1)}
                    lang={lang}
                  />
                )}

                {currentStep === 3 && (
                  <CompetitorMap
                    location={location}
                    marketReach={fullAdvisoryData?.market_reach}
                    competitors={fullAdvisoryData?.competitors}
                    businessName={bName}
                    onNext={() => setCurrentStep(4)}
                    onBack={() => setCurrentStep(2)}
                    lang={lang}
                  />
                )}

                {currentStep === 4 && (
                  <FeasibilityReport
                    swot={fullAdvisoryData?.swot}
                    localThreats={fullAdvisoryData?.local_threats}
                    pricing={fullAdvisoryData?.pricing}
                    businessName={bName}
                    onNext={() => setCurrentStep(5)}
                    onBack={() => setCurrentStep(3)}
                    lang={lang}
                  />
                )}

                {currentStep === 5 && (
                  <FinancialPlanner
                    financials={fullAdvisoryData?.financials}
                    onNext={() => setCurrentStep(6)}
                    onBack={() => setCurrentStep(4)}
                    lang={lang}
                  />
                )}

                {currentStep === 6 && (
                  <DecisionVerdict
                    fullData={fullAdvisoryData}
                    onBack={() => setCurrentStep(5)}
                    onReset={() => setCurrentStep(1)}
                    lang={lang}
                  />
                )}
              </>
            )}
          </>
        )}
      </main>

      {/* Voice Assistant Modal */}
      <VoiceAssistant
        isOpen={isVoiceOpen}
        onClose={() => setIsVoiceOpen(false)}
        lang={lang}
        onApplyVoiceQuery={handleVoiceQuery}
      />

      {/* Real Auth & Registration Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        initialRole={authInitialRole}
        currentUser={currentUser}
        onLoginSuccess={handleLoginSuccess}
        lang={lang}
      />

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500">
        <p>
          <b>GraminSahay AI</b> — Hyper-Local Business Advisory and Financial Structuring Platform for Rural Micro-Entrepreneurs
        </p>
        <p className="mt-1 text-[11px] text-slate-400">
          Ministry of Social Justice and Empowerment (MoSJE) • Smart India Hackathon (SIH 2026) • Problem Statement: <b>SIH26091</b>
        </p>
      </footer>
    </div>
  );
}
