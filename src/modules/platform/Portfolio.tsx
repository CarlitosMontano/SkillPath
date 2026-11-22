import { useState, type FormEvent, type ReactNode } from "react";
import { Check, Circle, ExternalLink, FolderGit2, GitBranch as Github, Plus, Trash2, X } from "lucide-react";
import { portfolioCompleteness, type Platform } from "./state";
import { DemoBanner, Dialog, PageHeading } from "./ui";

type Tab = "Editar" | "Vista previa" | "Mi CV";
const urlPattern = /^https?:\/\/\S+\.\S+/i;
const githubPattern = /^https:\/\/github\.com\/[\w-]+\/?$/i;

export function Portfolio({ platform, notify, fullName, cvView }: { platform: Platform; notify: (text: string) => void; fullName: string; cvView: ReactNode }) {
  const { portfolio, setPortfolio } = platform;
  const [tab, setTab] = useState<Tab>("Editar");
  const [skill, setSkill] = useState("");
  const [githubDraft, setGithubDraft] = useState(portfolio.github);
  const [githubError, setGithubError] = useState("");
  const [adding, setAdding] = useState(false);
  const [projectErrors, setProjectErrors] = useState<Record<string, string>>({});
  const { checks, percent } = portfolioCompleteness(portfolio);

  const update = (patch: Partial<typeof portfolio>) => setPortfolio((old) => ({ ...old, ...patch }));

  const addSkill = (event: FormEvent) => {
    event.preventDefault();
    const value = skill.trim();
    if (!value || portfolio.skills.some((s) => s.toLowerCase() === value.toLowerCase())) return;
    update({ skills: [...portfolio.skills, value] });
    setSkill("");
  };

  const saveGithub = (event: FormEvent) => {
    event.preventDefault();
    if (githubDraft.trim() && !githubPattern.test(githubDraft.trim())) {
      setGithubError("Usa el formato https://github.com/tu-usuario");
      return;
    }
    setGithubError("");
    update({ github: githubDraft.trim() });
    notify("Enlace de GitHub guardado en esta sesión.");
  };

  const addProject = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = String(data.get("name") ?? "").trim();
    const description = String(data.get("description") ?? "").trim();
    const repo = String(data.get("repo") ?? "").trim();
    const tech = String(data.get("tech") ?? "").split(",").map((t) => t.trim()).filter(Boolean);
    const errors: Record<string, string> = {};
    if (name.length < 3) errors.name = "El nombre debe tener al menos 3 caracteres.";
    if (description.length < 10) errors.description = "Describe el proyecto en al menos 10 caracteres.";
    if (repo && !urlPattern.test(repo)) errors.repo = "Escribe un enlace válido que empiece con https://";
    setProjectErrors(errors);
    if (Object.keys(errors).length) return;
    update({ projects: [...portfolio.projects, { id: Date.now(), name, description, repo, tech }] });
    setAdding(false);
    notify("Proyecto agregado a tu portafolio.");
  };

  return (
    <>
      <PageHeading eyebrow="TU PORTAFOLIO" title="Muestra lo que sabes hacer." subtitle="Reúne tu perfil, habilidades y proyectos en un solo lugar para compartirlo con quien quieras.">
        <button className="btn" onClick={() => setAdding(true)}>
          Agregar proyecto <Plus size={16} />
        </button>
      </PageHeading>
      <section className="panel sp-completeness" aria-label="Completitud del perfil">
        <div className="sp-ring" style={{ ["--value" as string]: `${percent}%` }} role="img" aria-label={`Perfil completo al ${percent}%`}>
          <b>{percent}%</b>
        </div>
        <div>
          <h2>{percent === 100 ? "¡Tu portafolio está completo!" : "Completa tu perfil"}</h2>
          <ul>
            {checks.map((c) => (
              <li key={c.label} className={c.done ? "done" : ""}>
                {c.done ? <Check size={14} aria-hidden="true" /> : <Circle size={14} aria-hidden="true" />}
                {c.label}
                <span className="sr-only">{c.done ? " (completado)" : " (pendiente)"}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
      <div className="tabs" role="tablist" aria-label="Secciones del portafolio">
        {(["Editar", "Vista previa", "Mi CV"] as Tab[]).map((t) => (
          <button key={t} role="tab" aria-selected={tab === t} className={tab === t ? "selected" : ""} onClick={() => setTab(t)}>
            {t}
          </button>
        ))}
      </div>
      <div className="sp-tab-body">
        {tab === "Mi CV" && cvView}
        {tab === "Editar" && (
          <div className="sp-portfolio-edit">
            <section className="panel sp-section">
              <h2>Perfil profesional</h2>
              <label>
                Titular profesional
                <input value={portfolio.headline} onChange={(e) => update({ headline: e.target.value })} placeholder="Ej. Desarrolladora frontend junior" />
              </label>
              <label>
                Biografía breve
                <textarea rows={4} maxLength={400} value={portfolio.bio} onChange={(e) => update({ bio: e.target.value })} aria-describedby="bio-count" />
                <small id="bio-count" className="muted">{portfolio.bio.length}/400 caracteres</small>
              </label>
              <h3>Habilidades</h3>
              <ul className="sp-tags" aria-label="Tus habilidades">
                {portfolio.skills.map((s) => (
                  <li key={s}>
                    {s}
                    <button aria-label={`Quitar ${s}`} onClick={() => update({ skills: portfolio.skills.filter((x) => x !== s) })}>
                      <X size={12} />
                    </button>
                  </li>
                ))}
                {portfolio.skills.length === 0 && <li className="sp-tag-empty">Aún no agregaste habilidades.</li>}
              </ul>
              <form className="sp-inline-form" onSubmit={addSkill}>
                <label className="sr-only" htmlFor="new-skill">Nueva habilidad</label>
                <input id="new-skill" value={skill} onChange={(e) => setSkill(e.target.value)} placeholder="Ej. React" />
                <button className="btn secondary" disabled={!skill.trim()}>Agregar <Plus size={14} /></button>
              </form>
            </section>
            <section className="panel sp-section">
              <h2><Github size={18} aria-hidden="true" /> GitHub</h2>
              <form onSubmit={saveGithub}>
                <label>
                  Enlace de tu perfil de GitHub
                  <input value={githubDraft} onChange={(e) => setGithubDraft(e.target.value)} placeholder="https://github.com/tu-usuario" aria-invalid={!!githubError} aria-describedby={githubError ? "gh-error" : undefined} />
                  {githubError && <small id="gh-error" className="sp-field-error">{githubError}</small>}
                </label>
                <button className="btn secondary">Guardar enlace</button>
              </form>
              <DemoBanner>Integración automática con GitHub: <b>Próximamente</b>. Por ahora agrega tus repositorios manualmente.</DemoBanner>
              <h2 className="sp-mt">Proyectos realizados</h2>
              {portfolio.projects.length === 0 ? (
                <p className="muted">Todavía no hay proyectos. Agrega el primero para mostrar tu trabajo.</p>
              ) : (
                <ul className="sp-project-list">
                  {portfolio.projects.map((p) => (
                    <li key={p.id}>
                      <FolderGit2 size={18} aria-hidden="true" />
                      <div>
                        <b>{p.name}</b>
                        <small>{p.tech.join(" · ") || "Sin tecnologías"} · {p.repo ? "Con repositorio" : "Sin repositorio"}</small>
                      </div>
                      <button className="icon-button" aria-label={`Eliminar ${p.name}`} onClick={() => update({ projects: portfolio.projects.filter((x) => x.id !== p.id) })}>
                        <Trash2 size={16} />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
              <button className="btn secondary" onClick={() => setAdding(true)}>Agregar proyecto <Plus size={14} /></button>
            </section>
          </div>
        )}
        {tab === "Vista previa" && (
          <article className="panel sp-preview" aria-label="Vista previa del portafolio">
            <header>
              <span className="avatar" aria-hidden="true">{fullName.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()}</span>
              <div>
                <h2>{fullName}</h2>
                <p>{portfolio.headline || "Agrega un titular profesional"}</p>
                {portfolio.github && (
                  <a className="text-button" href={portfolio.github} target="_blank" rel="noreferrer">
                    <Github size={14} /> {portfolio.github.replace("https://", "")}
                  </a>
                )}
              </div>
            </header>
            <p>{portfolio.bio || "Tu biografía aparecerá aquí."}</p>
            <h3>Habilidades</h3>
            <ul className="sp-tags readonly">{portfolio.skills.map((s) => <li key={s}>{s}</li>)}</ul>
            <h3>Proyectos</h3>
            <div className="sp-grid two">
              {portfolio.projects.map((p) => (
                <div className="sp-preview-project" key={p.id}>
                  <b>{p.name}</b>
                  <p>{p.description}</p>
                  <ul className="sp-tags readonly">{p.tech.map((t) => <li key={t}>{t}</li>)}</ul>
                  {p.repo ? (
                    <a className="text-button" href={p.repo} target="_blank" rel="noreferrer">Ver repositorio <ExternalLink size={13} /></a>
                  ) : (
                    <small className="muted">Repositorio no agregado</small>
                  )}
                </div>
              ))}
            </div>
            <p className="muted demo-note">Vista previa local. Publicar tu portafolio con un enlace público: Próximamente.</p>
          </article>
        )}
      </div>
      {adding && (
        <Dialog title="Agregar proyecto" eyebrow="TU PORTAFOLIO" onClose={() => { setAdding(false); setProjectErrors({}); }}>
          <form onSubmit={addProject} noValidate>
            <label>
              Nombre del proyecto
              <input name="name" placeholder="Ej. App del clima" aria-invalid={!!projectErrors.name} />
              {projectErrors.name && <small className="sp-field-error">{projectErrors.name}</small>}
            </label>
            <label>
              Descripción
              <textarea name="description" rows={3} placeholder="¿Qué problema resuelve y qué aprendiste?" aria-invalid={!!projectErrors.description} />
              {projectErrors.description && <small className="sp-field-error">{projectErrors.description}</small>}
            </label>
            <label>
              Tecnologías utilizadas (separadas por comas)
              <input name="tech" placeholder="React, TypeScript, CSS" />
            </label>
            <label>
              Enlace al repositorio (opcional)
              <input name="repo" placeholder="https://github.com/usuario/proyecto" aria-invalid={!!projectErrors.repo} />
              {projectErrors.repo && <small className="sp-field-error">{projectErrors.repo}</small>}
            </label>
            <button className="btn">Guardar proyecto <Check size={15} /></button>
          </form>
        </Dialog>
      )}
    </>
  );
}
