/**
 * main.js - Enhanced JavaScript functionality for portfolio website (Phase 2)
 * This file contains improved functionality including smooth navigation, form validation,
 * scroll animations, project filtering, and other interactive elements.
 */

/**
 * Wait for the DOM to be fully loaded before running JavaScript
 * This ensures all HTML elements are available for manipulation
 */
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM fully loaded and parsed');
    
    // Initialize all functions
    initializeNavigation();
    initializeContactForm();
    initializeProjectFilters();
    initializeScrollAnimations();
    initializeBackToTop();
    initializeScrollSpy();
});

/**
 * Navigation functionality
 * Handles current page highlighting, scroll effects, and mobile menu toggle
 */
function initializeNavigation() {
    console.log('Initializing navigation');
    
    // Get the current page path
    const currentPage = window.location.pathname;
    
    // Select all navigation links
    const navLinks = document.querySelectorAll('nav ul li a');
    
    // For each link, check if it's the current page and add active class
    navLinks.forEach(link => {
        // Extract just the page name from the href
        const linkPage = link.getAttribute('href');
        
        // If the current page contains the link href, it's the active page
        if (currentPage.includes(linkPage) && linkPage !== 'index.html') {
            link.classList.add('active');
        }
        // Special case for home page
        else if ((currentPage === '/' || currentPage.includes('index.html')) && linkPage === 'index.html') {
            link.classList.add('active');
        }
        
        // Log which link is active
        if (link.classList.contains('active')) {
            console.log(`Active page: ${linkPage}`);
        }
    });
    
    // Add header scroll effect
    const header = document.querySelector('header');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
    
    // Mobile menu toggle
    const navToggle = document.createElement('button');
    navToggle.className = 'nav-toggle';
    navToggle.setAttribute('aria-label', 'Toggle navigation menu');
    navToggle.innerHTML = '<i class="fas fa-bars"></i>';
    
    const nav = document.querySelector('nav');
    const headerContainer = document.querySelector('header .container');
    
    // Create nav close button
    const navClose = document.createElement('button');
    navClose.className = 'nav-close';
    navClose.setAttribute('aria-label', 'Close navigation menu');
    navClose.innerHTML = '<i class="fas fa-times"></i>';
    
    // Create overlay for mobile menu
    const navOverlay = document.createElement('div');
    navOverlay.className = 'nav-overlay';
    
    // Append toggle button to header
    headerContainer.appendChild(navToggle);
    
    // Append close button to nav
    nav.appendChild(navClose);
    
    // Append overlay to body
    document.body.appendChild(navOverlay);
    
    // Toggle mobile menu
    navToggle.addEventListener('click', function() {
        nav.classList.add('active');
        navOverlay.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent scrolling when menu is open
    });
    
    // Close mobile menu when clicking close button
    navClose.addEventListener('click', function() {
        nav.classList.remove('active');
        navOverlay.classList.remove('active');
        document.body.style.overflow = ''; // Re-enable scrolling
    });
    
    // Close mobile menu when clicking overlay
    navOverlay.addEventListener('click', function() {
        nav.classList.remove('active');
        navOverlay.classList.remove('active');
        document.body.style.overflow = ''; // Re-enable scrolling
    });
    
    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            nav.classList.remove('active');
            navOverlay.classList.remove('active');
            document.body.style.overflow = ''; // Re-enable scrolling
        });
    });
    
    // Add smooth scrolling for anchor links
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Only if the href is not just "#" (empty anchor)
            if (this.getAttribute('href') !== '#') {
                e.preventDefault();
                
                // Get the target element
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    // Get the header height for offset
                    const headerHeight = document.querySelector('header').offsetHeight;
                    
                    // Calculate the position to scroll to (with offset for header)
                    const offsetTop = targetElement.offsetTop - headerHeight;
                    
                    // Scroll smoothly to the target
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
}

/**
 * Enhanced Contact form validation and submission handling
 * Validates the form fields with more detailed feedback and prepares for submission
 */
function initializeContactForm() {
    console.log('Initializing contact form');
    
    // Find the contact form - only proceed if it exists
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        // Get all form fields
        const formFields = contactForm.querySelectorAll('input, textarea');
        
        // Add validation for each field on blur
        formFields.forEach(field => {
            field.addEventListener('blur', function() {
                validateField(field);
            });
            
            // Also validate on input to remove error when fixed
            field.addEventListener('input', function() {
                if (field.value.trim() !== '') {
                    validateField(field);
                }
            });
        });
        
        // Add submit event listener
        contactForm.addEventListener('submit', function(event) {
            // Prevent the default form submission behavior
            event.preventDefault();
            
            // Get all form fields
            const name = document.getElementById('name');
            const email = document.getElementById('email');
            const subject = document.getElementById('subject');
            const message = document.getElementById('message');
            
            // Validate all fields
            const isNameValid = validateField(name);
            const isEmailValid = validateField(email);
            const isSubjectValid = validateField(subject);
            const isMessageValid = validateField(message);
            
            // If all fields are valid, proceed with form submission
            if (isNameValid && isEmailValid && isSubjectValid && isMessageValid) {
                console.log('Form validated successfully');
                
                // Show a loading indicator
                const submitBtn = contactForm.querySelector('button[type="submit"]');
                const originalBtnText = submitBtn.innerHTML;
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
                submitBtn.disabled = true;
                
                // Simulate form submission (in a real implementation, this would be an AJAX call to a server)
                setTimeout(() => {
                    console.log('Form data:', { 
                        name: name.value, 
                        email: email.value, 
                        subject: subject.value, 
                        message: message.value 
                    });
                    
                    // Show a success message
                    showFormMessage('Your message has been sent successfully! I\'ll get back to you soon.', 'success');
                    
                    // Reset the form
                    contactForm.reset();
                    
                    // Reset the button
                    submitBtn.innerHTML = originalBtnText;
                    submitBtn.disabled = false;
                }, 1500);
            } else {
                showFormMessage('Please fix the errors in the form.', 'error');
            }
        });
    }
}

/**
 * Show form submission message (success or error)
 * @param {string} message - The message to display
 * @param {string} type - The type of message ('success' or 'error')
 */
function showFormMessage(message, type) {
    // Check if there's already a message
    let messageEl = document.querySelector('.form-message');
    
    // If not, create one
    if (!messageEl) {
        messageEl = document.createElement('div');
        messageEl.className = 'form-message';
        const contactForm = document.getElementById('contactForm');
        contactForm.parentNode.insertBefore(messageEl, contactForm.nextSibling);
    }
    
    // Set the message content and class
    messageEl.textContent = message;
    messageEl.className = `form-message ${type}`;
    
    // Add visible class to trigger animation
    setTimeout(() => messageEl.classList.add('visible'), 10);
    
    // Remove the message after a few seconds (for success messages)
    if (type === 'success') {
        setTimeout(() => {
            messageEl.classList.remove('visible');
            setTimeout(() => messageEl.remove(), 300);
        }, 5000);
    }
}

/**
 * Validate a single form field
 * @param {HTMLElement} field - The field to validate
 * @returns {boolean} - Whether the field is valid
 */
function validateField(field) {
    // Get the field's parent (form-group)
    const formGroup = field.closest('.form-group');
    
    // Find or create the error message element
    let errorElement = formGroup.querySelector('.error-message');
    if (!errorElement) {
        errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        formGroup.appendChild(errorElement);
    }
    
    // Default result is valid
    let isValid = true;
    let errorMessage = '';
    
    // Different validation based on field type
    if (field.value.trim() === '') {
        // Field is empty
        isValid = false;
        errorMessage = `${field.getAttribute('placeholder') || field.name} is required`;
    } else if (field.type === 'email') {
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(field.value)) {
            isValid = false;
            errorMessage = 'Please enter a valid email address';
        }
    } else if (field.id === 'message' && field.value.length < 10) {
        // Message length validation
        isValid = false;
        errorMessage = 'Message is too short. Please provide more details.';
    }
    
    // Update the UI based on validation result
    if (isValid) {
        formGroup.classList.remove('error');
        errorElement.textContent = '';
    } else {
        formGroup.classList.add('error');
        errorElement.textContent = errorMessage;
    }
    
    return isValid;
}