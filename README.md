# Minimalist Portfolio

A clean, minimalist portfolio website with bilingual support (ES/EN), dark/light theme, and PDF CV generation.

## Features

- 🌐 Bilingual (Spanish/English)
- 🌙 Dark/Light mode toggle
- 📄 PDF CV download (ES/EN)
- 🎯 Sections: Hero, About, Skills, Experience, Education, Projects, Publications, Trainings
- 🚀 Static site generation with Astro
- 📱 Fully responsive
- 🔒 Security-first approach
- ♿ Accessible (WCAG AA)
- ⚡ Optimized performance

## Quick Start

```bash
# Install dependencies
pnpm install

# Development server
pnpm run dev

# Build for production
pnpm run build

# Preview production build
pnpm run preview

# Generate CV PDFs
pnpm run cv:pdf

# Run tests
pnpm run test

# Lint code
pnpm run lint
```

## Project Structure

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
└── tests/
    ├── basic.test.js
    └── security.test.js
```

## Data

All portfolio data is in `cv.json`. Update this file to change content.

### cv.json Structure

```json
{
  "basics": {
    "name": "Your Name",
    "label": { "es": "...", "en": "..." },
    "email": "email@example.com",
    "phone": "+1234567890",
    "url": "https://example.com",
    "summary": { "es": "...", "en": "..." },
    "location": { "city": "...", "countryCode": "..." },
    "profiles": [...]
  },
  "work": [...],
  "education": [...],
  "skills": [...],
  "projects": [...],
  "trainings": [...],
  "publications": [...],
  "softSkills": [...],
  "languages": [...]
}
```

## Customization

### Update Portfolio Content

1. Edit `cv.json` to update portfolio data
2. Modify components in `src/components/` for UI changes
3. Update styles in component files

### Add New Sections

1. Create component in `src/components/sections/`
2. Add section to `src/pages/index.astro`
3. Add data to `cv.json` if needed
4. Add translations to `src/layouts/Layout.astro`

### Change Theme Colors

Edit CSS variables in `src/layouts/Layout.astro`:

```css
:root {
  --color-bg: #fff;
  --color-bg-hover: #f4f4f4;
  --color-text: #000;
  --color-text-secondary: #444;
  --color-border: #ddd;
  --color-accent: #4c80cc;
}

html.dark {
  --color-bg: #0a0e1a;
  --color-bg-hover: #1b243d;
  --color-text: #ffffff;
  --color-text-secondary: #b8b8b8;
  --color-border: #2a2a2a;
  --color-accent: #4c80cc;
}
```

### Add Social Media Icons

1. Create SVG icon in `src/icons/`
2. Add profile to `cv.json`:

```json
{
  "network": "Platform",
  "username": "yourusername",
  "url": "https://platform.com/yourusername"
}
```

3. Import and use icon in `src/components/sections/Hero.astro`

## Scripts

| Command | Description |
|----------|-------------|
| `pnpm run dev` | Start development server |
| `pnpm run build` | Build for production |
| `pnpm run preview` | Preview production build |
| `pnpm run cv:pdf` | Generate CV PDFs |
| `pnpm run test` | Run tests in watch mode |
| `pnpm run test:run` | Run tests once |
| `pnpm run test:ui` | Run tests with UI |
| `pnpm run test:coverage` | Run tests with coverage |
| `pnpm run lint` | Lint code |

## Deployment

### GitHub Pages

```bash
# Build
pnpm run build

# Deploy dist folder to gh-pages branch
git subtree push --prefix dist origin gh-pages
```

### Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Netlify

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy
netlify deploy --prod --dir=dist
```

### Cloudflare Pages

1. Connect GitHub repository
2. Set build command: `pnpm run build`
3. Set output directory: `dist`
4. Deploy automatically on push

## Environment Variables

No environment variables required. All data is static in `cv.json`.

## Testing

```bash
# Run all tests
pnpm run test

# Run tests once
pnpm run test:run

# Run tests with coverage
pnpm run test:coverage

# Run tests with UI
pnpm run test:ui
```

### Test Structure

- `basic.test.js`: Core functionality tests
- `security.test.js`: Security and input validation tests

## Security

- Input validation on all forms
- XSS prevention
- CSP headers
- No sensitive data exposure
- Secure URL validation
- Path traversal prevention

## Performance

- Static site generation
- Optimized images (WebP)
- Lazy loading
- Minimal JavaScript bundle
- CSS-in-JS for component styles

### Performance Metrics

- First Contentful Paint (FCP): < 1.5s
- Largest Contentful Paint (LCP): < 2.5s
- Time to Interactive (TTI): < 3.5s
- Cumulative Layout Shift (CLS): < 0.1

## Accessibility

- Semantic HTML structure
- ARIA labels
- Keyboard navigation
- Screen reader compatible
- Color contrast compliance (WCAG AA)
- Alt text for images
- Form labels

## Browser Support

- Chrome (last 2 versions)
- Firefox (last 2 versions)
- Safari (last 2 versions)
- Edge (last 2 versions)
- Mobile browsers

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests: `pnpm run test`
5. Run lint: `pnpm run lint`
6. Submit a pull request

## License

MIT License - feel free to use this for your own portfolio!

## Tech Stack

- **Astro**: Static site generator
- **TypeScript**: Type safety
- **Vitest**: Testing framework
- **ESLint**: Linting
- **Node.js**: Build tools and PDF generation

## Documentation

- [ARCHITECTURE.md](./ARCHITECTURE.md) - Architecture overview
- [CLEAN_ARCHITECTURE.md](./CLEAN_ARCHITECTURE.md) - Clean code principles

## Author

**Diego Medardo Saavedra García**
- Email: dsaavedra88@gmail.com
- Website: https://statick88.github.io
- LinkedIn: https://www.linkedin.com/in/diego-saavedra-developer/
- GitHub: https://github.com/statick88

---

*Last updated: February 2026*
