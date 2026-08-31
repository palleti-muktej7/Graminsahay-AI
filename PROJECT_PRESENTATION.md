# 🌾 GraminSahay AI — Complete Project Presentation & Architecture Brief

> **Project Title:** GraminSahay AI — Hyper-Local Business Advisory & Concessional Financial Structuring Platform  
> **Problem Statement ID:** SIH26091  
> **Nodal Ministry:** Ministry of Social Justice and Empowerment (MoSJE)  
> **Target Beneficiaries:** Rural Micro-Entrepreneurs (SC/ST/OBC/EWS), CSC VLE Operators, and Bank Credit Appraisal Officers  
> **Live Production URL:** [https://graminsahay-ai.vercel.app](https://graminsahay-ai.vercel.app)  
> **GitHub Repository:** [https://github.com/palleti-muktej7/Graminsahay-AI.git](https://github.com/palleti-muktej7/Graminsahay-AI.git)

---

## 📌 1. Executive Summary & Core Mission

Rural entrepreneurs in India often struggle to access formal credit because:
1. **Lack of Hyper-Local Market Evidence:** Generic AI tools or advisors provide urban benchmarks, ignoring local catchment demand and competition within a 5–10 km radius.
2. **Complex Concessional Schemes:** Beneficiaries do not know which MoSJE scheme (Micro Finance vs. Term Loan) matches their capital outlay or how to structure the mandatory **10% beneficiary equity vs. 90% concessional loan**.
3. **High Rejection at Bank Counters:** Lack of bank-compliant **Detailed Project Reports (DPR)** with calculated Debt Service Coverage Ratios (DSCR) and moratorium cash flow schedules leads to high rejection rates.

**GraminSahay AI** bridges this gap as a **production-ready, evidence-grounded AI copilot** that combines live OpenStreetMap geospatial intelligence, deterministic financial math, multilingual voice capabilities, and real-time database synchronization with bank appraisal workflows.

---

## 👥 2. Three Distinct Stakeholder Portals

| Portal / Role | Key Purpose & Real-World Workflow |
|---|---|
| **1. Rural Micro-Entrepreneur** | Direct self-service portal. Enter village location & available capital (10%), select rural business sector, explore competitor pins on live map, review SWOT & price strategies, calculate DSCR & EMI, and download instant bankable DPR PDF. |
| **2. CSC VLE Center Operator** | Assisted Kiosk Mode for village citizens who lack smartphones or digital literacy. VLE operators create structured applications on behalf of villagers, manage panchayat rosters, and batch-export DPRs for local banks. |
| **3. Bank Credit Appraisal Officer** | Formal branch evaluation desk. Fetches live submitted applications directly from Supabase PostgreSQL, audits viability verdicts, reviews 90% credit exposure & DSCR repayment capability, records **Sanction / Query / Decline** decisions permanently in the database, and downloads official Bank Appraisal DPRs. |

---

## ⚙️ 3. The 6-Step Feasibility & Advisory Engine

```
[ Step 1: Profile & Location ]
           ⬇
[ Step 2: Sector & Capital (10% / 90%) ]
           ⬇
[ Step 3: OpenStreetMap Competitors (5-10km) ]
           ⬇
[ Step 4: Evidence-Grounded SWOT & Mandi Pricing ]
           ⬇
[ Step 5: Deterministic Financial Planner & Moratorium ]
           ⬇
[ Step 6: Bankable Decision Verdict & Downloadable DPR ]
```

### 🔹 Step 1: Entrepreneur Profile & Village Location
* Captures applicant name, social category (`OBC / NBCFDC`, `SC / NSFDC`, `ST / NSTFDC`, `General`), prior experience, and village location.
* Features **1-Click GPS Auto-Detection** and quick-select presets for sample rural districts (*Thanjavur, Barabanki, Pune, Guntur, Patna*).
* Dynamically sets catchment evaluation radius (3 km village core, 10 km block catchment, 20 km sub-district).

### 🔹 Step 2: Micro-Enterprise Selection & Capital Structuring
* Validated rural business sectors:
  1. **Dairy Farming & Milk Processing** (65% catchment demand)
  2. **Broiler & Layer Poultry Farm** (45% catchment demand)
  3. **Rural Kirana & General Store** (80% catchment demand)
  4. **Tailoring, Boutique & Readymade Garments** (35% catchment demand)
  5. **Flour Mill & Spice Grinding Unit** (50% catchment demand)
  6. **Two-Wheeler & Agri Repair Workshop** (30% catchment demand)
* Beneficiary configures their available equity capital (e.g. ₹30,000 or ₹1,00,000).
* **Automatic Scheme Routing**:
  * $\le$ ₹1.40 Lakh Outlay $\rightarrow$ **MoSJE Micro Finance Scheme** (6.5% interest, 3-Yr tenure, 3-Mo moratorium)
  * $>$ ₹1.40 Lakh Outlay $\rightarrow$ **MoSJE Term Loan Scheme** (8.0% interest, 7-Yr tenure, 6-Mo moratorium)

### 🔹 Step 3: Hyper-Local Geospatial Intelligence (OpenStreetMap)
* Live Leaflet map displaying the proposed business location and exact competitor units within the chosen catchment radius.
* Evaluates **Catchment Population**, **Estimated Households**, **Target Customer Reach**, and **Competitor Density Level** (`LOW`, `MEDIUM`, `HIGH`).
* Safe coordinate fallback ensures 100% crash-free map rendering on all mobile and desktop devices.

### 🔹 Step 4: AI Feasibility & SWOT Grounding
* Generates localized, tailored **Strengths, Weaknesses, Opportunities, and Threats**.
* Outlines field-grounded **Local Risk Mitigations** (e.g. seasonal silage storage, bypassing mandi middlemen, cooperative purchasing).
* Provides Agmarknet APMC-benchmarked **Retail vs. Wholesale Mandi Pricing** with specific **Value-Addition Strategies** (e.g. converting 30% milk to Paneer/Ghee yields 40% higher realization per liter).

### 🔹 Step 5: Deterministic Financial Planner & Moratorium Schedule
* **Phase 1 (Moratorium Period):** Simple monthly interest servicing only during enterprise gestation (no principal repayment burden).
* **Phase 2 (Regular Commercial Amortization):** Fixed reducing-balance monthly EMI covering principal + interest.
* **Cashflow & DSCR Sustainability Verification:**
  $$\text{DSCR} = \frac{\text{Net Operating Cashflow}}{\text{Monthly EMI}} \ge 1.40\times \text{ (Bank Benchmark)}$$
* Demonstrates transparent default-risk mitigation to channelizing banks.

### 🔹 Step 6: Decision Verdict & Official Bankable DPR PDF
* Generates final **GO (Green)**, **CAUTION (Amber)**, or **NO-GO (Red)** viability verdict score (0–100) and Bankable Readiness Index.
* **1-Click Official DPR Download**: Generates an official multi-page PDF formatted with MoSJE scheme guidelines, financial breakdown, DSCR verification, and applicant metadata ready for bank submission.

---

## 🗄️ 4. Enterprise Database & Live Persistence Architecture

* **Database Engine:** Supabase PostgreSQL with permanent relational tables:
  * `public.profiles`: Stores registered users, phones, verified roles, social categories, and preferred languages.
  * `public.business_proposals`: Persists all submitted loan proposals with full financial parameters, DSCR, viability verdicts, and appraisal status (`PENDING`, `SANCTIONED`, `CLARIFICATION`, `DECLINED`).
* **IPv4 Pooler Integration:** Uses Supabase's AWS Transaction Pooler (`aws-0-ap-south-1.pooler.supabase.com:6543`) with enforced SSL (`sslmode=require`) to guarantee uninterrupted cloud connectivity between Vercel Serverless and PostgreSQL.
* **Live Health Diagnostics:** Built-in endpoint at `/api/auth/db-health` to inspect live database connection status and record counts in real time.

---

## 🌐 5. Complete 5-Language Localization & Voice Guidance

1. **Full Vernacular Translation:** 100% complete UI and dynamic data translation for:
   * 🇬🇧 **English**
   * 🇮🇳 **हिंदी (Hindi)**
   * 🇮🇳 **தமிழ் (Tamil)**
   * 🇮🇳 **తెలుగు (Telugu)**
   * 🇮🇳 **मराठी (Marathi)**
2. **Vernacular Voice Assistant (Speech-to-Text & Text-to-Speech):**
   * Recognizes multilingual speech inputs across languages (e.g. *"तंजौर में 1 लाख से डेयरी फार्मिंग"*, *"గుంటూరులో పాల వ్యాపారం ఒక లక్ష"*).
   * Parses spoken numerals (*lakh, hazaar, thousand, k*), business keywords, and district names.
   * Speaks back audio confirmation in the user's selected language using Web Speech Synthesis and auto-configures the evaluation.

---

## 🏗️ 6. Technical Stack & Deployment Summary

| Layer | Technologies Used |
|---|---|
| **Frontend** | React 18, Vite, Tailwind CSS, Lucide Icons, React-Leaflet, Web Speech API |
| **Backend API** | FastAPI (Python 3.11), Pydantic v2, HTTPX, ReportLab (PDF Engine) |
| **Database** | Supabase PostgreSQL, Transaction Connection Pooler, Psycopg2-binary |
| **Mapping & GIS** | OpenStreetMap, Overpass API, Leaflet.js, Haversine Spatial Engine |
| **Hosting & CI/CD** | Vercel Serverless Full-Stack Monorepo, GitHub Actions Auto-Deployment |

---

## 🎯 7. Quick 2-Minute Zoom Demo Script

1. **Introduction (15 sec):**
   > *"Good morning/afternoon. Today we present GraminSahay AI, built for MoSJE (Problem SIH26091) to democratize rural micro-enterprise advisory and concessional credit structuring."*
2. **Landing Page & Role Gateways (20 sec):**
   > *"Show the landing page. Explain the 3 portals: Rural Entrepreneur, CSC VLE Hub, and Bank Officer Desk. Switch the language to Hindi or Telugu to show instant multilingual adaptation."*
3. **Voice Copilot & 6-Step Engine (40 sec):**
   > *"Open the Voice Assistant. Speak a query: 'Dairy farming with ₹1,00,000 margin in Thanjavur'. Show how it auto-structures 10% equity (₹1L) and 90% concessional loan (₹9L). Walk through Step 3 (Live Competitor Map), Step 4 (SWOT & Mandi Pricing), Step 5 (Moratorium & DSCR calculation), and Step 6 (Final GO Verdict)."*
4. **DPR PDF Download (15 sec):**
   > *"Click 'Download Official DPR (PDF)' to demonstrate the printable bank-ready project report generated on the fly."*
5. **Bank Officer Portal & Database Sync (30 sec):**
   > *"Log in as Bank Officer. Show live proposals loaded from Supabase PostgreSQL. Click '✓ Sanction' to show real-time database update and permanent status persistence."*
