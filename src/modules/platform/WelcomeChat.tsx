import { useEffect, useRef, useState, type ReactNode } from "react";
import { ArrowRight, Bot, Code2, LineChart, RotateCcw, Sparkles } from "lucide-react";
import { areas, courses, experienceOptions, goalOptions, timeOptions, type AreaKey } from "./data";
import type { Profile } from "./state";

type Message = { from: "bot" | "user"; text: string };
type Step = "area" | "experience" | "goal" | "time" | "done";

export function recommendedCourses(profile: Profile) {
  const list = courses.filter((c) => c.area === profile.area && !c.comingSoon);
  const beginner = profile.experience === experienceOptions[0];
  const sorted = beginner ? list.filter((c) => c.level === "Principiante") : list;
  const count = profile.time === timeOptions[0] ? 2 : 3;
  return (sorted.length >= count ? sorted : list).slice(0, count);
}

export function WelcomeChat({ name, profile, onFinish }: { name: string; profile: Profile | null; onFinish: (profile: Profile) => void }) {
  const intro: Message[] = [
    { from: "bot", text: `¡Hola, ${name}! Soy tu guía en SkillPath.` },
    { from: "bot", text: "Encuentra tu camino y construye tu futuro. Te haré unas preguntas rápidas para recomendarte por dónde empezar." },
    { from: "bot", text: "¿Qué área te gustaría explorar?" },
  ];
  const [messages, setMessages] = useState<Message[]>(intro);
  const [step, setStep] = useState<Step>("area");
  const [draft, setDraft] = useState<Partial<Profile>>({});
  const [typing, setTyping] = useState(false);
  const logRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, typing]);

  const botSay = (texts: string[], next: Step) => {
    setTyping(true);
    window.setTimeout(() => {
      setTyping(false);
      setMessages((old) => [...old, ...texts.map((text) => ({ from: "bot" as const, text }))]);
      setStep(next);
    }, 700);
  };

  const answer = (label: string, patch: Partial<Profile>) => {
    const nextDraft = { ...draft, ...patch };
    setDraft(nextDraft);
    setMessages((old) => [...old, { from: "user", text: label }]);
    if (step === "area") {
      const area = patch.area as AreaKey;
      botSay(
        [
          area === "fullstack"
            ? "¡Excelente elección! El desarrollo de software con IA abre muchas puertas."
            : "¡Muy bien! Entender las finanzas es una habilidad para toda la vida. Recuerda: aquí aprendemos, no damos asesoramiento financiero.",
          "¿Cuánta experiencia tienes en esta área?",
        ],
        "experience",
      );
    } else if (step === "experience") {
      botSay(["Gracias por contármelo. Todos empezamos en algún punto.", "¿Qué te gustaría lograr?"], "goal");
    } else if (step === "goal") {
      botSay(["¡Es una gran meta!", "Por último, ¿cuánto tiempo puedes dedicar a aprender?"], "time");
    } else if (step === "time") {
      botSay(["Perfecto. Con lo que me contaste, preparé una recomendación para ti 👇"], "done");
    }
  };

  const restart = () => {
    setMessages(intro);
    setDraft({});
    setStep("area");
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
          <button className="btn secondary" onClick={restart}>
            <RotateCcw size={15} /> Empezar de nuevo
          </button>
        </div>
        <p>SkillPath organiza rutas de aprendizaje, proyectos y habilidades para convertir tu progreso en oportunidades profesionales.</p>
      </div>
      {profile && step === "area" && messages.length === intro.length && (
        <p className="sp-demo-banner" role="note">
          <Sparkles size={16} aria-hidden="true" />
          <span>Ya tienes un área elegida: <b>{areas[profile.area].short}</b>. Puedes responder de nuevo para actualizar tu recomendación.</span>
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
          {final && !typing && (
            <div className="sp-recommendation">
              <span className="eyebrow">TU RECOMENDACIÓN · SIMULADA</span>
              <h2>{areas[final.area].name}</h2>
              <p>{areas[final.area].description}</p>
              <p className="muted">
                Objetivo: {final.goal} · Disponibilidad: {final.time.toLowerCase()}
              </p>
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
    </>
  );
}
