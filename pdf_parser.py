import pdfplumber
import re
from datetime import datetime

def parse_pdf(file_path):
    transactions = []
    with pdfplumber.open(file_path) as pdf:
        for page in pdf.pages:
            text = page.extract_text()
            lines = text.split('\n')
            
            # Combine multi-line descriptions if necessary
            combined_lines = []
            temp_line = ""
            for line in lines:
                # Check if the line contains a date to determine if it's a new transaction
                if re.match(r'^\d{2}/\d{2}', line):  # Date in MM/DD format
                    if temp_line:  # Add the previous temp_line to combined_lines
                        combined_lines.append(temp_line)
                    temp_line = line
                else:
                    temp_line += " " + line.strip()
            if temp_line:
                combined_lines.append(temp_line)  # Add the last line
        
            # Parse each combined line
            for line in combined_lines:
                match = re.match(
                    r'^(\d{2}/\d{2})\s+(.*?)\s+(-?\d+\.\d{2})\s+(-?\d+\.\d{2})$', line)
                if match:
                    date, description, amount, balance = match.groups()
                    try:
                        transactions.append({
                            'date': datetime.strptime(date, '%m/%d').replace(year=datetime.now().year),  # Add current year
                            'description': description.strip(),
                            'amount': float(amount),
                            'balance': float(balance)
                        })
                    except ValueError:
                        # Skip malformed lines
                        continue

    return transactions

# Example usage
file_path = 'path/to/transaction.pdf'
parsed_transactions = parse_pdf(file_path)

# Output parsed data
for transaction in parsed_transactions:
    print(transaction)
