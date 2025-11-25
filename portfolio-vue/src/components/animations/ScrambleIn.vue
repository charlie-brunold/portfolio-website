<script setup lang="ts">
import { ref, onMounted, computed, nextTick, defineExpose } from 'vue'

interface Props {
  text: string
  tag?: string
  scrambleSpeed?: number
  scrambledLetterCount?: number
  autoStart?: boolean
  startDelay?: number
}

const props = withDefaults(defineProps<Props>(), {
  tag: 'div',
  scrambleSpeed: 25,
  scrambledLetterCount: 5,
  autoStart: true,
  startDelay: 0
})

const displayText = ref('')
const isAnimating = ref(false)

// Characters to use for scrambling
const scrambleChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?'

// Check for reduced motion preference
const prefersReducedMotion = () => {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

// Get random scramble character
const getRandomChar = () => {
  return scrambleChars[Math.floor(Math.random() * scrambleChars.length)]
}

// Start the scramble animation
const start = () => {
  if (isAnimating.value || props.text.length === 0) return

  // If reduced motion is preferred, show text immediately
  if (prefersReducedMotion()) {
    displayText.value = props.text
    return
  }

  isAnimating.value = true
  let currentIndex = 0

  const animate = () => {
    if (currentIndex <= props.text.length) {
      // Build the display text
      let newDisplayText = ''

      // Add the revealed characters
      const revealedPart = props.text.slice(0, currentIndex)
      newDisplayText += revealedPart

      // Add scrambled characters for the remaining positions
      const remainingLength = Math.min(props.scrambledLetterCount, props.text.length - currentIndex)
      for (let i = 0; i < remainingLength; i++) {
        const charIndex = currentIndex + i
        if (charIndex < props.text.length) {
          // Preserve spaces and punctuation
          const originalChar = props.text[charIndex]
          if (originalChar === ' ' || /[.,:;!?'"()-]/.test(originalChar)) {
            newDisplayText += originalChar
          } else {
            newDisplayText += getRandomChar()
          }
        }
      }

      displayText.value = newDisplayText

      // Move to next character
      setTimeout(() => {
        currentIndex++
        if (currentIndex <= props.text.length) {
          animate()
        } else {
          isAnimating.value = false
          // Don't replace the text again to avoid flash
        }
      }, props.scrambleSpeed)
    }
  }

  animate()
}

// Handle highlighting for name
const formattedText = computed(() => {
  const text = displayText.value
  if (text.includes('Charlie Brunold')) {
    return text.replace('Charlie Brunold', '<span class="name-highlight">Charlie Brunold</span>')
  }
  return text
})

// Expose the start method for manual control
defineExpose({ start })

// Initialize display text
onMounted(async () => {
  await nextTick()

  // Show text immediately if reduced motion or if auto-start is disabled
  if (prefersReducedMotion() || !props.autoStart) {
    displayText.value = props.text
  }

  if (props.autoStart && !prefersReducedMotion()) {
    setTimeout(() => {
      start()
    }, props.startDelay)
  }
})
</script>

<template>
  <component
    :is="tag"
    class="scramble-text"
    :class="{ 'list-item': tag === 'li' }"
  >
    <span v-html="formattedText" class="text-content"></span>
  </component>
</template>

<style scoped>
.scramble-text {
  position: relative;
  display: block;
  font-family: monospace;
  white-space: pre-wrap;
}

/* Inherit styles from parent context */
.scramble-text.list-item {
  font-size: clamp(0.85rem, 1.2vw + 0.4rem, 1rem);
  font-weight: 500;
  color: var(--text-secondary);
  line-height: 1.4;
  padding: 0.15rem 0;
  position: relative;
  list-style: none;
  margin: 0;
  padding-left: 2rem;
}

.scramble-text.list-item::before {
  content: "•";
  color: var(--text-primary);
  position: absolute;
  left: 0;
  font-weight: 600;
}

.text-content {
  display: inline;
}

/* Name highlighting */
.scramble-text :deep(.name-highlight) {
  color: var(--text-primary);
  font-weight: 600;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .scramble-text.list-item {
    font-size: clamp(0.8rem, 3vw, 0.9rem);
    padding-left: 1.5rem;
  }

  .scramble-text.list-item::before {
    left: -0.2rem;
  }
}

/* High contrast support */
@media (prefers-contrast: high) {
  .scramble-text :deep(.name-highlight) {
    font-weight: 700;
    text-shadow: none;
  }
}
</style>