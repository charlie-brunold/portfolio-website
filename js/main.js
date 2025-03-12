/**
 * main.js - Main JavaScript functionality for portfolio website
 * 
 * This file contains all core functionality including navigation, form validation,
 * scroll animations, project filtering, and interactive elements.
 * 
 * The code is structured into modular functions for better organization and maintenance.
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
    initializeSkillBarAnimations();
    addSkillBarHoverEffects();
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
    
    // Mobile menu toggle functionality
    // Check if nav-toggle doesn't already exist before creating it
    if (!document.querySelector('.nav-toggle')) {
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
    }
    
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
 * Contact form validation and submission handling
 * Only proceeds if the contact form element exists on the page
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
        if (contactForm) {
            contactForm.parentNode.insertBefore(messageEl, contactForm.nextSibling);
        }
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

/**
 * Project filtering functionality
 * Adds click handlers to filter buttons to show/hide projects
 */
function initializeProjectFilters() {
    console.log('Initializing project filters');
    
    // Find filter buttons - only proceed if they exist
    const filterBtns = document.querySelectorAll('.filter-btn');
    
    if (filterBtns.length > 0) {
        const projectCards = document.querySelectorAll('.project-card');
        
        // Add click event to each filter button
        filterBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                // Remove active class from all buttons
                filterBtns.forEach(b => b.classList.remove('active'));
                
                // Add active class to clicked button
                this.classList.add('active');
                
                // Get the filter value
                const filter = this.getAttribute('data-filter');
                
                // Show/hide projects based on filter
                projectCards.forEach(card => {
                    if (filter === 'all') {
                        card.style.display = 'flex';
                    } else {
                        const category = card.getAttribute('data-category');
                        if (category === filter) {
                            card.style.display = 'flex';
                        } else {
                            card.style.display = 'none';
                        }
                    }
                });
            });
        });
    }
}

/**
 * Scroll animations functionality
 * Adds reveal animations to elements when they scroll into view
 */
function initializeScrollAnimations() {
    console.log('Initializing scroll animations');
    
    // Select all elements with the 'reveal' class
    const revealElements = document.querySelectorAll('.reveal');
    
    if (revealElements.length > 0) {
        // Function to check if element is in viewport
        function checkReveal() {
            revealElements.forEach(element => {
                const elementTop = element.getBoundingClientRect().top;
                const elementVisible = 150; // How much of the element needs to be visible
                
                if (elementTop < window.innerHeight - elementVisible) {
                    element.classList.add('active');
                }
            });
        }
        
        // Run the check on page load
        checkReveal();
        
        // Add scroll event listener
        window.addEventListener('scroll', checkReveal);
    }
}

/**
 * Back to top button functionality
 * Shows/hides the back to top button and adds click handler
 */
function initializeBackToTop() {
    console.log('Initializing back to top button');
    
    // Create the back to top button if it doesn't already exist
    let backToTopBtn = document.querySelector('.back-to-top');
    
    if (!backToTopBtn) {
        backToTopBtn = document.createElement('button');
        backToTopBtn.className = 'back-to-top';
        backToTopBtn.setAttribute('aria-label', 'Back to top');
        backToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
        document.body.appendChild(backToTopBtn);
    }
    
    // Toggle button visibility based on scroll position
    window.addEventListener('scroll', function() {
        if (window.scrollY > 300) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });
    
    // Add click handler to scroll to top
    backToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

/**
 * Initialize skill bar animations when they come into view
 * Makes the skills section more engaging and interactive
 */
function initializeSkillBarAnimations() {
    console.log('Initializing skill bar animations');
    
    // Select all skill bar elements
    const skillBars = document.querySelectorAll('.skill-bar-fill');
    
    if (skillBars.length === 0) {
        return; // Skip if no skill bars are found on the page
    }
    
    // Initially set width to 0
    skillBars.forEach(bar => {
        // Store the target width as a data attribute
        const percentage = bar.style.width;
        bar.dataset.width = percentage;
        
        // Initially set width to 0
        bar.style.width = '0%';
    });
    
    // Function to check if element is in viewport and trigger animation
    function animateSkillBarsOnScroll() {
        const triggerPosition = window.innerHeight * 0.8; // 80% of viewport height
        
        skillBars.forEach(bar => {
            const barPosition = bar.getBoundingClientRect().top;
            
            // If the bar is in view and hasn't been animated yet
            if (barPosition < triggerPosition && bar.style.width === '0%') {
                // Animate to the target width
                setTimeout(() => {
                    bar.style.width = bar.dataset.width;
                }, 200); // Slight delay for better visual effect
            }
        });
    }
    
    // Run on scroll and once on page load
    window.addEventListener('scroll', animateSkillBarsOnScroll);
    animateSkillBarsOnScroll(); // Run once on initialization
}

/**
 * Add hover effect to skill bars
 * Enhances interactivity by adding a subtle effect when hovering over skill bars
 */
function addSkillBarHoverEffects() {
    const skillCategories = document.querySelectorAll('.skill-category');
    
    if (skillCategories.length === 0) {
        return; // Skip if no skill categories are found on the page
    }
    
    skillCategories.forEach(category => {
        // Find all skill bars within this category
        const skillBars = category.querySelectorAll('.skill-bar');
        
        skillBars.forEach(bar => {
            // Add hover effect
            bar.addEventListener('mouseenter', () => {
                const fill = bar.querySelector('.skill-bar-fill');
                if (fill) {
                    fill.style.opacity = '0.8';
                    fill.style.boxShadow = '0 0 10px rgba(76, 201, 240, 0.5)';
                }
            });
            
            bar.addEventListener('mouseleave', () => {
                const fill = bar.querySelector('.skill-bar-fill');
                if (fill) {
                    fill.style.opacity = '1';
                    fill.style.boxShadow = 'none';
                }
            });
        });
    });
}