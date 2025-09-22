# TaskFlow Design System

## 🎨 Design Philosophy

**TaskFlow** follows a **modern, clean, and functional** design philosophy that prioritizes clarity, accessibility, and user productivity. The design system emphasizes:

- **Modern Color Palette**: Clean blues and oranges with high contrast for excellent readability
- **Typography Hierarchy**: Clear information architecture through thoughtful font choices (Poppins, Lora, Fira Code)
- **Consistent Spacing**: Systematic spacing scale for visual rhythm
- **Accessible Interactions**: High contrast, clear focus states, and intuitive navigation
- **Responsive Design**: Seamless experience across all device sizes
- **Enhanced Micro-interactions**: Smooth hover effects and transitions for better UX

## 🌈 Color Palette

### Primary Colors
```css
/* Light Mode */
--primary: 24.5815 94.9791% 53.1373%;        /* Orange */
--primary-foreground: 0 0% 100%;             /* White */

/* Dark Mode */
--primary: 27.0157 95.9799% 60.9804%;        /* Lighter Orange */
--primary-foreground: 220.9091 39.2857% 10.9804%; /* Dark Blue */
```

### Background Colors
```css
/* Light Mode */
--background: 60 22.2222% 96.4706%;         /* Light Gray */
--foreground: 60 3.7037% 10.5882%;          /* Dark Gray */
--card: 0 0% 100%;                           /* Pure White */
--muted: 220.0000 14.2857% 95.8824%;        /* Light Blue Gray */

/* Dark Mode */
--background: 220.9091 39.2857% 10.9804%;   /* Dark Blue */
--foreground: 210 20.0000% 98.0392%;        /* Light Gray */
--card: 215.0000 27.9070% 16.8627%;         /* Darker Blue */
--muted: 216.9231 19.1176% 26.6667%;        /* Dark Blue Gray */
```

### Semantic Colors
```css
/* Status Colors */
--destructive: 0 84.2365% 60.1961%;         /* Red */
--destructive-foreground: 0 0% 100%;        /* White */

/* Interactive States */
--accent: 220.0000 14.2857% 95.8824%;       /* Light Blue Gray */
--accent-foreground: 220.9091 39.2857% 10.9804%; /* Dark Blue */

/* Borders & Inputs */
--border: 220 13.0435% 90.9804%;            /* Light Blue Gray */
--input: 0 0% 100%;                         /* White */
--ring: 24.5815 94.9791% 53.1373%;          /* Primary Orange */
```

### Task Status Colors
```css
/* Task Status Colors - Based on Reference Image */
/* Red for Overdue tasks */
--task-overdue-bg: 0 84% 60%;
--task-overdue-text: 0 100% 90%;
--task-overdue-accent: 0 84% 60%;
--task-overdue-icon: 0 100% 85%;

/* Orange for Today tasks */
--task-today-bg: 25 95% 53%;
--task-today-text: 25 100% 90%;
--task-today-accent: 25 95% 53%;
--task-today-icon: 25 100% 85%;

/* Yellow for In Progress tasks */
--task-progress-bg: 45 93% 47%;
--task-progress-text: 45 100% 90%;
--task-progress-accent: 45 93% 47%;
--task-progress-icon: 45 100% 85%;

/* Blue for Completed tasks */
--task-completed-bg: 217 91% 60%;
--task-completed-text: 217 100% 90%;
--task-completed-accent: 217 91% 60%;
--task-completed-icon: 217 100% 85%;
```

## 🔤 Typography

### Font Families
```css
/* Primary Font - Headings */
--font-sans: Poppins;                        /* Modern sans-serif for titles */

/* Body Font - Content */
--font-serif: Lora;                          /* Readable serif for body text */

/* Monospace Font - Data */
--font-mono: Fira Code;                      /* Technical data and code */
```

### Type Scale
```css
/* Headings */
h1: 2.5rem (40px) - font-bold - Poppins
h2: 1.875rem (30px) - font-semibold - Poppins  
h3: 1.5rem (24px) - font-semibold - Poppins
h4: 1.25rem (20px) - font-medium - Poppins

/* Body Text */
body: 1rem (16px) - font-normal - Lora
small: 0.875rem (14px) - font-normal - Lora
xs: 0.75rem (12px) - font-normal - Lora

/* UI Elements */
button: 0.875rem (14px) - font-medium - Poppins
label: 0.875rem (14px) - font-semibold - Poppins
caption: 0.75rem (12px) - font-normal - Lora
```

### Font Weights
- **300**: Light (Poppins, Fira Code)
- **400**: Regular (Poppins, Lora)
- **500**: Medium (Poppins, Lora)
- **600**: Semi-bold (Poppins, Lora)
- **700**: Bold (Poppins, Lora)

## 📏 Spacing System

### Base Unit
```css
--spacing: 0.25rem; /* 4px base unit */
```

### Spacing Scale
```css
/* Tailwind Spacing Scale */
space-1: 0.25rem (4px)    /* xs */
space-2: 0.5rem (8px)     /* sm */
space-3: 0.75rem (12px)   /* md */
space-4: 1rem (16px)      /* lg */
space-6: 1.5rem (24px)    /* xl */
space-8: 2rem (32px)      /* 2xl */
space-12: 3rem (48px)     /* 3xl */
space-16: 4rem (64px)     /* 4xl */
```

### Component Spacing
```css
/* Card Padding */
--card-padding: 1rem (16px)     /* Standard cards */
--card-padding-sm: 0.75rem (12px) /* Compact cards */

/* Form Spacing */
--form-gap: 1.5rem (24px)       /* Between form sections */
--input-gap: 0.75rem (12px)     /* Between label and input */
--button-gap: 1rem (16px)       /* Between buttons */

/* Layout Spacing */
--section-gap: 2rem (32px)      /* Between major sections */
--container-padding: 1.5rem (24px) /* Container padding */
```

## 🔲 Border Radius

### Radius Scale
```css
--radius: 0.25rem;              /* 4px - Base radius */

/* Calculated Radius */
--radius-sm: calc(var(--radius) - 4px);  /* 0px - Sharp corners */
--radius-md: calc(var(--radius) - 2px);  /* 2px - Subtle rounding */
--radius-lg: var(--radius);              /* 4px - Standard rounding */
--radius-xl: calc(var(--radius) + 4px);  /* 8px - Pronounced rounding */
```

### Component Radius
```css
/* Buttons */
button: 0.375rem (6px) - rounded-md

/* Cards */
card: 0.75rem (12px) - rounded-xl

/* Inputs */
input: 0.375rem (6px) - rounded-md

/* Modals */
modal: 0.5rem (8px) - rounded-lg

/* Badges */
badge: 0.375rem (6px) - rounded-md
```

## 🌟 Shadows

### Shadow Scale
```css
--shadow-2xs: 0px 2px 8px 0px hsl(0 0% 0% / 0.03);
--shadow-xs: 0px 2px 8px 0px hsl(0 0% 0% / 0.03);
--shadow-sm: 0px 2px 8px 0px hsl(0 0% 0% / 0.05), 0px 1px 2px -1px hsl(0 0% 0% / 0.05);
--shadow: 0px 2px 8px 0px hsl(0 0% 0% / 0.05), 0px 1px 2px -1px hsl(0 0% 0% / 0.05);
--shadow-md: 0px 2px 8px 0px hsl(0 0% 0% / 0.05), 0px 2px 4px -1px hsl(0 0% 0% / 0.05);
--shadow-lg: 0px 2px 8px 0px hsl(0 0% 0% / 0.05), 0px 4px 6px -1px hsl(0 0% 0% / 0.05);
--shadow-xl: 0px 2px 8px 0px hsl(0 0% 0% / 0.05), 0px 8px 10px -1px hsl(0 0% 0% / 0.05);
--shadow-2xl: 0px 2px 8px 0px hsl(0 0% 0% / 0.13);
```

### Component Shadows
```css
/* Cards */
card: shadow-sm

/* Buttons */
button: shadow-xs (outline variant)

/* Modals */
modal: shadow-lg

/* Dropdowns */
dropdown: shadow-md

/* Hover States */
hover: shadow-md
```

## 🎯 Component Design Patterns

### Buttons

#### Variants
```css
/* Default - Primary Action */
.default {
  background: var(--primary);
  color: var(--primary-foreground);
  border: none;
}

/* Destructive - Delete Actions */
.destructive {
  background: var(--destructive);
  color: var(--destructive-foreground);
  border: none;
}

/* Outline - Secondary Actions */
.outline {
  background: transparent;
  color: var(--foreground);
  border: 1px solid var(--border);
}

/* Ghost - Subtle Actions */
.ghost {
  background: transparent;
  color: var(--foreground);
  border: none;
}

/* Link - Text Actions */
.link {
  background: transparent;
  color: var(--primary);
  border: none;
  text-decoration: underline;
}
```

#### Sizes
```css
/* Small */
.sm {
  height: 2rem (32px);
  padding: 0.5rem 0.75rem;
  font-size: 0.875rem;
}

/* Default */
.default {
  height: 2.25rem (36px);
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
}

/* Large */
.lg {
  height: 2.5rem (40px);
  padding: 0.5rem 1.5rem;
  font-size: 0.875rem;
}

/* Icon */
.icon {
  width: 2.25rem (36px);
  height: 2.25rem (36px);
  padding: 0;
}
```

### Cards

#### Base Card
```css
.card {
  background: var(--card);
  color: var(--card-foreground);
  border: 1px solid var(--border);
  border-radius: 0.75rem (12px);
  padding: 1.5rem (24px);
  box-shadow: var(--shadow-sm);
}
```

#### Card Variants
```css
/* Standard Card */
.standard {
  padding: 1.5rem (24px);
  gap: 1.5rem (24px);
}

/* Compact Card */
.compact {
  padding: 1rem (16px);
  gap: 1rem (16px);
}

/* Interactive Card */
.interactive {
  cursor: pointer;
  transition: all 0.2s ease;
}

.interactive:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-1px);
}
```

### Form Elements

#### Input Fields
```css
.input {
  height: 2.25rem (36px);
  padding: 0.5rem 0.75rem;
  border: 1px solid var(--input);
  border-radius: 0.375rem (6px);
  background: var(--background);
  color: var(--foreground);
  font-size: 0.875rem;
  transition: all 0.2s ease;
}

.input:focus {
  border-color: var(--primary);
  box-shadow: 0 0 0 2px var(--primary) / 0.2;
  outline: none;
}

.input:invalid {
  border-color: var(--destructive);
  box-shadow: 0 0 0 2px var(--destructive) / 0.2;
}
```

#### Labels
```css
.label {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--foreground);
  margin-bottom: 0.5rem;
}
```

### Badges

#### Badge Variants
```css
/* Default - Primary */
.default {
  background: var(--primary);
  color: var(--primary-foreground);
  border: none;
}

/* Secondary */
.secondary {
  background: var(--secondary);
  color: var(--secondary-foreground);
  border: none;
}

/* Destructive */
.destructive {
  background: var(--destructive);
  color: var(--destructive-foreground);
  border: none;
}

/* Outline */
.outline {
  background: transparent;
  color: var(--foreground);
  border: 1px solid var(--border);
}
```

## 📱 Responsive Design

### Breakpoints
```css
/* Mobile First Approach */
sm: 640px   /* Small devices */
md: 768px   /* Medium devices */
lg: 1024px  /* Large devices */
xl: 1280px  /* Extra large devices */
2xl: 1536px /* 2X large devices */
```

### Grid System
```css
/* Dashboard Grid */
.dashboard-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
}

@media (min-width: 768px) {
  .dashboard-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .dashboard-grid {
    grid-template-columns: repeat(12, 1fr);
  }
}
```

### Task Views
```css
/* List View */
.task-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

/* Grid View */
.task-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}

@media (min-width: 768px) {
  .task-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .task-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

/* Compact View */
.task-compact {
  display: flex;
  flex-direction: column;
  border: 1px solid var(--border);
  border-radius: 0.5rem;
  overflow: hidden;
}
```

## 🎨 Visual Hierarchy

### Information Architecture
```css
/* Primary Actions */
.primary-action {
  background: var(--primary);
  color: var(--primary-foreground);
  font-weight: 600;
}

/* Secondary Actions */
.secondary-action {
  background: transparent;
  color: var(--foreground);
  border: 1px solid var(--border);
}

/* Destructive Actions */
.destructive-action {
  background: var(--destructive);
  color: var(--destructive-foreground);
}

/* Subtle Actions */
.subtle-action {
  background: transparent;
  color: var(--muted-foreground);
  opacity: 0.7;
}

.subtle-action:hover {
  opacity: 1;
  color: var(--foreground);
}
```

### Content Hierarchy
```css
/* Page Title */
.page-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--foreground);
  margin-bottom: 0.5rem;
}

/* Section Title */
.section-title {
  font-size: 1.875rem;
  font-weight: 600;
  color: var(--foreground);
  margin-bottom: 1rem;
}

/* Card Title */
.card-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--foreground);
  margin-bottom: 0.5rem;
}

/* Body Text */
.body-text {
  font-size: 1rem;
  font-weight: 400;
  color: var(--foreground);
  line-height: 1.6;
}

/* Muted Text */
.muted-text {
  font-size: 0.875rem;
  font-weight: 400;
  color: var(--muted-foreground);
}
```

## 🎭 Interactive States

### Enhanced Hover Effects
```css
/* Button Hover with Smooth Transitions */
button {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

button:hover {
  transform: translateY(-1px);
  box-shadow: hsl(var(--shadow-md));
}

button:active {
  transform: translateY(0);
  box-shadow: hsl(var(--shadow-sm));
}

/* Card Hover with Enhanced Lift */
.card, [data-slot="card"] {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.card:hover, [data-slot="card"]:hover {
  transform: translateY(-2px);
  box-shadow: hsl(var(--shadow-lg));
}

/* Navigation Button Hover */
nav button:hover {
  background-color: hsl(var(--muted)) !important;
  color: hsl(var(--muted-foreground)) !important;
  transform: translateY(-1px);
  box-shadow: hsl(var(--shadow-sm));
}

/* Input Focus States */
input:focus, textarea:focus, select:focus {
  box-shadow: 0 0 0 2px hsl(var(--ring) / 0.2);
  border-color: hsl(var(--ring));
}
```

### Focus States
```css
/* Focus Ring */
.focus-ring {
  outline: 2px solid var(--ring);
  outline-offset: 2px;
}

/* Focus Visible */
.focus-visible {
  outline: 2px solid var(--ring);
  outline-offset: 2px;
  box-shadow: 0 0 0 2px var(--ring) / 0.2;
}
```

### Active States
```css
/* Button Active */
.button:active {
  transform: translateY(0);
  box-shadow: var(--shadow-sm);
}

/* Card Active */
.card:active {
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}
```

## 🎨 Task-Specific Design Patterns

### Task Item Design
```css
/* Task Card */
.task-card {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 0.5rem;
  padding: 1rem;
  transition: all 0.2s ease;
}

/* Task Card Hover */
.task-card:hover {
  box-shadow: var(--shadow-md);
  border-color: var(--primary) / 0.3;
}

/* Completed Task */
.task-completed {
  opacity: 0.7;
  text-decoration: line-through;
}

/* Overdue Task */
.task-overdue {
  border-left: 4px solid var(--destructive);
}

/* Due Today Task */
.task-due-today {
  border-left: 4px solid var(--primary);
}
```

### Priority Indicators
```css
/* Priority Dot */
.priority-dot {
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 50%;
}

.priority-low {
  background: var(--priority-low);
}

.priority-medium {
  background: var(--priority-medium);
}

.priority-high {
  background: var(--priority-high);
}
```

### Status Badges
```css
/* Status Badge */
.status-badge {
  padding: 0.25rem 0.5rem;
  border-radius: 0.375rem;
  font-size: 0.75rem;
  font-weight: 500;
}

/* Completed Status */
.status-completed {
  background: hsl(var(--task-completed-bg));
  color: hsl(var(--task-completed-text));
  border: 1px solid hsl(var(--task-completed-accent) / 0.3);
}

/* In Progress Status */
.status-in-progress {
  background: hsl(var(--task-progress-bg));
  color: hsl(var(--task-progress-text));
  border: 1px solid hsl(var(--task-progress-accent) / 0.3);
}

/* Today Status */
.status-today {
  background: hsl(var(--task-today-bg));
  color: hsl(var(--task-today-text));
  border: 1px solid hsl(var(--task-today-accent) / 0.3);
}

/* Overdue Status */
.status-overdue {
  background: hsl(var(--task-overdue-bg));
  color: hsl(var(--task-overdue-text));
  border: 1px solid hsl(var(--task-overdue-accent) / 0.3);
}
```

## 🌙 Dark Mode Design

### Dark Mode Principles
- **Warm Dark Backgrounds**: Use brown-based dark colors instead of pure black
- **High Contrast Text**: Ensure excellent readability
- **Consistent Color Relationships**: Maintain the same color relationships as light mode
- **Reduced Eye Strain**: Use warmer tones to reduce blue light exposure

### Dark Mode Color Adjustments
```css
/* Dark Mode Adjustments */
.dark {
  /* Slightly lighter primary for better contrast */
  --primary: 30 33.6842% 62.7451%;
  
  /* Warmer background tones */
  --background: 25.0000 15.3846% 15.2941%;
  --card: 25.7143 13.7255% 20%;
  
  /* Adjusted muted colors */
  --muted: 25.7143 13.7255% 20%;
  --muted-foreground: 38.4000 17.7305% 72.3529%;
}
```

## ♿ Accessibility Design

### Color Contrast
- **AA Compliance**: All text meets WCAG 2.1 AA contrast requirements
- **Focus Indicators**: Clear, high-contrast focus states
- **Error States**: Distinct visual feedback for validation errors

### Interactive Elements
- **Minimum Touch Target**: 44px minimum for touch interfaces
- **Keyboard Navigation**: Full keyboard accessibility
- **Screen Reader Support**: Proper ARIA labels and semantic HTML

### Visual Indicators
- **Loading States**: Clear loading indicators and skeleton screens
- **Error States**: Distinct error messaging and visual feedback
- **Success States**: Positive feedback for completed actions

## 🎨 Animation & Transitions

### Transition Timing
```css
/* Standard Transitions */
.transition-standard {
  transition: all 0.2s ease;
}

.transition-fast {
  transition: all 0.1s ease;
}

.transition-slow {
  transition: all 0.3s ease;
}
```

### Micro-interactions
```css
/* Button Press */
.button:active {
  transform: scale(0.98);
}

/* Card Hover */
.card:hover {
  transform: translateY(-2px);
}

/* Fade In */
.fade-in {
  animation: fadeIn 0.2s ease-in;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
```

## 📐 Layout Patterns

### Container Patterns
```css
/* Main Container */
.main-container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

/* Section Container */
.section-container {
  margin-bottom: 2rem;
}

/* Card Container */
.card-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
```

### Grid Patterns
```css
/* Dashboard Grid */
.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 1.5rem;
}

/* Task Grid */
.task-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1rem;
}

/* Stats Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}
```

## 🎯 Recent UI Improvements

### Enhanced Task Management
- **Hold-to-Delete**: 3-second hold with countdown tooltip for safe task deletion
- **Context-Aware Editing**: Tasks open in their creation mode (quick/detailed)
- **Priority Color Indicators**: Visual priority dots throughout the interface
- **Improved Button Consistency**: Unified hover effects and interaction states

### Widget Refinements
- **Simple Tasks Widget**: Clean list of title-only tasks, sorted by recently added
- **Standardized Empty States**: Consistent grey icon style across all widgets
- **Removed Redundant Elements**: Cleaned up "Add Task" buttons from empty states
- **Consistent Widget Heights**: All widgets maintain uniform minimum heights

### Sorting and Filtering
- **Comprehensive Sorting**: 8 sorting options with intuitive dropdown interface
- **Smart Task Filtering**: Main tasks page shows only pending tasks by default
- **Completed Tasks Page**: Dedicated view for completed tasks with proper stats
- **Sort Toggle Component**: Clean dropdown with icons and clear labeling

### Visual Consistency
- **Unified Color System**: Standardized task status colors across all components
- **Improved Hover Effects**: Consistent button and card interactions
- **Better Typography**: Enhanced readability with proper font loading
- **Responsive Design**: Seamless experience across all device sizes

---

This comprehensive design system provides the foundation for creating consistent, accessible, and beautiful user interfaces throughout the TaskFlow application. The system emphasizes warmth, clarity, and functionality while maintaining excellent user experience across all devices and interaction modes.
