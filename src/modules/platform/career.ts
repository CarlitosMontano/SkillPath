import type { AreaKey } from "./data";

/** «tech»: carreras de sistemas o informática (portafolio = GitHub). «general»: cualquier otra (carpeta personal). */
export type Track = "tech" | "general";

/** Quita tildes y mayúsculas para comparar texto escrito por la persona. */
export const normalize = (text: string) =>
  text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim();

const techKeywords = [
  "sistema",
  "informatic",
  "software",
  "computacion",
  "computador",
  "ciencia de datos",
  "data science",
  "datos",
  "ciberseguridad",
  "seguridad informatica",
  "redes de computadoras",
  "redes y",
  "telecomunicacion",
  "desarrollo de software",
  "desarrollo web",
  "desarrollo de aplicaciones",
  "desarrollador",
  "programacion",
  "programador",
  "tecnologia de la informacion",
  "tecnologias de la informacion",
  "ti ",
  "devops",
  "inteligencia artificial",
  "machine learning",
  "web",
  "videojuegos",
  "robotica",
  "mecatronica",
  "electronica",
];

const financeKeywords = ["finanza", "contab", "econom", "administracion", "negocio", "comercio", "banca", "actuari", "auditor", "marketing"];

/** Respuestas cortas que por sí solas ya indican una carrera de sistemas. */
const techExact = ["sistemas", "redes", "desarrollo", "ti", "it", "programacion", "computacion"];

export function trackForCareer(career: string): Track {
  const clean = normalize(career);
  const text = ` ${clean} `;
  return techExact.includes(clean) || techKeywords.some((keyword) => text.includes(keyword)) ? "tech" : "general";
}

/** Área de SkillPath sugerida por la carrera; `null` si conviene preguntarla. */
export function areaForCareer(career: string): AreaKey | null {
  if (trackForCareer(career) === "tech") return "fullstack";
  const text = normalize(career);
  return financeKeywords.some((keyword) => text.includes(keyword)) ? "finanzas" : null;
}

/** Atajos que aparecen en la guía; también se puede escribir cualquier otra carrera. */
export const careerSuggestions = [
  "Ingeniería de Sistemas",
  "Informática",
  "Ciencia de Datos",
  "Ciberseguridad",
  "Administración de Empresas",
  "Contabilidad y Finanzas",
  "Psicología",
  "Diseño Gráfico",
  "Derecho",
  "Comunicación",
];
