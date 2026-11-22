import { useState } from "react";
import { initialCourseProgress, initialPosts, type AreaKey, type Post } from "./data";
import type { Track } from "./career";
import type { GithubAccount } from "./github";

export type Session = { email: string };

export type Profile = {
  area: AreaKey;
  experience: string;
  goal: string;
  time: string;
  /** Carrera que estudia la persona, tal como la escribió en la guía. */
  career: string;
  /** «tech» → portafolio en GitHub; «general» → carpeta personal. */
  track: Track;
};

export type PortfolioData = {
  headline: string;
  bio: string;
  skills: string[];
};

/** Elemento guardado en la carpeta personal (carreras que no son de sistemas). */
export type FolderItem = {
  id: number;
  name: string;
  kind: "document" | "image" | "pdf" | "link" | "other";
  /** Enlace externo o URL local del archivo subido (válida mientras dure la sesión). */
  url: string;
  size?: number;
  note?: string;
  addedAt: number;
};

/** Evidencia de trabajo que alimenta el portafolio, el CV y las estadísticas. */
export type EvidenceItem = { id: string; title: string; description: string; meta: string; url: string };

const emptyPortfolio: PortfolioData = { headline: "", bio: "", skills: [] };

/** Repositorios de GitHub o archivos de la carpeta, según la carrera. */
export function evidenceItems(platform: Pick<Platform, "profile" | "github" | "folder">): EvidenceItem[] {
  if (platform.profile?.track === "tech") {
    return (platform.github?.repos ?? []).map((repo) => ({
      id: `repo-${repo.name}`,
      title: repo.name,
      description: repo.description || "Repositorio sin descripción.",
      meta: [repo.language, `★ ${repo.stars.toLocaleString("es")}`].filter(Boolean).join(" · "),
      url: repo.url,
    }));
  }
  return platform.folder.map((item) => ({
    id: `file-${item.id}`,
    title: item.name,
    description: item.note || folderKindLabel[item.kind],
    meta: `${folderKindLabel[item.kind]} · ${new Date(item.addedAt).toLocaleDateString("es", { day: "numeric", month: "short", year: "numeric" })}`,
    url: item.url,
  }));
}

export const folderKindLabel: Record<FolderItem["kind"], string> = {
  document: "Documento",
  image: "Imagen",
  pdf: "PDF",
  link: "Enlace",
  other: "Archivo",
};

export function portfolioCompleteness(platform: Pick<Platform, "portfolio" | "profile" | "github" | "folder">) {
  const { portfolio, profile } = platform;
  const evidence = evidenceItems(platform).length;
  const tech = profile?.track === "tech";
  const checks = [
    { label: "Titular profesional", done: portfolio.headline.trim().length > 3 },
    { label: "Biografía de al menos 60 caracteres", done: portfolio.bio.trim().length >= 60 },
    { label: "Al menos 3 habilidades", done: portfolio.skills.length >= 3 },
    tech
      ? { label: "Cuenta de GitHub conectada", done: !!platform.github }
      : { label: "Carpeta personal con al menos un archivo", done: platform.folder.length > 0 },
    { label: tech ? "Al menos 2 repositorios" : "Al menos 2 elementos en tu carpeta", done: evidence >= 2 },
  ];
  return { checks, percent: Math.round((checks.filter((c) => c.done).length / checks.length) * 100) };
}

/**
 * Estado en memoria del prototipo. Cada inicio de sesión monta la app de nuevo,
 * así que todo empieza vacío, como un usuario nuevo.
 */
export function usePlatformState(session: Session) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [courseProgress, setCourseProgress] = useState<Record<string, number>>(initialCourseProgress);
  const [portfolio, setPortfolio] = useState<PortfolioData>(emptyPortfolio);
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [savedEvents, setSavedEvents] = useState<string[]>([]);
  const [github, setGithub] = useState<GithubAccount | null>(null);
  const [folder, setFolder] = useState<FolderItem[]>([]);
  const toggleSavedEvent = (id: string) =>
    setSavedEvents((old) => (old.includes(id) ? old.filter((x) => x !== id) : [...old, id]));
  return {
    session, profile, setProfile, courseProgress, setCourseProgress,
    portfolio, setPortfolio, posts, setPosts, savedEvents, toggleSavedEvent,
    github, setGithub, folder, setFolder,
  };
}
export type Platform = ReturnType<typeof usePlatformState>;
