// ======================
// Pricing Section Toggle
// ======================
document.addEventListener('DOMContentLoaded', function() {
  // If you have annual/monthly pricing toggle
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
  // Chatbot Widget
  // ======================
  const chatbotWidget = document.getElementById('chatbot-widget');
  const openChatbotBtn = document.getElementById('open-chatbot');
  const closeChatbotBtn = document.querySelector('.chatbot-close');
  const chatbotInput = document.querySelector('.chatbot-input');
  const chatbotSendBtn = document.querySelector('.chatbot-send');
  const chatbotMessages = document.querySelector('.chatbot-messages');

  // Sample bot responses
  const botResponses = [
    "Thanks for your message! How can I help you today?",
    "I'm here to assist you with any questions.",
    "That's a great question! Let me check that for you.",
    "Our support team can help with that. Would you like me to connect you?",
    "I've noted your question and will get back to you soon."
  ];

  // Open/close chatbot
  openChatbotBtn.addEventListener('click', function() {
    chatbotWidget.style.display = 'flex';
    this.style.display = 'none';
    chatbotInput.focus();
  });

  closeChatbotBtn.addEventListener('click', function() {
    chatbotWidget.style.display = 'none';
    openChatbotBtn.style.display = 'flex';
  });

  // Send message function
  function sendMessage() {
    const message = chatbotInput.value.trim();
    if (message === '') return;

    // Add user message
    addMessage(message, 'user');
    chatbotInput.value = '';

    // Simulate bot typing
    setTimeout(() => {
      const randomResponse = botResponses[Math.floor(Math.random() * botResponses.length)];
      addMessage(randomResponse, 'bot');
    }, 1000);
  }

  // Add message to chat
  function addMessage(text, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', `${sender}-message`);
    messageDiv.textContent = text;
    chatbotMessages.appendChild(messageDiv);
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
  }

  // Send message on button click or Enter key
  chatbotSendBtn.addEventListener('click', sendMessage);
  chatbotInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      sendMessage();
    }
  });

  // Initial bot greeting
  setTimeout(() => {
    if (chatbotMessages.children.length === 0) {
      addMessage("Hello! I'm your virtual assistant. How can I help you today?", 'bot');
    }
  }, 1000);

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
  // Mobile Menu Toggle (if not already implemented)
  // ======================
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const navMenu = document.querySelector('nav ul');

  if (mobileMenuBtn && navMenu) {
    mobileMenuBtn.addEventListener('click', function() {
      navMenu.classList.toggle('show');
    });
  }
});

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
