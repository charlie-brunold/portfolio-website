<script setup lang="ts">
import AppNavigation from './components/navigation/AppNavigation.vue'
import AnimatedFooter from './components/animations/AnimatedFooter.vue'
</script>

<template>
  <div id="app">
    <AppNavigation />
    
    <RouterView />
    
    <footer class="bottom-footer">
      <AnimatedFooter />
    </footer>
  </div>
</template>

<style scoped>
.bottom-footer {
  padding: var(--spacing) 0;
  text-align: center;
}
</style>