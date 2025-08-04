**## 🤖 CivicConnect AI**

A friendly and intelligent chatbot designed to serve as a Smart City Assistant. This project offers a clean, modern interface for citizens to report civic issues and get instant information about city services. Now powered by Google Gemini API, it brings real-time AI capabilities to the browser.

---

## ✨ Features

- **Interactive Chat UI:** A responsive and intuitive chat window built with HTML, CSS, and JavaScript.
- **Gemini-Powered AI Backend:** The chatbot now connects to a Flask backend integrated with Google Gemini, enabling intelligent, context-aware responses.
- **Civic Issue Reporting:** The bot understands and responds to common civic concerns like:
  - Potholes 🛣️
  - Garbage & Recycling 🗑️
  - Water Leaks 💧
  - Streetlight Outages 💡
  - Parking & Taxes 🅿️
- **Ticket Generation:** Automatically creates fictional report IDs (e.g., CR123456) for user-submitted issues.
- **Department Routing:** Identifies the appropriate city department based on the issue.
- **Follow-Up Prompts:** Asks for location, address, or additional details to complete the report.
- **Session Management:** Maintains separate chat histories for different users.
- **Typing Indicator:** A sleek animation shows when the bot is "thinking," improving user experience.
- **Auto-Resizing Text Area:** The message input box grows and shrinks dynamically with the content.
- **Theme Toggle (Day/Night Mode):** Users can switch between light and dark themes for better accessibility and comfort.
- **Attachment Support:** Users can upload files or images directly in the chat interface.

---

## 🎯 Final Output (Frontend Only + Backend)

Once you run the full-stack application:

🌆 A beautiful cityscape background sets the tone for a smart city experience.
💬 A sleek, responsive chatbot panel welcomes users with CivicConnect AI.
🤖 Real-time AI responses powered by Gemini for civic issue handling.
✍️ A dynamic input box that adjusts as you type.
💡 A typing indicator that makes the bot feel alive and responsive.
🌗 A theme toggle button to switch between day and night modes.
📎 An attachment icon to upload files or images during chat.

![Final Output](civicconnect-ai/static/images/screenshot.png)

---

## 🌐 Live Demo

[- 🔗 Click here to view the live site on Netlify](https://civicconnectbot.netlify.app/)

---

## 🛠️ Tech Stack

| Layer     | Technologies Used                                      |
|-----------|--------------------------------------------------------|
| Frontend  | HTML5, CSS3, JavaScript (ES6+), Bootstrap              |
| Backend   | Python, Flask, Google Gemini API, python-dotenv        |

---

## 🚀 Getting Started

### Option 1: Frontend Only (No Installation)

No complex setup is required! To run the chatbot:

1. Ensure you have the project files on your local machine.
2. Navigate to the `static/` directory.
3. Open `index.html` in any modern web browser.

### Option 2: Full Stack with Gemini AI Backend

**Prerequisites:**
Python 3.7+
Google Gemini API Key

**Steps:**
1. Clone the repository
git clone <repository-url>
cd civicconnect-ai

2. Create a virtual environment
python -m venv venv

**Activate it:**
- venv\Scripts\activate  # Windows
- source venv/bin/activate  # macOS/Linux

 3. Install dependencies
pip install -r requirements.txt

 4. Add your Gemini API key to a .env file
echo GEMINI_API_KEY="your_api_key_here" > .env

 5. Run the Flask server
python app.py

**Access the App:**
1. Open your browser and go to http://localhost:5000
2. You’ll see the CivicConnect AI chatbot interface powered by Gemini.

---

## 📂 File Structure

civicconnect-ai/
│
├── data/                            # Stores structured data used by the bot
│   └── grievances.json              # Sample dataset for civic issue types
│
├── static/                          # All frontend assets
│   ├── css/                         # Stylesheets for layout and themes
│   │   ├── style.css                # Main UI styling
│   │   └── theme.css                # Styles for light/dark mode toggle
│   ├── images/                      # Visual assets and backgrounds
│   │   ├── botbackground.png        # Background for chat area
│   │   ├── mainbackground.png       # Background for main page
│   │   └── screenshot.png           # Screenshot of the chatbot UI
│   ├── js/                          # JavaScript for interactivity
│   │   ├── chat.js                  # Handles chat logic and bot responses
│   │   └── theme.js                 # Manages theme switching
│   └── index.html                   # Main chatbot interface page
│
├── .env                             # Environment variables (e.g., Gemini API key)
├── .gitignore                       # Files and folders to ignore in Git
├── app.py                           # Flask backend server with Gemini integration
├── requirements.txt                 # Python dependencies
└── README.md                        # Project documentation

---

## 👤 Author

**Ritesh Raut**  
*Programmer Analyst, Cognizant*

CivicConnect AI — Your Smart City Assistant, bridging citizens and services with a smile! 🏙️🤖💬

---

### 🌐 Connect with me:
<p align="left">
<a href="https://github.com/Riteshraut0116" target="blank"><img align="center" src="https://raw.githubusercontent.com/rahuldkjain/github-profile-readme-generator/master/src/images/icons/Social/github.svg" alt="Riteshraut0116" height="30" width="40" /></a>
<a href="https://linkedin.com/in/ritesh-raut-9aa4b71ba" target="blank"><img align="center" src="https://raw.githubusercontent.com/rahuldkjain/github-profile-readme-generator/master/src/images/icons/Social/linked-in-alt.svg" alt="ritesh-raut-9aa4b71ba" height="30" width="40" /></a>
<a href="https://www.instagram.com/riteshraut1601/" target="blank"><img align="center" src="https://raw.githubusercontent.com/rahuldkjain/github-profile-readme-generator/master/src/images/icons/Social/instagram.svg" alt="riteshraut1601" height="30" width="40" /></a>
<a href="https://www.facebook.com/ritesh.raut.649321/" target="blank"><img align="center" src="https://raw.githubusercontent.com/rahuldkjain/github-profile-readme-generator/master/src/images/icons/Social/facebook.svg" alt="ritesh.raut.649321" height="30" width="40" /></a>
</p>

---
