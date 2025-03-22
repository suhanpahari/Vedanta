import subprocess
import json

SYSTEM_PROMPT = """You are an AI assistant that categorizes user queries into one of the following categories:
1. Mathematics
2. Image Processing
3. Code Generation
4. General Use
5. OCR
6. Reasoning

Return ONLY the category name without extra text.
"""

def classify_query(query):
    chat_payload = json.dumps({
        "model": "gemma3",
        "messages": [
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": query}
        ]
    })

    # Run Ollama using subprocess and get the output
    try:
        result = subprocess.run(
            ["ollama", "run", "gemma3"],
            input=chat_payload,
            text=True,
            capture_output=True,
            check=True,
            encoding="utf-8"
        )
        return result.stdout.strip()
    except subprocess.CalledProcessError as e:
        return f"Error: {e.stderr}"

# Example Queries
queries = [
    "Solve the equation 2x + 5 = 10",
    "Apply Gaussian blur to an image",
    "Generate a Python script for automation",
    "How do I use this tool?",
    "Extract text from an image",
    "Use logic to deduce the answer"
]

for q in queries:
    category = classify_query(q)
    print(f"Query: {q}\nCategory: {category}\n")
