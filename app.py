"""
==============================================================================
                                Gemini Chatbot
==============================================================================

Project      : Gemini Chatbot
Description  : A modern AI-powered chatbot built using Flask and the
               Google Gemini API, featuring a responsive and clean UI
               for real-time conversational interactions.

Author       : Mohammad Fayas Khan
GitHub       : https://github.com/MohammadFayasKhan
Repository   : https://github.com/MohammadFayasKhan/GeminiChatbot
Version      : 1.0.0
License      : MIT License

Technologies :
- HTML5
- CSS3
- JavaScript (ES6)
- Python (Flask)
- Google Gemini API

Features :
✓ Responsive modern interface
✓ Real-time AI conversations
✓ Clean and intuitive user experience
✓ Conversation reset functionality
✓ Mobile-friendly design
"""

import os
from flask import Flask, request, jsonify, render_template, session
from dotenv import load_dotenv
from google import genai
from google.genai import types

# ---------------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------------

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)
# Secret key for Flask sessions – used to sign session cookies
app.secret_key = os.urandom(24)

# Read the Gemini API key from environment
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

# Create the Gemini client (will be validated on first request)
client = None
if GEMINI_API_KEY:
    client = genai.Client(api_key=GEMINI_API_KEY)

# Model to use
MODEL_ID = "gemini-2.5-flash"


# ---------------------------------------------------------------------------
# Routes
# ---------------------------------------------------------------------------

@app.route("/")
def index():
    """Serve the main chat interface."""
    return render_template("index.html")


@app.route("/api/chat", methods=["POST"])
def chat():
    """
    Receive a user message, forward it to Gemini, and return the response.
    Maintains conversation history in the Flask session so follow-up
    questions retain context.
    """

    # --- Guard: API key must be configured ---
    if not client:
        return jsonify({
            "error": "Gemini API key is not configured. "
                     "Please add GEMINI_API_KEY to your .env file."
        }), 500

    # --- Parse the incoming JSON body ---
    data = request.get_json(silent=True)
    if not data or not data.get("message", "").strip():
        return jsonify({"error": "Message cannot be empty."}), 400

    user_message = data["message"].strip()

    try:
        # ---- Restore or initialise chat history from session ----
        # History is stored as a list of {"role": ..., "parts": [{"text": ...}]} dicts
        history = session.get("chat_history", [])

        # Convert session history to Content objects for the SDK
        contents = []
        for msg in history:
            contents.append(
                types.Content(
                    role=msg["role"],
                    parts=[types.Part.from_text(text=p["text"]) for p in msg["parts"]]
                )
            )

        # Add the current user message
        contents.append(
            types.Content(
                role="user",
                parts=[types.Part.from_text(text=user_message)]
            )
        )

        # ---- Send the full conversation to Gemini ----
        response = client.models.generate_content(
            model=MODEL_ID,
            contents=contents,
        )

        bot_reply = response.text

        # ---- Persist updated history back into the session ----
        # Add both the user message and bot reply to history
        history.append({"role": "user", "parts": [{"text": user_message}]})
        history.append({"role": "model", "parts": [{"text": bot_reply}]})
        session["chat_history"] = history

        return jsonify({"reply": bot_reply})

    except Exception as exc:
        # Catch any Gemini / network errors and return a friendly message
        error_message = str(exc)
        # Provide a cleaner message for common failure modes
        # Check quota errors first (429) before auth errors to avoid false matches
        if "quota" in error_message.lower() or "429" in error_message or "RESOURCE_EXHAUSTED" in error_message:
            # Check if it's a per-minute limit (retryable) vs daily limit
            if "PerDay" in error_message or "limit: 0" in error_message:
                error_message = (
                    "Daily API quota exhausted. Try creating a new API key "
                    "in a different Google Cloud project, or wait until tomorrow."
                )
            else:
                error_message = (
                    "Rate limit hit. Please wait a moment and try again."
                )
        elif "API_KEY_INVALID" in error_message or "UNAUTHENTICATED" in error_message:
            error_message = (
                "Invalid API key. Please check your GEMINI_API_KEY in .env."
            )

        return jsonify({"error": error_message}), 500


@app.route("/api/reset", methods=["POST"])
def reset():
    """Clear the conversation history for the current session."""
    session.pop("chat_history", None)
    return jsonify({"status": "Chat history cleared."})


# ---------------------------------------------------------------------------
# Entry point
# ---------------------------------------------------------------------------

if __name__ == "__main__":
    # Run in debug mode for local development (auto-reload on changes)
    app.run(debug=True, port=5000)
