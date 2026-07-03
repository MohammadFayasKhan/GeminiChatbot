# 🤖 Gemini Chatbot

A sleek, dark-themed chatbot powered by **Google Gemini AI** with a Flask backend and vanilla HTML/CSS/JS frontend.

![Python](https://img.shields.io/badge/Python-3.9+-3776AB?logo=python&logoColor=white)
![Flask](https://img.shields.io/badge/Flask-3.x-000000?logo=flask)
![Gemini](https://img.shields.io/badge/Gemini-2.5--flash-4285F4?logo=google)

<p align="center">
  <img src="/Pic.png" alt="Gemini Chatbot Preview" width="600" />
</p>

> 🚀 **Live Demo:** [https://simpletgeminichatbot.vercel.app/](https://simpletgeminichatbot.vercel.app/)

## ✨ Features

- **Context-aware conversations** — chat history is maintained per session
- **Beautiful dark UI** — glassmorphism accents, smooth animations, gradient bubbles
- **Markdown rendering** — bot responses display formatted code, lists, and bold/italic text
- **Typing indicator** — animated dots while waiting for Gemini's response
- **Error handling** — friendly messages for invalid API keys, network failures, or empty input
- **Responsive design** — works on desktop and mobile
- **New chat button** — reset the conversation with one click

## 📁 Project Structure

```
chatBot/
├── app.py                     # Flask backend (API proxy, session management)
├── .env                       # Gemini API key (not committed to Git)
├── requirements.txt           # Python dependencies
├── README.md                  # This file
├── PROMPT.md                  # Prompt used to build this + learning guide
├── templates/
│   └── index.html             # Chat UI
└── static/
    ├── style.css              # Styling (dark theme, animations)
    └── script.js              # Frontend logic (fetch, rendering, markdown)
```

## 🚀 Getting Started

### Prerequisites

- **Python 3.9+** installed
- A **Gemini API key** — get one for free at [Google AI Studio](https://aistudio.google.com/app/apikey)

### 1. Clone the repo

```bash
git clone https://github.com/MohammadFayasKhan/GeminiChatbot.git
cd GeminiChatbot
```

### 2. Create a virtual environment (recommended)

```bash
python3 -m venv venv
source venv/bin/activate        # macOS / Linux
# venv\Scripts\activate         # Windows
```

### 3. Install dependencies

```bash
pip install -r requirements.txt
```

### 4. Add your API key

Create a `.env` file in the project root:

```env
GEMINI_API_KEY=AIzaSy...your_real_key_here
```

> ⚠️ **Never commit your `.env` file to version control.** It's already in `.gitignore`.

### 5. Run the app

```bash
python app.py
```

The server will start at **http://127.0.0.1:5000**. Open that URL in your browser and start chatting!

## 🔒 Security

- The API key is stored in `.env` and loaded server-side via `python-dotenv` — it is **never exposed** to the browser.
- All Gemini API calls go through the Flask backend (`/api/chat`).

## 🛠 Tech Stack

| Layer    | Technology                 |
|----------|----------------------------|
| Frontend | HTML, CSS, vanilla JS      |
| Backend  | Python, Flask              |
| AI       | Google Gemini 2.5 Flash    |
| Styling  | Custom CSS (dark theme)    |

---

## 🧠 Prompt Engineering – How This Was Built

This project was built using an AI coding assistant with a structured prompt. Full details of the prompting strategy are in [PROMPT.md](PROMPT.md).

> 💡 **Prompt Engineering Learnings:** Read the complete breakdown of techniques like constraint-based and specification prompting in [PROMPT.md](PROMPT.md) to learn how to write robust coding prompts.

### The Prompt Used

```
Create a simple web-based chatbot application that uses the Gemini API to answer user queries.

## Project Requirements

**Tech Stack:**
- Frontend: HTML, CSS, JavaScript (vanilla, no framework)
- Backend: Python with Flask (to securely handle the Gemini API key, not expose it in frontend)
- API: Google Gemini API (gemini-1.5-flash or latest available model)

**Functionality:**
1. A clean, simple chat interface with:
   - A message display area (scrollable, shows conversation history)
   - A text input box and a "Send" button
   - Visual distinction between user messages and bot responses (e.g., different alignment/colors)
2. When the user submits a query:
   - Send it to the Flask backend via a POST request
   - Backend calls the Gemini API with the user's message
   - Return the response to the frontend and display it in the chat window
3. Maintain conversation context (chat history) for the current session, so follow-up questions make sense
4. Show a "typing..." or loading indicator while waiting for the API response
5. Handle errors gracefully (e.g., invalid API key, network failure, empty input) with user-friendly messages

**Project Structure:**
- app.py (Flask backend)
- templates/index.html (chat UI)
- static/style.css (styling)
- static/script.js (frontend logic, fetch calls)
- .env file for storing GEMINI_API_KEY (do not hardcode the key)
- requirements.txt

**Setup Instructions:**
- Include a README.md with steps to:
  1. Install dependencies
  2. Add the Gemini API key to .env
  3. Run the Flask app locally

**Code Quality:**
- Add comments explaining each major section
- Keep the UI minimal but modern (rounded chat bubbles, responsive layout)
- Use environment variables for the API key, loaded via python-dotenv

Please generate all the necessary files, and after creating them, explain how to run the app locally.
```

### Prompt Type: Structured / Specification Prompting

This prompt combines **five** prompting techniques:

| Technique | How It's Used |
|-----------|--------------|
| **Structured/Specification** | Detailed spec with sections: tech stack, functionality, file structure |
| **Constraint-Based** | "vanilla JS, no framework," "don't hardcode the key," "Flask not Django" |
| **Decomposition** | Numbered sub-tasks (UI, backend, errors, session) |
| **Output Format** | Exact file names specified (`app.py`, `templates/index.html`, etc.) |
| **Closing Instruction** | "explain how to run the app locally" ensures runnable output |

### Why These Techniques Work for Coding

- **Removes ambiguity** — the AI knows exactly what "done" looks like
- **Prevents unwanted choices** — constraints stop the AI from picking React or exposing API keys
- **Produces organized output** — decomposition ensures file-by-file planning
- **Gives you a runnable result** — closing instructions prevent code dumps without guidance

> 📖 **Full guide with tips and a prompting reference table:** [PROMPT.md](PROMPT.md)

## 📝 License

This project is open-source and available under the [MIT License](LICENSE).
