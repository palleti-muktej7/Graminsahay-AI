-- ====================================================================
-- GraminSahay AI (SIH26091) — Supabase PostgreSQL Database Schema
-- Ministry of Social Justice and Empowerment (MoSJE)
-- ====================================================================

-- 1. Enable PostGIS extension for Hyper-Local Spatial Queries (Optional but recommended)
CREATE EXTENSION IF NOT EXISTS postgis;

-- 2. Create Users Table (Can sync with Supabase auth.users or standalone)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    phone TEXT,
    email TEXT,
    role TEXT DEFAULT 'entrepreneur' CHECK (role IN ('entrepreneur', 'csc_vle', 'bank_officer', 'admin')),
    social_category TEXT DEFAULT 'OBC' CHECK (social_category IN ('SC', 'ST', 'OBC', 'General', 'Minority')),
    preferred_language TEXT DEFAULT 'en',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Business Proposals / Feasibility Evaluations Table
CREATE TABLE IF NOT EXISTS public.business_proposals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    business_id TEXT NOT NULL,
    business_name TEXT NOT NULL,
    village TEXT NOT NULL,
    block TEXT,
    district TEXT NOT NULL,
    state TEXT NOT NULL,
    pincode TEXT,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    catchment_radius_km DOUBLE PRECISION DEFAULT 10.0,
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
    viability_verdict TEXT NOT NULL CHECK (verdict IN ('GO', 'CAUTION', 'NO_GO')),
    viability_score INT NOT NULL,
    bankable_readiness_score INT NOT NULL,
    raw_response_json JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_proposals ENABLE ROW LEVEL SECURITY;

-- 5. RLS Policies: Allow users to view and manage their own proposals
CREATE POLICY "Users can view own profile" 
    ON public.profiles FOR SELECT 
    USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can insert own profile" 
    ON public.profiles FOR INSERT 
    WITH CHECK (true);

CREATE POLICY "Users can view own proposals" 
    ON public.business_proposals FOR SELECT 
    USING (true);

CREATE POLICY "Users can insert proposals" 
    ON public.business_proposals FOR INSERT 
    WITH CHECK (true);

-- 6. Spatial Index on Village Coordinates
CREATE INDEX IF NOT EXISTS idx_proposals_lat_lon ON public.business_proposals (latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_proposals_district ON public.business_proposals (district);
