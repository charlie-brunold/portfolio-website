<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'

const canvasRef = ref<HTMLCanvasElement | null>(null)

const prefersReducedMotion =
  typeof window !== 'undefined'
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
    : false

const CHAR_HEIGHT = 14
const FONT = `${CHAR_HEIGHT}px 'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', monospace`
const MAX_SPEED = 1.2
const ACCELERATION = 0.4
const SWIRL_THRESHOLD = 6
const START_DELAY = 2.5
const BLEND_DURATION = 0.5
const CYCLE_DURATION = 0.4
const CYCLE_SEQ = ['*', '#', '@', '%', '&', '!', '?', '$', '^', '~', '+', '=', '|', '/', '\\', '<', '>', '{', '}', '[', ']', '0', '1', 'X', 'Z']

const FIGLET_LINES = [
  "   ____ _                _ _        ____                         _     _ ",
  "  / ___| |__   __ _ _ __| (_) ___  | __ ) _ __ _   _ _ __   ___ | | __| |",
  " | |   | '_ \\ / _` | '__| | |/ _ \\ |  _ \\| '__| | | | '_ \\ / _ \\| |/ _` |",
  " | |___| | | | (_| | |  | | |  __/ | |_) | |  | |_| | | | | (_) | | (_| |",
  "  \\____|_| |_|\\__,_|_|  |_|_|\\___| |____/|_|   \\__,_|_| |_|\\___/|_|\\__,_|"
]

const MOBILE_FIGLET_LINES = [
  "  ___ _             _ _     ",
  " / __| |_  __ _ _ _| (_)___ ",
  "| (__| ' \\/ _` | '_| | / -_)",
  " \\___|_||_\\__,_|_| |_|_\\___|",
  "",
  " ___                   _    _ ",
  "| _ )_ _ _  _ _ _  ___| |__| |",
  "| _ \\ '_| || | ' \\/ _ \\ / _` |",
  "|___/_|  \\_,_|_||_\\___/_\\__,_|",
]

const WORD_BANK = [
  'the', 'and', 'but', 'for', 'not', 'all', 'one', 'can', 'how', 'why',
  'new', 'old', 'now', 'then', 'here', 'this', 'that', 'from', 'with', 'some',
  'more', 'most', 'than', 'into', 'over', 'also', 'just', 'even', 'only', 'very',
  'long', 'high', 'back', 'down', 'make', 'know', 'look', 'work', 'give', 'live',
  'feel', 'keep', 'last', 'move', 'need', 'open', 'time', 'life', 'form', 'deep',
  'vast', 'pure', 'bold', 'calm', 'soft', 'hard', 'dark', 'slow', 'fast', 'mind',
  'will', 'self', 'true', 'each', 'both', 'stay', 'grow', 'rise', 'pass', 'turn',
  'light', 'power', 'force', 'sound', 'space', 'human', 'world', 'place', 'water',
  'night', 'every', 'being', 'think', 'order', 'under', 'above', 'clear', 'small',
  'large', 'great', 'whole', 'right', 'still', 'where', 'after', 'never', 'other',
  'start', 'close', 'often', 'those', 'their', 'while', 'among', 'along', 'reach',
  'shape', 'swift', 'quiet', 'given', 'since', 'early', 'final', 'local', 'major',
  'minor', 'sharp', 'below', 'level', 'limit', 'model', 'point', 'range', 'state',
  'total', 'value', 'found', 'might', 'taken', 'built', 'drawn', 'shown', 'grown',
  'drive', 'trace', 'craft', 'field', 'frame', 'logic', 'layer', 'sense', 'shift',
  'scale', 'scope', 'proof', 'chain', 'depth', 'align', 'phase', 'ratio', 'delta',
  'thought', 'process', 'between', 'without', 'another', 'already', 'perhaps',
  'however', 'whether', 'together', 'complete', 'approach', 'movement', 'position',
  'question', 'research', 'response', 'strategy', 'structure', 'continue', 'decision',
  'discover', 'evidence', 'function', 'generate', 'identify', 'increase', 'practice',
  'provide', 'receive', 'require', 'service', 'solution', 'support', 'abstract',
  'constant', 'dynamic', 'elegant', 'minimal', 'pattern', 'sequence', 'signal',
  'silence', 'current', 'network', 'entropy', 'gradient', 'tensor', 'vector',
  'singular', 'multiple', 'infinite', 'finite', 'boundary', 'threshold', 'emergence',
  'resonance', 'frequency', 'dimension', 'topology', 'algorithm', 'computation',
  'inference', 'prediction', 'attention', 'context', 'parameter', 'probability',
  'distribution', 'autonomy', 'intelligence', 'creativity', 'curiosity', 'awareness',
  'perception', 'cognition', 'foundation', 'principle', 'observation', 'measurement',
  'convergence', 'stability', 'equilibrium', 'symmetry', 'connection', 'interaction',
  'evolution', 'adaptation', 'variation', 'diversity', 'complexity', 'abstraction',
  'generation', 'correlation', 'derivative', 'recursive', 'parallel', 'iteration',
  'transformation', 'representation', 'optimization', 'classification', 'recognition',
]

function randomWord(): string {
  return WORD_BANK[Math.floor(Math.random() * WORD_BANK.length)]
}

function generateLines(numLines: number, maxWords = 9): string[] {
  const lines: string[] = []
  for (let i = 0; i < numLines; i++) {
    const r = Math.random()
    let wordCount: number
    if (r < 0.05)      wordCount = 2
    else if (r < 0.13) wordCount = 3
    else if (r < 0.25) wordCount = 4
    else if (r < 0.40) wordCount = 5
    else if (r < 0.60) wordCount = 6
    else if (r < 0.80) wordCount = 7
    else if (r < 0.95) wordCount = 8
    else               wordCount = 9
    lines.push(Array.from({ length: Math.min(wordCount, maxWords) }, randomWord).join(' '))
  }
  return lines
}

function justifySentence(text: string, width: number): string {
  const words = text.split(/\s+/).filter(w => w.length > 0)
  if (words.length <= 1) return text.padEnd(width)
  const totalWordLen = words.reduce((sum, w) => sum + w.length, 0)
  const totalSpaces = width - totalWordLen
  if (totalSpaces <= 0) return text.slice(0, width)
  const gaps = words.length - 1
  const base = Math.floor(totalSpaces / gaps)
  const extra = totalSpaces % gaps
  let result = ''
  for (let i = 0; i < words.length - 1; i++) {
    result += words[i] + ' '.repeat(base + (i < extra ? 1 : 0))
  }
  return result + words[words.length - 1]
}

function getCharAt(x: number, y: number): string {
  const lineIdx = y - textStartRow
  if (lineIdx < 0 || lineIdx >= justifiedLines.length) return ' '
  const localX = x - textStartCol
  if (localX < 0 || localX >= contentCols) return ' '
  return justifiedLines[lineIdx][localX] ?? ' '
}

let ctx: CanvasRenderingContext2D | null = null
let animId: number | null = null
let isRunning = false
let lastTimestamp: number | null = null
let effectiveTime = 0
let speed = 0
let elapsedRealTime = 0

let cols = 0
let rows = 0
let charWidth = 0
let xOffset = 0
let yOffset = 0
let charGrid: string[][] = []
let distMap: number[][] = []
let angleMap: number[][] = []
let swirlMap: number[][] = []
let screenBuffer: string[][] = []

let justifiedLines: string[] = []
let textStartRow = 0
let textStartCol = 0
let contentCols = 0

let nameCells: { gx: number; gy: number; finalChar: string }[] = []
let nameRowSpans: { first: number; last: number }[] = []
let nameX0 = 0
let nameY0 = 0
let nameCycleStart: number | null = null

function buildAll() {
  const canvas = canvasRef.value
  if (!canvas || !ctx) return

  ctx.font = FONT
  charWidth = ctx.measureText('M').width

  cols = Math.floor(window.innerWidth / charWidth)
  rows = Math.floor(window.innerHeight / CHAR_HEIGHT)

  xOffset = (window.innerWidth - cols * charWidth) / 2
  yOffset = (window.innerHeight - rows * CHAR_HEIGHT) / 2

  canvas.width = window.innerWidth
  canvas.height = window.innerHeight

  ctx.font = FONT
  ctx.textBaseline = 'top'

  const isMobile = window.innerWidth < 768
  const numLines = Math.max(Math.floor(rows * 0.72), 10)
  contentCols = Math.min(cols - 4, 130)
  textStartCol = Math.floor((cols - contentCols) / 2)
  textStartRow = Math.max(Math.floor((rows - numLines) / 2), 0)
  justifiedLines = generateLines(numLines, isMobile ? 4 : 9).map(s => justifySentence(s, contentCols))

  charGrid = Array.from({ length: rows }, (_, y) =>
    Array.from({ length: cols }, (_, x) => getCharAt(x, y))
  )

  distMap = []
  angleMap = []
  swirlMap = []
  for (let y = 0; y < rows; y++) {
    distMap[y] = []
    angleMap[y] = []
    swirlMap[y] = []
    for (let x = 0; x < cols; x++) {
      const dx = x / cols - 0.5
      const dy = y / rows - 0.5
      distMap[y][x] = Math.sqrt(dx * dx + dy * dy)
      angleMap[y][x] = Math.atan2(dy, dx)
      swirlMap[y][x] = Math.pow(distMap[y][x], 0.8)
    }
  }

  screenBuffer = Array.from({ length: rows }, () => new Array<string>(cols).fill(' '))

  const activeFiglet = isMobile ? MOBILE_FIGLET_LINES : FIGLET_LINES
  const figletH = activeFiglet.length
  const figletW = Math.max(...activeFiglet.map(l => l.length))
  nameX0 = Math.floor((cols - figletW) / 2)
  nameY0 = Math.floor((rows - figletH) / 2)

  nameCells = []
  for (let fy = 0; fy < figletH; fy++) {
    const line = activeFiglet[fy]
    for (let fx = 0; fx < line.length; fx++) {
      if (line[fx] !== ' ') {
        nameCells.push({ gx: nameX0 + fx, gy: nameY0 + fy, finalChar: line[fx] })
      }
    }
  }

  nameRowSpans = activeFiglet.map(line => {
    let first = -1, last = -1
    for (let fx = 0; fx < line.length; fx++) {
      if (line[fx] !== ' ') { if (first === -1) first = fx; last = fx }
    }
    return { first, last }
  })

  if (effectiveTime >= SWIRL_THRESHOLD) {
    nameCycleStart = effectiveTime - CYCLE_DURATION
  } else {
    nameCycleStart = null
  }
}

function fillBufferSpiral() {
  const time = effectiveTime
  const blend = Math.min(1.0, time / BLEND_DURATION)
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const dist = distMap[y][x]
      const srcAngle = angleMap[y][x] + swirlMap[y][x] * time * 0.5
      let srcX = Math.floor((0.5 + Math.cos(srcAngle) * dist) * cols)
      let srcY = Math.floor((0.5 + Math.sin(srcAngle) * dist) * rows)
      if (blend < 1.0) {
        srcX = Math.round(x + (srcX - x) * blend)
        srcY = Math.round(y + (srcY - y) * blend)
      }
      screenBuffer[y][x] =
        srcX < 0 || srcY < 0 || srcY >= rows || srcX >= cols ? ' ' : charGrid[srcY][srcX]
    }
  }
}

function drawText() {
  if (!ctx || !canvasRef.value) return
  const time = effectiveTime

  if (elapsedRealTime <= START_DELAY) {
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        screenBuffer[y][x] = charGrid[y][x]
      }
    }
  } else {
    fillBufferSpiral()
  }

  if (nameCycleStart === null && time >= SWIRL_THRESHOLD) nameCycleStart = time
  if (nameCycleStart !== null) {
    for (let fy = 0; fy < nameRowSpans.length; fy++) {
      const { first, last } = nameRowSpans[fy]
      if (first === -1) continue
      const gy = nameY0 + fy
      if (gy < 0 || gy >= rows) continue
      for (let fx = first; fx <= last; fx++) {
        const gx = nameX0 + fx
        if (gx >= 0 && gx < cols) screenBuffer[gy][gx] = ' '
      }
    }
  }

  ctx.clearRect(0, 0, canvasRef.value.width, canvasRef.value.height)
  ctx.fillStyle = '#aaaaaa'
  for (let y = 0; y < rows; y++) {
    ctx.fillText(screenBuffer[y].join(''), xOffset, yOffset + y * CHAR_HEIGHT)
  }

  if (nameCycleStart !== null) {
    ctx.save()
    ctx.fillStyle = '#1a1a1a'
    const elapsed = time - nameCycleStart
    const cycleChar =
      elapsed < CYCLE_DURATION
        ? CYCLE_SEQ[Math.floor((elapsed / CYCLE_DURATION) * CYCLE_SEQ.length)]
        : null
    for (const { gx, gy, finalChar } of nameCells) {
      if (gx < 0 || gy < 0 || gx >= cols || gy >= rows) continue
      ctx.fillText(cycleChar ?? finalChar, xOffset + gx * charWidth, yOffset + gy * CHAR_HEIGHT)
    }
    ctx.restore()
  }
}

function animate(timestamp: number) {
  if (!isRunning) return
  if (lastTimestamp === null) lastTimestamp = timestamp
  const dt = (timestamp - lastTimestamp) / 1000
  lastTimestamp = timestamp
  elapsedRealTime += dt
  if (elapsedRealTime > START_DELAY) {
    speed = Math.min(speed + ACCELERATION * dt, MAX_SPEED)
    effectiveTime += speed * dt
  }
  drawText()
  animId = requestAnimationFrame(animate)
}

function handleResize() { buildAll() }

function handleVisibilityChange() {
  if (document.hidden) {
    if (animId !== null) { cancelAnimationFrame(animId); animId = null }
  } else if (isRunning) {
    lastTimestamp = null
    animId = requestAnimationFrame(animate)
  }
}

onMounted(async () => {
  if (prefersReducedMotion) return
  const canvas = canvasRef.value
  if (!canvas) return
  ctx = canvas.getContext('2d')
  if (!ctx) return

  effectiveTime = 0
  speed = 0
  elapsedRealTime = 0
  lastTimestamp = null
  nameCycleStart = null

  await document.fonts.ready

  buildAll()
  isRunning = true
  animId = requestAnimationFrame(animate)
  window.addEventListener('resize', handleResize)
  document.addEventListener('visibilitychange', handleVisibilityChange)
})

onUnmounted(() => {
  isRunning = false
  if (animId !== null) cancelAnimationFrame(animId)
  window.removeEventListener('resize', handleResize)
  document.removeEventListener('visibilitychange', handleVisibilityChange)
  ctx = null
})
</script>

<template>
  <template v-if="!prefersReducedMotion">
    <canvas ref="canvasRef" class="swirl-canvas" aria-hidden="true" />
  </template>
</template>

<style scoped>
.swirl-canvas {
  position: fixed;
  top: 0;
  left: 0;
  z-index: -1;
  pointer-events: none;
  display: block;
}
</style>
