# SkillPath — Contexto del proyecto y propuesta de alcance del MVP

> **Copia en este repositorio.** El original vive en el repositorio del backend (`aethelynsoftware-glitch/SkillPath`, archivo `proposal.md`). Las referencias a «esta carpeta», `alcance.md`, `TechStack.md`, `user-stories.md`, `plan-implementacion.md` y `apps/` apuntan a ese repositorio. Las referencias al prototipo describen este repositorio (`SkillPath1`).

> **Propósito de este documento.** Reunir en un solo lugar el contexto verificado de SkillPath para que cualquier persona o agente pueda generar resúmenes estratégicos (pitch ante jurados, aliados, instituciones o inversionistas) **sin inventar datos**.
>
> **Última actualización:** 22 de noviembre de 2026.
> **Texto original conservado:** la propuesta de alcance anterior se mantiene íntegra en el [Anexo A](#anexo-a--propuesta-original-de-alcance-del-mvp-texto-conservado). Solo se bajó un nivel a sus encabezados para que quede dentro de este documento.

## Fuentes revisadas

| Fuente | Ubicación | Qué contiene |
|---|---|---|
| Documentación del MVP | Esta carpeta: `proposal.md` (Anexo A), `alcance.md`, `user-stories.md`, `plan-implementacion.md` y `TechStack.md` | Definición del MVP orientado a *analista de datos junior*, historias de usuario, plan y stack. |
| Código base del backend | Esta carpeta: `apps/api`, `apps/web` y `packages/shared` (repositorio `aethelynsoftware-glitch/SkillPath`, un único commit «Primer commit») | Andamiaje: API Express con `/health`, esquema Prisma y una web que solo comprueba la conexión. |
| Prototipo navegable | Repositorio `CarlitosMontano/SkillPath1` (ramas `main`, `Ostin` y `Fernando`) | Interfaz React generada con Figma Make, con datos simulados y sin backend. |
| Requerimientos del equipo | Instrucciones de actualización de este contexto (noviembre de 2026) | Lista de módulos esperados y backlog de revisiones R1–R8. |

**Sobre el estado del prototipo.** Lo descrito como «rama `Fernando` (local)» existe y funciona en la copia local del prototipo, pero **todavía no tiene commit ni está subido** al repositorio del equipo. En el repositorio remoto, `main` y `Ostin` no lo incluyen. La rama remota `Fernando` solo contiene el cambio de paleta de colores.

## Convenciones

- **Funcionalidades:** `[IMPLEMENTADO]` (existe y funciona en una rama compartida del repositorio) · `[EN DESARROLLO]` (existe parcialmente o solo en trabajo local sin integrar) · `[PLANIFICADO]` (definido, sin código) · `[VISIÓN FUTURA]`.
- **Revisiones del backlog:** `[POR DIAGNOSTICAR]` · `[PLANIFICADO]` · `[EN DESARROLLO]` · `[CORREGIDO]`.
- **Afirmaciones de impacto, mercado o monetización:** `[VALIDADO]` · `[HIPÓTESIS]`. A la fecha **no existe ninguna afirmación validada con usuarios reales**.
- **Datos faltantes:** `[PENDIENTE: …]`. Se recogen en [Preguntas pendientes](#preguntas-pendientes).
- **Prototipo:** salvo que se indique otra cosa, todas las funciones del prototipo usan **datos simulados en memoria**. Se pierden al recargar la página, excepto el avance de «Mis rutas», que se guarda en `localStorage`.

## Índice

1. [Descripción y estado actual](#1-descripción-y-estado-actual)
2. [Stack tecnológico](#2-stack-tecnológico)
3. [Funcionalidades y su estado](#3-funcionalidades-y-su-estado)
4. [Alcance del MVP](#4-alcance-del-mvp)
5. [Alianzas y certificaciones](#5-alianzas-y-certificaciones)
6. [Público objetivo y mercado](#6-público-objetivo-y-mercado)
7. [Competidores y diferenciación](#7-competidores-y-diferenciación)
8. [Equipo y recursos](#8-equipo-y-recursos)
9. [Monetización y sostenibilidad](#9-monetización-y-sostenibilidad)
10. [Riesgos y mitigaciones](#10-riesgos-y-mitigaciones)
11. [Impacto: esperado vs. por validar](#11-impacto-esperado-vs-por-validar)
12. [Backlog de revisiones](#12-backlog-de-revisiones)
13. [Lineamientos de comunicación](#13-lineamientos-de-comunicación)
14. [Guía para resúmenes estratégicos](#14-guía-para-resúmenes-estratégicos)
15. [Inconsistencias detectadas](#15-inconsistencias-detectadas)
- [Preguntas pendientes](#preguntas-pendientes)
- [Anexo A — Propuesta original de alcance del MVP](#anexo-a--propuesta-original-de-alcance-del-mvp-texto-conservado)

---

## 1. Descripción y estado actual

SkillPath es un **mentor digital** para personas que quieren ingresar al mundo tecnológico o al trabajo remoto. Orienta a la persona según sus intereses y le recomienda un área, cursos con una ruta ordenada, certificaciones, proyectos para su portafolio, una comunidad y eventos. El problema que aborda, según `alcance.md`, es la sobrecarga de recursos sin un orden claro, que lleva a perder tiempo y dinero en contenidos poco relevantes.

**Etapa real: prototipo.** No hay MVP desplegado ni usuarios de prueba documentados.

| Pieza | Estado verificado |
|---|---|
| Prototipo de interfaz (`SkillPath1`) | Navegable en local (`npm run dev`), con datos simulados y sin backend ni persistencia real. |
| Backend (`apps/api`) | Andamiaje: solo responde `GET /health`. El esquema de base de datos y la migración inicial están definidos, pero no hay endpoints de negocio. |
| Web del backend (`apps/web`) | Solo muestra si la API responde. No contiene las pantallas del producto. |
| Usuarios de prueba | `[PENDIENTE: ¿se ha probado con usuarios reales?]` No consta en ninguna fuente. |
| Despliegue | No consta ningún despliegue. Railway está planificado (`TechStack.md`). |

## 2. Stack tecnológico

### 2.1 En uso

| Capa | Prototipo (`SkillPath1`) | Backend (esta carpeta) |
|---|---|---|
| Frontend | React 19 + TypeScript + Vite 8, generado y editable en Figma Make | React 19 + TypeScript + Vite 8 (`apps/web`), sin pantallas de producto |
| Estilos | Tailwind CSS v4 y CSS propio con variables (paleta «Celeste polvo») | — |
| Íconos | lucide-react | — |
| Navegación | Estado interno de React (sin React Router) | — |
| Backend | No tiene | Node.js + Express 5 (`apps/api`) |
| Base de datos y ORM | No tiene (estado en memoria y `localStorage`) | PostgreSQL + Prisma 7 con `@prisma/adapter-pg`. Migración `0001_init`. |
| Monorepo | — | npm workspaces (`apps/*`, `packages/*`) |

**Modelos Prisma definidos:** `User`, `Session`, `PasswordResetToken`, `LearningPath`, `Stage`, `Skill`, `Lesson`, `Exercise`, `ExerciseAttempt`, `Enrollment` y `LessonProgress`. Los tipos de ejercicio son `MULTIPLE_CHOICE` y `SHORT_ANSWER`, con un máximo de 5 intentos por defecto. El único rol es `STUDENT`.

### 2.2 Decidido pero sin implementar (según `TechStack.md`)

- React Router para las rutas protegidas.
- API REST bajo `/api/v1`, con autenticación propia: hashes de contraseña, sesiones y recuperación por correo.
- Railway con servicios `web`, `api`, `postgres` y `cron`.
- Vitest y Playwright para las pruebas.

### 2.3 Sin definir

- **IA / LLM:** no hay ningún proveedor elegido ni integración en el código. `[PENDIENTE: proveedor de IA para el chatbot y el futuro tutor]` El chatbot actual no usa IA (ver §3).
- **Proveedor de correo** para la recuperación de contraseña. `[PENDIENTE]`

## 3. Funcionalidades y su estado

Verificado contra el código el 22 de noviembre de 2026.

| Funcionalidad | Estado | Notas (verificadas en el código) | Revisión asociada |
|---|---|---|---|
| Inicio de sesión y registro | `[EN DESARROLLO]` | El prototipo tiene un login simulado con dos cuentas de prueba, registro con validación de correo duplicado y cierre de sesión. Las contraseñas se comprueban en el navegador, sin seguridad real, y las cuentas creadas se pierden al recargar (rama `Fernando` local). La autenticación real está `[PLANIFICADO]` en el backend (modelos listos, sin endpoints). La recuperación de contraseña aparece como «Próximamente». | — |
| Chatbot de bienvenida | `[EN DESARROLLO]` | «Guía de bienvenida» (rama `Fernando` local). Conversación guiada con respuestas fijas: área, experiencia, objetivo y tiempo. La recomendación se calcula con **reglas simples, sin IA**, y termina en el botón «Comenzar mi ruta». La selección se guarda en memoria. | — |
| Tutor personal con IA | `[VISIÓN FUTURA]` | Evolución del chatbot. `alcance.md` describe un asistente limitado al contenido aprobado, pero `proposal.md` lo deja fuera del MVP. | — |
| Rutas de aprendizaje | `[EN DESARROLLO]` | «Mis rutas» (rama `Ostin`, compartida). La ruta Full Stack tiene 8 etapas, pero **solo la etapa HTML tiene contenido**: 5 lecciones con mini-evaluación (mínimo 70 %), un proyecto y un examen final (15 preguntas, mínimo 75 %, 3 intentos). Dentro de esa etapa, las lecciones **sí se desbloquean en orden**. Las demás etapas están fijas como «Próximamente» y no se desbloquean al completar la anterior. El nivel máximo es «Principiante → Intermedio»; no existe nivel máster. En la ruta UX, las lecciones no responden al clic. El avance se guarda en `localStorage`. | R1 |
| Explorar aprendizaje | `[IMPLEMENTADO]` (con defectos) | Catálogo de 6 rutas genéricas (UX/UI, React, IA, Comunicación, Finanzas personales, Negocios) con búsqueda, filtro por categoría y filtro por nivel. Defectos verificados en §12 (R2). | R2 |
| Cursos (Áreas y cursos) | `[EN DESARROLLO]` | Rama `Fernando` local. Dos áreas: **Desarrollo de software Full Stack con IA** (9 cursos) y **Finanzas y Trading** (7 cursos). Cada curso muestra nombre, descripción, nivel, duración, progreso y estado (Disponible, En progreso o Próximamente). 4 cursos están como «Próximamente». El avance es simulado (botón «Completar siguiente módulo»). Solo «HTML y CSS» enlaza con lecciones reales (las de «Mis rutas»). **No hay desbloqueo secuencial entre cursos.** | R1 |
| Mis habilidades | `[IMPLEMENTADO]` (básico) | Lista fija de 6 habilidades genéricas (Diseño de interfaces, HTML y CSS, Investigación de usuarios, JavaScript, React y Resolución de problemas) con estado y filtro. No depende del área elegida ni del avance real. | R4 |
| Mi progreso | `[IMPLEMENTADO]` (parcial) | Mapa de actividad simulado y 5 objetivos semanales que se **marcan a mano** (casillas). **No hay marcado automático.** El estado de esos objetivos no está conectado con las lecciones completadas. | R5 |
| Portafolio | `[EN DESARROLLO]` | Rama `Fernando` local. Pestañas «Editar», «Vista previa» y «Mi CV». Incluye indicador de completitud, perfil, habilidades, proyectos con tecnologías y repositorio, y un campo de GitHub con la nota «Integración automática con GitHub: Próximamente». **El modo no cambia según la rama**: todos ven GitHub. El botón «Agregar proyecto» aparece arriba a la derecha y también dentro de la sección de proyectos. | R3, R6 |
| Certificaciones afiliadas | `[EN DESARROLLO]` | Rama `Fernando` local. Interfaz con 5 programas de **instituciones ficticias**, marcadas como «Ejemplo». No existe ningún convenio real (ver §5). | — |
| Certificaciones recomendadas | `[EN DESARROLLO]` | Rama `Fernando` local. 7 recomendaciones (Anthropic, AWS, Microsoft, Google, edX ×2 y freeCodeCamp) con enlace simulado, costo «Consultar» (o «Gratuito» en freeCodeCamp) y un aviso de que SkillPath no las emite ni está afiliado. | — |
| Foro | `[EN DESARROLLO]` | Rama `Fernando` local. 6 publicaciones de ejemplo, filtros por categoría, orden por recientes o populares, vista de detalle **con listado de respuestas**, responder, «me gusta», nueva publicación, y estados de carga, vacío y error simulado. Sin tiempo real. **El foro no existe en `main` ni en `Ostin`.** | R7 |
| Eventos recomendados | `[EN DESARROLLO]` | Rama `Fernando` local. 7 eventos de ejemplo (hackatón, reunión tecnológica, charla, taller, feria de empleo, finanzas y trading) con «Ver evento», «Guardar evento» y lista de guardados. Reemplaza a la pantalla «Eventos y hackathons» de `main`, que enlazaba a sitios reales (NASA Space Apps, Google Developer Groups y Kaggle). | — |
| Configuración | `[IMPLEMENTADO]` (básico) | Cambiar el nombre, un selector de objetivo (no conectado al resto de la app), 3 interruptores de notificación de demostración y «Cerrar sesión» (este último en la rama `Fernando` local). | R8 |
| Inicio (dashboard) | `[IMPLEMENTADO]` + `[EN DESARROLLO]` | `main` tiene bienvenida, estadísticas, mapa de crecimiento, cursos en curso y meta semanal. La rama `Fernando` local añade un panel personal: área recomendada, progreso general, curso actual, próxima actividad, resumen del portafolio, certificaciones, eventos y actividad del foro. | — |
| Ejercicios evaluados con persistencia | `[PLANIFICADO]` | Definido en el backend (`Exercise`, `ExerciseAttempt`), sin endpoints. El prototipo evalúa en el navegador. | — |
| Panel administrativo | `[PLANIFICADO]` (post-MVP) | Fuera del MVP según `proposal.md`. | — |

**Detalle esperado del Portafolio (requerimiento del equipo, aún no implementado):**
- Si la rama principal es **Desarrollo de Software**, la interfaz muestra una conexión a un perfil de GitHub.
- Si la rama principal es **cualquier otra** (Finanzas, Trading u otras), la interfaz muestra un portafolio de proyectos tipo carpeta.
- La interfaz cambia automáticamente según la rama principal elegida por el usuario. El prototipo ya guarda el área elegida en el chatbot (`fullstack` o `finanzas`), lo que permitiría hacer el cambio.
- La pestaña «Vista previa» pasa a llamarse **«Perfil»**.
- Se elimina el botón superior derecho para agregar proyectos. Agregar proyectos en el modo carpeta debe hacerse dentro de la propia vista de carpeta (por confirmar en P6).

## 4. Alcance del MVP

> ⚠️ **Hay dos definiciones de MVP que se contradicen** (ver §15, I-1). Este apartado no resuelve el conflicto: presenta ambas para que el equipo decida (P7).

### 4.1 Definición documentada (`proposal.md` original, Anexo A)

- **Entra:** registro, inicio y cierre de sesión, recuperación de contraseña, una única ruta fija de *analista de datos junior* (Excel, SQL y visualización), lecciones, ejercicios de opción múltiple y respuesta corta con reintentos, desbloqueo secuencial, progreso, diseño responsive y estados claros.
- **Queda fuera:** perfil configurable, plan semanal, proyecto integrador, panel administrativo, asistente conversacional, analítica, comunidad, certificados, pagos y múltiples rutas.
- **Por qué:** validar primero el ciclo «registro → estudio → ejercicio → progreso» con la menor operación posible.

### 4.2 Definición del equipo (requerimientos de noviembre de 2026)

- **Entra:** chatbot de bienvenida, rutas con desbloqueo secuencial, cursos de Full Stack con IA y de Finanzas y Trading, Explorar aprendizaje, Mis habilidades, Mi progreso, Portafolio por rama, certificaciones afiliadas y recomendadas, foro, eventos y configuración.
- **Choca con 4.1** en la ruta (datos vs. Full Stack y Finanzas) y en módulos que 4.1 excluye (comunidad, certificados y personalización).

### 4.3 Revisiones necesarias para un MVP estable (propuesta)

Sugerencia inicial: **R1, R2, R5 y R7**, con estos ajustes según el código:

| Revisión | ¿Necesaria para el MVP? | Motivo |
|---|---|---|
| R1 Desbloqueo secuencial | Sí | Es el núcleo de la propuesta. Hoy solo existe dentro de la etapa HTML. |
| R2 Explorar aprendizaje | Sí | Tiene defectos visibles en la primera impresión (filtros que siempre salen vacíos y catálogo que no coincide con las áreas). |
| R5 Marcado automático | Sí | Hoy el progreso semanal es manual y no refleja la actividad real. |
| R7 Foro | Diagnosticar primero | El fallo no se reproduce en el código actual (ver §12). |
| Integración y persistencia | Sí (añadida) | Sin unir el prototipo al backend no hay cuentas reales ni progreso que se conserve. |
| R3, R4, R6 y R8 | Recomendable, no bloqueante | Mejoran la experiencia, pero no impiden validar el ciclo principal. |

## 5. Alianzas y certificaciones

### 5.1 Certificaciones afiliadas

| Institución | Estado del convenio |
|---|---|
| Universidades locales | `[PENDIENTE: confirmado / en conversación / solo intención]` No consta ninguno. |
| Institutos | `[PENDIENTE]` No consta ninguno. |
| Centros de formación aliados | `[PENDIENTE]` No consta ninguno. |

En el prototipo, las instituciones de esta sección son **ficticias** («Universidad de Ejemplo», «Instituto Técnico Demo» y «Centro de Formación Aliado Demo») y se muestran con la etiqueta «Ejemplo». **No deben presentarse como alianzas reales.**

### 5.2 Certificaciones recomendadas

Recomendar certificaciones de **AWS, Microsoft, Anthropic, edX** (y, en el prototipo, también Google y freeCodeCamp) **no implica alianza, afiliación ni respaldo** de esas empresas. Son recomendaciones orientativas. Nombres, costos y disponibilidad deben comprobarse en el sitio oficial de cada proveedor.

## 6. Público objetivo y mercado

- **Público (requerimientos del equipo):** estudiantes, personas desempleadas y principiantes que quieren entrar al sector tecnológico o al trabajo remoto.
- **Público (documentación original):** principiantes que quieren postular como analistas de datos junior; personas que buscan empleo o cambiar de carrera (`alcance.md`).
- **Idioma:** español «global» (`user-stories.md`).
- **País o región objetivo:** `[PENDIENTE: país o región]`.
- **Tamaño de mercado:** `[PENDIENTE]`. No hay datos en ninguna fuente y no deben estimarse sin respaldo.
- **Modelo:** B2C (`alcance.md`).

## 7. Competidores y diferenciación

Comparación cualitativa. Todas las valoraciones son `[HIPÓTESIS]` hasta que se contrasten con usuarios.

| Alternativa | Qué ofrece (función común del mercado) | Qué añadiría SkillPath `[HIPÓTESIS]` |
|---|---|---|
| Plataformas de cursos (Coursera, Platzi, freeCodeCamp) | Catálogos de cursos, rutas o carreras, certificados propios o de terceros y, en algunos casos, comunidad. | Orientación inicial guiada y un único flujo que une ruta, portafolio, certificaciones externas, comunidad y eventos. |
| Roadmaps (roadmap.sh) | Mapas de qué aprender y en qué orden. | Seguimiento del avance, desbloqueo secuencial y evidencia práctica (proyectos y portafolio). |
| Asistentes de IA generales usados como tutor | Respuestas a demanda, flexibles. | Estructura curricular, progreso medible y contenido acotado. El tutor con IA de SkillPath es `[VISIÓN FUTURA]`. |

**Funciones comunes del mercado (no presentarlas como innovación):** cursos en video o texto, rutas de aprendizaje, cuestionarios, certificados, foros, listados de eventos y perfiles o portafolios.

**Diferencial propuesto `[HIPÓTESIS]`:** la **combinación en un solo flujo** de:
1. orientación personalizada al inicio;
2. una ruta estructurada con desbloqueo secuencial;
3. un portafolio que se adapta a la rama;
4. certificaciones (afiliadas y recomendadas);
5. comunidad y eventos.

Cada pieza por separado existe en el mercado. El valor está en la integración, y debe validarse.

## 8. Equipo y recursos

| Dato | Estado |
|---|---|
| Integrantes y perfiles | `[PENDIENTE]` En los repositorios se ven al menos tres colaboradores: el propietario del repositorio del prototipo y los autores de las ramas `Ostin` y `Fernando`. El repositorio del backend pertenece a la organización `aethelynsoftware-glitch`. |
| Tamaño del equipo | `[PENDIENTE]` |
| Tiempo disponible | `[PENDIENTE]` |
| Presupuesto aproximado | `[PENDIENTE]` |
| Contexto (concurso, hackatón, curso) | `[PENDIENTE]` La carpeta se llama `HKT`, pero no consta oficialmente que sea un hackatón. |

## 9. Monetización y sostenibilidad

No hay modelo documentado. `alcance.md` deja «pagos y suscripciones» fuera del MVP. Opciones plausibles, **todas `[HIPÓTESIS]` y sin cifras**:

- **Freemium:** ruta básica gratuita y pago por funciones avanzadas (tutor con IA, revisión de portafolio).
- **Acuerdos con instituciones (B2B2C):** universidades o centros que ofrecen SkillPath a su alumnado. Depende de convenios que hoy no existen.
- **Patrocinio de eventos o de contenidos** por empresas del sector, siempre identificado como tal.
- **Comisión o tarifa** por certificaciones afiliadas. Requiere convenios firmados.

En cualquier modelo, el costo del proveedor de IA (si se adopta) afecta directamente a la sostenibilidad (ver §10).

## 10. Riesgos y mitigaciones

| Riesgo | Mitigación propuesta |
|---|---|
| **Alcance excesivo para un MVP** (12 módulos frente a la definición original de una ruta) | Elegir una única definición de MVP (P7). Congelar el alcance y dejar como post-MVP lo que no valide el ciclo principal. |
| **Dependencia de convenios no firmados** | Mantener las afiliaciones como «Ejemplo» hasta que haya un convenio firmado. No mencionarlas como reales en el pitch. |
| **Curso de Trading: riesgo reputacional y regulatorio** | Contenido solo educativo, aviso visible de «no es asesoramiento financiero» (ya presente en el prototipo), sin promesas de ganancias y práctica únicamente en simulación. Revisar la normativa local del país objetivo (P8). |
| **Costos y dependencia del proveedor de IA** | El chatbot actual funciona con reglas y sin IA. Introducir IA de forma acotada (contenido aprobado), medir el costo por usuario y diseñar una alternativa sin IA. |
| **Retención y abandono** | Desbloqueo secuencial, objetivos semanales automáticos (R5) y métricas de retención desde el primer piloto (§11). |
| **Bugs en funciones centrales** (Explorar aprendizaje, foro) en la primera impresión | Corregir R2 y diagnosticar R7 antes de cualquier demostración. Ensayar la demo con el recorrido exacto que se mostrará. |
| **Dos bases de código separadas** (prototipo sin backend y backend sin pantallas) | Decidir cuál es la base oficial y planificar la integración (P14). |
| **Datos simulados confundidos con reales** | Mantener las etiquetas «Ejemplo», «Simulado» y «Próximamente» en la interfaz y en el pitch. |
| **Seguridad del login del prototipo** (contraseñas en el código del navegador) | Usarlo solo para demostración. La autenticación real va en el backend (hash, sesiones y rate limiting, según `TechStack.md`). |
| **Riesgos técnicos ya documentados** (autenticación propia, conexiones de Prisma, idempotencia del cron, CORS) | Los recogidos en `TechStack.md` §12. |

## 11. Impacto: esperado vs. por validar

| Impacto esperado `[HIPÓTESIS]` | Cómo validarlo (métrica) | Valor actual |
|---|---|---|
| La orientación inicial reduce la indecisión sobre qué estudiar. | % de usuarios que terminan el chatbot y empiezan un curso. | `[PENDIENTE: sin datos]` |
| La ruta secuencial mejora la constancia. | Tasa de finalización de niveles o lecciones y retención semanal (semanas 1 a 4). | `[PENDIENTE: sin datos]` |
| Los usuarios construyen evidencia práctica. | Proyectos publicados por usuario y % de portafolios completos. | `[PENDIENTE: sin datos]` |
| La comunidad sostiene la motivación. | Publicaciones y respuestas por usuario activo; tiempo hasta la primera respuesta. | `[PENDIENTE: sin datos]` |
| Mayor empleabilidad o acceso al trabajo remoto. | Usuarios que declaran entrevistas u ofertas tras N meses (requiere seguimiento). | `[PENDIENTE: sin datos]` |

`user-stories.md` (US-ANALYTICS-01) ya define los eventos de activación de los primeros 7 días. Está fuera del MVP según `proposal.md`.

## 12. Backlog de revisiones

| ID | Módulo | Estado actual (verificado en el código) | Cambio solicitado | Criterio de aceptación | Estado |
|---|---|---|---|---|---|
| R1 | Rutas de aprendizaje | El desbloqueo secuencial solo existe entre las lecciones de la etapa HTML de «Mis rutas» (`LearningRoutes.tsx`: botón desactivado si la lección anterior no está aprobada). Las etapas 2–8 están fijas como «Próximamente». En «Áreas y cursos» cualquier curso disponible se puede empezar sin haber terminado el anterior. No hay niveles hasta máster. | Desbloqueo secuencial de principiante a máster según la ruta de la rama. | Un nivel o curso bloqueado no es accesible hasta completar el anterior. | `[PLANIFICADO]` |
| R2 | Explorar aprendizaje | La vista carga y filtra correctamente (comprobado en el navegador), pero tiene estos defectos: **(a)** 2 de los 9 filtros de categoría («Productividad» y «Desarrollo personal») no tienen rutas asociadas y siempre muestran el estado vacío; **(b)** el catálogo (UX/UI, React, IA, Comunicación, Finanzas personales, Negocios) no coincide con las áreas oficiales (Full Stack con IA, Finanzas y Trading); **(c)** «Ver ruta» no muestra un detalle: inscribe al usuario en la ruta (aumenta el contador de «Mis rutas») y abre directamente la primera lección (función `openLesson`). | Corregir la vista. | Documentar primero qué falla exactamente (ver P1). | `[POR DIAGNOSTICAR]` |
| R3 | Portafolio (por rama) | Todos los usuarios ven el campo de GitHub. No existe un modo carpeta. El área elegida ya se guarda en el perfil (`profile.area`). | GitHub para Desarrollo de Software y portafolio tipo carpeta para las demás ramas. | La interfaz cambia según la rama principal. | `[PLANIFICADO]` |
| R4 | Mis habilidades | 6 habilidades fijas y genéricas, sin relación con el área elegida ni con el avance. | Hacer las skills más específicas. | Ver P2. | `[PLANIFICADO]` |
| R5 | Mi progreso | Los 5 objetivos semanales se marcan a mano (`setGoals` al hacer clic). El prototipo guarda el avance en **tres sitios que no se comunican**: lecciones de «Mis rutas» (`localStorage`), lecciones del catálogo (`completed`) y cursos (`courseProgress`). | Marcado automático de tareas semanales al completar una actividad. | Sin marcado manual; el progreso se actualiza al instante. | `[PLANIFICADO]` |
| R6 | Portafolio (interfaz) | Las pestañas son «Editar», «Vista previa» y «Mi CV». El botón «Agregar proyecto» está arriba a la derecha y también dentro de la sección de proyectos. | Renombrar «Vista previa» a «Perfil» y quitar el botón superior derecho de agregar proyectos. | La pestaña se llama «Perfil» y el botón ya no aparece ahí. | `[PLANIFICADO]` |
| R7 | Foros | **No se reproduce en el código actual.** En la rama `Fernando` local, al abrir una publicación se listan sus respuestas y se pueden añadir nuevas (verificado en el navegador). El foro **no existe** en `main` ni en `Ostin`, así que el fallo reportado debe venir de otra versión (posiblemente la de Figma Make u otra compilación). Causa: `[PENDIENTE: dónde y cómo se observó]` (P12). | Corregir: no deja visualizar comentarios. | Los comentarios se listan y se leen en cada publicación. | `[POR DIAGNOSTICAR]` |
| R8 | Configuración | Nombre, selector de objetivo no conectado (opciones de diseño y frontend), 3 interruptores de demostración y cerrar sesión. | Hacerla más completa. | Ver P3. | `[PLANIFICADO]` |

## 13. Lineamientos de comunicación

- Tono profesional y persuasivo, sin exageraciones.
- No afirmar nada sin evidencia: hoy **no hay usuarios, métricas ni convenios validados**.
- No presentar como innovación funciones comunes del mercado (cursos, foros, certificados, rutas). El diferencial propuesto es la **integración** (§7).
- Indicar siempre cuándo algo es `[HIPÓTESIS]`, `[VISIÓN FUTURA]`, simulado o «Próximamente».
- Describir el chatbot actual como «guía con reglas», no como «IA».
- Describir las certificaciones afiliadas como «modelo de alianzas por concretar», nunca como convenios existentes.
- En Finanzas y Trading: lenguaje educativo, sin promesas de rentabilidad.

## 14. Guía para resúmenes estratégicos

Cualquier agente que genere un pitch debe seguir esta estructura y estas reglas:

1. **Resumen ejecutivo** (máx. 150 palabras).
2. **Problema y solución.**
3. **Viabilidad:** etapa real (prototipo), stack (§2) y qué entra y qué no en el MVP (§4).
4. **Impacto:** separar lo esperado de lo que está por validar (§11).
5. **Innovación y diferenciadores** (§7), distinguiendo lo común de lo diferencial.
6. **Riesgos, supuestos y próximos pasos** (§10 y §12).
7. **Conclusión** (máx. 80 palabras).

Reglas: usar solo datos de este documento; conservar las etiquetas `[HIPÓTESIS]` y `[PENDIENTE]`; no inventar cifras, usuarios, convenios ni fechas; mencionar que las certificaciones recomendadas no implican alianza.

## 15. Inconsistencias detectadas

| ID | Inconsistencia | Fuentes en conflicto | Estado |
|---|---|---|---|
| I-1 | **Definición del MVP:** una sola ruta de *analista de datos junior* (Excel, SQL y visualización) frente a dos áreas, Full Stack con IA y Finanzas y Trading, con 12 módulos. | `proposal.md` (Anexo A), `alcance.md`, `user-stories.md` y `plan-implementacion.md` frente a los requerimientos del equipo y el prototipo. | Sin resolver (P7). |
| I-2 | **Arquitectura:** `alcance.md` §6 recomienda Supabase sin backend separado; `TechStack.md` §11 dice «No se utilizará Supabase», y el código usa Express + Prisma. | `alcance.md` frente a `TechStack.md` y el código. | El código sigue a `TechStack.md`. Conviene actualizar `alcance.md`. |
| I-3 | **Módulos dentro o fuera del MVP:** `alcance.md` incluye panel administrativo, plan semanal y asistente; `proposal.md` los excluye. | `alcance.md` frente a `proposal.md`. | Sin resolver. |
| I-4 | **Prioridades de las historias:** US-PROFILE-01 y US-PLAN-01 son «Alta» en `user-stories.md` pero quedan fuera del MVP en `proposal.md`. US-EXERCISE-01 admite respuestas numéricas, fórmulas y SQL, pero `proposal.md` limita a opción múltiple y respuesta corta (igual que el esquema Prisma). | `user-stories.md` frente a `proposal.md` y el código. | Sin resolver. |
| I-5 | **Comunidad y certificados:** la documentación los deja fuera del MVP; los requerimientos del equipo los incluyen (foro y certificaciones). | Documentación frente a los requerimientos. | Sin resolver (P7). |
| I-6 | **Dos bases de código sin integrar:** el prototipo (Figma Make, sin API) y el backend (API con `/health` y una web sin pantallas). | Repositorio `SkillPath1` frente a esta carpeta. | Sin resolver (P14). |
| I-7 | **Progreso fragmentado en el prototipo:** tres registros de avance independientes (ver R5). | Código del prototipo. | Documentado en R5. |
| I-8 | **Catálogo de Explorar aprendizaje** distinto de las áreas oficiales (ver R2). | Código frente a los requerimientos. | Documentado en R2. |
| I-9 | **R3 frente a R6:** R6 quita el botón superior de agregar proyectos, pero el modo carpeta de R3 necesita una forma de agregarlos. **Propuesta:** la acción vive dentro de la vista de carpeta (por ejemplo, una tarjeta «+ Nuevo proyecto» como primer elemento de la cuadrícula, y el mismo botón en el estado vacío). En el modo GitHub, los proyectos vendrían de los repositorios cuando la integración exista; mientras tanto, la opción manual va dentro de la sección de proyectos (ya existe hoy). | Requerimientos R3 y R6. | Propuesta pendiente de confirmar (P6). |
| I-10 | **Nombres de las ramas o áreas:** R3 habla de «Desarrollo de Software» y de «Finanzas, Trading u otras» como ramas distintas, pero el código tiene un área combinada «Finanzas y Trading» y otra «Desarrollo de software Full Stack con IA». | Requerimientos frente al código. | Sin resolver (P13). |
| I-11 | **Niveles de la ruta:** se pide «de principiante a máster»; el código llega a «Principiante → Intermedio». | Requerimientos frente al código. | Sin resolver (P4). |
| I-12 | **Proveedores recomendados:** los requerimientos citan AWS, Microsoft, Anthropic y edX; el prototipo añade Google y freeCodeCamp. | Requerimientos frente al código. | Menor. Confirmar la lista. |
| I-13 | **Perfil por defecto orientado a diseño:** el CV, el modal de perfil y las opciones de objetivo en Configuración hablan de «Diseñador de producto», ajeno a las dos áreas oficiales. | Código del prototipo. | Menor. Ajustar el texto. |
| I-14 | **Fallo del foro (R7) no reproducible** en el código revisado; el foro solo existe en trabajo local sin integrar. | Reporte del equipo frente al código. | Pendiente (P12). |
| I-15 | **Seguridad del login:** el prototipo valida credenciales en el navegador; `TechStack.md` exige validación en el servidor con hash. | Prototipo frente a `TechStack.md`. | Aceptable solo como demostración. |
| I-16 | **Fechas fijas de 2025** en el prototipo (pie «SkillPath © 2025», CV y mensajes), aunque la fecha actual es 2026. | Código del prototipo. | Menor. |

## Preguntas pendientes

Ordenadas por importancia.

1. **P7.** ¿Cuál es la definición oficial del MVP: la ruta de analista de datos (documentación) o las áreas Full Stack con IA y Finanzas y Trading con todos los módulos (requerimientos)? *(I-1, I-3, I-5)*
2. **P14.** ¿Cuál es la base de código oficial y cómo se integrarán el prototipo `SkillPath1` y el backend `apps/api`? *(I-6)*
3. **P1.** ¿Qué falla exactamente en «Explorar aprendizaje»: no carga, datos incorrectos, error visual u otro? ¿Coincide con los defectos (a), (b) y (c) de R2?
4. **P12.** ¿Dónde se observó que el foro no deja ver los comentarios (Figma Make, otra rama, otro dispositivo) y con qué pasos? *(R7, I-14)*
5. **P4.** ¿Cuántos niveles tiene la ruta y se desbloquean por curso, por módulo o por evaluación?
6. **P5.** ¿Qué cuenta como «completar» una tarea semanal para el marcado automático: terminar una lección, aprobar un quiz o subir un proyecto?
7. **P6.** ¿Dónde se agregarán proyectos en el portafolio tipo carpeta, ya que se quita el botón superior derecho? ¿Se acepta la propuesta de I-9?
8. **P13.** ¿«Finanzas» y «Trading» son ramas separadas o una sola área? ¿Qué otras ramas existirán? *(I-10)*
9. **P10.** ¿Cuál es el estado real de cada convenio con universidades, institutos o centros (confirmado, en conversación o solo intención)?
10. **P8.** ¿Cuál es el país o región objetivo? (También afecta a la normativa del curso de Trading.)
11. **P11.** ¿Qué proveedor de IA se usará para el chatbot o tutor, y con qué presupuesto?
12. **P2.** ¿Qué significa «más específicas» en Mis habilidades: tecnologías concretas, niveles por skill o skills por rama?
13. **P3.** ¿Qué opciones debe incluir Configuración: perfil, rama principal, notificaciones, privacidad, idioma, tema, cuenta y contraseña, eliminar cuenta?
14. **P9.** ¿Quiénes forman el equipo (perfiles y roles), cuánto tiempo dedican y con qué presupuesto aproximado?
15. **P15.** ¿En qué contexto se presenta el proyecto (hackatón, concurso, curso) y con qué fechas límite?
16. **P16.** ¿Se ha probado el prototipo con usuarios reales? Si es así, ¿con cuántos y qué resultados?

---

## Anexo A — Propuesta original de alcance del MVP (texto conservado)

> Contenido original de `proposal.md` sin cambios en el texto. Solo se bajó un nivel a los encabezados para integrarlo en este documento. Su alcance (analista de datos junior) entra en conflicto con los requerimientos actuales del equipo: ver §15, I-1.

## SkillPath — Propuesta de alcance del MVP

### 1. Objetivo

El MVP de SkillPath validará el ciclo principal de aprendizaje para personas principiantes que quieren prepararse como analistas de datos junior:

> registro → acceso → recuperación de contraseña → estudio → ejercicio → progreso

El producto inicial tendrá una única ruta curricular fija con contenido de Excel, SQL y visualización de datos. La prioridad es comprobar que una persona puede avanzar por una secuencia de aprendizaje y entender su progreso, reduciendo al mínimo la operación y las funcionalidades accesorias.

### 2. Alcance incluido

#### 2.1 Autenticación

##### US-AUTH-01 — Crear una cuenta

El visitante puede registrarse con correo y contraseña. El sistema valida los campos, las reglas mínimas de contraseña y los correos duplicados, sin revelar información sensible.

##### US-AUTH-02 — Iniciar y cerrar sesión

El usuario registrado puede iniciar y cerrar sesión. Las credenciales inválidas muestran un mensaje genérico y las páginas protegidas dejan de ser accesibles después del cierre de sesión.

##### US-AUTH-03 — Recuperar contraseña

El usuario puede recuperar el acceso mediante su correo electrónico.

Criterios mínimos:

- Puede solicitar un enlace de recuperación.
- El mensaje no revela si el correo existe o no.
- El enlace es temporal y permite establecer una nueva contraseña.
- La contraseña anterior deja de ser válida después del cambio.
- Se comunican claramente los estados de éxito, error y enlace expirado.

#### 2.2 Ruta y contenido

##### US-ROUTE-01 — Ver la ruta de aprendizaje

El estudiante puede consultar las etapas, habilidades y lecciones de la única ruta curricular del MVP. Cada lección muestra si está bloqueada, disponible, en progreso o completada, además de la siguiente lección recomendada.

##### US-ROUTE-02 — Desbloquear contenido secuencialmente

Las lecciones se desbloquean conforme el estudiante supera el ejercicio requerido. El contenido previamente desbloqueado permanece disponible y el sistema explica qué requisito falta cuando una lección está bloqueada.

##### US-LESSON-01 — Consultar una lección publicada

El estudiante puede abrir una lección publicada y consultar su título, descripción, etapa, habilidad y contenido. Los materiales esenciales estarán integrados directamente en la lección durante el MVP.

#### 2.3 Ejercicios y progreso

##### US-EXERCISE-01 — Resolver un ejercicio estructurado

El estudiante puede responder ejercicios asociados a una lección. En el primer corte se admitirán únicamente opción múltiple y respuesta corta. El sistema informa si la respuesta fue aceptada o rechazada y registra el resultado.

##### US-EXERCISE-04 — Reintentar un ejercicio

El estudiante dispone de un límite definido de intentos evaluables y recibe retroalimentación básica después de fallar. Se conserva el historial necesario para determinar si puede continuar.

##### US-PROGRESS-01 — Marcar una lección como completada

Una lección solo se completa después de cumplir el ejercicio requerido. Se registra la fecha de completitud y se actualiza el progreso de la ruta.

##### US-PROGRESS-02 — Consultar mi progreso

El estudiante puede consultar las lecciones completadas y pendientes, así como su avance general por etapa. El progreso permanece asociado a su cuenta.

### 3. Requisitos transversales

#### US-SECURITY-01 — Aplicar permisos por rol

- El estudiante solo puede consultar y modificar sus propios datos permitidos.
- El estudiante no puede acceder a operaciones administrativas.
- Las claves sensibles y las operaciones protegidas nunca se exponen al cliente.

#### US-UX-01 — Usar la aplicación desde móvil

Las pantallas de autenticación, ruta, lecciones, ejercicios y progreso deben funcionar en dispositivos móviles y de escritorio. No se requiere una aplicación móvil nativa.

#### US-UX-02 — Recibir información clara de estados

Las pantallas principales deben contemplar estados de carga, vacío, éxito, error y falta de permisos. Los mensajes deben indicar una acción posible cuando corresponda y no exponer detalles internos.

### 4. Decisiones de simplificación del MVP

- Existirá una sola ruta profesional.
- La inscripción se creará automáticamente después del registro.
- La ruta curricular será fija y estará precargada mediante datos iniciales controlados.
- No habrá configuración de objetivo, nivel ni disponibilidad.
- Los materiales esenciales se incluirán dentro de las lecciones.
- Los ejercicios iniciales serán de opción múltiple y respuesta corta.
- No habrá panel administrativo durante este corte.
- No habrá versionado de contenido ni correspondencia entre versiones.
- El contenido será preparado y publicado fuera de una interfaz administrativa.

### 5. Fuera del MVP

Las siguientes funcionalidades se mantienen como backlog post-MVP y no forman parte de la entrega inicial:

- `US-PROFILE-01` — Completar la configuración inicial.
- `US-PROFILE-02` — Editar mi perfil.
- `US-RESOURCE-01` — Consultar recursos independientes de una lección.
- `US-EXERCISE-02` — Validar respuestas numéricas y fórmulas.
- `US-EXERCISE-03` — Validar consultas SQL.
- `US-PLAN-01` — Recibir un plan semanal.
- `US-PLAN-02` — Regenerar el plan.
- `US-PLAN-03` — Consultar tareas pendientes.
- `US-PROJECT-01` a `US-PROJECT-04` — Proyecto integrador.
- `US-ADMIN-01` a `US-ADMIN-05` — Panel administrativo y gestión de contenido.
- `US-ASSISTANT-01` y `US-ASSISTANT-02` — Asistente conversacional.
- `US-ANALYTICS-01` — Analítica de activación.

También permanecen fuera del MVP las capacidades indicadas en la sección original de funcionalidades excluidas: Python, estadística, múltiples rutas, comunidad, gamificación avanzada, certificados, pagos, integraciones laborales, editor avanzado, múltiples roles administrativos, analítica avanzada, búsqueda vectorial compleja y ejecución de código sobre datos productivos.

### 6. Criterios de aceptación del MVP

El corte se considera logrado cuando:

- Un visitante puede crear una cuenta.
- Un usuario puede iniciar y cerrar sesión.
- Un usuario puede recuperar su contraseña mediante un enlace temporal.
- El usuario puede consultar la ruta fija.
- El contenido se desbloquea secuencialmente.
- El usuario puede estudiar una lección publicada.
- El usuario puede resolver y reintentar un ejercicio.
- El sistema registra la completitud de la lección.
- El usuario puede consultar su progreso.
- El flujo completo funciona en móvil y escritorio.
- Los estados de carga, vacío, éxito, error y permisos son comprensibles.
- Los datos y operaciones administrativas permanecen protegidos.

### 7. Supuestos y evolución

- El objetivo inicial es validar el ciclo de aprendizaje, no la operación completa del producto.
- El contenido curricular inicial será cargado mediante datos controlados fuera de un panel de administración.
- Las historias post-MVP se conservan para una segunda etapa y no se consideran compromisos del primer lanzamiento.
- La recuperación de contraseña sí forma parte del primer lanzamiento por ser necesaria para una experiencia mínima operable.
