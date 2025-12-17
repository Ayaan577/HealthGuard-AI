from typing import TypedDict, Annotated, List
from langgraph.graph import StateGraph, END
from mock_services import validate_nmc_registration_simulated, validate_location_real

class AgentState(TypedDict):
    provider_name: str
    reg_no: str
    address: str
    validation_results: List[dict]
    final_trust_score: float
    status: str

def check_registry(state: AgentState):
    print("--- CHECKING NMC REGISTRY (ABDM HPR) ---")
    result = validate_nmc_registration_simulated(state['reg_no'], state['provider_name'])
    result['source'] = "NMC Registry"
    return {"validation_results": [result]}

def check_location(state: AgentState):
    print("--- CHECKING LOCATION ---")
    result = validate_location_real(state['address'], state['provider_name'])
    result['source'] = "Geolocation"
    # Append to existing results is handled by reducer logic in functional LangGraph, 
    # but here we return a dict key that merges if using Annotated[list, add].
    # For simple state dict, we need to be careful. LangGraph basic returns update the state.
    # We will assume the caller handles accumulation or we adjust state definition.
    # Simplest for now: The state update merges keys.
    existing = state.get('validation_results', [])
    return {"validation_results": existing + [result]}

def calculate_score(state: AgentState):
    print("--- CALCULATING SCORE ---")
    results = state['validation_results']
    
    registry_score = 0
    location_score = 0
    registry_status = "UNKNOWN"
    
    # Extract specific scores
    for res in results:
        if res.get('source') == "NMC Registry":
            registry_score = res.get('trust_score_impact', 0)
            registry_status = res.get('verification_status', 'UNKNOWN')
        elif res.get('source') == "Geolocation":
            location_score = res.get('trust_score_impact', 0)
            
    # CRITICAL LOGIC: If Registry Validation Fails, Location doesn't matter.
    if registry_score == 0 or registry_status in ["NOT_FOUND", "SUSPENDED"]:
        final_score = 0
        final_status = "REJECTED"
        # Add a system note
        results.append({
            "source": "AI Risk Assessment",
            "status": "CRITICAL",
            "message": "Critical: NMC Registry Check Failed. Trust Score reset to 0."
        })
    else:
        # Weighted Average: Registry 70%, Location 30%
        final_score = (registry_score * 0.7) + (location_score * 0.3)
        final_status = "VERIFIED" if final_score >= 80 else "FLAGGED" if final_score >= 50 else "REJECTED"
    
    return {"final_trust_score": final_score, "status": final_status}

# Build the Graph
workflow = StateGraph(AgentState)

workflow.add_node("registry_check", check_registry)
workflow.add_node("location_check", check_location)
workflow.add_node("scorer", calculate_score)

workflow.set_entry_point("registry_check")
workflow.add_edge("registry_check", "location_check")
workflow.add_edge("location_check", "scorer")
workflow.add_edge("scorer", END)

validation_agent = workflow.compile()
