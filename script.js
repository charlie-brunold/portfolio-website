// Word-by-word animation on page load
function animateTitle() {
    const titleElement = document.getElementById('animated-title');
    const originalText = "Hey, I'm Charlie, an AI for Business student using <skill-rolodex></skill-rolodex> to solve <br> complex business challenges.";
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
        1.9,    // "<skill-rolodex></skill-rolodex>" - quick
        2.4,    // "to" - longer pause
        2.5,    // "solve" - quick
        2.6,    // "<br>" - immediate (no visual delay)
        2.8,    // "complex" - quick
        3.0,    // "business" - quick
        3.3     // "challenges." - medium
    ];
    
    // Clear the original text and wrap each word in a span
    titleElement.innerHTML = '';
    words.forEach((word, index) => {
        // Special handling for line break - don't wrap in span
        if (word === "<br>") {
            const brElement = document.createElement('br');
            brElement.className = 'line-break';
            const delay = timingPattern[index] || (index * 0.15);
            brElement.style.animationDelay = `${delay}s`;
            brElement.style.animation = `fadeInWord 0.8s ease-out forwards`;
            brElement.style.opacity = '0';
            titleElement.appendChild(brElement);
            return;
        }
        
        const wordSpan = document.createElement('span');
        wordSpan.className = 'word';
        
        // Special handling for "Charlie," - add emphasis class
        if (word === "Charlie,") {
            wordSpan.textContent = word;
            wordSpan.classList.add('charlie');
        }
        // Special handling for skill rolodex placeholder
        else if (word === "<skill-rolodex></skill-rolodex>") {
            const rolodexContainer = document.createElement('span');
            rolodexContainer.id = 'skill-rolodex';
            rolodexContainer.className = 'skill-rolodex';
            wordSpan.appendChild(rolodexContainer);
        } else {
            wordSpan.textContent = word;
        }
        
        // Use the timing pattern, or fallback to linear if we have more words than expected
        const delay = timingPattern[index] || (index * 0.15);
        wordSpan.style.animationDelay = `${delay}s`;
        titleElement.appendChild(wordSpan);
    });
    
    // Pre-initialize skill rolodex early so it's ready when its word appears
    // Initialize it after a short delay to allow DOM to settle, but well before the skill word (1.9s)
    setTimeout(() => {
        setupSkillRolodex();
    }, 500); // Initialize at 0.5s, ready for 1.9s appearance
    
}


// Skill Rolodex Animation Setup
function setupSkillRolodex() {
    const rolodexElement = document.getElementById('skill-rolodex');
    if (!rolodexElement) return;
    
    
    // Skills array - easily expandable
    const skills = ['Python', 'SQL', 'C++', 'R', 'Tableau', 'ML', 'data analytics', 'statistics', 'C#', 'Pandas', 'NumPy', 'JMP'];
    let currentIndex = 0;
    
    // Create hidden measurement element that inherits title styling
    const measureElement = document.createElement('span');
    measureElement.className = 'skill-measure';
    rolodexElement.appendChild(measureElement);
    
    // Get computed font size for accurate padding calculations
    const computedStyle = window.getComputedStyle(rolodexElement);
    const fontSize = parseFloat(computedStyle.fontSize);
    const paddingEm = 0.4; // Total horizontal padding (0.2em * 2)
    const paddingPx = paddingEm * fontSize;
    
    // Pre-calculate widths for all skills (including responsive padding)
    const skillWidths = skills.map(skill => {
        measureElement.textContent = skill;
        return measureElement.getBoundingClientRect().width + paddingPx;
    });
    
    // Set initial width
    rolodexElement.style.width = skillWidths[0] + 'px';
    
    // Get or create the skill display element (it might already exist from initial setup)
    let skillDisplay = rolodexElement.querySelector('.skill-display');
    if (!skillDisplay) {
        skillDisplay = document.createElement('span');
        skillDisplay.className = 'skill-display skill-active';
        skillDisplay.textContent = skills[0];
        rolodexElement.appendChild(skillDisplay);
    }
    
    
    // Function to animate to next skill
    function animateNextSkill() {
        currentIndex = (currentIndex + 1) % skills.length;
        const nextSkill = skills[currentIndex];
        const nextWidth = skillWidths[currentIndex];
        
        // Start width animation slightly before text animation for smooth feel
        rolodexElement.style.width = nextWidth + 'px';
        
        // Small delay to let width animation start, then animate text
        setTimeout(() => {
            // Create new skill element for incoming animation
            const newSkillElement = document.createElement('span');
            newSkillElement.className = 'skill-display skill-entering';
            newSkillElement.textContent = nextSkill;
            rolodexElement.appendChild(newSkillElement);
            
            // Animate current skill out (upward)
            skillDisplay.classList.add('skill-exiting');
            
            // Animate new skill in (from below)
            requestAnimationFrame(() => {
                newSkillElement.classList.remove('skill-entering');
                newSkillElement.classList.add('skill-active');
            });
            // Clean up after animation
            setTimeout(() => {
                if (skillDisplay.parentNode) {
                    skillDisplay.parentNode.removeChild(skillDisplay);
                }
                skillDisplay.className = 'skill-display skill-active';
                skillDisplay.textContent = nextSkill;
                
                // Remove the temporary element and update reference
                if (newSkillElement.parentNode) {
                    newSkillElement.parentNode.removeChild(newSkillElement);
                }
                rolodexElement.appendChild(skillDisplay);
            }, 600); // Match animation duration
        }, 100); // Small delay to let width animation lead
    }
    
    // Start the continuous animation with visibility handling
    let animationInterval;
    
    function startAnimation() {
        if (animationInterval) clearInterval(animationInterval);
        animationInterval = setInterval(animateNextSkill, 2000);
    }
    
    function stopAnimation() {
        if (animationInterval) {
            clearInterval(animationInterval);
            animationInterval = null;
        }
    }
    
    // Handle tab visibility changes
    document.addEventListener('visibilitychange', function() {
        if (document.hidden) {
            stopAnimation();
        } else {
            startAnimation();
        }
    });
    
    // Start the animation initially
    startAnimation();
    
    // Cleanup: Remove measurement element (optional, but clean)
    // Could be removed immediately since we have all measurements
    setTimeout(() => {
        if (measureElement.parentNode) {
            measureElement.parentNode.removeChild(measureElement);
        }
    }, 1000);
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
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        
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