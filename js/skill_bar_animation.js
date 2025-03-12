/**
 * skill-bar-animation.js
 * Animates the skill bars when they come into view for a more engaging user experience
 * This script should be added to or imported in the main.js file
 */

/**
 * Initialize skill bar animations when the DOM is loaded
 * This function should be called from the main initialization in main.js
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
    
    /**
     * Function to check if element is in viewport and trigger animation
     * Called on scroll events and once on page load
     */
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
                fill.style.opacity = '0.8';
                fill.style.boxShadow = '0 0 10px rgba(76, 201, 240, 0.5)';
            });
            
            bar.addEventListener('mouseleave', () => {
                const fill = bar.querySelector('.skill-bar-fill');
                fill.style.opacity = '1';
                fill.style.boxShadow = 'none';
            });
        });
    });
}

// Export functions if using module system
// If you're not using modules, you can remove these exports
export { initializeSkillBarAnimations, addSkillBarHoverEffects };