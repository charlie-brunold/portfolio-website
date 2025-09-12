<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, nextTick } from 'vue'

// Skills array - easily expandable
const skills = ['Python', 'SQL', 'C++', 'R', 'Tableau', 'ML', 'data analytics', 'statistics', 'C#', 'Pandas', 'NumPy', 'JMP']
const currentIndex = ref(0)
const rolodexElement = ref<HTMLElement>()
const measureElement = ref<HTMLElement>()
const skillDisplay = ref<HTMLElement>()

// Animation state
let animationInterval: number | null = null
const isVisible = ref(true)

// Skill widths cache
const skillWidths = ref<number[]>([])
const currentWidth = ref(0)

// Current skill computed property
const currentSkill = computed(() => skills[currentIndex.value])

// Pre-calculate widths for all skills
const calculateSkillWidths = async () => {
  await nextTick() // Wait for DOM to be ready
  
  if (!measureElement.value || !rolodexElement.value) return
  
  const computedStyle = window.getComputedStyle(rolodexElement.value)
  const fontSize = parseFloat(computedStyle.fontSize)
  const paddingEm = 0.4 // Total horizontal padding (0.2em * 2)
  const paddingPx = paddingEm * fontSize
  
  // Calculate widths for each skill
  skillWidths.value = skills.map(skill => {
    if (measureElement.value) {
      measureElement.value.textContent = skill
      return measureElement.value.getBoundingClientRect().width + paddingPx
    }
    return 0
  })
  
  // Set initial width
  currentWidth.value = skillWidths.value[0] || 0
}

// Function to animate to next skill
const animateNextSkill = () => {
  currentIndex.value = (currentIndex.value + 1) % skills.length
  const nextWidth = skillWidths.value[currentIndex.value]
  
  // Start width animation slightly before text animation for smooth feel
  currentWidth.value = nextWidth
}

// Animation management
const startAnimation = () => {
  if (animationInterval) clearInterval(animationInterval)
  animationInterval = setInterval(animateNextSkill, 2000)
}

const stopAnimation = () => {
  if (animationInterval) {
    clearInterval(animationInterval)
    animationInterval = null
  }
}

// Handle tab visibility changes
const handleVisibilityChange = () => {
  isVisible.value = !document.hidden
  if (isVisible.value) {
    startAnimation()
  } else {
    stopAnimation()
  }
}

onMounted(async () => {
  await calculateSkillWidths()
  startAnimation()
  document.addEventListener('visibilitychange', handleVisibilityChange)
})

onUnmounted(() => {
  stopAnimation()
  document.removeEventListener('visibilitychange', handleVisibilityChange)
})
</script>

<template>
  <span 
    ref="rolodexElement" 
    class="skill-rolodex" 
    :style="{ width: `${currentWidth}px` }"
  >
    <!-- Hidden measurement element -->
    <span ref="measureElement" class="skill-measure" aria-hidden="true"></span>
    
    <!-- Skill display with Vue transition -->
    <Transition name="skill-transition" mode="out-in">
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
  position: relative;
  display: inline-block;
  white-space: nowrap;
  height: 1em;
  overflow: hidden;
  vertical-align: baseline;
  transition: width 0.5s var(--animation-bezier);
  padding: 0 0.2em;
  transform: translateY(0.15em);
}

.skill-display {
  position: absolute;
  top: 50%;
  left: 0.2em;
  width: calc(100% - 0.4em);
  display: inline-block;
  line-height: inherit;
  transform: translateY(-50%);
  font-weight: 600;
  color: var(--text-primary);
}

/* Hidden element for measuring text width */
.skill-measure {
  position: absolute;
  visibility: hidden;
  height: auto;
  width: auto;
  white-space: nowrap;
  font-family: inherit;
  font-size: inherit;
  font-weight: inherit;
  line-height: inherit;
  top: -9999px;
  left: -9999px;
}

/* Vue Transitions */
.skill-transition-enter-active {
  transition: transform 0.6s var(--animation-bezier);
}

.skill-transition-leave-active {
  transition: transform 0.6s var(--animation-bezier);
}

.skill-transition-enter-from {
  transform: translateY(50%);
}

.skill-transition-leave-to {
  transform: translateY(-150%);
}

/* Responsive Design */
@media (max-width: 768px) {
  .skill-rolodex {
    padding: 0 0.15em;
  }
  
  .skill-display {
    left: 0.15em;
    width: calc(100% - 0.3em);
  }
}
</style>