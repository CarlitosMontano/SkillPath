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
/** Cada sesión empieza como usuario nuevo: ningún curso tiene avance. */
export const initialCourseProgress: Record<string, number> = {};

export const experienceOptions = ["Estoy empezando desde cero", "Tengo algunas bases", "Ya tengo experiencia práctica"] as const;
export const goalOptions: Record<AreaKey, string[]> = {
  fullstack: ["Conseguir mi primer empleo en tecnología", "Crear mis propios proyectos", "Trabajar de forma remota", "Aplicar la IA en mi trabajo"],
  finanzas: ["Ordenar mis finanzas personales", "Entender cómo invertir", "Aprender trading con responsabilidad", "Trabajar en el sector financiero"],
};
export const timeOptions = ["Menos de 3 horas por semana", "Entre 3 y 6 horas por semana", "Más de 6 horas por semana"] as const;

export type Reply = {
  id: number;
  author: string;
  initials: string;
  text: string;
  minutesAgo: number;
  /** Comentario escrito por la persona que usa la app en esta sesión. */
  mine?: boolean;
};
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
  replies: Reply[];
};
export const forumCategories = ["Desarrollo", "Finanzas", "Trading", "Portafolio", "Certificaciones", "Empleo remoto"] as const;
export type ForumCategory = (typeof forumCategories)[number];

export const initialPosts: Post[] = [
  {
    id: 1,
    author: "Lucía R.",
    initials: "LR",
    category: "Desarrollo",
    type: "Avance",
    title: "¡Terminé mi primera landing page responsive!",
    body: "Después de tres semanas en la ruta de HTML y CSS logré que mi página se vea bien en móvil, tablet y escritorio. Lo que más me costó fue entender Grid: al principio usaba Flexbox para todo y el diseño se rompía en pantallas medianas. Al final dividí la página en áreas con grid-template-areas y todo encajó. ¿Algún consejo para seguir con JavaScript sin perderme?",
    likes: 24,
    minutesAgo: 35,
    replies: [
      { id: 1, author: "Mateo G.", initials: "MG", text: "¡Felicidades! Para JavaScript te recomiendo empezar manipulando el DOM de tu misma landing: un menú que se abre, un formulario que valida. Así practicas sobre algo que ya conoces.", minutesAgo: 30 },
      { id: 2, author: "Sofía L.", initials: "SL", text: "Grid me pasó igual. Un truco: dibuja las áreas en papel antes de escribir el CSS.", minutesAgo: 25 },
      { id: 3, author: "Diego A.", initials: "DA", text: "Se ve muy bien. Revisa el contraste del botón principal con alguna herramienta de accesibilidad, es un detalle que valoran mucho en entrevistas.", minutesAgo: 12 },
    ],
  },
  {
    id: 2,
    author: "Andrés P.",
    initials: "AP",
    category: "Trading",
    type: "Pregunta",
    title: "¿Cómo calculan el tamaño de posición?",
    body: "Estoy en el curso de gestión de riesgo y no me queda claro cómo decidir cuánto arriesgar por operación en la cuenta simulada. Leí sobre la regla del 1 % pero no sé cómo aplicarla cuando el stop está más lejos o más cerca. ¿Alguien puede explicarlo con un ejemplo?",
    likes: 11,
    minutesAgo: 120,
    replies: [
      { id: 4, author: "Paula M.", initials: "PM", text: "Ejemplo: cuenta simulada de 1.000. Arriesgas el 1 % = 10. Si tu stop está a 0,50 del precio de entrada, el tamaño es 10 / 0,50 = 20 unidades. Si el stop está más lejos, compras menos unidades.", minutesAgo: 100 },
      { id: 5, author: "Iván R.", initials: "IR", text: "Clave: primero defines dónde va el stop según el análisis, y después calculas el tamaño. Nunca al revés.", minutesAgo: 80 },
      { id: 6, author: "Andrés P.", initials: "AP", text: "¡Ahora sí lo entendí! Gracias a los dos.", minutesAgo: 60 },
      { id: 7, author: "Moderación", initials: "SP", text: "Recordatorio: el contenido del foro es educativo y no constituye asesoramiento financiero.", minutesAgo: 55 },
    ],
  },
  {
    id: 3,
    author: "Valeria C.",
    initials: "VC",
    category: "Portafolio",
    type: "Proyecto",
    title: "Comparto mi portafolio para recibir feedback",
    body: "Armé mi portafolio con tres proyectos: un clon de tienda en línea, una app del clima que consume una API pública y un dashboard de gastos. Cada proyecto tiene capturas, el problema que resuelve y lo que aprendí. ¿Qué mejorarían en la presentación? Me preocupa que se vea muy plano.",
    likes: 31,
    minutesAgo: 240,
    replies: [
      { id: 8, author: "Tomás V.", initials: "TV", text: "Muy ordenado. Yo pondría primero el dashboard: es el que muestra más lógica.", minutesAgo: 220 },
      { id: 9, author: "Carla H.", initials: "CH", text: "Añade un enlace a la demo en vivo de cada proyecto, no solo al repositorio. A quien revisa le ahorra tiempo.", minutesAgo: 200 },
      { id: 10, author: "Lucía R.", initials: "LR", text: "Me encanta la sección de «qué aprendí». Podrías agregar una línea con la tecnología principal debajo de cada título.", minutesAgo: 150 },
    ],
  },
  {
    id: 4,
    author: "Jorge S.",
    initials: "JS",
    category: "Empleo remoto",
    type: "Pregunta",
    title: "¿Qué piden en entrevistas para trabajo remoto junior?",
    body: "Quiero postular a mi primer trabajo remoto como desarrollador frontend. ¿Qué tipo de pruebas técnicas les tocaron? ¿Son en vivo o para hacer en casa? También quiero saber cómo demostrar que puedo trabajar de forma autónoma sin experiencia previa.",
    likes: 18,
    minutesAgo: 600,
    replies: [
      { id: 11, author: "Natalia O.", initials: "NO", text: "En mi caso fue una prueba para casa de 48 horas: maquetar una pantalla desde un diseño y consumir una API. Luego una llamada para explicar mis decisiones.", minutesAgo: 540 },
      { id: 12, author: "Ernesto B.", initials: "EB", text: "La autonomía se demuestra con proyectos propios bien documentados: README claro, commits ordenados y un tablero de tareas.", minutesAgo: 500 },
      { id: 13, author: "Sofía L.", initials: "SL", text: "Practica explicar tu código en voz alta. En remoto la comunicación escrita y oral pesa tanto como lo técnico.", minutesAgo: 420 },
    ],
  },
  {
    id: 5,
    author: "Camila F.",
    initials: "CF",
    category: "Finanzas",
    type: "Avance",
    title: "Mi primer presupuesto mensual completo",
    body: "Gracias al curso de fundamentos financieros registré todos mis gastos de un mes. Descubrí que gastaba más de lo que creía en suscripciones y en comida a domicilio. Armé un presupuesto 50/30/20 y este mes ya logré separar un pequeño fondo de emergencia.",
    likes: 15,
    minutesAgo: 1440,
    replies: [
      { id: 14, author: "Hugo T.", initials: "HT", text: "¡Qué buen avance! Las suscripciones son el gasto invisible por excelencia.", minutesAgo: 1300 },
      { id: 15, author: "Paula M.", initials: "PM", text: "Te recomiendo automatizar la transferencia al fondo de emergencia el día que cobras. Así no depende de la fuerza de voluntad.", minutesAgo: 1200 },
      { id: 16, author: "Camila F.", initials: "CF", text: "¡Buena idea! Lo voy a configurar esta semana.", minutesAgo: 1100 },
    ],
  },
  {
    id: 6,
    author: "Raúl N.",
    initials: "RN",
    category: "Certificaciones",
    type: "Pregunta",
    title: "¿Vale la pena una certificación cloud siendo principiante?",
    body: "Estoy dudando entre empezar una certificación de fundamentos cloud o terminar primero la ruta de backend. No sé si una certificación sin experiencia práctica tiene valor para conseguir el primer empleo.",
    likes: 9,
    minutesAgo: 2880,
    replies: [
      { id: 17, author: "Ernesto B.", initials: "EB", text: "Los fundamentos cloud son cortos y ayudan a entender conceptos. Pero lo que más pesa es poder mostrar un proyecto desplegado.", minutesAgo: 2700 },
      { id: 18, author: "Natalia O.", initials: "NO", text: "Yo haría ambas cosas: termina la ruta y despliega un proyecto en la nube. Así la certificación tiene contexto.", minutesAgo: 2500 },
      { id: 19, author: "Tomás V.", initials: "TV", text: "Revisa en las ofertas que te interesan si la piden. En muchas empresas junior no es requisito.", minutesAgo: 2400 },
    ],
  },
  {
    id: 7,
    author: "Mariana Q.",
    initials: "MQ",
    category: "Desarrollo",
    type: "Proyecto",
    title: "Hice una app de tareas con React y almacenamiento local",
    body: "Mi primer proyecto en React: una lista de tareas con filtros, edición en línea y guardado en el navegador. Aprendí a separar componentes y a manejar el estado con useState y useEffect. El código está en mi GitHub, ¡acepto sugerencias!",
    likes: 22,
    minutesAgo: 3600,
    replies: [
      { id: 20, author: "Diego A.", initials: "DA", text: "¡Muy limpio! Para el siguiente paso prueba useReducer, te va a ordenar mucho la lógica de las tareas.", minutesAgo: 3400 },
      { id: 21, author: "Mateo G.", initials: "MG", text: "Agrega pruebas con Vitest a los filtros, es un plus enorme en el portafolio.", minutesAgo: 3300 },
      { id: 22, author: "Carla H.", initials: "CH", text: "Me gustó el detalle de la edición en línea. ¿Lo hiciste accesible con teclado?", minutesAgo: 3200 },
    ],
  },
  {
    id: 8,
    author: "Felipe D.",
    initials: "FD",
    category: "Empleo remoto",
    type: "Avance",
    title: "¡Conseguí mis primeras prácticas remotas!",
    body: "Después de cuatro meses de estudio y 25 postulaciones, me aceptaron en unas prácticas remotas de soporte y desarrollo web. Lo que más valoraron fue mi portafolio en GitHub y que había participado en un hackatón. Gracias a la comunidad por el feedback.",
    likes: 27,
    minutesAgo: 5000,
    replies: [
      { id: 23, author: "Lucía R.", initials: "LR", text: "¡Felicidades! Muy inspirador.", minutesAgo: 4900 },
      { id: 24, author: "Jorge S.", initials: "JS", text: "¿Qué fue lo que más te preguntaron en la entrevista?", minutesAgo: 4800 },
      { id: 25, author: "Felipe D.", initials: "FD", text: "Me pidieron explicar un proyecto de principio a fin y cómo resolví un error difícil. Prepárate esa historia.", minutesAgo: 4700 },
      { id: 26, author: "Valeria C.", initials: "VC", text: "¡Enhorabuena! Ver estos logros motiva muchísimo.", minutesAgo: 4600 },
    ],
  },
  {
    id: 9,
    author: "Daniela K.",
    initials: "DK",
    category: "Finanzas",
    type: "Pregunta",
    title: "¿Cómo empiezo a invertir con poco dinero?",
    body: "Ya tengo mi fondo de emergencia y quiero aprender a invertir pequeñas cantidades. ¿Qué conceptos debería entender primero antes de tomar cualquier decisión? Busco recursos educativos, no recomendaciones de qué comprar.",
    likes: 7,
    minutesAgo: 7200,
    replies: [
      { id: 27, author: "Hugo T.", initials: "HT", text: "Empieza por entender interés compuesto, diversificación y horizonte de tiempo. El curso de fundamentos lo explica muy bien.", minutesAgo: 7000 },
      { id: 28, author: "Iván R.", initials: "IR", text: "Aprende también sobre comisiones: con montos pequeños pueden comerse buena parte de la ganancia.", minutesAgo: 6900 },
      { id: 29, author: "Moderación", initials: "SP", text: "Recordatorio: el contenido del foro es educativo y no constituye asesoramiento financiero.", minutesAgo: 6850 },
    ],
  },
];

export type EventItem = {
  id: string;
  name: string;
  date: string;
  modality: "Presencial" | "Online" | "Híbrido";
  location: string;
  category: EventCategory;
  description: string;
  /** Página externa real relacionada con el evento (organizador o plataforma de eventos). */
  url: string;
  source: string;
};
export const eventCategories = ["Hackatón", "Reunión tecnológica", "Charla", "Taller", "Feria de empleo", "Finanzas y trading"] as const;
export type EventCategory = (typeof eventCategories)[number];

export const events: EventItem[] = [
  { id: "ev1", name: "Hackatón: soluciones con IA para tu comunidad", date: "2026-12-05", modality: "Híbrido", location: "Presencial y en línea", category: "Hackatón", description: "48 horas para crear en equipo una solución que use IA para un problema real. Mentorías, premios y demo final ante un jurado.", url: "https://devpost.com/hackathons", source: "Devpost" },
  { id: "ev2", name: "Meetup de desarrolladores web", date: "2026-12-10", modality: "Presencial", location: "Grupos locales de Meetup", category: "Reunión tecnológica", description: "Charlas cortas, networking y demostraciones de proyectos de la comunidad web local.", url: "https://www.meetup.com/topics/web-development/", source: "Meetup" },
  { id: "ev3", name: "Charla: cómo armar un portafolio que destaque", date: "2026-12-12", modality: "Online", location: "Transmisión en línea", category: "Charla", description: "Qué buscan las personas que contratan, cómo presentar tus proyectos y errores comunes que conviene evitar.", url: "https://www.eventbrite.com/d/online/ux-design/", source: "Eventbrite" },
  { id: "ev4", name: "Taller práctico de Git y GitHub", date: "2026-12-17", modality: "Online", location: "Microsoft Reactor", category: "Taller", description: "Ramas, pull requests y buenas prácticas de colaboración, paso a paso y con ejercicios guiados.", url: "https://developer.microsoft.com/en-us/reactor/", source: "Microsoft Reactor" },
  { id: "ev5", name: "Feria de empleo tecnológico y remoto", date: "2027-01-20", modality: "Híbrido", location: "Ferias en línea y presenciales", category: "Feria de empleo", description: "Conoce empresas que contratan perfiles junior y practica tu presentación personal de un minuto.", url: "https://www.eventbrite.com/d/online/career-fair/", source: "Eventbrite" },
  { id: "ev6", name: "Introducción a la gestión de riesgo en trading", date: "2026-12-14", modality: "Online", location: "Grupos de inversión en Meetup", category: "Finanzas y trading", description: "Sesión educativa sobre tamaño de posición y control de pérdidas. No es asesoramiento financiero.", url: "https://www.meetup.com/topics/investing/", source: "Meetup" },
  { id: "ev7", name: "Club de lectura: finanzas personales", date: "2027-01-08", modality: "Presencial", location: "Grupos de finanzas personales", category: "Finanzas y trading", description: "Conversamos sobre hábitos de ahorro y presupuesto a partir de un libro introductorio.", url: "https://www.meetup.com/topics/personal-finance/", source: "Meetup" },
  { id: "ev8", name: "Temporada de hackatones estudiantiles", date: "2027-02-06", modality: "Híbrido", location: "Sedes universitarias y en línea", category: "Hackatón", description: "Hackatones de fin de semana pensados para estudiantes: equipos mixtos, talleres para principiantes y mentores.", url: "https://mlh.io/", source: "Major League Hacking" },
  { id: "ev9", name: "Comunidad Google Developer Groups", date: "2026-12-19", modality: "Presencial", location: "Capítulos GDG de tu ciudad", category: "Reunión tecnológica", description: "Encuentros sobre desarrollo web, móvil, nube e IA organizados por la comunidad de Google Developers.", url: "https://developers.google.com/community/gdg", source: "Google for Developers" },
  { id: "ev10", name: "Competencias de ciencia de datos", date: "2027-01-15", modality: "Online", location: "Kaggle", category: "Taller", description: "Practica análisis y aprendizaje automático con conjuntos de datos reales y aprende de los notebooks de la comunidad.", url: "https://www.kaggle.com/competitions", source: "Kaggle" },
  { id: "ev11", name: "Eventos tecnológicos en línea", date: "2026-12-22", modality: "Online", location: "Transmisiones en vivo", category: "Charla", description: "Agenda de charlas y webinars sobre programación, IA y producto digital abiertos al público.", url: "https://www.eventbrite.com/d/online/tech-events/", source: "Eventbrite" },
  { id: "ev12", name: "Semana de educación financiera", date: "2027-02-12", modality: "Online", location: "Khan Academy", category: "Finanzas y trading", description: "Lecciones gratuitas sobre ahorro, crédito, impuestos e inversión para aprender a tu ritmo.", url: "https://www.khanacademy.org/college-careers-more/personal-finance", source: "Khan Academy" },
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
  { id: "af6", name: "Certificado en Contabilidad para Emprendedores", institution: "Centro de Formación Aliado Demo (ficticio)", institutionType: "Centro de formación aliado", area: "finanzas", duration: "8 semanas", modality: "Online", level: "Principiante" },
  { id: "af7", name: "Programa de Ciberseguridad Esencial", institution: "Instituto Técnico Demo (ficticio)", institutionType: "Instituto", area: "fullstack", duration: "3 meses", modality: "Híbrido", level: "Principiante" },
  { id: "af5", name: "Certificado en Análisis de Mercados", institution: "Instituto Técnico Demo (ficticio)", institutionType: "Instituto", area: "finanzas", duration: "12 semanas", modality: "Híbrido", level: "Intermedio" },
];

export type RecommendedCert = {
  id: string;
  provider: string;
  name: string;
  description: string;
  level: "Principiante" | "Intermedio" | "Avanzado";
  area: AreaKey;
  /** Página oficial o relacionada del proveedor. */
  url: string;
  cost: "Gratuito" | "De pago" | "Gratis para auditar";
};
// Recomendaciones orientativas. Nombres y disponibilidad pueden cambiar: se debe consultar el sitio oficial.
export const recommendedCerts: RecommendedCert[] = [
  { id: "rc1", provider: "Anthropic", name: "Cursos de Anthropic Academy sobre Claude", description: "Formación para aprender a construir con modelos de Claude y su API: prompts, herramientas y agentes.", level: "Intermedio", area: "fullstack", url: "https://www.anthropic.com/learn", cost: "Gratuito" },
  { id: "rc2", provider: "AWS", name: "AWS Certified Cloud Practitioner", description: "Fundamentos de la nube de AWS: servicios principales, seguridad, precios y soporte.", level: "Principiante", area: "fullstack", url: "https://aws.amazon.com/certification/certified-cloud-practitioner/", cost: "De pago" },
  { id: "rc3", provider: "Microsoft", name: "Azure Fundamentals (AZ-900)", description: "Conceptos base de la nube, servicios de Azure, seguridad y gobernanza.", level: "Principiante", area: "fullstack", url: "https://learn.microsoft.com/en-us/credentials/certifications/azure-fundamentals/", cost: "De pago" },
  { id: "rc4", provider: "Google", name: "Certificados de carrera de Google", description: "Programas introductorios en análisis de datos, UX, soporte de TI, ciberseguridad y más.", level: "Principiante", area: "fullstack", url: "https://grow.google/certificates/", cost: "De pago" },
  { id: "rc5", provider: "edX", name: "Cursos de ciencias de la computación", description: "Cursos universitarios en línea sobre fundamentos de programación, algoritmos y estructuras de datos.", level: "Principiante", area: "fullstack", url: "https://www.edx.org/learn/computer-science", cost: "Gratis para auditar" },
  { id: "rc6", provider: "freeCodeCamp", name: "Responsive Web Design", description: "Certificación gratuita con cinco proyectos prácticos de HTML y CSS.", level: "Principiante", area: "fullstack", url: "https://www.freecodecamp.org/learn/2022/responsive-web-design/", cost: "Gratuito" },
  { id: "rc7", provider: "Cisco Networking Academy", name: "Introducción a la ciberseguridad", description: "Amenazas comunes, protección de datos y buenas prácticas de seguridad digital.", level: "Principiante", area: "fullstack", url: "https://www.netacad.com/courses/introduction-to-cybersecurity", cost: "Gratuito" },
  { id: "rc8", provider: "Coursera · Meta", name: "Meta Front-End Developer", description: "Certificado profesional con HTML, CSS, JavaScript y React, y un proyecto final para el portafolio.", level: "Principiante", area: "fullstack", url: "https://www.coursera.org/professional-certificates/meta-front-end-developer", cost: "De pago" },
  { id: "rc9", provider: "Coursera · Google", name: "Google Data Analytics", description: "Limpieza, análisis y visualización de datos con hojas de cálculo, SQL y Tableau.", level: "Principiante", area: "fullstack", url: "https://www.coursera.org/professional-certificates/google-data-analytics", cost: "De pago" },
  { id: "rc10", provider: "edX", name: "Cursos de finanzas", description: "Cursos de universidades sobre finanzas corporativas, personales e inversión.", level: "Principiante", area: "finanzas", url: "https://www.edx.org/learn/finance", cost: "Gratis para auditar" },
  { id: "rc11", provider: "Coursera · Yale", name: "Financial Markets", description: "Curso introductorio de Yale sobre mercados, riesgo, comportamiento financiero e instituciones.", level: "Principiante", area: "finanzas", url: "https://www.coursera.org/learn/financial-markets-global", cost: "Gratis para auditar" },
  { id: "rc12", provider: "Coursera · Macquarie", name: "Excel Skills for Business", description: "Especialización práctica de Excel: fórmulas, tablas dinámicas y modelos para negocios.", level: "Principiante", area: "finanzas", url: "https://www.coursera.org/specializations/excel", cost: "De pago" },
  { id: "rc13", provider: "Coursera · Wharton", name: "Introduction to Financial Accounting", description: "Fundamentos de contabilidad financiera: estados financieros, activos y pasivos.", level: "Principiante", area: "finanzas", url: "https://www.coursera.org/learn/wharton-accounting", cost: "Gratis para auditar" },
  { id: "rc14", provider: "Google Skillshop", name: "Certificaciones de Google Ads y Analytics", description: "Formación gratuita en publicidad digital y medición de resultados para negocios.", level: "Principiante", area: "finanzas", url: "https://skillshop.withgoogle.com/", cost: "Gratuito" },
];

export type Account = { name: string; surname: string; email: string; password: string };
/**
 * Única cuenta de acceso del prototipo. Cada inicio de sesión empieza como usuario nuevo.
 * Solo sirve para la demostración: en la versión real las credenciales se validarán en un servidor seguro.
 */
export const demoAccount: Account = { name: "", surname: "", email: "demo@skillpath.com", password: "Demo1234" };
