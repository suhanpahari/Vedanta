import subprocess

models = ["mistral:7b", "gemma3:4b" , "phi4:14b"]


messages = [{"role": "system", "content": "Let's discuss who is important in cricket batter or bowler 100 words."}]


def chat_with_model(model, history):
    prompt = "\n".join([f"{msg['role'].capitalize()}: {msg['content']}" for msg in history])
    
    
    result = subprocess.run(
        ["ollama", "run", model, prompt], 
        capture_output=True, 
        text=True, 
        encoding="utf-8" 
    )
    
    return result.stdout.strip()

for _ in range(5): 
    for model in models:
        response = chat_with_model(model, messages)
        messages.append({"role": model, "content": response})
        print(f"\n{model.upper()}:\n{response}") 
