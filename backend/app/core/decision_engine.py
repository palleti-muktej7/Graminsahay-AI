from ..models.schemas import (
    FeasibilityVerdict, MarketReachAnalysis, CompetitorAnalysis, FinancialAnalysis, SWOTItem
)

def evaluate_verdict(
    market: MarketReachAnalysis,
    competitors: CompetitorAnalysis,
    financials: FinancialAnalysis,
    swot: SWOTItem
) -> FeasibilityVerdict:
    """
    100-Point Viability Index calculation:
    - Demand Catchment: 25 pts
    - Competition Saturation: 25 pts
    - Financial Feasibility & DSCR: 30 pts
    - Risk & Operational Viability: 20 pts
    """
    score = 0
    positives = []
    concerns = []
    advice = []

    # 1. Demand Catchment (Max 25 pts)
    if market.potential_target_customers >= 1500:
        score += 25
        positives.append(f"Strong customer catchment: ~{market.potential_target_customers:,} potential consumers within {market.catchment_radius_km}km.")
    elif market.potential_target_customers >= 800:
        score += 18
        positives.append(f"Moderate customer base of ~{market.potential_target_customers:,} households.")
    else:
        score += 10
        concerns.append(f"Limited immediate local catchment (~{market.potential_target_customers:,} consumers); will need wider radius distribution.")

    # 2. Competitor Saturation (Max 25 pts)
    if competitors.density_level == "LOW":
        score += 25
        positives.append("Low competitor saturation provides strong early-mover advantage.")
    elif competitors.density_level == "MEDIUM":
        score += 18
        positives.append(f"Healthy competitive density ({competitors.competitor_count} units nearby); room for differentiated quality and pricing.")
    else:
        score += 10
        concerns.append(f"High competitor concentration ({competitors.competitor_count} existing units) in the immediate area.")
        advice.append("Crucial: Avoid competing solely on price of generic goods. Adopt value-addition (e.g., Paneer/Ghee or doorstep service).")

    # 3. Financial Feasibility & DSCR (Max 30 pts)
    if financials.dscr >= 2.0:
        score += 30
        positives.append(f"Excellent Debt Service Coverage Ratio (DSCR: {financials.dscr}x) indicates strong repayment comfort.")
    elif financials.dscr >= 1.4:
        score += 24
        positives.append(f"Viable DSCR of {financials.dscr}x satisfies commercial bank lending norms.")
    elif financials.dscr >= 1.1:
        score += 15
        concerns.append(f"Tight debt coverage (DSCR: {financials.dscr}x); operating cashflow has narrow cushion for unexpected delays.")
    else:
        score += 5
        concerns.append(f"High repayment burden (DSCR: {financials.dscr}x below standard 1.25x benchmark).")

    # 4. Operational Risk & Capital Suitability (Max 20 pts)
    if financials.available_margin_capital >= 50000:
        score += 20
        positives.append(f"Margin capital of ₹{financials.available_margin_capital:,.0f} qualifies for full 90% concessional financing under {financials.selected_scheme_name}.")
    else:
        score += 14
        advice.append("Leverage micro-finance subsidy schemes to minimize external debt exposure.")

    # Cap score
    viability_score = max(10, min(100, score))

    # Bank Readiness Score
    bankable_readiness = min(98, int(viability_score * 0.95 + (5 if financials.dscr >= 1.5 else 0)))

    # Determine Verdict
    if viability_score >= 75:
        verdict = "GO"
        headline = "🟢 HIGHLY RECOMMENDED — Strong Market & Financial Viability"
        advice.append("Proceed with loan application submission under MoSJE scheme channel.")
        advice.append("Utilize the initial moratorium period exclusively for setting up customer supply linkages.")
    elif viability_score >= 50:
        verdict = "CAUTION"
        headline = "🟡 PROCEED WITH CAUTION — Opportunity with Specific Mitigation Required"
        advice.append("Implement suggested value-addition opportunities to stand out from existing competitors.")
        advice.append("Keep strict control over customer credit (udhaar) to protect working capital liquidity.")
    else:
        verdict = "NO_GO"
        headline = "🔴 NOT RECOMMENDED UNDER CURRENT PARAMETERS — High Saturation / Financial Risk"
        advice.append("Consider pivoting to an underserved neighboring village or alternative micro-enterprise category.")
        advice.append("Increase equity margin contribution or select a smaller micro-finance project cost.")

    return FeasibilityVerdict(
        verdict=verdict,
        viability_score=viability_score,
        headline=headline,
        key_positives=positives,
        key_concerns=concerns,
        critical_advice=advice,
        bankable_readiness_score=bankable_readiness
    )
