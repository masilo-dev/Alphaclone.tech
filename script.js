// ======================
// Pricing Section Toggle
// ======================
document.addEventListener('DOMContentLoaded', function() {
  // Pricing toggle functionality
  const pricingToggles = document.querySelectorAll('.pricing-toggle input');
  const pricingPeriods = document.querySelectorAll('.price-period');
  const priceAmounts = document.querySelectorAll('.price-amount');
  
  if (pricingToggles.length > 0) {
    pricingToggles.forEach(toggle => {
      toggle.addEventListener('change', function() {
        const isAnnual = this.value === 'annual';
        
        priceAmounts.forEach((amount, index) => {
          const monthlyPrice = amount.dataset.monthly;
          const annualPrice = amount.dataset.annual;
          
          if (isAnnual) {
            amount.textContent = annualPrice;
            pricingPeriods[index].textContent = '/year';
          } else {
            amount.textContent = monthlyPrice;
            pricingPeriods[index].textContent = '/month';
          }
        });
      });
    });
  }

  // ======================
  // Chatbot Widget - Updated Version
  // ======================
  const chatbotWidget = document.getElementById('chatbotWidget');
  const chatbotToggle = document.getElementById('chatbotToggle');
  const chatMessages = document.getElementById('chatMessages');
  const chatInput = document.getElementById('chatInput');
  const sendChatBtn = document.getElementById('sendChatBtn');

  // Open/close chatbot
  chatbotToggle.addEventListener('click', function() {
    const isVisible = chatbotWidget.style.display === 'flex';
    chatbotWidget.style.display = isVisible ? 'none' : 'flex';
    chatbotToggle.setAttribute('aria-label', isVisible ? 'Open chat with AI assistant' : 'Close chat');
    if (!isVisible) chatInput.focus();
  });

  // Send message function
  function addMessage(text, isUser = false) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('chat-message');
    messageDiv.classList.add(isUser ? 'user-message' : 'bot-message');
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

      if (!response.ok) {
        throw new Error('Network error contacting backend');
      }

      const data = await response.json();
      return data.reply;
    } catch (error) {
      console.error('Fetch error:', error);
      return "Sorry, I'm having trouble connecting to the server.";
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
    if (e.key === 'Enter') {
      handleUserMessage();
    }
  });

  // ======================
  // Pricing Card Hover Effects
  // ======================
  const pricingCards = document.querySelectorAll('.pricing-card');
  
  pricingCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
      if (!this.classList.contains('featured')) {
        this.style.transform = 'translateY(-5px)';
      } else {
        this.style.transform = 'scale(1.05) translateY(-5px)';
      }
    });
    
    card.addEventListener('mouseleave', function() {
      if (!this.classList.contains('featured')) {
        this.style.transform = 'translateY(0)';
      } else {
        this.style.transform = 'scale(1.05)';
      }
    });
  });

  // ======================
  // Mobile Menu Toggle
  // ======================
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const navMenu = document.querySelector('nav ul');

  if (mobileMenuBtn && navMenu) {
    mobileMenuBtn.addEventListener('click', function() {
      const isExpanded = this.getAttribute('aria-expanded') === 'true';
      this.setAttribute('aria-expanded', !isExpanded);
      navMenu.classList.toggle('show');
      this.textContent = isExpanded ? '☰' : '✕';
    });
  }

  // ======================
  // Tab Functionality
  // ======================
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');
  
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const tabId = btn.getAttribute('data-tab');
      
      // Update tab buttons
      tabBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');
      
      // Update tab contents
      tabContents.forEach(content => {
        content.classList.remove('active');
        content.setAttribute('hidden', 'true');
      });
      document.getElementById(tabId).classList.add('active');
      document.getElementById(tabId).removeAttribute('hidden');
    });
  });

  // ======================
  // Contact Form Submission
  // ======================
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      alert('Thank you for your message! Our team will get back to you shortly.');
      contactForm.reset();
    });
  }

  // ======================
  // Smooth Scrolling for Anchor Links
  // ======================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href');
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
});
