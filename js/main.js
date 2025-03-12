/**
 * main.js - Main JavaScript functionality for portfolio website
 * This file contains all the JavaScript functionality needed for the portfolio website,
 * including form validation, navigation enhancements, and simple animations.
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
    initializeAnimations();
});

/**
 * Navigation functionality
 * Adds active class to current page in navigation and handles mobile menu
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
    
    // In the future, mobile navigation toggle can be added here
}

/**
 * Contact form validation and submission handling
 * Validates the form fields and prepares for submission
 */
function initializeContactForm() {
    console.log('Initializing contact form');
    
    // Find the contact form - only proceed if it exists
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        // Add submit event listener
        contactForm.addEventListener('submit', function(event) {
            // Prevent the default form submission behavior
            event.preventDefault();
            
            // Get all form fields
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const subject = document.getElementById('subject').value;
            const message = document.getElementById('message').value;
            
            // Validate form fields
            if (validateContactForm(name, email, subject, message)) {
                console.log('Form validated successfully');
                
                // In a real implementation, the form would be submitted to a server
                console.log('Form data:', { name, email, subject, message });
                
                // Show a success message to the user
                alert('Your message has been sent successfully!');
                
                // Reset the form
                contactForm.reset();
            }
        });
    }
}

/**
 * Validate contact form fields
 * @param {string} name - The user's name
 * @param {string} email - The user's email
 * @param {string} subject - The message subject
 * @param {string} message - The message content
 * @returns {boolean} - Whether the form is valid
 */
function validateContactForm(name, email, subject, message) {
    // Check if any field is empty
    if (!name || !email || !subject || !message) {
        alert('Please fill in all fields.');
        return false;
    }
    
    // Validate email format using a simple regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert('Please enter a valid email address.');
        return false;
    }
    
    // Check minimum message length
    if (message.length < 10) {
        alert('Message is too short. Please provide more details.');
        return false;
    }
    
    // If we reach here, the form is valid
    return true;
}

/**
 * Project filtering functionality
 * Allows filtering projects by category
 */
function initializeProjectFilters() {
    console.log('Initializing project filters');
    
    // Find filter buttons - only proceed if they exist
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    if (filterButtons.length > 0) {
        // Find all project cards
        const projectCards = document.querySelectorAll('.project-card');
        
        // Add click event listener to each filter button
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Get the filter value
                const filter = this.getAttribute('data-filter');
                console.log(`Filter selected: ${filter}`);
                
                // Remove active class from all buttons
                filterButtons.forEach(btn => btn.classList.remove('active'));
                
                // Add active class to current button
                this.classList.add('active');
                
                // Show/hide projects based on filter
                projectCards.forEach(card => {
                    if (filter === 'all') {
                        // Show all projects
                        card.style.display = 'block';
                    } else {
                        // Check if card has the selected category
                        if (card.getAttribute('data-category') === filter) {
                            card.style.display = 'block';
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
 * Simple animations for page elements
 * Adds subtle animations to improve user experience
 */
function initializeAnimations() {
    console.log('Initializing animations');
    
    // Find all project cards
    const projectCards = document.querySelectorAll('.project-card');
    
    // Add animation class when they come into view
    // This is a simple implementation that adds classes on page load
    // In a more advanced version, you could use Intersection Observer API
    setTimeout(() => {
        projectCards.forEach((card, index) => {
            // Stagger the animations slightly
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }, 300);
    
    // Add smooth scrolling for anchor links
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Get the target element
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                // Scroll smoothly to the target
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

/**
 * Helper function to check if an element is in the viewport
 * Used to trigger animations when scrolling
 * @param {HTMLElement} el - The element to check
 * @returns {boolean} - Whether the element is in the viewport
 */
function isInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

/**
 * Additional functionality to be added in future phases:
 * 1. Dark/light mode toggle
 * 2. Image lazy loading
 * 3. More advanced animations
 * 4. Portfolio filtering with transitions
 * 5. Interactive data visualizations for skills
 */