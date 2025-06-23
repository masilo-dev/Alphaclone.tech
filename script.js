// Smooth scrolling with hash removal
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
      
      // Remove hash from URL
      removeHashFromURL();
    }
  });
});

// Handle initial page load with hash
window.addEventListener('load', function() {
  if (window.location.hash) {
    const targetElement = document.querySelector(window.location.hash);
    if (targetElement) {
      // Scroll to the element
      setTimeout(() => {
        targetElement.scrollIntoView({
          behavior: 'smooth'
        });
      }, 100); // Small delay to ensure page is fully loaded
    }
    
    // Remove hash from URL
    removeHashFromURL();
  }
});

// Handle browser history navigation (back/forward buttons)
window.addEventListener('popstate', function(e) {
  if (window.location.hash) {
    const targetElement = document.querySelector(window.location.hash);
    if (targetElement) {
      targetElement.scrollIntoView({
        behavior: 'smooth'
      });
    }
    removeHashFromURL();
  }
});

// Helper function to remove hash from URL
function removeHashFromURL() {
  if (history.pushState) {
    // Try to remove hash without page reload
    history.pushState(null, null, ' ');
  } else {
    // Fallback for older browsers
    location.hash = '';
  }
}
