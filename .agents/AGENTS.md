# Repository Guidelines

## Project Structure & Module Organization
The runtime source lives under `src/`, grouped by AWS service adapters such as `src/apigateway`, `src/dynamodb`, `src/s3`, and shared helpers in `src/common`. Library entry points are surfaced through `src/index.js`. Tests mirror this layout in `test/src`, while reusable fixtures sit in `test/mocks`. Docs and process references are in the repo root (`ARCHITECTURE.md`, `WARP.md`, `SECURITY.md`).

## Build, Test, and Development Commands
- `npm test`: Runs the Mocha suite via `nyc` with logging muted (`MIN_LOG_LEVEL=OFF`) and writes coverage to `node_modules/.nyc_output`.
- `npm run lint`: Lints `src/**` using ESLint with the shared Prettier ruleset.
- `npm run report`: Regenerates an lcov report from the latest `nyc` output for upload to coverage services.
Ensure Node.js `>=22.19.0` (as in `package.json`) before running any scripts.

## Coding Style & Naming Conventions
Code is authored in modern JavaScript (ES2020). ESLint enforces 4-space indentation, single quotes, 140-character line width, and disables trailing commas. Prefer descriptive camelCase for functions and route helpers; keep module names aligned with AWS service terminology (`apigateway`, `sqs`, etc.). Run `npm run lint` before pushing to auto-apply the Prettier-backed formatting and catch style regressions.

## Testing Guidelines
Unit tests use Mocha with Chai and Sinon; create files alongside the module under `test/src/<service>/<topic>.test.js`. Compose assertions with explicit expectations (`expect(...).to.deep.equal(...)`) and stub AWS SDK calls through `aws-sdk-mock` helpers in `test/mocks`. Maintain or improve coverage—verify locally with `npm test` and publish reports via `npm run report` when CI expects artifacts.

## Commit & Pull Request Guidelines
Follow the existing history: imperative, sentence-case titles (`Updates Node.js version to 22.19.0`), optionally referencing issues or PR numbers at the end (`(#204)`). Commits should be scoped to a single change set with clear reasoning in the body when needed. Pull requests must describe the change, list impacted services/modules, link any GitHub issues, and include test evidence (command output or screenshots). Mention documentation updates when behavior shifts, and request review from a maintainer familiar with the touched AWS integration.
