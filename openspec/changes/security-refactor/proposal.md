# Proposal: Security Refactor

## Intent

Address critical security vulnerabilities in the Astro-based personal portfolio website to ensure compliance with modern security best practices and protect against common attacks like XSS, clickjacking, and data exfiltration.

## Scope

### In Scope
- Implement comprehensive security headers (Content-Security-Policy, X-Frame-Options, X-XSS-Protection, X-Content-Type-Options, Strict-Transport-Security, Referrer-Policy, Permissions-Policy)
- Fix insecure CORS configuration by removing wildcard origin (*)
- Replace inline scripts with external files to eliminate XSS vulnerabilities
- Ensure compatibility with GitHub Pages deployment constraints

### Out of Scope
- Implementing HTTPS (already handled by GitHub Pages)
- Adding a web application firewall (WAF)
- Implementing two-factor authentication (2FA)
- Adding advanced DDoS protection

## Approach

### 1. Security Headers Implementation
- Create a custom Astro integration or middleware to add security headers
- Configure appropriate CSP directives to allow only necessary resources
- Set HSTS to enforce HTTPS
- Configure X-Frame-Options to prevent clickjacking
- Set other security headers to recommended values

### 2. CORS Configuration Fix
- Remove wildcard CORS origin
- Configure CORS to allow only specific trusted origins (if any)
- For static site deployment, consider if CORS is even necessary

### 3. Inline Scripts Mitigation
- Move all inline scripts from Layout.astro to external JavaScript files
- Use Astro's `is:inline` directive only when absolutely necessary (with appropriate CSP hash)
- Ensure all scripts are properly sanitized

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `astro.config.mjs` | Modified | Add security integration/middleware |
| `src/layouts/Layout.astro` | Modified | Remove inline scripts, add security headers |
| `src/scripts/` | New | Create external JavaScript files for theme, i18n, etc. |
| `public/` | Possible | Add CSP hash configuration |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| CSP breaking site functionality | Medium | Test thoroughly in dev mode, use report-only mode initially |
| External scripts affecting performance | Low | Minify and bundle scripts, use appropriate caching |
| GitHub Pages deployment issues | Low | Follow GitHub Pages guidelines, test deployment process |

## Rollback Plan

1. Revert `astro.config.mjs` to original state
2. Put inline scripts back into Layout.astro
3. Remove external script files from `src/scripts/`
4. Redeploy the site

## Dependencies

- None - all changes are self-contained within the project

## Success Criteria

- [ ] All security headers are correctly configured and returned in responses
- [ ] No inline scripts are present in the rendered HTML
- [ ] CORS configuration is secure (no wildcard origin)
- [ ] Site functionality remains intact (theme toggle, language switch, analytics)
- [ ] Deployment to GitHub Pages is successful
