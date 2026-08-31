import sys
import io

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

    # Add `status` column to public.business_proposals if not exists
    cursor.execute("""
    ALTER TABLE public.business_proposals 
    ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'PENDING';
    """)
    print("[PASS] Added `status` column to `public.business_proposals` table in Supabase!")

    # Verify column exists
    cursor.execute("""
    SELECT column_name, data_type 
    FROM information_schema.columns 
    WHERE table_name = 'business_proposals' AND column_name = 'status';
    """)
    res = cursor.fetchone()
    print(f"[PASS] Verified column in Supabase: {res}")

    cursor.close()
    conn.close()
except Exception as e:
    print(f"Error: {e}")
