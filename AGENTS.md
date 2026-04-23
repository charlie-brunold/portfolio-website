# AGENTS.md

This file provides guidance to Codex (Codex.ai/code) when working with code in this repository.

## Project Overview

This is a personal portfolio website built with Vue 3, TypeScript, and Vite, following an Anthropic-inspired minimalist design philosophy. The focus is on creating a clean, content-first experience that prioritizes thoughtful animations and technical sophistication over flashy elements.

## Project Status

**Current Implementation:**
- ✅ **Landing Page**: Fully implemented with sophisticated animated title system
- ✅ **About Page**: Complete with ASCII portrait animation and content
- ⏳ **Work Page**: Coming soon placeholder
- ⏳ **Contact Page**: Coming soon placeholder

**Next Priority:** Complete Work section implementation

## Technical Architecture

**Current Tech Stack:**
- **Vue 3** with Composition API and `<script setup>` syntax
- **TypeScript** for type safety
- **Vue Router** for SPA navigation
- **Vite** for build tooling and development
- **CSS Custom Properties** and container queries for responsive design
- **Vercel Analytics** for performance tracking

**Project Structure:**
```
portfolio-vue/
├── src/
│   ├── components/
│   │   ├── animations/          # Reusable animation components
│   │   │   ├── AnimatedTitle.vue      # Complex word-by-word animation system
│   │   │   ├── SkillRolodex.vue       # Rotating skills display with width calculation
│   │   │   ├── AnimatedFooter.vue     # Footer animations
│   │   │   ├── TypewriterText.vue     # Text typing effects
│   │   │   └── ScrambleIn.vue         # Character scramble animations
│   │   ├── navigation/          # Navigation components
│   │   │   └── AppNavigation.vue      # Main site navigation
│   │   ├── sections/            # Page sections
│   │   │   └── HeroSection.vue        # Landing page hero
│   │   └── AsciiPortrait.vue          # ASCII art with reveal animation
│   ├── composables/             # Vue composables
│   │   └── useResponsiveAnimation.ts  # Animation utilities and performance optimization
│   ├── views/                   # Route components
│   │   ├── HomeView.vue
│   │   ├── AboutView.vue
│   │   └── ComingSoonView.vue
│   └── router/index.ts          # Vue Router configuration
```

## Design Philosophy

**Core Principles:**
- **Sophisticated Simplicity**: Clean design with thoughtful, high-quality animations
- **Performance-First**: All animations respect `prefers-reduced-motion` and include fallbacks
- **Responsive Excellence**: Container queries and fluid typography for all screen sizes
- **Technical Craftsmanship**: TypeScript, comprehensive error handling, and optimized performance
- **Content-Driven**: Every element serves the narrative and user experience

**Visual Guidelines:**
- **Color System**: Minimal palette using CSS custom properties with dark mode support
- **Typography**: Inter font family with fluid `clamp()` sizing
- **Layout**: Flexible grid systems with generous whitespace
- **Animations**: Subtle, purposeful motion with cubic-bezier easing

## Animation System

**Key Animation Components:**

1. **AnimatedTitle** (`src/components/animations/AnimatedTitle.vue:1`)
   - Word-by-word reveal animation with responsive layouts
   - Mobile vs desktop text arrangements
   - Integrated SkillRolodex component
   - Performance optimized with `will-change` and GPU acceleration

2. **SkillRolodex** (`src/components/animations/SkillRolodex.vue:1`)
   - Dynamic width calculation for smooth transitions
   - Rotating skills display with character-precise measurements
   - Uses `useResponsiveAnimation` composable for performance

3. **AsciiPortrait** (`src/components/AsciiPortrait.vue:1`)
   - Sophisticated character-by-character reveal animation
   - Character density-based stepping sequence
   - Session storage to show animation only once per session
   - Fallback loading system for ASCII content

**Performance Features:**
- `useResponsiveAnimation` composable for visibility-based animation control
- `ResizeObserver` integration for responsive recalculation
- Debounced resize handlers and text measurement caching
- Hardware acceleration via `transform3d` and `will-change`

## Responsive Design System

**Breakpoints:**
- Mobile: < 768px (with special handling for < 480px and < 320px)
- Tablet: 768px - 1024px
- Desktop: 1024px+
- Large Desktop: 1400px+

**Responsive Strategies:**
- **Container Queries**: Used for component-level responsive behavior
- **Fluid Typography**: `clamp()` functions for scalable text
- **Layout Adaptations**: Grid systems that reflow based on screen size
- **Performance Considerations**: Animation and calculation adjustments for mobile

## Content Strategy

**Landing Page** (`src/views/HomeView.vue:1`):
- Animated introduction: "Hey, I'm Charlie, an AI for Business student using [skills] to solve complex business challenges."
- Integrated skill rotation showing technical competencies
- Clean, focused hero design

**About Page** (`src/views/AboutView.vue:1`):
- Personal narrative with animated ASCII portrait
- Two-section content: "I'm passionate about" and "I aspire to"
- Large-scale ASCII art positioned for visual impact

**Navigation Pattern** (`src/components/navigation/AppNavigation.vue:1`):
- Consistent header with brand and navigation links
- Page transitions with depth-shift animation effects

## Development Guidelines

**Code Standards:**
- **TypeScript**: Use strict typing with proper interfaces
- **Vue 3 Composition API**: Prefer `<script setup>` syntax
- **CSS**: Use CSS custom properties and logical properties
- **Performance**: Always consider animation performance and accessibility
- **Error Handling**: Implement comprehensive try/catch and fallbacks

**Animation Best Practices:**
- Always respect `prefers-reduced-motion`
- Use `transform` and `opacity` for performant animations
- Implement proper cleanup for intervals and observers
- Cache expensive calculations (text measurements, DOM queries)
- Use `will-change` judiciously and clean up after animations

**Component Patterns:**
- Composables for shared logic (`useResponsiveAnimation`)
- Props and emits with TypeScript interfaces
- Scoped styles with CSS custom properties
- Proper lifecycle management (onMounted, onUnmounted)

## Build and Deployment

**Scripts:**
- `npm run dev`: Development server with HMR
- `npm run build`: Production build with type checking
- `npm run lint`: ESLint with auto-fix
- `npm run format`: Prettier formatting

**Performance Optimizations:**
- Component lazy loading for route splitting
- Asset optimization through Vite
- Vercel Analytics integration
- Efficient font loading and CSS delivery

## Work Section Development (Next Priority)

**Planned Structure:**
```vue
<!-- WorkView.vue -->
<template>
  <div class="work">
    <div class="work-content">
      <div class="work-intro">
        <AnimatedTitle text="Selected Work" />
      </div>
      <div class="projects-grid">
        <ProjectCard
          v-for="project in projects"
          :key="project.id"
          :project="project"
        />
      </div>
    </div>
  </div>
</template>
```

**Required Components:**
- `ProjectCard.vue`: Individual project display component
- `WorkView.vue`: Main work page layout
- Project data structure and content

**Project Data Format:**
```typescript
interface Project {
  id: string
  title: string
  description: string
  role: string
  technologies: string[]
  links: {
    github?: string
    demo?: string
    case_study?: string
  }
  image?: string
  featured: boolean
}
```

## Testing and Quality Assurance

**Pre-deployment Checklist:**
- All animations respect `prefers-reduced-motion`
- Mobile responsive behavior verified across breakpoints
- TypeScript compilation without errors
- ESLint and Prettier formatting applied
- Performance testing on mobile devices
- Cross-browser compatibility testing

## Success Metrics

The portfolio should demonstrate:
- **Technical Excellence**: Clean code, proper TypeScript usage, performance optimization
- **Design Sophistication**: Thoughtful animations and responsive design
- **User Experience**: Fast loading, smooth interactions, accessibility
- **Professional Presentation**: Clear content hierarchy and narrative flow

**Avoid:**
- Heavy animations that impact performance
- Overly complex navigation or information architecture
- Generic template appearance
- Moving to other sections before current work is complete
- Breaking responsive design or accessibility standards