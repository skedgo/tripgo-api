# Repository Guidelines

## Project Structure & Module Organization

This repository contains the TripGo developer documentation and API reference site. Markdown pages live in `docs/`, with enterprise pages under `docs/enterprise/` and guides under `docs/guides/`. OpenAPI and Swagger reference files are in `docs/specs/`; generated reference outputs are also committed under `generated/`. Static assets are in `docs/img/`, `docs/swagger/`, and `docs/redoc/`. MkDocs configuration is in `mkdocs.yml`, custom theme overrides are in `overrides/`, and Sass/CSS sources are in `sass/`.

## Build, Test, and Development Commands

- `pip install -r requirements.txt`: installs repository-pinned Python documentation dependencies.
- `pip install mkdocs pymdown-extensions`: installs the MkDocs tooling referenced by `INSTRUCTIONS.md`.
- `pip install git+https://github.com/duduct/skedgo-mkdocs-theme`: installs the custom SkedGo MkDocs theme required by `mkdocs.yml`.
- `mkdocs serve`: runs the documentation site locally for editing.
- `mkdocs build --strict`: builds the static site and fails on strict navigation, link, or configuration issues.

## Coding Style & Naming Conventions

Use concise Markdown with descriptive headings and stable anchor text. Keep YAML files indented with two spaces and avoid reformatting large generated OpenAPI files unless the change requires it. Name new docs with lowercase, hyphenated filenames such as `deep-links.md`. Keep assets grouped by purpose: images in `docs/img/`, API specs in `docs/specs/`, and theme overrides in `overrides/`.

## Testing Guidelines

There is no application test suite in this repository. Treat `mkdocs build --strict` as the primary validation step before submitting changes. For OpenAPI edits, also inspect the affected generated ReDoc or Swagger page locally through `mkdocs serve` and verify examples remain valid YAML or JSON.

## Commit & Pull Request Guidelines

Recent commits use short, imperative summaries, often with an issue or PR reference, for example `Update navigation (#264)` or `RM24024: fix agenda/run body example. (#270)`. Keep commits focused on one documentation or spec change. Pull requests should describe the user-visible documentation impact, link related issues or tickets, and include screenshots only when layout, styling, or rendered reference pages change.

## Security & Configuration Tips

Do not commit API keys, credentials, or private customer examples. Follow `SECURITY.md` for vulnerability reporting. When editing specs, prefer synthetic request and response examples unless real data has been explicitly approved for public documentation.
