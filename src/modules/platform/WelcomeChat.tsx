import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { ArrowRight, Bot, Code2, FolderOpen, LineChart, RotateCcw, Send, Sparkles } from "lucide-react";
import { areas, courses, experienceOptions, goalOptions, timeOptions, type AreaKey } from "./data";
import { areaForCareer, careerSuggestions, trackForCareer } from "./career";
import { GithubConnect, GithubMark } from "./GithubConnect";
import type { Platform, Profile } from "./state";

type Message = { from: "bot" | "user"; text: string };
type Step = "name" | "career" | "github" | "area" | "experience" | "goal" | "time" | "done";

export function recommendedCourses(profile: Pick<Profile, "area" | "experience" | "time">) {
  const list = courses.filter((c) => c.area === profile.area && !c.comingSoon);
  const beginner = profile.experience === experienceOptions[0];
  const sorted = beginner ? list.filter((c) => c.level === "Principiante") : list;
  const count = profile.time === timeOptions[0] ? 2 : 3;
  return (sorted.length >= count ? sorted : list).slice(0, count);
}

export function WelcomeChat({
  name,
  platform,
  onName,
  onFinish,
}: {
  name: string;
  platform: Platform;
  onName: (fullName: string) => void;
  onFinish: (profile: Profile) => void;
}) {
  const { profile, github } = platform;
  const firstName = name.split(" ")[0];
  const intro = (): Message[] =>
    firstName
      ? [
          { from: "bot", text: `¡Hola, ${firstName}! Soy tu guía en SkillPath.` },
          { from: "bot", text: "Voy a adaptar la plataforma a lo que estudias. ¿Qué carrera estudias o vas a estudiar?" },
        ]
      : [
          { from: "bot", text: "¡Hola! Soy tu guía en SkillPath. Voy a hacerte unas preguntas rápidas para preparar tu espacio." },
          { from: "bot", text: "Para empezar, ¿cómo te llamas?" },
        ];
  const [messages, setMessages] = useState<Message[]>(intro);
  const [step, setStep] = useState<Step>(firstName ? "career" : "name");
  const [draft, setDraft] = useState<Partial<Profile>>({});
  const [typing, setTyping] = useState(false);
  const [text, setText] = useState("");
  const [connecting, setConnecting] = useState(false);
  const logRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, typing]);

  useEffect(() => {
    if (!typing && (step === "name" || step === "career")) inputRef.current?.focus();
  }, [step, typing]);

  const botSay = (texts: string[], next: Step) => {
    setTyping(true);
    window.setTimeout(() => {
      setTyping(false);
      setMessages((old) => [...old, ...texts.map((t) => ({ from: "bot" as const, text: t }))]);
      setStep(next);
    }, 650);
  };

  const userSay = (label: string) => setMessages((old) => [...old, { from: "user", text: label }]);

  /** Después de la carrera (y de GitHub si aplica): se pregunta el área solo si la carrera no la define. */
  const afterPortfolio = (area: AreaKey | null, lead: string[]) => {
    if (area) {
      setDraft((d) => ({ ...d, area }));
      botSay([...lead, `Te recomiendo el área «${areas[area].name}».`, "¿Cuánta experiencia tienes?"], "experience");
    } else {
      botSay([...lead, "¿Qué área te gustaría explorar en SkillPath?"], "area");
    }
  };

  const chooseCareer = (career: string, fromChip = true) => {
    if (fromChip) userSay(career);
    const track = trackForCareer(career);
    setDraft((d) => ({ ...d, career, track }));
    if (track === "tech") {
      if (github) {
        afterPortfolio("fullstack", [`Tu cuenta de GitHub @${github.login} ya está conectada: tu portafolio son tus repositorios.`]);
      } else {
        botSay(
          [
            `${career} es una carrera de sistemas e informática: tu portafolio será tu GitHub.`,
            "Para continuar es obligatorio conectar tu cuenta. Tus repositorios aparecerán en «Mis proyectos» y en tu CV.",
          ],
          "github",
        );
      }
    } else {
      afterPortfolio(areaForCareer(career), [
        `¡Genial! Para ${career} no necesitas GitHub.`,
        "Creé tu carpeta personal en «Mis proyectos»: ahí podrás subir documentos, imágenes, PDF y enlaces, y todo aparecerá en tu CV.",
      ]);
    }
  };

  const submitText = (event: FormEvent) => {
    event.preventDefault();
    const value = text.trim().replace(/\s+/g, " ");
    if (value.length < 2) return;
    setText("");
    userSay(value);
    if (step === "name") {
      onName(value);
      botSay([`¡Mucho gusto, ${value.split(" ")[0]}!`, "¿Qué carrera estudias o vas a estudiar?"], "career");
    } else if (step === "career") {
      chooseCareer(value, false);
    }
  };

  const answer = (label: string, patch: Partial<Profile>) => {
    setDraft((d) => ({ ...d, ...patch }));
    userSay(label);
    if (step === "area") {
      const area = patch.area as AreaKey;
      botSay(
        [
          area === "fullstack"
            ? "¡Excelente elección! El desarrollo de software con IA abre muchas puertas."
            : "¡Muy bien! Entender las finanzas es una habilidad para toda la vida. Aquí aprendemos, no damos asesoramiento financiero.",
          "¿Cuánta experiencia tienes en esta área?",
        ],
        "experience",
      );
    } else if (step === "experience") {
      botSay(["Gracias por contármelo. Todos empezamos en algún punto.", "¿Qué te gustaría lograr?"], "goal");
    } else if (step === "goal") {
      botSay(["¡Es una gran meta!", "Por último, ¿cuánto tiempo puedes dedicar a aprender?"], "time");
    } else if (step === "time") {
      botSay(["Perfecto. Con lo que me contaste, preparé tu espacio 👇"], "done");
    }
  };

  const restart = () => {
    setMessages(intro());
    setDraft({});
    setText("");
    setStep(firstName ? "career" : "name");
  };

  const final = step === "done" ? (draft as Profile) : null;
  const options: { label: string; patch: Partial<Profile>; icon?: ReactNode }[] =
    step === "area"
      ? [
          { label: areas.fullstack.name, patch: { area: "fullstack" }, icon: <Code2 size={16} /> },
          { label: areas.finanzas.name, patch: { area: "finanzas" }, icon: <LineChart size={16} /> },
        ]
      : step === "experience"
        ? experienceOptions.map((o) => ({ label: o, patch: { experience: o } }))
        : step === "goal"
          ? goalOptions[draft.area ?? "fullstack"].map((o) => ({ label: o, patch: { goal: o } }))
          : step === "time"
            ? timeOptions.map((o) => ({ label: o, patch: { time: o } }))
            : [];

  return (
    <>
      <div className="page-heading">
        <span className="eyebrow">GUÍA DE BIENVENIDA</span>
        <div className="row between">
          <h1>Elijamos juntos por dónde empezar.</h1>
          {messages.length > intro().length && (
            <button className="btn secondary" onClick={restart}>
              <RotateCcw size={15} /> Empezar de nuevo
            </button>
          )}
        </div>
        <p>Cuéntale a tu guía qué estudias: SkillPath adapta tus cursos, tu portafolio y tu CV a tu carrera.</p>
      </div>
      {profile && step === "career" && messages.length === intro().length && (
        <p className="sp-demo-banner" role="note">
          <Sparkles size={16} aria-hidden="true" />
          <span>Ya configuraste tu espacio para <b>{profile.career}</b>. Puedes responder de nuevo para actualizarlo.</span>
        </p>
      )}
      <section className="panel sp-chat" aria-label="Conversación con tu guía">
        <div className="sp-chat-log" ref={logRef} aria-live="polite">
          {messages.map((m, i) => (
            <div key={i} className={`sp-bubble ${m.from}`}>
              {m.from === "bot" && (
                <span className="sp-bot-avatar" aria-hidden="true">
                  <Bot size={16} />
                </span>
              )}
              <p>
                <span className="sr-only">{m.from === "bot" ? "Guía: " : "Tú: "}</span>
                {m.text}
              </p>
            </div>
          ))}
          {typing && (
            <div className="sp-bubble bot" role="status">
              <span className="sp-bot-avatar" aria-hidden="true">
                <Bot size={16} />
              </span>
              <p className="sp-typing" aria-label="El guía está escribiendo">
                <i /> <i /> <i />
              </p>
            </div>
          )}
          {step === "github" && !typing && (
            <div className="sp-github-gate">
              <GithubMark size={28} />
              <div>
                <b>Conecta tu cuenta de GitHub para continuar</b>
                <p className="muted">Es obligatorio para carreras de sistemas: tus repositorios serán tu portafolio.</p>
              </div>
              <button className="btn gh-button" onClick={() => setConnecting(true)}>
                <GithubMark size={16} /> Conectar con GitHub
              </button>
            </div>
          )}
          {final && !typing && (
            <div className="sp-recommendation">
              <span className="eyebrow">TU ESPACIO ESTÁ LISTO</span>
              <h2>{areas[final.area].name}</h2>
              <p>{areas[final.area].description}</p>
              <ul className="sp-facts">
                <li>Carrera: <b>{final.career}</b></li>
                <li>
                  Portafolio:{" "}
                  {final.track === "tech" ? (
                    <b>GitHub @{github?.login} · {github?.repos.length ?? 0} repositorios</b>
                  ) : (
                    <b><FolderOpen size={13} aria-hidden="true" /> Carpeta personal en «Mis proyectos»</b>
                  )}
                </li>
                <li>Objetivo: {final.goal} · {final.time.toLowerCase()}</li>
              </ul>
              <h3>Cursos para empezar</h3>
              <ol>
                {recommendedCourses(final).map((c) => (
                  <li key={c.id}>
                    <b>{c.name}</b> <span className="muted">· {c.level} · {c.hours} h</span>
                  </li>
                ))}
              </ol>
              <div className="row sp-actions">
                <button className="btn" onClick={() => onFinish(final)}>
                  Comenzar mi ruta <ArrowRight size={16} />
                </button>
                <button className="btn secondary" onClick={restart}>
                  Cambiar respuestas
                </button>
              </div>
            </div>
          )}
        </div>
        {(step === "name" || step === "career") && (
          <div className="sp-chat-compose">
            {step === "career" && (
              <div className="sp-chat-options sp-career-chips" role="group" aria-label="Carreras frecuentes">
                {careerSuggestions.map((career) => (
                  <button key={career} disabled={typing} onClick={() => chooseCareer(career)}>
                    {career}
                  </button>
                ))}
              </div>
            )}
            <form className="sp-inline-form" onSubmit={submitText}>
              <label className="sr-only" htmlFor="chat-input">
                {step === "name" ? "Tu nombre" : "Tu carrera"}
              </label>
              <input
                id="chat-input"
                ref={inputRef}
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder={step === "name" ? "Escribe tu nombre y apellido" : "O escribe tu carrera, por ejemplo «Medicina»"}
                autoComplete={step === "name" ? "name" : "off"}
                disabled={typing}
              />
              <button className="btn" disabled={typing || text.trim().length < 2}>
                Enviar <Send size={14} />
              </button>
            </form>
          </div>
        )}
        {options.length > 0 && (
          <div className="sp-chat-options" role="group" aria-label="Elige una respuesta">
            {options.map((o) => (
              <button key={o.label} disabled={typing} onClick={() => answer(o.label, o.patch)}>
                {o.icon}
                {o.label}
              </button>
            ))}
          </div>
        )}
      </section>
      {connecting && (
        <GithubConnect
          onClose={() => setConnecting(false)}
          onConnected={(account) => {
            platform.setGithub(account);
            setConnecting(false);
            userSay(`Conecté mi GitHub (@${account.login})`);
            afterPortfolio("fullstack", [
              account.live
                ? `¡Listo! Encontré ${account.repos.length} repositorios públicos en @${account.login}.`
                : `¡Listo! Conecté la cuenta de ejemplo @${account.login} con ${account.repos.length} repositorios.`,
              "Ya están en «Mis proyectos» y enlazados a tu CV.",
            ]);
          }}
        />
      )}
    </>
  );
}
