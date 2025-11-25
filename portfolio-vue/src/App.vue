<script setup lang="ts">
import { computed, ref, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import AppNavigation from './components/navigation/AppNavigation.vue'
import AnimatedFooter from './components/animations/AnimatedFooter.vue'

const route = useRoute()
const isHomePage = computed(() => route.name === 'home')

const previousRoute = ref<string | null>(null)
const transitionName = ref('depth-shift')
const footerAnimationStarted = ref(false)
const isInitialLoad = ref(true)

const handleTitleAnimationComplete = () => {
  footerAnimationStarted.value = true
}

// On initial mount, if we're on home page, set up footer animation
onMounted(() => {
  if (isHomePage.value) {
    footerAnimationStarted.value = false
    // Trigger footer animation after title animation completes
    setTimeout(() => {
      footerAnimationStarted.value = true
    }, 2500)
  }
  isInitialLoad.value = false
})

// Watch route changes to determine transition type
watch(route, (to, from) => {
  const fromName = from?.name as string
  const toName = to?.name as string

  // Use depth shift for all transitions
  transitionName.value = 'depth-shift'

  // Reset footer animation when navigating to home page (but not on initial load)
  if (toName === 'home' && !isInitialLoad.value) {
    footerAnimationStarted.value = false
  }

  previousRoute.value = fromName
}, { immediate: true })
</script>

<template>
  <div id="app">
    <AppNavigation />

    <div class="router-container">
      <RouterView v-slot="{ Component }">
        <Transition :name="transitionName" mode="out-in">
          <component :is="Component" @title-animation-complete="handleTitleAnimationComplete" />
        </Transition>
      </RouterView>
    </div>

    <Transition name="footer-fade" mode="out-in">
      <footer v-if="isHomePage" class="bottom-footer" key="footer">
        <AnimatedFooter :start-animation="footerAnimationStarted" />
      </footer>
    </Transition>
  </div>
</template>

<style scoped>
#app {
  position: relative;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.router-container {
  position: relative;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.bottom-footer {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: var(--spacing) 0;
  text-align: center;
}

/* Footer transition animations */
.footer-fade-enter-active {
  transition: all 0.5s ease-out;
  transition-delay: 0.3s;
}

.footer-fade-leave-active {
  transition: all 0.2s ease-in;
}

.footer-fade-enter-from {
  opacity: 0;
  transform: translateY(15px);
}

.footer-fade-enter-to {
  opacity: 1;
  transform: translateY(0);
}

.footer-fade-leave-from {
  opacity: 1;
  transform: translateY(0);
}

.footer-fade-leave-to {
  opacity: 0;
  transform: translateY(-15px);
}

/* Depth shift transition animations */
.depth-shift-enter-active,
.depth-shift-leave-active {
  transition: all 0.8s cubic-bezier(0.25, 0.1, 0.25, 1);
}

.depth-shift-enter-active {
  transition-delay: 0.2s;
}

.depth-shift-enter-from {
  opacity: 0;
  transform: scale(1.05) translateZ(0);
  filter: blur(2px);
}

.depth-shift-enter-to {
  opacity: 1;
  transform: scale(1) translateZ(0);
  filter: blur(0);
}

.depth-shift-leave-from {
  opacity: 1;
  transform: scale(1) translateZ(0);
  filter: blur(0);
}

.depth-shift-leave-to {
  opacity: 0;
  transform: scale(0.95) translateZ(0);
  filter: blur(1px);
}
</style>