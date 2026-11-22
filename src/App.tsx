import { useEffect, useState, type ReactNode } from "react";
import {
  ArrowUpRight,
  ArrowRight,
  ArrowLeft,
  Bell,
  BookOpen,
  Check,
  ChevronRight,
  Clock3,
  Code2,
  Compass,
  Download,
  ExternalLink,
  FileText,
  Flag,
  Flame,
  FolderKanban,
  Home,
  Layers3,
  Leaf,
  Menu,
  MoreHorizontal,
  Play,
  Plus,
  Search,
  Settings,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp,
  Trophy,
  Users,
  X,
  Zap,
  CalendarDays,
  CheckCircle2,
  LockKeyhole,
  Palette,
  BrainCircuit,
  BriefcaseBusiness,
  Wallet,
  MessageCircle,
  GitBranch,
  Award,
} from "lucide-react";
import { Bot, GraduationCap, LogOut, MessagesSquare } from "lucide-react";
import { LearningRoutes, readFullstackProgress, UX_ROUTE_PROGRESS } from "./modules/learning/LearningRoutes";
import { usePlatformState } from "./modules/platform/state";
import {
  affiliatedCerts,
  areas,
  completedProjects,
  courses,
  events,
  goalOptions,
  experienceOptions,
  recommendedCerts,
  timeOptions,
} from "./modules/platform/data";
import { CommandPalette, type PaletteItem } from "./modules/platform/CommandPalette";
import { applyTheme, initialTheme, type Theme } from "./modules/platform/theme";
import { Moon, Sun } from "lucide-react";
import { Login } from "./modules/platform/Login";
import { WelcomeChat } from "./modules/platform/WelcomeChat";
import { HomeOverview, type PlatformPage } from "./modules/platform/HomeOverview";
import { AreasCourses } from "./modules/platform/AreasCourses";
import { Portfolio } from "./modules/platform/Portfolio";
import { AffiliatedCertifications, RecommendedCertifications } from "./modules/platform/Certifications";
import { Forum } from "./modules/platform/Forum";
import { Events } from "./modules/platform/Events";
import "./modules/platform/platform.css";

type Page =
  | "Inicio"
  | "Explorar aprendizaje"
  | "Mis rutas"
  | "Mis proyectos"
  | "Mis habilidades"
  | "Mi progreso"
  | "Configuración"
  | "Lección"
  | PlatformPage;
const navigation = [
  { name: "Inicio", icon: Home },
  { name: "Guía de bienvenida", icon: Bot },
  { name: "Áreas y cursos", icon: BookOpen },
  { name: "Explorar aprendizaje", icon: Compass },
  { name: "Mis rutas", icon: GitBranch },
  { name: "Mis proyectos", icon: FolderKanban },
  { name: "Mis habilidades", icon: Layers3 },
  { name: "Mi progreso", icon: TrendingUp },
  { name: "Portafolio", icon: FileText },
  { name: "Foro", icon: MessagesSquare },
  { name: "Eventos recomendados", icon: CalendarDays },
  { name: "Certificaciones", icon: Award },
] as const;
type NavName = (typeof navigation)[number]["name"];
/** «Certificaciones» agrupa las dos vistas (recomendadas y afiliadas) en pestañas. */
const navTarget = (name: NavName): Page => (name === "Certificaciones" ? "Certificaciones recomendadas" : name);
const isCertPage = (page: string) => page.startsWith("Certificaciones");
const communityStart = navigation.findIndex((item) => item.name === "Foro");
const routes = [
  {
    // Mismo nombre y progreso que en «Mis rutas».
    title: "Diseño de Producto UI/UX",
    category: "Diseño",
    description: "Diseña experiencias que las personas disfruten usar.",
    level: "Principiante",
    progress: UX_ROUTE_PROGRESS,
    time: "18 h restantes",
    next: "Investigación UX · Entrevistas y descubrimiento",
    color: "purple",
    icon: Palette,
    lessons: 24,
  },
  {
    // Mismo nombre que en «Mis rutas»; su progreso se lee de ahí (ver currentProgress).
    title: "Desarrollador/a Full Stack con IA",
    category: "Programación",
    description: "Construye productos web completos e integra IA de forma responsable.",
    level: "Principiante",
    progress: 32,
    time: "48 h restantes",
    next: "HTML · Listas y enlaces",
    color: "blue",
    icon: Code2,
    lessons: 32,
  },
  {
    title: "IA para potenciar tus ideas",
    category: "Inteligencia artificial",
    description: "Transforma la inteligencia artificial en tu aliada creativa.",
    level: "Principiante",
    progress: 0,
    time: "6 horas",
    next: "Tu primer prompt",
    color: "yellow",
    icon: BrainCircuit,
    lessons: 18,
  },
  {
    title: "Comunica con impacto",
    category: "Comunicación",
    description: "Cuenta historias, comparte ideas y conecta mejor.",
    level: "Principiante",
    progress: 0,
    time: "4 horas",
    next: "El poder de una buena historia",
    color: "green",
    icon: MessageCircle,
    lessons: 16,
  },
  {
    title: "Tus finanzas, bajo control",
    category: "Finanzas personales",
    description: "Construye una relación más consciente con tu dinero.",
    level: "Principiante",
    progress: 0,
    time: "5 horas",
    next: "Tu punto de partida",
    color: "yellow",
    icon: Wallet,
    lessons: 20,
  },
  {
    title: "De idea a negocio",
    category: "Negocios",
    description: "Valida una idea y construye algo que tenga valor.",
    level: "Intermedio",
    progress: 0,
    time: "7 horas",
    next: "Encontrar un problema real",
    color: "purple",
    icon: BriefcaseBusiness,
    lessons: 22,
  },
];
const skills = [
  {
    name: "Diseño de interfaces",
    state: "En aprendizaje",
    level: "Básico",
    route: "Diseño de Producto UI/UX",
    tests: "2 de 4",
    projects: 0,
    icon: Palette,
  },
  {
    name: "HTML y CSS",
    state: "Demostrada",
    level: "Intermedio",
    route: "Desarrollador/a Full Stack con IA",
    tests: "4 de 4",
    projects: 2,
    icon: Code2,
  },
  {
    name: "Investigación de usuarios",
    state: "Desarrollada",
    level: "Básico",
    route: "Diseño de Producto UI/UX",
    tests: "3 de 3",
    projects: 0,
    icon: Users,
  },
  {
    name: "JavaScript",
    state: "Desarrollada",
    level: "Intermedio",
    route: "Desarrollador/a Full Stack con IA",
    tests: "5 de 5",
    projects: 0,
    icon: Zap,
  },
  {
    name: "React",
    state: "En aprendizaje",
    level: "Básico",
    route: "Desarrollador/a Full Stack con IA",
    tests: "1 de 4",
    projects: 0,
    icon: Code2,
  },
  {
    name: "Resolución de problemas",
    state: "Demostrada",
    level: "Intermedio",
    route: "Pensamiento creativo",
    tests: "3 de 3",
    projects: 1,
    icon: BrainCircuit,
  },
];
function Button({
  children,
  onClick,
  secondary = false,
  className = "",
  disabled = false,
}: {
  children: ReactNode;
  onClick?: () => void;
  secondary?: boolean;
  className?: string;
  disabled?: boolean;
}) {
  return (
    <button
      disabled={disabled}
      className={`${secondary ? "btn secondary" : "btn"} ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
function Progress({ value }: { value: number }) {
  return (
    <div className="progress">
      <span style={{ width: `${value}%` }} />
    </div>
  );
}
function App() {
  const [page, setPage] = useState<Page>("Inicio");
  const [mobileMenu, setMobileMenu] = useState(false);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Todas");
  const [level, setLevel] = useState("Todos los niveles");
  const [modal, setModal] = useState<string | null>(null);
  const [toast, setToast] = useState("");
  const [activeRoute, setActiveRoute] = useState(0);
  const [enrolledRoutes, setEnrolledRoutes] = useState([0, 1]);
  const [completed, setCompleted] = useState<string[]>([]);
  const [lessonIndex, setLessonIndex] = useState(0);
  const [lessonTab, setLessonTab] = useState("Lección");
  const [notes, setNotes] = useState("");
  const [exercise, setExercise] = useState("");
  const [goals, setGoals] = useState([true, true, true, true, false]);
  const [period, setPeriod] = useState("Mes");
  const [skillFilter, setSkillFilter] = useState("Todas");
  const platform = usePlatformState();
  const [courseToOpen, setCourseToOpen] = useState<string | null>(null);
  const [settings, setSettings] = useState([true, true, false]);
  const [userName, setUserName] = useState("Alex");
  const [surname, setSurname] = useState("Morgan");
  const [headline, setHeadline] = useState("Desarrollador/a web en formación");
  const [bio, setBio] = useState(
    "Aprendo desarrollo web construyendo proyectos reales: interfaces claras, accesibles y con propósito.",
  );
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [theme, setTheme] = useState<Theme>(initialTheme);
  useEffect(() => applyTheme(theme), [theme]);
  const toggleTheme = () => setTheme((current) => (current === "dark" ? "light" : "dark"));
  // Modo enfoque: lecciones y evaluaciones a pantalla completa, sin barra lateral.
  const [learningFocus, setLearningFocus] = useState(false);
  const [learningKey, setLearningKey] = useState(0);
  const [drafts, setDrafts] = useState<{ name: string; description: string }[]>([]);
  useEffect(() => {
    const previousFocus = document.activeElement as HTMLElement | null;
    const dialog = document.querySelector<HTMLElement>('[role="dialog"]');
    if (modal) dialog?.querySelector<HTMLElement>("button, input")?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setModal(null);
        setMobileMenu(false);
      }
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setModal(null);
        setMobileMenu(false);
        setPaletteOpen((open) => !open);
      }
      if (event.key === "Tab" && dialog) {
        const focusable = dialog.querySelectorAll<HTMLElement>(
          "button:not(:disabled), a[href], input, textarea, select",
        );
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last?.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first?.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      if (modal) previousFocus?.focus();
    };
  }, [modal]);
  const notify = (text: string) => {
    setToast(text);
    window.setTimeout(() => setToast(""), 4200);
  };
  const go = (next: Page) => {
    setPage(next);
    setMobileMenu(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const fullName = `${userName} ${surname}`.trim();
  const initials = (userName.charAt(0) + (surname.charAt(0) || userName.charAt(1))).toUpperCase();
  const todayLabel = (() => {
    const text = new Date().toLocaleDateString("es", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
    return text.charAt(0).toUpperCase() + text.slice(1);
  })();
  const logout = () => {
    platform.logout();
    setModal(null);
    setMobileMenu(false);
    setPage("Inicio");
  };
  const openLesson = (index: number) => {
    setActiveRoute(index);
    setEnrolledRoutes((old) => (old.includes(index) ? old : [...old, index]));
    setLessonIndex(0);
    setLessonTab("Lección");
    go("Lección");
  };
  const lessonKey = `${activeRoute}-${lessonIndex}`;
  const lessonTitles = [
    ["Principios de diseño visual", "Jerarquía y composición", "Color y accesibilidad"],
    ["Componentes y propiedades", "Estado e interacciones", "Tu primera aplicación"],
    ["Tu primer prompt", "Contexto y ejemplos", "Evaluar una respuesta"],
    ["El poder de una buena historia", "Conoce a tu audiencia", "Presenta tu idea"],
    ["Tu punto de partida", "Crea tu presupuesto", "Un fondo de emergencia"],
    ["Encontrar un problema real", "Validar tu idea", "Tu propuesta de valor"],
  ][activeRoute];
  const extraLesson = [
    null,
    null,
    {
      title: "Una buena pregunta cambia el resultado",
      intro:
        "Un prompt es la instrucción que das a una herramienta de inteligencia artificial. Explicar el objetivo, el contexto y el formato esperado ayuda a obtener respuestas más útiles.",
      principle:
        "En lugar de pedir «dame ideas», explica para quién son, qué problema resuelven y qué límites deben respetar. Revisa siempre la exactitud de la respuesta.",
      exercise:
        "Escribe un prompt para organizar tu próxima semana de aprendizaje. Incluye tu objetivo, tiempo disponible y un formato para la respuesta.",
    },
    {
      title: "Toda idea necesita un hilo conductor",
      intro:
        "Comunicar bien no significa decir más. Significa ayudar a otra persona a entender por qué tu idea importa. Una historia conecta el contexto, el problema y el cambio que propones.",
      principle:
        "Antes de preparar tu mensaje, identifica a quién te diriges, qué sabe ya y qué necesita comprender. Elige una sola idea principal.",
      exercise:
        "Presenta un proyecto personal en tres frases: el problema, tu propuesta y el cambio que puede generar.",
    },
    {
      title: "Entender antes de decidir",
      intro:
        "Conocer tus ingresos y gastos es el primer paso para tomar decisiones financieras conscientes. No necesitas una herramienta compleja: una lista clara es un buen comienzo.",
      principle:
        "Distingue los gastos fijos de los variables. Registra un mes completo sin juzgar tus decisiones: primero observa, después ajusta. Este contenido es educativo, no asesoramiento financiero.",
      exercise:
        "Crea un presupuesto ficticio de 1.500 € mensuales. Separa necesidades, ahorro y gastos personales, explicando tus prioridades.",
    },
    {
      title: "Empieza por un problema, no por una solución",
      intro:
        "Una idea de negocio gana sentido cuando resuelve una necesidad real. Antes de construir, investiga qué dificultades encuentran las personas y cómo las resuelven hoy.",
      principle:
        "Habla con posibles usuarios. Pregunta por experiencias concretas en lugar de pedir su opinión sobre tu idea. Busca patrones en sus respuestas.",
      exercise:
        "Elige un problema cotidiano. Describe quién lo tiene y redacta tres preguntas abiertas para entenderlo mejor.",
    },
  ][activeRoute];
  const totalDone = completed.length;
  // Las dos rutas inscritas leen su progreso de «Mis rutas» para que los números coincidan.
  const currentProgress = (i: number) =>
    i === 1
      ? readFullstackProgress()
      : Math.min(100, routes[i].progress + completed.filter((k) => k.startsWith(`${i}-`)).length * 4);
  /** Las rutas 0 y 1 viven en «Mis rutas»; el resto abre su lección de muestra. */
  const continueRoute = (index: number) => (index <= 1 ? go("Mis rutas") : openLesson(index));

  /** Todo lo que se puede encontrar desde el buscador global (Ctrl/⌘ K). */
  const paletteItems = (): PaletteItem[] => [
    ...navigation.map((item) => ({
      id: `page-${item.name}`,
      group: "Páginas",
      label: item.name,
      icon: item.icon,
      run: () => go(navTarget(item.name)),
    })),
    { id: "page-config", group: "Páginas", label: "Configuración", icon: Settings, run: () => go("Configuración") },
    ...routes.map((route, index) => ({
      id: `route-${index}`,
      group: "Rutas",
      label: route.title,
      hint: `${route.category} · ${route.level}`,
      icon: route.icon,
      run: () => continueRoute(index),
    })),
    ...courses.map((course) => ({
      id: `course-${course.id}`,
      group: "Cursos",
      label: course.name,
      hint: `${areas[course.area].short} · ${course.comingSoon ? "Próximamente" : course.level}`,
      icon: BookOpen,
      run: () => {
        setCourseToOpen(course.id);
        go("Áreas y cursos");
      },
    })),
    ...completedProjects.map((project) => ({
      id: `project-${project.name}`,
      group: "Proyectos",
      label: project.name,
      hint: project.tech.join(" · "),
      icon: FolderKanban,
      run: () => go("Mis proyectos"),
    })),
    ...events.map((event) => ({
      id: `event-${event.id}`,
      group: "Eventos",
      label: event.name,
      hint: event.modality,
      icon: CalendarDays,
      run: () => go("Eventos recomendados"),
    })),
    ...recommendedCerts.map((cert) => ({
      id: `cert-${cert.id}`,
      group: "Certificaciones",
      label: cert.name,
      hint: `${cert.provider} · Recomendada`,
      icon: Award,
      run: () => go("Certificaciones recomendadas"),
    })),
    ...affiliatedCerts.map((cert) => ({
      id: `aff-${cert.id}`,
      group: "Certificaciones",
      label: cert.name,
      hint: `${cert.institution} · Ejemplo`,
      icon: GraduationCap,
      run: () => go("Certificaciones afiliadas"),
    })),
    ...platform.posts.map((post) => ({
      id: `post-${post.id}`,
      group: "Foro",
      label: post.title,
      hint: `${post.author} · ${post.category}`,
      icon: MessagesSquare,
      run: () => go("Foro"),
    })),
  ];

  function RouteCard({ index, explore = false }: { index: number; explore?: boolean }) {
    const route = routes[index];
    const Icon = route.icon;
    return (
      <article className={`route-card ${explore ? "explore-card" : ""}`}>
        <div className={`course-art ${route.color}`}>
          <div className="art-grid" />
          <div className="art-object">
            <Icon size={46} strokeWidth={1.3} />
          </div>
          <span className="art-caption">
            {route.category === "Diseño"
              ? "HAZLO HUMANO."
              : route.category === "Programación"
                ? "CONSTRUYE ALGO."
                : "SIGUE EXPLORANDO."}
          </span>
          <span className="art-number">0{index + 1}</span>
        </div>
        <div className="route-body">
          <div className="row between">
            <span className="eyebrow">{route.category}</span>
            <span className="level">{route.level}</span>
          </div>
          <h3>{route.title}</h3>
          <p>{route.description}</p>
          {!explore && (
            <>
              <div className="row between course-progress">
                <span>Tu progreso</span>
                <b>{currentProgress(index)}%</b>
              </div>
              <Progress value={currentProgress(index)} />
              <div className="next-lesson">
                <Play size={12} /> {route.next}
              </div>
            </>
          )}
          <div className="row between course-footer">
            <span className="muted row">
              <Clock3 size={13} /> {route.time}
            </span>
            <button className="text-button" onClick={() => continueRoute(index)}>
              {explore ? "Ver ruta" : "Continuar"} <ArrowRight size={15} />
            </button>
          </div>
        </div>
      </article>
    );
  }
  function SectionHeading({
    eyebrow,
    title,
    subtitle,
    children,
  }: {
    eyebrow: string;
    title: string;
    subtitle?: string;
    children?: ReactNode;
  }) {
    return (
      <div className="page-heading">
        <span className="eyebrow">{eyebrow}</span>
        <div className="row between">
          <h1>{title}</h1>
          {children}
        </div>
        {subtitle && <p>{subtitle}</p>}
      </div>
    );
  }
  function GrowthMap() {
    const nodes = [
      { icon: Flag, name: "Tu punto de partida", sub: "Un gran primer paso", style: "done" },
      { icon: Code2, name: "HTML y CSS", sub: "Habilidad demostrada", style: "done" },
      {
        icon: FolderKanban,
        name: "Mi primer sitio web",
        sub: "Proyecto completado",
        style: "done",
      },
      { icon: Palette, name: "Diseño UI/UX", sub: `Estás aquí · ${UX_ROUTE_PROGRESS}%`, style: "current" },
      { icon: Trophy, name: "Tu primer producto", sub: "Tu próximo gran logro", style: "locked" },
    ];
    return (
      <section className="growth-map panel">
        <div className="row between">
          <div>
            <h2>Tu mapa de crecimiento</h2>
            <p className="section-description">Todo lo que aprendes te lleva a un nuevo lugar.</p>
          </div>
          <button className="text-button" onClick={() => go("Mi progreso")}>
            Ver mi camino <ArrowUpRight size={16} />
          </button>
        </div>
        <div className="map-track">
          <svg className="map-line" viewBox="0 0 1000 100" preserveAspectRatio="none">
            <path
              d="M70 62 C160 62 170 10 285 18 S420 90 500 62 S650 0 715 20 S850 85 930 58"
              fill="none"
              style={{ stroke: "var(--border)" }}
              strokeWidth="2"
              strokeDasharray="5 6"
            />
            <path
              d="M70 62 C160 62 170 10 285 18 S420 90 500 62 S650 0 715 20"
              fill="none"
              style={{ stroke: "var(--blue-300)" }}
              strokeWidth="2"
            />
          </svg>
          {nodes.map((node, i) => (
            <button
              key={node.name}
              className={`map-node node-${i} ${node.style}`}
              onClick={() => (i === 3 ? continueRoute(0) : setModal(node.name))}
            >
              <span className="node-icon">
                <node.icon size={22} strokeWidth={1.7} />
                {node.style === "done" && (
                  <i>
                    <Check size={9} strokeWidth={3} />
                  </i>
                )}
              </span>
              <b>{node.name}</b>
              <small>{node.sub}</small>
            </button>
          ))}
        </div>
        <div className="map-legend">
          <span>
            <i className="dot green-dot" /> Consolidado
          </span>
          <span>
            <i className="dot blue-dot" /> En desarrollo
          </span>
          <span>
            <i className="dot gray-dot" /> Por descubrir
          </span>
        </div>
      </section>
    );
  }
  function WeeklyGoal() {
    return (
      <section className="weekly-goal">
        <div className="row between">
          <span className="eyebrow">PEQUEÑOS PASOS, GRANDES CAMBIOS</span>
          <Target size={20} />
        </div>
        <h2>Tu meta de la semana</h2>
        <div className="goal-count">
          {goals.filter(Boolean).length}
          <span>/ 5 objetivos</span>
          <span className="goal-percent">{goals.filter(Boolean).length * 20}%</span>
        </div>
        <Progress value={goals.filter(Boolean).length * 20} />
        <p>
          {goals.every(Boolean)
            ? "Una semana de avances. Tu constancia cuenta."
            : "Vas muy bien. Te falta un último paso para llegar a tu meta."}
        </p>
        <div className="week-days">
          {["L", "M", "X", "J", "V", "S", "D"].map((d, i) => (
            <div key={i}>
              <span>{d}</span>
              <i className={i < goals.filter(Boolean).length ? "active-day" : ""}>
                {i < goals.filter(Boolean).length ? <Check size={13} /> : i + 12}
              </i>
            </div>
          ))}
        </div>
        <button className="text-button" onClick={() => go("Mi progreso")}>
          Ver mis objetivos <ArrowUpRight size={15} />
        </button>
      </section>
    );
  }
  function Dashboard() {
    return (
      <>
        <div className="welcome-row">
          <span>RESUMEN DE HOY</span>
          <span>{todayLabel}</span>
        </div>
        <section className="hero">
          <div className="hero-content">
            <div className="hello">
              <span className="small-sun">
                <Sparkles size={15} />
              </span>{" "}
              Qué bueno verte, {userName}
            </div>
            <h1>
              Tu próximo gran logro
              <br />
              comienza{" "}
              <span>
                aprendiendo
                <span className="underline-swoosh" />
              </span>
              .
            </h1>
            <p>
              Construye nuevas habilidades, desarrolla proyectos y convierte
              <br className="desktop-br" /> lo que aprendes en oportunidades reales.
            </p>
            <div className="hero-actions">
              <Button onClick={() => go("Mis rutas")}>
                Continuar aprendiendo <ArrowUpRight size={17} />
              </Button>
              <Button secondary onClick={() => go("Explorar aprendizaje")}>
                Explorar rutas <ArrowRight size={16} />
              </Button>
            </div>
            <div className="hero-meta">
              <span>
                <i className="dot green-dot" /> Explorador de habilidades
              </span>
              <span className="meta-divider" />
              <span>
                <Target size={13} /> Tu objetivo: {platform.profile?.goal ?? "Define tu objetivo con la guía"}
              </span>
            </div>
          </div>
          <div className="hero-visual">
            <img
              src="/images/growth-stairs.png"
              alt="Escalera azul que conduce a una planta en crecimiento bajo un arco violeta"
            />
            <div className="floating-badge badge-top">
              <span className="badge-icon">
                <TrendingUp size={18} />
              </span>
              <div>
                Un poco mejor<b>cada día.</b>
              </div>
              <Sparkles size={15} />
            </div>
            <div className="floating-badge badge-bottom">
              <span className="badge-icon yellow-icon">
                <Zap size={18} />
              </span>
              <div>
                Tu futuro está<b>en construcción.</b>
              </div>
            </div>
          </div>
        </section>
        <div className="learning-layout">
          <section>
            <div className="section-heading row between">
              <div>
                <span className="eyebrow">PARA HOY</span>
                <h2>Continúa donde lo dejaste</h2>
              </div>
              <button className="text-button" onClick={() => go("Mis rutas")}>
                Mis rutas <ArrowUpRight size={16} />
              </button>
            </div>
            <div className="two-courses">
              <RouteCard index={0} />
              <RouteCard index={1} />
            </div>
          </section>
          <WeeklyGoal />
        </div>
        <div className="dash-tier">
          <span className="eyebrow">TU CAMINO COMPLETO</span>
          <p>Tus cifras, tu panel personal, tu mapa de crecimiento y lo que pasa en la comunidad.</p>
        </div>
        <section className="stats-strip">
          {[
            {
              icon: GitBranch,
              value: String(enrolledRoutes.length).padStart(2, "0"),
              label: "Rutas activas",
              detail: "Sigue explorando",
              color: "blue",
            },
            {
              icon: BookOpen,
              value: String(48 + totalDone),
              label: "Lecciones completadas",
              detail: "+8 esta semana",
              color: "purple",
            },
            {
              icon: Layers3,
              // Mismas cifras que «Mis habilidades» y «Mis proyectos».
              value: String(skills.length).padStart(2, "0"),
              label: "Habilidades desarrolladas",
              detail: `${skills.filter((s) => s.state === "Demostrada").length} demostradas`,
              color: "green",
            },
            {
              icon: FolderKanban,
              value: String(completedProjects.length).padStart(2, "0"),
              label: "Proyectos terminados",
              detail: "También en tu portafolio",
              color: "yellow",
            },
            {
              icon: Flame,
              value: "07",
              label: "Días de actividad",
              detail: "Tu mejor racha: 12 días",
              color: "orange",
            },
          ].map((s) => (
            <button
              key={s.label}
              onClick={() =>
                go(
                  s.label.includes("Rutas")
                    ? "Mis rutas"
                    : s.label.includes("Habilidades")
                      ? "Mis habilidades"
                      : s.label.includes("Proyectos")
                        ? "Mis proyectos"
                        : "Mi progreso",
                )
              }
              className="stat"
            >
              <div className="row between">
                <span className={`stat-icon ${s.color}`}>
                  <s.icon size={18} />
                </span>
                <span className="stat-value">{s.value}</span>
              </div>
              <b>{s.label}</b>
              <span className="stat-detail">{s.detail}</span>
            </button>
          ))}
        </section>
        <HomeOverview
          part="path"
          platform={platform}
          go={go}
          continueCourse={(id) => {
            setCourseToOpen(id);
            go("Áreas y cursos");
          }}
        />
        <GrowthMap />
        <HomeOverview
          part="community"
          platform={platform}
          go={go}
          continueCourse={(id) => {
            setCourseToOpen(id);
            go("Áreas y cursos");
          }}
        />
      </>
    );
  }
  function Explore() {
    const filtered = routes
      .map((r, i) => ({ ...r, index: i }))
      .filter(
        (r) =>
          (category === "Todas" || r.category === category) &&
          (level === "Todos los niveles" || r.level === level) &&
          `${r.title} ${r.category}`.toLowerCase().includes(search.toLowerCase()),
      );
    return (
      <>
        <SectionHeading
          eyebrow="LA CURIOSIDAD ES TU MEJOR BRÚJULA"
          title="Hay muchas habilidades esperando por ti."
          subtitle="Encuentra ese nuevo camino que conecta con lo que quieres ser."
        />
        <div className="explore-search">
          <Search size={21} />
          <input
            placeholder="¿Qué te gustaría aprender hoy?"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <kbd>Explora a tu ritmo</kbd>
        </div>
        <div className="filter-chips">
          {[
            "Todas",
            "Programación",
            "Diseño",
            "Inteligencia artificial",
            "Negocios",
            "Finanzas personales",
            "Comunicación",
          ].map((c) => (
            <button
              key={c}
              className={category === c ? "selected" : ""}
              onClick={() => setCategory(c)}
            >
              {c}
            </button>
          ))}
        </div>
        <div className="section-heading row between">
          <div>
            <h2>{category === "Todas" ? "Elegidas para tu próximo paso" : category}</h2>
            <p className="section-description">{filtered.length} rutas para seguir creciendo</p>
          </div>
          <select
            aria-label="Filtrar por nivel"
            value={level}
            onChange={(e) => setLevel(e.target.value)}
          >
            <option>Todos los niveles</option>
            <option>Principiante</option>
            <option>Intermedio</option>
          </select>
        </div>
        <div className="course-grid">
          {filtered.map((r) => (
            <RouteCard key={r.index} index={r.index} explore />
          ))}
        </div>
        {filtered.length === 0 && (
          <div className="empty">
            <Compass size={48} />
            <h2>Un camino por descubrir</h2>
            <p>Aún no hay rutas con estos filtros. Prueba con otra categoría.</p>
            <Button
              secondary
              onClick={() => {
                setCategory("Todas");
                setSearch("");
                setLevel("Todos los niveles");
              }}
            >
              Ver todas las rutas
            </Button>
          </div>
        )}
      </>
    );
  }
  function Lesson() {
    const done = completed.includes(lessonKey);
    return (
      <>
        <button className="text-button back-link" onClick={() => go("Mis rutas")}>
          <ArrowLeft size={16} /> Volver a mis rutas
        </button>
        <div className="lesson-layout">
          <section className="lesson-content">
            <span className="eyebrow">{routes[activeRoute].title} · MÓDULO 3</span>
            <h1>{lessonTitles[lessonIndex]}</h1>
            <div className="row muted">
              <Clock3 size={15} /> 12 min de lectura <span>·</span> Lección {lessonIndex + 1} de 3
            </div>
            <div className="tabs">
              {["Lección", "Ejercicio", "Recursos", "Mis notas"].map((t) => (
                <button
                  key={t}
                  className={lessonTab === t ? "selected" : ""}
                  onClick={() => setLessonTab(t)}
                >
                  {t}
                </button>
              ))}
            </div>
            {lessonTab === "Lección" && (
              <div className="lesson-copy">
                <div className={`lesson-illustration ${routes[activeRoute].color}`}>
                  <div className="demo-square" />
                  <div className="demo-circle" />
                  <div className="demo-lines">
                    <i />
                    <i />
                    <i />
                  </div>
                  <span>
                    {activeRoute === 1 ? "PENSAR EN COMPONENTES" : "MENOS RUIDO. MÁS INTENCIÓN."}
                  </span>
                </div>
                <h2>
                  {extraLesson?.title ??
                    (activeRoute === 1
                      ? "Una interfaz, pequeñas piezas"
                      : "Diseñar es dar claridad")}
                </h2>
                <p>
                  {extraLesson
                    ? extraLesson.intro
                    : activeRoute === 1
                      ? "Un componente es una pieza reutilizable de tu interfaz. Puede ser tan pequeño como un botón o tan completo como una tarjeta de aprendizaje. Al combinar componentes, construimos experiencias que se mantienen coherentes."
                      : "Una buena interfaz no solo se ve bien: ayuda a las personas a entender dónde están, qué pueden hacer y cuál es el siguiente paso. Cada elemento tiene un propósito."}
                </p>
                <h3>01. Empieza por lo importante</h3>
                <p>
                  {extraLesson
                    ? extraLesson.principle
                    : activeRoute === 1
                      ? "Identifica qué partes se repiten en tu interfaz. Cada componente recibe información mediante propiedades y puede tener su propio estado."
                      : "La jerarquía visual guía la mirada. Utiliza tamaño, contraste y espacio para diferenciar lo esencial de lo complementario. Si todo llama la atención, nada destaca."}
                </p>
                <blockquote>
                  <Sparkles size={22} />
                  <div>
                    <b>Llévalo a la práctica</b>
                    <p>
                      Observa una aplicación que uses a diario. ¿Qué elemento ves primero? ¿Por qué
                      crees que está diseñado así?
                    </p>
                  </div>
                </blockquote>
                <h3>02. Construye con intención</h3>
                <p>
                  Empieza con una solución sencilla, prueba cómo funciona y refina los detalles. Lo
                  importante no es hacerlo perfecto al primer intento, sino comprender cada
                  decisión.
                </p>
              </div>
            )}
            {lessonTab === "Ejercicio" && (
              <div className="lesson-copy">
                <h2>De la idea a la práctica</h2>
                <p>
                  {extraLesson?.exercise ??
                    "Piensa en una pantalla de inicio de sesión. Describe sus tres elementos más importantes y cómo los organizarías para guiar al usuario."}
                </p>
                <textarea
                  rows={8}
                  value={exercise}
                  onChange={(e) => setExercise(e.target.value)}
                  placeholder="Escribe tu propuesta y explica tus decisiones…"
                />
                <Button
                  disabled={exercise.trim().length < 20}
                  onClick={() =>
                    notify(
                      "Propuesta registrada en esta sesión. Compárala con los principios de la lección.",
                    )
                  }
                >
                  Registrar mi propuesta <Check size={16} />
                </Button>
                <p className="muted">
                  Escribe al menos 20 caracteres. Este ejercicio es de autoevaluación.
                </p>
              </div>
            )}
            {lessonTab === "Recursos" && (
              <div className="resource-list">
                <h2>Para ir un poco más allá</h2>
                {[
                  [
                    "Guía de diseño de Material",
                    "Principios, patrones y ejemplos",
                    "https://m3.material.io/",
                  ],
                  [
                    "Documentación de React",
                    "Aprende a construir componentes",
                    "https://es.react.dev/learn",
                  ],
                  [
                    "Accesibilidad web · W3C",
                    "Diseño para todas las personas",
                    "https://www.w3.org/WAI/fundamentals/accessibility-intro/es/",
                  ],
                ].map(([name, desc, url]) => (
                  <a href={url} target="_blank" rel="noreferrer" key={name}>
                    <BookOpen size={22} />
                    <div>
                      <h3>{name}</h3>
                      <p>{desc}</p>
                    </div>
                    <ExternalLink size={17} />
                  </a>
                ))}
              </div>
            )}
            {lessonTab === "Mis notas" && (
              <div className="lesson-copy">
                <h2>Tus ideas merecen su espacio</h2>
                <p>
                  Anota lo que te llamó la atención. Las notas se conservan mientras navegas en esta
                  sesión.
                </p>
                <textarea
                  rows={12}
                  placeholder="Hoy descubrí que…"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
                <span className="muted">{notes.length} caracteres · Notas de esta sesión</span>
              </div>
            )}
            <div className="lesson-bottom">
              <Button
                secondary
                disabled={lessonIndex === 0}
                onClick={() => setLessonIndex((i) => i - 1)}
              >
                <ArrowLeft size={16} /> Anterior
              </Button>
              <Button
                disabled={done}
                onClick={() => {
                  setCompleted((prev) => [...prev, lessonKey]);
                  notify("Lección completada. Un nuevo paso en tu camino.");
                }}
              >
                {done ? (
                  <>
                    <CheckCircle2 size={17} /> Lección completada
                  </>
                ) : (
                  <>
                    Marcar como completada <Check size={17} />
                  </>
                )}
              </Button>
              {done && lessonIndex < 2 && (
                <button className="text-button" onClick={() => setLessonIndex((i) => i + 1)}>
                  Siguiente <ArrowRight size={16} />
                </button>
              )}
            </div>
          </section>
          <aside className="lesson-sidebar panel">
            <span className="eyebrow">TU RECORRIDO</span>
            <h3>{routes[activeRoute].title}</h3>
            <div className="row between">
              <span className="muted">Progreso de la ruta</span>
              <b>{currentProgress(activeRoute)}%</b>
            </div>
            <Progress value={currentProgress(activeRoute)} />
            <h4>
              <CheckCircle2 size={16} /> 01. Los fundamentos
            </h4>
            <p className="muted">4 lecciones completadas</p>
            <h4>
              <CheckCircle2 size={16} /> 02. Entender a las personas
            </h4>
            <p className="muted">5 lecciones completadas</p>
            <h4>
              <Play size={16} /> 03. Dale forma a tus ideas
            </h4>
            {lessonTitles.map((title, i) => (
              <button
                key={title}
                className={`module-lesson ${i === lessonIndex ? "selected" : ""}`}
                onClick={() => {
                  setLessonIndex(i);
                  setLessonTab("Lección");
                }}
              >
                {completed.includes(`${activeRoute}-${i}`) ? (
                  <CheckCircle2 size={16} />
                ) : (
                  <span className="lesson-number">{i + 1}</span>
                )}
                {title}
              </button>
            ))}
            <div className="locked-module">
              <LockKeyhole size={16} /> 04. Tu proyecto final
            </div>
            <div className="own-pace">
              <Leaf size={24} />
              <b>A tu ritmo está bien.</b>
              <p>Cada pequeño avance también cuenta.</p>
            </div>
          </aside>
        </div>
      </>
    );
  }
  function Growth() {
    const goalNames = [
      "Completar 3 lecciones de UX/UI",
      "Practicar React durante 30 minutos",
      "Leer un recurso de accesibilidad",
      "Escribir una reflexión de aprendizaje",
      "Avanzar en mi proyecto personal",
    ];
    return (
      <>
        <SectionHeading
          eyebrow="TU CONSTANCIA ESTÁ DEJANDO HUELLA"
          title="Mi crecimiento"
          subtitle="No se trata de ir más rápido. Se trata de seguir avanzando."
        />
        <div className="growth-summary">
          <div>
            <Flame size={25} />
            <strong>7 días</strong>
            <span>aprendiendo sin parar</span>
          </div>
          <div>
            <Clock3 size={25} />
            <strong>12,5 h</strong>
            <span>dedicadas este mes</span>
          </div>
          <div>
            <Target size={25} />
            <strong>{goals.filter(Boolean).length} de 5</strong>
            <span>objetivos semanales</span>
          </div>
          <div>
            <Trophy size={25} />
            <strong>{48 + totalDone}</strong>
            <span>lecciones completadas</span>
          </div>
        </div>
        <section className="panel activity-panel">
          <div className="row between">
            <div>
              <h2>Cada día cuenta</h2>
              <p className="section-description">
                Tu actividad educativa, paso a paso. No representa contribuciones de GitHub.
              </p>
            </div>
            <div className="segmented">
              {["Semana", "Mes", "Año"].map((p) => (
                <button
                  key={p}
                  className={p === period ? "selected" : ""}
                  onClick={() => setPeriod(p)}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
          <div className="activity-months">
            <span>{period === "Año" ? "Enero" : "Lunes"}</span>
            <span>{period === "Año" ? "Abril" : "Miércoles"}</span>
            <span>{period === "Año" ? "Agosto" : "Viernes"}</span>
            <span>{period === "Año" ? "Diciembre" : "Domingo"}</span>
          </div>
          <div className={`activity-grid period-${period}`}>
            {Array.from(
              { length: period === "Año" ? 364 : period === "Mes" ? 140 : 35 },
              (_, i) => (
                <div
                  key={i}
                  className={`heat heat-${(i * 7 + Math.floor(i / 3)) % 5}`}
                  title={`${(i % 7) + 1} actividades educativas · Día ${i + 1}`}
                />
              ),
            )}
          </div>
          <div className="row between activity-foot">
            <span>
              {period === "Año"
                ? "216 días de aprendizaje este año"
                : period === "Mes"
                  ? "18 días activos este mes"
                  : "7 días activos esta semana"}
            </span>
            <span className="row">
              Menos{" "}
              {[0, 1, 2, 3, 4].map((i) => (
                <i className={`heat heat-${i}`} key={i} />
              ))}{" "}
              Más
            </span>
          </div>
        </section>
        <div className="growth-two">
          <section className="panel goal-list">
            <span className="eyebrow">EL SIGUIENTE PASO</span>
            <h2>Objetivos de esta semana</h2>
            <p>{goals.filter(Boolean).length} de 5 completados. Tu esfuerzo se nota.</p>
            {goalNames.map((name, i) => (
              <button
                key={name}
                className={goals[i] ? "checked-goal" : ""}
                onClick={() => setGoals((g) => g.map((v, j) => (j === i ? !v : v)))}
              >
                <span className="checkbox">{goals[i] && <Check size={14} />}</span>
                {name}
              </button>
            ))}
          </section>
          <section className="panel reflection">
            <span className="eyebrow">UN MOMENTO PARA TI</span>
            <h2>¿Qué te llevas de esta semana?</h2>
            <p>Reconocer lo que aprendes también es parte del camino.</p>
            <textarea
              rows={5}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Algo que aprendí, algo que me costó, algo que quiero intentar…"
            />
            <Button secondary onClick={() => notify("Reflexión guardada durante esta sesión.")}>
              Guardar reflexión <Check size={16} />
            </Button>
          </section>
        </div>
        <GrowthMap />
      </>
    );
  }
  function Skills() {
    return (
      <>
        <SectionHeading
          eyebrow="LO QUE SABES, LO QUE ESTÁS CONSTRUYENDO"
          title="Tus habilidades tienen historia."
          subtitle="Cada competencia refleja tu aprendizaje y las evidencias de tu trabajo."
        />
        <div className="skill-explainer">
          {[
            ["En aprendizaje", "Estás explorando y adquiriendo conocimientos.", BookOpen],
            ["Desarrollada", "Has superado las evaluaciones de la habilidad.", ShieldCheck],
            ["Demostrada", "Un proyecto real respalda lo que sabes hacer.", Trophy],
          ].map(([title, desc, Icon], i) => {
            const SkillIcon = Icon as typeof BookOpen;
            return (
              <div key={i} className={`skill-state state-${i}`}>
                <SkillIcon size={23} />
                <h3>{title as string}</h3>
                <p>{desc as string}</p>
              </div>
            );
          })}
        </div>
        <div className="filter-chips">
          {["Todas", "En aprendizaje", "Desarrollada", "Demostrada"].map((t) => (
            <button
              key={t}
              onClick={() => setSkillFilter(t)}
              className={skillFilter === t ? "selected" : ""}
            >
              {t}
            </button>
          ))}
        </div>
        <div className="skills-grid">
          {skills
            .filter((s) => skillFilter === "Todas" || s.state === skillFilter)
            .map((s) => (
              <article className="panel skill-card" key={s.name}>
                <div className="row between">
                  <span className={`stat-icon ${s.state === "Demostrada" ? "green" : "purple"}`}>
                    <s.icon size={22} />
                  </span>
                  <span
                    className={`pill ${s.state === "Demostrada" ? "green-pill" : "purple-pill"}`}
                  >
                    {s.state}
                  </span>
                </div>
                <h2>{s.name}</h2>
                <p>Nivel {s.level.toLowerCase()}</p>
                <div className="skill-evidence">
                  <span>
                    Ruta relacionada<b>{s.route}</b>
                  </span>
                  <span>
                    Evaluaciones superadas<b>{s.tests}</b>
                  </span>
                  <span>
                    Proyectos asociados
                    <b>
                      {s.projects
                        ? `${s.projects} proyectos con evidencia`
                        : "Aún no hay evidencias prácticas"}
                    </b>
                  </span>
                </div>
                <button
                  className="text-button"
                  onClick={() =>
                    s.projects ? go("Mis proyectos") : openLesson(s.name === "React" ? 1 : 0)
                  }
                >
                  {s.projects ? "Ver evidencias" : "Seguir desarrollando"}{" "}
                  <ArrowUpRight size={15} />
                </button>
              </article>
            ))}
        </div>
      </>
    );
  }
  function Projects() {
    return (
      <>
        <SectionHeading
          eyebrow="DE APRENDER A HACER"
          title="Lo que construyes demuestra lo que sabes."
          subtitle="Ideas que tomaron forma. Evidencias de todo lo que eres capaz de hacer."
        >
          <Button onClick={() => setModal("Nuevo proyecto")}>
            <Plus size={16} /> Nuevo proyecto
          </Button>
        </SectionHeading>
        <div className="draft-list">
          {drafts.map((draft, i) => (
            <article className="panel draft-card" key={i}>
              <span className="pill purple-pill">Borrador · En construcción</span>
              <h2>{draft.name}</h2>
              <p>{draft.description}</p>
              <span className="muted">
                Todavía no hay habilidades demostradas: completa tu proyecto para aportar
                evidencias.
              </span>
            </article>
          ))}
        </div>
        <div className="project-grid">
          {completedProjects.map((p, i) => (
            <article className={`project-card project-${i}`} key={p.name}>
              <button className={`project-cover ${p.cover.color}`} onClick={() => setModal(p.name)}>
                <div className="mock-browser">
                  <div className="browser-dots">● ● ●</div>
                  <div className="mock-content">
                    <small>
                      {p.cover.kicker}
                    </small>
                    <strong>{p.cover.label}</strong>
                    <span className="mock-sculpture" />
                    <span>Ideas con espacio para crecer. ↗</span>
                  </div>
                </div>
                <span className="project-open">
                  <ArrowUpRight size={22} />
                </span>
              </button>
              <div className="project-info">
                <div className="row between">
                  <span className="pill green-pill">
                    <Check size={11} /> Completado
                  </span>
                  <span className="muted">{p.date}</span>
                </div>
                <h2>{p.name}</h2>
                <p>{p.description}</p>
                <span className="project-tech">{p.tech.join(" · ")}</span>
                <div className="row between">
                  <span className="muted">
                    Demuestra:{" "}
                    {p.demonstrates}
                  </span>
                  <button className="text-button" onClick={() => setModal(p.name)}>
                    Ver proyecto <ArrowUpRight size={15} />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </>
    );
  }
  function CV() {
    return (
      <>
        <SectionHeading
          eyebrow="TU APRENDIZAJE ABRE PUERTAS"
          title="Tu próximo capítulo profesional."
          subtitle="Convierte tus habilidades y proyectos en una historia que te represente."
        >
          <Button onClick={() => window.print()}>
            <Download size={16} /> Exportar PDF
          </Button>
        </SectionHeading>
        <div className="cv-layout">
          <section className="panel cv-editor">
            <h2>Tu perfil profesional</h2>
            <p className="section-description">La vista previa refleja lo que vas construyendo.</p>
            <label>
              Nombre
              <input value={userName} onChange={(e) => setUserName(e.target.value)} />
            </label>
            <label>
              Apellido
              <input value={surname} onChange={(e) => setSurname(e.target.value)} />
            </label>
            <label>
              Titular profesional
              <input value={headline} onChange={(e) => setHeadline(e.target.value)} />
            </label>
            <label>
              Sobre ti
              <textarea rows={4} value={bio} onChange={(e) => setBio(e.target.value)} />
            </label>
            <div className="profile-tip">
              <ShieldCheck size={20} />
              <p>
                Las habilidades demostradas están respaldadas por proyectos, no solo por lecciones.
              </p>
            </div>
            <Button onClick={() => notify("Perfil actualizado en esta sesión de demostración.")}>
              Actualizar perfil <Check size={16} />
            </Button>
          </section>
          <section className="cv-paper">
            <span className="cv-mark">AM.</span>
            <span className="eyebrow">DISEÑO · DESARROLLO · CURIOSIDAD</span>
            <h1>
              {userName} {surname}
            </h1>
            <p className="cv-role">{headline}</p>
            <div className="cv-contact">Madrid, España · alex.morgan@example.com</div>
            <h3>PERFIL</h3>
            <p>{bio}</p>
            <h3>HABILIDADES CON EVIDENCIA</h3>
            <div className="row">
              <span className="pill green-pill">HTML y CSS</span>
              <span className="pill green-pill">Resolución de problemas</span>
            </div>
            <h3>PROYECTOS SELECCIONADOS</h3>
            <h4>Forma — sitio web de arquitectura</h4>
            <p>
              Diseño y desarrollo de un sitio responsive con HTML, CSS y JavaScript. Abril 2026.
            </p>
            <h4>Focus — aplicación de productividad</h4>
            <p>Aplicación de tareas construida con React. Mayo 2026.</p>
            <h3>FORMACIÓN Y CERTIFICACIONES</h3>
            <h4>Fundamentos de desarrollo web · SkillPath</h4>
            <p>HTML, CSS, JavaScript y diseño responsive · 2026</p>
            <h3>TECNOLOGÍAS</h3>
            <p>HTML5 · CSS3 · JavaScript · React · Figma · Git</p>
            <footer>
              Un perfil en constante evolución. <span>Hecho con SkillPath</span>
            </footer>
          </section>
        </div>
      </>
    );
  }
  if (!platform.session) {
    return (
      <Login
        accounts={platform.accounts}
        onRegister={platform.addAccount}
        onLogin={(session) => {
          platform.setSession(session);
          setUserName(session.name);
          setSurname(session.surname);
          if (session.isNew) {
            setPage("Guía de bienvenida");
          } else {
            platform.setProfile(
              platform.profile ?? {
                area: "fullstack",
                experience: experienceOptions[1],
                goal: goalOptions.fullstack[0],
                time: timeOptions[1],
              },
            );
            setPage("Inicio");
          }
        }}
      />
    );
  }
  const focusMode = page === "Lección" || (page === "Mis rutas" && learningFocus);
  const exitFocus = () => {
    if (page === "Lección") {
      go("Explorar aprendizaje");
      return;
    }
    setLearningFocus(false);
    setLearningKey((key) => key + 1); // vuelve a la lista de «Mis rutas»
    window.scrollTo({ top: 0 });
  };
  return (
    <div className={`app-shell ${focusMode ? "focus-mode" : ""}`}>
      {mobileMenu && <div className="sidebar-overlay" onClick={() => setMobileMenu(false)} />}
      <aside className={`sidebar ${mobileMenu ? "mobile-open" : ""}`}>
        <a
          className="brand"
          href="#"
          onClick={(e) => {
            e.preventDefault();
            go("Inicio");
          }}
        >
          <span className="brand-icon">
            <GitBranch size={25} strokeWidth={2.2} />
          </span>
          skillpath<span className="brand-period">.</span>
        </a>
        <span className="nav-label">TU ESPACIO DE CRECIMIENTO</span>
        <nav>
          {navigation.map((item, i) => (
            <div key={item.name}>
              {i === communityStart && (
                <span className="nav-label discover-label">COMUNIDAD Y OPORTUNIDADES</span>
              )}
              <button
                className={`nav-item ${
                  page === item.name || (item.name === "Certificaciones" && isCertPage(page)) ? "active" : ""
                }`}
                aria-current={page === navTarget(item.name) ? "page" : undefined}
                onClick={() => go(navTarget(item.name))}
              >
                <item.icon size={18} strokeWidth={1.65} />
                <span>{item.name}</span>
                {item.name === "Mis rutas" && (
                  <span className="nav-count">{enrolledRoutes.length}</span>
                )}
                {item.name === "Eventos recomendados" && <i className="nav-new" />}
              </button>
            </div>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <button
            className={`nav-item ${page === "Configuración" ? "active" : ""}`}
            onClick={() => go("Configuración")}
          >
            <Settings size={18} strokeWidth={1.65} />
            Configuración
          </button>
          <button className="profile-button" onClick={() => setModal("Tu perfil")}>
            <span className="avatar">{initials}</span>
            <span>
              <b>{fullName}</b>
              <small>Cuenta personal</small>
            </span>
            <MoreHorizontal size={18} />
          </button>
        </div>
      </aside>
      <div className="main-shell">
        <header className="topbar">
          <div className="row">
            {focusMode && (
              <button className="focus-exit" onClick={exitFocus}>
                <X size={16} /> Salir
              </button>
            )}
            <button
              className="icon-button mobile-toggle"
              aria-label="Abrir navegación"
              onClick={() => setMobileMenu(!mobileMenu)}
            >
              <Menu size={22} />
            </button>
            <span className="breadcrumb">
              Mi espacio <ChevronRight size={13} />{" "}
              <b>{page === "Lección" ? "Aprendiendo" : page}</b>
            </span>
          </div>
          <div className="header-tools">
            <button
              className="header-search"
              aria-haspopup="dialog"
              onClick={() => setPaletteOpen(true)}
            >
              <Search size={16} />
              <span>Buscar en SkillPath</span>
              <kbd>{/Mac|iPhone|iPad/.test(navigator.userAgent) ? "⌘ K" : "Ctrl K"}</kbd>
            </button>
            <span className="header-divider" />
            <span className="streak">
              <Flame size={17} />7 <span>días de racha</span>
            </span>
            <button
              className="icon-button theme-toggle"
              aria-label={theme === "dark" ? "Cambiar a tema claro" : "Cambiar a tema oscuro"}
              title={theme === "dark" ? "Tema claro" : "Tema oscuro"}
              onClick={toggleTheme}
            >
              {theme === "dark" ? <Sun size={19} /> : <Moon size={19} />}
            </button>
            <button
              className="icon-button notification-button"
              aria-label="Notificaciones"
              onClick={() => setModal("Notificaciones")}
            >
              <Bell size={19} />
              <i />
            </button>
            <button
              className="avatar small-avatar"
              aria-label="Ver perfil"
              onClick={() => setModal("Tu perfil")}
            >
              {initials}
            </button>
          </div>
        </header>
        <main key={page} className={`main-content ${page === "Lección" ? "lesson-page" : ""}`}>
          {page === "Inicio" && Dashboard()}
          {page === "Explorar aprendizaje" && Explore()}
          {page === "Mis rutas" && <LearningRoutes key={learningKey} onFocusChange={setLearningFocus} />}
          {page === "Lección" && Lesson()}
          {page === "Mi progreso" && Growth()}
          {page === "Mis habilidades" && Skills()}
          {page === "Mis proyectos" && Projects()}
          {page === "Guía de bienvenida" && (
            <WelcomeChat
              name={userName}
              profile={platform.profile}
              onFinish={(profile) => {
                platform.setProfile(profile);
                notify("¡Tu ruta está lista! Te recomendamos empezar por tu curso actual.");
                go("Inicio");
              }}
            />
          )}
          {page === "Áreas y cursos" && (
            <AreasCourses
              platform={platform}
              notify={notify}
              initialCourseId={courseToOpen}
              openLearningRoute={() => go("Mis rutas")}
            />
          )}
          {page === "Portafolio" && (
            <Portfolio platform={platform} notify={notify} fullName={fullName} cvView={CV()} />
          )}
          {page === "Foro" && <Forum platform={platform} notify={notify} authorName={fullName} />}
          {page === "Eventos recomendados" && <Events platform={platform} notify={notify} />}
          {isCertPage(page) && (
            <div className="tabs cert-tabs" role="tablist" aria-label="Tipo de certificación">
              {(["Certificaciones recomendadas", "Certificaciones afiliadas"] as const).map((tab) => (
                <button
                  key={tab}
                  role="tab"
                  aria-selected={page === tab}
                  className={page === tab ? "selected" : ""}
                  onClick={() => setPage(tab)}
                >
                  {tab === "Certificaciones recomendadas" ? "Recomendadas" : "Afiliadas"}
                </button>
              ))}
            </div>
          )}
          {page === "Certificaciones afiliadas" && <AffiliatedCertifications />}
          {page === "Certificaciones recomendadas" && <RecommendedCertifications notify={notify} />}
          {page === "Configuración" && (
            <>
              <SectionHeading
                eyebrow="A TU MANERA"
                title="Un espacio que se adapta a ti."
                subtitle="Ajusta tus preferencias para aprender con menos distracciones."
              />
              <section className="panel settings-panel">
                <h2>Perfil y preferencias</h2>
                <label>
                  ¿Cómo te llamas?
                  <input value={userName} onChange={(e) => setUserName(e.target.value)} />
                </label>
                <label>
                  Tu objetivo principal
                  <select defaultValue={platform.profile?.goal ?? goalOptions[platform.profile?.area ?? "fullstack"][0]}>
                    {goalOptions[platform.profile?.area ?? "fullstack"].map((goal) => (
                      <option key={goal}>{goal}</option>
                    ))}
                  </select>
                </label>
                <div className="setting-row">
                  <div>
                    <b>Tema oscuro</b>
                    <p>Se recuerda en este navegador.</p>
                  </div>
                  <button
                    className={`toggle ${theme === "dark" ? "on" : ""}`}
                    role="switch"
                    aria-checked={theme === "dark"}
                    aria-label="Tema oscuro"
                    onClick={toggleTheme}
                  >
                    <span />
                  </button>
                </div>
                <h3>Notificaciones de demostración</h3>
                {[
                  "Recordatorios de aprendizaje",
                  "Nuevas rutas recomendadas",
                  "Novedades de eventos",
                ].map((name, i) => (
                  <div className="setting-row" key={name}>
                    <div>
                      <b>{name}</b>
                      <p>Preferencia temporal para esta sesión.</p>
                    </div>
                    <button
                      className={`toggle ${settings[i] ? "on" : ""}`}
                      role="switch"
                      aria-checked={settings[i]}
                      aria-label={name}
                      onClick={() => setSettings((old) => old.map((s, j) => (j === i ? !s : s)))}
                    >
                      <span />
                    </button>
                  </div>
                ))}
                <Button onClick={() => notify("Preferencias actualizadas para esta sesión.")}>
                  Guardar cambios <Check size={16} />
                </Button>
                <p className="muted demo-note">
                  Prototipo de SkillPath con datos ficticios. No se almacena información al cerrar o
                  recargar.
                </p>
                <button className="btn secondary sp-logout" onClick={logout}>
                  Cerrar sesión <LogOut size={16} />
                </button>
              </section>
            </>
          )}
          <footer className="main-footer">
            <span>Prototipo con datos de ejemplo.</span>
            <span>SkillPath © {new Date().getFullYear()}</span>
          </footer>
        </main>
      </div>
      {paletteOpen && <CommandPalette items={paletteItems()} onClose={() => setPaletteOpen(false)} />}
      {toast && (
        <div role="status" className="toast">
          <span>
            <Check size={17} />
          </span>
          {toast}
          <button aria-label="Cerrar mensaje" onClick={() => setToast("")}>
            <X size={15} />
          </button>
        </div>
      )}
      {modal && (
        <div className="modal-overlay" onClick={() => setModal(null)}>
          <section
            className="modal"
            role="dialog"
            aria-modal="true"
            aria-label={modal}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="modal-close icon-button"
              aria-label="Cerrar"
              onClick={() => setModal(null)}
            >
              <X size={20} />
            </button>
            <span className="modal-symbol">
              <Sparkles size={27} />
            </span>
            <span className="eyebrow">TU CAMINO EN SKILLPATH</span>
            <h2>{modal}</h2>
            {modal === "Notificaciones" ? (
              <>
                <div className="notification-item">
                  <CheckCircle2 size={23} />
                  <div>
                    <b>Un nuevo hito en tu camino</b>
                    <p>Ya completaste tu primera semana de aprendizaje constante.</p>
                    <small>Hoy · hace 2 horas</small>
                  </div>
                </div>
                <div className="notification-item">
                  <Compass size={23} />
                  <div>
                    <b>Una ruta que conecta contigo</b>
                    <p>Descubre «IA para potenciar tus ideas».</p>
                    <button
                      className="text-button"
                      onClick={() => {
                        setModal(null);
                        go("Explorar aprendizaje");
                      }}
                    >
                      Explorar ruta <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              </>
            ) : modal === "Tu perfil" ? (
              <>
                <div className="profile-modal">
                  <span className="avatar">{initials}</span>
                  <h3>{fullName}</h3>
                  <p>Explorador de habilidades · Nivel 4</p>
                </div>
                <p>
                  Tu objetivo: convertirte en diseñador de producto, aprendiendo y construyendo a tu
                  ritmo.
                </p>
                <Button
                  onClick={() => {
                    setModal(null);
                    go("Portafolio");
                  }}
                >
                  Ver mi perfil profesional <ArrowUpRight size={16} />
                </Button>
                <button className="btn secondary sp-logout" onClick={logout}>
                  Cerrar sesión <LogOut size={16} />
                </button>
              </>
            ) : modal === "Nuevo proyecto" ? (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const data = new FormData(e.currentTarget);
                  setDrafts((old) => [
                    ...old,
                    {
                      name: String(data.get("name")),
                      description: String(data.get("description")),
                    },
                  ]);
                  notify("Borrador creado en esta sesión. Sigue desarrollando tu idea.");
                  setModal(null);
                  go("Mis proyectos");
                }}
              >
                <label>
                  Nombre del proyecto
                  <input name="name" required placeholder="Una idea que quiero construir" />
                </label>
                <label>
                  ¿Qué vas a crear?
                  <textarea
                    name="description"
                    required
                    rows={4}
                    placeholder="Describe el problema que quieres resolver…"
                  />
                </label>
                <Button>
                  Crear borrador <Plus size={16} />
                </Button>
              </form>
            ) : (
              <>
                <p>
                  {modal === "Tu primer producto"
                    ? "Tu próximo destino: crear un producto que combine diseño y desarrollo. Continúa la ruta de UX/UI para preparar tu proyecto final."
                    : modal === "Diseño UX/UI"
                      ? "Estás dando forma a nuevas experiencias. Has completado el 64 % de tu ruta."
                      : modal === "HTML y CSS"
                        ? "Habilidad demostrada con dos proyectos prácticos. Has construido interfaces responsive y accesibles."
                        : modal === "Tu punto de partida"
                          ? "Todo comenzó con tu curiosidad. Te uniste a SkillPath el 12 de abril de 2026."
                          : "Una conquista de tu camino. Este proyecto demuestra tus habilidades para transformar ideas en experiencias reales."}
                </p>
                <div className="modal-evidence">
                  <ShieldCheck size={22} />
                  <div>
                    <b>Evidencias de tu crecimiento</b>
                    <p>
                      {modal.includes("Forma") || modal.includes("sitio")
                        ? "HTML · CSS · Diseño responsive"
                        : "Aprendizaje, práctica y construcción"}
                    </p>
                  </div>
                </div>
                <Button
                  onClick={() => {
                    setModal(null);
                    modal === "Tu primer producto" ? openLesson(0) : go("Mis proyectos");
                  }}
                >
                  {modal === "Tu primer producto" ? "Seguir mi camino" : "Explorar mis proyectos"}{" "}
                  <ArrowRight size={16} />
                </Button>
              </>
            )}
          </section>
        </div>
      )}
    </div>
  );
}
export default App;
