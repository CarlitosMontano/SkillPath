import { useState, type FormEvent } from "react";
import { ArrowLeft, CornerDownRight, Heart, LoaderCircle, MessageCircle, MessagesSquare, Plus, Send } from "lucide-react";
import { forumCategories, type ForumCategory, type Post, type Reply } from "./data";
import type { Platform } from "./state";
import { DemoBanner, Dialog, EmptyState, PageHeading, SkeletonGrid, timeAgo, useSimulatedLoad } from "./ui";

type Sort = "Recientes" | "Populares";
type View = "Publicaciones" | "Mis comentarios";
const postTypes: Post["type"][] = ["Avance", "Proyecto", "Pregunta"];

export function Forum({ platform, notify, authorName }: { platform: Platform; notify: (text: string) => void; authorName: string }) {
  const { posts, setPosts } = platform;
  const [view, setView] = useState<View>("Publicaciones");
  const [category, setCategory] = useState<"Todas" | ForumCategory>("Todas");
  const [sort, setSort] = useState<Sort>("Recientes");
  const [openId, setOpenId] = useState<number | null>(null);
  const [composing, setComposing] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [reply, setReply] = useState("");
  const { loading } = useSimulatedLoad(600);
  const displayName = authorName.trim() || "Tú";
  const initials = displayName.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();

  const myComments = posts.flatMap((post) => post.replies.filter((r) => r.mine).map((r) => ({ post, reply: r })));

  const visible = posts
    .filter((p) => category === "Todas" || p.category === category)
    .sort((a, b) => (sort === "Recientes" ? a.minutesAgo - b.minutesAgo : b.likes + b.replies.length * 2 - (a.likes + a.replies.length * 2)));

  const toggleLike = (id: number) =>
    setPosts((old) => old.map((p) => (p.id === id ? { ...p, liked: !p.liked, likes: p.likes + (p.liked ? -1 : 1) } : p)));

  const openPost = (id: number) => {
    setOpenId(id);
    setReply("");
    window.scrollTo({ top: 0 });
  };

  const publish = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const title = String(data.get("title") ?? "").trim();
    const body = String(data.get("body") ?? "").trim();
    const next: Record<string, string> = {};
    if (title.length < 8) next.title = "El título debe tener al menos 8 caracteres.";
    if (body.length < 20) next.body = "Cuéntanos un poco más (mínimo 20 caracteres).";
    setErrors(next);
    if (Object.keys(next).length) return;
    setPublishing(true);
    window.setTimeout(() => {
      setPosts((old) => [
        { id: Date.now(), author: displayName, initials, category: data.get("category") as ForumCategory, type: data.get("type") as Post["type"], title, body, likes: 0, minutesAgo: 0, replies: [] },
        ...old,
      ]);
      setPublishing(false);
      setComposing(false);
      setSort("Recientes");
      setView("Publicaciones");
      notify("Publicación creada. Se guarda durante esta sesión.");
    }, 600);
  };

  const sendReply = (event: FormEvent, post: Post) => {
    event.preventDefault();
    const text = reply.trim();
    if (text.length < 2) return;
    const mine: Reply = { id: Date.now(), author: displayName, initials, text, minutesAgo: 0, mine: true };
    setPosts((old) => old.map((p) => (p.id === post.id ? { ...p, replies: [...p.replies, mine] } : p)));
    setReply("");
    notify("Comentario publicado. También lo verás en «Mis comentarios».");
  };

  const open = posts.find((p) => p.id === openId);
  if (open) {
    return (
      <>
        <button className="text-button back-link" onClick={() => setOpenId(null)}>
          <ArrowLeft size={16} /> Volver al foro
        </button>
        <article className="panel sp-post-detail">
          <PostMeta post={open} />
          <h1>{open.title}</h1>
          <p className="sp-post-body">{open.body}</p>
          <button className={`sp-like ${open.liked ? "on" : ""}`} aria-pressed={!!open.liked} onClick={() => toggleLike(open.id)}>
            <Heart size={15} aria-hidden="true" /> {open.likes} <span className="sr-only">me gusta</span>
          </button>
          <h2>{open.replies.length} {open.replies.length === 1 ? "comentario" : "comentarios"}</h2>
          {open.replies.length === 0 && <p className="muted">Nadie ha comentado todavía. ¡Sé la primera persona en ayudar!</p>}
          <ul className="sp-replies">
            {open.replies.map((r) => (
              <li key={r.id} className={r.mine ? "is-mine" : ""}>
                <span className="avatar small-avatar" aria-hidden="true">{r.initials}</span>
                <div>
                  <div className="sp-reply-head">
                    <b>{r.mine ? `${r.author} ` : r.author}</b>
                    {r.mine && <span className="pill sp-you">Tú</span>}
                    <small className="muted">· {timeAgo(r.minutesAgo)}</small>
                  </div>
                  <p>{r.text}</p>
                </div>
              </li>
            ))}
          </ul>
          <form className="sp-comment-form" onSubmit={(e) => sendReply(e, open)}>
            <span className="avatar small-avatar" aria-hidden="true">{initials}</span>
            <label className="sr-only" htmlFor="reply">Tu comentario</label>
            <textarea id="reply" rows={3} value={reply} onChange={(e) => setReply(e.target.value)} placeholder="Escribe un comentario respetuoso y útil…" />
            <button className="btn" disabled={reply.trim().length < 2}>
              Comentar <Send size={14} />
            </button>
          </form>
        </article>
      </>
    );
  }

  return (
    <>
      <PageHeading eyebrow="COMUNIDAD" title="Aprender en compañía llega más lejos." subtitle="Comparte avances, publica proyectos, pregunta y ayuda a otras personas de la comunidad.">
        <button className="btn" onClick={() => setComposing(true)}>
          Nueva publicación <Plus size={16} />
        </button>
      </PageHeading>
      <DemoBanner>Publicaciones y comentarios de ejemplo. Lo que publiques se guarda durante esta sesión.</DemoBanner>
      <div className="tabs sp-forum-tabs" role="tablist" aria-label="Vista del foro">
        {(["Publicaciones", "Mis comentarios"] as View[]).map((v) => (
          <button key={v} role="tab" aria-selected={view === v} className={view === v ? "selected" : ""} onClick={() => setView(v)}>
            {v === "Mis comentarios" ? `Mis comentarios (${myComments.length})` : v}
          </button>
        ))}
      </div>

      {view === "Mis comentarios" ? (
        myComments.length === 0 ? (
          <EmptyState
            icon={<MessageCircle size={38} />}
            title="Todavía no has comentado"
            text="Abre una publicación y deja tu primer comentario: aparecerá aquí para que lo revises cuando quieras."
            action={<button className="btn secondary" onClick={() => setView("Publicaciones")}>Ver publicaciones</button>}
          />
        ) : (
          <ul className="sp-my-comments">
            {[...myComments].reverse().map(({ post, reply: r }) => (
              <li key={r.id} className="panel">
                <small className="muted"><CornerDownRight size={13} aria-hidden="true" /> En «{post.title}» · {timeAgo(r.minutesAgo)}</small>
                <p>{r.text}</p>
                <button className="text-button" onClick={() => openPost(post.id)}>Ver hilo completo</button>
              </li>
            ))}
          </ul>
        )
      ) : (
        <>
          <div className="row between sp-toolbar">
            <div className="filter-chips" role="group" aria-label="Filtrar por categoría">
              {(["Todas", ...forumCategories] as const).map((c) => (
                <button key={c} className={category === c ? "selected" : ""} aria-pressed={category === c} onClick={() => setCategory(c)}>
                  {c}
                </button>
              ))}
            </div>
            <div className="segmented" role="group" aria-label="Ordenar publicaciones">
              {(["Recientes", "Populares"] as Sort[]).map((s) => (
                <button key={s} className={sort === s ? "selected" : ""} aria-pressed={sort === s} onClick={() => setSort(s)}>
                  {s}
                </button>
              ))}
            </div>
          </div>
          {loading ? (
            <SkeletonGrid count={3} label="Cargando publicaciones" />
          ) : visible.length === 0 ? (
            <EmptyState icon={<MessagesSquare size={38} />} title={`Aún no hay publicaciones en ${category}`} text="Inicia la conversación compartiendo tu avance o tu pregunta." action={<button className="btn" onClick={() => setComposing(true)}>Crear publicación <Plus size={15} /></button>} />
          ) : (
            <ul className="sp-post-list">
              {visible.map((p) => {
                const last = p.replies[p.replies.length - 1];
                return (
                  <li key={p.id} className="panel sp-post">
                    <PostMeta post={p} />
                    <h3>
                      <button className="sp-post-open" onClick={() => openPost(p.id)}>
                        {p.title}
                      </button>
                    </h3>
                    <p>{p.body}</p>
                    <div className="row between">
                      <div className="row">
                        <button className={`sp-like ${p.liked ? "on" : ""}`} aria-pressed={!!p.liked} aria-label={`Me gusta: ${p.likes}`} onClick={() => toggleLike(p.id)}>
                          <Heart size={14} aria-hidden="true" /> {p.likes}
                        </button>
                        <span className="muted row"><MessageCircle size={14} aria-hidden="true" /> {p.replies.length} {p.replies.length === 1 ? "comentario" : "comentarios"}</span>
                      </div>
                      <span className="sp-post-cta" aria-hidden="true">Abrir conversación →</span>
                    </div>
                    <div className="sp-post-peek" aria-hidden="true">
                      <b>{p.replies.length} {p.replies.length === 1 ? "comentario" : "comentarios"}</b>
                      {last ? (
                        <p>
                          <span>{last.mine ? "Tú" : last.author}</span> · {timeAgo(last.minutesAgo)}
                          <br />«{last.text.length > 110 ? `${last.text.slice(0, 110)}…` : last.text}»
                        </p>
                      ) : (
                        <p>Sin comentarios todavía.</p>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </>
      )}
      {composing && (
        <Dialog title="Nueva publicación" eyebrow="COMPARTE CON LA COMUNIDAD" onClose={() => { setComposing(false); setErrors({}); }}>
          <form onSubmit={publish} noValidate>
            <div className="sp-two-fields">
              <label>
                Tipo
                <select name="type" defaultValue="Avance">
                  {postTypes.map((t) => <option key={t}>{t}</option>)}
                </select>
              </label>
              <label>
                Categoría
                <select name="category" defaultValue={category === "Todas" ? "Desarrollo" : category}>
                  {forumCategories.map((c) => <option key={c}>{c}</option>)}
                </select>
              </label>
            </div>
            <label>
              Título
              <input name="title" placeholder="Ej. Terminé mi primer proyecto en React" aria-invalid={!!errors.title} />
              {errors.title && <small className="sp-field-error">{errors.title}</small>}
            </label>
            <label>
              Mensaje
              <textarea name="body" rows={4} placeholder="Cuenta tu avance, describe tu proyecto o plantea tu pregunta…" aria-invalid={!!errors.body} />
              {errors.body && <small className="sp-field-error">{errors.body}</small>}
            </label>
            <button className="btn" disabled={publishing}>
              {publishing ? <><LoaderCircle size={15} className="sp-spin" /> Publicando…</> : <>Publicar <Send size={15} /></>}
            </button>
          </form>
        </Dialog>
      )}
    </>
  );
}

function PostMeta({ post }: { post: Post }) {
  return (
    <div className="sp-post-meta">
      <span className="avatar small-avatar" aria-hidden="true">{post.initials}</span>
      <b>{post.author}</b>
      <span className="muted">· {timeAgo(post.minutesAgo)}</span>
      <span className={`pill sp-type ${post.type.toLowerCase()}`}>{post.type}</span>
      <span className="pill sp-category">{post.category}</span>
    </div>
  );
}
