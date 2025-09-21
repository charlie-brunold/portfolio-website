<script setup lang="ts">
const footerText = "Updated September 2025"
</script>

<template>
  <p class="last-updated">
    {{ footerText }}
  </p>
</template>

<style scoped>
.last-updated {
  color: var(--secondary-color);
  font-size: 14px;
  margin: 0;
  font-family: var(--font-mono);
}
</style>