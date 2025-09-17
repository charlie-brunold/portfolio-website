<template>
  <div class="ascii-portrait-container">
    <pre class="ascii-portrait" ref="asciiElement">{{ displayedContent }}</pre>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const asciiContent = ref('')
const displayedContent = ref('')
const asciiElement = ref<HTMLElement>()
const isAnimating = ref(false)

// Cubic bezier easing function - ease-out (starts fast, slows down)
const easeOutCubic = (t: number): number => {
  return 1 - Math.pow(1 - t, 3)
}

// Character fade sequence from solid to transparent to final
const getFadeCharacter = (finalChar: string, progress: number): string => {
  if (progress >= 1) return finalChar

  // Define fade sequence: solid → medium → light → very light → final
  const fadeSequence = ['█', '▓', '▒', '░']

  // Calculate which fade step we're on (0-3, then final)
  const fadeSteps = fadeSequence.length
  const stepProgress = progress * (fadeSteps + 1) // +1 to include final character
  const currentStep = Math.floor(stepProgress)

  if (currentStep >= fadeSteps) {
    return finalChar
  }

  return fadeSequence[currentStep]
}

const startRevealAnimation = () => {
  if (isAnimating.value || !asciiContent.value) return

  isAnimating.value = true
  const finalContent = asciiContent.value

  // Create initial content preserving exact structure - replace non-whitespace, non-newline chars with spaces
  const maskedContent = finalContent.replace(/[^\s\n]/g, ' ')
  displayedContent.value = maskedContent

  // Animation settings
  const animationDuration = 4500 // Increased to 4.5 seconds for more dramatic effect
  const startTime = performance.now()

  const chars = finalContent.split('')
  const displayChars = maskedContent.split('')

  // Create array of non-whitespace, non-newline character indices for random reveal
  const revealableIndices: number[] = []
  chars.forEach((char, index) => {
    if (char !== '\n' && char !== ' ' && char.trim() !== '') {
      revealableIndices.push(index)
    }
  })

  // Shuffle the indices for random reveal order
  for (let i = revealableIndices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[revealableIndices[i], revealableIndices[j]] = [revealableIndices[j], revealableIndices[i]]
  }

  // Track individual character start times for staggered fade effect
  const charStartTimes: number[] = new Array(revealableIndices.length).fill(0)
  const charAnimationDuration = animationDuration * 0.95 // Each char takes 95% of total time
  const totalRevealableChars = revealableIndices.length

  const animateReveal = (currentTime: number) => {
    const elapsed = currentTime - startTime
    const progress = Math.min(elapsed / animationDuration, 1)

    // Apply cubic bezier easing for stagger timing
    const easedProgress = easeOutCubic(progress)

    // Calculate how many characters should have started animating
    const targetStartedCount = Math.floor(easedProgress * totalRevealableChars)

    // Start character animations based on staggered timing
    for (let i = 0; i < targetStartedCount; i++) {
      if (charStartTimes[i] === 0) {
        charStartTimes[i] = currentTime
      }
    }

    // Update each character based on its individual progress
    let allCharactersComplete = true
    for (let i = 0; i < revealableIndices.length; i++) {
      const indexToReveal = revealableIndices[i]
      const finalChar = chars[indexToReveal]

      if (charStartTimes[i] > 0) {
        // Character has started animating
        const charElapsed = currentTime - charStartTimes[i]
        const charProgress = Math.min(charElapsed / charAnimationDuration, 1)
        const charEasedProgress = easeOutCubic(charProgress)

        if (charProgress < 1) {
          allCharactersComplete = false
        }

        displayChars[indexToReveal] = getFadeCharacter(finalChar, charEasedProgress)
      } else {
        // Character hasn't started yet
        allCharactersComplete = false
      }
    }

    displayedContent.value = displayChars.join('')

    // Continue animation until all individual characters are complete
    if (!allCharactersComplete) {
      requestAnimationFrame(animateReveal)
    } else {
      // Ensure all characters are fully revealed at the end
      for (let i = 0; i < revealableIndices.length; i++) {
        const indexToReveal = revealableIndices[i]
        displayChars[indexToReveal] = chars[indexToReveal]
      }
      displayedContent.value = displayChars.join('')
      isAnimating.value = false
    }
  }

  // Start the animation
  requestAnimationFrame(animateReveal)
}

onMounted(async () => {
  try {
    // Import the ASCII content as a text file using Vite's static asset handling
    const asciiModule = await import('/src/assets/ascii.txt?raw')
    asciiContent.value = asciiModule.default

    // Check if this is the first visit in this session
    const hasSeenAnimation = sessionStorage.getItem('ascii-animation-seen')

    if (hasSeenAnimation) {
      // Show final portrait immediately on subsequent visits
      displayedContent.value = asciiContent.value
    } else {
      // First visit - show animation
      const maskedContent = asciiContent.value.replace(/[^\s\n]/g, ' ')
      displayedContent.value = maskedContent

      // Start the reveal animation after a short delay
      setTimeout(() => {
        startRevealAnimation()
        // Mark animation as seen for this session
        sessionStorage.setItem('ascii-animation-seen', 'true')
      }, 500)
    }
  } catch (error) {
    console.error('Failed to load ASCII content:', error)
    // Fallback: try fetching from public directory
    try {
      const response = await fetch('/ascii.txt')
      const content = await response.text()
      asciiContent.value = content

      // Check if this is the first visit in this session
      const hasSeenAnimation = sessionStorage.getItem('ascii-animation-seen')

      if (hasSeenAnimation) {
        // Show final portrait immediately on subsequent visits
        displayedContent.value = asciiContent.value
      } else {
        // First visit - show animation
        const maskedContent = asciiContent.value.replace(/[^\s\n]/g, ' ')
        displayedContent.value = maskedContent

        // Start the reveal animation after a short delay
        setTimeout(() => {
          startRevealAnimation()
          // Mark animation as seen for this session
          sessionStorage.setItem('ascii-animation-seen', 'true')
        }, 500)
      }
    } catch (fallbackError) {
      console.error('Fallback fetch also failed:', fallbackError)
      displayedContent.value = 'Failed to load ASCII portrait'
    }
  }
})
</script>

<style scoped>
.ascii-portrait-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  overflow: hidden;
  padding: 20px;
  box-sizing: border-box;
}

.ascii-portrait {
  font-family: 'Courier New', 'Consolas', 'Monaco', monospace;
  line-height: 1;
  white-space: pre;
  margin: 0;
  padding: 0;
  color: #1a1a1a;
  text-align: center;
  overflow: visible;

  /* Base size for desktop */
  font-size: 1.8px;

  /* Responsive scaling */
  transform-origin: center center;
  max-width: 100%;
  max-height: 80vh;

  /* Performance optimizations */
  will-change: transform;
  backface-visibility: hidden;

  /* Scale to fit container while maintaining aspect ratio */
  transform: scale(1);

  /* Ensure perfect character alignment */
  letter-spacing: 0;
  word-spacing: 0;
  text-rendering: optimizeSpeed;

  /* Prevent any text artifacts during animation */
  -webkit-font-smoothing: auto;
  -moz-osx-font-smoothing: auto;
}

/* Tablet and smaller desktop screens */
@media (max-width: 1200px) {
  .ascii-portrait {
    font-size: 1.5px;
    max-height: 75vh;
  }
}

/* Small tablets */
@media (max-width: 768px) {
  .ascii-portrait {
    font-size: 1.2px;
    max-height: 70vh;
  }

  .ascii-portrait-container {
    padding: 15px;
  }
}

/* Mobile phones */
@media (max-width: 480px) {
  .ascii-portrait {
    font-size: 0.8px;
    max-height: 70vh;
  }

  .ascii-portrait-container {
    padding: 10px;
    min-height: 70vh;
  }
}

/* Very small mobile screens */
@media (max-width: 360px) {
  .ascii-portrait {
    font-size: 0.6px;
    max-height: 65vh;
  }

  .ascii-portrait-container {
    padding: 8px;
    min-height: 65vh;
  }
}

/* Large desktop screens */
@media (min-width: 1400px) {
  .ascii-portrait {
    font-size: 2.2px;
    max-height: 85vh;
  }
}

/* Extra large screens */
@media (min-width: 1800px) {
  .ascii-portrait {
    font-size: 2.8px;
    max-height: 90vh;
  }
}


/* Ensure no text selection issues */
.ascii-portrait {
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
}
</style>