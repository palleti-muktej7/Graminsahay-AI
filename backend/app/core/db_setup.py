"""
GraminSahay AI - Automated Supabase PostgreSQL Database Setup
Run this script to automatically create all tables in your Supabase database!
"""

import os
import sys

def setup_database(db_url: str):
    try:
        import psycopg2
    except ImportError:
        print("Installing psycopg2-binary for database connection...")
        os.system(f"{sys.executable} -m pip install psycopg2-binary")
        import psycopg2

    print(f"Connecting to Supabase PostgreSQL...")
    conn = psycopg2.connect(db_url)
    conn.autocommit = True
    cursor = conn.cursor()

    sql_commands = """
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

    ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
    ALTER TABLE public.business_proposals ENABLE ROW LEVEL SECURITY;

    DO $$
    BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public read profiles') THEN
            CREATE POLICY "Allow public read profiles" ON public.profiles FOR SELECT USING (true);
        END IF;
        IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public insert profiles') THEN
            CREATE POLICY "Allow public insert profiles" ON public.profiles FOR INSERT WITH CHECK (true);
        END IF;
        IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public read proposals') THEN
            CREATE POLICY "Allow public read proposals" ON public.business_proposals FOR SELECT USING (true);
        END IF;
        IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public insert proposals') THEN
            CREATE POLICY "Allow public insert proposals" ON public.business_proposals FOR INSERT WITH CHECK (true);
        END IF;
    END
    $$;
    """

    print("Executing table creation queries...")
    cursor.execute(sql_commands)
    print("SUCCESS: Tables `profiles` and `business_proposals` created successfully in Supabase PostgreSQL!")
    cursor.close()
    conn.close()

if __name__ == "__main__":
    if len(sys.argv) > 1:
        url = sys.argv[1]
    else:
        url = input("Enter your Supabase PostgreSQL Connection URI (postgresql://postgres:...): ").strip()
    
    if url:
        setup_database(url)
    else:
        print("No database URL provided.")
