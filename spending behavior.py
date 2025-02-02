from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.responses import JSONResponse
from typing import Dict, List
import pdfplumber
import re
import torch
import difflib  # For fuzzy matching
from transformers import AutoTokenizer, AutoModelForSequenceClassification
import io

app = FastAPI()

# ✅ Load the model and tokenizer
class TransactionCategorizer:
    def __init__(self):
        self.tokenizer = AutoTokenizer.from_pretrained(
            "mgrella/autonlp-bank-transaction-classification-5521155", use_fast=True
        )
        self.model = AutoModelForSequenceClassification.from_pretrained(
            "mgrella/autonlp-bank-transaction-classification-5521155"
        )
        self.model.eval()

        # ✅ **Expanded Categories from Model**
        self.categories = [
            "profits", "travels_transportation_tolls", "health_wellness_wellness_relax",
            "travels_transportation_hotels", "taxes_services_profit_deduction", "shopping_other",
            "housing_family_veterinary", "wages_professional_compensation", "travels_transportation_parking_urban_transports",
            "shopping_htech", "eating_out_other", "education", "travels_transportation_other",
            "leisure_books", "leisure_cinema", "taxes_services_bank_fees", "taxes_services_default_payments",
            "taxes_services_professional_activity", "shopping_sport_articles", "housing_family_other",
            "bills_subscriptions_other", "mortgages_loans_mortgages", "travels_transportation_travels_holidays",
            "leisure_sport_events", "health_wellness_medical_expenses", "bills_subscriptions_bills",
            "health_wellness_aid_expenses", "travels_transportation_taxis", "taxes_services_money_orders",
            "wages_pension", "housing_family_groceries", "credit_cards_credit_cards",
            "bills_subscriptions_internet_phone", "transfers_rent_incomes", "travels_transportation_fuel",
            "housing_family_childhood", "other_cash", "shopping_accessorize", "travels_transportation_buses",
            "eating_out_coffee_shops", "eating_out_takeaway_restaurants", "wages_salary",
            "health_wellness_drugs", "transfers_bank_transfers", "housing_family_rents",
            "travels_transportation_vehicle_maintenance", "housing_family_appliances", "housing_family_furniture",
            "leisure_magazines_newspapers", "bills_subscriptions_subscriptions", "housing_family_maintenance_renovation",
            "housing_family_servants", "transfers_gifts_donations", "transfers_investments",
            "leisure_gambling", "leisure_other", "transfers_refunds", "eating_out_restaurants",
            "travels_transportation_flights", "other_other", "leisure_clubs_associations",
            "mortgages_loans_loans", "travels_transportation_trains", "health_wellness_other",
            "transfers_savings", "taxes_services_taxes", "leisure_videogames", "taxes_services_other",
            "health_wellness_gyms", "other_checks", "transfers_other", "shopping_clothing",
            "leisure_movies_music", "travels_transportation_car_rental", "leisure_theaters_concerts",
            "shopping_footwear", "housing_family_insurances"
        ]

        # ✅ **Predefined Mapping for Common Vendors**
        self.predefined_mappings = {
            "spotify": "bills_subscriptions_subscriptions",
            "netflix": "bills_subscriptions_subscriptions",
            "hulu": "bills_subscriptions_subscriptions",
            "apple music": "bills_subscriptions_subscriptions",
            "amazon prime": "bills_subscriptions_subscriptions",
            "uber": "travels_transportation_taxis",
            "lyft": "travels_transportation_taxis",
            "walmart": "housing_family_groceries",
            "costco": "housing_family_groceries",
            "mcdonald's": "eating_out_restaurants",
            "starbucks": "eating_out_coffee_shops",
        }

    def preprocess_description(self, description: str) -> str:
        """Normalize transaction descriptions to improve classification."""
        description = description.lower()
        for vendor, category in self.predefined_mappings.items():
            if vendor in description:
                return category  # Directly map known vendors
        return description  # Otherwise, return original description

    def classify_text(self, text: str):
        """Classify transaction description into financial categories."""
        processed_text = self.preprocess_description(text)

        if processed_text in self.categories:
            return processed_text  # Use predefined mapping

        # If no match in predefined mappings, classify using the model
        inputs = self.tokenizer(text, padding=True, truncation=True, return_tensors="pt")
        with torch.no_grad():
            outputs = self.model(**inputs)
        scores = torch.nn.functional.softmax(outputs.logits, dim=-1)
        predicted_category = torch.argmax(scores, dim=-1).item()

        # ✅ Fuzzy match category if it seems incorrect
        matched_category = difflib.get_close_matches(
            self.categories[predicted_category], self.categories, n=1
        )
        return matched_category[0] if matched_category else "other"

categorizer = TransactionCategorizer()

# ✅ **Fixed `extract_transactions()` Function**
def extract_transactions(text: str) -> List[Dict]:
    """
    Extracts transactions from a flexible format:
    - Matches both positive and negative amounts.
    - Works without requiring a dollar sign.
    Format: "MM/DD/YYYY Description -XX.XX" or "MM/DD/YYYY Description XX.XX"
    """
    pattern = r'(\d{2}/\d{2}/\d{4})\s+(.+?)\s+(-?\d+\.\d{2})'
    matches = re.findall(pattern, text)

    return [
        {"date": date, "description": desc.strip(), "amount": float(amount)}
        for date, desc, amount in matches
    ]

@app.post("/analyze_pdf")
async def analyze_pdf(file: UploadFile = File(...)):
    if not file.filename.lower().endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Only PDF files are accepted.")

    try:
        file_bytes = await file.read()
        if not file_bytes:
            raise HTTPException(status_code=400, detail="Empty file received.")

        with pdfplumber.open(io.BytesIO(file_bytes)) as pdf:
            text = "\n".join(filter(None, [page.extract_text() for page in pdf.pages if page.extract_text()]))

        if not text:
            raise HTTPException(status_code=400, detail="No extractable text found in the PDF.")

        print(f"Extracted text:\n{text}")

        transactions = extract_transactions(text)
        if not transactions:
            raise HTTPException(status_code=400, detail="No transactions found in the PDF.")

        print(f"Extracted transactions: {transactions}")

        category_totals = {}
        total_spent = sum(t["amount"] for t in transactions if t["amount"] < 0)

        for transaction in transactions:
            category = categorizer.classify_text(transaction["description"])
            print(f"Transaction: {transaction['description']} → Category: {category}")
            category_totals[category] = category_totals.get(category, 0) + abs(transaction["amount"])

        total_spent = abs(total_spent)  # Ensure positive total
        category_percentages = {
            cat: round((amt / total_spent) * 100, 2) for cat, amt in category_totals.items()
        } if total_spent > 0 else {}

        return JSONResponse(content={
            "total_spent": round(total_spent, 2),
            "category_percentages": category_percentages
        }, status_code=200)

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing file: {str(e)}")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)