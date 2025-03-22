from flask import Flask, request, jsonify, render_template, send_from_directory
import subprocess
import json
import os
import time

app = Flask(__name__, static_folder='static')

# Model mapping based on query categories
MODEL_MAPPING = {
    "Mathematics": "phi4:14b",
    "Image Processing": "gemma3:latest",
    "Code Generation": "mistral:7b",
    "General Use": "gemma3:latest",
    "OCR": "gemma3:latest",
    "Reasoning": "deepseek-r1"
}

# System prompt for query classification
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
    """Classify the user query using Gemma 3"""
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
        print(f"Classification error: {e.stderr}")
        return "General Use"  # Default fallback

def generate_response(query, model_name):
    """Generate response using Ollama with specified model"""
    ollama_model = model_name.lower()
    
    # Simple heuristic model mapping for non-auto models

    if model_name == "deepseek-r1":
        ollama_model = "deepseek-r1"
    elif model_name == "mistral":
        ollama_model = "mistral"
    elif model_name == "phi4":
        ollama_model = "phi4"
    elif model_name == "gemma3:4b":
        ollama_model = "gemma3:4b"
    elif model_name == "gemma3:7b":
        ollama_model = "gemma3:latest"
    
    chat_payload = json.dumps({
        "model": ollama_model,
        "messages": [
            {"role": "user", "content": query}
        ]
    })
    
    try:
        start_time = time.time()
        
        result = subprocess.run(
            ["ollama", "run", ollama_model],
            input=chat_payload,
            text=True,
            capture_output=True,
            check=True,
            encoding="utf-8"
        )
        
        response_time = time.time() - start_time
        print(f"Response generated in {response_time:.2f}s using {ollama_model}")
        
        return result.stdout.strip()
    except subprocess.CalledProcessError as e:
        print(f"Generation error with {ollama_model}: {e.stderr}")
        return f"I encountered an error with the {model_name} model. Please try again or select a different model."

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/static/<path:path>')
def serve_static(path):
    return send_from_directory('static', path)

@app.route('/api/chat', methods=['POST'])
def chat():
    data = request.json
    user_input = data.get('message', '')
    model_selection = data.get('model', 'auto')
    
    if not user_input:
        return jsonify({'error': 'No message provided'}), 400
    
    # Auto model selection based on query classification
    if model_selection == 'auto':
        # Classify query
        category = classify_query(user_input)
        print(f"Query classified as: {category}")
        
        # Map category to model
        if category in MODEL_MAPPING:
            selected_model = MODEL_MAPPING[category]
        else:
            selected_model = "mistral"  # Default fallback
            
        # Display name for frontend
        model_display_name = MODEL_MAPPING[category]
    else:
        # Use selected model
        selected_model = model_selection
        model_display_name = model_selection.upper() if model_selection in ["gpt3.5", "gpt4"] else model_selection.capitalize()
    
    # Generate response
    response_text = generate_response(user_input, selected_model)
    
    return jsonify({
        'text': response_text,
        'model': model_display_name
    })

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)