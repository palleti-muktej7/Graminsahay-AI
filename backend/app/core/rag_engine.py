import os
import json
from typing import Dict, Any, List, Tuple
from ..models.schemas import (
    EntrepreneurProfile, LocationInput, SWOTItem, ThreatIdentification, PricingRecommendation
)

DATA_DIR = os.path.join(os.path.dirname(__file__), "..", "data")

def load_business_profiles() -> List[Dict[str, Any]]:
    path = os.path.join(DATA_DIR, "business_profiles.json")
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)

def load_commodity_prices() -> Dict[str, Any]:
    path = os.path.join(DATA_DIR, "commodity_prices.json")
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)

def generate_swot_analysis(
    entrepreneur: EntrepreneurProfile,
    location: LocationInput,
    business_id: str,
    competitor_density: str
) -> SWOTItem:
    businesses = load_business_profiles()
    business = next((b for b in businesses if b["id"] == business_id), businesses[0])
    b_name = business["name"]
    capital = entrepreneur.available_margin_capital

    strengths = [
        f"Available self-equity of ₹{capital:,.0f} qualifies for 90% MoSJE concessional credit leverage.",
        f"Direct hyper-local proximity to consumers in {location.village} minimizes transit and distribution overheads.",
        f"Entrepreneur brings {entrepreneur.prior_experience_years} year(s) of local operational familiarity in {location.district}."
    ]

    weaknesses = [
        f"Initial margin capital (₹{capital:,.0f}) limits automated bulk processing in early launch months.",
        "Dependence on local spot credit (udhaar) if credit recovery cycles are not strictly enforced.",
        "Limited in-house cold-chain or storage buffer requiring rapid daily turnover."
    ]

    opportunities = [
        f"High demand for value-added products: {', '.join(business.get('value_add_opportunities', [])[:2])}.",
        f"B2B institutional supply linkages with local tea stalls, schools, and eateries in {location.district}.",
        "Government interest subvention and priority lending access through MoSJE/NBCFDC/NSFDC channels."
    ]

    threats = [
        f"Local competitor density assessed at '{competitor_density}' in {location.radius_km}km catchment.",
        f"Raw material & input cost fluctuations: {business.get('common_threats', ['Input price volatility'])[0]}.",
        "Seasonal demand variations during monsoon dips and festive peak cycles."
    ]

    return SWOTItem(
        strengths=strengths,
        weaknesses=weaknesses,
        opportunities=opportunities,
        threats=threats,
        confidence="HIGH",
        data_source="MoSJE Enterprise Knowledge Base & Local Demographics Synthesis"
    )

def generate_threat_identifications(business_id: str) -> List[ThreatIdentification]:
    businesses = load_business_profiles()
    business = next((b for b in businesses if b["id"] == business_id), businesses[0])
    
    threat_map = {
        "dairy_farming": [
            ThreatIdentification(
                threat_title="Cattle Feed & Dry Fodder Price Volatility",
                cause="Summer shortages and interstate green fodder transport costs.",
                impact="Escalates daily feeding cost per cattle by 15-25%, reducing monthly net profit margin.",
                mitigation_strategy="Establish silage storage bags during peak harvest; partner with local sugarcane/paddy farmers for bulk fodder contracts."
            ),
            ThreatIdentification(
                threat_title="Monopsony Dependence on Single Middleman",
                cause="Lack of chilling equipment forcing immediate sale to local private milk aggregator at depressed rates.",
                impact="Loss of ₹4-8 per litre in realization compared to retail or co-operative society prices.",
                mitigation_strategy="Diversify sales by direct morning delivery to 25 local households and tea stalls; convert evening unsold surplus into Paneer/Curd."
            ),
            ThreatIdentification(
                threat_title="Perishability & Power Outages",
                cause="Lack of continuous power supply in rural grid for refrigeration.",
                impact="Risk of milk souring or curdling during afternoon heat.",
                mitigation_strategy="Invest in insulated milk cans and solar-backed small chest freezer under capital subsidy component."
            )
        ],
        "poultry_farming": [
            ThreatIdentification(
                threat_title="Heat Wave Mortality & Disease Outbreaks",
                cause="Sudden seasonal temperature rise above 40°C in rural shed.",
                impact="Flock mortality exceeding standard 4% threshold, eroding working capital.",
                mitigation_strategy="Install thatch roof insulation, water foggers, and strictly adhere to timely Ranikhet/Gumboro vaccination schedules."
            ),
            ThreatIdentification(
                threat_title="Feed Concentrate Price Surge (Soybean / Maize)",
                cause="Wholesale commodity speculation and export surges.",
                impact="Feed accounts for 65% of broiler cost; sudden hike reduces farmer margins.",
                mitigation_strategy="Form small local purchasing co-op with neighboring poultry farmers for direct mill procurement."
            )
        ],
        "rural_kirana_retail": [
            ThreatIdentification(
                threat_title="Informal Village Credit (Udhaar) Default Risk",
                cause="Social pressure to extend unsecured consumption credit to known villagers.",
                impact="Working capital blockage leading to stock-outs of fast-moving items.",
                mitigation_strategy="Set hard ₹500 credit limit per household with digital ledger (Khata app) and offer 2% cash discount on instant payment."
            ),
            ThreatIdentification(
                threat_title="Direct Competition from Town Wholesalers",
                cause="Better transport connectivity enabling villagers to buy bulk groceries in weekly town markets.",
                impact="Loss of high-ticket grain and edible oil sales.",
                mitigation_strategy="Focus on instant convenience, micro-SKUs (₹5-10 sachets), and integrate Micro-ATM AePS cash withdrawal."
            )
        ],
        "tailoring_garments": [
            ThreatIdentification(
                threat_title="Off-Season Revenue Slump",
                cause="Demand concentrated in festival months (Diwali/Pongal/Eid) and wedding season.",
                impact="Cashflow drops by 50-60% during monsoon and non-festive quarters.",
                mitigation_strategy="Secure annual school uniform stitching contracts with local panchayat/private schools for steady off-season work."
            )
        ],
        "agro_processing_mill": [
            ThreatIdentification(
                threat_title="Three-Phase Rural Power Fluctuations",
                cause="Rural grid low voltage and unannounced load shedding.",
                impact="Motor burnout risks and delayed order fulfillment for village farmers.",
                mitigation_strategy="Install phase-reverser, heavy-duty surge stabilizer, and schedule batch processing during assured morning power windows."
            )
        ],
        "two_wheeler_workshop": [
            ThreatIdentification(
                threat_title="Counterfeit Spare Parts & Warranty Friction",
                cause="Cheap non-OEM parts causing vehicle breakdowns after repair.",
                impact="Reputation damage in close-knit village community.",
                mitigation_strategy="Procure directly from authorized state distributors and offer written 30-day workmanship guarantee."
            )
        ]
    }
    return threat_map.get(business_id, threat_map["dairy_farming"])

def generate_pricing_recommendation(business_id: str, location: LocationInput) -> PricingRecommendation:
    commodity_data = load_commodity_prices()
    data = commodity_data.get(business_id, commodity_data["dairy_farming"])
    
    product_name = data["product"]
    benchmark = data["benchmark_price_inr"]
    min_p = data["min_price_inr"]
    max_p = data["max_price_inr"]
    
    # Calculate estimated cost price (approx 70-75% of benchmark)
    estimated_cost = round(benchmark * 0.72, 2)
    # Recommend competitive introductory price slightly below max
    suggested_price = round(benchmark * 0.98, 2)

    return PricingRecommendation(
        product_name=product_name,
        regional_benchmark_price=benchmark,
        estimated_cost_price=estimated_cost,
        suggested_selling_price=suggested_price,
        price_unit="INR",
        pricing_strategy=data["recommended_pricing_strategy"],
        value_add_suggestions=data.get("value_add_benchmark", {}),
        confidence="HIGH",
        data_source=data.get("data_source", "Agmarknet Regional Price Monitoring")
    )
