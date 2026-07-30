# Prefetch Strategy Specification

## Purpose

Define section prefetching behavior — when and how chunks are speculatively loaded to eliminate waterfalls between sections.

## Requirements

### Requirement: Critical Section Prefetch on Mount

The system SHALL prefetch critical above-the-fold sections immediately on app mount via `initPrefetching()`.

#### Scenario: Mount prefetches summary

- GIVEN the app mounts
- WHEN `initPrefetching()` is called in `AppLayoutInner` useEffect
- THEN `summary` section chunk is prefetched immediately
- AND prefetch deduplication prevents re-fetching

#### Scenario: Mount does not prefetch heavy sections

- GIVEN the app mounts
- WHEN `initPrefetching()` runs
- THEN heavy sections (`research`, `hire`) are NOT prefetched

### Requirement: Adjacent Section Prefetch on Scroll

The system SHALL prefetch sections adjacent to the currently visible section based on scroll-spy position.

#### Scenario: Scroll to next section

- GIVEN the user scrolls to section `experience`
- WHEN scroll-spy updates `currentSectionId`
- THEN the next section (`education`) is prefetched
- AND the previous section (`summary`) is prefetched if not already loaded

#### Scenario: First section shows no previous

- GIVEN the user is at section `summary`
- WHEN scroll-spy updates `currentSectionId`
- THEN section `experience` is prefetched
- AND no "previous" prefetch occurs (already at top)

### Requirement: Heavy Section Prefetch on Scroll Proximity

The system SHALL prefetch heavy sections (`research`, `hire`) only when the user has scrolled past 70% of the page.

#### Scenario: User near bottom triggers heavy prefetch

- GIVEN the user has scrolled past 70% of total page height
- WHEN the debounced scroll handler fires
- THEN `research` and `hire` sections are prefetched

#### Scenario: User at top does not trigger heavy prefetch

- GIVEN the user is in the top half of the page
- WHEN scroll events fire
- THEN heavy sections are NOT prefetched

### Requirement: Nav Hover Prefetch

The system SHALL prefetch a section's chunk when the user hovers over its navigation item.

#### Scenario: Hover on nav item prefetches target

- GIVEN section `skills` is not yet loaded
- WHEN the user hovers over the `skills` nav item in ScrollNavBar or MobileDrawer
- THEN the `skills` chunk is prefetched immediately

#### Scenario: Already-loaded section skips prefetch

- GIVEN section `skills` is already loaded
- WHEN the user hovers over `skills` nav item
- THEN no duplicate prefetch occurs

### Requirement: Prefetch Cleanup on Unmount

The system SHALL remove scroll listeners and clear pending timeouts when `initPrefetching()` cleanup is invoked.

#### Scenario: Cleanup removes event listeners

- GIVEN `initPrefetching()` was called on mount
- WHEN the cleanup function is invoked
- THEN the scroll listener is removed
- AND any pending debounce timeout is cleared
