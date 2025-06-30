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
    const userMessage = chatbotInput.value.trim();
    if (userMessage === '') return;

    // Display user message in chat window
    const userMessageElement = document.createElement('div');
    userMessageElement.className = 'message user-message';
    userMessageElement.innerText = userMessage;
    chatbotMessages.appendChild(userMessageElement);

    // Clear input field
    chatbotInput.value = '';

    // Send message to your backend (Render URL)
    fetch('https://alphaclone-chatbot.onrender.com/api/chatbot', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message: userMessage })
    })
    .then(response => response.json())
    .then(data => {
        // Display bot reply
        const botMessageElement = document.createElement('div');
        botMessageElement.className = 'message bot-message';
        botMessageElement.innerText = data.reply;
        chatbotMessages.appendChild(botMessageElement);
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    })
    .catch(error => {
        console.error('Error:', error);
        const errorMessageElement = document.createElement('div');
        errorMessageElement.className = 'message bot-message error';
        errorMessageElement.innerText = 'Sorry, something went wrong with the chatbot.';
        chatbotMessages.appendChild(errorMessageElement);
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    });
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
      const greetingElement = document.createElement('div');
      greetingElement.className = 'message bot-message';
      greetingElement.innerText = "Hello! I'm your virtual assistant. How can I help you today?";
      chatbotMessages.appendChild(greetingElement);
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
