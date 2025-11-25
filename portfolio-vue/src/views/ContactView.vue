<template>
  <div class="contact">
    <div class="contact-content">
      <div class="contact-text">
        <div class="intro">
          <span class="contact-highlight">Let's connect.</span>
        </div>

        <div class="section contact-section">
          <h2>Get in touch</h2>
          <div class="contact-links">
            <a href="mailto:your.email@example.com" class="contact-link">
              ⇀ Email
            </a>
            <a href="https://linkedin.com/in/yourprofile" target="_blank" class="contact-link">
              ⇀ LinkedIn
            </a>
            <a href="https://github.com/yourusername" target="_blank" class="contact-link">
              ⇀ GitHub
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Contact page component
</script>

<style scoped>
.contact {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--nav-height) var(--spacing) var(--spacing);
  box-sizing: border-box;
}

.contact-content {
  max-width: var(--max-width);
  width: 100%;
  text-align: center;
}

.contact-text {
  font-family: var(--font-family);
  color: var(--text-color);
}

.intro {
  font-size: clamp(2rem, 5vw + 1rem, 4rem);
  font-weight: 400;
  color: var(--text-color);
  margin: 0 0 3rem 0;
  line-height: 1.2;
}

.contact-highlight {
  color: var(--text-color);
  font-weight: 600;
}

.section {
  margin-bottom: 2rem;
}

.section h2 {
  font-size: clamp(1.25rem, 2vw + 0.5rem, 1.5rem);
  font-weight: 500;
  color: var(--text-color);
  margin: 0 0 1.5rem 0;
  line-height: 1.3;
}

.contact-links {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
}

.contact-link {
  font-size: clamp(1rem, 1.5vw + 0.5rem, 1.25rem);
  font-weight: 500;
  color: var(--secondary-color);
  text-decoration: none;
  transition: color 0.2s ease;
  font-family: var(--font-mono);
}

.contact-link:hover {
  color: var(--text-color);
}

@media (min-width: 768px) {
  .contact-links {
    flex-direction: row;
    justify-content: center;
    gap: 2rem;
  }
}

@media (max-width: 768px) {
  .contact {
    padding: calc(var(--nav-height-mobile) + var(--spacing)) var(--spacing) var(--spacing);
  }

  .intro {
    font-size: clamp(1.5rem, 8vw, 2.5rem);
    margin-bottom: 2rem;
  }
}

@media (max-width: 480px) {
  .contact {
    padding: calc(var(--nav-height-mobile) + var(--spacing-sm)) var(--spacing-sm) var(--spacing-sm);
  }

  .intro {
    font-size: clamp(1.25rem, 10vw, 2rem);
    margin-bottom: 1.5rem;
  }

  .section h2 {
    font-size: 1.125rem;
  }

  .contact-links {
    gap: 0.75rem;
  }

  .contact-link {
    font-size: 1rem;
  }
}
</style>