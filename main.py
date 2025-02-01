from fastapi import FastAPI, File, UploadFile
from fastapi.responses import JSONResponse
from pdf_parser import parse_pdf
from data_processor import TransactionCategorizer, clean_and_categorize
from spending_analyzer import analyze_spending
from ai_suggestions import generate_suggestions
import os

app = FastAPI()

@app.post("/process-transactions/")
async def process_transactions(
    file: UploadFile = File(...),
    savings_goal: float = 1000.0,
    monthly_budget: float = 3000.0
):
    try:
        # Save uploaded file
        file_path = f"./uploaded_files/{file.filename}"
        os.makedirs(os.path.dirname(file_path), exist_ok=True)
        with open(file_path, "wb") as f:
            f.write(await file.read())
        
        # Parse PDF
        transactions = parse_pdf(file_path)
        
        # Train categorizer and categorize transactions
        categorizer = TransactionCategorizer()
        categorizer.train(transactions)
        transactions = clean_and_categorize(transactions, categorizer)
        
        # Analyze spending
        spending_analysis = analyze_spending(transactions)
        
        # Generate AI-driven suggestions
        user_profile = {'savings_goal': savings_goal, 'monthly_budget': monthly_budget}
        suggestions = generate_suggestions(transactions, user_profile)
        
        # Cleanup uploaded file
        os.remove(file_path)
        
        return {
            'transactions': transactions,
            'spending_analysis': spending_analysis,
            'suggestions': suggestions
        }
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

