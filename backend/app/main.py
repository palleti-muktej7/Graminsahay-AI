from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .api.router import router

app = FastAPI(
    title="GraminSahay AI API",
    description="Hyper-Local Business Advisory & Financial Structuring Platform for Rural Micro-Entrepreneurs (MoSJE / SIH26091)",
    version="1.0.0"
)

# Enable CORS for React Frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router, prefix="/api")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
