import { useState } from "react";
import { ArrowLeft, ArrowRight, BookOpen, Check, Clock3, Code2, LineChart, LockKeyhole, Play, SearchX, Sparkles } from "lucide-react";
import { areas, courses, type AreaKey, type Course, type CourseStatus } from "./data";
import type { Platform } from "./state";
import { DemoBanner, EmptyState, PageHeading, SkeletonGrid, useSimulatedLoad } from "./ui";

export function courseStatus(course: Course, progress: number): CourseStatus {
  if (course.comingSoon) return "Próximamente";
  return progress > 0 ? "En progreso" : "Disponible";
}

const statusClass: Record<CourseStatus, string> = {
  Disponible: "sp-status available",
  "En progreso": "sp-status progress",
  Próximamente: "sp-status soon",
};

export function AreasCourses({ platform, notify, openLearningRoute, initialCourseId }: { platform: Platform; notify: (text: string) => void; openLearningRoute: () => void; initialCourseId?: string | null }) {
  const [area, setArea] = useState<AreaKey>(platform.profile?.area ?? "fullstack");
  const [filter, setFilter] = useState<"Todos" | CourseStatus>("Todos");
  const [openId, setOpenId] = useState<string | null>(initialCourseId ?? null);
  const { loading } = useSimulatedLoad(500);
  const progressOf = (id: string) => platform.courseProgress[id] ?? 0;
  const list = courses.filter((c) => c.area === area && (filter === "Todos" || courseStatus(c, progressOf(c.id)) === filter));

  const setProgress = (id: string, value: number) =>
    platform.setCourseProgress((old) => ({ ...old, [id]: Math.min(100, value) }));

  const open = courses.find((c) => c.id === openId);
  if (open) {
    const progress = progressOf(open.id);
    const doneModules = Math.round((progress / 100) * open.modules.length);
    return (
      <>
        <button className="text-button back-link" onClick={() => setOpenId(null)}>
          <ArrowLeft size={16} /> Volver a {areas[open.area].short}
        </button>
        <section className="panel sp-course-detail">
          <span className="eyebrow">{areas[open.area].name.toUpperCase()}</span>
          <h1>{open.name}</h1>
          <p className="muted">{open.description}</p>
          <div className="route-meta">
            <span>{open.level}</span>
            <span>{open.hours} horas estimadas</span>
            <span>{open.modules.length} módulos</span>
          </div>
          <div className="sp-progress-line">
            <div className="learning-progress" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100} aria-label={`Progreso del curso ${open.name}`}>
              <i style={{ width: `${progress}%` }} />
            </div>
            <b>{progress}%</b>
          </div>
          <h2>Módulos</h2>
          <ol className="sp-module-list">
            {open.modules.map((m, i) => (
              <li key={m} className={i < doneModules ? "done" : i === doneModules ? "current" : ""}>
                <span aria-hidden="true">{i < doneModules ? <Check size={13} /> : i + 1}</span>
                {m}
                <small>{i < doneModules ? "Completado" : i === doneModules ? "Siguiente" : "Pendiente"}</small>
              </li>
            ))}
          </ol>
          <div className="row sp-actions">
            {progress < 100 ? (
              <button
                className="btn"
                onClick={() => {
                  const next = Math.round(((doneModules + 1) / open.modules.length) * 100);
                  setProgress(open.id, next);
                  notify(next >= 100 ? `¡Completaste ${open.name}!` : "Módulo marcado como completado (simulado).");
                }}
              >
                Completar siguiente módulo <Check size={15} />
              </button>
            ) : (
              <p className="success-note"><Check size={16} /> Curso completado</p>
            )}
            {open.opensLearningRoute && (
              <button className="btn secondary" onClick={openLearningRoute}>
                Abrir lecciones interactivas <ArrowRight size={15} />
              </button>
            )}
          </div>
          <p className="muted demo-note">El contenido completo de las lecciones de este curso estará disponible próximamente. El avance es simulado.</p>
        </section>
      </>
    );
  }

  return (
    <>
      <PageHeading
        eyebrow="ÁREAS Y CURSOS"
        title="Elige un área y avanza curso a curso."
        subtitle="Cada área agrupa cursos ordenados para que sepas siempre cuál es tu siguiente paso."
      />
      <div className="sp-area-switch" role="tablist" aria-label="Áreas">
        {(Object.keys(areas) as AreaKey[]).map((key) => (
          <button key={key} role="tab" aria-selected={area === key} className={`panel ${area === key ? "selected" : ""}`} onClick={() => setArea(key)}>
            <span className="stat-icon blue" aria-hidden="true">{key === "fullstack" ? <Code2 size={18} /> : <LineChart size={18} />}</span>
            <span>
              <b>{areas[key].name}</b>
              <small>{courses.filter((c) => c.area === key).length} cursos</small>
            </span>
            {platform.profile?.area === key && <span className="pill sp-recommended">Recomendada para ti</span>}
          </button>
        ))}
      </div>
      <p className="sp-area-description">{areas[area].description}</p>
      {area === "finanzas" && <DemoBanner>Contenido educativo. SkillPath no ofrece asesoramiento financiero ni de inversión.</DemoBanner>}
      <div className="filter-chips" role="group" aria-label="Filtrar por estado">
        {(["Todos", "Disponible", "En progreso", "Próximamente"] as const).map((f) => (
          <button key={f} className={filter === f ? "selected" : ""} aria-pressed={filter === f} onClick={() => setFilter(f)}>
            {f}
          </button>
        ))}
      </div>
      {loading ? (
        <SkeletonGrid count={6} label="Cargando cursos" />
      ) : list.length === 0 ? (
        <EmptyState icon={<SearchX size={38} />} title="No hay cursos con este estado" text="Prueba con otro filtro para ver más cursos." action={<button className="btn secondary" onClick={() => setFilter("Todos")}>Ver todos los cursos</button>} />
      ) : (
        <div className="sp-grid">
          {list.map((c) => {
            const progress = progressOf(c.id);
            const status = courseStatus(c, progress);
            return (
              <article className="panel sp-card" key={c.id}>
                <div className="row between">
                  <span className="stat-icon purple" aria-hidden="true"><BookOpen size={17} /></span>
                  <span className={statusClass[status]}>
                    {status === "Próximamente" ? <LockKeyhole size={11} aria-hidden="true" /> : status === "En progreso" ? <Play size={11} aria-hidden="true" /> : <Sparkles size={11} aria-hidden="true" />}
                    {status}
                  </span>
                </div>
                <h3>{c.name}</h3>
                <p>{c.description}</p>
                <div className="sp-meta">
                  <span>{c.level}</span>
                  <span><Clock3 size={12} aria-hidden="true" /> {c.hours} h</span>
                </div>
                <div className="sp-progress-line">
                  <div className="learning-progress" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100} aria-label={`Progreso de ${c.name}`}>
                    <i style={{ width: `${progress}%` }} />
                  </div>
                  <small>{progress}%</small>
                </div>
                {status === "Próximamente" ? (
                  <button className="btn secondary" disabled>Próximamente</button>
                ) : status === "En progreso" ? (
                  <button className="btn" onClick={() => setOpenId(c.id)}>Continuar curso <ArrowRight size={15} /></button>
                ) : (
                  <button
                    className="btn secondary"
                    onClick={() => {
                      setProgress(c.id, 1);
                      setOpenId(c.id);
                      notify(`Te inscribiste en ${c.name} (simulado).`);
                    }}
                  >
                    Empezar curso <ArrowRight size={15} />
                  </button>
                )}
              </article>
            );
          })}
        </div>
      )}
    </>
  );
}
