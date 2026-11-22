import { useState, type FormEvent } from "react";
import { AlertCircle, Eye, EyeOff, GitBranch, KeyRound, LoaderCircle, LogIn, Sparkles, UserPlus } from "lucide-react";
import type { Account } from "./data";
import type { Session } from "./state";

type Mode = "login" | "register";
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function Login({ accounts, onRegister, onLogin }: { accounts: Account[]; onRegister: (account: Account) => void; onLogin: (session: Session) => void }) {
  const [mode, setMode] = useState<Mode>("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState("");

  const submit = (event: FormEvent) => {
    event.preventDefault();
    const next: Record<string, string> = {};
    if (mode === "register" && name.trim().length < 2) next.name = "Escribe tu nombre (mínimo 2 caracteres).";
    if (!emailPattern.test(email.trim())) next.email = "Escribe un correo válido, por ejemplo nombre@correo.com.";
    if (password.length < 6) next.password = "La contraseña debe tener al menos 6 caracteres.";
    setErrors(next);
    setAuthError("");
    if (Object.keys(next).length) {
      document.getElementById(`login-${Object.keys(next)[0]}`)?.focus();
      return;
    }
    const cleanEmail = email.trim().toLowerCase();
    const existing = accounts.find((a) => a.email.toLowerCase() === cleanEmail);
    setLoading(true);
    window.setTimeout(() => {
      setLoading(false);
      if (mode === "register") {
        if (existing) {
          setAuthError("Ya existe una cuenta con este correo. Inicia sesión o usa otro correo.");
          return;
        }
        const [first, ...rest] = name.trim().split(/\s+/);
        // Se guarda como cuenta existente: la próxima vez entrará directo a Inicio.
        onRegister({ name: first, surname: rest.join(" "), email: cleanEmail, password, isNew: false });
        onLogin({ name: first, surname: rest.join(" "), email: cleanEmail, isNew: true });
        return;
      }
      if (!existing || existing.password !== password) {
        setAuthError("Correo o contraseña incorrectos. Revisa los datos o usa una cuenta de prueba.");
        setPassword("");
        document.getElementById("login-password")?.focus();
        return;
      }
      onLogin({ name: existing.name, surname: existing.surname, email: existing.email, isNew: existing.isNew });
    }, 900);
  };

  const fillAccount = (account: Account) => {
    setMode("login");
    setEmail(account.email);
    setPassword(account.password);
    setErrors({});
    setAuthError("");
  };

  const switchMode = (next: Mode) => {
    setMode(next);
    setErrors({});
    setAuthError("");
  };

  return (
    <div className="sp-login">
      <section className="sp-login-brand" aria-hidden="false">
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
          <li><Sparkles size={16} aria-hidden="true" /> Un guía que te ayuda a elegir tu área</li>
          <li><Sparkles size={16} aria-hidden="true" /> Cursos de Full Stack con IA y de Finanzas y Trading</li>
          <li><Sparkles size={16} aria-hidden="true" /> Portafolio, certificaciones, foro y eventos</li>
        </ul>
      </section>
      <main className="sp-login-panel">
        <div className="sp-login-card panel">
          <div className="sp-login-tabs" role="tablist" aria-label="Acceso">
            <button role="tab" aria-selected={mode === "login"} className={mode === "login" ? "selected" : ""} onClick={() => switchMode("login")}>
              Iniciar sesión
            </button>
            <button role="tab" aria-selected={mode === "register"} className={mode === "register" ? "selected" : ""} onClick={() => switchMode("register")}>
              Crear cuenta
            </button>
          </div>
          <h2>{mode === "login" ? "Qué bueno verte de nuevo" : "Empieza tu camino"}</h2>
          <p className="muted">
            {mode === "login" ? "Ingresa para continuar donde lo dejaste." : "Crea tu cuenta y te ayudaremos a elegir tu primera ruta."}
          </p>
          {authError && (
            <p className="sp-auth-error" role="alert">
              <AlertCircle size={16} aria-hidden="true" /> {authError}
            </p>
          )}
          <form onSubmit={submit} noValidate>
            {mode === "register" && (
              <label>
                Nombre completo
                <input id="login-name" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" aria-invalid={!!errors.name} aria-describedby={errors.name ? "err-name" : undefined} placeholder="Ej. Alex Morgan" />
                {errors.name && <small id="err-name" className="sp-field-error">{errors.name}</small>}
              </label>
            )}
            <label>
              Correo electrónico
              <input id="login-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" aria-invalid={!!errors.email} aria-describedby={errors.email ? "err-email" : undefined} placeholder="nombre@correo.com" />
              {errors.email && <small id="err-email" className="sp-field-error">{errors.email}</small>}
            </label>
            <label>
              Contraseña
              <span className="sp-password">
                <input id="login-password" type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} autoComplete={mode === "login" ? "current-password" : "new-password"} aria-invalid={!!errors.password} aria-describedby={errors.password ? "err-password" : undefined} placeholder="Mínimo 6 caracteres" />
                <button type="button" className="icon-button" aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"} onClick={() => setShowPassword((v) => !v)}>
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </span>
              {errors.password && <small id="err-password" className="sp-field-error">{errors.password}</small>}
            </label>
            {mode === "login" && (
              <button type="button" className="text-button sp-forgot" disabled title="Próximamente">
                ¿Olvidaste tu contraseña? · Próximamente
              </button>
            )}
            <button className="btn sp-login-submit" disabled={loading}>
              {loading ? (
                <><LoaderCircle size={16} className="sp-spin" /> {mode === "login" ? "Ingresando…" : "Creando tu cuenta…"}</>
              ) : mode === "login" ? (
                <>Iniciar sesión <LogIn size={16} /></>
              ) : (
                <>Crear cuenta <UserPlus size={16} /></>
              )}
            </button>
          </form>
          <div className="sp-divider"><span>o</span></div>
          <button className="btn secondary sp-login-alt" disabled>
            Continuar con Google · Próximamente
          </button>
          <section className="sp-credentials" aria-labelledby="demo-credentials">
            <h3 id="demo-credentials"><KeyRound size={15} aria-hidden="true" /> Cuentas de prueba</h3>
            {accounts.slice(0, 2).map((account) => (
              <div key={account.email} className="sp-credential">
                <div>
                  <b>{account.isNew ? "Usuario nuevo (empieza con la guía)" : "Estudiante con progreso"}</b>
                  <span>Correo: <code>{account.email}</code></span>
                  <span>Contraseña: <code>{account.password}</code></span>
                </div>
                <button type="button" className="btn secondary" disabled={loading} onClick={() => fillAccount(account)}>
                  Usar
                </button>
              </div>
            ))}
          </section>
          <p className="sp-login-note" role="note">
            Prototipo: las cuentas se comprueban solo en este navegador y las que crees se borran al recargar la página. No se envían datos a ningún servidor. Autenticación real y segura: <b>Próximamente</b>.
          </p>
        </div>
      </main>
    </div>
  );
}
