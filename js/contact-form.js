/**
 * contact-form.js - Enhanced contact form validation and submission
 * 
 * This script provides comprehensive form validation, visual feedback,
 * and simulated form submission for the portfolio contact form.
 * 
 * Features:
 * - Real-time validation with immediate feedback
 * - Custom error messages for different validation scenarios
 * - Visual indicators for valid/invalid fields
 * - Simulated form submission with success/error states
 * - Accessibility improvements
 */

/**
 * Wait for the DOM to be fully loaded before initializing
 */
document.addEventListener('DOMContentLoaded', () => {
  initializeContactForm();
});

/**
 * Initialize the contact form functionality
 * Sets up event listeners and validation behavior
 */
function initializeContactForm() {
  const contactForm = document.getElementById('contactForm');
  
  // Only proceed if contact form exists on the page
  if (!contactForm) return;
  
  // Get all form input elements
  const formInputs = contactForm.querySelectorAll('input, textarea');
  
  // Add validation on blur (when user leaves the field)
  formInputs.forEach(input => {
    // Create and append validation icons to each input container
    appendValidationIcons(input);
    
    // Add blur event for validation when user leaves a field
    input.addEventListener('blur', () => {
      validateField(input);
    });
    
    // Add input event to provide real-time feedback once user has interacted with field
    input.addEventListener('input', () => {
      // Only validate if the field has been previously marked as invalid
      if (input.parentElement.classList.contains('error')) {
        validateField(input);
      }
    });
  });
  
  // Handle form submission
  contactForm.addEventListener('submit', handleFormSubmit);
}

/**
 * Append validation icons to input fields
 * @param {HTMLElement} input - The input field element
 */
function appendValidationIcons(input) {
  // Create container for icons if needed
  let iconContainer = input.parentElement.querySelector('.validation-icons');
  
  if (!iconContainer) {
    iconContainer = document.createElement('div');
    iconContainer.className = 'validation-icons';
    
    // Add valid icon (checkmark)
    const validIcon = document.createElement('span');
    validIcon.className = 'valid-icon';
    validIcon.innerHTML = '<i class="fas fa-check-circle"></i>';
    validIcon.setAttribute('aria-hidden', 'true');
    
    // Add invalid icon (error)
    const invalidIcon = document.createElement('span');
    invalidIcon.className = 'invalid-icon';
    invalidIcon.innerHTML = '<i class="fas fa-exclamation-circle"></i>';
    invalidIcon.setAttribute('aria-hidden', 'true');
    
    // Add icons to container
    iconContainer.appendChild(validIcon);
    iconContainer.appendChild(invalidIcon);
    
    // Append icons directly to input's parent element, which should have position: relative
    input.parentElement.appendChild(iconContainer);
    
    // Make sure the input's parent has position: relative
    input.parentElement.style.position = 'relative';
  }

  // Set the icon position to be inside the input field's visual area
  const inputRect = input.getBoundingClientRect();
  const padding = 10; // padding from the right edge of input
  
  // Make sure icons appear inside the input field
  iconContainer.style.right = padding + 'px';
  
  // Adjust position based on input type
  if (input.tagName.toLowerCase() === 'textarea') {
    iconContainer.style.top = '20px';
    iconContainer.style.transform = 'none';
  } else {
    iconContainer.style.top = '50%';
    iconContainer.style.transform = 'translateY(-50%)';
  }
}

/**
 * Validate a single form field
 * @param {HTMLElement} field - The input field to validate
 * @returns {boolean} - Whether the field is valid
 */
function validateField(field) {
  const formGroup = field.closest('.form-group');
  const value = field.value.trim();
  const fieldName = field.getAttribute('placeholder') || field.name;
  
  // Find or create error message element
  let errorElement = formGroup.querySelector('.error-message');
  if (!errorElement) {
    errorElement = document.createElement('div');
    errorElement.className = 'error-message';
    formGroup.appendChild(errorElement);
  }
  
  // Default validation state
  let isValid = true;
  let errorMessage = '';
  
  // Empty field validation
  if (value === '') {
    isValid = false;
    errorMessage = `${fieldName} is required`;
  } 
  // Field-specific validation
  else {
    switch (field.id) {
      case 'name':
        // Name should be at least 2 characters
        if (value.length < 2) {
          isValid = false;
          errorMessage = 'Name should be at least 2 characters';
        }
        break;
        
      case 'email':
        // Email regex validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          isValid = false;
          errorMessage = 'Please enter a valid email address';
        }
        break;
        
      case 'subject':
        // Subject should be at least 4 characters
        if (value.length < 4) {
          isValid = false;
          errorMessage = 'Subject should be at least 4 characters';
        }
        break;
        
      case 'message':
        // Message should be at least 10 characters
        if (value.length < 10) {
          isValid = false;
          errorMessage = 'Please provide a more detailed message (at least 10 characters)';
        }
        break;
    }
  }
  
  // Update UI based on validation result
  updateFieldValidationUI(formGroup, errorElement, isValid, errorMessage);
  
  return isValid;
}

/**
 * Update the UI of a field based on validation results
 * @param {HTMLElement} formGroup - The container element of the form field
 * @param {HTMLElement} errorElement - The error message element
 * @param {boolean} isValid - Whether the field is valid
 * @param {string} errorMessage - The error message to display if invalid
 */
function updateFieldValidationUI(formGroup, errorElement, isValid, errorMessage) {
  if (isValid) {
    // Valid state UI updates
    formGroup.classList.remove('error');
    formGroup.classList.add('valid');
    errorElement.textContent = '';
    errorElement.style.display = 'none';
  } else {
    // Invalid state UI updates
    formGroup.classList.add('error');
    formGroup.classList.remove('valid');
    errorElement.textContent = errorMessage;
    errorElement.style.display = 'block';
  }
}

/**
 * Handle form submission
 * @param {Event} event - The form submission event
 */
function handleFormSubmit(event) {
  // Prevent default form submission
  event.preventDefault();
  
  const form = event.target;
  const formFields = form.querySelectorAll('input, textarea');
  
  // Validate all fields and track if all are valid
  let allFieldsValid = true;
  
  formFields.forEach(field => {
    // Validate each field
    const isFieldValid = validateField(field);
    if (!isFieldValid) {
      allFieldsValid = false;
    }
  });
  
  // If all fields are valid, proceed with submission
  if (allFieldsValid) {
    simulateFormSubmission(form);
  } else {
    // Focus the first invalid field for better accessibility
    const firstInvalidField = form.querySelector('.form-group.error input, .form-group.error textarea');
    if (firstInvalidField) {
      firstInvalidField.focus();
    }
    
    // Show summary error message
    showFormMessage('Please correct the errors in the form.', 'error');
  }
}

/**
 * Simulate form submission (since this is a front-end only project)
 * @param {HTMLElement} form - The form element
 */
function simulateFormSubmission(form) {
  // Get submit button and change its appearance
  const submitBtn = form.querySelector('button[type="submit"]');
  const originalBtnText = submitBtn.innerHTML;
  
  // Disable form and show loading indicator
  disableForm(form, true);
  submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
  
  // Collect form data (for demonstration purposes)
  const formData = {
    name: document.getElementById('name').value,
    email: document.getElementById('email').value,
    subject: document.getElementById('subject').value,
    message: document.getElementById('message').value
  };
  
  // Log the form data (in a real project, this would be sent to a server)
  console.log('Form data to be submitted:', formData);
  
  // Simulate network delay (1.5 seconds)
  setTimeout(() => {
    // 95% chance of success (for demonstration purposes)
    const isSuccess = Math.random() < 0.95;
    
    if (isSuccess) {
      // Success scenario
      showFormMessage('Thank you! Your message has been sent successfully. I\'ll get back to you soon.', 'success');
      form.reset();
      
      // Reset validation states
      form.querySelectorAll('.form-group').forEach(group => {
        group.classList.remove('valid', 'error');
      });
      
    } else {
      // Error scenario
      showFormMessage('There was an error sending your message. Please try again or contact me directly via email.', 'error');
    }
    
    // Re-enable form and restore button
    disableForm(form, false);
    submitBtn.innerHTML = originalBtnText;
    
  }, 1500);
}

/**
 * Disable/enable all form elements during submission
 * @param {HTMLElement} form - The form element
 * @param {boolean} disabled - Whether to disable or enable form elements
 */
function disableForm(form, disabled) {
  const formElements = form.querySelectorAll('input, textarea, button');
  
  formElements.forEach(element => {
    element.disabled = disabled;
  });
}

/**
 * Show a message after form submission attempt
 * @param {string} message - The message to display
 * @param {string} type - Message type ('success' or 'error')
 */
function showFormMessage(message, type) {
  // Find existing message element or create a new one
  let messageElement = document.querySelector('.form-message');
  
  if (!messageElement) {
    messageElement = document.createElement('div');
    messageElement.className = 'form-message';
    
    // Insert after the form
    const contactForm = document.getElementById('contactForm');
    contactForm.parentNode.insertBefore(messageElement, contactForm.nextSibling);
  }
  
  // Update message content and styling
  messageElement.textContent = message;
  messageElement.className = `form-message ${type}`;
  messageElement.setAttribute('role', 'alert'); // For accessibility
  
  // Trigger fade-in animation
  setTimeout(() => {
    messageElement.classList.add('visible');
  }, 10);
  
  // Remove success messages after 5 seconds
  if (type === 'success') {
    setTimeout(() => {
      messageElement.classList.remove('visible');
      
      // Remove from DOM after fade animation completes
      setTimeout(() => {
        messageElement.remove();
      }, 300);
    }, 5000);
  }
}

// Export functions if using module system (can be removed if not using modules)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    initializeContactForm,
    validateField,
    handleFormSubmit
  };
}