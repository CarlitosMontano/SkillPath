import { useState } from "react";
import { completedProjects, demoAccounts, initialCourseProgress, initialPosts, type Account, type AreaKey, type Post } from "./data";

export type Session = { name: string; surname: string; email: string; isNew: boolean };
export type Profile = { area: AreaKey; experience: string; goal: string; time: string };
export type PortfolioProject = { id: number; name: string; description: string; tech: string[]; repo: string };
export type PortfolioData = {
  headline: string;
  bio: string;
  skills: string[];
  github: string;
  projects: PortfolioProject[];
};

const defaultPortfolio: PortfolioData = {
  headline: "Desarrollador/a web en formación",
  bio: "Aprendo construyendo proyectos reales y comparto mi avance con la comunidad.",
  skills: ["HTML", "CSS", "JavaScript"],
  github: "",
  // Los mismos proyectos terminados que aparecen en «Mis proyectos».
  projects: completedProjects.map((project, index) => ({
    id: index + 1,
    name: project.name,
    description: project.description,
    tech: project.tech,
    repo: "",
  })),
};

export function portfolioCompleteness(p: PortfolioData) {
  const checks = [
    { label: "Titular profesional", done: p.headline.trim().length > 3 },
    { label: "Biografía de al menos 60 caracteres", done: p.bio.trim().length >= 60 },
    { label: "Al menos 3 habilidades", done: p.skills.length >= 3 },
    { label: "Al menos 2 proyectos", done: p.projects.length >= 2 },
    { label: "Enlace de GitHub", done: /^https:\/\/github\.com\/[\w-]+\/?$/i.test(p.github.trim()) },
    { label: "Proyectos con repositorio", done: p.projects.length > 0 && p.projects.every((x) => x.repo.trim()) },
  ];
  return { checks, percent: Math.round((checks.filter((c) => c.done).length / checks.length) * 100) };
}

/** Estado en memoria del prototipo. Se pierde al recargar la página. */
export function usePlatformState() {
  const [session, setSession] = useState<Session | null>(null);
  const [accounts, setAccounts] = useState<Account[]>(demoAccounts);
  const addAccount = (account: Account) => setAccounts((old) => [...old, account]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [courseProgress, setCourseProgress] = useState<Record<string, number>>(initialCourseProgress);
  const [portfolio, setPortfolio] = useState<PortfolioData>(defaultPortfolio);
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [savedEvents, setSavedEvents] = useState<string[]>([]);
  const toggleSavedEvent = (id: string) =>
    setSavedEvents((old) => (old.includes(id) ? old.filter((x) => x !== id) : [...old, id]));
  const logout = () => {
    setSession(null);
    setProfile(null);
  };
  return {
    session, setSession, accounts, addAccount, profile, setProfile, courseProgress, setCourseProgress,
    portfolio, setPortfolio, posts, setPosts, savedEvents, toggleSavedEvent, logout,
  };
}
export type Platform = ReturnType<typeof usePlatformState>;
