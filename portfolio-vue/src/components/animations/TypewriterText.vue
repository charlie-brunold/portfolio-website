<script setup lang="ts">
import { ref, onMounted, computed, watch, nextTick } from 'vue'

interface Props {
  text: string
  tag?: string
  startDelay?: number
  animationDuration?: number
}

const props = withDefaults(defineProps<Props>(), {
  tag: 'div',
  startDelay: 0,
  animationDuration: 1500
})

const isVisible = ref(false)
const isAnimating = ref(false)

// Check for reduced motion preference
const prefersReducedMotion = () => {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

// Start the smooth reveal animation
const startReveal = async () => {
  if (props.text.length === 0) return

  // If reduced motion is preferred, show text immediately
  if (prefersReducedMotion()) {
    isVisible.value = true
    return
  }

  // Start animation after delay
  setTimeout(() => {
    isAnimating.value = true
    isVisible.value = true
  }, props.startDelay)
}

// Handle highlighting for name
const formattedText = computed(() => {
  const text = props.text
  if (text.includes('Charlie Brunold')) {
    return text.replace('Charlie Brunold', '<span class="name-highlight">Charlie Brunold</span>')
  }
  return text
})

onMounted(async () => {
  await nextTick()
  startReveal()
})

// Reset animation when text changes
watch(() => props.text, () => {
  isVisible.value = false
  isAnimating.value = false
  startReveal()
})
</script>

<template>
  <component
    :is="tag"
    class="typewriter-text"
    :class="{
      'is-visible': isVisible,
      'is-animating': isAnimating,
      'list-item': tag === 'li'
    }"
    :style="{ '--animation-duration': `${animationDuration}ms` }"
  >
    <span v-html="formattedText" class="text-content"></span>
  </component>
</template>

<style scoped>
.typewriter-text {
  position: relative;
  display: block;
  min-height: 1.2em;
  opacity: 0;
  clip-path: inset(0 100% 0 0);
  transition: opacity 0.3s ease-out;
}

.typewriter-text.is-visible {
  opacity: 1;
  animation: smoothReveal var(--animation-duration, 1500ms) cubic-bezier(0.23, 1, 0.32, 1) forwards;
}

.text-content {
  display: inline;
}

/* Inherit styles from parent context */
.typewriter-text.list-item {
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

.typewriter-text.list-item::before {
  content: "•";
  color: var(--text-primary);
  position: absolute;
  left: 0;
  font-weight: 600;
}

/* Name highlighting */
.typewriter-text :deep(.name-highlight) {
  color: var(--text-primary);
  font-weight: 600;
}

/* Smooth reveal animation - text sweeps in from left to right */
@keyframes smoothReveal {
  0% {
    clip-path: inset(0 100% 0 0);
  }
  100% {
    clip-path: inset(0 0 0 0);
  }
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .typewriter-text.list-item {
    font-size: clamp(0.8rem, 3vw, 0.9rem);
    padding-left: 1.5rem;
  }

  .typewriter-text.list-item::before {
    left: -0.2rem;
  }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  .typewriter-text {
    opacity: 0;
    clip-path: none;
    animation: none;
  }

  .typewriter-text.is-visible {
    animation: fadeInReduced 0.3s ease-out forwards;
  }

  @keyframes fadeInReduced {
    from { opacity: 0; }
    to { opacity: 1; }
  }
}

/* High contrast support */
@media (prefers-contrast: high) {
  .typewriter-text :deep(.name-highlight) {
    font-weight: 700;
    text-shadow: none;
  }
}
</style>