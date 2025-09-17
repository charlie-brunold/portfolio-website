<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import AppNavigation from './components/navigation/AppNavigation.vue'
import AnimatedFooter from './components/animations/AnimatedFooter.vue'

const route = useRoute()
const isHomePage = computed(() => route.name === 'home')
</script>

<template>
  <div id="app">
    <AppNavigation />
    
    <RouterView v-slot="{ Component }">
      <Transition name="slide-up" mode="out-in">
        <component :is="Component" />
      </Transition>
    </RouterView>
    
    <footer v-if="isHomePage" class="bottom-footer">
      <AnimatedFooter />
    </footer>
  </div>
</template>

<style scoped>
.bottom-footer {
  padding: var(--spacing) 0;
  text-align: center;
}

/* Page transition animations */
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.slide-up-enter-from {
  opacity: 0;
  transform: translateY(100vh);
}

.slide-up-enter-to {
  opacity: 1;
  transform: translateY(0);
}

.slide-up-leave-from {
  opacity: 1;
  transform: translateY(0);
}

.slide-up-leave-to {
  opacity: 0;
  transform: translateY(-100vh);
}
</style>