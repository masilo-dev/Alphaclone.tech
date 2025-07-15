document.addEventListener('DOMContentLoaded', () => {
  // Mobile menu toggle
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');

  mobileMenuBtn.addEventListener('click', () => {
    const isExpanded = mobileMenuBtn.getAttribute('aria-expanded') === 'true';
    mobileMenuBtn.setAttribute('aria-expanded', !isExpanded);
    mobileMenu.style.display = isExpanded ? 'none' : 'block';
    mobileMenuBtn.textContent = isExpanded ? '☰' : '✕';
    mobileMenuBtn.setAttribute('aria-label', isExpanded ? 'Open main menu' : 'Close main menu');
  });

  // Tab functionality
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const tabId = btn.getAttribute('data-tab');
      tabBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');
      tabContents.forEach(content => {
        content.classList.remove('active');
        content.style.display = 'none';
      });
      const activeTab = document.getElementById(tabId);
      activeTab.classList.add('active');
      activeTab.style.display = 'block';
      // Track tab click
      gtag('event', 'tab_click', { 'tab_name': tabId });
    });
  });

  // Chatbot functionality
  const chatbotToggle = document.getElementById('chatbotToggle');
  const chatbotWidget = document.getElementById('chatbotWidget');
  const chatMessages = document.getElementById('chatMessages');
  const chatInput = document.getElementById('chatInput');
  const sendChatBtn = document.getElementById('sendChatBtn');

  chatbotToggle.addEventListener('click', () => {
    const isVisible = !chatbotWidget.classList.contains('hidden');
    chatbotWidget.classList.toggle('hidden', isVisible);
    chatbotToggle.setAttribute('aria-label', isVisible ? 'Open chat with AI assistant' : 'Close chat');
    if (!isVisible) {
      chatInput.focus();
      gtag('event', 'chatbot_open', {});
    } else {
      gtag('event', 'chatbot_close', {});
    }
  });

  async function addMessage(text, isUser = false) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('chat-message', isUser ? 'user-message' : 'bot-message');
    messageDiv.textContent = text;
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  async function sendMessageToBackend(message) {
    try {
      const response = await fetch('https://alphaclone-chatbot.onrender.com/api/chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: message })
      });
      if (!response.ok) throw new Error('Network error');
      const data = await response.json();
      gtag('event', 'chatbot_message_sent', { 'message': message });
      return data.reply;
    } catch (error) {
      console.error('Fetch error:', error);
      // Fallback mock responses for testing
      const mockResponses = {
        'pricing': 'Our pricing plans include Starter ($97/mo), Professional ($297/mo), and Enterprise (custom). Check the pricing section for details!',
        'features': 'AlphaClone offers voice & text clones, custom websites, and workflow automation. Want to know more about a specific feature?',
        'how it works': 'We train an AI clone on your voice and style, embed it in a custom website, and automate workflows like lead capture and scheduling.',
        'default': 'Thanks for your question! Can you provide more details or ask about our features, pricing, or use cases?'
      };
      const lowerMessage = message.toLowerCase();
      const response = Object.keys(mockResponses).find(key => lowerMessage.includes(key))
        ? mockResponses[Object.keys(mockResponses).find(key => lowerMessage.includes(key))]
        : mockResponses.default;
      return response;
    }
  }

  async function handleUserMessage() {
    const userMessage = chatInput.value.trim();
    if (userMessage) {
      addMessage(userMessage, true);
      chatInput.value = '';
      const typingIndicator = document.createElement('div');
      typingIndicator.className = 'chat-message bot-message';
      typingIndicator.textContent = 'AlphaClone is typing...';
      typingIndicator.id = 'typing-indicator';
      chatMessages.appendChild(typingIndicator);
      chatMessages.scrollTop = chatMessages.scrollHeight;
      const botReply = await sendMessageToBackend(userMessage);
      const indicator = document.getElementById('typing-indicator');
      if (indicator) chatMessages.removeChild(indicator);
      addMessage(botReply);
    }
  }

  sendChatBtn.addEventListener('click', handleUserMessage);
  chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleUserMessage();
    }
  });

  // Smooth scrolling
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 100,
          behavior: 'smooth'
        });
        gtag('event', 'scroll_to_section', { 'section': targetId });
      }
    });
  });

  // Form submission
  const contactForm = document.getElementById('contactForm');
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    fetch('https://formspree.io/f/mzzvpldl', {
      method: 'POST',
      body: new FormData(contactForm),
      headers: { 'Accept': 'application/json' }
    }).then(response => {
      if (response.ok) {
        alert('Thank you for your message! Our team will get back to you shortly.');
        contactForm.reset();
        gtag('event', 'form_submission', { 'form_id': 'contactForm' });
      } else {
        alert('There was an error submitting the form. Please try again.');
      }
    }).catch(() => {
      alert('There was an error submitting the form. Please try again.');
    });
  });

  // Sticky CTA visibility
  const stickyCta = document.querySelector('.sticky-cta');
  const heroSection = document.querySelector('.hero');
  const observer = new IntersectionObserver(([entry]) => {
    stickyCta.classList.toggle('visible', !entry.isIntersecting);
  }, { threshold: 0.1 });
  observer.observe(heroSection);

  // Progressive enhancement: Remove animations if user prefers reduced motion
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelectorAll('[style*="animation"]').forEach(el => {
      el.style.animation = 'none';
    });
  }
});

// Google Analytics
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'GTM-5W3LQ8LJ');
