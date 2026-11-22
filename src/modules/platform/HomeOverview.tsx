import { ArrowRight, ArrowUpRight, Award, Bot, CalendarDays, CheckCircle2, Compass, FolderGit2, MessagesSquare, Target } from "lucide-react";
import { areas, courses, events, recommendedCerts } from "./data";
import { portfolioCompleteness, type Platform } from "./state";
import { formatDate, timeAgo } from "./ui";

export type PlatformPage =
  | "Guía de bienvenida"
  | "Áreas y cursos"
  | "Portafolio"
  | "Foro"
  | "Eventos recomendados"
  | "Certificaciones afiliadas"
  | "Certificaciones recomendadas";

/** `part` permite mostrar solo el panel de tu camino o solo el de comunidad. */
export function HomeOverview({ platform, go, continueCourse, part = "all" }: { platform: Platform; go: (page: PlatformPage) => void; continueCourse: (id: string) => void; part?: "all" | "path" | "community" }) {
  const area = platform.profile?.area ?? "fullstack";
  const progressOf = (id: string) => platform.courseProgress[id] ?? 0;
  const areaCourses = courses.filter((c) => c.area === area && !c.comingSoon);
  const overall = Math.round(areaCourses.reduce((sum, c) => sum + progressOf(c.id), 0) / areaCourses.length);
  const current =
    areaCourses.filter((c) => progressOf(c.id) > 0 && progressOf(c.id) < 100).sort((a, b) => progressOf(b.id) - progressOf(a.id))[0] ??
    areaCourses.find((c) => progressOf(c.id) < 100) ??
    areaCourses[0];
  const currentProgress = progressOf(current.id);
  const nextModule = current.modules[Math.min(current.modules.length - 1, Math.round((currentProgress / 100) * current.modules.length))];
  const { percent } = portfolioCompleteness(platform.portfolio);
  const certs = recommendedCerts.filter((c) => c.area === area).slice(0, 2);
  const upcoming = [...events]
    .sort((a, b) => Number(platform.savedEvents.includes(b.id)) - Number(platform.savedEvents.includes(a.id)) || a.date.localeCompare(b.date))
    .slice(0, 2);
  const recentPosts = [...platform.posts].sort((a, b) => a.minutesAgo - b.minutesAgo).slice(0, 3);

  return (
    <section className={`sp-overview sp-overview-${part}`} aria-labelledby={`overview-title-${part}`}>
      <div className="section-heading row between">
        {part === "community" ? (
          <div>
            <span className="eyebrow">COMUNIDAD Y OPORTUNIDADES</span>
            <h2 id={`overview-title-${part}`}>Lo que pasa a tu alrededor</h2>
          </div>
        ) : (
          <div>
            <span className="eyebrow">TU PANEL PERSONAL</span>
            <h2 id={`overview-title-${part}`}>Todo lo que sigue en tu camino</h2>
          </div>
        )}
        {part !== "community" && (
          <button className="text-button" onClick={() => go("Guía de bienvenida")}>
            <Bot size={15} /> Hablar con tu guía
          </button>
        )}
      </div>
      <div className="sp-overview-grid">
        {part !== "community" && (<>
        <article className="panel sp-ov-card sp-ov-area">
          <span className="eyebrow"><Compass size={12} aria-hidden="true" /> ÁREA RECOMENDADA</span>
          <h3>{areas[area].name}</h3>
          <p>{platform.profile ? `Objetivo: ${platform.profile.goal}.` : "Responde la guía de bienvenida para personalizar tu recomendación."}</p>
          <div className="sp-progress-line">
            <div className="learning-progress" role="progressbar" aria-valuenow={overall} aria-valuemin={0} aria-valuemax={100} aria-label="Progreso general del área">
              <i style={{ width: `${overall}%` }} />
            </div>
            <b>{overall}%</b>
          </div>
          <small className="muted">Progreso general del área</small>
          <button className="text-button" onClick={() => go("Áreas y cursos")}>Ver todos los cursos <ArrowUpRight size={14} /></button>
        </article>

        <article className="panel sp-ov-card">
          <span className="eyebrow"><Target size={12} aria-hidden="true" /> CURSO ACTUAL</span>
          <h3>{current.name}</h3>
          <div className="sp-progress-line">
            <div className="learning-progress" role="progressbar" aria-valuenow={currentProgress} aria-valuemin={0} aria-valuemax={100} aria-label={`Progreso de ${current.name}`}>
              <i style={{ width: `${currentProgress}%` }} />
            </div>
            <b>{currentProgress}%</b>
          </div>
          <p className="sp-next"><CheckCircle2 size={14} aria-hidden="true" /> Próxima actividad: <b>{nextModule}</b></p>
          <button className="btn secondary" onClick={() => continueCourse(current.id)}>Ir al curso <ArrowRight size={15} /></button>
        </article>

        <article className="panel sp-ov-card">
          <span className="eyebrow"><FolderGit2 size={12} aria-hidden="true" /> TU PORTAFOLIO</span>
          <div className="sp-ov-portfolio">
            <div className="sp-ring small" style={{ ["--value" as string]: `${percent}%` }} role="img" aria-label={`Portafolio completo al ${percent}%`}>
              <b>{percent}%</b>
            </div>
            <ul>
              <li><b>{platform.portfolio.projects.length}</b> {platform.portfolio.projects.length === 1 ? "proyecto" : "proyectos"}</li>
              <li><b>{platform.portfolio.skills.length}</b> {platform.portfolio.skills.length === 1 ? "habilidad" : "habilidades"}</li>
              <li>GitHub: <b>{platform.portfolio.github ? "conectado" : "pendiente"}</b></li>
            </ul>
          </div>
          <button className="text-button" onClick={() => go("Portafolio")}>Completar mi portafolio <ArrowUpRight size={14} /></button>
        </article>
        </>)}
        {part !== "path" && (<>

        <article className="panel sp-ov-card">
          <span className="eyebrow"><Award size={12} aria-hidden="true" /> CERTIFICACIONES RECOMENDADAS</span>
          <ul className="sp-ov-list">
            {certs.map((c) => (
              <li key={c.id}><b>{c.name}</b><small>{c.provider} · {c.level}</small></li>
            ))}
          </ul>
          <button className="text-button" onClick={() => go("Certificaciones recomendadas")}>Ver recomendaciones <ArrowUpRight size={14} /></button>
        </article>

        <article className="panel sp-ov-card">
          <span className="eyebrow"><CalendarDays size={12} aria-hidden="true" /> PRÓXIMOS EVENTOS</span>
          <ul className="sp-ov-list">
            {upcoming.map((e) => (
              <li key={e.id}>
                <b>{e.name}</b>
                <small>{formatDate(e.date)} · {e.modality}{platform.savedEvents.includes(e.id) ? " · Guardado" : ""}</small>
              </li>
            ))}
          </ul>
          <button className="text-button" onClick={() => go("Eventos recomendados")}>Ver eventos <ArrowUpRight size={14} /></button>
        </article>

        <article className="panel sp-ov-card">
          <span className="eyebrow"><MessagesSquare size={12} aria-hidden="true" /> ACTIVIDAD RECIENTE DEL FORO</span>
          <ul className="sp-ov-list">
            {recentPosts.map((p) => (
              <li key={p.id}><b>{p.title}</b><small>{p.author} · {p.category} · {timeAgo(p.minutesAgo)}</small></li>
            ))}
          </ul>
          <button className="text-button" onClick={() => go("Foro")}>Ir al foro <ArrowUpRight size={14} /></button>
        </article>
        </>)}
      </div>
    </section>
  );
}
