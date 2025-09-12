<script setup lang="ts">
import AppNavigation from './components/navigation/AppNavigation.vue'
import HeroSection from './components/sections/HeroSection.vue'
import AnimatedFooter from './components/animations/AnimatedFooter.vue'
</script>

<template>
  <div id="app">
    <AppNavigation />
    
    <main class="main-content">
      <HeroSection />
    </main>
    
    <footer class="bottom-footer">
      <AnimatedFooter />
    </footer>
  </div>
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

.bottom-footer {
  padding: var(--spacing) 0;
  text-align: center;
}

@media (max-width: 768px) {
  .main-content {
    margin-top: calc(-1 * var(--nav-height-mobile));
    padding-top: var(--nav-height-mobile);
  }
}
</style>