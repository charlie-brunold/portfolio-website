<template>
  <div class="about">
    <!-- Fixed ASCII Portrait -->
    <div class="about-portrait-fixed">
      <AsciiPortrait />
    </div>

    <!-- Scrollable Content Area -->
    <div class="about-content-scrollable">
      <div class="about-text-container">
        <div class="intro">
          <span class="name-highlight">{{ introText }}</span>
        </div>

        <div class="section-divider"></div>

        <div class="section passion-section">
          <h2>{{ passionTitle }}</h2>
          <ul>
            <li v-for="(item, index) in passionItems" :key="`passion-${index}`">
              {{ item }}
            </li>
          </ul>
        </div>

        <div class="section-divider"></div>

        <div class="section aspiration-section">
          <h2>{{ aspirationTitle }}</h2>
          <ul>
            <li v-for="(item, index) in aspirationItems" :key="`aspiration-${index}`">
              {{ item }}
            </li>
          </ul>
        </div>

        <div class="section-divider"></div>

        <!-- Add some more content to demonstrate scrolling -->
        <div class="section background-section">
          <h2>Background</h2>
          <ul>
            <li>Computer Science graduate with a focus on data analysis</li>
            <li>Experience in full-stack development and statistical modeling</li>
            <li>Passionate about creating meaningful connections through technology</li>
          </ul>
        </div>

        <div class="section-divider"></div>

        <div class="section values-section">
          <h2>What I value</h2>
          <ul>
            <li>Clear communication and empathy in technical discussions</li>
            <li>Continuous learning and intellectual curiosity</li>
            <li>Building systems that genuinely help people</li>
            <li>Collaborative problem-solving and knowledge sharing</li>
          </ul>
        </div>

        <!-- Extra spacing at bottom for comfortable scrolling -->
        <div class="scroll-padding"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import AsciiPortrait from '@/components/AsciiPortrait.vue'

// Content for sections
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
  position: relative;
  min-height: 100vh;
  overflow: hidden;
}

/* Fixed ASCII Portrait */
.about-portrait-fixed {
  position: fixed;
  top: 0;
  right: 0;
  width: 50vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1;
  pointer-events: none;
}

/* Scrollable Content Area */
.about-content-scrollable {
  position: relative;
  width: 50vw;
  min-height: 100vh;
  overflow-y: auto;
  z-index: 2;
  padding: calc(var(--nav-height-mobile) + 2rem) 2rem 2rem 2rem;
  box-sizing: border-box;
}

.about-text-container {
  max-width: 600px;
  font-family: var(--font-family);
  color: var(--text-secondary);
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
}

.intro {
  font-size: clamp(1.75rem, 3vw + 1rem, 3rem);
  font-weight: 400;
  color: var(--text-secondary);
  margin: 0 0 3rem 0;
  line-height: 1.2;
  opacity: 0;
  animation: fadeInFromBottom 0.8s ease-out forwards;
  animation-delay: 0.2s;
}

.section {
  margin-bottom: 3rem;
  opacity: 0;
  animation: fadeInFromBottom 0.8s ease-out forwards;
}

.passion-section {
  animation-delay: 0.6s;
}

.aspiration-section {
  animation-delay: 1.0s;
}

.background-section {
  animation-delay: 1.4s;
}

.values-section {
  animation-delay: 1.8s;
}

/* Section Dividers */
.section-divider {
  width: 100%;
  height: 2px;
  background: linear-gradient(90deg, var(--text-primary) 0%, transparent 100%);
  margin: 3rem 0;
  opacity: 0;
  animation: fadeInFromBottom 0.8s ease-out forwards;
  animation-delay: 0.4s;
}

@keyframes fadeInFromBottom {
  from {
    opacity: 0;
    transform: translateY(1.5rem);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.section h2 {
  font-size: clamp(1.1rem, 1.5vw + 0.5rem, 1.4rem);
  font-weight: 500;
  color: var(--text-primary);
  margin: 0 0 1rem 0;
  line-height: 1.3;
}

.section ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.section li {
  font-size: clamp(0.9rem, 1.2vw + 0.4rem, 1.1rem);
  font-weight: 500;
  color: var(--text-secondary);
  line-height: 1.5;
  padding: 0.25rem 0;
  position: relative;
  padding-left: 1.5rem;
}

.section li::before {
  content: "•";
  color: var(--text-primary);
  position: absolute;
  left: 0;
  font-weight: 600;
}

.name-highlight {
  color: var(--text-primary);
  font-weight: 600;
}

.scroll-padding {
  height: 4rem;
}

@media (min-width: 1024px) {
  .about-content-scrollable {
    padding: calc(var(--nav-height) + 2rem) 3rem 2rem 3rem;
  }
}

/* Mobile layout */
@media (max-width: 768px) {
  .about-portrait-fixed {
    position: fixed;
    bottom: -10vh;
    left: 50%;
    transform: translateX(-50%);
    width: 100vw;
    height: 80vh;
    z-index: 1;
    display: flex;
    justify-content: center;
    align-items: flex-end;
  }

  .about-content-scrollable {
    width: 100vw;
    padding: calc(var(--nav-height-mobile) + 1rem) 1.5rem 1rem 1.5rem;
  }

  .intro {
    font-size: clamp(1.5rem, 6vw, 2.5rem);
    margin-bottom: 2rem;
    text-align: center;
  }

  .section {
    text-align: left;
    margin-bottom: 2.5rem;
  }

  .section-divider {
    margin: 2rem 0;
  }
}

/* Very small screens */
@media (max-width: 480px) {
  .about-content-scrollable {
    padding: calc(var(--nav-height-mobile) + 1rem) 1rem 1rem 1rem;
  }

  .intro {
    font-size: clamp(1.25rem, 7vw, 2rem);
    margin-bottom: 1.5rem;
  }

  .section h2 {
    font-size: 1.125rem;
  }

  .section li {
    font-size: 0.95rem;
  }

  .section {
    margin-bottom: 2rem;
  }

  .section-divider {
    margin: 1.5rem 0;
  }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  .intro,
  .section,
  .section-divider {
    opacity: 1;
    animation: fadeInReduced 0.3s ease-out forwards;
    transform: none;
  }

  .intro {
    animation-delay: 0.1s;
  }

  .passion-section {
    animation-delay: 0.2s;
  }

  .aspiration-section {
    animation-delay: 0.3s;
  }

  .background-section {
    animation-delay: 0.4s;
  }

  .values-section {
    animation-delay: 0.5s;
  }

  @keyframes fadeInReduced {
    from { opacity: 0; }
    to { opacity: 1; }
  }
}
</style>
