document.addEventListener('DOMContentLoaded', () => {
    const chatMessages = document.getElementById('chat-messages');
    const chatForm = document.getElementById('chat-form');
    const userInput = document.getElementById('user-input'); // Now a textarea
    const typingIndicator = document.querySelector('.typing-indicator');
    const attachBtn = document.getElementById('attach-btn');
    const fileInput = document.getElementById('file-input');

    // --- State Management for Conversation Context ---
    let conversationState = {
        topic: null,    // e.g., 'pothole', 'garbage'
        awaiting: null, // e.g., 'location', 'address', 'details'
    };

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
    function sendMessage() {
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

        // Simulate bot thinking time
        setTimeout(() => {
            const botReply = getBotResponse(message);
            typingIndicator.style.display = 'none';
            addMessage(botReply, 'bot');
        }, 1200); // 1.2 second delay
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

    /**
     * The "brain" of the bot. It returns a response based on a structured set of keywords and responses.
     * @param {string} userMessage The user's input message.
     * @returns {string} The bot's response.
     */
    function getBotResponse(userMessage) {
        const lowerCaseMessage = userMessage.toLowerCase();
        const details = userMessage; // Keep original casing for the response

        // --- State-based follow-up logic ---
        // If the bot is waiting for information, handle it here first.
        if (conversationState.awaiting) {
            const topic = conversationState.topic;

            // Reset state immediately to be ready for the next independent query.
            conversationState = { topic: null, awaiting: null };

            // Provide a custom follow-up response based on the original topic.
            switch (topic) {
                case 'pothole':
                    return `Got it! The location "${details}" has been noted. Our team will inspect the site shortly. Is there anything else I can help you with?`;
                case 'garbage':
                    return `Thanks for the details. The Sanitation Department has been notified about the issue at "${details}" and will follow up. You're welcome! Is there anything else I can help you with?`;
                case 'water_leak':
                    return `Thank you. The location "${details}" has been received and crews are being dispatched. Is there anything else I can help you with?`;
                case 'streetlight':
                    return `Thank you for the information: "${details}". We have updated the report and a crew will investigate. Is there anything else I can help you with?`;
                case 'parking':
                    return `Thank you. The issue with meter "${details}" has been logged. A technician will be dispatched. Is there anything else I can help you with?`;
                case 'noise':
                    return `Thank you for providing the details: "${details}". The information has been added to your case file.`;
                default:
                    return "Thank you for the information. We have updated your report.";
            }
        }

        const generateTicketNumber = () => `CR${Math.floor(100000 + Math.random() * 900000)}`;

        // --- Keyword-based initial response logic ---
        const responseRules = [
            { keywords: ['hello', 'hi', 'hey'], response: "Hello there! How can I assist you with city services today?" },
            {
                keywords: ['pothole', 'road damage'],
                response: () => {
                    conversationState.topic = 'pothole';
                    conversationState.awaiting = 'location';
                    return `Thank you for reporting the road issue. Your complaint has been registered with ticket number ${generateTicketNumber()} and forwarded to the Public Works Department. Please provide the exact street address or nearest intersection for a faster response.`;
                }
            },
            {
                keywords: ['garbage', 'trash', 'recycling', 'waste'],
                response: () => {
                    conversationState.topic = 'garbage';
                    conversationState.awaiting = 'address';
                    return `For waste management issues, your complaint has been noted with reference number ${generateTicketNumber()} and sent to the Sanitation Department. Please provide your address and specify if it's a missed pickup, a broken bin, or another issue. You can also check schedules at city-services.com/waste.`;
                }
            },
            {
                keywords: ['water leak', 'pipe burst'],
                response: () => {
                    conversationState.topic = 'water_leak';
                    conversationState.awaiting = 'location';
                    return `A water leak is a priority. Your report has been logged with complaint number ${generateTicketNumber()} and immediately forwarded to the Water Department. Please provide the location. For emergencies, please call 911.`;
                }
            },
            {
                keywords: ['streetlight', 'street light'],
                response: () => {
                    conversationState.topic = 'streetlight';
                    conversationState.awaiting = 'location';
                    return `Thank you for the report. Your streetlight issue has been recorded with ticket number ${generateTicketNumber()} and assigned to the Maintenance crew. To help us, please provide the pole number (if visible) and the nearest address.`;
                }
            },
            {
                keywords: ['parking', 'meter'],
                response: () => {
                    conversationState.topic = 'parking';
                    conversationState.awaiting = 'details';
                    return `For parking meter issues, your report is noted with reference ${generateTicketNumber()}. Please provide the meter number and location. For other parking inquiries like tickets or permits, please specify.`;
                }
            },
            {
                keywords: ['noise', 'loud'],
                response: () => {
                    conversationState.topic = 'noise';
                    conversationState.awaiting = 'details';
                    return `Your noise complaint has been logged with case number ${generateTicketNumber()} and forwarded to the relevant authorities. Please provide the location and time of the disturbance. For ongoing issues, it's best to contact the non-emergency police line.`;
                }
            },
            { keywords: ['tax', 'property tax'], response: "You can view and pay your property taxes online at city-services.com/taxes. Do you have a specific question about your bill?" },
            { keywords: ['thank you', 'thanks', 'appreciate it'], response: "You're welcome! Is there anything else I can help you with?" }
        ];

        for (const rule of responseRules) {
            // Check if any of the keywords for a rule are present in the user's message
            if (rule.keywords.some(keyword => lowerCaseMessage.includes(keyword))) {
                // If the response is a function, call it to get the dynamic response.
                if (typeof rule.response === 'function') {
                    return rule.response();
                }
                return rule.response;
            }
        }

        // Default fallback response
        return "I'm sorry, I don't have information on that yet. You can ask me about common issues like 'potholes', 'garbage collection', 'parking', or 'streetlights'.";
    }
});
