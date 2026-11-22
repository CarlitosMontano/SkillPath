/**
 * Conexión con GitHub del prototipo.
 *
 * No hay backend, así que no existe un OAuth real: la pantalla de autorización
 * es una simulación. Al autorizar se leen los repositorios PÚBLICOS del usuario
 * indicado con la API pública de GitHub (sin token). Si la API no responde
 * (sin conexión o límite de peticiones), se usa la cuenta de ejemplo «octocat».
 */
export type GithubRepo = {
  name: string;
  description: string;
  language: string | null;
  stars: number;
  url: string;
  updated: string;
};

export type GithubAccount = {
  login: string;
  name: string;
  avatarUrl: string;
  url: string;
  repos: GithubRepo[];
  /** true si los datos vienen de la API en vivo; false si son la copia de ejemplo. */
  live: boolean;
};

export const exampleLogin = "octocat";

/** Copia local de los repositorios públicos de la cuenta de ejemplo de GitHub (octocat). */
const exampleRepos: GithubRepo[] = [
  { name: "Spoon-Knife", description: "This repo is for demonstration purposes only.", language: "HTML", stars: 14234, url: "https://github.com/octocat/Spoon-Knife", updated: "2026-11-22" },
  { name: "Hello-World", description: "My first repository on GitHub!", language: null, stars: 4038, url: "https://github.com/octocat/Hello-World", updated: "2026-11-22" },
  { name: "octocat.github.io", description: "", language: "CSS", stars: 1213, url: "https://github.com/octocat/octocat.github.io", updated: "2026-11-22" },
  { name: "linguist", description: "Language Savant. If your repository's language is being reported incorrectly, send us a pull request!", language: "Ruby", stars: 783, url: "https://github.com/octocat/linguist", updated: "2026-11-22" },
  { name: "git-consortium", description: "This repo is for demonstration purposes only.", language: null, stars: 630, url: "https://github.com/octocat/git-consortium", updated: "2026-11-22" },
  { name: "test-repo1", description: "", language: null, stars: 507, url: "https://github.com/octocat/test-repo1", updated: "2026-11-20" },
];

export function exampleAccount(): GithubAccount {
  return {
    login: exampleLogin,
    name: "The Octocat",
    avatarUrl: "https://github.com/octocat.png?size=96",
    url: "https://github.com/octocat",
    repos: exampleRepos,
    live: false,
  };
}

type ApiRepo = { name: string; description: string | null; language: string | null; stargazers_count: number; html_url: string; updated_at: string; fork: boolean };
type ApiUser = { login: string; name: string | null; avatar_url: string; html_url: string };

/** Lee el perfil y los repositorios públicos. Lanza un error si el usuario no existe. */
export async function fetchGithubAccount(login: string): Promise<GithubAccount> {
  const clean = login.trim().replace(/^@/, "");
  const headers = { Accept: "application/vnd.github+json" };
  const userResponse = await fetch(`https://api.github.com/users/${encodeURIComponent(clean)}`, { headers });
  if (userResponse.status === 404) throw new Error("not-found");
  if (!userResponse.ok) throw new Error("unavailable");
  const user = (await userResponse.json()) as ApiUser;
  const reposResponse = await fetch(`https://api.github.com/users/${encodeURIComponent(clean)}/repos?sort=updated&per_page=12`, { headers });
  if (!reposResponse.ok) throw new Error("unavailable");
  const repos = ((await reposResponse.json()) as ApiRepo[])
    .filter((repo) => !repo.fork)
    .map((repo) => ({
      name: repo.name,
      description: repo.description ?? "",
      language: repo.language,
      stars: repo.stargazers_count,
      url: repo.html_url,
      updated: repo.updated_at.slice(0, 10),
    }));
  return { login: user.login, name: user.name ?? user.login, avatarUrl: user.avatar_url, url: user.html_url, repos, live: true };
}

/** Lenguajes principales (sin repetir), útiles para el CV y las habilidades. */
export function repoLanguages(account: GithubAccount | null): string[] {
  if (!account) return [];
  return [...new Set(account.repos.map((repo) => repo.language).filter((language): language is string => !!language))];
}
