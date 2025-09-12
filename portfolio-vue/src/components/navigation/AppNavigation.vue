<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

// Navigation scroll behavior
const nav = ref<HTMLElement>()
let lastScrollTop = 0

const handleScroll = () => {
  if (!nav.value) return
  
  const scrollTop = window.scrollY || document.documentElement.scrollTop
  
  if (scrollTop > lastScrollTop && scrollTop > 100) {
    // Scrolling down
    nav.value.style.transform = 'translateY(-100%)'
  } else {
    // Scrolling up
    nav.value.style.transform = 'translateY(0)'
  }
  
  lastScrollTop = scrollTop <= 0 ? 0 : scrollTop
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<template>
  <nav ref="nav" class="navigation">
    <div class="nav-brand">Charlie Brunold</div>
    <div class="nav-links">
      <a href="404.html" class="nav-link">Work</a>
      <a href="404.html" class="nav-link">About</a>
      <a href="404.html" class="nav-link">Contact</a>
    </div>
  </nav>
</template>

<style scoped>
.navigation {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: var(--nav-background);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(26, 26, 26, 0.1);
  z-index: 100;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing) var(--spacing);
  height: var(--nav-height);
  transition: transform 0.3s ease;
}

.nav-brand {
  font-weight: 600;
  font-size: 18px;
  color: var(--text-color);
  font-family: var(--font-mono);
}

.nav-links {
  display: flex;
  gap: var(--spacing);
}

.nav-link {
  color: var(--secondary-color);
  text-decoration: none;
  font-weight: 400;
  transition: color 0.2s ease;
  font-family: var(--font-mono);
}

.nav-link:hover {
  color: var(--text-color);
}

/* Responsive Design */
@media (max-width: 768px) {
  .navigation {
    padding: var(--spacing-sm) var(--spacing);
    height: var(--nav-height-mobile);
  }
  
  .nav-links {
    gap: var(--spacing-sm);
  }
}

@media (max-width: 480px) {
  .nav-brand {
    font-size: 16px;
  }
  
  .nav-links {
    flex-direction: column;
    gap: 8px;
  }
  
  .navigation {
    flex-direction: column;
    align-items: flex-start;
    height: auto;
    padding: var(--spacing-sm);
  }
}
</style>