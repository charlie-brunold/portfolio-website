import { ref, onMounted, onUnmounted, type Ref } from 'vue'

export interface ScrollAnimationOptions {
  startOffset?: number
  endOffset?: number
  easing?: (t: number) => number
  onUpdate?: (progress: number, scrollY: number) => void
}

export function useScrollAnimation(options: ScrollAnimationOptions = {}) {
  const {
    startOffset = 0,
    endOffset = window.innerHeight,
    easing = (t: number) => t, // Linear by default
    onUpdate
  } = options

  const progress = ref(0)
  const scrollY = ref(0)
  const isActive = ref(false)

  let ticking = false
  let animationFrame: number | null = null

  // Optimized scroll handler using RAF
  const handleScroll = () => {
    if (ticking) return

    ticking = true

    if (animationFrame) {
      cancelAnimationFrame(animationFrame)
    }

    animationFrame = requestAnimationFrame(() => {
      const currentScrollY = window.scrollY
      scrollY.value = currentScrollY

      // Calculate progress based on scroll position
      const rawProgress = Math.max(0, Math.min(1,
        (currentScrollY - startOffset) / (endOffset - startOffset)
      ))

      const easedProgress = easing(rawProgress)
      progress.value = easedProgress

      // Determine if animation is in active range
      isActive.value = currentScrollY >= startOffset && currentScrollY <= endOffset

      // Call update callback if provided
      if (onUpdate) {
        onUpdate(easedProgress, currentScrollY)
      }

      ticking = false
    })
  }

  // Easing functions
  const easingFunctions = {
    linear: (t: number) => t,
    easeOut: (t: number) => 1 - Math.pow(1 - t, 3),
    easeIn: (t: number) => t * t * t,
    easeInOut: (t: number) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
    easeOutQuart: (t: number) => 1 - Math.pow(1 - t, 4),
    easeOutExpo: (t: number) => t === 1 ? 1 : 1 - Math.pow(2, -10 * t)
  }

  onMounted(() => {
    // Initial calculation
    handleScroll()

    // Add passive listener for better performance
    window.addEventListener('scroll', handleScroll, { passive: true })
  })

  onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll)
    if (animationFrame) {
      cancelAnimationFrame(animationFrame)
    }
  })

  return {
    progress: progress as Ref<number>,
    scrollY: scrollY as Ref<number>,
    isActive: isActive as Ref<boolean>,
    easingFunctions
  }
}

// Specialized hook for element visibility based on scroll
export function useElementVisibility(
  elementRef: Ref<HTMLElement | null>,
  options: {
    rootMargin?: string
    threshold?: number | number[]
    onEnter?: () => void
    onExit?: () => void
  } = {}
) {
  const isVisible = ref(false)
  const visibilityRatio = ref(0)

  let observer: IntersectionObserver | null = null

  onMounted(() => {
    if (!elementRef.value) return

    observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        const wasVisible = isVisible.value

        isVisible.value = entry.isIntersecting
        visibilityRatio.value = entry.intersectionRatio

        // Handle enter/exit callbacks
        if (isVisible.value && !wasVisible && options.onEnter) {
          options.onEnter()
        } else if (!isVisible.value && wasVisible && options.onExit) {
          options.onExit()
        }
      },
      {
        rootMargin: options.rootMargin || '0px',
        threshold: options.threshold || 0
      }
    )

    observer.observe(elementRef.value)
  })

  onUnmounted(() => {
    if (observer) {
      observer.disconnect()
    }
  })

  return {
    isVisible: isVisible as Ref<boolean>,
    visibilityRatio: visibilityRatio as Ref<number>
  }
}