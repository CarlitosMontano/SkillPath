import { useEffect, useMemo, useRef, useState, type ComponentType, type KeyboardEvent } from "react";
import { CornerDownLeft, Search } from "lucide-react";

export type PaletteItem = {
  id: string;
  group: string;
  label: string;
  hint?: string;
  icon?: ComponentType<{ size?: number; strokeWidth?: number }>;
  run: () => void;
};

/** Quita tildes y mayúsculas para que «certificacion» encuentre «Certificación». */
const normalize = (text: string) =>
  text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();

/**
 * Buscador global (Ctrl/⌘ K). Se abre muchas veces al día, así que aparece
 * sin animación: tiene que sentirse instantáneo.
 */
export function CommandPalette({ items, onClose }: { items: PaletteItem[]; onClose: () => void }) {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const results = useMemo(() => {
    const words = normalize(query).split(/\s+/).filter(Boolean);
    const matched = words.length
      ? items.filter((item) => {
          const haystack = normalize(`${item.label} ${item.hint ?? ""} ${item.group}`);
          return words.every((word) => haystack.includes(word));
        })
      : items.filter((item) => item.group === "Páginas");
    return matched.slice(0, 40);
  }, [items, query]);

  useEffect(() => setActive(0), [query]);

  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    inputRef.current?.focus();
    return () => previous?.focus();
  }, []);

  useEffect(() => {
    listRef.current?.querySelector<HTMLElement>(`[data-index="${active}"]`)?.scrollIntoView({ block: "nearest" });
  }, [active]);

  const choose = (item: PaletteItem | undefined) => {
    if (!item) return;
    onClose();
    item.run();
  };

  const onKeyDown = (event: KeyboardEvent) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActive((index) => Math.min(results.length - 1, index + 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActive((index) => Math.max(0, index - 1));
    } else if (event.key === "Enter") {
      event.preventDefault();
      choose(results[active]);
    } else if (event.key === "Escape") {
      event.preventDefault();
      onClose();
    } else if (event.key === "Tab") {
      event.preventDefault();
    }
  };

  let lastGroup = "";

  return (
    <div className="palette-overlay" onMouseDown={onClose}>
      <div
        className="palette"
        role="dialog"
        aria-modal="true"
        aria-label="Buscar en SkillPath"
        onMouseDown={(event) => event.stopPropagation()}
        onKeyDown={onKeyDown}
      >
        <div className="palette-input">
          <Search size={18} aria-hidden="true" />
          <input
            ref={inputRef}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Busca páginas, rutas, cursos, eventos o publicaciones…"
            role="combobox"
            aria-expanded="true"
            aria-controls="palette-results"
            aria-activedescendant={results[active] ? `palette-${results[active].id}` : undefined}
            aria-autocomplete="list"
          />
          <kbd>Esc</kbd>
        </div>

        <ul className="palette-results" id="palette-results" role="listbox" ref={listRef}>
          {results.map((item, index) => {
            const header = item.group !== lastGroup ? item.group : null;
            lastGroup = item.group;
            const Icon = item.icon;
            return (
              <li key={item.id} role="presentation">
                {header && <span className="palette-group">{header}</span>}
                <button
                  id={`palette-${item.id}`}
                  role="option"
                  aria-selected={index === active}
                  data-index={index}
                  className="palette-item"
                  onMouseMove={() => setActive(index)}
                  onClick={() => choose(item)}
                >
                  {Icon && (
                    <span className="palette-icon">
                      <Icon size={16} strokeWidth={1.8} />
                    </span>
                  )}
                  <span className="palette-text">
                    <b>{item.label}</b>
                    {item.hint && <small>{item.hint}</small>}
                  </span>
                  {index === active && <CornerDownLeft size={14} className="palette-enter" aria-hidden="true" />}
                </button>
              </li>
            );
          })}
          {results.length === 0 && (
            <li className="palette-empty" role="presentation">
              No encontramos «{query}». Prueba con otra palabra, como «HTML», «trading» o «hackatón».
            </li>
          )}
        </ul>

        <div className="palette-foot" aria-hidden="true">
          <span>
            <kbd>↑</kbd>
            <kbd>↓</kbd> para moverte
          </span>
          <span>
            <kbd>Enter</kbd> para abrir
          </span>
        </div>
      </div>
    </div>
  );
}
