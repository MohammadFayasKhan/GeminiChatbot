# 🧠 Prompt Engineering – How This Project Was Built

This document explains the **exact prompt** used to build this Gemini Chatbot using an AI coding assistant (Antigravity), the **type of prompting technique** used, and **why each technique matters** — written as a learning resource.

---

## 📝 The Prompt Used

```
You are a senior full-stack developer experienced in building lightweight, production-ready demo applications with clean, well-commented code and secure API key handling.

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

---

## 🏷️ Primary Prompt Type: **Structured / Specification Prompting**

This is the main category — you give the AI a **detailed spec** (like a mini requirements document) rather than a vague ask. Instead of saying "build me a chatbot," the prompt breaks the request into explicit sections: tech stack, functionality, file structure, and code quality standards.

**Why this works best for coding tasks:** It removes ambiguity about what "done" looks like. The AI knows exactly what files to create, what features to implement, and what quality bar to hit.

---

## 🔧 Secondary Techniques Layered In

### 1. Role/Context Framing (implicit)

The prompt implies "you are a developer building a production-ready mini-app" through the level of detail requested (error handling, environment variables, comments) — even without explicitly saying "act as a senior developer."

**Why it matters:** Setting context helps the AI generate code that follows real-world best practices instead of toy examples.

### 2. Constraint-Based Prompting

The prompt specifies *boundaries*:
- "vanilla JS, no framework"
- "don't hardcode the API key"
- "Flask, not Django"

**Why it matters:** Without constraints, the AI might choose React, expose the API key in frontend code, or use a different backend framework. Constraints narrow the solution space to exactly what you want.

### 3. Decomposition / Task Breakdown

The request is split into numbered sub-tasks (UI, backend logic, error handling, session context) rather than one big paragraph. This is sometimes called **chain-of-tasks prompting**.

**Why it matters:** It mirrors how a developer would break down the work. The AI can plan file-by-file instead of guessing priorities, producing more organized and complete output.

### 4. Output Format Specification

The prompt explicitly defines the deliverable structure with exact file names:
- `app.py`
- `templates/index.html`
- `static/style.css`
- `static/script.js`

**Why it matters:** Without this, the AI might put everything in a single file or use different naming conventions. Specifying the output format ensures the project structure matches your expectations.

### 5. Closing Instruction / Explicit Next-Step Direction

The last line — *"explain how to run the app locally"* — tells the model what to do **after** generating code.

**Why it matters:** This prevents the AI from just dumping files with no guidance. It ensures you get a runnable project, not just code snippets.

---

## 📊 Quick Reference: Prompting Techniques

| If you want...                              | Use...                              |
|---------------------------------------------|-------------------------------------|
| A single clear deliverable (code, doc, app) | **Structured/Specification** prompting |
| The AI to reason before answering           | **Chain-of-thought** prompting ("think step by step") |
| Consistent style/format across outputs      | **Few-shot** prompting (show examples) |
| The AI to behave a certain way throughout   | **Role** prompting ("act as...") |
| Narrow, safe boundaries on output           | **Constraint-based** prompting |

---

## 💡 Tips for Writing Better Prompts

1. **Be specific, not vague** — "build a chatbot with Flask backend and dark UI" beats "make me a chatbot"
2. **Define the file structure upfront** — prevents the AI from organizing code differently than you expect
3. **Include error handling requirements** — AIs often skip error handling unless explicitly asked
4. **Specify what NOT to do** — "no framework," "don't hardcode keys" saves rework
5. **End with a clear action** — "explain how to run it" or "write tests for it" gives the AI a clear stopping point
6. **Never share API keys in prompts** — always use `.env` files and add them to `.gitignore`

---

## 🔄 How to Iterate

This prompt was the **first pass**. After the initial build, follow-up prompts were used to:
- Migrate from the deprecated `google.generativeai` SDK to the new `google.genai` SDK
- Switch models from `gemini-2.0-flash` to `gemini-2.5-flash` (due to quota limits)
- Fix error handling that was confusing quota errors (429) with invalid key errors (401)

This **iterative refinement** is itself a prompting technique — start with a comprehensive spec, then use short follow-up prompts to fix and polish.

---

*This project was built using [Antigravity](https://antigravity.dev), an AI coding assistant, as a learning exercise in prompt engineering and full-stack web development.*
