# Architecture Documentation - Simplified Portfolio

## Overview

Minimalist portfolio website with static JSON data, following clean code principles.

## Architecture

```
┌─────────────────────────────────────┐
│         Presentation               │
│  Astro Components, Pages, Layouts  │
└──────────────┬──────────────────┘
               │
┌──────────────▼──────────────────┐
│         Data Layer               │
│     cv.json (Static Data)       │
└─────────────────────────────────┘
```

## Core Components

### Pages
- `index.astro`: Main portfolio page

### Sections (Components)
- `Hero.astro`: Introduction section
- `About.astro`: About me section
- `Skills.astro`: Technical skills
- `Experience.astro`: Work experience
- `Education.astro`: Education background
- `Projects.astro`: Project portfolio
- `Publications.astro`: Academic publications
- `Trainings.astro`: Training courses (from cv.json)

### Interactive Components
- `ThemeToggle.astro`: Dark/Light mode toggle
- `LanguageToggle.astro`: ES/EN language toggle
- `CvDownloadButton.astro`: PDF CV download
- `ChallengeButton.astro`: Challenge section (visible)
- `AcademyButton.astro`: Academy section (hidden)

## Data Structure

### cv.json Format
```json
{
  "basics": { ... },
  "work": [ ... ],
  "education": [ ... ],
  "skills": [ ... ],
  "projects": [ ... ],
  "trainings": [ ... ],
  "publications": [ ... ],
  "softSkills": [ ... ],
  "languages": [ ... ]
}
```

### Key Data Fields

#### Basics
- `name`: Full name
- `label`: Job title (bilingual)
- `image`: Profile image path
- `email`: Email address
- `phone`: Phone number
- `url`: Portfolio URL
- `summary`: Professional summary (bilingual)
- `location`: Location information
- `profiles`: Social media profiles

#### Work
- `name`: Company name
- `position`: Job title (bilingual)
- `url`: Company website
- `startDate`: Start date (YYYY-MM-DD)
- `endDate`: End date (optional)
- `summary`: Job summary (bilingual)
- `highlights`: Key achievements (bilingual)

#### Education
- `institution`: University/institution name
- `url`: Institution website
- `area`: Field of study (bilingual)
- `studyType`: Degree type
- `startDate`: Start date
- `endDate`: End date
- `score`: GPA/grade

#### Skills
- `name`: Skill name
- `level`: Skill level (Master, Avanzado, Intermedio, etc.)

#### Projects
- `name`: Project name
- `isActive`: Active status
- `description`: Project description (bilingual)
- `highlights`: Key features (bilingual)
- `url`: Project URL
- `github`: GitHub repository (optional)
- `image`: Project image path

#### Trainings
- `title`: Training title
- `description`: Training description (bilingual)
- `date`: Training date
- `verified`: Verification status
- `url`: Training URL (optional)

#### Publications
- `name`: Publication title (bilingual)
- `publisher`: Publisher name
- `releaseDate`: Publication date
- `url`: Publication URL

## Features

1. **Bilingual**: ES/EN toggle with localStorage persistence
2. **Theme Switching**: Dark/Light mode with system preference detection
3. **PDF Generation**: Automated PDF CV generation
4. **Static**: No database, no authentication
5. **Simple**: Pure JSON data, Astro SSR/SSG
6. **Responsive**: Mobile-first design

## Scripts

- `npm run dev`: Development server with hot reload
- `npm run build`: Build for production
- `npm run preview`: Preview production build locally
- `npm run cv:pdf`: Generate CV PDFs
- `npm run test`: Run tests
- `npm run test:ui`: Run tests with UI
- `npm run test:run`: Run tests without watch mode
- `npm run test:coverage`: Run tests with coverage report
- `npm run lint`: Lint code

## Security

### Input Validation
- Email format validation
- XSS prevention in all inputs
- HTML sanitization for user content
- Path traversal prevention in PDF downloads
- URL validation for all external links

### Content Security
- Proper CSP headers configuration
- XSS prevention in rendering
- Secure CORS policies
- No eval() or unsafe-inline scripts

### Data Protection
- No sensitive data in client-side code
- Secure URL validation
- File path sanitization

## Performance

### Optimization
- Static generation where possible
- Optimized images (WebP)
- Lazy loading for heavy content
- Minimal JavaScript bundle
- CSS-in-JS for component styles

### Metrics
- First Contentful Paint (FCP): < 1.5s
- Largest Contentful Paint (LCP): < 2.5s
- Time to Interactive (TTI): < 3.5s
- Cumulative Layout Shift (CLS): < 0.1

## Accessibility

### Features
- Semantic HTML structure
- ARIA labels where needed
- Keyboard navigation support
- Screen reader compatible
- Focus indicators
- Color contrast compliance (WCAG AA)

### Best Practices
- Alt text for images
- Proper heading hierarchy
- Skip navigation links
- Form labels
- Error messages

## Internationalization

### Supported Languages
- Spanish (es) - Default
- English (en)

### Implementation
- Language toggle with localStorage
- Bilingual content in cv.json
- Dynamic content updates
- URL localization (future)

## Development

### Getting Started

```bash
# Install dependencies
pnpm install

# Start development server
pnpm run dev

# Open browser
# Navigate to http://localhost:4321
```

### Project Structure

```
src/
├── components/
│   ├── sections/    # Portfolio sections
│   ├── icons/       # SVG icons
│   ├── ThemeToggle.astro
│   ├── LanguageToggle.astro
│   ├── CvDownloadButton.astro
│   ├── ChallengeButton.astro
│   ├── AcademyButton.astro
│   └── Section.astro
├── pages/
│   └── index.astro  # Main page
├── layouts/
│   └── Layout.astro # Main layout
├── tests/
│   ├── basic.test.js
│   └── security.test.js
└── styles/
    └── global.css
```

### Adding New Sections

1. Create component in `src/components/sections/`
2. Add section to `src/pages/index.astro`
3. Add data to `cv.json` if needed
4. Add translations to `src/layouts/Layout.astro`

### Updating Content

1. Edit `cv.json` for portfolio data
2. Run `pnpm run build` to rebuild
3. Test changes locally with `pnpm run preview`

## Deployment

### Static Hosting
The portfolio can be deployed to any static hosting:
- GitHub Pages
- Vercel
- Netlify
- Cloudflare Pages

### Build Process

```bash
# Build for production
pnpm run build

# Output in ./dist directory
# Deploy ./dist to your hosting provider
```

### GitHub Pages

```bash
# Build
pnpm run build

# Deploy dist folder to gh-pages branch
# Configure GitHub Pages to use gh-pages branch
```

## Maintenance

### Regular Tasks
- Update cv.json with new projects/experience
- Generate new PDF CVs with `npm run cv:pdf`
- Update dependencies with `pnpm update`
- Run tests before deploying

### Troubleshooting

**Build fails?**
- Check cv.json syntax is valid
- Ensure all images exist
- Check for missing components

**Tests fail?**
- Run `pnpm run test:run` for details
- Check test files for errors
- Verify cv.json structure

**Styles not loading?**
- Check CSS variables are defined
- Verify component imports
- Check for syntax errors

## Best Practices

### Code Quality
- Use descriptive variable names
- Keep functions small and focused
- Add comments for complex logic
- Follow Astro component patterns

### Performance
- Lazy load images
- Minify CSS/JS
- Use WebP images
- Optimize bundle size

### Security
- Validate all inputs
- Sanitize user content
- Use HTTPS only
- Implement CSP headers

---

*Minimalist portfolio - Clean and simple*
*Last updated: February 2026*
