import datetime
from fastapi import APIRouter, Response, HTTPException
from typing import List, Dict, Any

from ..models.schemas import (
    FullAdvisoryRequest, FullAdvisoryResponse, LocationInput, FinancialAnalysis,
    CompetitorAnalysis, MarketReachAnalysis, PricingRecommendation, SWOTItem
)
from ..core.financial_engine import calculate_financials, load_schemes, load_business_profiles
from ..core.geo_engine import analyze_geo_market, load_district_proxies
from ..core.rag_engine import (
    generate_swot_analysis, generate_threat_identifications, generate_pricing_recommendation
)
from ..core.decision_engine import evaluate_verdict
from ..core.dpr_generator import generate_dpr_pdf
from ..core.supabase_client import save_proposal_to_supabase
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
def evaluate_full_proposal(req: FullAdvisoryRequest):
    try:
        margin = req.custom_margin_capital or req.entrepreneur.available_margin_capital
        business_id = req.business_id
        
        # 1. Load business metadata
        businesses = load_business_profiles()
        business = next((b for b in businesses if b["id"] == business_id), businesses[0])
        b_name = business["name"]

        # 2. Location & Competitor Intelligence
        market_reach, competitors = analyze_geo_market(req.location, business_id)

        # 3. Deterministic Financial Calculator & MoSJE Scheme Router
        financials = calculate_financials(
            available_margin=margin,
            business_id=business_id,
            margin_percentage=10.0
        )

        # 4. RAG Feasibility SWOT, Threats, & Pricing Engine
        swot = generate_swot_analysis(
            entrepreneur=req.entrepreneur,
            location=req.location,
            business_id=business_id,
            competitor_density=competitors.density_level
        )
        threats = generate_threat_identifications(business_id)
        pricing = generate_pricing_recommendation(business_id, req.location)

        # 5. Viability Decision Verdict Engine (GO / CAUTION / NO-GO)
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

        # Asynchronously/safely persist to Supabase PostgreSQL
        try:
            save_proposal_to_supabase(response.model_dump())
        except Exception:
            pass

        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Advisory evaluation error: {str(e)}")

from ..core.supabase_client import (
    save_proposal_to_supabase, fetch_proposal_by_id
)
from ..models.schemas import (
    FullAdvisoryRequest, FullAdvisoryResponse, LocationInput, FinancialAnalysis,
    CompetitorAnalysis, MarketReachAnalysis, PricingRecommendation, SWOTItem,
    EntrepreneurProfile, FeasibilityVerdict
)
from ..core.financial_engine import calculate_financials
from ..core.geo_engine import analyze_geo_market
from ..core.rag_engine import (
    generate_swot_analysis, generate_threat_identifications, generate_pricing_recommendation
)

@router.get("/report/download-by-id/{proposal_id}")
def download_dpr_by_proposal_id(proposal_id: str):
    try:
        record = fetch_proposal_by_id(proposal_id)
        if not record:
            raise HTTPException(status_code=404, detail="Proposal record not found in Supabase.")

        raw = record.get("raw_response_json")
        full_data = None
        if raw and isinstance(raw, dict):
            try:
                full_data = FullAdvisoryResponse.model_validate(raw)
            except Exception:
                pass

        if not full_data:
            # Reconstruct FullAdvisoryResponse from database columns
            ent = EntrepreneurProfile(
                full_name=record.get("applicant_name", "Applicant"),
                available_margin_capital=record.get("available_margin_capital", 100000.0)
            )
            loc = LocationInput(
                village=record.get("village", "Melattur"),
                block=record.get("block", "Papanasam"),
                district=record.get("district", "Thanjavur"),
                state=record.get("state", "Tamil Nadu"),
                pincode=record.get("pincode", "614205"),
                latitude=record.get("latitude", 10.787),
                longitude=record.get("longitude", 79.1378),
                radius_km=record.get("catchment_radius_km", 10.0)
            )
            biz_id = record.get("business_id", "dairy_farming")
            mkt, comp = analyze_geo_market(loc, biz_id)
            fin = calculate_financials(record.get("available_margin_capital", 100000.0), biz_id)
            swot = generate_swot_analysis(ent, loc, biz_id, comp.density_level)
            threats = generate_threat_identifications(biz_id)
            pricing = generate_pricing_recommendation(biz_id, loc)
            vd = evaluate_verdict(mkt, comp, fin, swot)

            full_data = FullAdvisoryResponse(
                timestamp=datetime.datetime.now().isoformat(),
                entrepreneur=ent,
                location=loc,
                business_id=biz_id,
                business_name=record.get("business_name", "Rural Enterprise"),
                market_reach=mkt,
                competitors=comp,
                swot=swot,
                local_threats=threats,
                pricing=pricing,
                financials=fin,
                verdict=vd
            )

        pdf_bytes = generate_dpr_pdf(full_data)
        safe_name = record.get("applicant_name", "Applicant").replace(" ", "_")
        filename = f"MoSJE_DPR_{safe_name}_{record.get('business_id', 'business')}.pdf"
        return Response(
            content=pdf_bytes,
            media_type="application/pdf",
            headers={"Content-Disposition": f"attachment; filename={filename}"}
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"PDF generation failed: {str(e)}")

@router.post("/report/generate-dpr")
def download_dpr(data: Dict[str, Any]):
    try:
        if isinstance(data, dict):
            # Check if it's already a FullAdvisoryResponse model or needs validation
            try:
                validated = FullAdvisoryResponse.model_validate(data)
            except Exception:
                # If wrapped inside raw_response_json
                if "raw_response_json" in data and isinstance(data["raw_response_json"], dict):
                    validated = FullAdvisoryResponse.model_validate(data["raw_response_json"])
                else:
                    raise
        else:
            validated = data

        pdf_bytes = generate_dpr_pdf(validated)
        name = validated.entrepreneur.full_name.replace(" ", "_")
        filename = f"MoSJE_DPR_{name}_{validated.business_id}.pdf"
        return Response(
            content=pdf_bytes,
            media_type="application/pdf",
            headers={"Content-Disposition": f"attachment; filename={filename}"}
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"PDF generation failed: {str(e)}")
