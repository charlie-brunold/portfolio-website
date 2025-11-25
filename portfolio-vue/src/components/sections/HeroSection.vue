<script setup lang="ts">
import { ref } from 'vue'
import AnimatedTitle from '../animations/AnimatedTitle.vue'

// Define emits
const emit = defineEmits<{
  titleAnimationComplete: []
}>()

const handleTitleComplete = () => {
  emit('titleAnimationComplete')
}
</script>

<template>
  <div class="center-content">
    <AnimatedTitle @animation-complete="handleTitleComplete" />
  </div>
</template>

<style scoped>
.center-content {
  max-width: 100%;
  width: 100%;
}
</style>