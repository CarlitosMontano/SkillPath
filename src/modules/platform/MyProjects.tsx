import { useEffect, useRef, useState, type ChangeEvent, type DragEvent, type FormEvent } from "react";
import { Bot, ExternalLink, File as FileIcon, FileImage, FileText, FolderOpen, Link2, RefreshCw, Star, Trash2, Upload } from "lucide-react";
import { GithubConnect, GithubMark } from "./GithubConnect";
import { folderKindLabel, type FolderItem, type Platform } from "./state";
import { EmptyState, PageHeading } from "./ui";

const urlPattern = /^https?:\/\/\S+\.\S+/i;

function kindOf(file: File): FolderItem["kind"] {
  if (file.type.startsWith("image/")) return "image";
  if (file.type === "application/pdf") return "pdf";
  if (/\.(docx?|odt|txt|md|pptx?|xlsx?|csv|rtf)$/i.test(file.name)) return "document";
  return "other";
}

const formatSize = (bytes?: number) =>
  bytes === undefined ? "" : bytes < 1024 * 1024 ? `${Math.max(1, Math.round(bytes / 1024))} KB` : `${(bytes / (1024 * 1024)).toFixed(1)} MB`;

const kindIcon = { document: FileText, image: FileImage, pdf: FileText, link: Link2, other: FileIcon } as const;

/** «Mis proyectos»: repositorios de GitHub (carreras de sistemas) o carpeta personal (el resto). */
export function MyProjects({ platform, notify, openGuide }: { platform: Platform; notify: (text: string) => void; openGuide: () => void }) {
  if (!platform.profile) {
    return (
      <>
        <PageHeading eyebrow="MIS PROYECTOS" title="Tu portafolio empieza aquí." subtitle="Primero cuéntale a tu guía qué estudias: así sabremos si tu portafolio es tu GitHub o tu carpeta personal." />
        <EmptyState
          icon={<Bot size={38} />}
          title="Completa la guía de bienvenida"
          text="Solo toma un minuto y adapta esta sección a tu carrera."
          action={<button className="btn" onClick={openGuide}>Ir a la guía</button>}
        />
      </>
    );
  }
  return platform.profile.track === "tech" ? <GithubRepos platform={platform} notify={notify} /> : <PersonalFolder platform={platform} notify={notify} />;
}

function GithubRepos({ platform, notify }: { platform: Platform; notify: (text: string) => void }) {
  const { github } = platform;
  const [connecting, setConnecting] = useState(false);
  const [language, setLanguage] = useState("Todos");
  const languages = ["Todos", ...new Set((github?.repos ?? []).map((r) => r.language ?? "Sin lenguaje"))];
  const repos = (github?.repos ?? []).filter((r) => language === "Todos" || (r.language ?? "Sin lenguaje") === language);

  return (
    <>
      <PageHeading eyebrow="MIS PROYECTOS · GITHUB" title="Tus repositorios son tu portafolio." subtitle={`Como estudias ${platform.profile?.career}, tu trabajo se muestra desde GitHub y se enlaza automáticamente a tu CV.`}>
        {github && (
          <a className="btn secondary" href={github.url} target="_blank" rel="noopener noreferrer">
            <GithubMark size={16} /> Ver perfil en GitHub
          </a>
        )}
      </PageHeading>
      {!github ? (
        <EmptyState
          icon={<GithubMark size={38} />}
          title="Conecta tu cuenta de GitHub"
          text="Es obligatorio para carreras de sistemas: tus repositorios públicos aparecerán aquí y en tu CV."
          action={<button className="btn gh-button" onClick={() => setConnecting(true)}><GithubMark size={16} /> Conectar con GitHub</button>}
        />
      ) : (
        <>
          <section className="panel gh-account">
            <img src={github.avatarUrl} alt="" width={56} height={56} />
            <div>
              <b>{github.name}</b>
              <span className="muted">@{github.login} · {github.repos.length} repositorios públicos</span>
              <small className="muted">{github.live ? "Datos leídos de la API pública de GitHub." : "Cuenta de ejemplo: datos de muestra guardados en el prototipo."}</small>
            </div>
            <button className="btn secondary" onClick={() => setConnecting(true)}>
              <RefreshCw size={15} /> Cambiar cuenta
            </button>
          </section>
          {languages.length > 2 && (
            <div className="filter-chips" role="group" aria-label="Filtrar por lenguaje">
              {languages.map((l) => (
                <button key={l} className={language === l ? "selected" : ""} aria-pressed={language === l} onClick={() => setLanguage(l)}>
                  {l}
                </button>
              ))}
            </div>
          )}
          {github.repos.length === 0 ? (
            <EmptyState icon={<GithubMark size={38} />} title="Esta cuenta aún no tiene repositorios públicos" text="Crea tu primer repositorio en GitHub y vuelve a conectar la cuenta para verlo aquí." />
          ) : (
            <div className="sp-grid">
              {repos.map((repo) => (
                <article className="panel sp-card gh-repo" key={repo.name}>
                  <div className="row between">
                    <span className="gh-repo-icon" aria-hidden="true"><GithubMark size={16} /></span>
                    <span className="gh-stars"><Star size={13} aria-hidden="true" /> {repo.stars.toLocaleString("es")}</span>
                  </div>
                  <h3>{repo.name}</h3>
                  <p>{repo.description || "Este repositorio no tiene descripción."}</p>
                  <ul className="sp-facts">
                    <li><i className="gh-lang-dot" data-lang={repo.language ?? "none"} aria-hidden="true" /> {repo.language ?? "Sin lenguaje detectado"}</li>
                    <li>Actualizado el {new Date(repo.updated).toLocaleDateString("es", { day: "numeric", month: "long", year: "numeric" })}</li>
                  </ul>
                  <a className="btn secondary" href={repo.url} target="_blank" rel="noopener noreferrer">
                    Ver repositorio <ExternalLink size={14} />
                  </a>
                </article>
              ))}
            </div>
          )}
        </>
      )}
      {connecting && (
        <GithubConnect
          onClose={() => setConnecting(false)}
          onConnected={(account) => {
            platform.setGithub(account);
            setConnecting(false);
            notify(`GitHub conectado: @${account.login} · ${account.repos.length} repositorios.`);
          }}
        />
      )}
    </>
  );
}

function PersonalFolder({ platform, notify }: { platform: Platform; notify: (text: string) => void }) {
  const { folder, setFolder } = platform;
  const fileInput = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [linkErrors, setLinkErrors] = useState<Record<string, string>>({});
  const [filter, setFilter] = useState<"Todo" | FolderItem["kind"]>("Todo");

  // Libera las URL locales de los archivos al salir de la sesión.
  const folderRef = useRef(folder);
  folderRef.current = folder;
  useEffect(() => () => folderRef.current.forEach((item) => item.url.startsWith("blob:") && URL.revokeObjectURL(item.url)), []);

  const addFiles = (files: FileList | null) => {
    if (!files?.length) return;
    const added: FolderItem[] = [...files].map((file, i) => ({
      id: Date.now() + i,
      name: file.name,
      kind: kindOf(file),
      url: URL.createObjectURL(file),
      size: file.size,
      addedAt: Date.now(),
    }));
    setFolder((old) => [...added, ...old]);
    notify(`${added.length === 1 ? "Archivo guardado" : `${added.length} archivos guardados`} en tu carpeta y enlazados a tu CV.`);
  };

  const onPick = (event: ChangeEvent<HTMLInputElement>) => {
    addFiles(event.target.files);
    event.target.value = "";
  };

  const onDrop = (event: DragEvent) => {
    event.preventDefault();
    setDragging(false);
    addFiles(event.dataTransfer.files);
  };

  const addLink = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") ?? "").trim();
    const url = String(data.get("url") ?? "").trim();
    const errors: Record<string, string> = {};
    if (name.length < 3) errors.name = "Ponle un nombre de al menos 3 caracteres.";
    if (!urlPattern.test(url)) errors.url = "Escribe un enlace que empiece con https://";
    setLinkErrors(errors);
    if (Object.keys(errors).length) return;
    setFolder((old) => [{ id: Date.now(), name, kind: "link", url, note: String(data.get("note") ?? "").trim(), addedAt: Date.now() }, ...old]);
    form.reset();
    notify("Enlace guardado en tu carpeta y enlazado a tu CV.");
  };

  const remove = (item: FolderItem) => {
    if (item.url.startsWith("blob:")) URL.revokeObjectURL(item.url);
    setFolder((old) => old.filter((x) => x.id !== item.id));
    notify(`«${item.name}» se quitó de tu carpeta y de tu CV.`);
  };

  const kinds = ["Todo", ...new Set(folder.map((i) => i.kind))] as ("Todo" | FolderItem["kind"])[];
  const visible = folder.filter((i) => filter === "Todo" || i.kind === filter);

  return (
    <>
      <PageHeading
        eyebrow="MIS PROYECTOS · CARPETA PERSONAL"
        title="Tu carpeta de proyectos."
        subtitle={`Guarda aquí tus trabajos de ${platform.profile?.career}: documentos, imágenes, PDF y enlaces. Todo queda enlazado a tu CV en «Proyectos / Portafolio».`}
      />
      <div className="sp-folder-tools">
        <section
          className={`panel sp-dropzone ${dragging ? "is-dragging" : ""}`}
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
        >
          <Upload size={28} aria-hidden="true" />
          <b>Arrastra tus archivos aquí</b>
          <p className="muted">Documentos, imágenes y PDF. Se guardan solo en esta sesión del navegador.</p>
          <button className="btn" onClick={() => fileInput.current?.click()}>
            <Upload size={15} /> Subir archivos
          </button>
          <input ref={fileInput} type="file" multiple hidden accept="image/*,.pdf,.doc,.docx,.odt,.txt,.md,.ppt,.pptx,.xls,.xlsx,.csv" onChange={onPick} />
        </section>
        <form className="panel sp-section sp-link-form" onSubmit={addLink} noValidate>
          <h2><Link2 size={17} aria-hidden="true" /> Agregar un enlace</h2>
          <label>
            Nombre
            <input name="name" placeholder="Ej. Presentación del caso clínico" aria-invalid={!!linkErrors.name} />
            {linkErrors.name && <small className="sp-field-error">{linkErrors.name}</small>}
          </label>
          <label>
            Enlace
            <input name="url" type="url" placeholder="https://…" aria-invalid={!!linkErrors.url} />
            {linkErrors.url && <small className="sp-field-error">{linkErrors.url}</small>}
          </label>
          <label>
            Descripción (opcional)
            <input name="note" placeholder="¿Qué muestra este trabajo?" />
          </label>
          <button className="btn secondary">Guardar enlace</button>
        </form>
      </div>
      {folder.length === 0 ? (
        <EmptyState
          icon={<FolderOpen size={38} />}
          title="Tu carpeta está lista y vacía"
          text="Sube tu primer trabajo: un ensayo, un diseño, una presentación o el enlace a un proyecto. Aparecerá también en tu CV."
        />
      ) : (
        <>
          <div className="row between sp-toolbar">
            <h2 className="sp-folder-count">{folder.length} {folder.length === 1 ? "elemento" : "elementos"} en tu carpeta</h2>
            {kinds.length > 2 && (
              <div className="filter-chips" role="group" aria-label="Filtrar por tipo">
                {kinds.map((k) => (
                  <button key={k} className={filter === k ? "selected" : ""} aria-pressed={filter === k} onClick={() => setFilter(k)}>
                    {k === "Todo" ? "Todo" : folderKindLabel[k]}
                  </button>
                ))}
              </div>
            )}
          </div>
          <ul className="sp-folder-grid">
            {visible.map((item) => {
              const Icon = kindIcon[item.kind];
              return (
                <li className="panel sp-folder-item" key={item.id}>
                  <div className="sp-folder-thumb" data-kind={item.kind}>
                    {item.kind === "image" ? <img src={item.url} alt="" /> : <Icon size={26} aria-hidden="true" />}
                  </div>
                  <div className="sp-folder-info">
                    <b title={item.name}>{item.name}</b>
                    <small className="muted">
                      {folderKindLabel[item.kind]}
                      {item.size !== undefined && ` · ${formatSize(item.size)}`} · {new Date(item.addedAt).toLocaleDateString("es", { day: "numeric", month: "short" })}
                    </small>
                    {item.note && <small>{item.note}</small>}
                  </div>
                  <div className="sp-folder-actions">
                    <a className="icon-button" href={item.url} target="_blank" rel="noopener noreferrer" aria-label={`Abrir ${item.name}`} title="Abrir">
                      <ExternalLink size={16} />
                    </a>
                    <button className="icon-button" aria-label={`Quitar ${item.name}`} title="Quitar" onClick={() => remove(item)}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        </>
      )}
    </>
  );
}
