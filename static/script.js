/**
 * Gemini Chatbot – Frontend Logic
 *
 * Handles:
 *  - Sending user messages to the Flask backend via fetch()
 *  - Rendering user & bot messages in the chat window
 *  - Showing a typing indicator while awaiting the API response
 *  - Auto-growing textarea
 *  - Basic markdown-to-HTML conversion for bot replies
 *  - Resetting the conversation
 */

// ---------------------------------------------------------------------------
// DOM References
// ---------------------------------------------------------------------------
const chatMessages  = document.getElementById("chat-messages");
const chatForm      = document.getElementById("chat-form");
const userInput     = document.getElementById("user-input");
const btnSend       = document.getElementById("btn-send");
const btnReset      = document.getElementById("btn-reset");


// ---------------------------------------------------------------------------
// Event Listeners
// ---------------------------------------------------------------------------

/** Handle form submission (Send button or Enter key) */
chatForm.addEventListener("submit", (e) => {
  e.preventDefault();
  handleSend();
});

/** Allow Enter to send, Shift+Enter for new line */
userInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    handleSend();
  }
});

/** Auto-grow textarea as the user types */
userInput.addEventListener("input", () => {
  userInput.style.height = "auto";
  userInput.style.height = Math.min(userInput.scrollHeight, 150) + "px";
});

/** Reset conversation history */
btnReset.addEventListener("click", async () => {
  try {
    await fetch("/api/reset", { method: "POST" });
  } catch {
    // Silently ignore – the UI clears regardless
  }
  chatMessages.innerHTML = "";
  addWelcomeCard();
  userInput.focus();
});


// ---------------------------------------------------------------------------
// Core Functions
// ---------------------------------------------------------------------------

/**
 * Main send handler – validates input, displays user message,
 * calls the backend, and displays the bot response.
 */
async function handleSend() {
  const text = userInput.value.trim();
  if (!text) return;

  // Remove the welcome card if it's still visible
  const welcomeCard = chatMessages.querySelector(".welcome-card");
  if (welcomeCard) welcomeCard.remove();

  // Render user message & clear input
  appendMessage("user", text);
  userInput.value = "";
  userInput.style.height = "auto";
  btnSend.disabled = true;

  // Show typing indicator
  const typingEl = showTypingIndicator();

  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: text }),
    });

    const data = await response.json();

    // Remove typing indicator
    typingEl.remove();

    if (!response.ok || data.error) {
      appendMessage("error", data.error || "Something went wrong. Please try again.");
    } else {
      appendMessage("bot", data.reply);
    }
  } catch (err) {
    typingEl.remove();
    appendMessage(
      "error",
      "Network error — could not reach the server. Is Flask running?"
    );
  } finally {
    btnSend.disabled = false;
    userInput.focus();
  }
}


/**
 * Append a chat message (user, bot, or error) to the message area.
 *
 * @param {"user"|"bot"|"error"} role
 * @param {string} text
 */
function appendMessage(role, text) {
  const wrapper = document.createElement("div");
  wrapper.classList.add("message", role);

  // Avatar
  const avatar = document.createElement("div");
  avatar.classList.add("avatar");
  avatar.textContent = role === "user" ? "U" : role === "bot" ? "✦" : "!";

  // Bubble
  const bubble = document.createElement("div");
  bubble.classList.add("bubble");

  if (role === "bot") {
    // Convert basic Markdown to HTML for bot responses
    bubble.innerHTML = markdownToHTML(text);
  } else {
    bubble.textContent = text;
  }

  wrapper.appendChild(avatar);
  wrapper.appendChild(bubble);
  chatMessages.appendChild(wrapper);
  scrollToBottom();
}


/**
 * Show animated typing dots while waiting for the API.
 * Returns the DOM element so it can be removed later.
 */
function showTypingIndicator() {
  const wrapper = document.createElement("div");
  wrapper.classList.add("typing-indicator");

  const avatar = document.createElement("div");
  avatar.classList.add("avatar");
  avatar.style.background = "var(--bg-tertiary)";
  avatar.style.color = "var(--accent-2)";
  avatar.textContent = "✦";

  const bubble = document.createElement("div");
  bubble.classList.add("bubble");

  for (let i = 0; i < 3; i++) {
    const dot = document.createElement("span");
    dot.classList.add("typing-dot");
    bubble.appendChild(dot);
  }

  wrapper.appendChild(avatar);
  wrapper.appendChild(bubble);
  chatMessages.appendChild(wrapper);
  scrollToBottom();

  return wrapper;
}


/** Scroll the message area to the bottom */
function scrollToBottom() {
  chatMessages.scrollTop = chatMessages.scrollHeight;
}


/** Restore the welcome card (after a reset) */
function addWelcomeCard() {
  const card = document.createElement("div");
  card.classList.add("welcome-card");
  card.innerHTML = `
    <div class="welcome-icon">
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
        <path d="M12 2L14.09 8.26L20 9.27L15.55 13.97L16.91 20L12 16.9L7.09 20L8.45 13.97L4 9.27L9.91 8.26L12 2Z" fill="url(#grad1)"/>
        <defs>
          <linearGradient id="grad1" x1="4" y1="2" x2="20" y2="20">
            <stop offset="0%" stop-color="#6C63FF"/>
            <stop offset="100%" stop-color="#48CFCB"/>
          </linearGradient>
        </defs>
      </svg>
    </div>
    <h2>Hello! 👋</h2>
    <p>I'm your AI assistant powered by Gemini. Ask me anything — from coding help to creative writing.</p>
  `;
  chatMessages.appendChild(card);
}


// ---------------------------------------------------------------------------
// Lightweight Markdown → HTML Converter
// ---------------------------------------------------------------------------

/**
 * Converts a subset of Markdown to HTML for nicer bot responses.
 * Supports: bold, italic, inline code, code blocks, lists, line breaks.
 *
 * @param {string} md - Raw markdown text from the Gemini API.
 * @returns {string} HTML string.
 */
function markdownToHTML(md) {
  let html = md;

  // --- Code blocks (``` ... ```) ---
  html = html.replace(/```(\w*)\n([\s\S]*?)```/g, (_, lang, code) => {
    const escaped = escapeHTML(code.trim());
    return `<pre><code>${escaped}</code></pre>`;
  });

  // --- Inline code (`...`) ---
  html = html.replace(/`([^`]+)`/g, "<code>$1</code>");

  // --- Bold (**...**) ---
  html = html.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");

  // --- Italic (*...*) ---
  html = html.replace(/(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)/g, "<em>$1</em>");

  // --- Unordered lists (lines starting with - or *) ---
  html = html.replace(/(?:^|\n)((?:[*-] .+\n?)+)/g, (_, block) => {
    const items = block
      .trim()
      .split("\n")
      .map((line) => `<li>${line.replace(/^[*-] /, "")}</li>`)
      .join("");
    return `<ul>${items}</ul>`;
  });

  // --- Ordered lists (lines starting with 1. 2. etc.) ---
  html = html.replace(/(?:^|\n)((?:\d+\. .+\n?)+)/g, (_, block) => {
    const items = block
      .trim()
      .split("\n")
      .map((line) => `<li>${line.replace(/^\d+\. /, "")}</li>`)
      .join("");
    return `<ol>${items}</ol>`;
  });

  // --- Paragraphs (double newlines) ---
  html = html
    .split(/\n{2,}/)
    .map((block) => {
      const trimmed = block.trim();
      if (!trimmed) return "";
      // Don't wrap blocks that are already HTML elements
      if (/^<(pre|ul|ol|li|h[1-6]|blockquote)/.test(trimmed)) return trimmed;
      return `<p>${trimmed.replace(/\n/g, "<br>")}</p>`;
    })
    .join("");

  return html;
}


/** Escape HTML entities to prevent XSS in code blocks */
function escapeHTML(str) {
  const el = document.createElement("span");
  el.textContent = str;
  return el.innerHTML;
}
