# arzuparreta.github.io

Personal site for **Rubén Peña Rubio** ([@Arzuparreta](https://github.com/Arzuparreta)): static [Astro](https://astro.build/) build, typography-led layout, case-study style project notes.

Live: **https://arzuparreta.github.io**

## Develop

Requires **Node.js ≥ 22.12**.

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview   # optional local check of dist/
```

## Deploy (GitHub Pages)

This repo uses **GitHub Actions** to build and publish the `dist/` output.

1. In the repository: **Settings → Pages → Build and deployment**
2. Set **Source** to **GitHub Actions** (not “Deploy from a branch”).
3. Push to `main`; the workflow in [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) runs `npm ci` and `npm run build`, then deploys the artifact.

First-time setup may prompt you to approve the `github-pages` environment.

## Content

- Project copy and structure: [`src/data/projects.ts`](src/data/projects.ts), [`src/data/site.ts`](src/data/site.ts)
- Downloadable CV Markdown: [`public/resume/CV.md`](public/resume/CV.md)
