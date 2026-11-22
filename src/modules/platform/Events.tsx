import { useState } from "react";
import { Bookmark, BookmarkCheck, CalendarDays, CalendarX, ExternalLink, MapPin, Monitor, Tag } from "lucide-react";
import { eventCategories, events, type EventCategory, type EventItem } from "./data";
import type { Platform } from "./state";
import { DemoBanner, Dialog, EmptyState, PageHeading, SkeletonGrid, formatDate, useSimulatedLoad } from "./ui";

type Filter = "Todos" | "Guardados" | EventCategory;

export function Events({ platform, notify }: { platform: Platform; notify: (text: string) => void }) {
  const [filter, setFilter] = useState<Filter>("Todos");
  const [open, setOpen] = useState<EventItem | null>(null);
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
      <DemoBanner>Eventos de ejemplo con fechas y lugares simulados. La conexión con calendarios y organizadores reales estará disponible próximamente.</DemoBanner>
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
                  <span className="pill sp-demo-pill">Ejemplo</span>
                </div>
                <h3>{e.name}</h3>
                <p>{e.description}</p>
                <ul className="sp-facts">
                  <li><CalendarDays size={13} aria-hidden="true" /> {formatDate(e.date)}</li>
                  <li><Monitor size={13} aria-hidden="true" /> {e.modality}</li>
                  <li><MapPin size={13} aria-hidden="true" /> {e.location}</li>
                </ul>
                <div className="row sp-actions">
                  <button className="btn secondary" onClick={() => setOpen(e)}>Ver evento <ExternalLink size={14} /></button>
                  <button className={`btn secondary ${saved ? "sp-saved" : ""}`} aria-pressed={saved} onClick={() => save(e)}>
                    {saved ? <><BookmarkCheck size={14} /> Guardado</> : <><Bookmark size={14} /> Guardar evento</>}
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}
      {open && (
        <Dialog title={open.name} eyebrow={`${open.category.toUpperCase()} · EJEMPLO`} onClose={() => setOpen(null)}>
          <p>{open.description}</p>
          <ul className="sp-facts">
            <li><CalendarDays size={13} aria-hidden="true" /> {formatDate(open.date)}</li>
            <li><Monitor size={13} aria-hidden="true" /> {open.modality}</li>
            <li><MapPin size={13} aria-hidden="true" /> {open.location}</li>
          </ul>
          {open.hasDetails ? (
            <DemoBanner>Agenda, ponentes e inscripción del organizador: <b>Próximamente</b>. Este evento es un ejemplo.</DemoBanner>
          ) : (
            <DemoBanner>Aún no existe una fuente real para este evento. Información completa: <b>Próximamente</b>.</DemoBanner>
          )}
          <div className="row sp-actions">
            <button className="btn" onClick={() => save(open)}>
              {savedEvents.includes(open.id) ? "Quitar de guardados" : "Guardar evento"}
            </button>
            <button className="btn secondary" disabled>Inscribirme · Próximamente</button>
          </div>
        </Dialog>
      )}
    </>
  );
}
