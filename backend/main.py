import asyncio
import json
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel

app = FastAPI()

# 1. CORS Setup: Allow your Vite frontend to talk to this backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins for local dev
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Dummy Input Model
class BriefInput(BaseModel):
    brief: str = ""
    location: str = "Penang, Malaysia"
    budget: int = 5000


# 2. The SSE Generator Function
async def generate_mock_stream():
    # Simulate Agent Thinking Steps
    steps = [
        "Initializing secure parameters...",
        "Authenticating user payload via primary token...",
        "Searching catalog for matching infrastructure constraints...",
        "Validating power constraints against regional limits...",
        "Calculating EasyParcel shipping logistics for Penang...",
        "Generating proposal structure based on optimal specs...",
    ]

    for step in steps:
        # Yield status update to the frontend
        status_payload = {"type": "status", "message": step}
        yield f"data: {json.dumps(status_payload)}\n\n"
        await asyncio.sleep(1.2)  # Simulate processing time

    # 3. The Final JSON Output (Matches your types.ts Proposal interface)
    final_proposal = {
        "proposal_id": "PR-2026-9981",
        "project_title": "Minimalist High-Performance Smart Workspace",
        "vertical": "Smart Workspace",
        "client_name": "Hackathon Demo Client",
        "budget_limit": 5000,
        "delivery_location": "Penang, Malaysia",
        "bill_of_materials": [
            {
                "item": "Standard Compact Standing Desk",
                "specification": "Eco-friendly Amber Bamboo top (120x60cm)",
                "qty": 1,
                "unit_price": 499.00,
                "total": 499.00,
            },
            {
                "item": "Active Lumbar Task Chair",
                "specification": "Synchronous-tilt mechanical recline",
                "qty": 1,
                "unit_price": 450.00,
                "total": 450.00,
            },
        ],
        "financial_summary": {
            "subtotal": 949.00,
            "shipping_easyparcel": 85.00,
            "tax_amount": 75.92,
            "grand_total": 1109.92,
            "currency": "MYR",
            "exchange_rate": 1.0,
        },
        "agent_reasoning": "This minimalist configuration is specifically optimized for a compact 10x10ft room. The setup features a compact standing desk and ergonomic chair, fully consolidated with EasyParcel delivery to Penang, keeping the total well under the RM5,000 budget constraint.",
        "created_at": "2026-05-26",
        "status": "Approved",
    }

    # Yield the final result
    result_payload = {"type": "result", "data": final_proposal}
    yield f"data: {json.dumps(result_payload)}\n\n"


# 4. The Main Endpoint
# (Change the route to "/api/proposal" if your frontend is fetching that instead)
@app.post("/generate-solution")
async def generate_solution(payload: BriefInput):
    return StreamingResponse(generate_mock_stream(), media_type="text/event-stream")


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="127.0.0.1", port=8000)
