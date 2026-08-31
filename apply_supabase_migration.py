import sys
import io

# Fix Windows stdout encoding
if sys.platform == "win32":
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

import psycopg2

DB_HOST = "db.nxbcxxzoavtgtkkkbual.supabase.co"
DB_PORT = 5432
DB_NAME = "postgres"
DB_USER = "postgres"
DB_PASS = "B!Y+QEa87AD^if^"

print(f"Connecting to Supabase PostgreSQL at {DB_HOST}...")

try:
    conn = psycopg2.connect(
        host=DB_HOST,
        port=DB_PORT,
        dbname=DB_NAME,
        user=DB_USER,
        password=DB_PASS,
        connect_timeout=15
    )
    conn.autocommit = True
    cursor = conn.cursor()
    print("Connection established successfully!")

    # 1. Profiles Table
    cursor.execute("""
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
    """)
    print("[PASS] Created table `profiles`")

    # 2. Business Proposals Table
    cursor.execute("""
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
    """)
    print("[PASS] Created table `business_proposals`")

    # 3. Enable RLS
    cursor.execute("""
    ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
    ALTER TABLE public.business_proposals ENABLE ROW LEVEL SECURITY;
    """)

    # 4. RLS Policies
    cursor.execute("""
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
    """)
    print("[PASS] Configured Row Level Security policies")

    # 5. Insert Sample Record
    cursor.execute("""
    INSERT INTO public.profiles (full_name, phone, email, role, social_category)
    VALUES ('Ramesh Kumar', '9876543210', 'ramesh.kumar@gmail.com', 'entrepreneur', 'OBC');
    """)
    print("[PASS] Inserted initial profile record")

    # 6. Verify Tables
    cursor.execute("""
    SELECT table_name FROM information_schema.tables 
    WHERE table_schema = 'public';
    """)
    tables = [row[0] for row in cursor.fetchall()]
    print(f"\n🎉 Verification Successful! Public Tables in Supabase: {tables}")

    cursor.close()
    conn.close()

except Exception as e:
    print(f"Error connecting to Supabase: {e}")
