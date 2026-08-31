@echo off
echo ========================================================
echo Starting GraminSahay AI Backend (FastAPI + MoSJE Engine)
echo Problem Statement: SIH26091
echo ========================================================
python -m uvicorn backend.app.main:app --host 0.0.0.0 --port 8000 --reload
pause
