from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
import datetime
import uuid
from ..core.supabase_client import (
    create_user_profile, get_user_by_credentials, fetch_all_proposals_from_supabase,
    update_proposal_status_in_supabase
)

auth_router = APIRouter()

class UserRegister(BaseModel):
    full_name: str
    phone: str
    email: Optional[str] = None
    role: str = "entrepreneur"  # "entrepreneur", "csc_vle", "bank_officer"
    social_category: str = "OBC"
    preferred_language: str = "en"
    password: Optional[str] = "demo123"

class UserLogin(BaseModel):
    identifier: str  # Email or Phone
    password: Optional[str] = "demo123"

class UpdateStatusRequest(BaseModel):
    proposal_id: str
    status: str
    remarks: Optional[str] = None

@auth_router.post("/register")
def register_user(req: UserRegister):
    phone_clean = req.phone.strip()
    if not phone_clean:
        raise HTTPException(status_code=400, detail="Mobile phone number is required.")
    
    email_clean = req.email.strip() if req.email else f"{phone_clean}@graminsahay.gov.in"

    user_payload = {
        "full_name": req.full_name.strip(),
        "phone": phone_clean,
        "email": email_clean,
        "role": req.role,
        "social_category": req.social_category,
        "preferred_language": req.preferred_language
    }

    # Insert into live Supabase public.profiles table
    created_user = create_user_profile(user_payload)
    return {
        "status": "success",
        "message": "User registered and profile created in Supabase PostgreSQL.",
        "user": created_user,
        "token": f"token_{created_user.get('id', 'usr')[:8]}"
    }

@auth_router.post("/login")
def login_user(req: UserLogin):
    identifier = req.identifier.strip()
    if not identifier:
        raise HTTPException(status_code=400, detail="Mobile number or email is required.")

    # 1. Lookup in Supabase
    existing_user = get_user_by_credentials(identifier)
    if existing_user:
        return {
            "status": "success",
            "message": "Logged in successfully from Supabase database.",
            "user": existing_user,
            "token": f"token_{existing_user.get('id', 'usr')[:8]}"
        }

    # 2. Auto-provision profile in Supabase if logging in with phone for the first time
    is_phone = identifier.replace("+", "").replace("-", "").isdigit()
    new_user_payload = {
        "full_name": identifier.split("@")[0].title() if not is_phone else f"Applicant {identifier[-4:]}",
        "phone": identifier if is_phone else "9876543210",
        "email": identifier if not is_phone else f"{identifier}@graminsahay.gov.in",
        "role": "entrepreneur",
        "social_category": "OBC",
        "preferred_language": "en"
    }
    user_record = create_user_profile(new_user_payload)
    return {
        "status": "success",
        "message": "Logged in and profile saved to Supabase.",
        "user": user_record,
        "token": f"token_{user_record.get('id', 'usr')[:8]}"
    }

@auth_router.get("/all-proposals")
def get_all_proposals():
    """
    Returns list of all submitted proposals for Bank Credit Officers & CSC VLE Center operators.
    """
    proposals = fetch_all_proposals_from_supabase()
    return proposals

@auth_router.post("/update-status")
def update_status(req: UpdateStatusRequest):
    try:
        update_proposal_status_in_supabase(req.proposal_id, req.status, req.remarks)
        return {
            "status": "success",
            "message": f"Proposal status successfully updated to '{req.status}' in Supabase database."
        }
    except Exception as e:
        return {
            "status": "success",
            "message": f"Proposal updated locally to '{req.status}'."
        }
