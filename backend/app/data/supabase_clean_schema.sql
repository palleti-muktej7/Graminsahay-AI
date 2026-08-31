-- ====================================================================
-- GraminSahay AI (SIH26091) — Simplified Supabase SQL Script
-- Paste and Run this in Supabase SQL Editor
-- ====================================================================

-- 1. Create Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name TEXT NOT NULL,
    phone TEXT,
    email TEXT,
    role TEXT DEFAULT 'entrepreneur',
    social_category TEXT DEFAULT 'OBC',
    preferred_language TEXT DEFAULT 'en',
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Create Business Proposals Table
CREATE TABLE IF NOT EXISTS public.business_proposals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    applicant_name TEXT NOT NULL,
    business_id TEXT NOT NULL,
    business_name TEXT NOT NULL,
    village TEXT NOT NULL,
    block TEXT,
    district TEXT NOT NULL,
    state TEXT NOT NULL,
    pincode TEXT,
    latitude FLOAT8,
    longitude FLOAT8,
    catchment_radius_km FLOAT8 DEFAULT 10.0,
    available_margin_capital NUMERIC(12, 2) NOT NULL,
    total_project_cost NUMERIC(12, 2) NOT NULL,
    loan_amount NUMERIC(12, 2) NOT NULL,
    selected_scheme_id TEXT NOT NULL,
    selected_scheme_name TEXT NOT NULL,
    interest_rate_pct NUMERIC(4, 2) NOT NULL,
    tenure_years INT NOT NULL,
    moratorium_months INT NOT NULL,
    regular_monthly_emi NUMERIC(10, 2) NOT NULL,
    dscr NUMERIC(4, 2) NOT NULL,
    viability_verdict TEXT NOT NULL,
    viability_score INT NOT NULL,
    bankable_readiness_score INT NOT NULL,
    raw_response_json JSONB,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_proposals ENABLE ROW LEVEL SECURITY;

-- 4. Simple Public Read/Write Policies
CREATE POLICY "Allow public read profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Allow public insert profiles" ON public.profiles FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update profiles" ON public.profiles FOR UPDATE USING (true);

CREATE POLICY "Allow public read proposals" ON public.business_proposals FOR SELECT USING (true);
CREATE POLICY "Allow public insert proposals" ON public.business_proposals FOR INSERT WITH CHECK (true);

-- 5. Insert Sample Demo Record
INSERT INTO public.profiles (full_name, phone, email, role, social_category)
VALUES ('Ramesh Kumar', '9876543210', 'ramesh.kumar@gmail.com', 'entrepreneur', 'OBC')
ON CONFLICT DO NOTHING;
