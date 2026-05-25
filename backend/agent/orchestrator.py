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
    # 1. Define Tools for Gemini
    print("--- Starting Agent Execution ---")
    tools = [search_catalog, calculate_shipping, calculate_tax, validate_budget]

    model = genai.GenerativeModel(model_name="gemini-2.0-flash", tools=tools)

    chat = model.start_chat(enable_automatic_function_calling=True)

    # 2. System prompt
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
    """

    # 3. Execute
    print(f"Sending prompt to Gemini...")
    response = chat.send_message(user_prompt)

    # Return the text response (which should be your JSON proposal)
    print("--- Agent Finished ---")
    return response.text
