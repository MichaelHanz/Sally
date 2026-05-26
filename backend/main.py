import uuid
import asyncio, json, os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from backend.agent.orchestrator import run_agent
from fastapi.responses import FileResponse
from backend.output.quote_generator import generate_professional_pdf
from backend.tools import calculate_shipping, calculate_tax

USE_REAL_AI = True

# Load catalog for weight mapping
def load_catalog_weights():
    catalog_path = os.path.join(os.path.dirname(__file__), "data", "mock_catalog.json")
    try:
        with open(catalog_path, "r") as f:
            catalog = json.load(f)
        return {item["name"].lower(): item.get("weightKg", 0) for item in catalog}
    except Exception as e:
        print(f"Error loading catalog weights: {e}")
        return {}

CATALOG_WEIGHTS = load_catalog_weights()

def get_weight(item_name: str) -> float:
    return CATALOG_WEIGHTS.get(item_name.lower(), 0.0)

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
    # Setup directory: ensures folder exists before we write to it
    base_output_dir = os.path.join(os.path.dirname(__file__), "output", "generated")
    os.makedirs(base_output_dir, exist_ok=True)

    if not USE_REAL_AI:
        # Mock Data logic
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
                    "specification": "Synchronous-tilt recline",
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
            "agent_reasoning": "Demo proposal.",
        }

        pdf_filename = f"proposal_{mock_data['proposal_id']}.pdf"
        output_path = os.path.join(base_output_dir, pdf_filename)

        generate_professional_pdf(mock_data, output_path)
        mock_data["pdf_url"] = f"/api/outputs/{pdf_filename}"
        return {"proposal": mock_data}

    try:
        # Real AI Logic
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

        # Recalculate deterministic figures over the LLM-selected items
        bom = proposal.get("bill_of_materials", [])
        subtotal = sum(item.get("unit_price", 0.0) * item.get("qty", 0) for item in bom)
        for item in bom:
            item["total"] = item.get("unit_price", 0.0) * item.get("qty", 0)

        total_weight = sum(get_weight(item.get("item", "")) * item.get("qty", 0) for item in bom)

        shipping = calculate_shipping(total_weight)
        tax_details = calculate_tax(subtotal, proposal.get("delivery_location", payload.delivery_location))

        if "financial_summary" not in proposal:
            proposal["financial_summary"] = {}

        # Overwrite LLM values to guarantee perfect mathematical accuracy
        proposal["financial_summary"]["subtotal"] = subtotal
        proposal["financial_summary"]["shipping_easyparcel"] = shipping
        proposal["financial_summary"]["tax_amount"] = tax_details["tax_amount"]
        proposal["financial_summary"]["grand_total"] = round(subtotal + shipping + tax_details["tax_amount"], 2)

        # Generate unique filename
        unique_id = proposal.get("proposal_id", uuid.uuid4().hex[:6])
        pdf_filename = f"proposal_{unique_id}.pdf"
        output_path = os.path.join(base_output_dir, pdf_filename)

        # Generate the PDF using your new professional function
        generate_professional_pdf(proposal, output_path)

        # Attach link for the frontend
        proposal["pdf_url"] = f"/api/outputs/{pdf_filename}"

        return {"proposal": proposal}

    except Exception as e:
        print(f"CRITICAL ERROR in AI Agent: {e}")
        return {"error": str(e)}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="127.0.0.1", port=8000)
