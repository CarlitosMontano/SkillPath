import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Check, ChevronDown, ClipboardCheck, Code2, ExternalLink, LockKeyhole, Play, Sparkles } from "lucide-react";
import { htmlLessons, projectCriteria, stageNames, type Question } from "./data";

type View = "routes" | "detail" | "lesson" | "quiz" | "project" | "exam";
type RouteKey = "fullstack" | "ux";
type Stored = { passed: string[]; project: boolean; examAttempts: number; examPassed: boolean };
/** Clave del avance de «Mis rutas» en localStorage (se borra en cada inicio de sesión). */
export const learningStorageKey = "skillpath-learning-v1";
// Usuario nuevo: ninguna lección aprobada.
const initial: Stored = { passed: [], project: false, examAttempts: 0, examPassed: false };
const uxLessons = ["Jerarquía visual", "Tipografía", "Color", "Espaciado"];
const uxStages = [["Fundamentos visuales", "4 lecciones"], ["Investigación UX", "3 lecciones"], ["Flujos y wireframes", "3 lecciones"], ["UI en Figma", "5 lecciones"], ["Sistemas de diseño", "3 lecciones"], ["Prototipado y pruebas", "3 lecciones"]] as const;

function load(): Stored {
  try { return { ...initial, ...JSON.parse(localStorage.getItem(learningStorageKey) || "{}") }; } catch { return initial; }
}
/** Progreso de la ruta Full Stack, el mismo que muestra «Mis rutas». */
export function readFullstackProgress(): number {
  const state = load();
  const completed = state.passed.length + Number(state.project) + Number(state.examPassed);
  return Math.round((completed / 7) * 100);
}
/** La ruta UX todavía no tiene lecciones navegables: un usuario nuevo empieza en 0 %. */
export const UX_ROUTE_PROGRESS = 0;
/** Siguiente lección pendiente de la etapa HTML, por ejemplo «HTML · L1 — Estructura del documento». */
export function nextLessonLabel(passed: string[]): string {
  const index = htmlLessons.findIndex((lesson) => !passed.includes(lesson.id));
  return index === -1 ? "HTML · Proyecto y examen final" : `HTML · L${index + 1} — ${htmlLessons[index].title}`;
}
/** Lecciones aprobadas en «Mis rutas» (para las estadísticas de Inicio). */
export function readNextLessonLabel(): string {
  return nextLessonLabel(load().passed);
}
export function readLessonsPassed(): number {
  return load().passed.length;
}
function assessmentBank(): Question[] {
  const bank = htmlLessons.flatMap((lesson) => lesson.questions);
  return Array.from({ length: 30 }, (_, index) => ({ ...bank[index % bank.length], id: `exam-${index}`, prompt: index < bank.length ? bank[index].prompt : `${bank[index % bank.length].prompt} (repaso ${Math.floor(index / bank.length) + 1})` }));
}

const focusViews: View[] = ["lesson", "quiz", "project", "exam"];

export function LearningRoutes({ onFocusChange }: { onFocusChange?: (focused: boolean) => void } = {}) {
  const [view, setView] = useState<View>("routes");
  const [route, setRoute] = useState<RouteKey>("fullstack");
  const [tab, setTab] = useState("En progreso");
  const [openStage, setOpenStage] = useState(0);
  const [state, setState] = useState<Stored>(load);
  const [lessonId, setLessonId] = useState("html-lists-links");
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [result, setResult] = useState<number | null>(null);
  const [criteria, setCriteria] = useState<boolean[]>(projectCriteria.map(() => false));
  const [repository, setRepository] = useState("");
  const [notice, setNotice] = useState("");
  const [examQuestions, setExamQuestions] = useState<Question[]>([]);

  useEffect(() => localStorage.setItem(learningStorageKey, JSON.stringify(state)), [state]);
  // Lecciones y evaluaciones se muestran a pantalla completa (modo enfoque).
  useEffect(() => {
    onFocusChange?.(focusViews.includes(view));
    window.scrollTo({ top: 0 });
  }, [view, onFocusChange]);
  useEffect(() => () => onFocusChange?.(false), [onFocusChange]);
  const completedActivities = state.passed.length + Number(state.project) + Number(state.examPassed);
  const stageProgress = Math.round((completedActivities / 7) * 100);
  const routeProgress = stageProgress;
  const allMiniPassed = state.passed.length === htmlLessons.length;
  const fullRoute = { name: "Desarrollador/a Full Stack con IA", level: "Principiante → Intermedio", stages: 8, time: "48 horas restantes", progress: routeProgress, current: nextLessonLabel(state.passed) };
  const uxRoute = { name: "Diseño de Producto UI/UX", level: "Principiante", stages: 6, time: "18 horas restantes", progress: UX_ROUTE_PROGRESS, current: "Investigación UX · Entrevistas y descubrimiento" };
  const active = route === "fullstack" ? fullRoute : uxRoute;
  const lesson = htmlLessons.find((item) => item.id === lessonId) || htmlLessons[2];
  const goDetail = (key: RouteKey) => { setRoute(key); setView("detail"); setOpenStage(0); };
  const resetAssessment = () => { setAnswers({}); setResult(null); };
  const score = (questions: Question[]) => Math.round((questions.filter((question) => answers[question.id] === question.answer).length / questions.length) * 100);
  const submitQuiz = () => {
    const value = score(lesson.questions); setResult(value);
    if (value >= 70) {
      setState((previous) => ({ ...previous, passed: Array.from(new Set([...previous.passed, lesson.id])) }));
      setNotice("Mini-evaluación aprobada. Tu progreso se actualizó.");
    }
  };
  const startExam = () => { setExamQuestions(assessmentBank().sort(() => Math.random() - 0.5).slice(0, 15)); setAnswers({}); setResult(null); setView("exam"); };
  const submitExam = () => {
    const value = score(examQuestions); setResult(value);
    setState((previous) => ({ ...previous, examAttempts: previous.examAttempts + 1, examPassed: previous.examPassed || value >= 75 }));
    if (value >= 75) setNotice("Examen final aprobado. Habilidad desarrollada.");
  };
  const routeCards = tab === "Completadas" ? [] : [fullRoute, uxRoute];

  if (view === "routes") return <>
    <div className="learning-heading"><span className="eyebrow">CAMINOS QUE YA SON TUYOS</span><h1>Aprender es seguir eligiendo.</h1><p>Retoma tus rutas activas. Tu siguiente descubrimiento está a una lección.</p></div>
    <div className="learning-tabs" role="tablist">{["En progreso", "Completadas", "Todas"].map((item) => <button key={item} role="tab" aria-selected={tab === item} className={tab === item ? "selected" : ""} onClick={() => setTab(item)}>{item}{item === "En progreso" ? " · 2" : ""}</button>)}</div>
    <div className="learning-route-grid">{routeCards.map((item, index) => <button className="learning-route-card" key={item.name} onClick={() => goDetail(index === 0 ? "fullstack" : "ux")}><div><span className="route-card-icon"><Code2 size={20}/></span><span className="status-pill">En curso</span></div><h2>{item.name}</h2><p>{item.level}</p><div className="route-current"><b>Etapa actual</b><span>{item.current}</span></div><div className="learning-progress"><i style={{ width: `${item.progress}%` }}/></div><div className="route-card-footer"><span>{item.progress}% · {item.time}</span><span className="route-continue">Continuar <ArrowRight size={15}/></span></div></button>)}</div>
    {routeCards.length === 0 && <div className="empty"><Sparkles size={40}/><h2>Aún no hay rutas completadas</h2><p>Cuando cierres una ruta, aparecerá aquí.</p></div>}
  </>;

  if (view === "detail") return <>
    <button className="text-button back-link" onClick={() => setView("routes")}><ArrowLeft size={16}/> Mis rutas</button>
    <div className="learning-breadcrumb">Mi espacio <span>›</span> Mis rutas <span>›</span> {active.name}</div>
    <section className="learning-route-hero"><div><span className="eyebrow">RUTA DE APRENDIZAJE</span><h1>{active.name}</h1><p>{route === "fullstack" ? "Construye productos web completos y aprende a integrar IA de manera responsable." : "Diseña experiencias útiles, accesibles y coherentes desde la investigación hasta el prototipo."}</p><div className="route-meta"><span>{active.level}</span><span>{active.stages} etapas</span><span>{active.time}</span></div></div><div className="route-progress-summary"><b>{active.progress}%</b><span>progreso global</span><div className="learning-progress"><i style={{ width: `${active.progress}%` }}/></div><button className="btn" onClick={() => { setLessonId("html-lists-links"); setView("lesson"); }}>Continuar donde lo dejaste <ArrowRight size={15}/></button></div></section>
    <div className="learning-detail-grid"><section><h2>Etapas de la ruta</h2>{(route === "fullstack" ? stageNames : uxStages).map(([name, count], index) => { const available = index === 0; const expanded = openStage === index; return <div className="stage-accordion" key={name}><button className="stage-toggle" onClick={() => setOpenStage(expanded ? -1 : index)}><span className={`stage-number ${available ? "active" : ""}`}>{index + 1}</span><span><b>{name}</b><small>{count} · {available ? `${route === "fullstack" ? stageProgress : 64}% completado` : "Próximamente"}</small></span>{available ? <ChevronDown size={18} className={expanded ? "rotated" : ""}/> : <LockKeyhole size={16}/>}</button>{expanded && <div className="stage-content">{available ? <StageContent route={route} passed={state.passed} project={state.project} examPassed={state.examPassed} allMiniPassed={allMiniPassed} onLesson={(id) => { setLessonId(id); setView("lesson"); }} onProject={() => setView("project")} onExam={startExam}/> : <p className="upcoming-copy">Esta estructura curricular está preparada. <b>Contenido próximamente.</b></p>}</div>}</div>; })}</section><aside className="skills-panel"><span className="eyebrow">HABILIDADES DE ESTA RUTA</span><h2>Lo que estás construyendo</h2>{["HTML semántico", "Accesibilidad web", "Estructura de contenidos"].map((skill, index) => <div className="route-skill" key={skill}><span className={state.project && state.examPassed ? "demonstrated" : allMiniPassed ? "developed" : "learning"}/><div><b>{skill}</b><small>{state.project && state.examPassed ? "Demostrada" : allMiniPassed ? "Desarrollada" : index === 0 ? "En aprendizaje" : "Pendiente"}</small></div></div>)}</aside></div>
  </>;

  if (view === "lesson") return <><button className="text-button back-link" onClick={() => setView("detail")}><ArrowLeft size={16}/> Volver a la ruta</button><div className="learning-breadcrumb">Mis rutas <span>›</span> {active.name} <span>›</span> HTML <span>›</span> {lesson.title}</div><div className="lesson-route-layout"><article className="lesson-reading"><span className="eyebrow">HTML · LECCIÓN {htmlLessons.findIndex((item) => item.id === lesson.id) + 1} DE 5</span><h1>{lesson.title}</h1><p className="lesson-lead">{lesson.description}</p><h2>Objetivo de aprendizaje</h2><p>Al terminar podrás aplicar este concepto en la estructura de tu página personal.</p><h2>Concepto clave</h2><p>{lesson.content}</p><pre><code>{lesson.example}</code></pre><aside className="learning-callout"><Sparkles size={19}/><div><b>Conecta con el proyecto</b><p>Este conocimiento será un criterio de tu página personal.</p></div></aside><div className="lesson-actions"><button className="btn secondary" onClick={() => setView("detail")}>Guardar y volver</button><button className="btn" onClick={() => { resetAssessment(); setView("quiz"); }}>Hacer mini-evaluación <ArrowRight size={15}/></button></div></article><LessonSidebar lessons={route === "fullstack" ? htmlLessons : []} current={lesson.id} passed={state.passed} onOpen={(id) => { setLessonId(id); setView("lesson"); }}/></div></>;

  if (view === "quiz") return <Assessment title={`Mini-evaluación · ${lesson.title}`} questions={lesson.questions} answers={answers} setAnswers={setAnswers} result={result} minimum={70} onSubmit={submitQuiz} onBack={() => setView("lesson")} onRetry={resetAssessment} onContinue={() => setView("detail")}/>;

  if (view === "project") { const ready = criteria.every(Boolean) && repository.trim().length > 5; const submit = () => { if (!ready) { setNotice("Completa todos los criterios y añade una URL para enviar el proyecto."); return; } setState((previous) => ({ ...previous, project: true })); setNotice("Proyecto aprobado de forma simulada. Integración con GitHub: Próximamente."); }; return <><button className="text-button back-link" onClick={() => setView("detail")}><ArrowLeft size={16}/> Volver a la etapa</button><section className="project-screen"><span className="eyebrow">PROYECTO DE ETAPA · HTML</span><h1>Mi primera página personal</h1><p className="lesson-lead">Construye una página personal utilizando los fundamentos de HTML que acabas de practicar.</p><div className="project-info"><div><h2>Objetivos</h2><p>Organizar contenido con estructura semántica y ofrecer una experiencia accesible.</p></div><div><h2>Entrega</h2><p>Comparte la URL de tu repositorio o publicación. La revisión es una simulación local.</p></div></div><h2>Checklist de criterios</h2>{projectCriteria.map((criterion, index) => <label className="check-item" key={criterion}><input type="checkbox" checked={criteria[index]} onChange={() => setCriteria((values) => values.map((value, item) => item === index ? !value : value))}/><span>{criterion}</span><b>{criteria[index] ? "Cumple" : "Pendiente"}</b></label>)}<label>URL del repositorio o entrega<input value={repository} onChange={(event) => setRepository(event.target.value)} placeholder="https://github.com/usuario/mi-pagina"/></label><p className="muted">Integración con GitHub: Próximamente.</p><button className="btn" onClick={submit}>Enviar proyecto <ExternalLink size={15}/></button>{state.project && <p className="success-note"><Check size={16}/> Proyecto aprobado: tu evidencia práctica se actualizó.</p>}</section></> }

  if (view === "exam") { if (!examQuestions.length || result !== null) return <ExamIntro attempts={state.examAttempts} passed={state.examPassed} allMiniPassed={allMiniPassed} onBack={() => setView("detail")} onStart={startExam} />; return <Assessment title="Examen final · HTML" questions={examQuestions} answers={answers} setAnswers={setAnswers} result={result} minimum={75} onSubmit={submitExam} onBack={() => setView("detail")} onRetry={startExam} onContinue={() => setView("detail")} />; }
  return null;
}

function StageContent({ route, passed, project, examPassed, allMiniPassed, onLesson, onProject, onExam }: { route: RouteKey; passed: string[]; project: boolean; examPassed: boolean; allMiniPassed: boolean; onLesson: (id: string) => void; onProject: () => void; onExam: () => void }) { const lessons = route === "fullstack" ? htmlLessons : uxLessons.map((title, index) => ({ id: `ux-${index}`, title })); return <><h3>Lecciones</h3>{lessons.map((lesson, index) => { const completed = passed.includes(lesson.id); const previous = index === 0 || passed.includes(lessons[index - 1].id); return <button className="stage-lesson" key={lesson.id} disabled={!previous} onClick={() => route === "fullstack" && onLesson(lesson.id)}><span>{index + 1}</span><b>{lesson.title}</b><small>{completed ? "Evaluación aprobada" : previous ? "En curso" : "Bloqueada"}</small></button>; })}<div className="stage-activity"><ClipboardCheck size={19}/><div><b>Proyecto: Mi primera página personal</b><p>Aplica HTML semántico y accesible en una evidencia práctica.</p></div><button className="btn secondary" disabled={!allMiniPassed} onClick={onProject}>{project ? "Aprobado" : allMiniPassed ? "Abrir proyecto" : "Bloqueado"}</button></div><div className="stage-activity"><Play size={19}/><div><b>Examen final de HTML</b><p>15 preguntas · nota mínima 75% · máximo 3 intentos.</p></div><button className="btn secondary" disabled={!allMiniPassed} onClick={onExam}>{examPassed ? "Aprobado" : allMiniPassed ? "Ver examen" : "Bloqueado"}</button></div></> }
function LessonSidebar({ lessons, current, passed, onOpen }: { lessons: typeof htmlLessons; current: string; passed: string[]; onOpen: (id: string) => void }) { return <aside className="lesson-sidebar"><b>Contenido de la etapa</b>{lessons.map((item, index) => <button key={item.id} className={current === item.id ? "current" : ""} onClick={() => onOpen(item.id)}><span>{passed.includes(item.id) ? <Check size={13}/> : index + 1}</span>{item.title}</button>)}</aside> }
function Assessment({ title, questions, answers, setAnswers, result, minimum, onSubmit, onBack, onRetry, onContinue }: { title: string; questions: Question[]; answers: Record<string, number>; setAnswers: (next: Record<string, number>) => void; result: number | null; minimum: number; onSubmit: () => void; onBack: () => void; onRetry: () => void; onContinue: () => void }) { const ready = questions.every((question) => answers[question.id] !== undefined); if (result !== null) { const passed = result >= minimum; return <section className={passed ? "assessment-result is-passed" : "assessment-result"}>{passed && <span className="celebrate" aria-hidden="true">{Array.from({ length: 14 }, (_, i) => <i key={i} />)}</span>}<span className={passed ? "result-icon passed" : "result-icon failed"}>{passed ? <Check/> : "!"}</span><span className="eyebrow">RESULTADO DE EVALUACIÓN</span><h1>{passed ? "¡Lo lograste!" : "Aún puedes reforzarlo"}</h1><b className="assessment-score">{result}%</b><p>{passed ? `Superaste la nota mínima de ${minimum}%.` : `Necesitas ${minimum}% para aprobar. Revisa las explicaciones y vuelve a intentar.`}</p><div className="result-feedback">{questions.map((question) => <div key={question.id} className={answers[question.id] === question.answer ? "correct" : "incorrect"}><b>{answers[question.id] === question.answer ? "Correcta" : "Para repasar"}</b><span>{question.explanation}</span></div>)}</div><div className="lesson-actions">{!passed && <button className="btn secondary" onClick={onRetry}>Reintentar</button>}<button className="btn" onClick={onContinue}>{passed ? "Volver a la etapa" : "Repasar lección"}</button></div></section>; } return <section className="assessment-screen"><button className="text-button back-link" onClick={onBack}><ArrowLeft size={16}/> Volver</button><span className="eyebrow">EVALUACIÓN</span><h1>{title}</h1><p>Responde todas las preguntas. Necesitas {minimum}% para aprobar.</p><div className="assessment-progress"><i style={{ width: `${(Object.keys(answers).length / questions.length) * 100}%` }}/><span>{Object.keys(answers).length} de {questions.length} respondidas</span></div>{questions.map((question, index) => <fieldset className="question-card" key={question.id}><legend>{index + 1}. {question.prompt}</legend>{question.options.map((option, optionIndex) => <label key={option}><input type="radio" name={question.id} checked={answers[question.id] === optionIndex} onChange={() => setAnswers({ ...answers, [question.id]: optionIndex })}/>{option}</label>)}</fieldset>)}<button className="btn" disabled={!ready} onClick={onSubmit}>Enviar respuestas <ArrowRight size={15}/></button></section>; }
function ExamIntro({ attempts, passed, allMiniPassed, onBack, onStart }: { attempts: number; passed: boolean; allMiniPassed: boolean; onBack: () => void; onStart: () => void }) { const available = allMiniPassed && attempts < 3 && !passed; return <section className="exam-intro"><button className="text-button back-link" onClick={onBack}><ArrowLeft size={16}/> Volver a la etapa</button><span className="eyebrow">EVALUACIÓN FINAL · HTML</span><h1>Demuestra lo que aprendiste</h1><p>El examen selecciona 15 preguntas de un banco de práctica. Necesitas 75% para aprobar.</p><div className="exam-details"><span>15 preguntas</span><span>75% mínimo</span><span>{Math.max(0, 3 - attempts)} intentos restantes</span></div>{passed ? <p className="success-note"><Check size={16}/> Examen aprobado.</p> : <button className="btn" disabled={!available} onClick={onStart}>{available ? "Comenzar examen" : attempts >= 3 ? "Intentos agotados" : "Aprueba las mini-evaluaciones"}<ArrowRight size={15}/></button>}</section> }
