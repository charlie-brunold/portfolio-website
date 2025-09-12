<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import SkillRolodex from './SkillRolodex.vue'

const originalText = "Hey, I'm Charlie, an AI for Business student using <skill-rolodex></skill-rolodex> to solve <br> complex business challenges."
const animationStarted = ref(false)

// Split text into words for animation
const words = computed(() => originalText.split(' '))

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
]

// Get animation delay for each word
const getWordDelay = (index: number): string => {
  const delay = timingPattern[index] || (index * 0.15)
  return `${delay}s`
}

// Check if word should have special styling
const getWordClasses = (word: string, index: number): string[] => {
  const classes = ['word']
  
  if (word === "Charlie,") {
    classes.push('charlie')
  }
  
  return classes
}

// Check if word is a special element
const isSpecialElement = (word: string): string | null => {
  if (word === '<br>') return 'br'
  if (word === '<skill-rolodex></skill-rolodex>') return 'skill-rolodex'
  return null
}

// Start animation on mount
onMounted(() => {
  animationStarted.value = true
})
</script>

<template>
  <h1 class="main-title" :class="{ 'animation-started': animationStarted }">
    <template v-for="(word, index) in words" :key="index">
      <!-- Line break -->
      <br 
        v-if="isSpecialElement(word) === 'br'"
        class="line-break"
        :style="{ animationDelay: getWordDelay(index) }"
      >
      
      <!-- Skill Rolodex Component -->
      <span
        v-else-if="isSpecialElement(word) === 'skill-rolodex'"
        class="word"
        :style="{ animationDelay: getWordDelay(index) }"
      >
        <SkillRolodex />
      </span>
      
      <!-- Regular word -->
      <span
        v-else
        :class="getWordClasses(word, index)"
        :style="{ animationDelay: getWordDelay(index) }"
      >
        {{ word }}
      </span>
      
      <!-- Add space after each word (except last and special elements) -->
      <span v-if="index < words.length - 1 && !isSpecialElement(word)" class="word-space"> </span>
    </template>
  </h1>
</template>

<style scoped>
.main-title {
  font-size: clamp(32px, 6vw, 72px);
  font-weight: 500;
  line-height: 1.4;
  margin: 0;
  color: var(--text-secondary);
  width: 100%;
  user-select: none;
  cursor: default;
}

/* Word Animation Styles */
.word {
  display: inline-block;
  opacity: 0;
  transform: translateY(20px);
  animation: fadeInWord var(--animation-duration) var(--animation-easing) forwards;
}

.word-space {
  display: inline;
}

/* Special handling for line break elements */
.line-break {
  opacity: 0;
  animation: fadeInWord var(--animation-duration) var(--animation-easing) forwards;
}

/* Emphasized text styles */
.word.charlie {
  font-weight: 600;
  color: var(--text-color);
  letter-spacing: 0.02em;
}

@keyframes fadeInWord {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsive Design */
@media (max-width: 768px) {
  .main-title {
    font-size: 28px;
  }
  
  .word {
    margin-right: 0.25em;
  }
}

@media (max-width: 480px) {
  .main-title {
    font-size: 24px;
  }
  
  .word {
    margin-right: 0.2em;
  }
}
</style>