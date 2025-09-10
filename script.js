// Word-by-word animation on page load
function animateTitle() {
    const titleElement = document.getElementById('animated-title');
    const originalText = "I'm Charlie, a software engineer building thoughtful digital experiences.";
    const words = originalText.split(' ');
    
    // Nonlinear timing pattern for more visual interest
    // Creates varied pacing: quick, pause, quick-quick, pause, etc.
    const timingPattern = [
        0,      // "I'm" - immediate
        0.2,    // "Charlie," - quick
        0.7,    // "a" - longer pause
        0.9,    // "software" - quick
        1.0,    // "engineer" - very quick
        1.4,    // "building" - medium pause
        1.6,    // "thoughtful" - quick
        2.1,    // "digital" - longer pause
        2.4     // "experiences." - medium
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
        } else {
            wordSpan.textContent = word;
        }
        
        // Use the timing pattern, or fallback to linear if we have more words than expected
        const delay = timingPattern[index] || (index * 0.15);
        wordSpan.style.animationDelay = `${delay}s`;
        titleElement.appendChild(wordSpan);
    });
    
    // Setup 3D effect for Charlie after animation
    setTimeout(() => {
        setup3DCharlie();
    }, 3000); // Wait for title animation to complete
}

// 3D Charlie hover effect setup
function setup3DCharlie() {
    const charlieElement = document.getElementById('charlie-3d');
    if (!charlieElement) return;
    
    const word = charlieElement.innerText.split("");
    charlieElement.innerHTML = "";
    
    // Create first div with original letters
    const firstDiv = document.createElement('div');
    word.forEach((letter, idx) => {
        const span = document.createElement('span');
        span.textContent = letter;
        span.style.setProperty('--index', idx);
        firstDiv.appendChild(span);
    });
    charlieElement.appendChild(firstDiv);
    
    // Create cloned div for 3D effect (CSS handles positioning)
    const cloneDiv = firstDiv.cloneNode(true);
    charlieElement.appendChild(cloneDiv);
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