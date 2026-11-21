import { useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, BookOpen, Check, Clock3, Search, Sparkles } from "lucide-react";
import { catalogCourses, type CatalogCourse } from "./data";

export function Catalog({ onOpenMyRoutes }: { onOpenMyRoutes: () => void }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Todas");
  const [level, setLevel] = useState("Todos los niveles");
  const [selected, setSelected] = useState<CatalogCourse | null>(null);
  const categories = ["Todas", ...new Set(catalogCourses.map((course) => course.category))];
  const courses = useMemo(() => catalogCourses.filter((course) => (category === "Todas" || course.category === category) && (level === "Todos los niveles" || course.level === level) && `${course.title} ${course.category} ${course.skills.join(" ")}`.toLowerCase().includes(query.toLowerCase())), [category, level, query]);
  if (selected) return <CourseDetail course={selected} onBack={() => setSelected(null)} onOpenMyRoutes={onOpenMyRoutes} />;
  return <>
    <div className="learning-heading"><span className="eyebrow">LA CURIOSIDAD ES TU MEJOR BRÚJULA</span><h1>Encuentra tu próximo camino.</h1><p>Explora rutas creadas para transformar lo que aprendes en habilidades que puedes demostrar.</p></div>
    <div className="catalog-search"><Search size={19}/><input aria-label="Buscar rutas" placeholder="Busca por habilidad, tema o ruta" value={query} onChange={(event) => setQuery(event.target.value)} /></div>
    <div className="catalog-filters"><div className="filter-chips">{categories.map((item) => <button key={item} className={category === item ? "selected" : ""} onClick={() => setCategory(item)}>{item}</button>)}</div><select value={level} aria-label="Nivel" onChange={(event) => setLevel(event.target.value)}><option>Todos los niveles</option><option>Principiante</option><option>Intermedio</option></select></div>
    <div className="catalog-section-heading"><div><span className="eyebrow">RUTAS DISPONIBLES</span><h2>{courses.length} caminos para explorar</h2></div></div>
    <div className="catalog-grid">{courses.map((course) => <CourseCard key={course.id} course={course} onClick={() => setSelected(course)} />)}</div>
    {!courses.length && <div className="empty"><Search size={42}/><h2>No encontramos esa ruta</h2><p>Prueba otro término o elimina los filtros.</p><button className="btn secondary" onClick={() => { setQuery(""); setCategory("Todas"); setLevel("Todos los niveles"); }}>Ver todas las rutas</button></div>}
  </>;
}

function CourseCard({ course, onClick }: { course: CatalogCourse; onClick: () => void }) { return <button className="catalog-card" onClick={onClick}><div className="catalog-card-top"><span className="catalog-icon"><BookOpen size={20}/></span><span className={`catalog-status ${course.status === "Próximamente" ? "upcoming" : ""}`}>{course.status}</span></div><span className="eyebrow">{course.category}</span><h2>{course.title}</h2><p>{course.description}</p><div className="catalog-card-meta"><span><Clock3 size={13}/>{course.duration}</span><span>{course.modules} módulos</span><span>{course.level}</span></div><span className="route-continue">Ver detalle <ArrowRight size={15}/></span></button> }

function CourseDetail({ course, onBack, onOpenMyRoutes }: { course: CatalogCourse; onBack: () => void; onOpenMyRoutes: () => void }) { const unavailable = course.status === "Próximamente"; return <><button className="text-button back-link" onClick={onBack}><ArrowLeft size={16}/> Explorar aprendizaje</button><div className="learning-breadcrumb">Explorar aprendizaje <span>›</span> {course.title}</div><section className="catalog-detail"><div><span className="eyebrow">{course.category}</span><h1>{course.title}</h1><p className="lesson-lead">{course.description}</p><div className="route-meta"><span>{course.level}</span><span>{course.duration} estimadas</span><span>{course.modules} módulos</span></div>{unavailable ? <p className="catalog-coming"><Sparkles size={17}/> Esta ruta estará disponible próximamente. Puedes revisar su enfoque, pero aún no tiene actividades funcionales.</p> : <button className="btn" onClick={onOpenMyRoutes}>{course.status === "En progreso" ? "Continuar ruta" : "Ver mis rutas"}<ArrowRight size={15}/></button>}</div><aside><h2>Habilidades que desarrollarás</h2>{course.skills.map((skill) => <span className="pill" key={skill}>{skill}</span>)}</aside></section><section className="catalog-curriculum"><span className="eyebrow">CONTENIDO DE LA RUTA</span><h2>{unavailable ? "Estructura prevista" : "Una ruta para aprender haciendo"}</h2>{Array.from({ length: course.modules }, (_, index) => <div key={index}><span>{index + 1}</span><b>{unavailable ? ["Fundamentos", "Aplicación práctica", "Proyecto guiado", "Evaluación"][index % 4] : `Módulo ${index + 1}: aprendizaje aplicado`}</b><small>{unavailable ? "Contenido próximamente" : index === 0 ? "Disponible" : "Planificado"}</small></div>)}</section></> }
