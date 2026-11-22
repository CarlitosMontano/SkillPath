// Datos simulados del prototipo SkillPath.
// Nada de este archivo proviene de una fuente real: son ejemplos para demostrar la interfaz.

export type AreaKey = "fullstack" | "finanzas";
export type CourseStatus = "Disponible" | "En progreso" | "Próximamente";

export type Course = {
  id: string;
  area: AreaKey;
  name: string;
  description: string;
  level: "Principiante" | "Intermedio" | "Avanzado";
  hours: number;
  modules: string[];
  comingSoon?: boolean;
  /** Si existe, el curso abre el módulo interactivo de "Mis rutas". */
  opensLearningRoute?: boolean;
};

export const areas: Record<AreaKey, { name: string; short: string; description: string }> = {
  fullstack: {
    name: "Desarrollo de software Full Stack con IA",
    short: "Full Stack con IA",
    description:
      "Construye aplicaciones web completas, del navegador a la base de datos, e integra inteligencia artificial de forma responsable.",
  },
  finanzas: {
    name: "Finanzas y Trading",
    short: "Finanzas y Trading",
    description:
      "Comprende cómo funcionan los mercados, gestiona el riesgo y practica en entornos simulados. Contenido educativo, no asesoramiento financiero.",
  },
};

export const courses: Course[] = [
  { id: "fs-html", area: "fullstack", name: "HTML y CSS", description: "Estructura semántica, estilos y diseño responsive para tus primeras páginas.", level: "Principiante", hours: 12, modules: ["Estructura del documento", "Texto y enlaces", "Imágenes accesibles", "Formularios", "Flexbox y Grid"], opensLearningRoute: true },
  { id: "fs-js", area: "fullstack", name: "JavaScript", description: "Variables, funciones, eventos y manipulación del DOM para dar vida a tus interfaces.", level: "Principiante", hours: 16, modules: ["Tipos y variables", "Funciones", "Arreglos y objetos", "Eventos y DOM", "Asincronía"] },
  { id: "fs-react", area: "fullstack", name: "React", description: "Componentes, estado y efectos para construir interfaces modernas y reutilizables.", level: "Intermedio", hours: 14, modules: ["Componentes y props", "Estado", "Efectos", "Formularios", "Rutas"] },
  { id: "fs-ts", area: "fullstack", name: "TypeScript", description: "Tipos que previenen errores y hacen tu código más fácil de mantener.", level: "Intermedio", hours: 8, modules: ["Tipos básicos", "Interfaces", "Genéricos", "TypeScript con React"] },
  { id: "fs-backend", area: "fullstack", name: "Backend y APIs", description: "Crea servidores y APIs REST para conectar tu interfaz con datos reales.", level: "Intermedio", hours: 14, modules: ["HTTP y REST", "Node.js", "Rutas y controladores", "Autenticación", "Pruebas"] },
  { id: "fs-db", area: "fullstack", name: "Bases de datos", description: "Modela, consulta y protege la información de tus aplicaciones.", level: "Intermedio", hours: 10, modules: ["Modelado", "SQL", "Relaciones", "Bases NoSQL"] },
  { id: "fs-git", area: "fullstack", name: "Git y GitHub", description: "Versiona tu trabajo, colabora en equipo y publica tus proyectos.", level: "Principiante", hours: 5, modules: ["Commits", "Ramas", "Pull requests", "Publicar tu portafolio"] },
  { id: "fs-ai", area: "fullstack", name: "Inteligencia artificial y automatización", description: "Integra modelos de lenguaje y automatiza tareas con criterio y responsabilidad.", level: "Intermedio", hours: 12, modules: ["Prompts efectivos", "APIs de IA", "Automatizaciones", "Ética y límites"], comingSoon: true },
  { id: "fs-deploy", area: "fullstack", name: "Despliegue y buenas prácticas", description: "Publica tus aplicaciones con calidad: rendimiento, seguridad y accesibilidad.", level: "Avanzado", hours: 8, modules: ["Despliegue", "Variables de entorno", "Rendimiento", "Accesibilidad"], comingSoon: true },
  { id: "fi-basics", area: "finanzas", name: "Fundamentos financieros", description: "Presupuesto, ahorro, interés compuesto e inflación explicados con ejemplos.", level: "Principiante", hours: 6, modules: ["Ingresos y gastos", "Interés compuesto", "Inflación", "Metas financieras"] },
  { id: "fi-markets", area: "finanzas", name: "Mercados y activos", description: "Acciones, bonos, divisas, materias primas y criptoactivos: qué son y cómo se comportan.", level: "Principiante", hours: 8, modules: ["Tipos de activos", "Cómo funciona un mercado", "Brokers y comisiones", "Liquidez y volatilidad"] },
  { id: "fi-risk", area: "finanzas", name: "Gestión de riesgo", description: "Tamaño de posición, diversificación y límites de pérdida para proteger tu capital.", level: "Intermedio", hours: 6, modules: ["Riesgo y recompensa", "Tamaño de posición", "Stop loss", "Diversificación"] },
  { id: "fi-fundamental", area: "finanzas", name: "Análisis fundamental", description: "Lee estados financieros y evalúa el valor de una empresa.", level: "Intermedio", hours: 10, modules: ["Estados financieros", "Ratios clave", "Valoración", "Contexto macroeconómico"] },
  { id: "fi-technical", area: "finanzas", name: "Análisis técnico", description: "Gráficos, tendencias, soportes y resistencias con una mirada crítica.", level: "Intermedio", hours: 10, modules: ["Velas y gráficos", "Tendencias", "Soportes y resistencias", "Indicadores"] },
  { id: "fi-psychology", area: "finanzas", name: "Psicología del trading", description: "Reconoce sesgos, gestiona emociones y construye disciplina.", level: "Intermedio", hours: 5, modules: ["Sesgos cognitivos", "Miedo y codicia", "Diario de operaciones"], comingSoon: true },
  { id: "fi-sim", area: "finanzas", name: "Simulación y práctica", description: "Practica estrategias en un entorno simulado sin arriesgar dinero real.", level: "Avanzado", hours: 12, modules: ["Cuenta simulada", "Plan de trading", "Evaluar resultados"], comingSoon: true },
];

/** Progreso inicial simulado (porcentaje) por curso. */
export const initialCourseProgress: Record<string, number> = {
  "fs-html": 40,
  "fs-js": 15,
  "fi-basics": 25,
};

export const experienceOptions = ["Estoy empezando desde cero", "Tengo algunas bases", "Ya tengo experiencia práctica"] as const;
export const goalOptions: Record<AreaKey, string[]> = {
  fullstack: ["Conseguir mi primer empleo en tecnología", "Crear mis propios proyectos", "Trabajar de forma remota", "Aplicar la IA en mi trabajo"],
  finanzas: ["Ordenar mis finanzas personales", "Entender cómo invertir", "Aprender trading con responsabilidad", "Trabajar en el sector financiero"],
};
export const timeOptions = ["Menos de 3 horas por semana", "Entre 3 y 6 horas por semana", "Más de 6 horas por semana"] as const;

export type Post = {
  id: number;
  author: string;
  initials: string;
  category: ForumCategory;
  type: "Avance" | "Proyecto" | "Pregunta";
  title: string;
  body: string;
  likes: number;
  liked?: boolean;
  minutesAgo: number;
  replies: { author: string; text: string; minutesAgo: number }[];
};
export const forumCategories = ["Desarrollo", "Finanzas", "Trading", "Portafolio", "Certificaciones", "Empleo remoto"] as const;
export type ForumCategory = (typeof forumCategories)[number];

export const initialPosts: Post[] = [
  { id: 1, author: "Lucía R.", initials: "LR", category: "Desarrollo", type: "Avance", title: "¡Terminé mi primera landing page responsive!", body: "Después de tres semanas en la ruta de HTML y CSS logré que mi página se vea bien en móvil. Lo que más me costó fue entender Grid. ¿Algún consejo para seguir con JavaScript?", likes: 24, minutesAgo: 35, replies: [{ author: "Diego M.", text: "¡Felicidades! Empieza manipulando el DOM con proyectos pequeños, como una lista de tareas.", minutesAgo: 20 }] },
  { id: 2, author: "Andrés P.", initials: "AP", category: "Trading", type: "Pregunta", title: "¿Cómo calculan el tamaño de posición?", body: "Estoy en el curso de gestión de riesgo y no me queda claro cómo decidir cuánto arriesgar por operación en la cuenta simulada.", likes: 11, minutesAgo: 90, replies: [{ author: "Sofía L.", text: "Una regla común en el curso es no arriesgar más de un pequeño porcentaje del capital simulado por operación. Revisa la lección 2.", minutesAgo: 60 }, { author: "Marco T.", text: "A mí me ayudó llevar un diario de operaciones desde el principio.", minutesAgo: 45 }] },
  { id: 3, author: "Valeria C.", initials: "VC", category: "Portafolio", type: "Proyecto", title: "Comparto mi portafolio para recibir feedback", body: "Armé mi portafolio con tres proyectos: un clon de tienda, una app del clima y un dashboard. ¿Qué mejorarían en la presentación?", likes: 31, minutesAgo: 240, replies: [] },
  { id: 4, author: "Jorge S.", initials: "JS", category: "Empleo remoto", type: "Pregunta", title: "¿Qué piden en entrevistas para trabajo remoto junior?", body: "Quiero postular a mi primer trabajo remoto como desarrollador frontend. ¿Qué tipo de pruebas técnicas les tocaron?", likes: 18, minutesAgo: 600, replies: [{ author: "Lucía R.", text: "A mí me pidieron una prueba práctica en React y explicar un proyecto de mi portafolio.", minutesAgo: 500 }] },
  { id: 5, author: "Camila F.", initials: "CF", category: "Finanzas", type: "Avance", title: "Mi primer presupuesto mensual completo", body: "Gracias al curso de fundamentos financieros registré todos mis gastos de un mes. Descubrí que gastaba más de lo que creía en suscripciones.", likes: 15, minutesAgo: 1440, replies: [] },
  { id: 6, author: "Raúl N.", initials: "RN", category: "Certificaciones", type: "Pregunta", title: "¿Vale la pena una certificación cloud siendo principiante?", body: "Estoy dudando entre empezar una certificación de fundamentos cloud o terminar primero la ruta de backend.", likes: 9, minutesAgo: 2880, replies: [{ author: "Sofía L.", text: "Yo terminaría primero la ruta: así entiendes mejor lo que la certificación evalúa.", minutesAgo: 2000 }] },
];

export type EventItem = {
  id: string;
  name: string;
  date: string;
  modality: "Presencial" | "Online" | "Híbrido";
  location: string;
  category: EventCategory;
  description: string;
  /** Sin fuente real conectada: la ficha completa se marca como "Próximamente". */
  hasDetails: boolean;
};
export const eventCategories = ["Hackatón", "Reunión tecnológica", "Charla", "Taller", "Feria de empleo", "Finanzas y trading"] as const;
export type EventCategory = (typeof eventCategories)[number];

export const events: EventItem[] = [
  { id: "ev1", name: "Hackatón SkillPath: Soluciones con IA", date: "2026-12-05", modality: "Híbrido", location: "Campus de ejemplo · y online", category: "Hackatón", description: "48 horas para crear en equipo una solución que use IA para un problema de tu comunidad.", hasDetails: true },
  { id: "ev2", name: "Meetup de desarrolladores web", date: "2026-12-10", modality: "Presencial", location: "Espacio de coworking de ejemplo", category: "Reunión tecnológica", description: "Charlas cortas, networking y demostraciones de proyectos de la comunidad.", hasDetails: true },
  { id: "ev3", name: "Charla: Cómo armar un portafolio que destaque", date: "2026-12-12", modality: "Online", location: "Enlace disponible próximamente", category: "Charla", description: "Qué buscan las personas que contratan y cómo presentar tus proyectos.", hasDetails: false },
  { id: "ev4", name: "Taller práctico de Git y GitHub", date: "2026-12-17", modality: "Online", location: "Enlace disponible próximamente", category: "Taller", description: "Ramas, pull requests y buenas prácticas de colaboración, paso a paso.", hasDetails: true },
  { id: "ev5", name: "Feria de empleo tecnológico y remoto", date: "2027-01-20", modality: "Híbrido", location: "Centro de convenciones de ejemplo", category: "Feria de empleo", description: "Conoce empresas que contratan perfiles junior y prepara tu presentación personal.", hasDetails: false },
  { id: "ev6", name: "Introducción a la gestión de riesgo en trading", date: "2026-12-14", modality: "Online", location: "Enlace disponible próximamente", category: "Finanzas y trading", description: "Sesión educativa sobre tamaño de posición y control de pérdidas. No es asesoramiento financiero.", hasDetails: true },
  { id: "ev7", name: "Club de lectura: finanzas personales", date: "2027-01-08", modality: "Presencial", location: "Biblioteca de ejemplo", category: "Finanzas y trading", description: "Conversamos sobre hábitos de ahorro y presupuesto a partir de un libro introductorio.", hasDetails: false },
];

export type AffiliatedCert = {
  id: string;
  name: string;
  institution: string;
  institutionType: "Universidad local" | "Instituto" | "Centro de formación aliado";
  area: AreaKey;
  duration: string;
  modality: "Presencial" | "Online" | "Híbrido";
  level: "Principiante" | "Intermedio" | "Avanzado";
};
export const affiliatedCerts: AffiliatedCert[] = [
  { id: "af1", name: "Diplomado en Desarrollo Web Full Stack", institution: "Universidad de Ejemplo (ficticia)", institutionType: "Universidad local", area: "fullstack", duration: "6 meses", modality: "Híbrido", level: "Intermedio" },
  { id: "af2", name: "Certificado en Fundamentos de Programación", institution: "Instituto Técnico Demo (ficticio)", institutionType: "Instituto", area: "fullstack", duration: "3 meses", modality: "Online", level: "Principiante" },
  { id: "af3", name: "Programa de IA aplicada al desarrollo", institution: "Centro de Formación Aliado Demo (ficticio)", institutionType: "Centro de formación aliado", area: "fullstack", duration: "10 semanas", modality: "Online", level: "Avanzado" },
  { id: "af4", name: "Diplomado en Finanzas Personales e Inversión", institution: "Universidad de Ejemplo (ficticia)", institutionType: "Universidad local", area: "finanzas", duration: "4 meses", modality: "Presencial", level: "Principiante" },
  { id: "af5", name: "Certificado en Análisis de Mercados", institution: "Instituto Técnico Demo (ficticio)", institutionType: "Instituto", area: "finanzas", duration: "12 semanas", modality: "Híbrido", level: "Intermedio" },
];

export type RecommendedCert = {
  id: string;
  provider: string;
  name: string;
  description: string;
  level: "Principiante" | "Intermedio" | "Avanzado";
  area: AreaKey;
};
// Recomendaciones orientativas. Nombres y disponibilidad pueden cambiar: se debe consultar el sitio oficial.
export const recommendedCerts: RecommendedCert[] = [
  { id: "rc1", provider: "Anthropic", name: "Cursos de Anthropic Academy sobre Claude", description: "Formación para aprender a construir con modelos de Claude y su API.", level: "Intermedio", area: "fullstack" },
  { id: "rc2", provider: "AWS", name: "AWS Certified Cloud Practitioner", description: "Fundamentos de la nube de AWS: servicios, seguridad y costos.", level: "Principiante", area: "fullstack" },
  { id: "rc3", provider: "Microsoft", name: "Certificaciones de fundamentos de Azure", description: "Conceptos base de la nube e IA en el ecosistema de Microsoft.", level: "Principiante", area: "fullstack" },
  { id: "rc4", provider: "Google", name: "Certificados de carrera de Google", description: "Programas introductorios en áreas como análisis de datos, UX o soporte de TI.", level: "Principiante", area: "fullstack" },
  { id: "rc5", provider: "edX", name: "Cursos de introducción a la informática", description: "Cursos universitarios en línea sobre fundamentos de programación.", level: "Principiante", area: "fullstack" },
  { id: "rc6", provider: "edX", name: "Cursos de introducción a las finanzas", description: "Cursos en línea de universidades sobre finanzas e inversión.", level: "Principiante", area: "finanzas" },
  { id: "rc7", provider: "freeCodeCamp", name: "Responsive Web Design", description: "Certificación gratuita con proyectos prácticos de HTML y CSS.", level: "Principiante", area: "fullstack" },
];

export type Account = { name: string; surname: string; email: string; password: string; isNew: boolean };
/**
 * Cuentas de prueba del prototipo. Solo sirven para la demostración:
 * en la versión real las credenciales se validarán en un servidor seguro, nunca en el navegador.
 */
export const demoAccounts: Account[] = [
  { name: "Alex", surname: "Morgan", email: "estudiante@skillpath.app", password: "SkillPath2026", isNew: false },
  { name: "Sam", surname: "Rivera", email: "nuevo@skillpath.app", password: "Bienvenida2026", isNew: true },
];
