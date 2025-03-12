/**
 * parallax.js - Adds scroll-based parallax effects to background elements
 * Enhances the visual experience of the portfolio with subtle animations
 */

/**
 * Initialize parallax scrolling effects
 * This function creates background elements and sets up scroll listeners
 */
function initializeParallaxEffects() {
    // Create background elements for each section
    createSectionBackgrounds();
    
    // Create floating particles in the hero section
    createParticles();
    
    // Set up scroll event listener for parallax effects
    window.addEventListener('scroll', function() {
        const scrollY = window.scrollY;
        
        // Parallax for fixed background shapes
        const bgShapes = document.querySelectorAll('.bg-shape');
        bgShapes.forEach((shape, index) => {
            const speed = 0.05 * (index + 1);
            shape.style.transform = `translate(${scrollY * speed * (index % 2 ? -1 : 1)}px, ${scrollY * speed * (index % 2 ? 1 : -1)}px)`;
        });
        
        // Parallax for section-specific backgrounds
        const elements = [
            { selector: '.hero-bg-1', transform: `translate(${scrollY * 0.05}px, ${scrollY * -0.02}px) rotate(${25 + scrollY * 0.01}deg)` },
            { selector: '.hero-bg-2', transform: `translate(${scrollY * -0.05}px, ${scrollY * 0.03}px) rotate(${-15 - scrollY * 0.01}deg)` },
            { selector: '.skills-bg-1', transform: `translate(${scrollY * 0.03 - 100}px, 0)` },
            { selector: '.skills-bg-2', transform: `translate(${-scrollY * 0.03 - 150}px, 0)` },
            { selector: '.project-bg-1', transform: `translate(0, ${scrollY * 0.02 - 50}%)` },
            { selector: '.project-bg-2', transform: `translate(${scrollY * -0.04}px, ${scrollY * 0.01}px)` }
        ];
        
        elements.forEach(el => {
            const element = document.querySelector(el.selector);
            if (element) {
                element.style.transform = el.transform;
            }
        });
    
        // Update background based on section
        updateBackgroundForSection();
    });
}

/**
 * Create background elements for each section
 * Adds decorative shapes that will be animated with parallax
 */
function createSectionBackgrounds() {
    // Hero section backgrounds
    const hero = document.querySelector('.hero');
    if (hero) {
        const bg1 = document.createElement('div');
        bg1.className = 'section-bg hero-bg-1';
        
        const bg2 = document.createElement('div');
        bg2.className = 'section-bg hero-bg-2';
        
        hero.appendChild(bg1);
        hero.appendChild(bg2);
    }
    
    // Skills section backgrounds
    const skills = document.querySelector('.skills');
    if (skills) {
        const bg1 = document.createElement('div');
        bg1.className = 'section-bg skills-bg-1';
        bg1.style.cssText = `
            width: 300px;
            height: 300px;
            background-color: rgba(86, 112, 241, 0.05);
            border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%;
            top: 10%;
            left: -100px;
        `;
        
        const bg2 = document.createElement('div');
        bg2.className = 'section-bg skills-bg-2';
        bg2.style.cssText = `
            width: 400px;
            height: 400px;
            background-color: rgba(242, 112, 89, 0.03);
            border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;
            bottom: 5%;
            right: -150px;
        `;
        
        skills.appendChild(bg1);
        skills.appendChild(bg2);
    }
    
    // Projects section backgrounds
    const projects = document.querySelector('.featured-projects, .projects-grid-section');
    if (projects) {
        const bg1 = document.createElement('div');
        bg1.className = 'section-bg project-bg-1';
        bg1.style.cssText = `
            width: 500px;
            height: 500px;
            background: radial-gradient(circle, rgba(76, 201, 240, 0.05) 0%, rgba(255, 255, 255, 0) 70%);
            top: 50%;
            left: 0;
            transform: translateY(-50%);
        `;
        
        const bg2 = document.createElement('div');
        bg2.className = 'section-bg project-bg-2';
        bg2.style.cssText = `
            width: 300px;
            height: 300px;
            background: radial-gradient(circle, rgba(242, 112, 89, 0.05) 0%, rgba(255, 255, 255, 0) 70%);
            bottom: 10%;
            right: 10%;
        `;
        
        projects.appendChild(bg1);
        projects.appendChild(bg2);
    }
}

/**
 * Create and append animated particles to the hero section
 * Adds subtle floating dots for visual interest
 */
function createParticles() {
    const heroSection = document.querySelector('.hero');
    if (!heroSection) return;
    
    const particles = document.createElement('div');
    particles.className = 'particles-container';
    
    // Create several particles with random properties
    for (let i = 0; i < 15; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // Random positioning and sizing
        const size = Math.random() * 8 + 4; // between 4px and 12px
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        
        particle.style.top = `${Math.random() * 100}%`;
        particle.style.left = `${Math.random() * 100}%`;
        
        // Random animation duration and delay
        const duration = Math.random() * 20 + 10; // between 10s and 30s
        const delay = Math.random() * 5; // between 0s and 5s
        
        particle.style.animation = `float ${duration}s ${delay}s infinite alternate`;
        
        // Random opacity
        particle.style.opacity = (Math.random() * 0.3 + 0.1).toString();
        
        // Random color - either primary or secondary
        if (Math.random() > 0.5) {
            particle.style.background = 'var(--primary-color)';
        } else {
            particle.style.background = 'var(--secondary-color)';
        }
        
        particles.appendChild(particle);
    }
    
    heroSection.appendChild(particles);
}

// Detect which section is currently in view and adjust background accordingly
function updateBackgroundForSection() {
    const scrollPosition = window.scrollY + (window.innerHeight / 2);
    
    // Get all major sections
    const sections = document.querySelectorAll('section');
    const bgShapes = document.querySelectorAll('.bg-shape');
    
    // Determine which section is currently in view
    let currentSection = null;
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionBottom = sectionTop + section.offsetHeight;
        
        if (scrollPosition >= sectionTop && scrollPosition <= sectionBottom) {
            currentSection = section.id || section.className;
        }
    });
    
    // Adjust background based on current section
    if (currentSection) {
        if (currentSection.includes('hero')) {
            // Hero section - blue dominant
            bgShapes[0].style.opacity = '0.6';
            bgShapes[0].style.filter = 'blur(60px)';
            bgShapes[1].style.opacity = '0.3';
            bgShapes[2].style.opacity = '0.4';
        } 
        else if (currentSection.includes('skills') || currentSection.includes('about')) {
            // Skills section - balanced colors
            bgShapes[0].style.opacity = '0.3';
            bgShapes[1].style.opacity = '0.5'; 
            bgShapes[1].style.filter = 'blur(70px)';
            bgShapes[2].style.opacity = '0.4';
        }
        else if (currentSection.includes('project')) {
            // Projects section - coral dominant
            bgShapes[0].style.opacity = '0.3';
            bgShapes[1].style.opacity = '0.6';
            bgShapes[1].style.filter = 'blur(60px)';
            bgShapes[2].style.opacity = '0.3';
        }
        else if (currentSection.includes('contact')) {
            // Contact section - purple dominant
            bgShapes[0].style.opacity = '0.3';
            bgShapes[1].style.opacity = '0.3';
            bgShapes[2].style.opacity = '0.6';
            bgShapes[2].style.filter = 'blur(50px)';
        }
    }
}

// Initialize on DOM content loaded
document.addEventListener('DOMContentLoaded', initializeParallaxEffects);