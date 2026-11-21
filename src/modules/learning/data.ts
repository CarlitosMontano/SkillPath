export type Question = {
  id: string;
  prompt: string;
  options: string[];
  answer: number;
  explanation: string;
};

export type Lesson = {
  id: string;
  title: string;
  description: string;
  content: string;
  example: string;
  questions: Question[];
};

export const htmlLessons: Lesson[] = [
  {
    id: "html-structure",
    title: "Estructura del documento",
    description: "Comprende las piezas básicas que dan forma a una página HTML.",
    content: "Todo documento HTML comienza declarando su tipo. Después, html agrupa el documento; head contiene metadatos y body contiene el contenido visible.",
    example: "<!doctype html>\n<html>\n  <head><title>Mi página</title></head>\n  <body><h1>Hola</h1></body>\n</html>",
    questions: [
      { id: "s1", prompt: "¿Qué sección contiene el contenido visible de una página?", options: ["head", "body", "title", "doctype"], answer: 1, explanation: "body contiene el contenido que las personas ven e interactúan." },
      { id: "s2", prompt: "¿Para qué sirve <!doctype html>?", options: ["Crear un enlace", "Declarar HTML moderno", "Agregar una imagen", "Crear un título"], answer: 1, explanation: "La declaración indica al navegador que use el estándar HTML moderno." },
      { id: "s3", prompt: "¿Dónde va normalmente la etiqueta title?", options: ["En body", "En head", "Dentro de h1", "Después de html"], answer: 1, explanation: "title es metadato del documento y pertenece a head." },
      { id: "s4", prompt: "¿Cuál es el elemento raíz?", options: ["body", "head", "html", "main"], answer: 2, explanation: "html envuelve todo el documento." },
    ],
  },
  {
    id: "html-text",
    title: "Títulos, párrafos y énfasis",
    description: "Organiza el texto para que sea claro, jerárquico y semántico.",
    content: "Los encabezados h1 a h6 expresan jerarquía. Los párrafos agrupan ideas y las etiquetas strong y em aportan énfasis con significado.",
    example: "<h1>Mi portafolio</h1>\n<p>Aprendo <strong>construyendo</strong> proyectos.</p>",
    questions: [
      { id: "t1", prompt: "¿Qué etiqueta representa el título principal de una página?", options: ["h1", "p", "strong", "title"], answer: 0, explanation: "h1 representa el encabezado principal del contenido." },
      { id: "t2", prompt: "¿Cuál etiqueta comunica importancia semántica?", options: ["div", "strong", "span", "br"], answer: 1, explanation: "strong marca contenido de especial importancia." },
      { id: "t3", prompt: "¿Qué elemento agrupa una idea en texto corrido?", options: ["p", "h3", "img", "a"], answer: 0, explanation: "p representa un párrafo." },
      { id: "t4", prompt: "¿Cuál es una jerarquía correcta?", options: ["h1, h2, h3", "h4, h1, h2", "p, h1, h2", "strong, h1"], answer: 0, explanation: "La jerarquía debe avanzar de lo general a lo particular." },
    ],
  },
  {
    id: "html-lists-links",
    title: "Listas y enlaces",
    description: "Conecta contenidos y organiza información relacionada.",
    content: "Las listas ul reúnen elementos sin orden y ol presenta una secuencia. Los enlaces se crean con a y el atributo href indica el destino.",
    example: "<ul>\n  <li>HTML</li>\n  <li>CSS</li>\n</ul>\n<a href=\"/perfil\">Ver perfil</a>",
    questions: [
      { id: "l1", prompt: "¿Qué etiqueta crea una lista sin orden?", options: ["ol", "ul", "li", "dl"], answer: 1, explanation: "ul significa unordered list." },
      { id: "l2", prompt: "¿Qué atributo define el destino de un enlace?", options: ["src", "alt", "href", "target"], answer: 2, explanation: "href contiene la URL o ruta de destino." },
      { id: "l3", prompt: "¿Qué etiqueta representa cada elemento de una lista?", options: ["ul", "ol", "li", "a"], answer: 2, explanation: "li significa list item." },
      { id: "l4", prompt: "¿Cuándo usarías ol?", options: ["Para una secuencia de pasos", "Para una imagen", "Para una cita", "Para un formulario"], answer: 0, explanation: "ol comunica que el orden de los elementos importa." },
    ],
  },
  {
    id: "html-images",
    title: "Imágenes y accesibilidad",
    description: "Incluye imágenes que todas las personas puedan comprender.",
    content: "img inserta una imagen. El atributo alt ofrece una alternativa textual, necesaria cuando la imagen comunica información o no puede cargarse.",
    example: "<img src=\"perfil.jpg\" alt=\"Alex sonriendo frente a su escritorio\" />",
    questions: [
      { id: "i1", prompt: "¿Qué atributo describe una imagen?", options: ["href", "alt", "name", "action"], answer: 1, explanation: "alt aporta una descripción alternativa." },
      { id: "i2", prompt: "¿Qué atributo indica el archivo de imagen?", options: ["src", "alt", "href", "role"], answer: 0, explanation: "src identifica el recurso de imagen." },
      { id: "i3", prompt: "¿Qué alt es mejor para una foto de perfil?", options: ["imagen", "foto.jpg", "Alex sonriendo", "decoración"], answer: 2, explanation: "Un alt útil comunica el contenido o propósito de la imagen." },
      { id: "i4", prompt: "¿Para quién beneficia alt?", options: ["Solo buscadores", "Personas con lector de pantalla y fallos de carga", "Solo diseñadores", "Nadie"], answer: 1, explanation: "Es una alternativa para quien no puede ver la imagen." },
    ],
  },
  {
    id: "html-forms",
    title: "Formularios básicos",
    description: "Solicita información de forma clara y accesible.",
    content: "form agrupa controles para capturar datos. Cada input necesita una etiqueta label asociada; button permite enviar la acción.",
    example: "<form>\n  <label>Email <input type=\"email\" /></label>\n  <button>Enviar</button>\n</form>",
    questions: [
      { id: "f1", prompt: "¿Qué elemento agrupa los controles de envío?", options: ["form", "label", "input", "option"], answer: 0, explanation: "form representa un formulario." },
      { id: "f2", prompt: "¿Qué elemento nombra un campo para las personas?", options: ["label", "legend", "div", "span"], answer: 0, explanation: "label conecta el texto descriptivo con el control." },
      { id: "f3", prompt: "¿Qué tipo de input valida un correo en el navegador?", options: ["text", "email", "number", "url"], answer: 1, explanation: "type=email aporta validación y teclado adecuados." },
      { id: "f4", prompt: "¿Qué control ejecuta el envío?", options: ["button", "h1", "img", "a"], answer: 0, explanation: "button representa una acción interactiva." },
    ],
  },
];

export const uxLessons: Lesson[] = [
  {
    id: "ux-hierarchy",
    title: "Jerarquía visual",
    description: "Guía la atención hacia lo importante sin sobrecargar la interfaz.",
    content: "La jerarquía visual ordena la información usando tamaño, contraste, posición y espacio. Una persona debe reconocer primero la acción o contenido principal.",
    example: "Título principal\nDescripción breve\n[ Acción principal ]   Acción secundaria",
    questions: [
      { id: "uxh1", prompt: "¿Qué ayuda a priorizar una acción principal?", options: ["Mismo tamaño para todo", "Contraste y posición", "Más texto", "Eliminar espacios"], answer: 1, explanation: "El contraste y la posición ayudan a reconocer qué es prioritario." },
      { id: "uxh2", prompt: "Si todos los elementos llaman la atención, ¿qué ocurre?", options: ["La jerarquía mejora", "Nada destaca con claridad", "La pantalla carga más rápido", "Se vuelve más accesible"], answer: 1, explanation: "La atención se dispersa cuando no hay prioridades visuales." },
      { id: "uxh3", prompt: "¿Qué recurso aporta separación entre grupos relacionados?", options: ["Espacio en blanco", "Texto más largo", "Más iconos", "Más colores"], answer: 0, explanation: "El espacio en blanco agrupa y separa contenido de manera comprensible." },
    ],
  },
  {
    id: "ux-typography",
    title: "Tipografía",
    description: "Crea una lectura cómoda y consistente en cada pantalla.",
    content: "La tipografía comunica jerarquía y tono. Una escala limitada de tamaños y pesos permite que títulos, texto y ayudas tengan funciones reconocibles.",
    example: "Título: 28 px · peso 700\nSubtítulo: 16 px · peso 500\nCuerpo: 14 px · peso 400",
    questions: [
      { id: "uxt1", prompt: "¿Qué favorece una escala tipográfica limitada?", options: ["Consistencia y lectura", "Más ruido visual", "Más pantallas", "Menos contenido"], answer: 0, explanation: "Una escala acotada hace que la jerarquía sea reconocible." },
      { id: "uxt2", prompt: "¿Qué debe diferenciar un título del texto de cuerpo?", options: ["Su función y jerarquía", "Solo el idioma", "El borde", "El navegador"], answer: 0, explanation: "Tamaño y peso apoyan el rol distinto de cada texto." },
      { id: "uxt3", prompt: "¿Cuál es una práctica de lectura responsable?", options: ["Contraste legible", "Texto gris muy claro", "Párrafos sin espacios", "Usar solo mayúsculas"], answer: 0, explanation: "El contraste suficiente es esencial para una lectura cómoda." },
    ],
  },
  {
    id: "ux-color",
    title: "Color con intención",
    description: "Usa el color para comunicar estados y orientar decisiones.",
    content: "El color debe complementar la información, no ser su único canal. Los estados de éxito, alerta y error necesitan texto o iconos que expliquen su significado.",
    example: "✓ Guardado correctamente\n! Revisa los campos obligatorios",
    questions: [
      { id: "uxc1", prompt: "¿El color debe ser el único indicador de un error?", options: ["Sí", "No, debe acompañarse de texto o icono", "Solo en móvil", "Solo en formularios"], answer: 1, explanation: "La información no debe depender únicamente de la percepción del color." },
      { id: "uxc2", prompt: "¿Para qué es útil el color en una interfaz?", options: ["Comunicar estados", "Ocultar información", "Reemplazar etiquetas", "Aumentar texto"], answer: 0, explanation: "Puede reforzar estados, prioridades y retroalimentación." },
      { id: "uxc3", prompt: "¿Qué debe revisarse al elegir color para texto?", options: ["Contraste con el fondo", "Solo la tendencia", "El tamaño de pantalla", "La hora"], answer: 0, explanation: "El contraste permite que el contenido siga siendo legible." },
    ],
  },
  {
    id: "ux-spacing",
    title: "Espaciado",
    description: "Construye ritmo y relaciones claras entre los elementos.",
    content: "El espaciado crea agrupaciones visuales. Elementos relacionados deben estar más cerca entre sí que de otros grupos, manteniendo una escala repetible.",
    example: "Título\n8 px\nDescripción\n24 px\nSiguiente sección",
    questions: [
      { id: "uxs1", prompt: "¿Qué comunica cercanía entre elementos?", options: ["Que están relacionados", "Que son errores", "Que son enlaces", "Que están bloqueados"], answer: 0, explanation: "La proximidad es un principio para agrupar información relacionada." },
      { id: "uxs2", prompt: "¿Qué mejora una escala de espaciado repetible?", options: ["Consistencia", "Cantidad de colores", "Número de botones", "Velocidad de internet"], answer: 0, explanation: "Una escala evita medidas arbitrarias y da ritmo a la interfaz." },
      { id: "uxs3", prompt: "¿Cuál es el objetivo del espaciado?", options: ["Respiración y estructura", "Llenar toda la pantalla", "Ocultar acciones", "Reducir contraste"], answer: 0, explanation: "El espacio facilita escaneo, comprensión y foco." },
    ],
  },
];

export const stageNames = [
  ["HTML", "5 lecciones"], ["CSS", "6 lecciones"], ["JavaScript", "6 lecciones"],
  ["Git y GitHub", "3 lecciones"], ["React y TypeScript", "5 lecciones"],
  ["Backend y bases de datos", "5 lecciones"], ["IA y automatización", "5 lecciones"], ["Producción", "3 lecciones"],
] as const;

export const projectCriteria = ["Incluye una etiqueta title", "Contiene un único h1", "Las imágenes incluyen alt", "Contiene una lista", "Contiene un enlace", "Contiene un formulario"];

export type LearningProgress = {
  passed: string[];
  project: boolean;
  examAttempts: number;
  examPassed: boolean;
};

const learningStorageKey = "skillpath-learning-v1";
const initialLearningProgress: LearningProgress = {
  passed: ["html-structure", "html-text"],
  project: false,
  examAttempts: 0,
  examPassed: false,
};

export function readLearningProgress(): LearningProgress {
  try {
    const saved = JSON.parse(localStorage.getItem(learningStorageKey) || "{}");
    return { ...initialLearningProgress, ...saved };
  } catch {
    return initialLearningProgress;
  }
}
