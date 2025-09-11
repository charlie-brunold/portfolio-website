// Word-by-word animation on page load
function animateTitle() {
    const titleElement = document.getElementById('animated-title');
    const originalText = "Hey, I'm Charlie, an AI for Business student using Python to solve complex business problems.";
    const words = originalText.split(' ');
    
    // Nonlinear timing pattern for more visual interest
    // Creates varied pacing: quick, pause, quick-quick, pause, etc.
    const timingPattern = [
        0,      // "Hey," - immediate
        0.2,    // "I'm" - quick
        0.4,    // "Charlie," - quick
        0.9,    // "an" - longer pause
        1.0,    // "AI" - quick
        1.1,    // "for" - very quick
        1.2,    // "Business" - quick
        1.5,    // "student" - medium pause
        1.7,    // "using" - quick
        1.9,    // "Python" - quick
        2.4,    // "to" - longer pause
        2.5,    // "solve" - quick
        2.7,    // "complex" - quick
        2.9,    // "business" - quick
        3.2     // "problems." - medium
    ];
    
    // Clear the original text and wrap each word in a span
    titleElement.innerHTML = '';
    words.forEach((word, index) => {
        const wordSpan = document.createElement('span');
        wordSpan.className = 'word';
        
        // Special handling for "Charlie," - add the 3D hover effect
        if (word === "Charlie,") {
            const charlieSpan = document.createElement('span');
            charlieSpan.id = 'charlie-3d';
            charlieSpan.className = 'charlie-hover';
            charlieSpan.textContent = 'Charlie';
            wordSpan.appendChild(charlieSpan);
            wordSpan.appendChild(document.createTextNode(','));
        }
        // Special handling for "Python" - add the 3D hover effect for skills
        else if (word === "Python") {
            const skillSpan = document.createElement('span');
            skillSpan.id = 'skill-3d';
            skillSpan.className = 'skill-hover';
            skillSpan.textContent = 'Python';
            wordSpan.appendChild(skillSpan);
        } else {
            wordSpan.textContent = word;
        }
        
        // Use the timing pattern, or fallback to linear if we have more words than expected
        const delay = timingPattern[index] || (index * 0.15);
        wordSpan.style.animationDelay = `${delay}s`;
        titleElement.appendChild(wordSpan);
    });
    
    // Setup 3D effects after animation
    setTimeout(() => {
        setup3DCharlie();
        setup3DSkill();
    }, 4000); // Wait for title animation to complete
}

// 3D Charlie hover effect setup
function setup3DCharlie() {
    const charlieElement = document.getElementById('charlie-3d');
    if (!charlieElement) return;
    
    const word = charlieElement.innerText.split("");
    charlieElement.innerHTML = "";
    
    // Create first div with original letters (Charlie)
    const firstDiv = document.createElement('div');
    word.forEach((letter, idx) => {
        const span = document.createElement('span');
        span.textContent = letter;
        span.style.setProperty('--index', idx);
        firstDiv.appendChild(span);
    });
    charlieElement.appendChild(firstDiv);
    
    // Create second div with "Brunold" for 3D effect
    const secondDiv = document.createElement('div');
    const brunoldLetters = "Brunold".split("");
    brunoldLetters.forEach((letter, idx) => {
        const span = document.createElement('span');
        span.textContent = letter;
        span.style.setProperty('--index', idx);
        secondDiv.appendChild(span);
    });
    charlieElement.appendChild(secondDiv);
}

// 3D Skill hover effect setup
function setup3DSkill() {
    const skillElement = document.getElementById('skill-3d');
    if (!skillElement) return;
    
    const word = skillElement.innerText.split("");
    skillElement.innerHTML = "";
    
    // Create first div with original letters (Python)
    const firstDiv = document.createElement('div');
    word.forEach((letter, idx) => {
        const span = document.createElement('span');
        span.textContent = letter;
        span.style.setProperty('--index', idx);
        firstDiv.appendChild(span);
    });
    skillElement.appendChild(firstDiv);
    
    // Create second div with "SQL" for 3D effect
    const secondDiv = document.createElement('div');
    const sqlLetters = "SQL".split("");
    sqlLetters.forEach((letter, idx) => {
        const span = document.createElement('span');
        span.textContent = letter;
        span.style.setProperty('--index', idx);
        secondDiv.appendChild(span);
    });
    skillElement.appendChild(secondDiv);
}

// Smooth scrolling for navigation links
document.addEventListener('DOMContentLoaded', function() {
    // Trigger the title animation
    animateTitle();
    const navLinks = document.querySelectorAll('.nav-link, .cta-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Only handle anchor links (starting with #)
            if (href && href.startsWith('#')) {
                e.preventDefault();
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    const navHeight = document.querySelector('.navigation').offsetHeight;
                    const targetPosition = targetElement.offsetTop - navHeight - 20;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // Add scroll effect to navigation
    let lastScrollTop = 0;
    const nav = document.querySelector('.navigation');
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > lastScrollTop && scrollTop > 100) {
            // Scrolling down
            nav.style.transform = 'translateY(-100%)';
        } else {
            // Scrolling up
            nav.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    });
});