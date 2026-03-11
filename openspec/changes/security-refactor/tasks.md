# Security Refactor Tasks

## Phase 1: Security Headers Implementation

### Task 1.1: Create Security Headers Integration
- **File**: `src/integrations/security-headers.ts`
- **Description**: Create a custom Astro integration to add security headers
- **Steps**:
  1. Import necessary Astro types
  2. Define the integration function
  3. Add middleware to handle request/response
  4. Implement security headers logic

### Task 1.2: Implement Security Headers Middleware
- **File**: `src/middleware/security-headers.ts`
- **Description**: Implement the middleware that adds security headers to all responses
- **Steps**:
  1. Import MiddlewareHandler type
  2. Create onRequest handler
  3. Configure Content-Security-Policy (CSP) with appropriate directives
  4. Add other security headers (X-Frame-Options, X-XSS-Protection, etc.)

### Task 1.3: Update Astro Configuration
- **File**: `astro.config.mjs`
- **Description**: Add the custom security headers integration to Astro config
- **Steps**:
  1. Import securityHeaders integration
  2. Add to integrations array
  3. Configure build and vite options for security

## Phase 2: CORS Configuration

### Task 2.1: Remove Wildcard CORS Origin
- **File**: `src/middleware/security-headers.ts`
- **Description**: Ensure no wildcard CORS origin is configured
- **Steps**:
  1. Check existing CORS configuration
  2. Remove any wildcard origin settings
  3. Configure appropriate CSP directives to restrict cross-origin requests

## Phase 3: Inline Scripts Mitigation

### Task 3.1: Create Theme Script
- **File**: `src/scripts/theme.js`
- **Description**: Move theme detection and application logic to external script
- **Steps**:
  1. Extract inline script from Layout.astro
  2. Create external JavaScript file
  3. Test functionality

### Task 3.2: Create Language Script
- **File**: `src/scripts/lang.js`
- **Description**: Move language detection and application logic to external script
- **Steps**:
  1. Extract inline script from Layout.astro
  2. Create external JavaScript file
  3. Test functionality

### Task 3.3: Create CV Data Script
- **File**: `src/scripts/cv-data.js`
- **Description**: Move CV data injection logic to external script
- **Steps**:
  1. Extract inline script from Layout.astro
  2. Create external JavaScript file
  3. Test functionality

### Task 3.4: Create i18n Script
- **File**: `src/scripts/i18n.js`
- **Description**: Move internationalization logic to external script
- **Steps**:
  1. Extract inline script from Layout.astro
  2. Create external JavaScript file
  3. Test functionality

### Task 3.5: Update Layout.astro
- **File**: `src/layouts/Layout.astro`
- **Description**: Remove inline scripts and include external files
- **Steps**:
  1. Remove all inline scripts from the <head> and <body>
  2. Add external script tags for each functionality
  3. Use type="module" for modern JavaScript
  4. Test site functionality

## Phase 4: Verification and Testing

### Task 4.1: Test Security Headers
- **Tools**: Browser dev tools, SecurityHeaders.com
- **Description**: Verify security headers are correctly configured
- **Steps**:
  1. Run `npm run dev`
  2. Check headers in browser dev tools
  3. Scan site with SecurityHeaders.com
  4. Check for CSP violations

### Task 4.2: Test Inline Scripts
- **Tools**: Browser dev tools, automated scanners
- **Description**: Verify no inline scripts are present
- **Steps**:
  1. Inspect rendered HTML
  2. Check for XSS vulnerabilities
  3. Test all site functionality

### Task 4.3: Test CORS Configuration
- **Tools**: Browser dev tools, curl
- **Description**: Verify CORS configuration is secure
- **Steps**:
  1. Check CORS headers in responses
  2. Test cross-origin requests
  3. Ensure no wildcard origin is present

### Task 4.4: Deploy to GitHub Pages
- **Tools**: GitHub CLI, browser
- **Description**: Deploy changes to production
- **Steps**:
  1. Commit changes
  2. Deploy to GitHub Pages
  3. Verify site functionality
  4. Re-scan site with SecurityHeaders.com

## Phase 5: Documentation

### Task 5.1: Update README.md
- **File**: `README.md`
- **Description**: Update documentation to include security improvements
- **Steps**:
  1. Add security configuration details
  2. Explain how to maintain security headers
  3. Document any CSP exceptions

### Task 5.2: Update ARCHITECTURE.md
- **File**: `ARCHITECTURE.md`
- **Description**: Document the security architecture
- **Steps**:
  1. Explain how security headers are implemented
  2. Document script file structure
  3. Detail CSP configuration

## Success Criteria

- [ ] All security headers are correctly configured and returned in responses
- [ ] No inline scripts are present in the rendered HTML
- [ ] CORS configuration is secure (no wildcard origin)
- [ ] Site functionality remains intact (theme toggle, language switch, analytics)
- [ ] Deployment to GitHub Pages is successful
