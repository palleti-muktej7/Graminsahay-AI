# 🌾 GraminSahay AI (ग्रामीणसहाय)
### **AI-Driven Hyper-Local Business Advisory & Financial Structuring Assistant for Rural Micro-Entrepreneurs**
**Ministry of Social Justice and Empowerment (MoSJE) | Smart India Hackathon (SIH 2026)**  
**Problem Statement ID:** `SIH26091`  
**Theme:** Agriculture, FoodTech & Rural Development  

---

## 🌟 Executive Overview
Rural micro-entrepreneurs face two major hurdles when starting an enterprise:
1. **Business Viability Blindspots:** Uncertainty regarding local customer catchment (5–10 km), existing competitor density, supply-chain risks, and fair product pricing.
2. **Financial Structuring & Scheme Navigation:** Confusion regarding beneficiary equity contribution ($10\%$), concessional loan eligibility ($90\%$), scheme qualification (Micro Finance $\le ₹1.40\,\text{Lakh}$ vs Term Loan $> ₹1.40\,\text{Lakh}$), moratorium period cashflow management, and bankable project report preparation.

**GraminSahay AI** is an **evidence-first decision-support platform** that eliminates AI hallucinations by combining:
- **Live Geospatial Intelligence (OpenStreetMap Overpass API)** for real competitor mapping within a 5–10 km radius.
- **Data Confidence Badges (High / Medium / Low)** with explicit citations of official datasets (Census 2011, Agmarknet, MoSJE).
- **Deterministic Financial & Scheme Router** executing MoSJE / NBCFDC / NSFDC guidelines.
- **Moratorium-Aware Amortization Planner** providing monthly/yearly schedules and Debt Service Coverage Ratio (DSCR).
- **Automated Bankable DPR Generator** exporting official PDF Detailed Project Reports ready for bank branch submission.
- **Vernacular Voice Assistant** supporting English, Hindi (हिंदी), Tamil (தமிழ்), Telugu (తెలుగు), and Marathi (मराठी).

---

## 📐 System Architecture

```mermaid
graph TD
    User([Rural Entrepreneur / CSC VLE]) -->|Voice / UI / Multilingual| FE[React + Tailwind + Leaflet Frontend]
    FE -->|REST API Requests| BE[FastAPI Backend Engine]
    
    subgraph Backend Intelligence Layer
        BE --> Geo[Location & GeoEngine\n- OSM Overpass API\n- Pincode/District Census Data]
        BE --> Market[Market & Price Data Engine\n- Agmarknet / Commodity Benchmarks\n- Demand proxy estimator]
        BE --> FinEngine[Deterministic Financial Engine\n- 10% Margin / 90% Loan\n- Scheme Matcher (Micro <1.4L / Term <=50L)\n- Moratorium Amortization & Cashflow]
        BE --> RAG[RAG Feasibility Analyzer\n- Vector DB / Context Store\n- Grounded LLM Prompts\n- Confidence Scoring System]
        BE --> Decision[Verdict Engine\n- GO / CAUTION / NO-GO Scorer]
        BE --> DPR[DPR & PDF Generator\n- Bankable Project Report]
    end

    subgraph Data Sources & Grounding
        Geo --> OSM[(OpenStreetMap Live POIs)]
        Geo --> CensusDB[(District & Block Demographics)]
        Market --> PriceDB[(Commodity & Retail Benchmarks)]
        FinEngine --> SchemeDB[(MoSJE / NBCFDC / NSFDC Scheme Rules)]
        RAG --> DocStore[(Scheme Docs & Rural Case Studies)]
    end

    Decision --> FE
    FinEngine --> FE
    RAG --> FE
    DPR --> FE
```

---

## 🚀 Key Innovation Highlights

### 1. 6-Point Hyper-Local Feasibility Analysis
1. **Market Reach & Demographics:** Population, household count, and conversion estimates for 5–10 km catchment.
2. **Opportunity Analysis:** High-margin value-addition alternatives (e.g. Raw Milk $\rightarrow$ Paneer/Ghee/Curd for 35–45% higher margin).
3. **Budget & Location SWOT:** Grounded strengths, weaknesses, opportunities, and threats customized to applicant capital.
4. **Local Threat Identification:** Unit economics impact of feed price volatility, monopsony buyers, and seasonal dips with practical mitigations.
5. **Geospatial Competitor Mapping:** Live OpenStreetMap POIs with density levels (Low, Medium, High).
6. **Product Pricing Strategy:** Cost-plus and farmgate strategies benchmarked against Agmarknet commodity prices.

### 2. Smart Financial Structuring & MoSJE Scheme Engine
$$\text{Project Cost} = \frac{\text{Available Margin (Own Capital)}}{10\%}$$
$$\text{Eligible Concessional Loan} = 90\% \times \text{Project Cost}$$

- **Scheme A (Micro Finance):** Project Cost $\le ₹1.40\,\text{Lakh}$, Interest: $6.5\%$ p.a., Tenure: $3\,\text{Years}$ ($36\,\text{Months}$), Moratorium: $3\,\text{Months}$.
- **Scheme B (Term Loan):** $₹1.40\,\text{Lakh} < \text{Project Cost} \le ₹50.00\,\text{Lakh}$, Interest: $8.0\%$ p.a., Tenure: $7\,\text{Years}$ ($84\,\text{Months}$), Moratorium: $6\,\text{Months}$.

### 3. Clear Viability Verdict & Bankable DPR Export
- **🟢 GO ($\ge 75$):** Strong demand, low/moderate competition, healthy DSCR (>1.5x).
- **🟡 CAUTION ($50-74$):** Opportunity exists with specific value-addition and credit control.
- **🔴 NOT RECOMMENDED ($< 50$):** High saturation or heavy debt burden.
- **One-Click PDF DPR:** Generates formal MoSJE-compliant Detailed Project Report with tables and signature fields.

---

## 🛠️ Tech Stack
- **Frontend:** React 18, Vite 6, Tailwind CSS, Lucide Icons, Leaflet & React-Leaflet, Axios, Web Speech API (STT & TTS).
- **Backend:** Python FastAPI, Uvicorn, Pydantic v2, HTTPX, ReportLab (PDF Engine).
- **External Data & APIs:** OpenStreetMap Overpass QL API, Census 2011 proxies, Agmarknet Price Monitoring.

---

## ⚡ Quick Start Guide

### Prerequisites
- Python 3.10+
- Node.js 18+ and npm

### 1. Launch Backend
```bash
# Double click run_backend.bat OR run in terminal:
python -m uvicorn backend.app.main:app --host 0.0.0.0 --port 8000 --reload
```
*Backend API documentation available at:* `http://localhost:8000/docs`

### 2. Launch Frontend
```bash
# Double click run_frontend.bat OR run in terminal:
cd frontend
npm run dev
```
*Access web application at:* `http://localhost:5173/`

### 3. Run Backend Test Suite
```bash
python test_backend.py
```

---

## 🏆 Hackathon Winning Criteria Mapping

| Evaluation Parameter | How GraminSahay AI Delivers |
|---|---|
| **Novelty & Architecture** | Evidence-first architecture with Data Confidence Badges; zero hallucinations. |
| **MoSJE Scheme Compliance** | Precise 10% equity, 90% loan, and Micro Finance vs Term Loan criteria matching official guidelines. |
| **Rural Usability** | 5 Vernacular languages (Hindi, Tamil, Telugu, Marathi, English) and Speech Recognition. |
| **Commercial Readiness** | Auto-generates bankable PDF DPR with DSCR analysis for bank credit approval. |
