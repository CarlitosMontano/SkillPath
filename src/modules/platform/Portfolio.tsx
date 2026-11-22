import { useState, type FormEvent, type ReactNode } from "react";
import { ArrowRight, Check, Circle, ExternalLink, FolderOpen, Plus, X } from "lucide-react";
import { GithubMark } from "./GithubConnect";
import { evidenceItems, portfolioCompleteness, type Platform } from "./state";
import { PageHeading } from "./ui";

type Tab = "Editar" | "Perfil" | "Mi CV";

/**
 * Portafolio: perfil profesional + evidencias. Las evidencias no se agregan aquí:
 * son los repositorios de GitHub (carreras de sistemas) o la carpeta personal (el resto),
 * que se gestionan en «Mis proyectos».
 */
export function Portfolio({ platform, fullName, cvView, openProjects }: { platform: Platform; fullName: string; cvView: ReactNode; openProjects: () => void }) {
  const { portfolio, setPortfolio, profile, github, folder } = platform;
  const [tab, setTab] = useState<Tab>("Editar");
  const [skill, setSkill] = useState("");
  const { checks, percent } = portfolioCompleteness(platform);
  const evidence = evidenceItems(platform);
  const tech = profile?.track === "tech";

  const update = (patch: Partial<typeof portfolio>) => setPortfolio((old) => ({ ...old, ...patch }));

  const addSkill = (event: FormEvent) => {
    event.preventDefault();
    const value = skill.trim();
    if (!value || portfolio.skills.some((s) => s.toLowerCase() === value.toLowerCase())) return;
    update({ skills: [...portfolio.skills, value] });
    setSkill("");
  };

  return (
    <>
      <PageHeading
        eyebrow="TU PORTAFOLIO"
        title="Muestra lo que sabes hacer."
        subtitle={tech ? "Tu perfil profesional y tus repositorios de GitHub, en un solo lugar." : "Tu perfil profesional y los trabajos de tu carpeta personal, en un solo lugar."}
      />
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
        {(["Editar", "Perfil", "Mi CV"] as Tab[]).map((t) => (
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
                <input value={portfolio.headline} onChange={(e) => update({ headline: e.target.value })} placeholder={profile ? `Ej. Estudiante de ${profile.career}` : "Ej. Estudiante de Ingeniería de Sistemas"} />
              </label>
              <label>
                Biografía breve
                <textarea rows={4} maxLength={400} value={portfolio.bio} onChange={(e) => update({ bio: e.target.value })} aria-describedby="bio-count" placeholder="Cuenta en pocas líneas qué estudias, qué te interesa y qué estás construyendo." />
                <small id="bio-count" className="muted">{portfolio.bio.length}/400 caracteres · se guarda automáticamente</small>
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
                <input id="new-skill" value={skill} onChange={(e) => setSkill(e.target.value)} placeholder={tech ? "Ej. React" : "Ej. Excel"} />
                <button className="btn secondary" disabled={!skill.trim()}>Agregar <Plus size={14} /></button>
              </form>
            </section>
            <section className="panel sp-section">
              {tech ? (
                <>
                  <h2><GithubMark size={18} /> GitHub</h2>
                  {github ? (
                    <div className="gh-account compact">
                      <img src={github.avatarUrl} alt="" width={40} height={40} />
                      <div>
                        <b>@{github.login}</b>
                        <span className="muted">{github.repos.length} repositorios enlazados a tu portafolio y tu CV</span>
                      </div>
                    </div>
                  ) : (
                    <p className="muted">Todavía no conectaste tu cuenta. Es obligatorio para tu carrera.</p>
                  )}
                </>
              ) : (
                <>
                  <h2><FolderOpen size={18} aria-hidden="true" /> Carpeta personal</h2>
                  <p className="muted">{folder.length ? `${folder.length} ${folder.length === 1 ? "elemento enlazado" : "elementos enlazados"} a tu portafolio y tu CV.` : "Tu carpeta está vacía. Sube tu primer trabajo para mostrarlo aquí."}</p>
                </>
              )}
              <h2 className="sp-mt">Proyectos / Portafolio</h2>
              {evidence.length === 0 ? (
                <p className="muted">Aún no hay proyectos para mostrar.</p>
              ) : (
                <ul className="sp-project-list">
                  {evidence.slice(0, 6).map((item) => (
                    <li key={item.id}>
                      {tech ? <GithubMark size={16} /> : <FolderOpen size={18} aria-hidden="true" />}
                      <div>
                        <b>{item.title}</b>
                        <small>{item.meta}</small>
                      </div>
                      <a className="icon-button" href={item.url} target="_blank" rel="noopener noreferrer" aria-label={`Abrir ${item.title}`}>
                        <ExternalLink size={16} />
                      </a>
                    </li>
                  ))}
                </ul>
              )}
              <button className="btn secondary" onClick={openProjects}>
                {tech ? "Gestionar en Mis proyectos" : "Abrir mi carpeta"} <ArrowRight size={14} />
              </button>
            </section>
          </div>
        )}
        {tab === "Perfil" && (
          <article className="panel sp-preview" aria-label="Perfil público del portafolio">
            <header>
              <span className="avatar" aria-hidden="true">{fullName.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()}</span>
              <div>
                <h2>{fullName}</h2>
                <p>{portfolio.headline || (profile ? `Estudiante de ${profile.career}` : "Agrega un titular profesional")}</p>
                {github && (
                  <a className="text-button" href={github.url} target="_blank" rel="noopener noreferrer">
                    <GithubMark size={14} /> github.com/{github.login}
                  </a>
                )}
              </div>
            </header>
            <p>{portfolio.bio || "Tu biografía aparecerá aquí."}</p>
            <h3>Habilidades</h3>
            <ul className="sp-tags readonly">
              {portfolio.skills.length ? portfolio.skills.map((s) => <li key={s}>{s}</li>) : <li className="sp-tag-empty">Sin habilidades todavía</li>}
            </ul>
            <h3>Proyectos / Portafolio</h3>
            {evidence.length === 0 ? (
              <p className="muted">Cuando {tech ? "conectes GitHub" : "subas archivos a tu carpeta"}, tus proyectos aparecerán aquí.</p>
            ) : (
              <div className="sp-grid two">
                {evidence.map((item) => (
                  <div className="sp-preview-project" key={item.id}>
                    <b>{item.title}</b>
                    <p>{item.description}</p>
                    <small className="muted">{item.meta}</small>
                    <a className="text-button" href={item.url} target="_blank" rel="noopener noreferrer">
                      {tech ? "Ver repositorio" : "Abrir"} <ExternalLink size={13} />
                    </a>
                  </div>
                ))}
              </div>
            )}
          </article>
        )}
      </div>
    </>
  );
}
