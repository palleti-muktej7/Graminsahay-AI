from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

class LocationInput(BaseModel):
    state: str = Field(default="Tamil Nadu", description="State name")
    district: str = Field(default="Thanjavur", description="District name")
    block: Optional[str] = Field(default="Papanasam", description="Block / Taluk name")
    village: str = Field(default="Melattur", description="Village name")
    pincode: Optional[str] = Field(default="614205", description="6-digit pincode")
    latitude: Optional[float] = Field(default=10.7870, description="Latitude")
    longitude: Optional[float] = Field(default=79.1378, description="Longitude")
    radius_km: float = Field(default=10.0, ge=1.0, le=25.0, description="Market catchment radius in km")

class EntrepreneurProfile(BaseModel):
    full_name: str = Field(default="Ramesh Kumar", description="Entrepreneur full name")
    gender: Optional[str] = Field(default="Male", description="Gender")
    category: Optional[str] = Field(default="OBC", description="Social category (SC/ST/OBC/General)")
    prior_experience_years: int = Field(default=2, ge=0, description="Years of prior relevant experience")
    available_margin_capital: float = Field(default=100000.0, ge=5000.0, description="Available own margin money in INR")
    preferred_language: str = Field(default="en", description="Preferred language code (en, hi, ta, te, mr)")

class CompetitorItem(BaseModel):
    name: str
    business_type: str
    lat: float
    lon: float
    distance_km: float
    verified: bool
    source: str

class MarketReachAnalysis(BaseModel):
    catchment_radius_km: float
    estimated_population: int
    estimated_households: int
    potential_target_customers: int
    primary_channels: List[str]
    confidence: str
    data_source: str

class CompetitorAnalysis(BaseModel):
    competitor_count: int
    density_level: str  # "LOW", "MEDIUM", "HIGH"
    competitors_list: List[CompetitorItem]
    confidence: str
    data_source: str
    explanation: str

class SWOTItem(BaseModel):
    strengths: List[str]
    weaknesses: List[str]
    opportunities: List[str]
    threats: List[str]
    confidence: str
    data_source: str

class ThreatIdentification(BaseModel):
    threat_title: str
    cause: str
    impact: str
    mitigation_strategy: str

class PricingRecommendation(BaseModel):
    product_name: str
    regional_benchmark_price: float
    estimated_cost_price: float
    suggested_selling_price: float
    price_unit: str
    pricing_strategy: str
    value_add_suggestions: Dict[str, float]
    confidence: str
    data_source: str

class RepaymentScheduleMonth(BaseModel):
    month: int
    is_moratorium: bool
    opening_balance: float
    interest_payable: float
    principal_payable: float
    total_monthly_commitment: float
    closing_balance: float

class YearlyAmortizationSummary(BaseModel):
    year: int
    principal_repaid: float
    interest_paid: float
    total_payment: float
    closing_balance: float

class FinancialAnalysis(BaseModel):
    available_margin_capital: float
    margin_percentage: float
    total_project_cost: float
    loan_amount: float
    capital_asset_component: float
    working_capital_component: float
    selected_scheme_id: str
    selected_scheme_name: str
    nodal_agency: str
    interest_rate_pct: float
    tenure_years: int
    tenure_months: int
    moratorium_months: int
    moratorium_monthly_interest: float
    regular_monthly_emi: float
    total_interest_payable: float
    total_repayment_amount: float
    monthly_projected_revenue: float
    monthly_operating_expenses: float
    monthly_net_cashflow_before_emi: float
    dscr: float  # Debt Service Coverage Ratio
    repayment_schedule_preview: List[RepaymentScheduleMonth]
    yearly_summaries: List[YearlyAmortizationSummary]

class FeasibilityVerdict(BaseModel):
    verdict: str  # "GO", "CAUTION", "NO_GO"
    viability_score: int  # 0 to 100
    headline: str
    key_positives: List[str]
    key_concerns: List[str]
    critical_advice: List[str]
    bankable_readiness_score: int

class FullAdvisoryRequest(BaseModel):
    entrepreneur: EntrepreneurProfile
    location: LocationInput
    business_id: str
    custom_margin_capital: Optional[float] = None
    radius_km: Optional[float] = 10.0

class FullAdvisoryResponse(BaseModel):
    timestamp: str
    entrepreneur: EntrepreneurProfile
    location: LocationInput
    business_id: str
    business_name: str
    market_reach: MarketReachAnalysis
    competitors: CompetitorAnalysis
    swot: SWOTItem
    local_threats: List[ThreatIdentification]
    pricing: PricingRecommendation
    financials: FinancialAnalysis
    verdict: FeasibilityVerdict
