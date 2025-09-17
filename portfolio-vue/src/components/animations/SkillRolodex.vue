<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, nextTick, watch } from 'vue'
import { useResponsiveAnimation } from '@/composables/useResponsiveAnimation'

// Skills array - easily expandable
const skills = ['Python', 'SQL', 'C++', 'R', 'Tableau', 'ML', 'data analytics', 'statistics', 'C#', 'Pandas', 'NumPy', 'JMP']
const currentIndex = ref(0)
const rolodexElement = ref<HTMLElement>()
const skillDisplay = ref<HTMLElement>()

// Animation state
let animationInterval: number | null = null
const skillWidths = ref<number[]>([])

// Use responsive animation composable
const {
  shouldAnimate,
  measureText,
  observeElement,
  clearMeasurementCache,
  debounce
} = useResponsiveAnimation({
  debounceDelay: 100,
  respectReducedMotion: true,
  pauseOnHidden: true
})

// Current skill computed property
const currentSkill = computed(() => skills[currentIndex.value])

// Current width as CSS custom property
const currentWidth = computed(() => {
  const width = skillWidths.value[currentIndex.value]
  return width ? `${width}px` : 'auto'
})

// Calculate skill widths using robust measuring system
const calculateSkillWidths = async () => {
  await nextTick()

  if (!rolodexElement.value) return

  try {
    const computedStyle = window.getComputedStyle(rolodexElement.value)
    const fontSize = parseFloat(computedStyle.fontSize)
    const paddingEm = 0.5 // Total horizontal padding (0.25em * 2)
    const paddingPx = paddingEm * fontSize

    // Use robust measuring system with fallbacks
    skillWidths.value = skills.map(skill => {
      const measurement = measureText(skill, rolodexElement.value!)
      return Math.ceil(measurement.width + paddingPx)
    })

    // Update CSS custom property for immediate effect
    if (rolodexElement.value) {
      rolodexElement.value.style.setProperty('--skill-width', currentWidth.value)
    }
  } catch (error) {
    console.warn('Skill width calculation failed, using fallback:', error)
    // Fallback to character-based calculation
    const avgCharWidth = 12 // Reasonable fallback
    skillWidths.value = skills.map(skill => (skill.length * avgCharWidth) + 20)
  }
}

// Function to animate to next skill
const animateNextSkill = () => {
  if (!shouldAnimate.value) return

  currentIndex.value = (currentIndex.value + 1) % skills.length

  // Update CSS custom property for width transition
  if (rolodexElement.value) {
    rolodexElement.value.style.setProperty('--skill-width', currentWidth.value)
  }
}

// Animation management with respect for user preferences
const startAnimation = () => {
  if (!shouldAnimate.value) return

  if (animationInterval) clearInterval(animationInterval)
  animationInterval = setInterval(animateNextSkill, 2000)
}

const stopAnimation = () => {
  if (animationInterval) {
    clearInterval(animationInterval)
    animationInterval = null
  }
}

// Watch shouldAnimate to start/stop based on visibility and motion preference
watch(shouldAnimate, (animate) => {
  if (animate) {
    startAnimation()
  } else {
    stopAnimation()
  }
})

// Setup resize observer and font loading handlers
let cleanupObserver: (() => void) | null = null

const handleResize = () => {
  debounce(() => {
    clearMeasurementCache()
    calculateSkillWidths()
  })
}

onMounted(async () => {
  await calculateSkillWidths()

  if (rolodexElement.value) {
    // Setup resize observer for automatic recalculation
    cleanupObserver = observeElement(rolodexElement.value, handleResize)
  }

  // Start animation if should animate
  if (shouldAnimate.value) {
    startAnimation()
  }
})

onUnmounted(() => {
  stopAnimation()
  if (cleanupObserver) {
    cleanupObserver()
  }
})
</script>

<template>
  <span
    ref="rolodexElement"
    class="skill-rolodex"
    :style="{ '--skill-width': currentWidth }"
  >
    <!-- Skill display with Vue transition -->
    <Transition name="skill-transition" appear>
      <span
        :key="currentSkill"
        ref="skillDisplay"
        class="skill-display"
      >
        {{ currentSkill }}
      </span>
    </Transition>
  </span>
</template>

<style scoped>
.skill-rolodex {
  --skill-width: auto;
  --padding-horizontal: 0.25em;

  position: relative;
  display: inline-block;
  white-space: nowrap;
  height: 1em;
  overflow: hidden;
  vertical-align: baseline;
  width: var(--skill-width);
  transition: width 0.5s var(--animation-bezier, cubic-bezier(0.4, 0, 0.2, 1));
  padding: 0 var(--padding-horizontal);
  transform: translateY(0.15em);
  will-change: width;
}

.skill-display {
  position: absolute;
  top: 50%;
  left: var(--padding-horizontal);
  width: calc(100% - calc(var(--padding-horizontal) * 2));
  display: inline-block;
  line-height: inherit;
  transform: translateY(-50%);
  font-weight: 600;
  color: var(--text-primary, #1a1a1a);
  white-space: nowrap;
  overflow: visible;
  will-change: transform;
}

/* Vue Transitions with enhanced performance */
.skill-transition-enter-active {
  transition: transform 0.5s var(--animation-bezier, cubic-bezier(0.4, 0, 0.2, 1));
  transition-delay: 0.1s;
}

.skill-transition-leave-active {
  transition: transform 0.4s var(--animation-bezier, cubic-bezier(0.4, 0, 0.2, 1));
}

.skill-transition-enter-from {
  transform: translateY(-50%) translateY(100%);
}

.skill-transition-leave-to {
  transform: translateY(-50%) translateY(-100%);
}

/* Container queries for true responsive behavior */
@container (max-width: 768px) {
  .skill-rolodex {
    --padding-horizontal: 0.2em;
  }
}

@container (max-width: 480px) {
  .skill-rolodex {
    --padding-horizontal: 0.15em;
  }
}

/* Fallback media queries for unsupported browsers */
@media (max-width: 768px) {
  .skill-rolodex {
    --padding-horizontal: 0.2em;
  }
}

@media (max-width: 480px) {
  .skill-rolodex {
    --padding-horizontal: 0.15em;
  }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  .skill-rolodex,
  .skill-transition-enter-active,
  .skill-transition-leave-active {
    transition: none;
  }

  .skill-transition-enter-from,
  .skill-transition-leave-to {
    transform: translateY(-50%);
  }
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  .skill-display {
    font-weight: 700;
  }
}
</style>