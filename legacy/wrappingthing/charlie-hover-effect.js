/* 3D Charlie Hover Effect JavaScript - Extracted for Future Use */
/* This sets up the 3D flip effect where "Charlie" transforms to "Brunold" on hover */

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

/* Usage Instructions:
 * 1. Include the charlie-hover-effect.css file
 * 2. Add an element with id="charlie-3d" and class="charlie-hover"
 * 3. Call setup3DCharlie() after the element is in the DOM
 * 
 * Example HTML:
 * <span id="charlie-3d" class="charlie-hover">Charlie</span>
 * 
 * Example JavaScript:
 * setTimeout(() => {
 *     setup3DCharlie();
 * }, 1000); // Call after DOM is ready
 */