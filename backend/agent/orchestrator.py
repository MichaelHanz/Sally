import os
import json
import time

# pyrefly: ignore [missing-import]
from groq import Groq

# pyrefly: ignore [missing-import]
from dotenv import load_dotenv

# IMPORTANT: Import the tools from your tools.py file!
from backend.tools import calculate_shipping, calculate_tax, search_catalog

load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

# Define the tools exactly how Groq/OpenAI expects them
AGENT_TOOLS = [
    {
        "type": "function",
        "function": {
            "name": "calculate_shipping",
            "description": "Calculates shipping costs based on the total weight of the hardware.",
            "parameters": {
                "type": "object",
                "properties": {
                    "total_weight_kg": {
                        "type": "number",
                        "description": "Total weight of all items in kg.",
                    }
                },
                "required": ["total_weight_kg"],
            },
        },
    },
    {
        "type": "function",
        "function": {
            "name": "calculate_tax",
            "description": "Calculates the regional tax based on the delivery location.",
            "parameters": {
                "type": "object",
                "properties": {
                    "subtotal": {
                        "type": "number",
                        "description": "The total cost of all items.",
                    },
                    "delivery_location": {
                        "type": "string",
                        "description": "The delivery city or country (e.g., 'Penang', 'KL').",
                    },
                },
                "required": ["subtotal", "delivery_location"],
            },
        },
    },
    {
        "type": "function",
        "function": {
            "name": "search_catalog",
            "description": "Searches the database for hardware components or services matching the query.",
            "parameters": {
                "type": "object",
                "properties": {
                    "query": {
                        "type": "string",
                        "description": "The specific item to search for (e.g., 'ergonomic chair', 'RTX 4090').",
                    },
                    "vertical": {
                        "type": "string",
                        "description": "The specific industry vertical to filter by (e.g., 'Smart Workspace').",
                    },
                },
                "required": ["query"],
            },
        },
    },
]

# Map the string names to your actual Python functions
AVAILABLE_FUNCTIONS = {
    "calculate_shipping": calculate_shipping,
    "calculate_tax": calculate_tax,
    "search_catalog": search_catalog,
}


def run_agent(brief, vertical, client_name, budget_limit, delivery_location, currency):

    with open(
        os.path.join(os.path.dirname(__file__), "prompts", "system_prompt.txt"), "r"
    ) as f:
        system_instructions = f.read()

    # Appended strict instruction to use tools
    user_prompt = f"""
    Create a proposal for {client_name}. 
    Brief: {brief}
    Vertical: {vertical}
    Budget: {budget_limit}
    Location: {delivery_location}
    Currency: {currency}
    
    CRITICAL AGENT WORKFLOW:
    Step 1. First, select the items you want to buy for this proposal.
    Step 2. Calculate the raw subtotal and estimate the total weight of those items.
    Step 3. Call the `calculate_shipping` and `calculate_tax` tools EXACTLY ONCE. Check your spelling.
    Step 4. IMMEDIATELY output the STRICTLY VALID JSON. Do not call tools again.
    
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
            "shipping_easyparcel": 0.00, 
            "tax_amount": 0.00,
            "grand_total": 0.00,
            "currency": "{currency}",
            "budget_limit": {budget_limit}
        }},
        "agent_reasoning": "Explain how you stayed under budget here."
    }}
    """

    messages = [
        {"role": "system", "content": system_instructions},
        {"role": "user", "content": user_prompt},
    ]

    print("--- Starting Agent Execution (Powered by Groq) ---")

    response_text = ""

    # Increased retries to 8 to allow turns for tool calling AND budget critiquing
    MAX_RETRIES = 8

    for attempt in range(MAX_RETRIES):
        try:
            # 1. Call the model WITH tools
            completion = client.chat.completions.create(
                model="llama-3.1-8b-instant",
                messages=messages,
                tools=AGENT_TOOLS,
                tool_choice="auto",
                temperature=0.2,
            )

            response_message = completion.choices[0].message

            # ==========================================
            # STEP A: INTERCEPT TOOL CALLS
            # ==========================================
            if response_message.tool_calls:
                messages.append(
                    response_message
                )  # Save the AI's tool request to history

                for tool_call in response_message.tool_calls:
                    func_name = tool_call.function.name
                    func_args = json.loads(tool_call.function.arguments)

                    print(f"⚙️ [Tool Call] Agent requested {func_name} with {func_args}")

                    func_to_call = AVAILABLE_FUNCTIONS.get(func_name)
                    if func_name == "calculate_shipping":
                        func_response = calculate_shipping(
                            total_weight_kg=func_args.get("total_weight_kg", 0)
                        )
                    elif func_name == "calculate_tax":

                        raw_subtotal = (
                            func_args.get("subtotal") or func_args.get("subtotall") or 0
                        )

                        func_response = calculate_tax(
                            subtotal=func_args.get("subtotal", 0),
                            delivery_location=func_args.get(
                                "delivery_location", delivery_location
                            ),
                        )
                    elif func_name == "search_catalog":
                        func_response = search_catalog(
                            query=func_args.get("query", ""),
                            vertical=func_args.get("vertical", None),
                        )
                    else:
                        print(
                            f"⚠️ Warning: Agent tried to call an unknown tool: {func_name}"
                        )
                        continue

                    # Feed the exact math back into the AI's brain
                    messages.append(
                        {
                            "tool_call_id": tool_call.id,
                            "role": "tool",
                            "name": func_name,
                            "content": json.dumps(func_response),
                        }
                    )
                print("⏳ [Rate Limit] Cooling down...")
                time.sleep(2)

                # Loop back to the top so Groq can process the math results
                continue

            # ==========================================
            # STEP B: EVALUATE FINAL JSON RESPONSE
            # ==========================================
            # If there are no tool calls, the AI thinks it has finished the JSON
            response_text = response_message.content

            # Clean and parse the JSON
            clean_text = response_text.replace("```json", "").replace("```", "").strip()
            proposal_draft = json.loads(clean_text)

            # 2. The Supervisor critiques the budget constraint
            grand_total = proposal_draft.get("financial_summary", {}).get(
                "grand_total", float("inf")
            )

            if grand_total > budget_limit:
                print(
                    f"🛑 [Supervisor] Attempt {attempt + 1}: Over budget (${grand_total} > ${budget_limit}). Forcing AI to revise..."
                )

                messages.append({"role": "assistant", "content": response_text})
                messages.append(
                    {
                        "role": "user",
                        "content": f"CRITIQUE: Your proposal's grand total is {grand_total}, which exceeds the strict budget of {budget_limit}. You MUST downgrade the items to cheaper alternatives to stay under budget. Calculate the new math, and generate a new valid JSON proposal.",
                    }
                )
                continue

            print(
                f"✅ [Supervisor] Attempt {attempt + 1}: Proposal passed all critical constraints."
            )
            return clean_text

        except json.JSONDecodeError:
            print(
                f"⚠️ [Supervisor] Attempt {attempt + 1}: Invalid JSON. Forcing revision..."
            )
            messages.append({"role": "assistant", "content": response_text})
            messages.append(
                {
                    "role": "user",
                    "content": "CRITIQUE: That was not valid JSON. Return ONLY a JSON object. No markdown, no conversational text.",
                }
            )
            continue

        except Exception as e:
            print(f"❌ [Supervisor] Attempt {attempt + 1}: Unexpected error: {e}")
            break

    print("--- Agent Failed to Self-Correct ---")
    return json.dumps(
        {
            "proposal_id": "FALLBACK-001",
            "project_title": "Proposal Generation Timed Out",
            "bill_of_materials": [],
            "financial_summary": {
                "subtotal": 0,
                "shipping_easyparcel": 0,
                "tax_amount": 0,
                "grand_total": 0,
            },
            "agent_reasoning": "The agent reached the retry limit. Please try a more specific budget.",
        }
    )
