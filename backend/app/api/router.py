import datetime
from fastapi import APIRouter, HTTPException
from fastapi.responses import Response
from ..core.decision_engine import evaluate_verdict
from ..core.dpr_generator import generate_dpr_pdf
from ..core.supabase_client import save_proposal_to_supabase, fetch_proposal_by_id
from ..models.schemas import (
    FullAdvisoryRequest, FullAdvisoryResponse, LocationInput, FinancialAnalysis,
    CompetitorAnalysis, MarketReachAnalysis, PricingRecommendation, SWOTItem,
    EntrepreneurProfile, FeasibilityVerdict
)
from ..core.financial_engine import calculate_financials, load_schemes
from ..core.geo_engine import analyze_geo_market, load_business_profiles, load_district_proxies
from ..core.rag_engine import (
    generate_swot_analysis, generate_threat_identifications, generate_pricing_recommendation
)
from .auth import auth_router

router = APIRouter()
router.include_router(auth_router, prefix="/auth", tags=["Authentication & Storage"])

@router.get("/health")
def health_check():
    return {"status": "ok", "service": "GraminSahay AI Rural Copilot Backend", "version": "1.0.0"}

@router.get("/business-profiles")
def get_business_profiles():
    return load_business_profiles()

@router.get("/schemes")
def get_schemes():
    return load_schemes()

@router.get("/districts")
def get_districts():
    return load_district_proxies()

@router.post("/finance/calculate", response_model=FinancialAnalysis)
def calculate_finances(
    available_margin: float,
    business_id: str,
    margin_percentage: float = 10.0,
    scheme_override_id: str = None
):
    try:
        return calculate_financials(
            available_margin=available_margin,
            business_id=business_id,
            margin_percentage=margin_percentage,
            scheme_override_id=scheme_override_id
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/geo/market-analysis")
def get_geo_market(location: LocationInput, business_id: str):
    try:
        market_reach, competitors = analyze_geo_market(location, business_id)
        return {"market_reach": market_reach, "competitors": competitors}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/advisory/evaluate-all", response_model=FullAdvisoryResponse)
def evaluate_all(req: FullAdvisoryRequest):
    """
    Core Pipeline Endpoint: Orchestrates full 6-module analysis:
    1. Geospatial & Competitor Intelligence (OpenStreetMap)
    2. Deterministic Financial Structuring & Scheme Selection
    3. RAG Feasibility SWOT, Threat Mitigation & Pricing Benchmark
    4. Bankable Viability Verdict & Metric Aggregation
    5. Automatic SSL Sync to Supabase PostgreSQL
    """
    try:
        businesses = load_business_profiles()
        business_id = req.business_id or "dairy_farming"
        business = next((b for b in businesses if b["id"] == business_id), businesses[0])
        b_name = business["name"]
        lang = req.entrepreneur.preferred_language or "en"

        # 1. Geospatial OpenStreetMap & Census Catchment Engine
        market_reach, competitors = analyze_geo_market(req.location, business_id)

        # 2. Financial Structuring Engine
        margin_cap = req.custom_margin_capital or req.entrepreneur.available_margin_capital
        financials = calculate_financials(
            available_margin=margin_cap,
            business_id=business_id,
            margin_percentage=10.0
        )

        # 3. RAG Feasibility SWOT, Threats, & Pricing Engine (Multilingual)
        swot = generate_swot_analysis(
            entrepreneur=req.entrepreneur,
            location=req.location,
            business_id=business_id,
            competitor_density=competitors.density_level,
            lang=lang
        )
        threats = generate_threat_identifications(business_id)
        pricing = generate_pricing_recommendation(business_id)

        # 4. Viability Decision Verdict Engine (GO / CAUTION / NO-GO)
        verdict = evaluate_verdict(
            market=market_reach,
            competitors=competitors,
            financials=financials,
            swot=swot
        )

        response = FullAdvisoryResponse(
            timestamp=datetime.datetime.now().isoformat(),
            entrepreneur=req.entrepreneur,
            location=req.location,
            business_id=business_id,
            business_name=b_name,
            market_reach=market_reach,
            competitors=competitors,
            swot=swot,
            local_threats=threats,
            pricing=pricing,
            financials=financials,
            verdict=verdict
        )

        # Safely persist proposal to Supabase database
        try:
            save_proposal_to_supabase(response.model_dump())
        except Exception:
            pass

        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Advisory evaluation error: {str(e)}")

@router.post("/report/download-dpr")
def download_dpr(req: FullAdvisoryResponse):
    """
    Generates and returns an official Detailed Project Report (DPR) as a downloadable PDF.
    """
    try:
        pdf_bytes = generate_dpr_pdf(req.model_dump())
        filename = f"GraminSahay_DPR_{req.entrepreneur.full_name.replace(' ', '_')}_{req.business_id}.pdf"
        return Response(
            content=pdf_bytes,
            media_type="application/pdf",
            headers={"Content-Disposition": f"attachment; filename={filename}"}
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"PDF DPR generation error: {str(e)}")

@router.get("/report/download-by-id/{proposal_id}")
def download_dpr_by_id(proposal_id: str):
    """
    Fetches a saved proposal from Supabase by ID and generates the official PDF DPR.
    """
    prop = fetch_proposal_by_id(proposal_id)
    if not prop:
        raise HTTPException(status_code=404, detail="Proposal not found in database.")

    raw_data = prop.get("raw_response_json") or prop
    try:
        pdf_bytes = generate_dpr_pdf(raw_data)
        filename = f"GraminSahay_DPR_{prop.get('applicant_name', 'Applicant').replace(' ', '_')}_{prop.get('business_id', 'business')}.pdf"
        return Response(
            content=pdf_bytes,
            media_type="application/pdf",
            headers={"Content-Disposition": f"attachment; filename={filename}"}
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"PDF DPR generation error: {str(e)}")
