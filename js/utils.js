export function resolveLiveUrl(repo) {
  if (!repo) return null;
  const homepage = String(repo.homepage || "").trim();
  if (homepage) return homepage;
  const owner = repo.owner?.login?.toLowerCase?.() || "arzuparreta";
  if (repo.has_pages) return `https://${owner}.github.io/${repo.name}/`;
  return null;
}

export function projectUrl(repo) {
  return repo?.html_url || `https://github.com/${repo?.full_name || ""}`;
}

export function escHtml(str) {
  return String(str ?? "").replace(/[&<>"']/g, (m) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[m]));
}
