import os
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from dotenv import load_dotenv
import logging
import PIL.Image
import google.generativeai as genai

# --- Basic Logging Setup ---
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

load_dotenv()

# --- Helper function to load the system prompt ---
def load_system_prompt(file_path="system_prompt.txt"):
    """Loads the system prompt from a text file."""
    try:
        with open(file_path, "r", encoding="utf-8") as f:
            return f.read()
    except FileNotFoundError:
        logging.warning(f"{file_path} not found. A default prompt will be used.")
        return "You are a helpful assistant."

# --- Flask App Initialization ---
# We configure the static folder to be 'static' and serve it from the root URL
app = Flask(__name__, static_folder='static', static_url_path='')
CORS(app) # Enable Cross-Origin Resource Sharing

# --- Initialize Gemini ---
api_key = os.getenv("GEMINI_API_KEY")
if not api_key:
    raise ValueError("GEMINI_API_KEY is not set in the .env file")

genai.configure(api_key=api_key)
model = genai.GenerativeModel('gemini-1.5-flash-latest')

# In-memory session store.
# WARNING: This is for demonstration only. In a production environment, this will
# consume more memory over time and all chat histories will be lost on application
# restart. Consider using a persistent store like Redis or a database for production.
chat_sessions = {}

# System prompt to guide the AI on its role and behavior
system_instruction = {"role": "model", "parts": [{"text": load_system_prompt()}]}

@app.route('/chat', methods=['POST'])
def chat():
    try:
        # Handle multipart/form-data instead of JSON
        if 'sessionId' not in request.form:
            return jsonify({'error': 'Message and sessionId are required'}), 400

        message = request.form.get('message', '') # Message can be empty if only an image is sent
        session_id = request.form.get('sessionId')
        image_file = request.files.get('image')

        if not message and not image_file:
            return jsonify({'error': 'A message or an image is required.'}), 400

        # Initialize chat history for a new session
        if session_id not in chat_sessions:
            chat_sessions[session_id] = model.start_chat(history=[system_instruction])

        chat = chat_sessions[session_id]
        
        # Prepare content for Gemini, including the image if it exists
        content_parts = [message]
        if image_file:
            try:
                img = PIL.Image.open(image_file.stream)
                content_parts.append(img)
            except Exception as e:
                logging.error(f"Error processing image for session {session_id}: {e}")
                return jsonify({'error': 'Invalid or corrupted image file.'}), 400

        response = chat.send_message(content_parts)
        return jsonify({'reply': response.text})
    except Exception as e:
        logging.error(f"An unexpected error occurred in the chat endpoint: {e}", exc_info=True)
        return jsonify({'error': 'Failed to get a response from the AI.'}), 500

@app.route('/')
def serve_index():
    return send_from_directory(app.static_folder, 'index.html')

if __name__ == '__main__':
    # The development server is not for production use.
    # For local testing, it's better to run with: flask run
    # In production, a WSGI server like Gunicorn will be used.
    # Set debug=True only if an environment variable is set, making it safer.
    is_debug = os.getenv('FLASK_DEBUG', 'false').lower() in ('true', '1', 't')
    app.run(host='0.0.0.0', port=int(os.getenv('PORT', 5000)), debug=is_debug)