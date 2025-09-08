const messages = document.getElementById('messages');
const form = document.getElementById('composer');
const input = document.getElementById('messageInput');
const sendBtn = document.getElementById('sendBtn');

function appendMessage(text, who = 'user') {
  const bubble = document.createElement('div');
  bubble.className = `msg msg--${who}`;
  bubble.textContent = text;
  messages.appendChild(bubble);
  messages.scrollTop = messages.scrollHeight;
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const text = input.value.trim();
  if (!text) return;

  appendMessage(text, 'user');
  input.value = '';
  input.focus();
  sendBtn.disabled = true;

  try {
    // Demo response
    await new Promise(r => setTimeout(r, 600));
    appendMessage('This is a demo response. Real analysis will be returned when connected to backend.', 'bot');
  } catch (err) {
    appendMessage('An error occurred. Please try again.', 'bot');
  } finally {
    sendBtn.disabled = false;
  }
});
