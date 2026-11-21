export type Evidence = {
  id: string;
  title: string;
  kind: "Curso" | "Certificación" | "Proyecto";
  description: string;
  skills: string[];
  origin: string;
  verified?: boolean;
};

export type Vacancy = {
  id: "general" | "frontend" | "network";
  title: string;
  organization: string;
  requirements: string[];
  summary: string;
};

export const profileEvidence: Evidence[] = [
  { id: "react", title: "React para interfaces", kind: "Curso", description: "Componentes, estado y construcción de interfaces reutilizables.", skills: ["React", "JavaScript", "Git"], origin: "SkillPath · Completado" },
  { id: "network", title: "Networking Basics", kind: "Certificación", description: "Fundamentos de redes, protocolos y seguridad.", skills: ["Redes", "Cisco", "Protocolos", "Seguridad de redes"], origin: "Cisco Networking Academy · Registrada", verified: false },
  { id: "backend-project", title: "API de tareas", kind: "Proyecto", description: "API REST para organizar tareas y estados de trabajo.", skills: ["Node.js", "REST", "SQL"], origin: "Proyecto personal" },
];

export const vacancies: Vacancy[] = [
  { id: "general", title: "Perfil general", organization: "Vista completa", requirements: [], summary: "Estudiante autodidacta con interés en construir productos digitales claros, accesibles y útiles." },
  { id: "frontend", title: "Desarrollador/a Frontend Junior", organization: "Vacante de demostración", requirements: ["HTML", "CSS", "JavaScript", "React", "Diseño responsive", "Git"], summary: "Desarrollador/a frontend en formación, con práctica en interfaces accesibles y responsive construidas con HTML, CSS, JavaScript y React." },
  { id: "network", title: "Administrador/a de redes Junior", organization: "Vacante de demostración", requirements: ["Redes", "Cisco", "Protocolos", "Seguridad de redes"], summary: "Profesional en formación con fundamentos de redes, protocolos y prácticas de seguridad para apoyar la operación de infraestructura." },
];
