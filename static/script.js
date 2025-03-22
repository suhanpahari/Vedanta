document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const sidebar = document.getElementById('sidebar');
    const historyToggle = document.getElementById('historyToggle');
    const chatContainer = document.getElementById('chat-container');
    const inputBox = document.getElementById('input-box');
    const sendBtn = document.getElementById('sendBtn');
    const streamToggle = document.getElementById('streamToggle');
    const clearBtn = document.getElementById('clearBtn');
    const loadingEl = document.getElementById('loading');
    const modelSelect = document.getElementById('modelSelect');
    
    // Welcome examples
    const exampleItems = document.querySelectorAll('.example-item');
    
    // Initial setup
    let isStreaming = false;
    let isWelcomeScreen = true;
    let isSending = false;
    
    // Toggle sidebar
    historyToggle.addEventListener('click', function() {
        sidebar.classList.toggle('hidden');
        // Change toggle icon direction
        const toggleIcon = historyToggle.querySelector('svg');
        if (sidebar.classList.contains('hidden')) {
            toggleIcon.innerHTML = '<polyline points="9 18 15 12 9 6"></polyline>';
        } else {
            toggleIcon.innerHTML = '<polyline points="15 18 9 12 15 6"></polyline>';
        }
    });
    
    // Toggle streaming
    streamToggle.addEventListener('click', function() {
        isStreaming = !isStreaming;
        streamToggle.classList.toggle('active');
    });
    
    // Handle sending messages

    // Handle sending messages
function sendMessage(message = null) {
if (isSending) return;

// Get input from textarea or from parameter
const userInput = message || inputBox.value.trim();
if (!userInput) return;

// Clear welcome screen if visible
if (isWelcomeScreen) {
chatContainer.innerHTML = '';
isWelcomeScreen = false;
}

// Add user message to chat
appendMessage('user', userInput);

// Clear input box
inputBox.value = '';

// Set sending state
isSending = true;

// Show loading indicator
loadingEl.style.display = 'block';

// Call Flask backend API
fetch('/api/chat', {
method: 'POST',
headers: {
    'Content-Type': 'application/json',
},
body: JSON.stringify({
    message: userInput,
    model: modelSelect.value
}),
})
.then(response => response.json())
.then(data => {
// Hide loading
loadingEl.style.display = 'none';

// Create response object compatible with existing code
const aiResponse = {
    text: data.text,
    model: data.model
};

if (isStreaming) {
    // Simulate streaming response
    simulateStreamingResponse(aiResponse);
} else {
    // Add complete response
    appendMessage('assistant', aiResponse.text, aiResponse.model);
}

// Reset sending state
isSending = false;

// Scroll to bottom
scrollToBottom();
})
.catch(error => {
console.error('Error:', error);

// Hide loading
loadingEl.style.display = 'none';

// Show error message
appendMessage('assistant', 'Sorry, there was an error processing your request. Please try again.', 'System');

// Reset sending state
isSending = false;
});
}
    
    // Simulate streaming response
    function simulateStreamingResponse(response) {
        const messageDiv = appendMessage('assistant', '', response.model);
        const contentDiv = messageDiv.querySelector('.content');
        const typingIndicator = document.createElement('div');
        typingIndicator.className = 'typing-indicator';
        typingIndicator.innerHTML = '<span class="typing-dot"></span><span class="typing-dot"></span><span class="typing-dot"></span>';
        contentDiv.appendChild(typingIndicator);
        
        let currentText = '';
        let i = 0;
        
        // Handle code blocks in streaming
        const text = response.text;
        let inCodeBlock = false;
        let currentCodeBlock = '';
        let codeLanguage = '';
        let finalTextParts = [];
        
        const streamInterval = setInterval(() => {
            if (i < text.length) {
                // Check for code block markers
                if (text.substr(i, 3) === '```' && !inCodeBlock) {
                    inCodeBlock = true;
                    i += 3;
                    
                    // Get language identifier if present
                    let langEnd = text.indexOf('\n', i);
                    if (langEnd !== -1) {
                        codeLanguage = text.substring(i, langEnd);
                        i = langEnd + 1;
                    }
                    
                    // Start code block
                    currentCodeBlock = '';
                    finalTextParts.push('```' + codeLanguage + '\n');
                } else if (text.substr(i, 3) === '```' && inCodeBlock) {
                    inCodeBlock = false;
                    i += 3;
                    
                    // End code block
                    finalTextParts.push(currentCodeBlock + '```');
                    currentCodeBlock = '';
                } else {
                    if (inCodeBlock) {
                        currentCodeBlock += text[i];
                    } else {
                        finalTextParts.push(text[i]);
                    }
                    i++;
                }
                
                // Join all parts and update display
                currentText = finalTextParts.join('');
                contentDiv.innerHTML = marked.parse(currentText);
                scrollToBottom();
            } else {
                // End of text, remove typing indicator
                contentDiv.innerHTML = marked.parse(text);
                clearInterval(streamInterval);
                
                // Add code block syntax highlighting
                highlightCodeBlocks();
            }
        }, 20);
    }
    
    // Append message to chat
    function appendMessage(sender, text, model = null) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message';
        
        if (sender === 'assistant') {
            // AI message on the left
            messageDiv.innerHTML = `
                <div class="message-inner">
                    <div class="avatar">
                        
                    </div>
                    <div class="assistant-message">
                        <div class="message-header">
                            <div class="sender-name">Assistant</div>
                            <div class="timestamp">${getCurrentTime()}</div>
                        </div>
                        ${model ? `<div class="model-badge"><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="14.31" y1="8" x2="20.05" y2="17.94"></line><line x1="9.69" y1="8" x2="21.17" y2="8"></line><line x1="7.38" y1="12" x2="13.12" y2="2.06"></line><line x1="9.69" y1="16" x2="3.95" y2="6.06"></line><line x1="14.31" y1="16" x2="2.83" y2="16"></line><line x1="16.62" y1="12" x2="10.88" y2="21.94"></line></svg> ${model}</div>` : ''}
                        <div class="content">${text ? marked.parse(text) : ''}</div>
                        <div class="message-actions">
                            <button class="action-btn">
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect></svg>
                                Copy
                            </button>
                            <button class="action-btn">
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path></svg>
                                Like
                            </button>
                            <button class="action-btn">
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17"></path></svg>
                                Dislike
                            </button>
                        </div>
                    </div>
                </div>
            `;
        } else {
            // User message on the right
            messageDiv.innerHTML = `
                <div class="message-inner user-message-container">
                    <div class="spacer"></div>
                    <div class="user-message">
                        <div class="message-header">
                            <div class="sender-name">You</div>
                            <div class="timestamp">${getCurrentTime()}</div>
                        </div>
                        <div class="content">${marked.parse(text)}</div>
                    </div>
                    <div class="avatar">
                        
                    </div>
                </div>
            `;
        }
        
        chatContainer.appendChild(messageDiv);
        highlightCodeBlocks();
        attachCopyButtonHandlers();
        return messageDiv;
    }
    
    // Get current time for messages
    function getCurrentTime() {
        const now = new Date();
        let hours = now.getHours();
        let minutes = now.getMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        
        hours = hours % 12;
        hours = hours ? hours : 12;
        minutes = minutes < 10 ? '0' + minutes : minutes;
        
        return `${hours}:${minutes} ${ampm}`;
    }
    
    // Generate AI response based on input
    function generateResponse(input, model) {
        // Demo responses
        if (input.toLowerCase().includes('hello') || input.toLowerCase().includes('hi')) {
            return {
                text: "Hello! I'm your local AI assistant. How can I help you today?",
                model: model
            };
        } else if (input.toLowerCase().includes('python') || input.toLowerCase().includes('code')) {
            return {
                text: "Here's a simple Python function to get you started:\n\n```python\ndef analyze_data(filename):\n    import pandas as pd\n    \n    # Read the CSV file\n    df = pd.read_csv(filename)\n    \n    # Get basic statistics\n    stats = df.describe()\n    \n    # Return the dataframe and stats\n    return df, stats\n\n# Example usage\ndata, statistics = analyze_data('your_data.csv')\nprint(statistics)\n```\n\nThis function reads a CSV file using pandas and returns both the dataframe and basic statistics. You can modify it based on your specific needs.",
                model: model
            };
        } else if (input.toLowerCase().includes('math') || input.toLowerCase().includes('calculus')) {
            return {
                text: "The derivative represents the rate of change of a function with respect to its variable. For a function f(x), the derivative is written as f'(x) or df/dx.\n\nHere are some basic derivative rules:\n\n1. Power Rule: If f(x) = x^n, then f'(x) = n·x^(n-1)\n\n2. Sum Rule: If f(x) = g(x) + h(x), then f'(x) = g'(x) + h'(x)\n\n3. Product Rule: If f(x) = g(x)·h(x), then f'(x) = g'(x)·h(x) + g(x)·h'(x)\n\n4. Quotient Rule: If f(x) = g(x)/h(x), then f'(x) = [g'(x)·h(x) - g(x)·h'(x)]/[h(x)]²\n\nWould you like to see examples of these rules applied to specific functions?",
                model: model
            };
        } else if (input.toLowerCase().includes('email') || input.toLowerCase().includes('draft')) {
            return {
                text: "Subject: Follow-Up Regarding Our Recent Meeting\n\nDear [Recipient's Name],\n\nI hope this email finds you well. I wanted to follow up on our meeting [date/time] about [topic].\n\nDuring our discussion, we covered [key points] and agreed on the following next steps:\n\n1. [Action item 1]\n2. [Action item 2]\n3. [Action item 3]\n\nI'm pleased to inform you that I've already begun working on [your specific action items]. I expect to have [deliverable] completed by [date].\n\nIf you have any questions or need additional information, please don't hesitate to reach out. I'm looking forward to our next discussion on [future meeting date if applicable].\n\nThank you for your time and collaboration.\n\nBest regards,\n\n[Your Name]\n[Your Position]\n[Contact Information]",
                model: model
            };
        } else if (input.toLowerCase().includes('transfer learning') || input.toLowerCase().includes('machine learning')) {
            return {
                text: "# Transfer Learning in Machine Learning\n\nTransfer learning is a machine learning technique where a model developed for one task is reused as the starting point for a model on a second task. It's particularly popular in deep learning.\n\n## Why Use Transfer Learning?\n\n- **Reduced Training Time**: Starting with pre-trained weights requires less time to converge\n- **Less Data Required**: You can achieve good performance even with smaller datasets\n- **Better Performance**: Often results in better performance than training from scratch\n\n## Common Approaches\n\n1. **Feature Extraction**: Use the pre-trained model as a fixed feature extractor by removing the final classification layer and adding your own on top\n\n2. **Fine-Tuning**: Take a pre-trained model and update all or some of its parameters to perform a new task\n\n## Popular Pre-trained Models\n\n- **Computer Vision**: ResNet, VGG, Inception, EfficientNet\n- **Natural Language Processing**: BERT, GPT, RoBERTa, T5\n\nTransfer learning has revolutionized many areas of AI by allowing developers to leverage powerful pre-trained models rather than starting from scratch.",
                model: model
            };
        } else {
            // Generic response for other queries
            return {
                text: "I understand you're asking about '" + input + "'. As a local AI assistant, I can try to provide helpful information on this topic. Would you like me to explain further or perhaps approach this from a different angle?",
                model: model
            };
        }
    }
    
    // Highlight code blocks with Prism.js (you'd need to include this library)
    function highlightCodeBlocks() {
        // This is a mock function - you'd normally use a syntax highlighting library
        const codeBlocks = document.querySelectorAll('pre code');
        
        codeBlocks.forEach(block => {
            // Add code header
            if (!block.parentNode.querySelector('.code-header')) {
                const preElement = block.parentNode;
                const language = block.className.replace('language-', '');
                const codeHeader = document.createElement('div');
                codeHeader.className = 'code-header';
                codeHeader.innerHTML = `
                    <span class="code-language">${language || 'code'}</span>
                    <button class="copy-btn">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                        Copy
                    </button>
                `;
                preElement.insertBefore(codeHeader, preElement.firstChild);
            }
        });
    }
    
    // Attach copy button handlers for code blocks
    function attachCopyButtonHandlers() {
        const copyButtons = document.querySelectorAll('.copy-btn');
        
        copyButtons.forEach(button => {
            if (!button.hasListener) {
                button.addEventListener('click', function() {
                    const codeBlock = this.closest('pre').querySelector('code');
                    const textToCopy = codeBlock.textContent;
                    
                    navigator.clipboard.writeText(textToCopy).then(() => {
                        // Change button text temporarily
                        const originalText = this.innerHTML;
                        this.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg> Copied!';
                        
                        setTimeout(() => {
                            this.innerHTML = originalText;
                        }, 2000);
                    });
                });
                button.hasListener = true;
            }
        });
    }
    
    // Scroll chat to bottom
    function scrollToBottom() {
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }
    
    // Event listeners
    sendBtn.addEventListener('click', function() {
        sendMessage();
    });
    
    inputBox.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });
    
    clearBtn.addEventListener('click', function() {
        // Clear chat and show welcome screen
        chatContainer.innerHTML = '';
        loadWelcomeScreen();
        isWelcomeScreen = true;
    });
    
    // Handle example clicks
    exampleItems.forEach(item => {
        item.addEventListener('click', function() {
            const query = this.querySelector('.example-description').textContent;
            sendMessage(query);
        });
    });
    
    // Load welcome screen
    function loadWelcomeScreen() {
        chatContainer.innerHTML = `
            <div class="welcome-container">
                <div class="welcome-logo">AI</div>
                <h1 class="welcome-title">Welcome to LocalAI Chat</h1>
                <p class="welcome-subtitle">I'm your local AI assistant. Select a model below or use "Auto" to let me choose the best one for your query! How can I help you today?</p>
                <div class="examples-container">
                    <div class="example-item">
                        <div class="example-title">Generate Python code</div>
                        <div class="example-description">Write a function to analyze CSV data files</div>
                    </div>
                    <div class="example-item">
                        <div class="example-title">Solve math problems</div>
                        <div class="example-description">Help me understand calculus derivatives</div>
                    </div>
                    <div class="example-item">
                        <div class="example-title">Draft an email</div>
                        <div class="example-description">Create a professional follow-up message</div>
                    </div>
                    <div class="example-item">
                        <div class="example-title">Explain concepts</div>
                        <div class="example-description">What is transfer learning in machine learning?</div>
                    </div>
                </div>
            </div>
        `;
        
        // Reattach example event listeners
        document.querySelectorAll('.example-item').forEach(item => {
            item.addEventListener('click', function() {
                const query = this.querySelector('.example-description').textContent;
                sendMessage(query);
            });
        });
    }
    
    // Initialize marked.js for Markdown parsing (you'd need to include this library)
    window.marked = {
        parse: function(text) {
            // Simple markdown parser for demo purposes
            // In a real app, use a proper library like marked.js
            
            // Handle code blocks
            text = text.replace(/```([a-z]*)\n([\s\S]*?)```/g, function(match, language, code) {
                return `<pre><code class="language-${language}">${code}</code></pre>`;
            });
            
            // Handle inline code
            text = text.replace(/`([^`]+)`/g, '<code>$1</code>');
            
            // Handle headers
            text = text.replace(/^# (.*$)/gm, '<h1>$1</h1>');
            text = text.replace(/^## (.*$)/gm, '<h2>$1</h2>');
            text = text.replace(/^### (.*$)/gm, '<h3>$1</h3>');
            
            // Handle lists
            text = text.replace(/^\d+\. (.*$)/gm, '<li>$1</li>');
            text = text.replace(/^- (.*$)/gm, '<li>$1</li>');
            
            // Handle paragraphs
            text = text.replace(/^(?!<[a-z]).+$/gm, function(match) {
                if (match.trim() === '') return '';
                return '<p>' + match + '</p>';
            });
            
            // Handle line breaks
            text = text.replace(/\n\n/g, '<br>');
            
            return text;
        }
    };
});