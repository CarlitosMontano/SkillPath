import { useEffect, useRef, useState, type ReactNode } from "react";
import { AlertTriangle, Info, RotateCcw, X } from "lucide-react";

/** Simula una carga de datos para poder mostrar el estado de carga del prototipo. */
export function useSimulatedLoad(ms = 600) {
  const [loading, setLoading] = useState(true);
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    setLoading(true);
    const timer = window.setTimeout(() => setLoading(false), ms);
    return () => window.clearTimeout(timer);
  }, [ms, attempt]);
  return { loading, reload: () => setAttempt((a) => a + 1) };
}

export function PageHeading({ eyebrow, title, subtitle, children }: { eyebrow: string; title: string; subtitle?: string; children?: ReactNode }) {
  return (
    <div className="page-heading">
      <span className="eyebrow">{eyebrow}</span>
      <div className="row between">
        <h1>{title}</h1>
        {children}
      </div>
      {subtitle && <p>{subtitle}</p>}
    </div>
  );
}

export function DemoBanner({ children }: { children: ReactNode }) {
  return (
    <p className="sp-demo-banner" role="note">
      <Info size={16} aria-hidden="true" />
      <span>{children}</span>
    </p>
  );
}

export function SkeletonGrid({ count = 3, label = "Cargando contenido" }: { count?: number; label?: string }) {
  return (
    <div className="sp-grid" role="status" aria-live="polite" aria-label={label}>
      {Array.from({ length: count }, (_, i) => (
        <div className="panel sp-skeleton" key={i} aria-hidden="true">
          <i style={{ width: "40%" }} />
          <i style={{ width: "85%", height: 16 }} />
          <i style={{ width: "100%" }} />
          <i style={{ width: "70%" }} />
        </div>
      ))}
      <span className="sr-only">{label}…</span>
    </div>
  );
}

export function EmptyState({ icon, title, text, action }: { icon: ReactNode; title: string; text: string; action?: ReactNode }) {
  return (
    <div className="empty panel sp-empty">
      {icon}
      <h2>{title}</h2>
      <p>{text}</p>
      {action}
    </div>
  );
}

export function ErrorState({ text, onRetry }: { text: string; onRetry: () => void }) {
  return (
    <div className="panel sp-error" role="alert">
      <AlertTriangle size={22} aria-hidden="true" />
      <div>
        <b>No pudimos cargar esta sección</b>
        <p>{text}</p>
      </div>
      <button className="btn secondary" onClick={onRetry}>
        <RotateCcw size={15} /> Reintentar
      </button>
    </div>
  );
}

export function Dialog({ title, eyebrow, onClose, children }: { title: string; eyebrow?: string; onClose: () => void; children: ReactNode }) {
  const ref = useRef<HTMLElement>(null);
  const closeRef = useRef(onClose);
  closeRef.current = onClose;
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    ref.current?.querySelector<HTMLElement>("input, textarea, select, button:not(.modal-close)")?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeRef.current();
      if (event.key === "Tab" && ref.current) {
        const items = ref.current.querySelectorAll<HTMLElement>("button:not(:disabled), a[href], input, textarea, select");
        const first = items[0];
        const last = items[items.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last?.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first?.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      previous?.focus();
    };
  }, []);
  return (
    <div className="modal-overlay" onClick={onClose}>
      <section ref={ref} className="modal sp-modal" role="dialog" aria-modal="true" aria-label={title} onClick={(e) => e.stopPropagation()}>
        <button className="modal-close icon-button" aria-label="Cerrar" onClick={onClose}>
          <X size={20} />
        </button>
        {eyebrow && <span className="eyebrow">{eyebrow}</span>}
        <h2>{title}</h2>
        {children}
      </section>
    </div>
  );
}

export function formatDate(iso: string) {
  return new Date(`${iso}T12:00:00`).toLocaleDateString("es", { weekday: "short", day: "numeric", month: "long", year: "numeric" });
}

export function timeAgo(minutes: number) {
  if (minutes < 1) return "ahora";
  if (minutes < 60) return `hace ${minutes} min`;
  if (minutes < 1440) return `hace ${Math.round(minutes / 60)} h`;
  const days = Math.round(minutes / 1440);
  return `hace ${days} ${days === 1 ? "día" : "días"}`;
}
