import os
import uuid
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet


def generate_professional_pdf(proposal_data, output_path):

    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    doc = SimpleDocTemplate(output_path, pagesize=letter)
    elements = []
    styles = getSampleStyleSheet()

    # 1. Header
    elements.append(
        Paragraph(f"<b>{proposal_data['project_title']}</b>", styles["Title"])
    )
    elements.append(
        Paragraph(f"Prepared for: {proposal_data['client_name']}", styles["Normal"])
    )
    elements.append(Spacer(1, 20))

    # 2. Table Data
    data = [["Item", "Specification", "Qty", "Unit Price", "Total"]]
    for item in proposal_data["bill_of_materials"]:
        item_p = Paragraph(item["item"], styles["Normal"])
        spec_p = Paragraph(item["specification"], styles["Normal"])
        data.append(
            [
                item_p,
                spec_p,
                str(item["qty"]),
                f"${item['unit_price']:.2f}",
                f"${item['total']:.2f}",
            ]
        )

    # 3. Create Table
    t = Table(data, colWidths=[120, 240, 30, 60, 70])

    # PROFESSIONAL STYLING (The secret sauce)
    t.setStyle(
        TableStyle(
            [
                (
                    "BACKGROUND",
                    (0, 0),
                    (-1, 0),
                    colors.HexColor("#2c3e50"),
                ),  # Dark Header
                ("TEXTCOLOR", (0, 0), (-1, 0), colors.whitesmoke),
                ("ALIGN", (0, 0), (-1, -1), "CENTER"),
                ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
                ("BOTTOMPADDING", (0, 0), (-1, 0), 12),
                ("BACKGROUND", (0, 1), (-1, -1), colors.whitesmoke),
                ("GRID", (0, 0), (-1, -1), 1, colors.black),
            ]
        )
    )

    elements.append(t)
    elements.append(Spacer(1, 20))

    # 4. Financial Summary
    fin = proposal_data["financial_summary"]
    summary = [
        ["Subtotal:", f"${fin['subtotal']:.2f}"],
        ["Shipping:", f"${fin['shipping_easyparcel']:.2f}"],
        ["Tax:", f"${fin['tax_amount']:.2f}"],
        ["GRAND TOTAL:", f"${fin['grand_total']:.2f}"],
    ]
    fin_table = Table(summary, colWidths=[300, 100])
    elements.append(fin_table)

    doc.build(elements)
