<template>
  <svg
    v-if="!hidden"
    style="position: absolute; width: 0; height: 0; pointer-events: none;"
    aria-hidden="true"
  >
    <defs>
      <filter :id="id" x="0%" y="0%" width="100%" height="100%">
        <!-- Step 1: Create a grid pattern -->
        <feFlood flood-color="black" result="black" />

        <!-- Step 2: Create morphology effect for pixelation -->
        <feMorphology
          in="SourceGraphic"
          operator="dilate"
          :radius="Math.max(1, size / 4)"
          result="dilated"
        />

        <!-- Step 3: Create the pixelated blocks -->
        <feConvolveMatrix
          in="dilated"
          :order="`${size} ${size}`"
          :kernelMatrix="Array(size * size).fill(1 / (size * size)).join(' ')"
          result="pixelated"
        />

        <!-- Step 4: Apply to source -->
        <feComposite
          in="pixelated"
          in2="SourceGraphic"
          operator="over"
          result="final"
        />
      </filter>
    </defs>
  </svg>
</template>

<script setup lang="ts">
interface Props {
  id: string
  size?: number
  crossLayers?: boolean
  gridColor?: string
  hidden?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  size: 16,
  crossLayers: false,
  gridColor: '#000000',
  hidden: false
})
</script>