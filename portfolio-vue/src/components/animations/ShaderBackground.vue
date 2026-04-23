<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'

const canvasRef = ref<HTMLCanvasElement | null>(null)
const prefersReducedMotion =
  typeof window !== 'undefined'
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
    : false

// ── Config ────────────────────────────────────────────────────────────────────
const CELL_W     = 10
const CELL_H     = 14
const FONT_SIZE  = 11
const FPS        = 60
const SPIN_SPEED = 0.17
const ZOOM       = 0.5
const TIME_OFFSET = 0

// Keep the stamp footprint close to the previous Figlet-based layout.
const CHARLIE_STAMP_COLS = 126
const CHARLIE_STAMP_ROWS = 22
const BRUNOLD_STAMP_COLS = 104
const BRUNOLD_STAMP_ROWS = 18

// Gap (in swirl rows) between CHARLIE and BRUNOLD
const STAMP_GAP = 4

// Wall-clock seconds after mount when each word stamps in
const CHARLIE_STAMP_T = 3.0
const BRUNOLD_STAMP_T = 3.5

const SWIRL_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:<>?,./~`\\'
const STAMP_EDGE_CHARS = '█▓▒░'
const STAMP_FILL_CHARS = '░.'
const TEXT_MASK_OVERSAMPLE = 8
const TEXT_MASK_THRESHOLD = 0.1
const STAMP_SOLID_THRESHOLD = 0.36
const STAMP_HALO_RADIUS = 3
const STAMP_FONT_STACK = '"IBM Plex Mono", "Azeret Mono", "Space Mono", "SFMono-Regular", "Menlo", "Monaco", "Consolas", monospace'

const STAMP_OWNER_NONE = 0
const STAMP_OWNER_CHARLIE = 1
const STAMP_OWNER_BRUNOLD = 2

const STAMP_BAND_NONE = 0
const STAMP_BAND_FILL = 1
const STAMP_BAND_FRINGE = 2
const STAMP_BAND_INNER = 3
const STAMP_BAND_MIDDLE = 4
const STAMP_BAND_OUTER = 5

// ── Runtime state ─────────────────────────────────────────────────────────────
let ctx: CanvasRenderingContext2D | null = null
let animId: number | null = null
let startTime = 0
let isRunning  = false
let dpr = 1
let logicalW = 0
let logicalH = 0
let lastFrameTime = 0

let srcGrid: string[] = []
let srcCols = 0
let srcRows = 0

// Stamp layers — owner, band, and local text coverage for each swirl cell.
let stampOwner: Uint8Array = new Uint8Array(0)
let stampBand: Uint8Array = new Uint8Array(0)
let stampCoverage: Float32Array = new Float32Array(0)
let maskGridCols = 0

let charlieActive = false
let brunoldActive = false

// ── Source grid ───────────────────────────────────────────────────────────────
function buildSwirlGrid(cols: number, rows: number) {
  srcCols = cols
  srcRows = rows
  srcGrid = []
  for (let r = 0; r < rows; r++) {
    let line = ''
    for (let c = 0; c < cols; c++) {
      const nx = (c / cols) * 10
      const ny = (r / rows) * 7
      const v =
        Math.sin(nx * 1.1 + ny * 0.8) * Math.cos(nx * 0.7 - ny * 1.3) +
        0.5  * Math.sin(nx * 2.4 - ny * 1.9) +
        0.25 * Math.cos(nx * 0.4 + ny * 3.1)
      const n = (v / 1.75 + 1) / 2
      if (n < 0.38) {
        line += ' '
      } else {
        const idx = Math.floor(((n - 0.38) / 0.62) * (SWIRL_CHARS.length - 1))
        line += SWIRL_CHARS[idx]
      }
    }
    srcGrid.push(line)
  }
}

// ── Stamp mask builder ────────────────────────────────────────────────────────
function createTextMask(text: string, targetCols: number, targetRows: number) {
  const widthPx = Math.max(targetCols * TEXT_MASK_OVERSAMPLE, TEXT_MASK_OVERSAMPLE)
  const heightPx = Math.max(targetRows * TEXT_MASK_OVERSAMPLE, TEXT_MASK_OVERSAMPLE)
  const offscreen = document.createElement('canvas')
  offscreen.width = widthPx
  offscreen.height = heightPx

  const offscreenCtx = offscreen.getContext('2d', { willReadFrequently: true })
  if (!offscreenCtx) return new Float32Array(targetCols * targetRows)

  let fontSize = heightPx

  for (let i = 0; i < 4; i++) {
    offscreenCtx.font = `700 ${fontSize}px ${STAMP_FONT_STACK}`
    const metrics = offscreenCtx.measureText(text)
    const ascent = metrics.actualBoundingBoxAscent || fontSize * 0.74
    const descent = metrics.actualBoundingBoxDescent || fontSize * 0.26
    const textHeight = Math.max(ascent + descent, 1)
    const widthScale = (widthPx * 0.94) / Math.max(metrics.width, 1)
    const heightScale = (heightPx * 0.9) / textHeight
    const nextSize = Math.floor(fontSize * Math.min(widthScale, heightScale, 1))
    if (Math.abs(nextSize - fontSize) < 1) break
    fontSize = Math.max(nextSize, TEXT_MASK_OVERSAMPLE)
  }

  offscreenCtx.clearRect(0, 0, widthPx, heightPx)
  offscreenCtx.font = `700 ${fontSize}px ${STAMP_FONT_STACK}`
  offscreenCtx.fillStyle = '#000'
  offscreenCtx.textAlign = 'center'
  offscreenCtx.textBaseline = 'alphabetic'

  const finalMetrics = offscreenCtx.measureText(text)
  const ascent = finalMetrics.actualBoundingBoxAscent || fontSize * 0.74
  const descent = finalMetrics.actualBoundingBoxDescent || fontSize * 0.26
  const baselineY = (heightPx + ascent - descent) / 2

  offscreenCtx.fillText(text, widthPx / 2, baselineY)

  const alpha = offscreenCtx.getImageData(0, 0, widthPx, heightPx).data
  const mask = new Float32Array(targetCols * targetRows)

  for (let row = 0; row < targetRows; row++) {
    for (let col = 0; col < targetCols; col++) {
      let covered = 0
      const xStart = col * TEXT_MASK_OVERSAMPLE
      const yStart = row * TEXT_MASK_OVERSAMPLE

      for (let sy = 0; sy < TEXT_MASK_OVERSAMPLE; sy++) {
        for (let sx = 0; sx < TEXT_MASK_OVERSAMPLE; sx++) {
          const alphaIndex = ((yStart + sy) * widthPx + (xStart + sx)) * 4 + 3
          if (alpha[alphaIndex] > 0) covered++
        }
      }

      const coverage = covered / (TEXT_MASK_OVERSAMPLE * TEXT_MASK_OVERSAMPLE)
      mask[row * targetCols + col] = coverage
    }
  }

  return mask
}

function applyStampCell(index: number, owner: number, band: number, coverage: number) {
  const currentBand = stampBand[index]
  if (
    currentBand === STAMP_BAND_NONE ||
    band < currentBand ||
    (band === currentBand && coverage > stampCoverage[index])
  ) {
    stampOwner[index] = owner
    stampBand[index] = band
    stampCoverage[index] = coverage
  }
}

function stampWord(
  text: string,
  startCol: number,
  startRow: number,
  targetCols: number,
  targetRows: number,
  owner: number,
  gridCols: number,
  gridRows: number,
) {
  const localMask = createTextMask(text, targetCols, targetRows)
  const localFilled = new Uint8Array(targetCols * targetRows)

  for (let row = 0; row < targetRows; row++) {
    for (let col = 0; col < targetCols; col++) {
      const coverage = localMask[row * targetCols + col]
      if (coverage < TEXT_MASK_THRESHOLD) continue
      localFilled[row * targetCols + col] = 1
      const gridCol = startCol + col
      const gridRow = startRow + row
      if (gridCol < 0 || gridCol >= gridCols || gridRow < 0 || gridRow >= gridRows) continue
      const band = coverage >= STAMP_SOLID_THRESHOLD ? STAMP_BAND_FILL : STAMP_BAND_FRINGE
      applyStampCell(gridRow * gridCols + gridCol, owner, band, coverage)
    }
  }

  for (let row = startRow - STAMP_HALO_RADIUS; row < startRow + targetRows + STAMP_HALO_RADIUS; row++) {
    for (let col = startCol - STAMP_HALO_RADIUS; col < startCol + targetCols + STAMP_HALO_RADIUS; col++) {
      if (row < 0 || col < 0 || row >= gridRows || col >= gridCols) continue
      const localRow = row - startRow
      const localCol = col - startCol

      if (
        localRow >= 0 &&
        localCol >= 0 &&
        localRow < targetRows &&
        localCol < targetCols &&
        localFilled[localRow * targetCols + localCol] === 1
      ) {
        continue
      }

      let nearestDistance = 0

      for (let radius = 1; radius <= STAMP_HALO_RADIUS && nearestDistance === 0; radius++) {
        for (let dr = -radius; dr <= radius && nearestDistance === 0; dr++) {
          for (let dc = -radius; dc <= radius; dc++) {
            if (Math.max(Math.abs(dr), Math.abs(dc)) !== radius) continue
            const nr = localRow + dr
            const nc = localCol + dc
            if (nr < 0 || nc < 0 || nr >= targetRows || nc >= targetCols) continue
            if (localFilled[nr * targetCols + nc] === 1) {
              nearestDistance = radius
              break
            }
          }
        }
      }

      if (nearestDistance === 0) continue

      const band =
        nearestDistance === 1 ? STAMP_BAND_INNER :
        nearestDistance === 2 ? STAMP_BAND_MIDDLE :
        STAMP_BAND_OUTER
      const coverage =
        nearestDistance === 1 ? 0.72 :
        nearestDistance === 2 ? 0.46 :
        0.24

      applyStampCell(row * gridCols + col, owner, band, coverage)
    }
  }
}

function isMaskActive(owner: number) {
  if (owner === STAMP_OWNER_CHARLIE && charlieActive) return true
  if (owner === STAMP_OWNER_BRUNOLD && brunoldActive) return true
  return false
}

function cellNoise(row: number, col: number, seed = 0) {
  let n = Math.imul(row + seed, 374761393) ^ Math.imul(col - seed, 668265263)
  n = (n ^ (n >>> 13)) >>> 0
  n = Math.imul(n, 1274126177) >>> 0
  return ((n ^ (n >>> 16)) >>> 0) / 4294967295
}

function shouldRenderFill(row: number, col: number, coverage: number) {
  return cellNoise(row, col, 17) < 0.04 + coverage * 0.2
}

function pickFillChar(row: number, col: number, coverage: number) {
  const index = coverage > 0.58 || cellNoise(row, col, 7) > 0.55 ? 0 : 1
  return STAMP_FILL_CHARS[index]
}

function pickBandChar(band: number, row: number, col: number, coverage: number) {
  if (band === STAMP_BAND_FRINGE) {
    return coverage > 0.22 || cellNoise(row, col, 29) > 0.45 ? STAMP_EDGE_CHARS[0] : STAMP_EDGE_CHARS[1]
  }

  if (band === STAMP_BAND_INNER) return STAMP_EDGE_CHARS[1]
  if (band === STAMP_BAND_MIDDLE) return STAMP_EDGE_CHARS[2]
  if (band === STAMP_BAND_OUTER) return STAMP_EDGE_CHARS[3]
  return STAMP_EDGE_CHARS[1]
}

function getBandAlpha(band: number, coverage: number) {
  if (band === STAMP_BAND_FILL) return 0.03 + coverage * 0.16
  if (band === STAMP_BAND_FRINGE) return 0.74 + coverage * 0.12
  if (band === STAMP_BAND_INNER) return 0.5
  if (band === STAMP_BAND_MIDDLE) return 0.28
  if (band === STAMP_BAND_OUTER) return 0.14
  return 0
}

function buildStampMask(gridCols: number, gridRows: number) {
  maskGridCols = gridCols
  stampOwner = new Uint8Array(gridCols * gridRows)
  stampBand = new Uint8Array(gridCols * gridRows)
  stampCoverage = new Float32Array(gridCols * gridRows)

  const totalScaledH = CHARLIE_STAMP_ROWS + STAMP_GAP + BRUNOLD_STAMP_ROWS
  const topRow = Math.floor((gridRows - totalScaledH) / 2)
  const charlieStartCol = Math.floor((gridCols - CHARLIE_STAMP_COLS) / 2)
  const brunoldStartCol = Math.floor((gridCols - BRUNOLD_STAMP_COLS) / 2)

  stampWord(
    'CHARLIE',
    charlieStartCol,
    topRow,
    CHARLIE_STAMP_COLS,
    CHARLIE_STAMP_ROWS,
    STAMP_OWNER_CHARLIE,
    gridCols,
    gridRows,
  )

  stampWord(
    'BRUNOLD',
    brunoldStartCol,
    topRow + CHARLIE_STAMP_ROWS + STAMP_GAP,
    BRUNOLD_STAMP_COLS,
    BRUNOLD_STAMP_ROWS,
    STAMP_OWNER_BRUNOLD,
    gridCols,
    gridRows,
  )
}

// ── Alpha batching ────────────────────────────────────────────────────────────
let _lastAlphaKey = -1
function setAlpha(alpha: number) {
  const key = Math.round(Math.min(alpha, 1) * 20)
  if (key === _lastAlphaKey) return
  _lastAlphaKey = key
  ctx!.fillStyle = `rgba(0,0,0,${(key / 20).toFixed(3)})`
}

// ── Render ────────────────────────────────────────────────────────────────────
function render(t: number, wallSecs: number) {
  if (!ctx || srcGrid.length === 0) return

  // Activate stamps on first frame their wall-clock time is reached
  if (!charlieActive && wallSecs >= CHARLIE_STAMP_T) charlieActive = true
  if (!brunoldActive && wallSecs >= BRUNOLD_STAMP_T) brunoldActive = true

  ctx.clearRect(0, 0, logicalW * dpr, logicalH * dpr)
  ctx.font = `${FONT_SIZE * dpr}px monospace`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  _lastAlphaKey = -1

  const cols = Math.ceil(logicalW / CELL_W) + 1
  const rows = Math.ceil(logicalH / CELL_H) + 1

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const index = row * maskGridCols + col
      const owner = col < maskGridCols ? stampOwner[index] : STAMP_OWNER_NONE
      const band = col < maskGridCols ? stampBand[index] : STAMP_BAND_NONE

      if (band !== STAMP_BAND_NONE && isMaskActive(owner)) {
        const coverage = stampCoverage[index]

        if (band === STAMP_BAND_FILL) {
          if (shouldRenderFill(row, col, coverage)) {
            setAlpha(getBandAlpha(band, coverage))
            ctx.fillText(
              pickFillChar(row, col, coverage),
              col * CELL_W * dpr + CELL_W * dpr / 2,
              row * CELL_H * dpr + CELL_H * dpr / 2,
            )
          }
        } else {
          setAlpha(getBandAlpha(band, coverage))
          ctx.fillText(
            pickBandChar(band, row, col, coverage),
            col * CELL_W * dpr + CELL_W * dpr / 2,
            row * CELL_H * dpr + CELL_H * dpr / 2,
          )
        }
        continue
      }

      // ── Swirl ──
      const nx = ((col / cols) * 2 - 1) * ZOOM
      const ny = (1 - (row / rows) * 2) * ZOOM

      const dist  = Math.sqrt(nx * nx + ny * ny)
      const angle = t * SPIN_SPEED / Math.max(0.1, dist)

      const cosA = Math.cos(angle)
      const sinA = Math.sin(angle)
      const rotX = nx * cosA + ny * sinA
      const rotY = nx * sinA - ny * cosA

      let sc = Math.floor(((rotX + 1) / 2) * srcCols)
      let sr = Math.floor(((rotY + 1) / 2) * srcRows)
      sc = ((sc % srcCols) + srcCols) % srcCols
      sr = ((sr % srcRows) + srcRows) % srcRows

      const char = srcGrid[sr]?.[sc] ?? ' '
      if (char === ' ') continue

      setAlpha(0.20 + Math.min(dist / 2, 0.55))
      ctx.fillText(char, col * CELL_W * dpr + CELL_W * dpr / 2, row * CELL_H * dpr + CELL_H * dpr / 2)
    }
  }
}

// ── Animation loop ────────────────────────────────────────────────────────────
function animate(timestamp: number) {
  if (!isRunning) return
  const delta = timestamp - lastFrameTime
  if (delta >= 1000 / FPS) {
    lastFrameTime = timestamp
    const wallSecs = (Date.now() - startTime) / 1000
    render(TIME_OFFSET + wallSecs, wallSecs)
  }
  animId = requestAnimationFrame(animate)
}

// ── Lifecycle ─────────────────────────────────────────────────────────────────
function handleResize() {
  const canvas = canvasRef.value
  if (!canvas || !ctx) return
  dpr = Math.min(window.devicePixelRatio || 1, 2)
  logicalW = window.innerWidth
  logicalH = window.innerHeight
  canvas.width  = logicalW * dpr
  canvas.height = logicalH * dpr
  canvas.style.width  = logicalW + 'px'
  canvas.style.height = logicalH + 'px'
  const cols = Math.ceil(logicalW / CELL_W) + 2
  const rows = Math.ceil(logicalH / CELL_H) + 2
  buildSwirlGrid(cols, rows)
  buildStampMask(cols, rows)
}

function handleVisibilityChange() {
  if (document.hidden) {
    if (animId !== null) { cancelAnimationFrame(animId); animId = null }
  } else if (isRunning) {
    animId = requestAnimationFrame(animate)
  }
}

onMounted(() => {
  if (prefersReducedMotion) return
  const canvas = canvasRef.value
  if (!canvas) return
  ctx = canvas.getContext('2d')
  if (!ctx) return
  handleResize()
  startTime = Date.now()
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
    <canvas ref="canvasRef" class="ascii-canvas" aria-hidden="true" />
    <div class="ascii-vignette" aria-hidden="true" />
  </template>
</template>

<style scoped>
.ascii-canvas,
.ascii-vignette {
  position: fixed;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.ascii-canvas {
  display: block;
  z-index: -1;
}

.ascii-vignette {
  z-index: 0;
  background: radial-gradient(ellipse at center,
    transparent 30%,
    rgba(255, 255, 255, 0.55) 70%,
    rgba(255, 255, 255, 0.92) 100%
  );
}
</style>
