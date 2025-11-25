<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useResponsiveAnimation } from '@/composables/useResponsiveAnimation'

// Props
interface Props {
  startAnimation?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  startAnimation: false
})

const footerText = "Updated September 2025"
const animationStarted = ref(false)
const footerElement = ref<HTMLElement>()

// Use responsive animation composable
const { shouldAnimate } = useResponsiveAnimation({
  respectReducedMotion: true,
  pauseOnHidden: true
})

// Split text into words
const words = computed(() => {
  return footerText.split(/\s+/).filter(word => word.length > 0).map((word, index) => ({
    text: word,
    index
  }))
})

// Animation timing (matching AnimatedTitle timing)
const getAnimationDelay = (wordIndex: number): string => {
  if (!shouldAnimate.value) return '0s'

  // Use similar timing to AnimatedTitle
  const baseDelay = wordIndex * 0.15
  return `${baseDelay}s`
}

// Watch for animation start
import { watch } from 'vue'
watch(() => props.startAnimation, (newValue) => {
  if (newValue && !animationStarted.value) {
    animationStarted.value = true
  }
})
</script>

<template>
  <p
    ref="footerElement"
    class="last-updated"
    :class="{ 'animation-started': animationStarted }"
  >
    <span
      v-for="word in words"
      :key="`footer-word-${word.index}`"
      class="footer-word"
      :style="{ animationDelay: getAnimationDelay(word.index) }"
    >
      {{ word.text }}
    </span>
  </p>
</template>

<style scoped>
.last-updated {
  color: var(--secondary-color);
  font-size: 14px;
  margin: 0;
  font-family: var(--font-mono);
  display: flex;
  gap: 0.5em;
  align-items: baseline;
  justify-content: center;
  width: 100%;
}

.footer-word {
  display: inline-flex;
  opacity: 0;
  transform: translateY(0.3em);
  will-change: opacity, transform;
}

.animation-started .footer-word {
  animation: fadeInFooterWord 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}

@keyframes fadeInFooterWord {
  from {
    opacity: 0;
    transform: translateY(0.3em);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  .footer-word {
    animation: fadeInFooterWordReduced 0.1s ease forwards !important;
  }

  @keyframes fadeInFooterWordReduced {
    from { opacity: 0; }
    to { opacity: 1; }
  }
}

/* Hardware acceleration */
.footer-word {
  transform: translateZ(0);
  backface-visibility: hidden;
}
</style>