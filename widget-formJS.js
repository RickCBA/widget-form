// init-dental-chat-widget.js
if (window.location.pathname !== "/contact") {
  console.log("Chatbot script disabled: not on contact page.");
  return;
}

import { createChat } from "https://cdn.jsdelivr.net/npm/@n8n/chat/dist/chat.bundle.es.js";

const sessionId = crypto.randomUUID();

createChat({
  webhookUrl: "https://closedbyrick.app.n8n.cloud/webhook/e95f6f6c-e62f-4bbc-80e5-d8dd2b8107d0/chat",
  target: "#my-chat-widget",
  mode: "fullscreen",
  showWelcomeScreen: false,
  initialMessages: [],
  sessionId: sessionId,
  loadPreviousSession: true,
  onReady: (chat) => {
    chat.sendMessage({ 
      action: "sendMessage",
      sessionId: sessionId,
      chatInput: "Hello! How can I help?"
    });
  },
  i18n: {
    en: {
      title: "Ask us anything",
      subtitle: "We're here to answer all your questions",
      inputPlaceholder: "Type your question..."
    }
  }
});

setTimeout(() => {
  const chatMessagesList = document.querySelector('#my-chat-widget .chat-body .chat-messages-list');
  if (chatMessagesList) {
    const cannedMsgDiv = document.createElement('div');
    cannedMsgDiv.className = 'chat-message chat-message-from-bot my-canned-bot-message';

    cannedMsgDiv.innerHTML = `
      <div style="position: relative;">
        <p style="margin-bottom:14px; font-style: italic;">
          *We may store personal data and use it to contact you to support your dental needs.
          See <a href="https://www.sharplesdental.co.uk/privacy-policy" target="_blank" style="color: inherit; text-decoration: underline;">Privacy Policy</a>*
        </p>
        <div class="canned-messages-grid">
          <button data-message="Book an Appointment" data-send="Hello, I’d like to book an appointment. Can you provide me with my options?">Book an Appointment</button>
          <button data-message="Emergency Appointment" data-send="I’m experiencing a dental emergency and need to be seen soon. Can you tell me my options?">Emergency Appointment</button>
          <button data-message="Dental Check-up & Cleaning" data-send="Hi, I’d like a routine dental check-up and cleaning. Could you provide me with the options?">Dental Check-up & Cleaning</button>
          <button data-message="Straighten My Teeth" data-send="I’m interested in straightening my teeth. Could you share the options?">Straighten My Teeth</button>
          <button data-message="Replace Missing Teeth" data-send="Hi, I need to replace a missing tooth (or teeth). Can you tell me about implants or other solutions?">Replace Missing Teeth</button>
          <button data-message="Teeth Whitening & Cosmetic Treatments" data-send="Hello, I’m looking for teeth whitening or cosmetic dentistry options. What treatments do you offer?">Teeth Whitening & Cosmetic Treatments</button>
          <button data-message="I want to ask a question" data-send="I have a question, can you help me to answer it?">I want to ask a question</button>
        </div>
      </div>
    `;

    chatMessagesList.insertBefore(cannedMsgDiv, chatMessagesList.firstChild);
    console.log('✅ Canned message bubble added!');

    const buttons = cannedMsgDiv.querySelectorAll('.canned-messages-grid button');
    buttons.forEach((button) => {
      button.addEventListener('click', () => {
        const messageText = button.getAttribute('data-send');
        console.log('Button clicked:', messageText);

        const chatInputField = document.querySelector('#my-chat-widget textarea');
        if (chatInputField) {
          chatInputField.value = messageText;
          chatInputField.dispatchEvent(new Event('input', { bubbles: true }));

          setTimeout(() => {
            const sendButton = document.querySelector('#my-chat-widget .chat-footer button');
            if (sendButton) {
              sendButton.click();
              console.log('✅ Auto-sent message:', messageText);
            } else {
              console.error('❌ Send button not found!');
            }
          }, 150);
        } else {
          console.error('❌ Chat input field not found!');
        }
      });
    });
  } else {
    console.log('❌ .chat-messages-list not found, cannot add canned messages.');
  }
}, 500);
