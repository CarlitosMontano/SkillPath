export type CatalogCourse = {
  id: string;
  title: string;
  description: string;
  category: string;
  level: "Principiante" | "Intermedio";
  duration: string;
  modules: number;
  skills: string[];
  status: "En progreso" | "Disponible" | "Completado" | "Próximamente";
  featured?: boolean;
};

export const catalogCourses: CatalogCourse[] = [
  { id: "fullstack-ai", title: "Desarrollador/a Full Stack con IA", description: "Construye aplicaciones web y usa IA como apoyo en tu proceso.", category: "Desarrollo frontend", level: "Principiante", duration: "48 h", modules: 8, skills: ["HTML", "CSS", "JavaScript", "React"], status: "En progreso", featured: true },
  { id: "product-ux", title: "Diseño de Producto UI/UX", description: "Investiga, diseña y valida experiencias digitales centradas en personas.", category: "Diseño de producto", level: "Principiante", duration: "36 h", modules: 6, skills: ["UX research", "Figma", "Accesibilidad"], status: "En progreso", featured: true },
  { id: "node-api", title: "APIs con Node y Express", description: "Diseña servicios web claros, seguros y fáciles de mantener.", category: "Desarrollo backend", level: "Intermedio", duration: "24 h", modules: 5, skills: ["Node.js", "REST", "Autenticación"], status: "Disponible" },
  { id: "sql", title: "SQL para decisiones", description: "Consulta, organiza y analiza datos para responder preguntas reales.", category: "Bases de datos", level: "Principiante", duration: "18 h", modules: 4, skills: ["SQL", "Modelado", "Consultas"], status: "Disponible" },
  { id: "data", title: "Fundamentos de ciencia de datos", description: "Explora datos, encuentra patrones y comunícalos con claridad.", category: "Ciencia de datos", level: "Principiante", duration: "30 h", modules: 6, skills: ["Python", "Análisis", "Visualización"], status: "Disponible" },
  { id: "cyber", title: "Ciberseguridad esencial", description: "Reconoce riesgos y aplica prácticas de seguridad digital.", category: "Redes y ciberseguridad", level: "Principiante", duration: "20 h", modules: 5, skills: ["Redes", "Seguridad", "Protocolos"], status: "Disponible" },
  { id: "programming", title: "Pensamiento computacional", description: "Resuelve problemas paso a paso antes de escribir código.", category: "Fundamentos de programación", level: "Principiante", duration: "16 h", modules: 4, skills: ["Algoritmos", "Lógica", "Depuración"], status: "Disponible" },
  { id: "business", title: "Ejecutivo/a de Desarrollo de Negocios B2B", description: "Identifica oportunidades y construye relaciones de valor.", category: "Negocios", level: "Intermedio", duration: "32 h", modules: 6, skills: ["Ventas", "Estrategia", "Negociación"], status: "Próximamente" },
  { id: "marketing", title: "Performance Marketing y Crecimiento", description: "Mide, experimenta y mejora campañas de crecimiento.", category: "Marketing", level: "Intermedio", duration: "28 h", modules: 5, skills: ["Métricas", "Campañas", "Experimentación"], status: "Próximamente" },
  { id: "assistant", title: "Asistente Virtual Ejecutivo/a", description: "Organiza operaciones, comunicación y prioridades ejecutivas.", category: "Productividad", level: "Principiante", duration: "22 h", modules: 5, skills: ["Organización", "Comunicación", "Automatización"], status: "Próximamente" },
];
