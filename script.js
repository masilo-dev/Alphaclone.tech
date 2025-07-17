document.addEventListener('DOMContentLoaded', () => {
  // ======================
  // 1. Mobile Menu Toggle
  // ======================
  const initMobileMenu = () => {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mainMenu = document.getElementById('main-menu');

    if (!mobileMenuBtn || !mainMenu) return;

    const toggleMenu = () => {
      const isExpanded = mobileMenuBtn.getAttribute('aria-expanded') === 'true';
      mobileMenuBtn.setAttribute('aria-expanded', !isExpanded);
      mainMenu.classList.toggle('active', !isExpanded);
      mobileMenuBtn.innerHTML = isExpanded ? '☰' : '✕';
      mobileMenuBtn.setAttribute('aria-label', isExpanded ? 'Open main menu' : 'Close main menu');
      
      // Toggle body scroll when menu is open
      document.body.style.overflow = isExpanded ? '' : 'hidden';
    };

    mobileMenuBtn.addEventListener('click', toggleMenu);

    // Close menu when clicking on nav links
    document.querySelectorAll('#main-menu a').forEach(link => {
      link.addEventListener('click', () => {
        if (window.innerWidth <= 768) {
          mobileMenuBtn.setAttribute('aria-expanded', 'false');
          mainMenu.classList.remove('active');
          mobileMenuBtn.innerHTML = '☰';
          mobileMenuBtn.setAttribute('aria-label', 'Open main menu');
          document.body.style.overflow = '';
        }
      });
    });
  };

  // ======================
  // 2. Tab Functionality
  // ======================
  const initTabs = () => {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    if (tabBtns.length === 0 || tabContents.length === 0) return;

    const switchTab = (tabId) => {
      // Update buttons
      tabBtns.forEach(btn => {
        const isActive = btn.getAttribute('data-tab') === tabId;
        btn.classList.toggle('active', isActive);
        btn.setAttribute('aria-selected', isActive);
      });

      // Update content
      tabContents.forEach(content => {
        const isActive = content.id === tabId;
        content.classList.toggle('active', isActive);
        content.hidden = !isActive;
      });

      // Analytics
      if (typeof gtag === 'function') {
        gtag('event', 'tab_click', { 'tab_name': tabId });
      }
    };

    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => switchTab(btn.getAttribute('data-tab')));
    });

    // Initialize first tab
    const firstTab = tabBtns[0].getAttribute('data-tab');
    switchTab(firstTab);
  };

  // ======================
  // 3. Chatbot Functionality
  // ======================
  const initChatbot = () => {
    const chatbotToggle = document.getElementById('chatbotToggle');
    const chatbotWidget = document.getElementById('chatbotWidget');
    const chatMessages = document.getElementById('chatMessages');
    const chatInput = document.getElementById('chatInput');
    const sendChatBtn = document.getElementById('sendChatBtn');

    if (!chatbotToggle || !chatbotWidget) return;

    // Add message to chat
    const addMessage = (text, isUser = false) => {
      const messageDiv = document.createElement('div');
      messageDiv.classList.add('chat-message', isUser ? 'user-message' : 'bot-message');
      messageDiv.textContent = text;
      chatMessages.appendChild(messageDiv);
      chatMessages.scrollTop = chatMessages.scrollHeight;
    };

    // Simulate typing indicator
    const showTypingIndicator = () => {
      const typingIndicator = document.createElement('div');
      typingIndicator.className = 'chat-message bot-message typing-indicator';
      typingIndicator.innerHTML = '<span></span><span></span><span></span>';
      typingIndicator.id = 'typing-indicator';
      chatMessages.appendChild(typingIndicator);
      chatMessages.scrollTop = chatMessages.scrollHeight;
    };

    const removeTypingIndicator = () => {
      const indicator = document.getElementById('typing-indicator');
      if (indicator) indicator.remove();
    };

    // Get bot response (mock or real API)
    const getBotResponse = async (message) => {
      try {
        const response = await fetch('https://alphaclone-chatbot.onrender.com/api/chatbot', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message })
        });

        if (!response.ok) throw new Error('Network error');
        
        const data = await response.json();
        if (typeof gtag === 'function') {
          gtag('event', 'chatbot_message_sent', { message_length: message.length });
        }
        return data.reply;
      } catch (error) {
        console.error('Chatbot error:', error);
        // Fallback responses
        const responses = {
          pricing: 'We offer three pricing plans: Starter ($97/mo), Professional ($297/mo), and Enterprise (custom). Which one are you interested in?',
          features: 'Our AI clones can handle voice/text responses, website automation, and workflow management. What would you like to know more about?',
          demo: 'You can request a demo by filling out our contact form. Would you like me to direct you there?',
          default: 'I can help with questions about pricing, features, or setting up your AI clone. What would you like to know?'
        };

        const lowerMsg = message.toLowerCase();
        for (const [key, response] of Object.entries(responses)) {
          if (lowerMsg.includes(key)) return response;
        }
        return responses.default;
      }
    };

    // Handle user message
    const handleUserMessage = async () => {
      const userMessage = chatInput.value.trim();
      if (!userMessage) return;

      addMessage(userMessage, true);
      chatInput.value = '';
      showTypingIndicator();

      try {
        const botReply = await getBotResponse(userMessage);
        removeTypingIndicator();
        addMessage(botReply);
      } catch (error) {
        removeTypingIndicator();
        addMessage("I'm having trouble connecting right now. Please try again later or contact support.");
      }
    };

    // Toggle chatbot visibility
    chatbotToggle.addEventListener('click', () => {
      const isVisible = chatbotWidget.style.display === 'block';
      chatbotWidget.style.display = isVisible ? 'none' : 'block';
      chatbotToggle.setAttribute('aria-expanded', !isVisible);
      
      if (!isVisible) {
        chatInput.focus();
        if (typeof gtag === 'function') {
          gtag('event', 'chatbot_open');
        }
      }
    });

    // Message submission
    sendChatBtn.addEventListener('click', handleUserMessage);
    chatInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleUserMessage();
      }
    });

    // Initial welcome message if empty
    if (chatMessages.children.length === 0) {
      addMessage("Welcome! I'm your AlphaClone assistant. How can I help you today?");
    }
  };

  // ======================
  // 4. Smooth Scrolling
  // ======================
  const initSmoothScroll = () => {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId === '#' || targetId === '#!') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          const headerHeight = document.querySelector('header').offsetHeight;
          const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
          
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });

          // Update URL without jumping
          if (history.pushState) {
            history.pushState(null, null, targetId);
          } else {
            location.hash = targetId;
          }

          // Analytics
          if (typeof gtag === 'function') {
            gtag('event', 'scroll_to_section', { section: targetId });
          }
        }
      });
    });
  };

  // ======================
  // 5. Form Handling
  // ======================
  const initForms = () => {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;

    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn.textContent;
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending...';

      try {
        const formData = new FormData(contactForm);
        
        // Client-side validation
        if (!formData.get('name') || !formData.get('email')) {
          throw new Error('Please fill in all required fields');
        }

        const response = await fetch('https://formspree.io/f/mzzvpldl', {
          method: 'POST',
          body: formData,
          headers: { 'Accept': 'application/json' }
        });

        if (response.ok) {
          // Show thank you message
          document.getElementById('main-content-wrapper').style.display = 'none';
          document.getElementById('thankYouPage').style.display = 'block';
          window.scrollTo(0, 0);
          
          // Reset form
          contactForm.reset();
          
          // Analytics
          if (typeof gtag === 'function') {
            gtag('event', 'form_submission', { form_id: 'contact' });
          }
        } else {
          throw new Error('Form submission failed');
        }
      } catch (error) {
        alert(error.message || 'There was an error submitting the form. Please try again.');
        console.error('Form error:', error);
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = originalBtnText;
      }
    });

    // Return to main button
    const returnBtn = document.getElementById('returnToMain');
    if (returnBtn) {
      returnBtn.addEventListener('click', () => {
        document.getElementById('main-content-wrapper').style.display = 'block';
        document.getElementById('thankYouPage').style.display = 'none';
        window.scrollTo(0, 0);
      });
    }
  };

  // ======================
  // 6. Performance Optimizations
  // ======================
  const initPerformance = () => {
    // Lazy load images
    if ('IntersectionObserver' in window) {
      const lazyImages = document.querySelectorAll('img[data-src]');
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
            imageObserver.unobserve(img);
          }
        });
      });

      lazyImages.forEach(img => imageObserver.observe(img));
    }

    // Reduce motion for users who prefer it
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.documentElement.style.scrollBehavior = 'auto';
      const animations = document.querySelectorAll('[style*="animation"], [data-aos]');
      animations.forEach(el => {
        el.style.animation = 'none';
        el.removeAttribute('data-aos');
      });
    }
  };

  // ======================
  // 7. Sticky Elements
  // ======================
  const initStickyElements = () => {
    const stickyCta = document.querySelector('.sticky-cta');
    if (!stickyCta) return;

    const heroSection = document.querySelector('.hero');
    const observer = new IntersectionObserver(
      ([entry]) => {
        stickyCta.classList.toggle('visible', !entry.isIntersecting);
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    if (heroSection) observer.observe(heroSection);
  };

  // Initialize all components
  initMobileMenu();
  initTabs();
  initChatbot();
  initSmoothScroll();
  initForms();
  initPerformance();
  initStickyElements();

  // Load Google Analytics
  if (typeof gtag === 'undefined') {
    window.dataLayer = window.dataLayer || [];
    function gtag() { dataLayer.push(arguments); }
    gtag('js', new Date());
    gtag('config', 'GTM-5W3LQ8LJ');
  }
});

// Service Worker Registration
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').then(registration => {
      console.log('ServiceWorker registration successful');
    }).catch(err => {
      console.log('ServiceWorker registration failed: ', err);
    });
  });
}
