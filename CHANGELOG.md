# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]
### Changed
- Switched API Gateway routing to a single pattern-based resolver; `handlerPath` now auto-expands to `**/*.js` while `handlerPattern` continues to accept custom globs.
- Simplified router configuration by requiring either `handlerPath` or `handlerPattern` and removing the legacy `routingMode` option.

### Removed
- Eliminated list-mode routing support along with its related configuration (`handlerList`) and test fixtures.
- Removed the standalone directory resolver in favor of the unified pattern resolver.
