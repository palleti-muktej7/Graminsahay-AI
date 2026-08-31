import io
from typing import Dict, Any
from reportlab.lib.pagesizes import letter, A4
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether, HRFlowable
)
from ..models.schemas import FullAdvisoryResponse

def generate_dpr_pdf(data: FullAdvisoryResponse) -> bytes:
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(
        buffer,
        pagesize=A4,
        rightMargin=36,
        leftMargin=36,
        topMargin=36,
        bottomMargin=36
    )

    styles = getSampleStyleSheet()
    
    # Custom styles
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=18,
        leading=22,
        textColor=colors.HexColor('#0F172A'),
        alignment=1
    )
    
    sub_title_style = ParagraphStyle(
        'DocSubTitle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=10,
        leading=14,
        textColor=colors.HexColor('#475569'),
        alignment=1
    )
    
    h2_style = ParagraphStyle(
        'SectionH2',
        parent=styles['Heading2'],
        fontName='Helvetica-Bold',
        fontSize=12,
        leading=16,
        textColor=colors.HexColor('#1E293B'),
        spaceBefore=10,
        spaceAfter=6
    )

    body_style = ParagraphStyle(
        'BodyDark',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9,
        leading=13,
        textColor=colors.HexColor('#334155')
    )

    bold_label = ParagraphStyle(
        'BoldLabel',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=9,
        leading=13,
        textColor=colors.HexColor('#1E293B')
    )

    story = []

    # Title & Header
    story.append(Paragraph("DETAILED PROJECT REPORT (DPR) & BANKABLE PROPOSAL", title_style))
    story.append(Paragraph("Ministry of Social Justice & Empowerment (MoSJE) — Rural Micro-Enterprise Assistance", sub_title_style))
    story.append(Spacer(1, 8))
    story.append(HRFlowable(width="100%", thickness=1.5, color=colors.HexColor("#3B82F6"), spaceAfter=10))

    # 1. Project Summary Table
    fin = data.financials
    loc = data.location
    ent = data.entrepreneur
    vd = data.verdict

    summary_data = [
        [
            Paragraph("<b>Applicant Name:</b>", body_style), Paragraph(ent.full_name, body_style),
            Paragraph("<b>Proposed Enterprise:</b>", body_style), Paragraph(data.business_name, body_style)
        ],
        [
            Paragraph("<b>Target Location:</b>", body_style), Paragraph(f"{loc.village}, {loc.district}, {loc.state}", body_style),
            Paragraph("<b>Target Catchment:</b>", body_style), Paragraph(f"{loc.radius_km} km radius", body_style)
        ],
        [
            Paragraph("<b>Total Project Outlay:</b>", body_style), Paragraph(f"₹{fin.total_project_cost:,.2f}", bold_label),
            Paragraph("<b>Beneficiary Equity (10%):</b>", body_style), Paragraph(f"₹{fin.available_margin_capital:,.2f}", bold_label)
        ],
        [
            Paragraph("<b>Proposed Loan (90%):</b>", body_style), Paragraph(f"₹{fin.loan_amount:,.2f}", bold_label),
            Paragraph("<b>Matched MoSJE Scheme:</b>", body_style), Paragraph(fin.selected_scheme_name, body_style)
        ],
        [
            Paragraph("<b>Applicable Interest Rate:</b>", body_style), Paragraph(f"{fin.interest_rate_pct}% p.a.", body_style),
            Paragraph("<b>Tenure & Moratorium:</b>", body_style), Paragraph(f"{fin.tenure_years} Years ({fin.moratorium_months} Mo. Grace)", body_style)
        ],
        [
            Paragraph("<b>Regular Monthly EMI:</b>", body_style), Paragraph(f"₹{fin.regular_monthly_emi:,.2f}", bold_label),
            Paragraph("<b>Viability Verdict:</b>", body_style), Paragraph(f"<b>{vd.verdict}</b> (Score: {vd.viability_score}/100)", bold_label)
        ]
    ]

    t_summary = Table(summary_data, colWidths=[120, 140, 120, 140])
    t_summary.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor('#F8FAFC')),
        ('BOX', (0, 0), (-1, -1), 1, colors.HexColor('#CBD5E1')),
        ('INNERGRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#E2E8F0')),
        ('TOPPADDING', (0, 0), (-1, -1), 5),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
    ]))
    story.append(t_summary)
    story.append(Spacer(1, 10))

    # 2. Capital Expenditure & Working Capital Split
    story.append(Paragraph("1. FINANCIAL STRUCTURING & CAPITAL ALLOCATION", h2_style))
    capex_data = [
        [Paragraph("<b>Component</b>", bold_label), Paragraph("<b>Allocation (%)</b>", bold_label), Paragraph("<b>Amount (INR)</b>", bold_label), Paragraph("<b>Purpose / Asset Type</b>", bold_label)],
        [Paragraph("Capital Asset Creation", body_style), Paragraph(f"{fin.capital_asset_component/fin.total_project_cost*100:.0f}%", body_style), Paragraph(f"₹{fin.capital_asset_component:,.2f}", body_style), Paragraph("Machinery, Tools, Livestock/Civil Works", body_style)],
        [Paragraph("Working Capital Margin", body_style), Paragraph(f"{fin.working_capital_component/fin.total_project_cost*100:.0f}%", body_style), Paragraph(f"₹{fin.working_capital_component:,.2f}", body_style), Paragraph("Initial Raw Material, Feed & Operating Expenses", body_style)],
        [Paragraph("<b>Total Project Outlay</b>", bold_label), Paragraph("<b>100%</b>", bold_label), Paragraph(f"<b>₹{fin.total_project_cost:,.2f}</b>", bold_label), Paragraph("<b>Funded via 10% Equity + 90% Concessional Loan</b>", bold_label)]
    ]
    t_capex = Table(capex_data, colWidths=[130, 80, 110, 200])
    t_capex.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#EEF2F6')),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#CBD5E1')),
        ('TOPPADDING', (0, 0), (-1, -1), 4),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
    ]))
    story.append(t_capex)
    story.append(Spacer(1, 10))

    # 3. Market Catchment & Competitor Analysis
    story.append(Paragraph("2. HYPER-LOCAL MARKET FEASIBILITY & COMPETITOR MAPPING", h2_style))
    mr = data.market_reach
    comp = data.competitors
    mkt_text = f"""
    <b>Catchment Demographics:</b> Within the {mr.catchment_radius_km} km radius around {loc.village}, the estimated rural population is <b>{mr.estimated_population:,}</b> across approximately <b>{mr.estimated_households:,} households</b>. The target customer conversion potential is estimated at <b>{mr.potential_target_customers:,} active consumers</b>.<br/>
    <b>Competitor Density:</b> Spatial mapping identified <b>{comp.competitor_count} commercial units</b> (Density Rating: <b>{comp.density_level}</b>). <i>Data Source: {comp.data_source} (Confidence: {comp.confidence}).</i><br/>
    <b>Primary Sales Channels:</b> {', '.join(mr.primary_channels)}.
    """
    story.append(Paragraph(mkt_text, body_style))
    story.append(Spacer(1, 8))

    # 4. Pricing Strategy & Value Addition
    pr = data.pricing
    story.append(Paragraph("3. PRODUCT PRICING & VALUE-ADDITION BENCHMARKS", h2_style))
    pricing_text = f"""
    <b>Core Product:</b> {pr.product_name} | <b>Regional Reference Price:</b> ₹{pr.regional_benchmark_price:,.2f} | <b>Estimated Unit Cost:</b> ₹{pr.estimated_cost_price:,.2f}<br/>
    <b>Recommended Selling Price:</b> <b>₹{pr.suggested_selling_price:,.2f}</b> | <b>Strategy:</b> {pr.pricing_strategy}<br/>
    <b>Value Addition Margins:</b> {', '.join([f'{k}: ₹{v:,.0f}' for k, v in pr.value_add_suggestions.items()])}
    """
    story.append(Paragraph(pricing_text, body_style))
    story.append(Spacer(1, 8))

    # 5. SWOT Analysis Matrix
    story.append(Paragraph("4. TAILORED SWOT MATRIX & THREAT MITIGATIONS", h2_style))
    swot = data.swot
    swot_table_data = [
        [
            Paragraph("<b>STRENGTHS</b><br/>" + "<br/>• ".join([""] + swot.strengths), body_style),
            Paragraph("<b>WEAKNESSES</b><br/>" + "<br/>• ".join([""] + swot.weaknesses), body_style)
        ],
        [
            Paragraph("<b>OPPORTUNITIES</b><br/>" + "<br/>• ".join([""] + swot.opportunities), body_style),
            Paragraph("<b>THREATS & MITIGATIONS</b><br/>" + "<br/>• ".join([""] + swot.threats), body_style)
        ]
    ]
    t_swot = Table(swot_table_data, colWidths=[260, 260])
    t_swot.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (0, 0), colors.HexColor('#F0FDF4')),
        ('BACKGROUND', (1, 0), (1, 0), colors.HexColor('#FEF2F2')),
        ('BACKGROUND', (0, 1), (0, 1), colors.HexColor('#EFF6FF')),
        ('BACKGROUND', (1, 1), (1, 1), colors.HexColor('#FFFBEB')),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#CBD5E1')),
        ('TOPPADDING', (0, 0), (-1, -1), 6),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
    ]))
    story.append(t_swot)
    story.append(Spacer(1, 10))

    # 6. Repayment Roadmap & Yearly Amortization
    story.append(Paragraph("5. REPAYMENT ROADMAP & YEARLY AMORTIZATION (WITH MORATORIUM)", h2_style))
    amort_header = [
        Paragraph("<b>Year</b>", bold_label),
        Paragraph("<b>Principal Repaid</b>", bold_label),
        Paragraph("<b>Interest Paid</b>", bold_label),
        Paragraph("<b>Total Outflow</b>", bold_label),
        Paragraph("<b>Closing Balance</b>", bold_label)
    ]
    amort_rows = [amort_header]
    for y in fin.yearly_summaries:
        amort_rows.append([
            Paragraph(f"Year {y.year}", body_style),
            Paragraph(f"₹{y.principal_repaid:,.2f}", body_style),
            Paragraph(f"₹{y.interest_paid:,.2f}", body_style),
            Paragraph(f"₹{y.total_payment:,.2f}", body_style),
            Paragraph(f"₹{y.closing_balance:,.2f}", bold_label)
        ])
    t_amort = Table(amort_rows, colWidths=[60, 115, 115, 115, 115])
    t_amort.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#F1F5F9')),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#CBD5E1')),
        ('TOPPADDING', (0, 0), (-1, -1), 4),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
    ]))
    story.append(t_amort)
    story.append(Spacer(1, 8))

    # 7. Viability Verdict & Banker's Recommendation
    story.append(Paragraph("6. FEASIBILITY VERDICT & BANKING APPRAISAL", h2_style))
    verdict_text = f"""
    <b>Final Viability Decision:</b> <b>{vd.headline}</b> (Viability Score: <b>{vd.viability_score}/100</b>, Bankable Readiness: <b>{vd.bankable_readiness_score}%</b>)<br/>
    <b>Debt Service Coverage Ratio (DSCR):</b> <b>{fin.dscr}x</b> (Benchmark: >1.25x for rural term lending).<br/>
    <b>Appraisal Notes:</b><br/>
    • {"<br/>• ".join(vd.critical_advice)}
    """
    story.append(Paragraph(verdict_text, body_style))
    story.append(Spacer(1, 15))

    # Signatures Table
    sig_data = [
        [Paragraph("<b>Prepared by: GraminSahay AI Copilot</b>", body_style), Paragraph("<b>Signature of Applicant</b>", body_style), Paragraph("<b>Branch Credit Officer Verification</b>", body_style)]
    ]
    t_sig = Table(sig_data, colWidths=[180, 170, 170])
    t_sig.setStyle(TableStyle([
        ('TOPPADDING', (0, 0), (-1, -1), 20),
    ]))
    story.append(t_sig)

    doc.build(story)
    pdf_value = buffer.getvalue()
    buffer.close()
    return pdf_value
