document.addEventListener('DOMContentLoaded', () => {
    const chatMessages = document.getElementById('chat-messages');
    const chatForm = document.getElementById('chat-form');
    const userInput = document.getElementById('user-input'); // Now a textarea
    const typingIndicator = document.querySelector('.typing-indicator');
    const attachBtn = document.getElementById('attach-btn');
    const fileInput = document.getElementById('file-input');

    // --- Session Management ---
    // Create a unique session ID for the user's visit to maintain conversation history
    let sessionId = sessionStorage.getItem('chatSessionId');
    if (!sessionId) {
        sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2)}`;
        sessionStorage.setItem('chatSessionId', sessionId);
    }

    // --- Event Listeners ---
    chatForm.addEventListener('submit', (event) => {
        event.preventDefault(); // Prevent page reload on form submission
        sendMessage();
    });

    userInput.addEventListener('keydown', (event) => {
        // Send message on Enter, but allow new line with Shift+Enter
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            sendMessage();
        }
    });

    userInput.addEventListener('input', () => {
        // Auto-resize textarea
        userInput.style.height = 'auto';
        userInput.style.height = `${userInput.scrollHeight}px`;
    });

    attachBtn.addEventListener('click', () => {
        fileInput.click(); // Trigger hidden file input
    });

    fileInput.addEventListener('change', () => {
        const files = fileInput.files;
        if (files.length > 0) {
            handleFileAttachment(files);
        }
    });
    /**
     * Adds a new message to the chat window and scrolls to the bottom.
     * @param {string} text The message content.
     * @param {string} sender The sender, either 'user' or 'bot'.
     */
    function addMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', `${sender}-message`);
        
        const p = document.createElement('p');
        p.textContent = text;
        messageDiv.appendChild(p);

        // Add the new message before the typing indicator
        chatMessages.insertBefore(messageDiv, typingIndicator);

        // Scroll to the bottom of the chat window
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    /**
     * Handles the logic of sending a message from the user.
     */
    async function sendMessage() {
        const message = userInput.value.trim();
        if (message === '') return; // Don't send empty messages

        addMessage(message, 'user');
        userInput.value = ''; // Clear textarea
        // Reset textarea height after sending
        userInput.style.height = 'auto';
        userInput.focus();

        // Show typing indicator and get bot response
        typingIndicator.style.display = 'flex';
        chatMessages.scrollTop = chatMessages.scrollHeight;

        try {
            // Send the message to the backend server
            const response = await fetch('/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: message, sessionId: sessionId }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            const botReply = data.reply;
            
            typingIndicator.style.display = 'none';
            addMessage(botReply, 'bot');
        } catch (error) {
            console.error('Error sending message:', error);
            typingIndicator.style.display = 'none';
            addMessage('Sorry, I seem to be having trouble connecting. Please try again later.', 'bot');
        }
    }

    /**
     * Handles file attachments by displaying a message in the chat.
     * @param {FileList} files The list of files attached by the user.
     */
    function handleFileAttachment(files) {
        let fileNames = [];
        for (const file of files) {
            fileNames.push(file.name);
        }
        const fileMessage = `Attached file(s): ${fileNames.join(', ')}`;
        addMessage(fileMessage, 'user');
        // In a real application, you would now upload the files to a server.
        fileInput.value = ''; // Reset file input
    }
});
