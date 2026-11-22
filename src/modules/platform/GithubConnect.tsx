import { useEffect, useRef, useState, type FormEvent } from "react";
import { BookMarked, Check, GitBranch, LoaderCircle, Lock, UserRound, X } from "lucide-react";
import { exampleAccount, exampleLogin, fetchGithubAccount, type GithubAccount } from "./github";

/** Marca de GitHub (para el botón «Conectar con GitHub»). */
export function GithubMark({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
    </svg>
  );
}

/**
 * Simulación de la pantalla de autorización OAuth de GitHub.
 * No hay backend: al autorizar se leen los repositorios públicos del usuario indicado
 * (API pública de GitHub). Si no hay conexión, se usa la cuenta de ejemplo.
 */
export function GithubConnect({ onConnected, onClose }: { onConnected: (account: GithubAccount) => void; onClose: () => void }) {
  const [login, setLogin] = useState(exampleLogin);
  const [status, setStatus] = useState<"idle" | "loading">("idle");
  const [error, setError] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    ref.current?.querySelector<HTMLInputElement>("input")?.focus();
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  const authorize = async (event: FormEvent) => {
    event.preventDefault();
    if (!/^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/i.test(login.trim().replace(/^@/, ""))) {
      setError("Escribe un nombre de usuario de GitHub válido.");
      return;
    }
    setError("");
    setStatus("loading");
    try {
      onConnected(await fetchGithubAccount(login));
    } catch (reason) {
      if (reason instanceof Error && reason.message === "not-found") {
        setError(`No existe ningún usuario «${login.trim()}» en GitHub.`);
        setStatus("idle");
        return;
      }
      // Sin conexión o límite de la API: se usa la copia local de la cuenta de ejemplo.
      onConnected(exampleAccount());
    }
  };

  return (
    <div className="modal-overlay gh-overlay">
      <div className="gh-auth" role="dialog" aria-modal="true" aria-labelledby="gh-auth-title" ref={ref}>
        <button className="icon-button gh-close" aria-label="Cancelar" onClick={onClose}>
          <X size={18} />
        </button>
        <div className="gh-logos" aria-hidden="true">
          <span className="gh-logo-app"><GitBranch size={22} strokeWidth={2.2} /></span>
          <span className="gh-dots"><i /><i /><i /></span>
          <span className="gh-logo-github"><GithubMark size={26} /></span>
        </div>
        <h2 id="gh-auth-title">Autorizar SkillPath</h2>
        <p className="gh-sub">SkillPath quiere acceder a tu cuenta de GitHub</p>
        <ul className="gh-scopes">
          <li><UserRound size={16} aria-hidden="true" /><div><b>Datos públicos del perfil</b><small>Nombre, avatar y enlace a tu perfil</small></div></li>
          <li><BookMarked size={16} aria-hidden="true" /><div><b>Repositorios públicos</b><small>Nombre, descripción, lenguaje y estrellas, para tu portafolio y tu CV</small></div></li>
          <li><Lock size={16} aria-hidden="true" /><div><b>Sin acceso a repositorios privados</b><small>SkillPath no puede escribir ni borrar nada</small></div></li>
        </ul>
        <form onSubmit={authorize} noValidate>
          <label>
            Usuario de GitHub
            <input value={login} onChange={(e) => setLogin(e.target.value)} autoComplete="username" spellCheck={false} aria-invalid={!!error} aria-describedby="gh-hint" />
          </label>
          {error ? (
            <small id="gh-hint" className="sp-field-error">{error}</small>
          ) : (
            <small id="gh-hint" className="muted">Simulación: sin servidor no hay OAuth real. Usamos tus repositorios públicos; deja «{exampleLogin}» para usar la cuenta de ejemplo.</small>
          )}
          <div className="gh-actions">
            <button type="button" className="btn secondary" onClick={onClose}>Cancelar</button>
            <button className="btn gh-authorize" disabled={status === "loading"}>
              {status === "loading" ? <><LoaderCircle size={16} className="sp-spin" /> Conectando…</> : <><Check size={16} /> Autorizar SkillPath</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
