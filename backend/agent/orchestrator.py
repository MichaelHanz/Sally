import sys, os
import json

# pyrefly: ignore [missing-import]
import google.generativeai as genai

# pyrefly: ignore [missing-import]
from dotenv import load_dotenv
from backend.tools import (
    search_catalog,
    calculate_shipping,
    calculate_tax,
    validate_budget,
)

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Load API key
load_dotenv()
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))


def run_agent(brief, vertical, client_name, budget_limit, delivery_location, currency):
    tools = [search_catalog, calculate_shipping, calculate_tax, validate_budget]

    model = genai.GenerativeModel(model_name="gemini-2.0-flash", tools=tools)

    chat = model.start_chat(enable_automatic_function_calling=True)

    with open(
        os.path.join(os.path.dirname(__file__), "prompts", "system_prompt.txt"), "r"
    ) as f:
        system_instructions = f.read()

    user_prompt = f"""
    {system_instructions}
    Create a proposal for {client_name}. 
    Brief: {brief}
    Vertical: {vertical}
    Budget: {budget_limit}
    Location: {delivery_location}
    Currency: {currency}
    """

    print("--- Starting Agent Execution ---")
    response = chat.send_message(user_prompt)

    # ==========================================
    # THE AGENTIC REFLEXIVE LOOP (The "Brain")
    # ==========================================
    MAX_RETRIES = 2

    for attempt in range(MAX_RETRIES):
        try:
            # Clean the text to parse the JSON draft
            response_text = (
                response.text.replace("```json", "").replace("```", "").strip()
            )
            proposal_draft = json.loads(response_text)

            # 1. The Supervisor critiques the budget constraint
            grand_total = proposal_draft.get("financial_summary", {}).get(
                "grand_total", float("inf")
            )

            if grand_total > budget_limit:
                print(
                    f"[Agentic Loop] Attempt {attempt + 1}: Over budget (${grand_total} > ${budget_limit}). Forcing AI to revise..."
                )

                # We send feedback BACK to the AI to fix its own mistake
                feedback_prompt = f"CRITIQUE: Your proposal's grand total is {grand_total}, which exceeds the strict budget of {budget_limit}. You MUST downgrade the items to cheaper alternatives from the catalog to stay under budget. Generate a new valid JSON proposal."
                response = chat.send_message(feedback_prompt)
                continue  # Loop back around to evaluate the new draft

            # If we get here, the proposal is valid!
            print(
                f"[Agentic Loop] Attempt {attempt + 1}: Proposal passed all critical constraints."
            )
            return response_text

        except json.JSONDecodeError:
            # 2. The Supervisor critiques formatting errors
            print(
                f"[Agentic Loop] Attempt {attempt + 1}: Invalid JSON structure. Forcing AI to fix formatting..."
            )
            feedback_prompt = "CRITIQUE: Your last response was not valid JSON. You must return ONLY a strictly formatted JSON object matching the requested schema. No markdown, no conversational text."
            response = chat.send_message(feedback_prompt)
            continue

        except Exception as e:
            print(f"[Agentic Loop] Attempt {attempt + 1}: Unexpected error: {e}")
            break

    # Fallback if the agent fails all retries
    print("--- Agent Failed to Self-Correct ---")
    return response.text
