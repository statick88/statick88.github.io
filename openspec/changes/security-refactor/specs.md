# Security Refactor Specifications

## Overview

This document specifies the security improvements to be implemented for the Astro-based personal portfolio website. The goal is to address critical security vulnerabilities while maintaining compatibility with GitHub Pages deployment.

## Security Headers Requirements

### 1. Content-Security-Policy (CSP)
- **Directive**: `default-src 'self'`
- **Script Sources**: Allow scripts from:
  - Self (`'self'`)
  - Google Analytics (`https://www.googletagmanager.com`, `https://www.google-analytics.com`)
  - Inline scripts with specific hashes
- **Style Sources**: Allow styles from:
  - Self (`'self'`)
  - Google Fonts (`https://fonts.googleapis.com`)
  - Inline styles with specific hashes
- **Font Sources**: Allow fonts from:
  - Self (`'self'`)
  - Google Fonts (`https://fonts.gstatic.com`)
- **Image Sources**: Allow images from:
  - Self (`'self'`)
  - Data URIs (`data:`)
  - External domains used in CV data
- **Frame Sources**: Disallow frames (`'none'`)
- **Form Actions**: Allow form submissions only to self (`'self'`)
- **Report URI**: Configure a report endpoint (if available)

### 2. X-Frame-Options
- **Value**: `DENY` to prevent clickjacking

### 3. X-XSS-Protection
- **Value**: `1; mode=block` to enable XSS protection

### 4. X-Content-Type-Options
- **Value**: `nosniff` to prevent MIME type sniffing

### 5. Strict-Transport-Security (HSTS)
- **Value**: `max-age=31536000; includeSubDomains; preload` to enforce HTTPS

### 6. Referrer-Policy
- **Value**: `strict-origin-when-cross-origin` to control referrer information

### 7. Permissions-Policy
- **Value**: `accelerometer=(), ambient-light-sensor=(), autoplay=(), battery=(), camera=(), clipboard-read=(), clipboard-write=(), cross-origin-isolated=(), display-capture=(), document-domain=(), encrypted-media=(), execution-while-not-rendered=(), execution-while-out-of-viewport=(), fullscreen=(), geolocation=(), gyroscope=(), hid=(), idle-detection=(), interest-cohort=(), keyboard-map=(), magnetometer=(), microphone=(), midi=(), navigation-override=(), payment=(), picture-in-picture=(), publickey-credentials-get=(), screen-wake-lock=(), serial=(), speaker-selection=(), sync-xhr=(), usb=(), web-share=(), xr-spatial-tracking=()` to disable unnecessary permissions

## CORS Configuration Requirements

- Remove the wildcard CORS origin (`*`)
- Configure CORS to allow only specific trusted origins (if any)
- For GitHub Pages deployment, CORS may not be necessary since it's a static site

## Inline Scripts Requirements

### 1. Theme Detection Script
- Move from Layout.astro to `src/scripts/theme.js`
- Use Astro's script tag with `is:inline` only if necessary, or load externally

### 2. Language Detection Script
- Move from Layout.astro to `src/scripts/lang.js`
- Use Astro's script tag with `is:inline` only if necessary, or load externally

### 3. CV Data Injection Script
- Move from Layout.astro to `src/scripts/cv-data.js`
- Use Astro's script tag with `is:inline` only if necessary, or load externally

### 4. i18n Script
- Move from Layout.astro to `src/scripts/i18n.js`
- Use Astro's script tag with `is:inline` only if necessary, or load externally

### 5. Google Analytics Script
- Keep as async external script
- Ensure CSP allows it

## Implementation Details

### Astro Configuration Changes
- Create a custom integration in `astro.config.mjs` to add security headers
- Configure build options to minify scripts and styles
- Ensure assets are properly hashed for cache busting

### Layout Changes
- Update `src/layouts/Layout.astro` to remove inline scripts
- Add external script tags with appropriate attributes (async/defer)
- Add security headers meta tags or configure via integration

### Script File Structure
- Create `src/scripts/` directory to organize external scripts
- Minify scripts during build process
- Ensure scripts are properly typed if using TypeScript

## Verification Steps

### 1. Security Headers Check
- Use browser dev tools to verify headers are present
- Use tools like SecurityHeaders.com to scan the site
- Check for CSP violations in browser console

### 2. Inline Scripts Check
- Use browser dev tools to inspect rendered HTML
- Verify no inline scripts are present (except those with valid CSP hashes)
- Check for XSS vulnerabilities using automated tools

### 3. CORS Configuration Check
- Use browser dev tools to check CORS headers
- Verify no wildcard origin is present
- Test CORS behavior with external requests

### 4. Functionality Check
- Test theme toggle functionality
- Test language switch functionality
- Test all links and buttons
- Verify Google Analytics is working

### 5. Deployment Check
- Deploy to GitHub Pages
- Verify the site loads correctly
- Check security headers and functionality in production

## Success Criteria

- [ ] All security headers are correctly configured and returned in responses
- [ ] No inline scripts are present in the rendered HTML
- [ ] CORS configuration is secure (no wildcard origin)
- [ ] Site functionality remains intact (theme toggle, language switch, analytics)
- [ ] Deployment to GitHub Pages is successful
