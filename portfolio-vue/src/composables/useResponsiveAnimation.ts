import { ref, onMounted, onUnmounted, nextTick, computed } from 'vue'

export interface ResponsiveAnimationOptions {
  /** Debounce delay for resize events in milliseconds */
  debounceDelay?: number
  /** Whether to respect user's reduced motion preference */
  respectReducedMotion?: boolean
  /** Whether to pause animations when tab is not visible */
  pauseOnHidden?: boolean
  /** Minimum width in pixels before fallback to character units */
  minPixelWidth?: number
}

export interface TextMeasurement {
  width: number
  height: number
  method: 'canvas' | 'element' | 'ch-fallback'
}

/**
 * Composable for responsive animation management with robust measuring
 * Provides ResizeObserver, text measurement utilities, and performance optimizations
 */
export function useResponsiveAnimation(options: ResponsiveAnimationOptions = {}) {
  const {
    debounceDelay = 150,
    respectReducedMotion = true,
    pauseOnHidden = true,
    minPixelWidth = 10
  } = options

  // State management
  const isVisible = ref(true)
  const prefersReducedMotion = ref(false)
  const containerWidth = ref(0)
  const containerHeight = ref(0)

  // Performance tracking
  const measurementCache = new Map<string, TextMeasurement>()
  let debounceTimer: number | null = null
  let resizeObserver: ResizeObserver | null = null
  let animationFrameId: number | null = null

  // Check if animations should be disabled
  const shouldAnimate = computed(() => {
    return isVisible.value && !prefersReducedMotion.value
  })

  /**
   * Debounced callback wrapper
   */
  const debounce = (callback: () => void) => {
    if (debounceTimer) clearTimeout(debounceTimer)
    debounceTimer = setTimeout(callback, debounceDelay)
  }

  /**
   * Measures text width using multiple fallback strategies
   */
  const measureText = (
    text: string,
    element: HTMLElement,
    useCache = true
  ): TextMeasurement => {
    const cacheKey = `${text}-${element.className}-${getComputedStyle(element).fontSize}`

    if (useCache && measurementCache.has(cacheKey)) {
      return measurementCache.get(cacheKey)!
    }

    let measurement: TextMeasurement

    try {
      // Method 1: Canvas measurement (most accurate)
      measurement = measureTextWithCanvas(text, element)

      // Validate measurement
      if (measurement.width < minPixelWidth) {
        throw new Error('Canvas measurement too small, falling back')
      }
    } catch {
      try {
        // Method 2: DOM element measurement
        measurement = measureTextWithElement(text, element)

        if (measurement.width < minPixelWidth) {
          throw new Error('Element measurement too small, falling back')
        }
      } catch {
        // Method 3: Character unit fallback
        measurement = measureTextWithCharacterUnits(text, element)
      }
    }

    if (useCache) {
      measurementCache.set(cacheKey, measurement)
    }

    return measurement
  }

  /**
   * Canvas-based text measurement (most accurate)
   */
  const measureTextWithCanvas = (text: string, element: HTMLElement): TextMeasurement => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')!

    const style = getComputedStyle(element)
    const fontSize = parseFloat(style.fontSize)
    const fontFamily = style.fontFamily
    const fontWeight = style.fontWeight

    ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`
    const metrics = ctx.measureText(text)

    return {
      width: Math.ceil(metrics.width),
      height: Math.ceil(fontSize * 1.2), // Approximate line height
      method: 'canvas'
    }
  }

  /**
   * DOM element-based measurement
   */
  const measureTextWithElement = (text: string, element: HTMLElement): TextMeasurement => {
    const measureEl = document.createElement('span')
    const style = getComputedStyle(element)

    // Copy relevant styles
    measureEl.style.cssText = `
      position: absolute;
      visibility: hidden;
      height: auto;
      width: auto;
      white-space: nowrap;
      font-family: ${style.fontFamily};
      font-size: ${style.fontSize};
      font-weight: ${style.fontWeight};
      line-height: ${style.lineHeight};
      letter-spacing: ${style.letterSpacing};
      top: -9999px;
      left: -9999px;
    `

    measureEl.textContent = text
    document.body.appendChild(measureEl)

    const rect = measureEl.getBoundingClientRect()
    const width = Math.ceil(rect.width)
    const height = Math.ceil(rect.height)

    document.body.removeChild(measureEl)

    return {
      width,
      height,
      method: 'element'
    }
  }

  /**
   * Character unit fallback measurement
   */
  const measureTextWithCharacterUnits = (text: string, element: HTMLElement): TextMeasurement => {
    const style = getComputedStyle(element)
    const fontSize = parseFloat(style.fontSize)

    // Approximate character width (works for most monospace and proportional fonts)
    const avgCharWidth = fontSize * 0.6
    const width = Math.ceil(text.length * avgCharWidth)
    const height = Math.ceil(fontSize * 1.2)

    return {
      width,
      height,
      method: 'ch-fallback'
    }
  }

  /**
   * Sets up ResizeObserver for an element
   */
  const observeElement = (element: HTMLElement, callback: (entry: ResizeObserverEntry) => void) => {
    if (!ResizeObserver) {
      console.warn('ResizeObserver not supported, falling back to resize events')
      const fallbackHandler = () => {
        debounce(() => {
          const rect = element.getBoundingClientRect()
          callback({
            contentRect: {
              width: rect.width,
              height: rect.height,
              top: rect.top,
              left: rect.left,
              right: rect.right,
              bottom: rect.bottom,
              x: rect.x,
              y: rect.y
            }
          } as ResizeObserverEntry)
        })
      }

      window.addEventListener('resize', fallbackHandler)
      return () => window.removeEventListener('resize', fallbackHandler)
    }

    if (resizeObserver) {
      resizeObserver.disconnect()
    }

    resizeObserver = new ResizeObserver(entries => {
      debounce(() => {
        for (const entry of entries) {
          callback(entry)
        }
      })
    })

    resizeObserver.observe(element)

    return () => {
      if (resizeObserver) {
        resizeObserver.disconnect()
        resizeObserver = null
      }
    }
  }

  /**
   * Optimized animation frame wrapper
   */
  const requestAnimationFrame = (callback: () => void) => {
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId)
    }

    animationFrameId = window.requestAnimationFrame(() => {
      callback()
      animationFrameId = null
    })
  }

  /**
   * Clears measurement cache (useful for font loading events)
   */
  const clearMeasurementCache = () => {
    measurementCache.clear()
  }

  /**
   * Handle visibility changes
   */
  const handleVisibilityChange = () => {
    isVisible.value = !document.hidden
  }

  /**
   * Handle reduced motion preference changes
   */
  const handleMotionPreferenceChange = (e: MediaQueryListEvent) => {
    prefersReducedMotion.value = e.matches
  }

  // Setup event listeners
  onMounted(async () => {
    await nextTick()

    // Check initial reduced motion preference
    if (respectReducedMotion) {
      const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
      prefersReducedMotion.value = motionQuery.matches
      motionQuery.addEventListener('change', handleMotionPreferenceChange)
    }

    // Setup visibility change listener
    if (pauseOnHidden) {
      document.addEventListener('visibilitychange', handleVisibilityChange)
    }

    // Setup font loading listener to clear cache
    if ('fonts' in document) {
      document.fonts.addEventListener('loadingdone', clearMeasurementCache)
    }
  })

  // Cleanup
  onUnmounted(() => {
    if (debounceTimer) clearTimeout(debounceTimer)
    if (animationFrameId) cancelAnimationFrame(animationFrameId)
    if (resizeObserver) resizeObserver.disconnect()

    document.removeEventListener('visibilitychange', handleVisibilityChange)

    if (respectReducedMotion) {
      const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
      motionQuery.removeEventListener('change', handleMotionPreferenceChange)
    }

    if ('fonts' in document) {
      document.fonts.removeEventListener('loadingdone', clearMeasurementCache)
    }
  })

  return {
    // State
    isVisible,
    prefersReducedMotion,
    shouldAnimate,
    containerWidth,
    containerHeight,

    // Methods
    measureText,
    observeElement,
    requestAnimationFrame,
    clearMeasurementCache,
    debounce
  }
}