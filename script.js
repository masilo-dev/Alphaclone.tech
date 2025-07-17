document.addEventListener('DOMContentLoaded', () => {
  // Mobile Menu Toggle
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const navMenu = document.querySelector('nav ul');
  if (mobileMenuBtn && navMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      const isExpanded = mobileMenuBtn.getAttribute('aria-expanded') === 'true';
      mobileMenuBtn.setAttribute('aria-expanded', !isExpanded);
      navMenu.classList.toggle('show');
      mobileMenuBtn.textContent = isExpanded ? '☰' : '✕';
    });
  }

  // Tab Functionality
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
        content.setAttribute('hidden', 'true');
      });
      const activeTab = document.getElementById(tabId);
      activeTab.classList.add('active');
      activeTab.removeAttribute('hidden');
    });
  });

  // Pricing Toggle
  const pricingToggle = document.querySelector('#pricing-period');
  const priceAmounts = document.querySelectorAll('.price-amount');
  const pricePeriods = document.querySelectorAll('.price-period');
  if (pricingToggle) {
    pricingToggle.addEventListener('change', () => {
      const isAnnual = pricingToggle.value === 'annual';
      priceAmounts.forEach((amount, index) => {
        const monthlyPrice = amount.dataset.monthly;
        const annualPrice = amount.dataset.annual;
        amount.textContent = isAnnual ? annualPrice : monthlyPrice;
        pricePeriods[index].textContent = isAnnual ? '/year' : '/month';
      });
    });
  }

  // Chatbot Functionality
  const chatbotToggle = document.getElementById('chatbotToggle');
  const chatbotWidget = document.getElementById('chatbotWidget');
  const chatMessages = document.getElementById('chatMessages');
  const chatInput = document.getElementById('chatInput');
  const sendChatBtn = document.getElementById('sendChatBtn');

  if (chatbotToggle && chatbotWidget) {
    chatbotToggle.addEventListener('click', () => {
      const isVisible = chatbotWidget.style.display === 'flex';
      chatbotWidget.style.display = isVisible ? 'none' : 'flex';
      chatbotToggle.setAttribute('aria-label', isVisible ? 'Open chat with AI assistant' : 'Close chat');
      if (!isVisible) chatInput.focus();
    });
  }

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
        body: JSON.stringify({ message })
      });
      if (!response.ok) throw new Error('Network error');
      const data = await response.json();
      return data.reply;
    } catch (error) {
      console.error('Chatbot error:', error);
      return 'Sorry, I’m having trouble connecting. Please try again later.';
    }
  }

  async function handleUserMessage() {
    const userMessage = chatInput.value.trim();
    if (!userMessage) return;
    addMessage(userMessage, true);
    chatInput.value = '';
    const typingIndicator = document.createElement('div');
    typingIndicator.className = 'chat-message bot-message';
    typingIndicator.id = 'typing-indicator';
    typingIndicator.textContent = 'AlphaClone is typing...';
    chatMessages.appendChild(typingIndicator);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    const botReply = await sendMessageToBackend(userMessage);
    document.getElementById('typing-indicator')?.remove();
    addMessage(botReply);
  }

  if (sendChatBtn && chatInput) {
    sendChatBtn.addEventListener('click', handleUserMessage);
    chatInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') handleUserMessage();
    });
  }

  // Contact Form Submission
  const contactForm = document.getElementById('contactForm');
  const formMessage = document.getElementById('formMessage');
  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(contactForm);
      const data = Object.fromEntries(formData);
      try {
        const response = await fetch('https://alphaclone-contact.onrender.com/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
        if (!response.ok) throw new Error('Network error');
        formMessage.textContent = 'Thank you! Your message has been sent successfully.';
        formMessage.classList.add('success');
        formMessage.classList.remove('error');
        contactForm.reset();
      } catch (error) {
        console.error('Form submission error:', error);
        formMessage.textContent = 'An error occurred. Please try again later.';
        formMessage.classList.add('error');
        formMessage.classList.remove('success');
      }
    });
  }

  // Smooth Scrolling
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
      }
    });
  });

  // Pricing Card Hover Effects
  const pricingCards = document.querySelectorAll('.pricing-card');
  pricingCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      card.style.transform = card.classList.contains('featured')
        ? 'scale(1.05) translateY(-5px)'
        : 'translateY(-5px)';
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = card.classList.contains('featured')
        ? 'scale(1.05)'
        : 'translateY(0)';
    });
  });
});
