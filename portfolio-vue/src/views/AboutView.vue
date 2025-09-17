<template>
  <div class="about">
    <div class="about-content">
      <div class="about-text">
        <h1 class="intro">Hey, I'm <span class="name-highlight">Charlie Brunold</span>.</h1>

        <div class="section">
          <h2>I'm passionate about:</h2>
          <ul>
            <li>Building things through code and seeing them come to life</li>
            <li>The intersection of design and data visualization</li>
            <li>Finding patterns through statistics</li>
          </ul>
        </div>

        <div class="section">
          <h2>I aspire to:</h2>
          <ul>
            <li>Serve as a translator between technical and non-technical audiences</li>
            <li>Discover the stories that data tells about human behavior and world systems</li>
            <li>Bring joy to teams</li>
          </ul>
        </div>
      </div>

      <div class="about-portrait">
        <AsciiPortrait />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import AsciiPortrait from '@/components/AsciiPortrait.vue'
</script>

<style>
.about {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--nav-height-mobile) var(--spacing) var(--spacing);
  box-sizing: border-box;
}

.about-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  max-width: 1200px;
  width: 100%;
  align-items: center;
  height: 80vh;
}

.about-text {
  font-family: var(--font-family);
  color: var(--text-secondary);
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100%;
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
}

.intro {
  font-size: clamp(1.75rem, 4vw + 1rem, 4.5rem);
  font-weight: 400;
  color: var(--text-secondary);
  margin: 0 0 2.5rem 0;
  line-height: 1.2;
}

.section {
  margin-bottom: 2rem;
}

.section h2 {
  font-size: clamp(1rem, 1.5vw + 0.5rem, 1.25rem);
  font-weight: 500;
  color: var(--text-primary);
  margin: 0 0 0.75rem 0;
  line-height: 1.3;
}

.section ul {
  list-style: none;
  padding: 0;
  margin: 0;
  padding-left: 2rem;
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}

.section li {
  font-size: clamp(0.85rem, 1.2vw + 0.4rem, 1rem);
  font-weight: 500;
  color: var(--text-secondary);
  line-height: 1.4;
  padding: 0.15rem 0;
  position: relative;
}

.section li::before {
  content: "•";
  color: var(--text-primary);
  position: absolute;
  left: -2rem;
  font-weight: 600;
}

.name-highlight {
  color: var(--text-primary);
  font-weight: 600;
}

.about-portrait {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding-top: 1rem;
}

@media (min-width: 1024px) {
  .about {
    padding: var(--nav-height) var(--spacing) var(--spacing);
  }
}

/* Mobile layout - stack vertically */
@media (max-width: 768px) {
  .about {
    min-height: calc(100vh - var(--nav-height-mobile));
    padding: var(--spacing-sm);
    align-items: flex-start;
    padding-top: calc(var(--nav-height-mobile) + var(--spacing));
  }

  .about-content {
    grid-template-columns: 1fr;
    gap: var(--spacing-lg);
    text-align: center;
  }

  .intro {
    font-size: clamp(1.5rem, 6vw, 2rem);
    margin-bottom: var(--spacing);
  }

  .section {
    text-align: left;
  }

  .about-portrait {
    order: -1;
  }
}

/* Very small screens */
@media (max-width: 480px) {
  .about {
    padding: var(--spacing-sm);
    padding-top: calc(var(--nav-height-mobile) + var(--spacing-sm));
  }

  .about-content {
    gap: var(--spacing);
  }

  .intro {
    font-size: clamp(1.25rem, 7vw, 1.75rem);
    margin-bottom: var(--spacing);
  }

  .section h2 {
    font-size: 1.125rem;
  }

  .section li {
    font-size: 0.9rem;
  }
}
</style>
