import json
import os
from typing import Dict, Any, List, Optional
from ..models.schemas import FinancialAnalysis, RepaymentScheduleMonth, YearlyAmortizationSummary

DATA_DIR = os.path.join(os.path.dirname(__file__), "..", "data")

def load_schemes() -> List[Dict[str, Any]]:
    path = os.path.join(DATA_DIR, "schemes.json")
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)

def load_business_profiles() -> List[Dict[str, Any]]:
    path = os.path.join(DATA_DIR, "business_profiles.json")
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)

def calculate_financials(
    available_margin: float,
    business_id: str,
    margin_percentage: float = 10.0,
    scheme_override_id: Optional[str] = None
) -> FinancialAnalysis:
    """
    Deterministic calculation of Project Cost, Loan Component, MoSJE Scheme routing,
    Moratorium interest, EMI, and Cashflow DSCR.
    """
    schemes = load_schemes()
    businesses = load_business_profiles()
    business = next((b for b in businesses if b["id"] == business_id), businesses[0])

    # 1. Total Project Cost calculation based on Beneficiary Contribution (typically 10%)
    # Total Project Cost = Available Margin / (margin_percentage / 100)
    margin_ratio = max(0.05, min(0.50, margin_percentage / 100.0))
    total_project_cost = round(available_margin / margin_ratio, 2)
    loan_amount = round(total_project_cost - available_margin, 2)

    # 2. Capital vs Working Capital split based on domain profile
    cap_split = business.get("capital_asset_split", 0.70)
    capital_asset_component = round(total_project_cost * cap_split, 2)
    working_capital_component = round(total_project_cost * (1.0 - cap_split), 2)

    # 3. Scheme Auto-Selection
    # Scheme A (Micro Finance) <= 1.40 Lakhs; Scheme B (Term Loan) > 1.40 Lakhs and <= 50 Lakhs
    matched_scheme = None
    if scheme_override_id:
        matched_scheme = next((s for s in schemes if s["id"] == scheme_override_id), None)
    
    if not matched_scheme:
        if total_project_cost <= 140000:
            matched_scheme = next((s for s in schemes if s["id"] == "mosje_micro_finance"), schemes[0])
        else:
            matched_scheme = next((s for s in schemes if s["id"] == "mosje_term_loan"), schemes[1])

    interest_rate_pct = matched_scheme["interest_rate_pct"]
    tenure_years = matched_scheme["tenure_years"]
    tenure_months = matched_scheme["tenure_months"]
    moratorium_months = matched_scheme["moratorium_months"]

    # 4. Amortization & Moratorium Schedule Calculation
    # Monthly interest rate
    r = (interest_rate_pct / 100.0) / 12.0
    
    # Moratorium interest (Simple monthly interest servicing)
    moratorium_monthly_interest = round(loan_amount * r, 2)
    
    # Active repayment months after moratorium
    active_months = max(1, tenure_months - moratorium_months)
    
    # Standard reducing balance EMI formula: P * r * (1+r)^n / ((1+r)^n - 1)
    if r > 0:
        factor = (1.0 + r) ** active_months
        regular_monthly_emi = round(loan_amount * (r * factor) / (factor - 1.0), 2)
    else:
        regular_monthly_emi = round(loan_amount / active_months, 2)

    # Generate full monthly schedule
    schedule: List[RepaymentScheduleMonth] = []
    balance = loan_amount
    total_interest_payable = 0.0

    for m in range(1, tenure_months + 1):
        if m <= moratorium_months:
            interest = round(balance * r, 2)
            principal = 0.0
            total_commitment = interest
            total_interest_payable += interest
            schedule.append(RepaymentScheduleMonth(
                month=m,
                is_moratorium=True,
                opening_balance=round(balance, 2),
                interest_payable=interest,
                principal_payable=principal,
                total_monthly_commitment=round(total_commitment, 2),
                closing_balance=round(balance, 2)
            ))
        else:
            interest = round(balance * r, 2)
            # If last month, balance off
            if m == tenure_months:
                principal = round(balance, 2)
                total_commitment = round(principal + interest, 2)
                balance = 0.0
            else:
                principal = round(min(balance, regular_monthly_emi - interest), 2)
                total_commitment = round(principal + interest, 2)
                balance = max(0.0, balance - principal)
            
            total_interest_payable += interest
            schedule.append(RepaymentScheduleMonth(
                month=m,
                is_moratorium=False,
                opening_balance=round(balance + principal, 2),
                interest_payable=interest,
                principal_payable=principal,
                total_monthly_commitment=round(total_commitment, 2),
                closing_balance=round(balance, 2)
            ))

    total_repayment_amount = round(loan_amount + total_interest_payable, 2)

    # Generate Yearly Summaries
    yearly_summaries: List[YearlyAmortizationSummary] = []
    for y in range(1, tenure_years + 1):
        start_idx = (y - 1) * 12
        end_idx = min(len(schedule), y * 12)
        year_slice = schedule[start_idx:end_idx]
        if not year_slice:
            break
        y_principal = round(sum(item.principal_payable for item in year_slice), 2)
        y_interest = round(sum(item.interest_payable for item in year_slice), 2)
        y_total = round(sum(item.total_monthly_commitment for item in year_slice), 2)
        y_closing = year_slice[-1].closing_balance
        yearly_summaries.append(YearlyAmortizationSummary(
            year=y,
            principal_repaid=y_principal,
            interest_paid=y_interest,
            total_payment=y_total,
            closing_balance=y_closing
        ))

    # 5. Projected Monthly Revenue, Expenses, & DSCR calculation
    # Typical turnover estimation based on project cost and domain margins
    margin_pct = business.get("typical_margin_pct", 20.0) / 100.0
    # Monthly revenue estimate proportional to project size
    monthly_projected_revenue = round(total_project_cost * 0.28, 2)
    monthly_operating_expenses = round(monthly_projected_revenue * (1.0 - margin_pct), 2)
    monthly_net_cashflow_before_emi = round(monthly_projected_revenue - monthly_operating_expenses, 2)

    # Debt Service Coverage Ratio (DSCR) = Net Cashflow / Regular EMI
    if regular_monthly_emi > 0:
        dscr = round(monthly_net_cashflow_before_emi / regular_monthly_emi, 2)
    else:
        dscr = 2.5

    return FinancialAnalysis(
        available_margin_capital=round(available_margin, 2),
        margin_percentage=margin_percentage,
        total_project_cost=total_project_cost,
        loan_amount=loan_amount,
        capital_asset_component=capital_asset_component,
        working_capital_component=working_capital_component,
        selected_scheme_id=matched_scheme["id"],
        selected_scheme_name=matched_scheme["name"],
        nodal_agency=matched_scheme["nodal_agency"],
        interest_rate_pct=interest_rate_pct,
        tenure_years=tenure_years,
        tenure_months=tenure_months,
        moratorium_months=moratorium_months,
        moratorium_monthly_interest=moratorium_monthly_interest,
        regular_monthly_emi=regular_monthly_emi,
        total_interest_payable=round(total_interest_payable, 2),
        total_repayment_amount=total_repayment_amount,
        monthly_projected_revenue=monthly_projected_revenue,
        monthly_operating_expenses=monthly_operating_expenses,
        monthly_net_cashflow_before_emi=monthly_net_cashflow_before_emi,
        dscr=dscr,
        repayment_schedule_preview=schedule[:12],  # Preview first 12 months
        yearly_summaries=yearly_summaries
    )
