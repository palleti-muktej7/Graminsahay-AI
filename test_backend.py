import sys
import os

# Set UTF-8 encoding for stdout on Windows
if sys.platform == "win32":
    import io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

# Add backend to path
sys.path.insert(0, os.path.abspath('.'))

from backend.app.models.schemas import (
    FullAdvisoryRequest, EntrepreneurProfile, LocationInput
)
from backend.app.core.financial_engine import calculate_financials
from backend.app.core.geo_engine import analyze_geo_market
from backend.app.core.rag_engine import (
    generate_swot_analysis, generate_threat_identifications, generate_pricing_recommendation
)
from backend.app.core.decision_engine import evaluate_verdict
from backend.app.core.dpr_generator import generate_dpr_pdf
from backend.app.models.schemas import FullAdvisoryResponse
import datetime

print("Testing Financial Engine...")
fin_micro = calculate_financials(available_margin=10000, business_id="tailoring_garments")
assert fin_micro.selected_scheme_id == "mosje_micro_finance"
assert fin_micro.total_project_cost == 100000.0
assert fin_micro.loan_amount == 90000.0
assert fin_micro.interest_rate_pct == 6.5
print("  [PASS] Micro Finance Calculation:", fin_micro.selected_scheme_name)

fin_term = calculate_financials(available_margin=100000, business_id="dairy_farming")
assert fin_term.selected_scheme_id == "mosje_term_loan"
assert fin_term.total_project_cost == 1000000.0
assert fin_term.loan_amount == 900000.0
assert fin_term.interest_rate_pct == 8.0
print("  [PASS] Term Loan Calculation:", fin_term.selected_scheme_name)

print("Testing Geo Engine...")
loc = LocationInput(village="Melattur", district="Thanjavur", state="Tamil Nadu", latitude=10.787, longitude=79.1378, radius_km=10.0)
mkt, comp = analyze_geo_market(loc, "dairy_farming")
assert mkt.estimated_population > 0
assert len(comp.competitors_list) > 0
print(f"  [PASS] Geo Engine: Population = {mkt.estimated_population:,}, Competitors = {comp.competitor_count}")

print("Testing RAG & Decision Engine...")
ent = EntrepreneurProfile(full_name="Ramesh Kumar", available_margin_capital=100000)
swot = generate_swot_analysis(ent, loc, "dairy_farming", comp.density_level)
threats = generate_threat_identifications("dairy_farming")
pricing = generate_pricing_recommendation("dairy_farming", loc)
verdict = evaluate_verdict(mkt, comp, fin_term, swot)
assert verdict.verdict in ["GO", "CAUTION", "NO_GO"]
print(f"  [PASS] Verdict Engine: {verdict.headline} | Viability Score: {verdict.viability_score}/100")

print("Testing PDF DPR Generator...")
full_resp = FullAdvisoryResponse(
    timestamp=datetime.datetime.now().isoformat(),
    entrepreneur=ent,
    location=loc,
    business_id="dairy_farming",
    business_name="Dairy Farming & Milk Processing",
    market_reach=mkt,
    competitors=comp,
    swot=swot,
    local_threats=threats,
    pricing=pricing,
    financials=fin_term,
    verdict=verdict
)
pdf_bytes = generate_dpr_pdf(full_resp)
assert len(pdf_bytes) > 1000
print(f"  [PASS] PDF Generation passed! Generated PDF Size: {len(pdf_bytes):,} bytes")
print("\n>>> ALL BACKEND CORE ENGINES VALIDATED & PASSED 100% <<<")
