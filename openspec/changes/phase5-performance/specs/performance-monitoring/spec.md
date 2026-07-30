# Performance Monitoring Specification

## Purpose

Define Web Vitals reporting, asset optimization, and bundle analysis tooling for the CV portfolio.

## Requirements

### Requirement: Web Vitals Reporting

The system SHALL report Core Web Vitals (LCP, CLS, INP) using the `web-vitals` npm package. Reports MUST go to both console and a configurable analytics endpoint.

#### Scenario: Dev mode logs to console

- GIVEN the app is running in development mode
- WHEN LCP, CLS, or INP is measured
- THEN the value is logged to `console.log` with metric name and value

#### Scenario: Prod mode reports to endpoint

- GIVEN the app is running in production
- WHEN LCP, CLS, or INP is measured
- THEN the value is reported to the configured analytics endpoint
- AND the value is also logged to console

#### Scenario: web-vitals library is tree-shakeable

- GIVEN the `web-vitals` package is installed
- WHEN the build completes
- THEN only the used metric functions are included in the bundle (~1KB gzipped)

### Requirement: LCP Image Optimization

The system SHALL set `fetchPriority="high"` on the hero LCP image to signal the browser to prioritize it.

#### Scenario: Hero image has high priority

- GIVEN the HeroSection renders the profile image
- WHEN the `<img>` element is painted
- THEN it has `fetchPriority="high"` attribute
- AND it has `loading="eager"` attribute

#### Scenario: Non-hero images remain default priority

- GIVEN any section other than HeroSection renders images
- WHEN images are rendered
- THEN they use default fetch priority (no `fetchPriority` attribute)

### Requirement: Font Preload + Swap

The system SHALL use `<link rel="preload">` for the Google Fonts CSS with an `onload` swap pattern to eliminate render-blocking requests.

#### Scenario: Font CSS preloaded with swap

- GIVEN the page loads
- WHEN the `<head>` is parsed
- THEN a `<link rel="preload" as="style">` exists for the Google Fonts CSS URL
- AND an `onload` handler swaps it to `rel="stylesheet"`

#### Scenario: Fallback for no-JS environments

- GIVEN JavaScript is disabled
- WHEN the preload swap cannot execute
- THEN a `<noscript>` fallback provides a standard `<link rel="stylesheet">` for the fonts

### Requirement: Modulepreload for Critical Chunks

The system SHALL include `<link rel="modulepreload">` hints in `index.html` for critical entry chunks.

#### Scenario: Critical chunks are modulepreloaded

- GIVEN the page loads
- WHEN `index.html` is parsed
- THEN `<link rel="modulepreload">` entries exist for the main entry chunk and critical dependencies

#### Scenario: Modulepreload does not include lazy chunks

- GIVEN the page loads
- WHEN `index.html` is parsed
- THEN only critical (non-lazy) chunks have `modulepreload` hints
- AND lazy section chunks are NOT modulepreloaded

### Requirement: Bundle Analysis

The system SHALL provide a `pnpm analyze` script that generates a bundle treemap visualization via `rollup-plugin-visualizer`.

#### Scenario: Analyze script produces treemap

- GIVEN the developer runs `pnpm analyze`
- WHEN the build completes
- THEN an interactive treemap HTML file is generated in the build output
- AND the treemap shows chunk sizes and module composition

#### Scenario: Visualizer only activates in analyze mode

- GIVEN `rollup-plugin-visualizer` is configured in `vite.config.js`
- WHEN `vite build` runs without `--mode analyze`
- THEN the visualizer plugin is inactive and produces no output

### Requirement: Cache Strategy for Static Assets

The system SHALL serve immutable hashed assets with long-lived `Cache-Control` headers and revalidatable HTML.

#### Scenario: Hashed assets are immutable

- GIVEN a built JS/CSS chunk with a content hash in its filename
- WHEN Cloudflare Pages serves it
- THEN the response has `Cache-Control: public, max-age=31536000, immutable`

#### Scenario: HTML is revalidatable

- GIVEN `index.html` is requested
- WHEN Cloudflare Pages serves it
- THEN the response has `Cache-Control: no-cache` or equivalent revalidation strategy
