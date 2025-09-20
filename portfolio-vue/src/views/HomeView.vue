<script setup lang="ts">
import HeroSection from '../components/sections/HeroSection.vue'
</script>

<template>
  <main class="main-content">
    <HeroSection />
  </main>
</template>

<style scoped>
.main-content {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  text-align: left;
  padding: 0 var(--spacing);
  min-height: calc(100vh - var(--nav-height) - 120px);
}

@media (max-width: 768px) {
  .main-content {
    min-height: calc(100vh - var(--nav-height-mobile) - 120px);
  }
}
</style>
