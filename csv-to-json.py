import pandas as pd

# Load CSV
csv_file = 'glossary.csv'  # Replace with your actual file name
data = pd.read_csv(csv_file)

# Convert to JSON
data.to_json('glossary.json', orient='records', indent=2)
print("JSON file created successfully.")
