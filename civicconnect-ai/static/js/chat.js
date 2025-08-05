document.addEventListener('DOMContentLoaded', () => {
    const chatForm = document.getElementById('chat-form');
    const attachBtn = document.getElementById('attach-btn');
    const imageInput = document.getElementById('file-input');
    const textInput = document.getElementById('user-input');
    const chatMessages = document.getElementById('chat-messages');
    const typingIndicator = document.querySelector('.typing-indicator');

    // Generate a unique session ID for the user
    let sessionId = sessionStorage.getItem('chatbotSessionId');
    if (!sessionId) {
        sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
        sessionStorage.setItem('chatbotSessionId', sessionId);
    }

    let attachedFile = null;

    // --- Event Listeners ---

    attachBtn.addEventListener('click', () => {
        imageInput.click();
    });

    imageInput.addEventListener('change', (event) => {
        if (event.target.files && event.target.files[0]) {
            attachedFile = event.target.files[0];
            // Update placeholder to show the attached file name
            textInput.placeholder = `Image attached: ${attachedFile.name}`;
        }
    });

    chatForm.addEventListener('submit', (e) => {
        e.preventDefault();
        sendMessage();
    });

    // Allow sending with Enter, but new line with Shift+Enter
    textInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });

    // --- Core Functions ---

    function appendMessage(messageText, sender, imageUrl = null) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', `${sender}-message`);

        const p = document.createElement('p');
        p.textContent = messageText;
        messageDiv.appendChild(p);

        if (imageUrl) {
            const img = document.createElement('img');
            img.src = imageUrl;
            img.style.maxWidth = '100%';
            img.style.borderRadius = '8px';
            img.style.marginTop = '8px';
            messageDiv.appendChild(img);
        }

        // Insert the new message before the typing indicator
        chatMessages.insertBefore(messageDiv, typingIndicator);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    async function sendMessage() {
        const messageText = textInput.value.trim();

        if (!messageText && !attachedFile) {
            return; // Don't send empty messages
        }

        const imageUrl = attachedFile ? URL.createObjectURL(attachedFile) : null;
        appendMessage(messageText, 'user', imageUrl);

        typingIndicator.style.display = 'flex';
        chatMessages.scrollTop = chatMessages.scrollHeight;

        const formData = new FormData();
        formData.append('sessionId', sessionId);
        formData.append('message', messageText);
        if (attachedFile) {
            formData.append('image', attachedFile, attachedFile.name);
        }

        // Clear inputs after preparing the form data
        textInput.value = '';
        imageInput.value = ''; // Clear the file input
        attachedFile = null;
        textInput.placeholder = 'Type your message here...';

        try {
            const response = await fetch('/chat', {
                method: 'POST',
                body: formData // Send as FormData, not JSON
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            appendMessage(data.reply, 'bot');
        } catch (error) {
            console.error('Error sending message:', error);
            appendMessage(`Sorry, I encountered an error. Please try again.`, 'bot');
        } finally {
            typingIndicator.style.display = 'none';
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }
    }
});