# 💬 AI Chat Dashboard

A responsive AI chat interface built with **React** and **TypeScript**, featuring simulated streaming responses, automatic retry handling, request cancellation, and persistent conversation history.

---

## ✨ Features

- **Simulated streaming**: assistant replies appear token by token, like a real LLM chat.
- **Retry logic**: failed requests can be retried without losing the conversation.
- **Request cancellation**: stop a response mid-stream using `AbortController`.
- **Persistence**: conversations are saved in `localStorage` and restored on reload.
- **Optimized rendering**: message list rendering is tuned to stay smooth during streaming.
- **Responsive UI**: works on mobile, tablet, and desktop.

## 🛠️ Tech Stack

| Area | Tools |
|---|---|
| UI | React, TypeScript |
| Build tool | Vite |
| Styling | CSS3 (Flexbox, Grid, responsive layout) |
| Async state | Async/Await, AbortController |
| Storage | localStorage |

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm

### Installation

```bash
git clone https://github.com/ADAMDEV01/AI-Chat-Dashboard.git
cd AI-Chat-Dashboard
npm install
npm run dev
```

Then open the local URL shown in the terminal (usually `http://localhost:5173`).

### Build for production

```bash
npm run build
npm run preview
```

## 🧠 How It Works

1. **Streaming**: the mock API returns text in small chunks, and the UI appends each chunk to the current message in state.
2. **Cancellation**: each request gets an `AbortController`. Pressing *Stop* calls `abort()`, ending the stream and cleaning up.
3. **Retry**: if a request fails, the message is marked as failed and a *Retry* button re-sends it.
4. **Persistence**: on every state change, messages are serialized to `localStorage` and loaded on startup.

## 🔮 Future Improvements

- Connect to a real LLM API through a backend proxy to keep the API key safe
- Multiple conversations with a sidebar
- Markdown and code-block rendering in replies
- Unit tests with Vitest and React Testing Library

## 👤 Author

**Adam Gomaa Hassan**
[GitHub](https://github.com/ADAMDEV01) · [LinkedIn](https://linkedin.com/in/adam-gomaa-8645b0388)
