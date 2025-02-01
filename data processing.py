from transformers import AutoTokenizer, AutoModelForSequenceClassification
import torch
import re

class TransactionCategorizer:
    def __init__(self):
        # Load tokenizer and model from Hugging Face
        self.tokenizer = AutoTokenizer.from_pretrained("mgrella/autonlp-bank-transaction-classification-5521155")
        self.model = AutoModelForSequenceClassification.from_pretrained("mgrella/autonlp-bank-transaction-classification-5521155")
        self.labels = ["Category 1", "Category 2", "Category 3"]  # Replace with actual categories from the model

    def preprocess(self, merchant):
        # Basic preprocessing (lowercase, remove special characters)
        merchant = merchant.lower()
        merchant = re.sub(r'[^\w\s]', '', merchant)
        return merchant.strip()

    def categorize(self, merchant):
        # Preprocess the merchant name
        merchant_cleaned = self.preprocess(merchant)
        
        # Tokenize and predict
        inputs = self.tokenizer(merchant_cleaned, return_tensors="pt", truncation=True, padding=True)
        outputs = self.model(**inputs)
        
        # Get predicted category
        predicted_class = torch.argmax(outputs.logits, dim=1).item()
        category = self.labels[predicted_class]
        return category

def clean_and_categorize(transactions, categorizer):
    for transaction in transactions:
        # Preprocess merchant name
        transaction['merchant'] = categorizer.preprocess(transaction['merchant'])
        
        # Categorize if category is not already provided
        if not transaction.get('category'):
            transaction['category'] = categorizer.categorize(transaction['merchant'])
    
    return transactions
