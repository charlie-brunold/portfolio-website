<template>
  <div class="ascii-portrait-container" ref="container">
    <canvas ref="canvas" class="ascii-canvas"></canvas>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'

// Types
interface Particle {
  x: number
  y: number
  originX: number
  originY: number
  char: string
  color: string
  density: number // 0 to 1, where 1 is darkest
  vx: number
  vy: number
  size: number
}

// Refs
const container = ref<HTMLElement | null>(null)
const canvas = ref<HTMLCanvasElement | null>(null)
const asciiContent = ref('')

// State
let ctx: CanvasRenderingContext2D | null = null
let particles: Particle[] = []
let animationId: number = 0
let mouseX = -1000
let mouseY = -1000
let mouseVx = 0
let mouseVy = 0
let lastMouseX = -1000
let lastMouseY = -1000
let lastTime = 0
let scrollY = 0
let canvasWidth = 0
let canvasHeight = 0
let scaleFactor = 1

// Optimization
const GRID_CELL_SIZE = 50
let grid: Particle[][] = []
let gridCols = 0
let activeParticles = new Set<Particle>()

// Atlas (Removed)
// let atlasCanvas: HTMLCanvasElement | null = null
// let charCoords: Record<string, { x: number, y: number }> = {}
// const ATLAS_FONT_SIZE = 40 // High res for atlas

// Configuration
// Tuned to match original CSS look (0.27vw)
const FONT_SIZE_RATIO = 0.0027 
const LINE_HEIGHT_RATIO = 1.0 
const CHAR_SPACING_RATIO = 0.58 
const INFLUENCE_RADIUS = 150 // Larger radius for fluid feel
const MOUSE_FORCE = 0.8
const DRAG_COEFF = 0.92
const RETURN_SPEED = 0.05
const RENDER_FONT_SIZE = 10 

// Character density map (approximate brightness)
const getDensity = (char: string): number => {
  const densityMap: Record<string, number> = {
    ' ': 0, '.': 0.1, ',': 0.1, ':': 0.2, ';': 0.2, '-': 0.2,
    '+': 0.3, '*': 0.4, '%': 0.5, '#': 0.6, '@': 0.8, 'M': 0.9, 'W': 0.9
  }
  return densityMap[char] || 0.5
}



// Initialize particles from ASCII text
const initParticles = () => {
  if (!canvas.value || !container.value || !asciiContent.value) return

  const rect = container.value.getBoundingClientRect()
  canvasWidth = rect.width
  canvasHeight = rect.height
  
  // Set canvas resolution for high DPI displays
  const dpr = window.devicePixelRatio || 1
  canvas.value.width = canvasWidth * dpr
  canvas.value.height = canvasHeight * dpr
  
  ctx = canvas.value.getContext('2d')
  if (!ctx) return
  
  // Calculate scale factor
  // We want the visual size to be window.innerWidth * 0.0027
  // But we want to render at RENDER_FONT_SIZE (10px)
  const targetFontSize = window.innerWidth * FONT_SIZE_RATIO
  scaleFactor = targetFontSize / RENDER_FONT_SIZE
  
  // Apply scaling
  // We scale by dpr * scaleFactor so that 1 unit in canvas = 1 scaled pixel
  ctx.scale(dpr * scaleFactor, dpr * scaleFactor)

  const lines = asciiContent.value.split('\n')
  const maxLineLength = Math.max(...lines.map(l => l.length))
  
  // Use fixed render font size for calculations
  const fontSize = RENDER_FONT_SIZE
  const charSpacing = fontSize * CHAR_SPACING_RATIO
  const lineHeight = fontSize * LINE_HEIGHT_RATIO

  particles = []
  
  // Calculate virtual canvas dimensions (unscaled)
  const virtualWidth = canvasWidth / scaleFactor
  const virtualHeight = canvasHeight / scaleFactor
  
  // Initialize Grid
  gridCols = Math.ceil(virtualWidth / GRID_CELL_SIZE)
  const gridRows = Math.ceil(virtualHeight / GRID_CELL_SIZE)
  grid = new Array(gridCols * gridRows).fill(null).map(() => [])

  // Align to bottom right in virtual space
  const totalTextHeight = lines.length * lineHeight
  const totalTextWidth = maxLineLength * charSpacing
  
  // Start from bottom right of the virtual canvas
  const startX = virtualWidth - totalTextWidth
  const startY = virtualHeight - totalTextHeight

  lines.forEach((line, row) => {
    const chars = line.split('')
    chars.forEach((char, col) => {
      if (char.trim() === '') return

      const x = startX + col * charSpacing
      const y = startY + row * lineHeight

      const p: Particle = {
        x,
        y,
        originX: x,
        originY: y,
        char,
        color: '#1a1a1a',
        density: getDensity(char),
        vx: 0,
        vy: 0,
        size: fontSize
      }
      
      particles.push(p)
      
      // Add to grid
      const gridX = Math.floor(x / GRID_CELL_SIZE)
      const gridY = Math.floor(y / GRID_CELL_SIZE)
      const gridIndex = gridY * gridCols + gridX
      if (grid[gridIndex]) {
        grid[gridIndex].push(p)
      }
    })
  })
}

// Animation Loop
const animate = (time: number) => {
  if (!ctx || !canvas.value) return

  // Calculate delta time for smooth animation
  // const dt = (time - lastTime) / 16.67 // Normalize to ~60fps
  lastTime = time

  // Clear the canvas
  const virtualWidth = canvasWidth / scaleFactor
  const virtualHeight = canvasHeight / scaleFactor
  ctx.clearRect(0, 0, virtualWidth, virtualHeight)

  // 1. Identify active grid cells based on mouse position
  // We only check physics for particles near the mouse
  const virtualRadius = INFLUENCE_RADIUS / scaleFactor
  const startGridX = Math.floor((mouseX - virtualRadius) / GRID_CELL_SIZE)
  const endGridX = Math.floor((mouseX + virtualRadius) / GRID_CELL_SIZE)
  const startGridY = Math.floor((mouseY - virtualRadius) / GRID_CELL_SIZE)
  const endGridY = Math.floor((mouseY + virtualRadius) / GRID_CELL_SIZE)

  // All particles stay at their origin positions (no hover effect)

  // Rendering
  // Revert to fillText for better visual quality (crispness)
  particles.forEach(p => {
    ctx!.font = `700 ${p.size}px 'Courier New', 'Consolas', 'Monaco', monospace`
    ctx!.fillStyle = p.color
    ctx!.fillText(p.char, p.x, p.y)
  })

  // Decay mouse velocity
  mouseVx *= 0.9
  mouseVy *= 0.9

  animationId = requestAnimationFrame(() => animate(performance.now()))
}

// Event Handlers
const handleMouseMove = (e: MouseEvent) => {
  if (!canvas.value) return
  const rect = canvas.value.getBoundingClientRect()
  
  // Convert screen coordinates to virtual coordinates
  // 1. Get coordinates relative to canvas (CSS pixels)
  const rawX = e.clientX - rect.left
  const rawY = e.clientY - rect.top
  
  // 2. Scale to virtual space
  const currentMouseX = rawX / scaleFactor
  const currentMouseY = rawY / scaleFactor
  
  // Calculate velocity
  if (lastMouseX !== -1000) {
    mouseVx = currentMouseX - lastMouseX
    mouseVy = currentMouseY - lastMouseY
  }
  
  lastMouseX = currentMouseX
  lastMouseY = currentMouseY
  mouseX = currentMouseX
  mouseY = currentMouseY
}

const handleScroll = () => {
  scrollY = window.scrollY
}

const handleResize = () => {
  initParticles()
}

// Lifecycle
onMounted(async () => {
  try {
    const asciiModule = await import('@/assets/ascii.txt?raw')
    asciiContent.value = asciiModule.default
    
    initParticles()
    animate(performance.now())
    
    window.addEventListener('scroll', handleScroll)
    window.addEventListener('resize', handleResize)
    
    handleScroll()
    
  } catch (error) {
    console.error('Failed to load ASCII content:', error)
  }
})

onBeforeUnmount(() => {
  cancelAnimationFrame(animationId)
  window.removeEventListener('scroll', handleScroll)
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
/* Restore original fixed positioning */
.ascii-portrait-container {
  position: fixed;
  bottom: -10vh;
  right: -8vw;
  width: 120vw;
  height: 140vh;
  z-index: 1;
  pointer-events: none; /* Let clicks pass through, but we track mouse via window */
  
  /* Flex alignment from original */
  display: flex;
  justify-content: flex-end;
  align-items: flex-end;
}

.ascii-canvas {
  display: block;
  width: 100%;
  height: 100%;
}

/* Mobile layout adjustments */
@media (max-width: 768px) {
  .ascii-portrait-container {
    bottom: -15vh;
    left: 50%;
    transform: translateX(-50%);
    width: 100vw;
    height: 120vh;
    justify-content: center;
    right: auto;
  }
}
</style>