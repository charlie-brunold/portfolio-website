<template>
  <div class="about">
    <div class="about-content">
      <div class="about-text">
        <TypewriterText
          :text="introText"
          class="intro"
          :start-delay="300"
          :animation-duration="1200"
        />

        <div class="section">
          <TypewriterText
            :text="passionTitle"
            tag="h2"
            :start-delay="800"
            :animation-duration="1000"
          />
          <ul class="typewriter-list">
            <TypewriterText
              v-for="(item, index) in passionItems"
              :key="`passion-${index}`"
              :text="item"
              tag="li"
              :start-delay="1200 + (index * 400)"
              :animation-duration="1400"
              class="list-item"
            />
          </ul>
        </div>

        <div class="section">
          <TypewriterText
            :text="aspirationTitle"
            tag="h2"
            :start-delay="3000"
            :animation-duration="1000"
          />
          <ul class="typewriter-list">
            <TypewriterText
              v-for="(item, index) in aspirationItems"
              :key="`aspiration-${index}`"
              :text="item"
              tag="li"
              :start-delay="3400 + (index * 500)"
              :animation-duration="1600"
              class="list-item"
            />
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
import TypewriterText from '@/components/animations/TypewriterText.vue'

// Content for typewriter animation
const introText = "Hey, I'm Charlie Brunold."
const passionTitle = "I'm passionate about:"
const passionItems = [
  "Building with code and seeing projects come to life",
  "The intersection of design and data",
  "Finding patterns through statistics"
]

const aspirationTitle = "I aspire to:"
const aspirationItems = [
  "Serve as a translator between technical and non-technical audiences",
  "Learn more about human behavior and world systems using data",
  "Bring joy to teams"
]
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
  grid-template-columns: 1fr 0.6fr;
  gap: 4rem;
  max-width: 1200px;
  width: 100%;
  align-items: center;
  height: 80vh;
  position: relative;
  overflow: hidden;
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
  position: relative;
  z-index: 2;
}

.intro {
  font-size: clamp(1.75rem, 4vw + 1rem, 4.5rem);
  font-weight: 400;
  color: var(--text-secondary);
  margin: 0 0 2.5rem 0;
  line-height: 1.2;
  opacity: 0;
  animation: introFadeIn 0.5s ease-out forwards;
  animation-delay: 0.2s;
}

@keyframes introFadeIn {
  from {
    opacity: 0;
    transform: translateY(0.3rem);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.section {
  margin-bottom: 2rem;
  opacity: 0;
  animation: sectionFadeIn 0.6s ease-out forwards;
}

.section:nth-child(2) {
  animation-delay: 0.6s;
}

.section:nth-child(3) {
  animation-delay: 2.8s;
}

@keyframes sectionFadeIn {
  from {
    opacity: 0;
    transform: translateY(0.5rem);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.section h2 {
  font-size: clamp(1rem, 1.5vw + 0.5rem, 1.25rem);
  font-weight: 500;
  color: var(--text-primary);
  margin: 0 0 0.75rem 0;
  line-height: 1.3;
}

.section ul,
.section .typewriter-list {
  list-style: none;
  padding: 0;
  margin: 0;
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
  position: fixed;
  bottom: -10vh;
  right: -8vw;
  width: 120vw;
  height: 140vh;
  display: flex;
  justify-content: flex-end;
  align-items: flex-end;
  z-index: 1;
  pointer-events: none;
}

@media (min-width: 1024px) {
  .about {
    padding: var(--nav-height) var(--spacing) var(--spacing);
  }
}

/* Mobile layout - keep striking effect but adjust */
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
    overflow: hidden;
  }

  .intro {
    font-size: clamp(1.5rem, 6vw, 2rem);
    margin-bottom: var(--spacing);
  }

  .section {
    text-align: left;
  }

  .about-portrait {
    position: fixed;
    bottom: -15vh;
    left: 50%;
    transform: translateX(-50%);
    width: 100vw;
    height: 120vh;
    z-index: 1;
    display: flex;
    justify-content: center;
    align-items: flex-end;
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

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  .intro,
  .section {
    opacity: 1;
    animation: none;
    transform: none;
  }

  .intro {
    animation: introFadeInReduced 0.3s ease-out forwards;
  }

  .section {
    animation: sectionFadeInReduced 0.3s ease-out forwards;
  }

  .section:nth-child(2) {
    animation-delay: 0.1s;
  }

  .section:nth-child(3) {
    animation-delay: 0.2s;
  }

  @keyframes introFadeInReduced {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes sectionFadeInReduced {
    from { opacity: 0; }
    to { opacity: 1; }
  }
}
</style>
