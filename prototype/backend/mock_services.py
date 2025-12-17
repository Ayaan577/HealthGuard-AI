import random
import time
from geopy.geocoders import Nominatim
from geopy.exc import GeocoderTimedOut

# Initialize Geocoder
geolocator = Nominatim(user_agent="healthguard_ai_prototype")

def validate_nmc_registration_simulated(reg_no: str, name: str) -> dict:
    """
    Simulates a check against the National Medical Commission (NMC) / ABDM HPR.
    Returns a schema compliant with ABDM standards.
    """
    time.sleep(1.2) # Simulate API latency
    
    reg_clean = reg_no.strip().upper()
    
    # Mock Database Logic
    if reg_clean.startswith("NMC") or reg_clean.startswith("MCI"):
        return {
            "status": "active", # ABDM uses 'active', 'inactive'
            "hpr_id": f"IN-NMC-{random.randint(10000,99999)}",
            "name": name,
            "registration_number": reg_clean,
            "council": "National Medical Commission",
            "qualifications": ["MBBS", "MD"],
            "college": "All India Institute of Medical Sciences (AIIMS), New Delhi",
            "verification_status": "VERIFIED",
            "trust_score_impact": 100
        }
    elif reg_clean.startswith("EXP"):
        return {
            "status": "inactive",
            "hpr_id": f"IN-NMC-{random.randint(10000,99999)}",
            "name": name,
            "registration_number": reg_clean,
            "council": "Maharashtra Medical Council",
            "qualifications": ["MBBS"],
            "verification_status": "SUSPENDED",
            "remarks": "Registration Expired on 31-Dec-2022",
            "trust_score_impact": 0 # Heavy penalty
        }
    else:
        return {
            "status": "not_found",
            "verification_status": "NOT_FOUND",
            "message": "No record found in NMC/HPR registry.",
            "trust_score_impact": 0
        }

def validate_location_real(address: str, hospital_name: str) -> dict:
    """
    Uses OpenStreetMap (Nominatim) to verify if the address exists.
    """
    try:
        location = geolocator.geocode(address, timeout=10)
        
        if location:
            return {
                "status": "verified",
                "formatted_address": location.address,
                "coordinates": {
                    "lat": location.latitude,
                    "lng": location.longitude
                },
                "match_type": "EXACT",
                "trust_score_impact": 100
            }
        else:
            return {
                "status": "unverified",
                "message": "Address could not be resolved to a physical location.",
                "trust_score_impact": 40
            }
            
    except Exception as e:
        return {
            "status": "error",
            "message": f"Geocoding service unavailable: {str(e)}",
            "trust_score_impact": 50
        }
