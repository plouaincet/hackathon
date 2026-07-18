# Nightlight

Nightlight is a calming wellness web app designed for reflection, emotional support, and gentle bedtime routines. It gives users a comforting space to journal, talk with an AI companion, practice grounding exercises, and explore relaxing fun facts.

## What this project does

Nightlight combines a warm, soft UI with simple self-care experiences:

- A welcoming home screen with options for chat, journaling, and calming activities
- A journal page where users can write down their thoughts and clear the text when needed
- An AI chat experience for supportive conversation
- Grounding and breathing exercises to help users slow down and focus
- Fun facts that can be read or listened to aloud

## Main pages and features

### Home
- The landing page lets users choose between:
  - Chat
  - Journal
  - Exercises

### Journal
- Includes a mood slider and a writing area
- Lets the user clear the textbox with the button “Set your thoughts free”

### Listen / AI chat
- Users can choose a role and start a supportive conversation
- The app can open an AI chat experience that remembers the conversation history
- The AI prompt is designed to stay calm, supportive, and grounded without hallucinating

### Calm activities
- 5-4-3-2-1 grounding exercise
- Deep breathing timer with inhale/hold/exhale guidance
- Back-to-menu flow for an easy calming experience

### Fun facts
- Users can choose to read or listen to a fun fact
- The app uses browser speech synthesis to read the fact aloud
- Topics include Nature, Animals, Geography, and Random

## AI API integration

The app uses an Express backend to connect the frontend to an AI model through the Fireworks AI inference API.

### Backend flow
- The frontend sends a message to the local Express route `/chat`
- The Express server forwards the request to:
  - `https://api.fireworks.ai/inference/v1/chat/completions`
- The model used is:
  - `accounts/fireworks/models/deepseek-v4-pro`

### Important details
- The backend reads the API key from the environment variable `FIREWORKS_API_KEY`
- The AI prompt includes instructions to avoid hallucinating and stay grounded in what the user shares
- The response is returned to the frontend and displayed in the chat UI

## Core functions

Here are the main app behaviors implemented in the project:

- `selectRole()` – chooses whether the user wants to talk as a listener or venting user
- `handleOpenAiChat()` – opens the AI chat view and resets the chat state
- `handleSendMessage()` – sends the user’s message to the AI backend and displays the reply
- `handleKeyDown()` – lets users send messages with Enter
- `clearJournal()` – clears the journal textarea
- `startBreathing()` / `resetBreathing()` – control the deep breathing exercise flow
- `handleChange()` – stores user responses in the grounding exercise
- `speakFact()` – reads a fun fact aloud using browser speech synthesis
- `getFactForTopic()` – generates or falls back to a fun fact based on the selected topic
- `handleTopicSelect()` / `handleNextFact()` – manage the fun fact flow

## Tech stack

- React + Vite for the frontend
- React Router for navigation
- Express.js for the backend API proxy
- Axios for HTTP requests
- CSS for the app styling

## Setup instructions

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file and add your API key:
   ```bash
   FIREWORKS_API_KEY=your_key_here
   ```

3. Start the app:
   ```bash
   npm run dev
   ```

4. Open the local app in your browser.

## Notes

- The AI chat features require a valid Fireworks API key.
- The app is designed as a warm, low-pressure support experience rather than a clinical tool.

