import { useState } from "react";
import { Bookmark, BookmarkCheck, CalendarDays, CalendarX, ExternalLink, MapPin, Monitor, Tag } from "lucide-react";
import { eventCategories, events, type EventCategory, type EventItem } from "./data";
import type { Platform } from "./state";
import { DemoBanner, EmptyState, PageHeading, SkeletonGrid, formatDate, useSimulatedLoad } from "./ui";

type Filter = "Todos" | "Guardados" | EventCategory;

export function Events({ platform, notify }: { platform: Platform; notify: (text: string) => void }) {
  const [filter, setFilter] = useState<Filter>("Todos");
  const { loading } = useSimulatedLoad(500);
  const { savedEvents, toggleSavedEvent } = platform;
  const list = events
    .filter((e) => filter === "Todos" || (filter === "Guardados" ? savedEvents.includes(e.id) : e.category === filter))
    .sort((a, b) => a.date.localeCompare(b.date));

  const save = (e: EventItem) => {
    toggleSavedEvent(e.id);
    notify(savedEvents.includes(e.id) ? "Evento quitado de tus guardados." : "Evento guardado en esta sesión.");
  };

  return (
    <>
      <PageHeading
        eyebrow="EVENTOS RECOMENDADOS"
        title="Conecta, aprende y muestra lo que construyes."
        subtitle="Hackatones, reuniones, charlas, talleres y ferias de empleo seleccionados para tu camino."
      />
      <DemoBanner>Las fechas son de ejemplo. «Ver evento» abre en una pestaña nueva la página real del organizador o de la plataforma donde se publican eventos similares.</DemoBanner>
      <div className="filter-chips" role="group" aria-label="Filtrar eventos">
        {(["Todos", ...eventCategories, "Guardados"] as Filter[]).map((f) => (
          <button key={f} className={filter === f ? "selected" : ""} aria-pressed={filter === f} onClick={() => setFilter(f)}>
            {f === "Guardados" ? `Guardados (${savedEvents.length})` : f}
          </button>
        ))}
      </div>
      {loading ? (
        <SkeletonGrid count={6} label="Cargando eventos" />
      ) : list.length === 0 ? (
        <EmptyState
          icon={<CalendarX size={38} />}
          title={filter === "Guardados" ? "Aún no guardaste eventos" : "No hay eventos en esta categoría"}
          text={filter === "Guardados" ? "Usa “Guardar evento” para tenerlos a mano aquí." : "Vuelve pronto o explora otra categoría."}
          action={<button className="btn secondary" onClick={() => setFilter("Todos")}>Ver todos los eventos</button>}
        />
      ) : (
        <div className="sp-grid">
          {list.map((e) => {
            const saved = savedEvents.includes(e.id);
            return (
              <article className="panel sp-card sp-event" key={e.id}>
                <div className="row between">
                  <span className="pill sp-category"><Tag size={11} aria-hidden="true" /> {e.category}</span>
                  <span className="pill sp-demo-pill">{e.source}</span>
                </div>
                <h3>{e.name}</h3>
                <p>{e.description}</p>
                <ul className="sp-facts">
                  <li><CalendarDays size={13} aria-hidden="true" /> {formatDate(e.date)}</li>
                  <li><Monitor size={13} aria-hidden="true" /> {e.modality}</li>
                  <li><MapPin size={13} aria-hidden="true" /> {e.location}</li>
                </ul>
                <div className="row sp-actions">
                  <a className="btn secondary" href={e.url} target="_blank" rel="noopener noreferrer" aria-label={`Ver evento: ${e.name} (abre ${e.source} en una pestaña nueva)`}>
                    Ver evento <ExternalLink size={14} />
                  </a>
                  <button className={`btn secondary ${saved ? "sp-saved" : ""}`} aria-pressed={saved} onClick={() => save(e)}>
                    {saved ? <><BookmarkCheck size={14} /> Guardado</> : <><Bookmark size={14} /> Guardar evento</>}
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </>
  );
}
