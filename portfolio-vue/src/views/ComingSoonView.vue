<script setup lang="ts">
import { ref, onMounted } from 'vue'

const scrambleText = ref<HTMLElement>()

class ScrambleText {
  element: HTMLElement
  originalText: string
  chars: string
  duration: number
  scrambleChars: HTMLElement[]
  intervals: number[]

  constructor(element: HTMLElement, options: { duration?: number } = {}) {
    this.element = element
    this.originalText = element.textContent || ''
    this.chars = '!@#$%^&*()_+-=[]{}|;:,.<>?~/`"\'\\'
    this.duration = options.duration || 3000
    this.scrambleChars = []
    this.intervals = []
    
    this.init()
  }

  init() {
    this.element.innerHTML = ''
    
    // Create spans for each character including spaces
    for (let i = 0; i < this.originalText.length; i++) {
      const span = document.createElement('span')
      const char = this.originalText[i]
      
      if (char === ' ') {
        span.innerHTML = '&nbsp;'
        span.style.opacity = '0'
      } else {
        span.textContent = this.getRandomChar()
      }
      
      this.element.appendChild(span)
    }
    
    this.scrambleChars = Array.from(this.element.children) as HTMLElement[]
    this.startAnimation()
  }

  getRandomChar(): string {
    return this.chars[Math.floor(Math.random() * this.chars.length)]
  }

  startAnimation() {
    const nonSpaceChars = this.scrambleChars.filter((span, i) => 
      this.originalText[i] !== ' '
    )
    
    nonSpaceChars.forEach((span, index) => {
      const originalIndex = this.scrambleChars.indexOf(span)
      const originalChar = this.originalText[originalIndex]
      
      // Random delay for each character (staggered effect)
      const delay = Math.random() * (this.duration * 0.7)
      const settleTime = delay + (Math.random() * (this.duration * 0.3))
      
      // Ultra-fast initial scrambling phase
      const scrambleInterval = setInterval(() => {
        span.textContent = this.getRandomChar()
      }, 16) // Much faster - roughly 60fps
      
      // Settle to final character with progressive slowdown
      setTimeout(() => {
        clearInterval(scrambleInterval)
        
        // Progressive slowdown to final character
        let cycleCount = 0
        let currentSpeed = 30 // Start relatively fast
        
        const finalInterval = () => {
          if (cycleCount < 8) {
            span.textContent = this.getRandomChar()
            cycleCount++
            // Exponential slowdown
            currentSpeed = currentSpeed * 1.5
            setTimeout(finalInterval, currentSpeed)
          } else {
            span.textContent = originalChar
            span.style.transition = 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
          }
        }
        
        finalInterval()
        
      }, settleTime)
      
      this.intervals.push(scrambleInterval)
    })

    // Show spaces gradually
    setTimeout(() => {
      this.scrambleChars.forEach((span, i) => {
        if (this.originalText[i] === ' ') {
          span.style.opacity = '1'
          span.style.transition = 'opacity 0.5s ease-in-out'
        }
      })
    }, this.duration * 0.5)
  }

  destroy() {
    this.intervals.forEach(clearInterval)
    this.element.textContent = this.originalText
  }
}

onMounted(() => {
  if (scrambleText.value) {
    new ScrambleText(scrambleText.value, { duration: 3000 })
  }
})
</script>

<template>
  <main class="main-content">
    <div class="center-content">
      <h1 
        ref="scrambleText" 
        class="main-title"
      >
        Coming Soon
      </h1>
    </div>
  </main>
</template>

<style scoped>
.main-content {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing);
}

.center-content {
  text-align: center;
}

.main-title {
  font-family: var(--font-mono);
  font-size: 96px;
  color: var(--text-color);
  margin: 0;
  line-height: 1.1;
}

@media (max-width: 768px) {
  .main-title {
    font-size: 64px;
  }
}

@media (max-width: 480px) {
  .main-title {
    font-size: 48px;
  }
}
</style>