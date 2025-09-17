<script setup lang="ts">
import { ref, onMounted, computed, nextTick } from 'vue'
import { useResponsiveAnimation } from '@/composables/useResponsiveAnimation'
import SkillRolodex from './SkillRolodex.vue'

// Text content with semantic structure
const textSegments = [
  { text: "Hey, I'm", type: 'greeting' },
  { text: "Charlie,", type: 'name', emphasis: true },
  { text: "an AI for Business student using", type: 'description' },
  { text: '<skill-rolodex>', type: 'component' },
  { text: "to solve complex business challenges.", type: 'purpose' }
]

const animationStarted = ref(false)
const titleElement = ref<HTMLElement>()

// Use responsive animation composable
const { shouldAnimate, observeElement } = useResponsiveAnimation({
  respectReducedMotion: true,
  pauseOnHidden: true
})

// Flatten text segments into words with metadata
const words = computed(() => {
  const result: Array<{
    text: string
    segmentType: string
    wordIndex: number
    globalIndex: number
    emphasis?: boolean
    isComponent?: boolean
  }> = []

  let globalIndex = 0

  textSegments.forEach(segment => {
    if (segment.text === '<skill-rolodex>') {
      result.push({
        text: segment.text,
        segmentType: segment.type,
        wordIndex: 0,
        globalIndex: globalIndex++,
        isComponent: true
      })
    } else {
      const segmentWords = segment.text.split(/\s+/).filter(word => word.length > 0)
      segmentWords.forEach((word, wordIndex) => {
        result.push({
          text: word,
          segmentType: segment.type,
          wordIndex,
          globalIndex: globalIndex++,
          emphasis: segment.emphasis
        })
      })
    }
  })

  return result
})

// Dynamic timing calculation based on content and screen size
const getAnimationDelay = (wordData: typeof words.value[0]): string => {
  if (!shouldAnimate.value) return '0s'

  // Base timing patterns for different segment types
  const timingMultipliers = {
    greeting: 0.1,
    name: 0.15,
    description: 0.12,
    component: 0.2,
    purpose: 0.14
  }

  const multiplier = timingMultipliers[wordData.segmentType as keyof typeof timingMultipliers] || 0.15
  const baseDelay = wordData.globalIndex * multiplier

  // Add contextual pauses
  let contextualDelay = 0
  if (wordData.segmentType === 'name') contextualDelay += 0.3
  if (wordData.segmentType === 'component') contextualDelay += 0.5
  if (wordData.segmentType === 'purpose' && wordData.wordIndex === 0) contextualDelay += 0.4

  return `${baseDelay + contextualDelay}s`
}

// Get CSS classes for words
const getWordClasses = (wordData: typeof words.value[0]): string[] => {
  const classes = ['word', `segment-${wordData.segmentType}`]

  if (wordData.emphasis) classes.push('emphasis')
  if (wordData.isComponent) classes.push('component-placeholder')

  return classes
}

// Setup resize observer for responsive recalculation
let cleanupObserver: (() => void) | null = null

const handleResize = () => {
  // Trigger CSS recalculations for fluid typography
  if (titleElement.value) {
    titleElement.value.style.setProperty('--container-width', `${titleElement.value.clientWidth}px`)
  }
}

// Start animation on mount
onMounted(async () => {
  await nextTick()

  animationStarted.value = true

  if (titleElement.value) {
    // Setup resize observer
    cleanupObserver = observeElement(titleElement.value, handleResize)

    // Set initial container width
    handleResize()
  }
})

// Cleanup
import { onUnmounted } from 'vue'
onUnmounted(() => {
  if (cleanupObserver) {
    cleanupObserver()
  }
})
</script>

<template>
  <h1
    ref="titleElement"
    class="main-title"
    :class="{ 'animation-started': animationStarted }"
  >
    <template v-for="wordData in words" :key="`${wordData.segmentType}-${wordData.globalIndex}`">
      <!-- Skill Rolodex Component -->
      <span
        v-if="wordData.isComponent"
        :class="getWordClasses(wordData)"
        :style="{ animationDelay: getAnimationDelay(wordData) }"
      >
        <SkillRolodex />
      </span>

      <!-- Regular word -->
      <span
        v-else
        :class="getWordClasses(wordData)"
        :style="{ animationDelay: getAnimationDelay(wordData) }"
      >
        {{ wordData.text }}
      </span>
    </template>
  </h1>
</template>

<style scoped>
.main-title {
  --container-width: 100%;
  --base-font-size: clamp(1.75rem, 4vw + 1rem, 4.5rem);
  --word-spacing: clamp(0.2em, 0.3vw + 0.15em, 0.35em);
  --line-height: clamp(1.3, 1.2 + 0.2vw, 1.5);

  display: flex;
  flex-wrap: wrap;
  gap: var(--word-spacing);
  align-items: baseline;
  justify-content: flex-start;

  font-size: var(--base-font-size);
  font-weight: 500;
  line-height: var(--line-height);
  margin: 0;
  color: var(--text-secondary, #666666);
  width: 100%;
  max-width: 100%;
  user-select: none;
  cursor: default;

  /* Ensure natural text flow */
  word-break: break-word;
  overflow-wrap: break-word;
  hyphens: auto;
}

/* Word Animation Styles with Performance Optimizations */
.word {
  display: inline-flex;
  align-items: baseline;
  flex-shrink: 0;
  opacity: 0;
  transform: translateY(0.5em);
  will-change: opacity, transform;
  animation: fadeInWord var(--animation-duration, 0.6s) var(--animation-easing, cubic-bezier(0.4, 0, 0.2, 1)) forwards;
}

/* Segment-specific styles */
.word.segment-greeting {
  font-weight: 500;
}

.word.segment-name {
  font-weight: 600;
  color: var(--text-color, #1a1a1a);
  letter-spacing: 0.01em;
}

.word.segment-description {
  font-weight: 500;
}

.word.segment-component {
  display: inline-flex;
  align-items: baseline;
  vertical-align: baseline;
}

.word.segment-purpose {
  font-weight: 500;
}

.word.emphasis {
  font-weight: 600;
  color: var(--text-color, #1a1a1a);
  letter-spacing: 0.02em;
}

.word.component-placeholder {
  align-items: center;
  line-height: 1;
}

/* Animation keyframes with GPU acceleration */
@keyframes fadeInWord {
  from {
    opacity: 0;
    transform: translateY(0.5em);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Container queries for true responsive behavior */
@container (max-width: 600px) {
  .main-title {
    --word-spacing: clamp(0.15em, 0.25vw + 0.1em, 0.25em);
    gap: var(--word-spacing);
  }
}

@container (max-width: 400px) {
  .main-title {
    --word-spacing: clamp(0.1em, 0.2vw + 0.08em, 0.2em);
    gap: var(--word-spacing);
  }
}

/* Fallback media queries for unsupported browsers */
@media (max-width: 768px) {
  .main-title {
    --base-font-size: clamp(1.5rem, 5vw, 2.5rem);
    --word-spacing: clamp(0.15em, 0.25vw + 0.1em, 0.25em);
  }
}

@media (max-width: 480px) {
  .main-title {
    --base-font-size: clamp(1.25rem, 6vw, 2rem);
    --word-spacing: clamp(0.1em, 0.2vw + 0.08em, 0.2em);
  }
}

@media (max-width: 320px) {
  .main-title {
    --base-font-size: clamp(1rem, 7vw, 1.5rem);
    --word-spacing: 0.15em;
  }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  .word {
    animation: fadeInWordReduced 0.1s ease forwards;
  }

  @keyframes fadeInWordReduced {
    from { opacity: 0; }
    to { opacity: 1; }
  }
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  .word.segment-name,
  .word.emphasis {
    font-weight: 700;
    text-shadow: none;
  }
}

/* Print styles */
@media print {
  .main-title {
    font-size: 24pt;
    line-height: 1.2;
    color: black;
  }

  .word {
    opacity: 1;
    transform: none;
    animation: none;
  }
}

/* Force hardware acceleration for smooth animations */
.main-title,
.word {
  transform: translateZ(0);
  backface-visibility: hidden;
  perspective: 1000;
}

/* Optimize for different display densities */
@media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
  .word.segment-name,
  .word.emphasis {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
}
</style>