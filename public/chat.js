// Chat.js — Amplify AI wiring (English version)
import { Amplify } from 'aws-amplify';
import { generateClient } from 'aws-amplify/api';
import outputs from '../amplify_outputs.json';

Amplify.configure(outputs);
const client = generateClient();

/**
 * Send the message from the input using Amplify AI
 * Assumes you have a global addMessage(text, who) helper.
 */
export async function sendMessage() {
  const input = document.getElementById('messageInput');
  const text = input?.value?.trim() ?? '';
  if (!text) return;

  // Show user message
  addMessage(text, 'user');
  input.value = '';

  try {
    // Get response from Amplify AI
    const res = await client.conversations.chat({
      content: [{ text }]
    });

    // Safely pick the first text chunk
    const botText =
      (Array.isArray(res?.content) &&
        res.content.find(c => typeof c?.text === 'string')?.text) ||
      'Sorry, I could not generate a response.';

    // Show bot reply
    addMessage(botText, 'bot');
  } catch (error) {
    console.error('Error:', error);
    addMessage('Sorry, something went wrong. Please try again.', 'bot');
  }
}

// Optional: wire up a form submit handler (if you use a <form id="composer">)
const composer = document.getElementById('composer');
if (composer) {
  composer.addEventListener('submit', (e) => {
    e.preventDefault();
    sendMessage();
  });
}
