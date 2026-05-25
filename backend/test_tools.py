from tools import search_catalog, calculate_shipping, calculate_tax


def run_tests():
    print("--- Testing Catalog Search ---")
    results = search_catalog("Standing Desk", vertical="Smart Workspace")
    print(f"Found {len(results)} items matching 'Standing Desk'.")
    if len(results) > 0:
        print(f"First match: {results[0]['name']} - ${results[0]['price']}")

    print("\n--- Testing Logistics Logic ---")
    weight = 45.0
    shipping = calculate_shipping(weight)
    print(f"Shipping for {weight}kg: ${shipping:.2f}")

    print("\n--- Testing Tax Logic ---")
    subtotal = 1000.0
    tax_result = calculate_tax(subtotal, "Penang, Malaysia")
    print(
        f"Tax for Malaysia (subtotal ${subtotal}): ${tax_result['tax_amount']} ({tax_result['tax_type']})"
    )

    print("\n--- Verification Complete ---")


if __name__ == "__main__":
    run_tests()
