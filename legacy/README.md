# Legacy Code Archive

This folder contains the original vanilla JavaScript implementation of the portfolio website, preserved for reference and backup purposes.

## Migration Summary

**Migration Date:** September 12, 2025
**From:** Vanilla HTML/CSS/JavaScript 
**To:** Vue.js 3 + TypeScript

## Original Files

### Core Files
- **`index.html`** - Original landing page with static structure
- **`styles.css`** - All CSS including animations, responsive design, and variables  
- **`script.js`** - 354 lines of vanilla JavaScript with complex DOM manipulation
- **`404.html`** - Placeholder page for future sections

### Experimental Files
- **`wrappingthing/`** - Experimental 3D hover effects and menu animations
  - `app.js` - Menu item letter animations
  - `charlie-hover-effect.js` - 3D flip effect from "Charlie" to "Brunold"
  - `charlie-hover-effect.css` - 3D animation styles
  - `style.css` - Supporting styles

## Original Features Migrated

### ✅ Animations Successfully Migrated
1. **Word-by-word title animation** - Custom timing pattern with nonlinear delays
2. **Skill rolodex cycling** - 12 skills with dynamic width calculations  
3. **Footer character bobbing** - Sequential wave animations on hover
4. **Navigation scroll behavior** - Auto-hide/show with backdrop blur
5. **Responsive design** - Mobile, tablet, desktop breakpoints

### 🎨 Design Elements Preserved
- **Anthropic-inspired minimalism** - Clean, content-first approach
- **Typography system** - Poppins font, clamp-based scaling
- **Color palette** - Black (#000), white (#fff), gray (#666)
- **Layout system** - 800px max-width, generous spacing
- **Animation timing** - Cubic bezier curves, thoughtful delays

## Technical Comparison

### Original Implementation
- **354 lines** of complex vanilla JavaScript
- **Manual DOM manipulation** with createElement, appendChild
- **Event management** with addEventListener, removeEventListener  
- **State tracking** with global variables and flags
- **Animation timing** with setTimeout, setInterval chains

### Vue.js Implementation
- **Clean component architecture** with reactive data flow
- **Declarative templates** with automatic DOM updates
- **Composition API** with lifecycle management
- **TypeScript support** with full type safety
- **Built-in transitions** with smooth enter/leave animations

## Why This Migration Happened

The original vanilla JavaScript implementation became increasingly difficult to:
- **Extend with new features** - Complex DOM manipulation patterns
- **Maintain and debug** - Scattered state and timing dependencies  
- **Describe changes** - Abstract concepts harder to communicate
- **Scale complexity** - Manual memory management and cleanup

The Vue.js migration provides:
- **Component-based development** - Each animation is self-contained
- **Reactive data flow** - Automatic UI updates when state changes
- **Better developer experience** - Hot reload, TypeScript, DevTools
- **Future-proof architecture** - Easy to extend with new sections/features

## Backup Purpose

These files serve as:
- **Reference implementation** - Original animation logic and timing
- **Rollback option** - Can restore vanilla version if needed  
- **Learning resource** - Comparison between vanilla JS and Vue patterns
- **Animation timing guide** - Exact delays and easing functions preserved

---

*The Vue.js implementation maintains 100% visual and functional parity with this original code while providing dramatically improved maintainability and extensibility.*