import os
import uuid
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from reportlab.lib import colors


def generate_pdf(proposal_data: dict) -> str:
    # Ensure directory exists
    output_dir = os.path.join(os.path.dirname(__file__), "generated")
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)

    filename = f"proposal_{uuid.uuid4().hex[:8]}.pdf"
    filepath = os.path.join(output_dir, filename)

    c = canvas.Canvas(filepath, pagesize=letter)
    width, height = letter

    # Header
    c.setFont("Helvetica-Bold", 20)
    c.drawString(50, height - 50, f"Proposal #{proposal_data['proposal_id']}")

    c.setFont("Helvetica", 12)
    c.drawString(50, height - 70, f"Client: {proposal_data['client_name']}")
    c.drawString(50, height - 85, f"Project: {proposal_data['project_title']}")

    # Table Header
    y = height - 130
    c.line(50, y + 15, 550, y + 15)
    c.setFont("Helvetica-Bold", 10)
    c.drawString(50, y, "Item")
    c.drawString(300, y, "Qty")
    c.drawString(400, y, "Price")
    c.line(50, y - 5, 550, y - 5)

    # BOM Items
    c.setFont("Helvetica", 10)
    y -= 25
    for item in proposal_data["bill_of_materials"]:
        c.drawString(50, y, item["item"][:40])
        c.drawString(300, y, str(item["qty"]))
        c.drawString(400, y, f"${item['unit_price']:.2f}")
        y -= 20

    # Financials
    y -= 20
    c.line(400, y + 10, 550, y + 10)
    c.setFont("Helvetica-Bold", 12)
    c.drawString(300, y, "Grand Total:")
    c.drawString(450, y, f"${proposal_data['financial_summary']['grand_total']:.2f}")

    c.save()
    return filename
