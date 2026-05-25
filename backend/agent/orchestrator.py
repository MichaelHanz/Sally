import os
import json

# pyrefly: ignore [missing-import]
from groq import Groq

# pyrefly: ignore [missing-import]
from dotenv import load_dotenv

load_dotenv()

# Initialize the Free Groq Client
client = Groq(api_key=os.getenv("GROQ_API_KEY"))


def run_agent(brief, vertical, client_name, budget_limit, delivery_location, currency):

    with open(
        os.path.join(os.path.dirname(__file__), "prompts", "system_prompt.txt"), "r"
    ) as f:
        system_instructions = f.read()

    user_prompt = f"""
    Create a proposal for {client_name}. 
    Brief: {brief}
    Vertical: {vertical}
    Budget: {budget_limit}
    Location: {delivery_location}
    Currency: {currency}
    
    YOU MUST RETURN STRICTLY VALID JSON MATCHING THIS EXACT SCHEMA:
    {{
        "proposal_id": "GENERATE-A-UNIQUE-ID",
        "project_title": "A descriptive title",
        "client_name": "{client_name}",
        "bill_of_materials": [
            {{
                "item": "Item Name",
                "specification": "Technical specs",
                "qty": 1,
                "unit_price": 100.00,
                "total": 100.00
            }}
        ],
        "financial_summary": {{
            "subtotal": 0.00,
            "shipping_easyparcel": 15.00,
            "tax_amount": 0.00,
            "grand_total": 0.00,
            "currency": "{currency}"
        }},
        "agent_reasoning": "Explain how you stayed under budget here."
    }}
    """

    # Agents using Groq/OpenAI use a list of messages instead of a chat object
    messages = [
        {"role": "system", "content": system_instructions},
        {"role": "user", "content": user_prompt},
    ]

    print("--- Starting Agent Execution (Powered by Groq) ---")

    response_text = ""

    # ==========================================
    # THE AGENTIC REFLEXIVE LOOP
    # ==========================================
    MAX_RETRIES = 4

    for attempt in range(MAX_RETRIES):
        try:
            # 1. Call the fast Llama 3 model
            completion = client.chat.completions.create(
                model="llama-3.1-8b-instant", messages=messages, temperature=0.2
            )
            response_text = completion.choices[0].message.content

            # Clean and parse the JSON
            clean_text = response_text.replace("```json", "").replace("```", "").strip()
            proposal_draft = json.loads(clean_text)

            # 2. The Supervisor critiques the budget constraint
            grand_total = proposal_draft.get("financial_summary", {}).get(
                "grand_total", float("inf")
            )

            if grand_total > budget_limit:
                print(
                    f"[Agentic Loop] Attempt {attempt + 1}: Over budget (${grand_total} > ${budget_limit}). Forcing AI to revise..."
                )

                # Append the AI's mistake and your harsh critique to the message history
                messages.append({"role": "assistant", "content": response_text})
                messages.append(
                    {
                        "role": "user",
                        "content": f"CRITIQUE: Your proposal's grand total is {grand_total}, which exceeds the strict budget of {budget_limit}. You MUST downgrade the items to cheaper alternatives from the catalog to stay under budget. Generate a new valid JSON proposal.",
                    }
                )
                continue

            # If we get here, the proposal is valid!
            print(
                f"[Agentic Loop] Attempt {attempt + 1}: Proposal passed all critical constraints."
            )
            return clean_text

        except json.JSONDecodeError:
            print(
                f"[Agentic Loop] Attempt {attempt + 1}: Invalid JSON. Forcing revision..."
            )
            messages.append({"role": "assistant", "content": response_text})
            messages.append(
                {
                    "role": "user",
                    "content": "CRITIQUE: That was not valid JSON. Return ONLY a JSON object. No markdown, no text.",
                }
            )
            continue

        except Exception as e:
            print(f"[Agentic Loop] Attempt {attempt + 1}: Unexpected error: {e}")
            break

    print("--- Agent Failed to Self-Correct ---")
    return response_text
