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
    competitor_density: str,
    lang: str = "en"
) -> SWOTItem:
    businesses = load_business_profiles()
    business = next((b for b in businesses if b["id"] == business_id), businesses[0])
    capital = entrepreneur.available_margin_capital
    village = location.village or "Melattur"
    district = location.district or "Thanjavur"
    exp = entrepreneur.prior_experience_years
    radius = location.radius_km or 10.0

    if lang == "te":
        strengths = [
            f"అందుబాటులో ఉన్న ₹{capital:,.0f} స్వంత మూలధనంతో 90% MoSJE ప్రభుత్వ రాయితీ రుణాన్ని పొందే పూర్తి అర్హత ఉంది.",
            f"{village} గ్రామ వినియోగదారులకు నేరుగా చేరువలో ఉండటం వల్ల రవాణా మరియు విక్రయ ఖర్చులు గణనీయంగా తగ్గుతాయి.",
            f"వ్యవస్థాపకుడికి {district} జిల్లాలో {exp} సంవత్సరాల స్థానిక క్షేత్రస్థాయి వ్యాపార అనుభవం ఉంది."
        ]
        weaknesses = [
            f"ప్రారంభ పెట్టుబడి (₹{capital:,.0f}) ప్రారంభ నెలల్లో భారీ స్వయంచాలక యంత్రాల ఏర్పాటుకు పరిమితంగా ఉంటుంది.",
            "గ్రామీణ ప్రాంతాల్లో అప్పు (ఉధార్) రికవరీ సమయానికి జరగకపోతే వర్కింగ్ క్యాపిటల్ ఇబ్బందులు తలెత్తే అవకాశం.",
            "శీతలీకరణ / నిల్వ గిడ్డంగుల కొరత వల్ల తాజా ఉత్పత్తులను ప్రతిరోజూ వెంటనే విక్రయించాల్సి ఉంటుంది."
        ]
        opportunities = [
            f"విలువ ఆధారిత ఉత్పత్తులకు అధిక డిమాండ్: పాల నుండి పెరుగు, పనీర్, నెయ్యి తయారీ ద్వారా 35% అధిక నికర లాభం.",
            f"{district} జిల్లాలోని స్థానిక హోటళ్ళు, టీ దుకాణాలు, పాఠశాలలతో నేరుగా సరఫరా ఒప్పందాలు.",
            "MoSJE / NBCFDC / NSFDC పథకాల కింద ప్రాధాన్యతా రంగానికి 6.5% - 8% తక్కువ వడ్డీతో ప్రభుత్వ రుణ సదుపాయం."
        ]
        threats = [
            f"{radius} కి.మీ పరిధిలో స్థానిక పోటీదారుల సాంద్రత '{competitor_density}' స్థాయిగా అంచనా వేయబడింది.",
            "వేసవి మరియు వర్షాకాలంలో పశుగ్రాసం, ముడిసరుకు ధరల హెచ్చుతగ్గుల ప్రభావం.",
            "వర్షాకాలంలో గ్రామీణ రవాణా రహదారుల ఇబ్బందులు మరియు కస్టమర్ల డిమాండ్‌లో హెచ్చుతగ్గులు."
        ]
    elif lang == "hi":
        strengths = [
            f"उपलब्ध ₹{capital:,.0f} स्वयं की पूंजी 90% MoSJE सरकारी रियायती ऋण के लिए पूर्णतः पात्र है।",
            f"{village} गाँव के उपभोक्ताओं के सीधे संपर्क से परिवहन एवं वितरण लागत न्यूनतम रहेगी।",
            f"उद्यमी को {district} क्षेत्र में {exp} वर्ष का व्यावहारिक स्थानीय व्यापार अनुभव प्राप्त है।"
        ]
        weaknesses = [
            f"प्रारंभिक पूंजी (₹{capital:,.0f}) शुरुआती महीनों में बड़ी मशीनों के उपयोग को सीमित करती है।",
            "स्थानीय उधारी (उधार) की समय पर वसूली न होने पर कार्यशील पूंजी पर दबाव आ सकता है।",
            "कोल्ड स्टोरेज की सीमित सुविधा के कारण दैनिक उत्पादन को तुरंत बेचना अनिवार्य है।"
        ]
        opportunities = [
            f"मूल्य-संवर्धित उत्पादों की भारी मांग: दही, पनीर, घी उत्पादन से 35% अधिक मुनाफा।",
            f"{district} के स्थानीय ढाबों, चाय दुकानों और साप्ताहिक हाट से सीधा आपूर्ति अनुबंध।",
            "MoSJE / NBCFDC / NSFDC के तहत 6.5%-8% रियायती ब्याज दर और प्राथमिकता ऋण सुविधा।"
        ]
        threats = [
            f"{radius} किमी के दायरे में स्थानीय प्रतिस्पर्धा स्तर '{competitor_density}' पाया गया।",
            "मौसम के अनुसार चारे एवं कच्चे माल की कीमतों में उतार-चढ़ाव का जोखिम।",
            "मानसून के दौरान ग्रामीण सड़कों पर आवागमन में बाधा और मांग में मौसमी बदलाव।"
        ]
    elif lang == "ta":
        strengths = [
            f"₹{capital:,.0f} சொந்த முதலீட்டின் மூலம் 90% அரசு MoSJE சலுகைக் கடன் பெற முழு தகுதி உள்ளது.",
            f"{village} நுகர்வோருடன் நேரடி தொடர்பு இருப்பதால் போக்குவரத்து மற்றும் விநியோக செலவுகள் குறைவு.",
            f"தொழில்முனைவோருக்கு {district} மாவட்டத்தில் {exp} வருட அனுபவம் உள்ளது."
        ]
        weaknesses = [
            f"தொடக்க மூலதனம் (₹{capital:,.0f}) ஆரம்பத்தில் பெரிய இயந்திரங்களை வாங்குவதை கட்டுப்படுத்துகிறது.",
            "உள்ளூர் கடன் பாக்கிகள் உடனுக்குடன் வசூலாகாவிட்டால் நடைமுறை மூலதன சுமை ஏற்படலாம்.",
            "குளிர்பதன சேமிப்பு வசதிகள் குறைவால் தினசரி உற்பத்தியை அன்றே விற்க வேண்டும்."
        ]
        opportunities = [
            "மதிப்புக் கூட்டப்பட்ட தயாரிப்புகள் (தயிர், பன்னீர், நெய்) மூலம் 35% கூடுதல் லாபம்.",
            f"{district} உள்ளூர் உணவகங்கள், தேநீர் கடைகளுடன் நேரடி விநியோக ஒப்பந்தம்.",
            "MoSJE / NBCFDC திட்டங்கள் மூலம் குறைந்த வட்டியில் (6.5% - 8%) கடனுதவி பெறும் வாய்ப்பு."
        ]
        threats = [
            f"{radius} கி.மீ சுற்றளவில் போட்டி அடர்த்தி '{competitor_density}' என மதிப்பிடப்பட்டுள்ளது.",
            "பருவகால மாறுபாடுகளால் தீவனம் மற்றும் மூலப்பொருள் விலை உயர்வு அபாயம்.",
            "மழைக் காலங்களில் போக்குவரத்து தாமதங்கள் மற்றும் விற்பனை மாற்றங்கள்."
        ]
    elif lang == "mr":
        strengths = [
            f"उपलब्ध ₹{capital:,.0f} स्वतःच्या भांडवलावर 90% MoSJE शासकीय सवलतीचे कर्ज मिळवण्याची पूर्ण पात्रता.",
            f"{village} गावातील ग्राहकांशी थेट संपर्क असल्याने वाहतूक व वितरण खर्च नगण्य राहील.",
            f"उद्योजकाला {district} परिसरात {exp} वर्षांचा स्थानिक व्यावसायिक अनुभव आहे."
        ]
        weaknesses = [
            f"सुरुवातीचे भांडवल (₹{capital:,.0f}) पहिल्या काही महिन्यांत मोठ्या यंत्रसामग्रीसाठी मर्यादित ठरते.",
            "उधारीची वेळेवर वसुली न झाल्यास दैनंदिन खेळत्या भांडवलावर ताण येण्याची शक्यता.",
            "शीतकरण साठवणुकीची मर्यादित सोय असल्याने दररोज उत्पादनाची तात्काळ विक्री करावी लागेल."
        ]
        opportunities = [
            "मूल्यवर्धन प्रक्रिया (दही, पनीर, तूप) करून 35% अधिक नफा मिळवण्याची संधी.",
            f"{district} परिसरातील स्थानिक हॉटेल्स, चहाची दुकाने व आठवडे बाजारांशी थेट पुरवठा करार.",
            "शासकीय योजनांतर्गत केवळ 6.5% - 8% अल्प व्याजदराचा लाभ."
        ]
        threats = [
            f"{radius} किमी परिसरात व्यावसायिक स्पर्धा पातळी '{competitor_density}' आहे.",
            "ऋतूनुसार चारा आणि कच्च्या मालाच्या किमतीतील चढ-उताराचे आव्हान.",
            "पावसाळ्यात ग्रामीण वाहतूक व्यवस्थेतील अडथळे."
        ]
    else:
        strengths = [
            f"Available self-equity of ₹{capital:,.0f} qualifies for 90% MoSJE concessional credit leverage.",
            f"Direct hyper-local proximity to consumers in {village} minimizes transit and distribution overheads.",
            f"Entrepreneur brings {exp} year(s) of local operational familiarity in {district}."
        ]
        weaknesses = [
            f"Initial margin capital (₹{capital:,.0f}) limits automated bulk processing in early launch months.",
            "Dependence on local spot credit (udhaar) if credit recovery cycles are not strictly enforced.",
            "Limited in-house cold-chain or storage buffer requiring rapid daily turnover."
        ]
        opportunities = [
            f"High demand for value-added products: Paneer and Ghee production (35-45% higher margin than raw produce).",
            f"B2B institutional supply linkages with local tea stalls, schools, and eateries in {district}.",
            "Government interest subvention and priority lending access through MoSJE/NBCFDC/NSFDC channels."
        ]
        threats = [
            f"Local competitor density assessed at '{competitor_density}' in {radius}km catchment.",
            f"Raw material & input cost fluctuations: Feed price volatility during dry summer seasons.",
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
        ]
    }
    return threat_map.get(business_id, threat_map["dairy_farming"])

def generate_pricing_recommendation(business_id: str) -> PricingRecommendation:
    prices = load_commodity_prices()
    comm = prices.get(business_id, prices.get("dairy_farming"))

    return PricingRecommendation(
        product_name=comm.get("commodity_name", "Raw Milk (Cow/Buffalo)"),
        regional_benchmark_price=comm.get("apmc_modal_price", 42.0),
        estimated_cost_price=comm.get("production_cost_benchmark", 28.0),
        suggested_selling_price=comm.get("retail_benchmark_price", 52.0),
        price_unit=comm.get("unit", "Litre"),
        pricing_strategy=comm.get("pricing_rule", "Cost-plus margin with 20% value-add premium"),
        value_add_suggestions=comm.get("value_add_multipliers", {"paneer": 1.45, "ghee": 1.60, "curd": 1.25}),
        confidence="HIGH",
        data_source="Agmarknet APMC Modal Prices + State Dairy Federation Mandates"
    )
