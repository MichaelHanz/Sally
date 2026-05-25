import re


def calculate_shipping(total_weight_kg: float) -> float:
    """
    Calculates shipping costs using the EasyParcel weight brackets.
    Matches the frontend logic exactly to prevent total mismatch.
    """
    if total_weight_kg > 80:
        return 150.00 + (total_weight_kg - 80) * 1.25
    else:
        return 15.00 + (total_weight_kg * 0.75)


def calculate_tax(subtotal: float, delivery_location: str) -> dict:
    """
    Applies standard 8% Malaysian SST or 8.5% International Duty
    based on regex matching of the destination string.
    """
    # Look for Malaysian regions in the delivery string
    pattern = r"malaysia|penang|kl|kuala|johor|selangor|sarawak|sabah"
    is_malaysia = bool(re.search(pattern, delivery_location, re.IGNORECASE))

    tax_rate = 0.08 if is_malaysia else 0.085
    tax_amount = subtotal * tax_rate

    return {
        "tax_rate": tax_rate,
        "tax_amount": round(tax_amount, 2),
        "tax_type": "MY_SST_8%" if is_malaysia else "INTL_DUTY_8.5%",
    }


def validate_budget(
    subtotal: float, shipping: float, tax: float, budget_limit: float
) -> dict:
    """
    Strict arithmetic validation to ensure the Agent respects the budget.
    """
    grand_total = subtotal + shipping + tax
    remaining = budget_limit - grand_total

    return {
        "grand_total": round(grand_total, 2),
        "remaining_budget": round(remaining, 2),
        "is_over_budget": grand_total > budget_limit,
    }
