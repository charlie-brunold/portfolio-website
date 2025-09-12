<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'

const footerText = "Last updated September 2025"
const isHovering = ref(false)
let cycleInterval: number | null = null
let hoverTimeout: number | null = null

// Split text into characters for individual animation
const footerChars = computed(() => [...footerText])

// Animation state for each character
const animationClasses = ref<string[]>(new Array(footerText.length).fill(''))

const triggerBobbingWave = () => {
  // Clear any existing settle animations
  animationClasses.value.fill('')
  
  // Animate letters sequentially with slight delay
  footerChars.value.forEach((_, index) => {
    setTimeout(() => {
      if (isHovering.value) {
        animationClasses.value[index] = 'bobbing'
        
        // Remove bobbing class after animation completes
        setTimeout(() => {
          if (isHovering.value) {
            animationClasses.value[index] = ''
          }
        }, 1200) // Match animation duration
      }
    }, index * 60) // 60ms delay between letters for smoother wave effect
  })
}

const startContinuousCycling = () => {
  if (cycleInterval) return // Already cycling
  
  // Trigger first wave immediately
  triggerBobbingWave()
  
  // Set up continuous cycling
  cycleInterval = setInterval(() => {
    if (isHovering.value) {
      triggerBobbingWave()
    } else {
      // Stop cycling immediately when not hovering
      if (cycleInterval) {
        clearInterval(cycleInterval)
        cycleInterval = null
      }
    }
  }, 1800) // Cycle every 1.8 seconds for more relaxed timing
}

const startImmediateSettling = () => {
  // Clear cycling immediately
  if (cycleInterval) {
    clearInterval(cycleInterval)
    cycleInterval = null
  }
  
  // Start settling animation for all letters
  footerChars.value.forEach((_, index) => {
    setTimeout(() => {
      animationClasses.value[index] = 'settling'
      
      // Remove settling class after animation completes
      setTimeout(() => {
        animationClasses.value[index] = ''
      }, 2400) // Match settling animation duration
    }, index * 30) // Slower sequence for smoother settling
  })
}

const handleMouseEnter = () => {
  if (hoverTimeout) clearTimeout(hoverTimeout)
  
  isHovering.value = true
  startContinuousCycling()
}

const handleMouseLeave = () => {
  isHovering.value = false
  
  // Small delay to allow any in-progress letter animations to complete naturally
  hoverTimeout = setTimeout(() => {
    startImmediateSettling()
  }, 50)
}
</script>

<template>
  <p 
    class="last-updated" 
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
  >
    <span
      v-for="(char, index) in footerChars"
      :key="index"
      :class="[
        'footer-letter',
        { 'space': char === ' ' },
        animationClasses[index]
      ]"
    >
      {{ char === ' ' ? '\u00A0' : char }}
    </span>
  </p>
</template>

<style scoped>
.last-updated {
  color: var(--secondary-color);
  font-size: 14px;
  margin: 0;
  font-family: var(--font-mono);
  cursor: pointer;
  user-select: none;
}

.footer-letter {
  display: inline-block;
  transition: transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  transform-origin: bottom center;
}

.footer-letter.space {
  width: 0.3em;
}

.footer-letter.bobbing {
  animation: footerBob 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
}

.footer-letter.settling {
  animation: footerSettle 2.4s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
}

@keyframes footerBob {
  0% { transform: translateY(0px); }
  40% { transform: translateY(-6px); }
  70% { transform: translateY(-3px); }
  100% { transform: translateY(0px); }
}

@keyframes footerSettle {
  0% { transform: translateY(0px); }
  20% { transform: translateY(-4px); }
  40% { transform: translateY(-1px); }
  60% { transform: translateY(-2px); }
  80% { transform: translateY(-0.5px); }
  100% { transform: translateY(0px); }
}
</style>