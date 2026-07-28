#!/usr/bin/env node
// scripts/sync-repos.mjs — congela los repos de GitHub en js/data/repos.json.
//
// Lo ejecuta .github/workflows/sync-repos.yml cada 2 días (en los runners de
// GitHub, no en tu máquina). El sitio lee ese JSON en vez de llamar a la API
// pública en cada visita, así las descripciones vienen siempre de GitHub sin
// gastar el límite anónimo de 60 peticiones/hora por IP.
//
// A mano:  node scripts/sync-repos.mjs
// Con token (opcional, sube el límite):  GITHUB_TOKEN=... node scripts/sync-repos.mjs

import { writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const USER = process.env.GITHUB_USER || "Arzuparreta";
const OUT = fileURLToPath(new URL("../js/data/repos.json", import.meta.url));

// Solo los campos que el sitio usa (utils.js, projects.js, now.js).
function trim(repo) {
  return {
    name: repo.name,
    full_name: repo.full_name,
    description: repo.description ?? null,
    html_url: repo.html_url,
    homepage: repo.homepage ?? null,
    has_pages: !!repo.has_pages,
    fork: !!repo.fork,
    archived: !!repo.archived,
    language: repo.language ?? null,
    stargazers_count: repo.stargazers_count ?? 0,
    pushed_at: repo.pushed_at ?? null,
    owner: { login: repo.owner?.login ?? USER },
  };
}

async function fetchAllRepos() {
  const headers = { Accept: "application/vnd.github+json", "User-Agent": `${USER}-site-sync` };
  if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;

  const all = [];
  for (let page = 1; page <= 10; page++) {
    const url = `https://api.github.com/users/${USER}/repos?per_page=100&sort=pushed&page=${page}`;
    const res = await fetch(url, { headers });
    if (!res.ok) throw new Error(`GitHub respondió ${res.status} ${res.statusText} en ${url}`);
    const batch = await res.json();
    if (!Array.isArray(batch) || batch.length === 0) break;
    all.push(...batch);
    if (batch.length < 100) break;
  }
  return all;
}

const repos = await fetchAllRepos();
if (!repos.length) throw new Error("GitHub devolvió 0 repos; no sobrescribo el snapshot.");

// Ordenados por nombre: el orden real lo decide el sitio, y así el diff de cada
// sincronización solo muestra lo que de verdad ha cambiado.
const payload = {
  generated_at: new Date().toISOString(),
  user: USER,
  repos: repos.map(trim).sort((a, b) => a.name.localeCompare(b.name)),
};

await writeFile(OUT, JSON.stringify(payload, null, 2) + "\n");

const sinDesc = payload.repos.filter((r) => !r.description).map((r) => r.name);
console.log(`${payload.repos.length} repos → js/data/repos.json`);
if (sinDesc.length) console.log(`sin descripción en GitHub: ${sinDesc.join(", ")}`);
