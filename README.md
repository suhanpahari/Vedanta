# Vedanta

Vedanta is a web-based chat interface for interacting with local AI models running on your device. It provides a sleek, responsive UI with support for Markdown formatting, code block syntax highlighting, message history, and streaming responses—making it ideal for experimenting with and using local LLMs (Large Language Models).

## Features

- **Chat Interface**: Modern chat UI for conversational interaction.
- **Local Model Selection**: Choose different local AI models, or let the app auto-select.
- **Markdown & Code Support**: Messages are rendered with Markdown, including code blocks and syntax highlighting.
- **Streaming Responses**: Simulated streaming output for a more interactive chat feel.
- **Copy Code Button**: Easily copy code from AI responses.
- **Welcome Examples**: Quick example prompts to get started (e.g., Python code generation, math help, concept explanations).
- **History Panel**: Toggleable sidebar for browsing previous conversations.

## Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/suhanpahari/Vedanta.git
   cd Vedanta
   ```

2. **Run the Application**
   - Vedanta uses a Flask backend to serve the chat API.
   - Make sure you have Python installed.
   - Install dependencies:
     ```bash
     pip install flask
     ```
   - Start the server:
     ```bash
     flask run
     ```
   - Open `in.html` or `templates/index.html` in your browser.

3. **Configure Local Models**
   - Select your preferred local AI model from the dropdown in the interface.
   - The app will use the selected model for your queries.

## Project Structure

- `in.html`, `templates/index.html`: Main HTML files for the chat interface.
- `static/script.js`: Core frontend logic (event handling, message streaming, Markdown parsing, etc.).
- `static/`: Static assets (JS, CSS).
- `api/chat`: Flask backend endpoint for processing chat messages.

## Usage

- Type your message in the input box and press "Send" or Enter.
- Explore example prompts for inspiration.
- Select different models to compare outputs.
- Code snippets in responses can be copied with the button provided.

## Technologies Used

- **Frontend**: HTML, CSS, JavaScript (vanilla)
- **Backend**: Python (Flask)
- **Markdown Parsing**: Custom logic (can be replaced with libraries like `marked.js`)
- **Syntax Highlighting**: Prism.js (integration suggested)
- **Clipboard**: Uses browser Clipboard API

## Customization

- Add new models or integrate with different local LLM backends.
- Enhance Markdown parsing or switch to a more robust library.
- Customize UI themes and layouts in `in.html` and CSS.

## License

This project currently does not specify a license. Please add one if you intend to share or modify the code.

## Author

Developed by [@suhanpahari](https://github.com/suhanpahari).

---

> **Note:** This project is best suited for experimentation with local AI models. Online model support or advanced features may require additional setup.
