document.addEventListener('DOMContentLoaded', function() {
  // Mobile menu toggle
  // Select the mobile menu button and navigation using the same selectors
  // that exist in index.html. The original code used element IDs that
  // weren't present which prevented the mobile navigation from toggling.
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const mainNav = document.querySelector('nav ul');
  
  if (mobileMenuBtn && mainNav) {
    mobileMenuBtn.addEventListener('click', () => {
      mainNav.classList.toggle('active');

      const isOpen = mainNav.classList.contains('active');
      mobileMenuBtn.textContent = isOpen ? '✕' : '☰';
      // Keep the button label accessible for screen readers.
      mobileMenuBtn.setAttribute('aria-label', isOpen ? 'Close main menu' : 'Open main menu');
    });
  }
  
  // Tab functionality
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');
  
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Remove active class from all buttons and contents
      tabBtns.forEach(btn => btn.classList.remove('active'));
      tabContents.forEach(content => content.classList.remove('active'));
      
      // Add active class to clicked button and corresponding content
      btn.classList.add('active');
      const tabId = btn.getAttribute('data-tab');
      document.getElementById(tabId).classList.add('active');
    });
  });
  
  // Chatbot toggle
  const chatbotToggler = document.querySelector('.chatbot-toggler');
  const chatbotContainer = document.querySelector('.chatbot-container');
  
  if (chatbotToggler && chatbotContainer) {
    chatbotToggler.addEventListener('click', () => {
      chatbotContainer.classList.toggle('active');
    });
  }
  
  // Simple chatbot functionality
  const chatInput = document.querySelector('.chatbot-input input');
  const chatMessages = document.querySelector('.chatbot-messages');
  
  function sendMessage() {
    const message = chatInput.value.trim();
    if (message) {
      // Add user message
      const userMsg = document.createElement('div');
      userMsg.style.textAlign = 'right';
      userMsg.style.marginLeft = 'auto';
      userMsg.style.maxWidth = '80%';
      userMsg.style.padding = '0.5rem';
      userMsg.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
      userMsg.style.borderRadius = '8px';
      userMsg.style.marginBottom = '0.5rem';
      userMsg.textContent = message;
      chatMessages.appendChild(userMsg);
      
      // Clear input
      chatInput.value = '';
      
      // Add bot response after delay
      setTimeout(() => {
        const botMsg = document.createElement('div');
        botMsg.style.padding = '0.5rem';
        botMsg.style.backgroundColor = 'rgba(16, 185, 129, 0.1)';
        botMsg.style.borderRadius = '8px';
        botMsg.style.marginBottom = '0.5rem';
        botMsg.style.maxWidth = '80%';
        
        const responses = [
          "Interesting! Our AI clones can help automate responses like this.",
          "That's a great question. Would you like me to connect you with our team?",
          "AlphaClone can handle inquiries like this 24/7 for your business.",
          "Thanks for your message! Our demo is limited, but our real clones are much smarter.",
          "I'm just a demo, but a real AlphaClone would have your exact knowledge to answer this."
        ];
        
        botMsg.textContent = responses[Math.floor(Math.random() * responses.length)];
        chatMessages.appendChild(botMsg);
        
        // Scroll to bottom
        chatMessages.scrollTop = chatMessages.scrollHeight;
      }, 1000);
    }
  }
  
  if (document.querySelector('.chatbot-input button')) {
    document.querySelector('.chatbot-input button').addEventListener('click', sendMessage);
  }
  
  if (chatInput) {
    chatInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') sendMessage();
    });
  }
  
  // Create animated background particles
  function createParticles() {
    const particlesContainer = document.createElement('div');
    particlesContainer.className = 'bg-particles';
    document.body.prepend(particlesContainer);
    
    // Create 5 particles with different sizes and colors
    for (let i = 1; i <= 5; i++) {
      const particle = document.createElement('div');
      particle.className = `particle particle-${i}`;
      particlesContainer.appendChild(particle);
    }
    
    // Create floating elements
    for (let i = 1; i <= 2; i++) {
      const floatingElement = document.createElement('div');
      floatingElement.className = `floating-element floating-element-${i}`;
      particlesContainer.appendChild(floatingElement);
    }
  }
  
  createParticles();
  
  // Scroll animations
  function animateOnScroll() {
    const elements = document.querySelectorAll('[data-animate]');
    const windowHeight = window.innerHeight;
    const triggerPoint = windowHeight / 5 * 4;
    
    elements.forEach(element => {
      const elementPosition = element.getBoundingClientRect().top;
      
      if (elementPosition < triggerPoint) {
        const delay = element.getAttribute('data-animate-delay') || 0;
        setTimeout(() => {
          element.classList.add('animated');
        }, delay);
      }
    });
  }
  
  window.addEventListener('scroll', animateOnScroll);
  window.addEventListener('load', animateOnScroll);
  
  // Form submission
  // Grab the contact form using the class from the markup. The previous
  // selector looked for an ID that doesn't exist which meant the submit
  // handler never ran.
  const contactForm = document.querySelector('.contact-form form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Show success message with animation
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn.textContent;
      
      submitBtn.textContent = 'Sending...';
      submitBtn.disabled = true;
      
      setTimeout(() => {
        submitBtn.textContent = 'Sent!';
        submitBtn.style.backgroundColor = '#059669';
        
        setTimeout(() => {
          submitBtn.textContent = originalBtnText;
          submitBtn.style.backgroundColor = '';
          submitBtn.disabled = false;
          contactForm.reset();
        }, 2000);
      }, 1000);
    });
  }
  
  // Smooth scrolling for anchor links
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
        
        // Close mobile menu if open
        if (window.innerWidth <= 768 && mainNav) {
          mainNav.classList.remove('active');
          if (mobileMenuBtn) {
            mobileMenuBtn.textContent = '☰';
          }
        }
      }
    });
  });
  
  // Add gradient border to featured sections
  function addGradientBorders() {
    const featuredSections = document.querySelectorAll('.featured, .case-study, .testimonial-card, .pricing-card.featured');
    
    featuredSections.forEach(section => {
      const gradientBorder = document.createElement('div');
      gradientBorder.className = 'gradient-border';
      gradientBorder.innerHTML = section.innerHTML;
      section.innerHTML = '';
      section.appendChild(gradientBorder);
    });
  }
  
  // Uncomment if you want to use gradient borders
  // addGradientBorders();
  
  // Animate elements on hover
  function setupHoverAnimations() {
    const animatedElements = document.querySelectorAll('.feature-card, .pricing-card, .testimonial-card');
    
    animatedElements.forEach(element => {
      element.addEventListener('mouseenter', () => {
        element.style.transform = 'translateY(-10px)';
        element.style.boxShadow = '0 15px 30px rgba(0, 0, 0, 0.3)';
      });
      
      element.addEventListener('mouseleave', () => {
        element.style.transform = '';
        element.style.boxShadow = '';
      });
    });
  }
  
  setupHoverAnimations();
  
  // Parallax effect for hero background
  function setupParallax() {
    const hero = document.querySelector('.hero');
    if (hero) {
      window.addEventListener('scroll', () => {
        const scrollPosition = window.pageYOffset;
        hero.style.backgroundPositionY = `${scrollPosition * 0.5}px`;
      });
    }
  }
  
  setupParallax();
});