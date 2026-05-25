import asyncio, json, os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from backend.agent.orchestrator import run_agent
from fastapi.responses import FileResponse
from backend.output.quote_generator import generate_pdf

USE_REAL_AI = False

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Matches the payload your Workflows.tsx is sending
class BriefInput(BaseModel):
    brief: str = ""
    vertical: str = "Smart Workspace"
    client_name: str = "Acme Corp"
    budget_limit: int = 5000
    delivery_location: str = "Penang, Malaysia"
    currency: str = "USD"


@app.get("/api/outputs/{filename}")
async def get_output(filename: str):
    file_path = os.path.join(os.path.dirname(__file__), "output", "generated", filename)
    return FileResponse(file_path)


@app.post("/api/proposal")
async def generate_solution(payload: BriefInput):

    if not USE_REAL_AI:
        # Return this static response instantly, consuming 0 API quota
        mock_data = {
            "proposal_id": "DEMO-001",
            "project_title": "Minimalist High-Performance Smart Workspace",
            "client_name": payload.client_name,
            "bill_of_materials": [
                {
                    "item": "Standard Compact Standing Desk",
                    "specification": "Amber Bamboo top",
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
                "shipping_easyparcel": 15.00,
                "tax_amount": 75.92,
                "grand_total": 1039.92,
                "currency": payload.currency,
            },
            "agent_reasoning": "This is a pre-calculated demo proposal. The AI integration is ready to go.",
        }
        pdf_filename = generate_pdf(mock_data)
        mock_data["pdf_url"] = f"/api/outputs/{pdf_filename}"
        return {"proposal": mock_data}
    try:
        print(f"Received request for client: {payload.client_name}")  # DEBUG LOG

        # This prevents the server from hanging while waiting for the AI
        proposal_text = await asyncio.to_thread(
            run_agent,
            brief=payload.brief,
            vertical=payload.vertical,
            client_name=payload.client_name,
            budget_limit=payload.budget_limit,
            delivery_location=payload.delivery_location,
            currency=payload.currency,
        )

        proposal_json_str = (
            proposal_text.replace("```json", "").replace("```", "").strip()
        )
        proposal = json.loads(proposal_json_str)

        # ADD THIS: Generate PDF and attach the link for real AI
        pdf_filename = generate_pdf(proposal)
        proposal["pdf_url"] = f"/api/outputs/{pdf_filename}"

        return {"proposal": proposal}

    except Exception as e:
        print(f"CRITICAL ERROR in AI Agent: {e}")
        return {"error": str(e)}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="127.0.0.1", port=8000)
