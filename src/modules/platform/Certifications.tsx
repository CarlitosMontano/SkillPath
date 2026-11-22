import { useState } from "react";
import { Award, BadgeCheck, Building2, CalendarDays, Clock3, ExternalLink, GraduationCap, MapPin, SearchX, TrendingUp } from "lucide-react";
import { affiliatedCerts, areas, recommendedCerts, type AffiliatedCert, type AreaKey } from "./data";
import { DemoBanner, Dialog, EmptyState, PageHeading, SkeletonGrid, useSimulatedLoad } from "./ui";

type AreaFilter = "Todas" | AreaKey;

function AreaChips({ value, onChange }: { value: AreaFilter; onChange: (v: AreaFilter) => void }) {
  return (
    <div className="filter-chips" role="group" aria-label="Filtrar por área">
      {(["Todas", "fullstack", "finanzas"] as AreaFilter[]).map((a) => (
        <button key={a} className={value === a ? "selected" : ""} aria-pressed={value === a} onClick={() => onChange(a)}>
          {a === "Todas" ? "Todas las áreas" : areas[a].short}
        </button>
      ))}
    </div>
  );
}

export function AffiliatedCertifications() {
  const [area, setArea] = useState<AreaFilter>("Todas");
  const [open, setOpen] = useState<AffiliatedCert | null>(null);
  const { loading } = useSimulatedLoad(500);
  const list = affiliatedCerts.filter((c) => area === "Todas" || c.area === area);
  return (
    <>
      <PageHeading
        eyebrow="CERTIFICACIONES AFILIADAS"
        title="Respaldo de instituciones de tu comunidad."
        subtitle="Programas de universidades locales, institutos y centros de formación aliados que complementan tus rutas."
      />
      <DemoBanner>
        <b>Datos de demostración.</b> Las instituciones de esta pantalla son ficticias y no existe todavía ninguna afiliación real. Las alianzas oficiales se anunciarán próximamente.
      </DemoBanner>
      <AreaChips value={area} onChange={setArea} />
      {loading ? (
        <SkeletonGrid count={3} label="Cargando certificaciones afiliadas" />
      ) : list.length === 0 ? (
        <EmptyState icon={<SearchX size={38} />} title="Sin certificaciones en esta área" text="Prueba con otra área." />
      ) : (
        <div className="sp-grid">
          {list.map((c) => (
            <article className="panel sp-card" key={c.id}>
              <div className="row between">
                <span className="stat-icon yellow" aria-hidden="true"><GraduationCap size={18} /></span>
                <span className="pill sp-demo-pill">Ejemplo</span>
              </div>
              <span className="eyebrow">{c.institutionType}</span>
              <h3>{c.name}</h3>
              <p className="sp-institution"><Building2 size={13} aria-hidden="true" /> {c.institution}</p>
              <ul className="sp-facts">
                <li><TrendingUp size={13} aria-hidden="true" /> Área: {areas[c.area].short}</li>
                <li><Clock3 size={13} aria-hidden="true" /> Duración: {c.duration}</li>
                <li><MapPin size={13} aria-hidden="true" /> Modalidad: {c.modality}</li>
                <li><BadgeCheck size={13} aria-hidden="true" /> Nivel: {c.level}</li>
              </ul>
              <button className="btn secondary" onClick={() => setOpen(c)}>Ver certificación <ExternalLink size={14} /></button>
            </article>
          ))}
        </div>
      )}
      {open && (
        <Dialog title={open.name} eyebrow="CERTIFICACIÓN AFILIADA · EJEMPLO" onClose={() => setOpen(null)}>
          <p>Programa ofrecido por <b>{open.institution}</b> ({open.institutionType.toLowerCase()}).</p>
          <ul className="sp-facts">
            <li>Área: {areas[open.area].name}</li>
            <li>Duración: {open.duration}</li>
            <li>Modalidad: {open.modality}</li>
            <li>Nivel: {open.level}</li>
          </ul>
          <DemoBanner>Institución ficticia para la demostración. No existe todavía ningún convenio real.</DemoBanner>
        </Dialog>
      )}
    </>
  );
}

export function RecommendedCertifications() {
  const [area, setArea] = useState<AreaFilter>("Todas");
  const { loading } = useSimulatedLoad(500);
  const list = recommendedCerts.filter((c) => area === "Todas" || c.area === area);
  return (
    <>
      <PageHeading
        eyebrow="CERTIFICACIONES RECOMENDADAS"
        title="Certificaciones externas que suman a tu perfil."
        subtitle="Una selección orientativa de proveedores reconocidos según tu área de interés."
      />
      <DemoBanner>
        Son <b>recomendaciones externas</b>: SkillPath no emite directamente estas certificaciones ni está afiliado a sus proveedores. Nombres, costos y disponibilidad pueden cambiar; consulta siempre el sitio oficial.
      </DemoBanner>
      <AreaChips value={area} onChange={setArea} />
      {loading ? (
        <SkeletonGrid count={6} label="Cargando certificaciones recomendadas" />
      ) : list.length === 0 ? (
        <EmptyState icon={<SearchX size={38} />} title="Sin recomendaciones en esta área" text="Prueba con otra área." />
      ) : (
        <div className="sp-grid">
          {list.map((c) => (
            <article className="panel sp-card" key={c.id}>
              <div className="row between">
                <span className="stat-icon blue" aria-hidden="true"><Award size={18} /></span>
                <span className="pill sp-recommended">Recomendada</span>
              </div>
              <span className="eyebrow">{c.provider}</span>
              <h3>{c.name}</h3>
              <p>{c.description}</p>
              <ul className="sp-facts">
                <li><BadgeCheck size={13} aria-hidden="true" /> Nivel: {c.level}</li>
                <li><CalendarDays size={13} aria-hidden="true" /> Costo: {c.cost}</li>
              </ul>
              <a className="btn secondary" href={c.url} target="_blank" rel="noopener noreferrer" aria-label={`Ver ${c.name} en ${c.provider} (pestaña nueva)`}>
                Ver en {c.provider} <ExternalLink size={14} />
              </a>
            </article>
          ))}
        </div>
      )}
    </>
  );
}
