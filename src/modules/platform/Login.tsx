import { useState, type FormEvent } from "react";
import { AlertCircle, Eye, EyeOff, GitBranch, LoaderCircle, LogIn, Sparkles } from "lucide-react";
import { demoAccount } from "./data";
import type { Session } from "./state";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/**
 * Acceso con una única cuenta fija. Cada inicio de sesión empieza como usuario nuevo
 * (el estado se reinicia en Root, en main.tsx).
 */
export function Login({ onLogin }: { onLogin: (session: Session) => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState("");

  const submit = (event: FormEvent) => {
    event.preventDefault();
    const next: Record<string, string> = {};
    if (!emailPattern.test(email.trim())) next.email = "Escribe un correo válido, por ejemplo nombre@correo.com.";
    if (!password) next.password = "Escribe tu contraseña.";
    setErrors(next);
    setAuthError("");
    if (Object.keys(next).length) {
      document.getElementById(`login-${Object.keys(next)[0]}`)?.focus();
      return;
    }
    setLoading(true);
    window.setTimeout(() => {
      setLoading(false);
      if (email.trim().toLowerCase() !== demoAccount.email || password !== demoAccount.password) {
        setAuthError("Correo o contraseña incorrectos. Revisa los datos e inténtalo de nuevo.");
        setPassword("");
        document.getElementById("login-password")?.focus();
        return;
      }
      onLogin({ email: demoAccount.email });
    }, 700);
  };

  return (
    <div className="sp-login">
      <section className="sp-login-brand">
        <span className="brand">
          <span className="brand-icon">
            <GitBranch size={25} strokeWidth={2.2} />
          </span>
          skillpath<span className="brand-period">.</span>
        </span>
        <div>
          <span className="eyebrow">TU ESPACIO DE CRECIMIENTO</span>
          <h1>Encuentra tu camino y construye tu futuro.</h1>
          <p>Rutas de aprendizaje, proyectos, portafolio y comunidad en un solo lugar.</p>
        </div>
        <ul className="sp-login-points">
          <li><Sparkles size={16} aria-hidden="true" /> Un guía que adapta la plataforma a tu carrera</li>
          <li><Sparkles size={16} aria-hidden="true" /> Tu portafolio en GitHub o en tu carpeta personal</li>
          <li><Sparkles size={16} aria-hidden="true" /> Cursos, certificaciones, foro y eventos</li>
        </ul>
      </section>
      <main className="sp-login-panel">
        <div className="sp-login-card panel">
          <h2>Inicia sesión</h2>
          <p className="muted">Cada vez que entras, SkillPath empieza desde cero con la guía de bienvenida.</p>
          {authError && (
            <p className="sp-auth-error" role="alert">
              <AlertCircle size={16} aria-hidden="true" /> {authError}
            </p>
          )}
          <form onSubmit={submit} noValidate>
            <label>
              Correo electrónico
              <input id="login-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" aria-invalid={!!errors.email} aria-describedby={errors.email ? "err-email" : undefined} placeholder="nombre@correo.com" />
              {errors.email && <small id="err-email" className="sp-field-error">{errors.email}</small>}
            </label>
            <label>
              Contraseña
              <span className="sp-password">
                <input id="login-password" type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" aria-invalid={!!errors.password} aria-describedby={errors.password ? "err-password" : undefined} placeholder="Tu contraseña" />
                <button type="button" className="icon-button" aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"} onClick={() => setShowPassword((v) => !v)}>
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </span>
              {errors.password && <small id="err-password" className="sp-field-error">{errors.password}</small>}
            </label>
            <button className="btn sp-login-submit" disabled={loading}>
              {loading ? <><LoaderCircle size={16} className="sp-spin" /> Ingresando…</> : <>Iniciar sesión <LogIn size={16} /></>}
            </button>
          </form>
          <p className="sp-login-note" role="note">
            Prototipo: la cuenta se comprueba solo en este navegador y no se envían datos a ningún servidor. Al cerrar sesión se borra todo lo que hiciste.
          </p>
        </div>
      </main>
    </div>
  );
}
