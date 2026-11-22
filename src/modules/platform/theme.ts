export type Theme = "light" | "dark";

const storageKey = "skillpath-theme";

/** Tema guardado en este navegador; si no hay, el del sistema operativo. */
export function initialTheme(): Theme {
  try {
    const saved = localStorage.getItem(storageKey);
    if (saved === "light" || saved === "dark") return saved;
  } catch {
    // Almacenamiento bloqueado (modo privado, etc.): se usa el del sistema.
  }
  return window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", theme === "dark" ? "#0d131b" : "#f7fafc");
  try {
    localStorage.setItem(storageKey, theme);
  } catch {
    // Sin almacenamiento el tema dura lo que dure la pestaña.
  }
}
