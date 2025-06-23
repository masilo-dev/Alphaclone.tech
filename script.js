<script>
    // Mobile menu toggle
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const navMenu = document.querySelector('nav ul');
    
    menuBtn.addEventListener('click', () => {
      const isExpanded = menuBtn.getAttribute('aria-expanded') === 'true';
      menuBtn.setAttribute('aria-expanded', !isExpanded);
      navMenu.classList.toggle('show');
      menuBtn.innerHTML = isExpanded ? '☰' : '✕';
    });
    
    // Tab functionality
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabButtons.forEach(button => {
      button.addEventListener('click', () => {
        // Remove active class from all buttons and contents
        tabButtons.forEach(btn => {
          btn.classList.remove('active');
          btn.setAttribute('aria-selected', 'false');
        });
        tabContents.forEach(content => {
          content.classList.remove('active');
          content.setAttribute('hidden', 'true');
        });
        
        // Add active class to clicked button and corresponding content
        button.classList.add('active');
        button.setAttribute('aria-selected', 'true');
        const tabId = button.getAttribute('data-tab');
        const tabContent = document.getElementById(tabId);
        tabContent.classList.add('active');
        tabContent.removeAttribute('hidden');
      });
    });
    
    // Form submission
    const contactForm = document.getElementById('clone-form');
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      // Here you would typically send the form data to your server
      alert('Thank you for your interest! We will contact you shortly.');
      contactForm.reset();
    });
    
    // Smooth scrolling for anchor links without hash in URL
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          // Scroll to the element
          targetElement.scrollIntoView({
            behavior: 'smooth'
          });
          
          // Clear the hash from the URL
          history.replaceState(null, null, ' ');
        }
      });
    });
</script>
