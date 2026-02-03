# Clean Architecture - Simplified Portfolio

## Overview

Clean code principles applied to a minimalist portfolio website.

## Clean Code Principles

### Naming Conventions
- Descriptive variable names
- Clear component names
- Consistent terminology
- Meaningful function names

#### Examples
```javascript
// Good
const isValidEmail = validateEmail(email);
const filteredTrainings = trainings.filter(t => t.verified);

// Bad
const x = check(e);
const arr = t.filter(c => c.v);
```

### Functions
- Small, single-purpose functions
- Limited parameters (< 5)
- Pure functions where possible
- Clear return types

#### Examples
```javascript
// Good
function formatDate(date) {
  return new Date(date).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long'
  });
}

function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Bad
function process(data, opt1, opt2, opt3, opt4, opt5) {
  // Too many parameters, unclear purpose
}
```

### Comments
- Comments explain "why", not "what"
- No obvious comments
- Updated with code changes

#### Examples
```javascript
// Good
// We use exponential backoff to avoid overwhelming the service
const retryDelay = Math.min(1000 * Math.pow(2, attempts), 30000);

// Bad
// This is a variable
const x = 5;
```

### Documentation
- JSDoc comments for components
- Clear file structure
- Self-documenting code

## Project Structure

```
src/
├── components/
│   ├── sections/     # Feature sections
│   │   ├── Hero.astro
│   │   ├── About.astro
│   │   ├── Skills.astro
│   │   ├── Experience.astro
│   │   ├── Education.astro
│   │   ├── Projects.astro
│   │   ├── Publications.astro
│   │   └── Trainings.astro
│   ├── icons/       # SVG icons
│   ├── ThemeToggle.astro
│   ├── LanguageToggle.astro
│   ├── CvDownloadButton.astro
│   ├── ChallengeButton.astro
│   ├── AcademyButton.astro
│   └── Section.astro
├── pages/
│   └── index.astro   # Main page
├── layouts/
│   └── Layout.astro  # Main layout
└── tests/
    ├── basic.test.js
    └── security.test.js
```

### Structure Principles

#### Separation of Concerns
- Each component has one responsibility
- Sections handle display logic
- Layout handles global structure

#### Single Source of Truth
- `cv.json` contains all data
- No duplicate data in components
- Centralized state management

#### Component Organization
- Related files grouped together
- Clear hierarchy
- Easy to navigate

## Code Quality

### Maintainability
- Small components (< 200 lines)
- Clear separation of concerns
- No code duplication
- Consistent patterns

#### Example: Component Pattern
```astro
---
// Data fetch/import
import cvData from '@/cv.json'

// Computation
const trainings = cvData.trainings.filter(t => t.verified)
---

<!-- Template -->
<section>
  {trainings.map(training => (
    <article>{training.title}</article>
  ))}
</section>

<style>
  /* Scoped styles */
  article {
    /* styles */
  }
</style>
```

### Testability
- Unit tests for logic
- Integration tests for components
- Security tests for inputs

#### Test Structure
```javascript
describe('Component Tests', () => {
  describe('Logic', () => {
    it('should filter data correctly', () => {
      const data = [1, 2, 3, 4];
      const filtered = data.filter(x => x > 2);
      expect(filtered).toEqual([3, 4]);
    });
  });

  describe('Security', () => {
    it('should sanitize input', () => {
      const input = '<script>alert(1)</script>';
      const sanitized = sanitize(input);
      expect(sanitized).not.toContain('<script>');
    });
  });
});
```

### Performance
- Static generation where possible
- Optimized images
- Lazy loading
- Minimal JavaScript

#### Optimization Techniques
```astro
---
// Lazy load components
const LazyComponent = lazy(() => import('./HeavyComponent.astro'))
---

<!-- Lazy load images -->
<img 
  src="/image.webp" 
  loading="lazy" 
  alt="Description"
/>
```

## Design Patterns

### Composition
- Small, reusable components
- Composition over inheritance
- Clear parent-child relationships

#### Example
```astro
<!-- Parent component -->
<Section title="Skills">
  <SkillList skills={cvData.skills} />
</Section>

<!-- Reusable Section component -->
<Section title={title}>
  <slot />
</Section>
```

### Data Transformation
- Pure transformation functions
- No side effects
- Clear input/output

#### Example
```javascript
function translate(value, lang) {
  if (typeof value === 'object' && (value.es || value.en)) {
    return value[lang] || value.es;
  }
  return value;
}

function formatDate(date) {
  return new Date(date).toLocaleDateString('es-ES');
}
```

### State Management
- Local state for simple cases
- Global state via localStorage
- No complex state libraries

#### Example
```javascript
// Theme state
const theme = localStorage.getItem('theme') || 'light';

// Language state
const lang = localStorage.getItem('lang') || 'es';
```

## Best Practices

### Static Data Usage

**Use cv.json as single source of truth**

```javascript
// Good
import cvData from '@/cv.json'
const { basics, skills } = cvData

// Bad
const basics = { name: 'Test', email: 'test@example.com' }
const skills = [{ name: 'JavaScript', level: 'Advanced' }]
```

### Component Design

**Keep components pure where possible**

```astro
---
// Good - pure component
const props = Astro.props
---

<div>{props.content}</div>

// Bad - side effects
---
let content = props.content
content = content.toUpperCase()
---

<div>{content}</div>
```

### Error Handling

**Graceful degradation**

```javascript
// Good
try {
  const data = await fetchData();
  return data || [];
} catch (error) {
  console.error('Failed to load data:', error);
  return [];
}

// Bad
const data = await fetchData(); // May throw
return data;
```

### Validation

**Validate all external inputs**

```javascript
// Good
function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new Error('Invalid email format');
  }
  return email.toLowerCase().trim();
}

// Bad
function processEmail(email) {
  return email; // No validation
}
```

### Security

**Never trust user input**

```javascript
// Good - sanitize HTML
function sanitizeHTML(html) {
  const div = document.createElement('div');
  div.textContent = html;
  return div.innerHTML;
}

// Bad - allow HTML
function renderHTML(html) {
  return html; // XSS vulnerable
}
```

### Performance

**Optimize for production**

```astro
---
// Good - lazy load heavy data
const heavyData = await fetchHeavyData().catch(() => [])
---

<!-- Good - lazy load images -->
<img src="/image.webp" loading="lazy" />
```

### Accessibility

**Make it accessible to everyone**

```astro
<!-- Good - proper semantic HTML -->
<nav aria-label="Main navigation">
  <ul>
    <li><a href="#about">About</a></li>
    <li><a href="#skills">Skills</a></li>
  </ul>
</nav>

<!-- Good - proper alt text -->
<img 
  src="/profile.webp" 
  alt="Portrait of Diego Saavedra"
/>

<!-- Good - form labels -->
<label for="email">Email</label>
<input type="email" id="email" />
```

## Refactoring Guidelines

### When to Refactor
- Code is duplicated
- Functions are too long
- Components are too complex
- Tests are hard to write
- Performance issues

### Refactoring Steps
1. Write tests for existing behavior
2. Make small, incremental changes
3. Run tests after each change
4. Verify functionality

### Common Refactoring Patterns

#### Extract Function
```javascript
// Before
function processData(data) {
  const filtered = data.filter(x => x.active);
  const sorted = filtered.sort((a, b) => a.name.localeCompare(b.name));
  return sorted;
}

// After
function processData(data) {
  return sortData(filterActiveData(data));
}

function filterActiveData(data) {
  return data.filter(x => x.active);
}

function sortData(data) {
  return data.sort((a, b) => a.name.localeCompare(b.name));
}
```

#### Replace Magic Numbers with Constants
```javascript
// Before
if (count > 10) {
  // ...
}

// After
const MAX_ITEMS = 10;

if (count > MAX_ITEMS) {
  // ...
}
```

#### Extract Component
```astro
<!-- Before -->
<section>
  <h2>Skills</h2>
  {skills.map(skill => (
    <div>
      <strong>{skill.name}</strong>
      <span>{skill.level}</span>
    </div>
  ))}
</section>

<!-- After -->
<section>
  <h2>Skills</h2>
  <SkillList skills={skills} />
</section>
```

## Code Review Checklist

### Functionality
- [ ] Code works as expected
- [ ] Edge cases handled
- [ ] Error handling present
- [ ] Tests pass

### Code Quality
- [ ] Clear naming
- [ ] Small functions
- [ ] No code duplication
- [ ] Consistent style

### Security
- [ ] Input validation
- [ ] XSS prevention
- [ ] Secure URLs
- [ ] No sensitive data exposed

### Performance
- [ ] Efficient algorithms
- [ ] No unnecessary re-renders
- [ ] Optimized images
- [ ] Lazy loading

### Accessibility
- [ ] Semantic HTML
- [ ] Alt text for images
- [ ] Form labels
- [ ] Keyboard navigation

## Tools and Utilities

### Development
- **Astro**: Static site generator
- **Vitest**: Testing framework
- **ESLint**: Linting
- **TypeScript**: Type checking

### Code Quality
- **Clean Code**: Principles applied
- **DRY**: Don't Repeat Yourself
- **KISS**: Keep It Simple, Stupid
- **SOLID**: Solid principles

---

*Simple by design, clean by code*
*Last updated: February 2026*
