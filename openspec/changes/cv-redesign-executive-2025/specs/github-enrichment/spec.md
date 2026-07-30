# Delta for GitHub Enrichment

## ADDED Requirements

### Requirement: Build-Time GitHub API Enrichment

FR-01: The build pipeline MUST execute a GitHub API enrichment step that fetches collaboration data for all repositories referenced in `projects[].githubRepo` and `experience[].githubRepo` (if added).

The enrichment MUST run at build time (not runtime) and produce static JSON files in `dist/data/github-enrichment.json`.

#### Scenario: Enrichment runs during build

- GIVEN `pnpm build` is executed
- WHEN build reaches enrichment step
- THEN `scripts/github-enrichment.ts` MUST run
- AND output MUST be written to `dist/data/github-enrichment.json`
- AND build MUST fail if enrichment errors (except rate limit)

### Requirement: GitHub Collaboration Metrics

The enrichment MUST fetch and compute for each repository:
- `coAuthors`: Array of unique co-author GitHub handles (from commit trailers `Co-authored-by:`)
- `prReviewsGiven`: Count of PR reviews authored by the CV owner
- `prReviewsReceived`: Count of PR reviews on owner's PRs by others
- `sharedRepos`: Array of repo names where owner and others collaborated
- `topCollaborators`: Top 5 collaborators by interaction count (commits + reviews + co-authorship)
- `languages`: Language breakdown from GitHub API
- `totalCommits`: Total commits by owner in repo
- `firstCommit`, `lastCommit`: ISO date strings

#### Scenario: Co-authors extracted from commit trailers

- GIVEN repo with commits containing `Co-authored-by: Jane <jane@example.com>`
- WHEN enrichment runs
- THEN `coAuthors` MUST include "jane" (GitHub handle mapped via email if possible)
- AND count MUST match unique co-authors

#### Scenario: PR review counts fetched

- GIVEN owner reviewed 12 PRs and received 8 reviews on their PRs
- WHEN enrichment runs
- THEN `prReviewsGiven` = 12 AND `prReviewsReceived` = 8

### Requirement: Rate Limit Handling

The enrichment script MUST:
- Use authenticated GitHub API (via `GITHUB_TOKEN` env var)
- Implement exponential backoff on 403/rate-limit responses
- Cache results in `.github-enrichment-cache.json` for 24 hours
- Fail build gracefully with warning (not error) if rate limited
- Log progress per repository

#### Scenario: Rate limit triggers cache fallback

- GIVEN API returns 403 with `x-ratelimit-remaining: 0`
- WHEN enrichment runs
- THEN script MUST read from cache if <24h old
- AND emit warning: "GitHub API rate limited; using cached data"
- AND build MUST continue (exit code 0)

### Requirement: Repository Visibility Handling

For private repositories (or repos token cannot access):
- Enrichment MUST NOT fail build
- Output MUST include `{ repo: "owner/repo", error: "private-or-unauthorized", public: false }`
- UI MUST gracefully handle missing data (show "Private repository" badge)

#### Scenario: Private repo in projects list

- GIVEN `githubRepo: "company/internal-tool"` (private)
- WHEN enrichment runs with token lacking access
- THEN output includes error object
- AND `githubStats` in project entry = `{ error: "private-repo", public: false }`

### Requirement: Architectural Contribution Visualization Data

Enrichment MUST produce data for a "Shared Architecture" visualization:
- `sharedArchitectures`: Array of `{ name, description, repos[], contributors[], technologies[] }`
- Extracted from: repo topics, README architecture sections, directory structures
- Owner's role in each: `lead`, `contributor`, `reviewer`

## MODIFIED Requirements

None.

## REMOVED Requirements

None.

## RENAMED Requirements

None.