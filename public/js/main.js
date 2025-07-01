// Main JavaScript file for WriterSup platform

document.addEventListener('DOMContentLoaded', function() {
  // Toggle sidebar on mobile
  const sidebarToggle = document.getElementById('sidebarToggle');
  const mobileOverlay = document.querySelector('.mobile-overlay');
  const sidebar = document.querySelector('.sidebar');
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  
  if (sidebarToggle) {
    sidebarToggle.addEventListener('click', function() {
      sidebar.classList.toggle('active');
      mobileOverlay.classList.toggle('active');
      document.body.classList.toggle('sidebar-open');
    });
  }
  
  if (mobileOverlay) {
    mobileOverlay.addEventListener('click', function() {
      sidebar.classList.remove('active');
      mobileOverlay.classList.remove('active');
      document.body.classList.remove('sidebar-open');
    });
  }
  
  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', function() {
      sidebar.classList.add('active');
      mobileOverlay.classList.add('active');
      document.body.classList.add('sidebar-open');
    });
  }
  // Initialize tooltips
  const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
  tooltipTriggerList.map(function(tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl);
  });

  // Initialize popovers
  const popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
  popoverTriggerList.map(function(popoverTriggerEl) {
    return new bootstrap.Popover(popoverTriggerEl);
  });

  // Auto-hide alerts after 5 seconds
  setTimeout(function() {
    const alerts = document.querySelectorAll('.alert:not(.alert-permanent)');
    alerts.forEach(function(alert) {
      alert.classList.add('fade');
      setTimeout(function() {
        const bsAlert = new bootstrap.Alert(alert);
        bsAlert.close();
      }, 300);
    });
  }, 5000);

  // Add animations to UI elements
  const animateElements = document.querySelectorAll('.card, .alert, .main-content > .container > *');
  animateElements.forEach(function(element, index) {
    if (!element.classList.contains('fade-in') && 
        !element.classList.contains('scale-in') && 
        !element.classList.contains('slide-in-right')) {
      setTimeout(function() {
        element.classList.add('fade-in');
      }, index * 100);
    }
  });
  
  // Add hover effects to cards with shadow-hover class
  const hoverCards = document.querySelectorAll('.shadow-hover');
  hoverCards.forEach(function(card) {
    card.addEventListener('mouseenter', function() {
      this.classList.add('shadow-lg');
    });
    card.addEventListener('mouseleave', function() {
      this.classList.remove('shadow-lg');
    });
  });

  // Confirm before form submission for critical actions
  const confirmForms = document.querySelectorAll('form[data-confirm]');
  confirmForms.forEach(function(form) {
    form.addEventListener('submit', function(event) {
      const confirmMessage = this.getAttribute('data-confirm');
      if (!confirm(confirmMessage)) {
        event.preventDefault();
      }
    });
  });

  // Handle navbar toggler for mobile
  const navbarToggler = document.querySelector('.navbar-toggler');
  if (navbarToggler) {
    navbarToggler.addEventListener('click', function() {
      const navbarCollapse = document.getElementById('navbarNav');
      if (navbarCollapse) {
        navbarCollapse.classList.toggle('show');
      }
    });
  }

  // Prevent double form submission
  const forms = document.querySelectorAll('form:not([data-no-prevent-double-submit])');
  forms.forEach(function(form) {
    form.addEventListener('submit', function() {
      // Disable all submit buttons in the form
      const submitButtons = this.querySelectorAll('button[type="submit"], input[type="submit"]');
      submitButtons.forEach(function(button) {
        button.disabled = true;
        if (button.tagName === 'BUTTON') {
          const originalText = button.innerHTML;
          button.setAttribute('data-original-text', originalText);
          button.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Processing...';
        }
      });
    });
  });

  // Password strength meter
  const passwordInputs = document.querySelectorAll('input[type="password"][data-password-strength]');
  passwordInputs.forEach(function(input) {
    const strengthMeter = document.getElementById(input.getAttribute('data-password-strength'));
    if (strengthMeter) {
      input.addEventListener('input', function() {
        const password = this.value;
        let strength = 0;
        
        if (password.length >= 10) strength += 25;
        if (password.match(/[A-Z]/)) strength += 25;
        if (password.match(/[a-z]/)) strength += 25;
        if (password.match(/[0-9]/)) strength += 12.5;
        if (password.match(/[^A-Za-z0-9]/)) strength += 12.5;
        
        strengthMeter.style.width = strength + '%';
        
        if (strength < 50) {
          strengthMeter.className = 'progress-bar bg-danger';
        } else if (strength < 75) {
          strengthMeter.className = 'progress-bar bg-warning';
        } else {
          strengthMeter.className = 'progress-bar bg-success';
        }
      });
    }
  });

  // Toggle password visibility
  const passwordTogglers = document.querySelectorAll('.password-toggle');
  passwordTogglers.forEach(function(toggler) {
    toggler.addEventListener('click', function() {
      const passwordInput = document.getElementById(this.getAttribute('data-password-input'));
      const icon = this.querySelector('i');
      
      if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
      } else {
        passwordInput.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
      }
    });
  });

  // Countdown timer for deadlines
  const deadlineCounters = document.querySelectorAll('[data-deadline]');
  deadlineCounters.forEach(function(counter) {
    const deadline = new Date(counter.getAttribute('data-deadline')).getTime();
    
    const countdownFunction = setInterval(function() {
      const now = new Date().getTime();
      const distance = deadline - now;
      
      if (distance < 0) {
        clearInterval(countdownFunction);
        counter.innerHTML = 'EXPIRED';
        counter.classList.add('text-danger');
        return;
      }
      
      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      
      if (days > 0) {
        counter.innerHTML = days + 'd ' + hours + 'h ' + minutes + 'm';
      } else {
        counter.innerHTML = hours + 'h ' + minutes + 'm';
        if (hours < 12) {
          counter.classList.add('text-warning');
        }
      }
    }, 1000);
  });

  // Form validation with enhanced feedback
  const validationForms = document.querySelectorAll('form.needs-validation');
  validationForms.forEach(function(form) {
    // Add input event listeners for real-time validation
    const inputs = form.querySelectorAll('input, select, textarea');
    inputs.forEach(function(input) {
      input.addEventListener('input', function() {
        if (this.checkValidity()) {
          this.classList.add('is-valid');
          this.classList.remove('is-invalid');
        } else {
          this.classList.add('is-invalid');
          this.classList.remove('is-valid');
        }
      });
    });
    
    // Form submission validation
    form.addEventListener('submit', function(event) {
      if (!form.checkValidity()) {
        event.preventDefault();
        event.stopPropagation();
        
        // Scroll to the first invalid input
        const firstInvalid = form.querySelector(':invalid');
        if (firstInvalid) {
          firstInvalid.focus();
          firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
      
      form.classList.add('was-validated');
    }, false);
  });
  
  // Add smooth scrolling to all links
  document.querySelectorAll('a[href^="#"]:not([data-bs-toggle])').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
});
