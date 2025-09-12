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
  height: 100vh;
  margin-top: calc(-1 * var(--nav-height));
  padding-top: var(--nav-height);
}

@media (max-width: 768px) {
  .main-content {
    margin-top: calc(-1 * var(--nav-height-mobile));
    padding-top: var(--nav-height-mobile);
  }
}
</style>
