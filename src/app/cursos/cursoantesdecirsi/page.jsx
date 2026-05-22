import Link from 'next/link';

const cursoTitle = 'Antes de Decir Sí - Curso para Jóvenes';
const cursoDescripcion =
  'Dirigido a adolescentes y jóvenes que buscan conocer más acerca de su identidad, sanidad y madurez emocional y espiritual, permitiéndoles tomar decisiones sabias para disfrutar cada etapa de su vida y prepararse para bendecir a sus generaciones.';
const cursoResponsables = 'Pr. Paul Quispe y Mayra';
const manualHref = '/manuales/manual_ADDS.pdf';
const inscripcionHref = `/contacto?${new URLSearchParams({
  tipo: 'inscripcion',
  preferencia: 'formulario',
  cursoId: 'CursoAntesde',
  evento: cursoTitle,
}).toString()}`;
const fechasCurso = [
  '2026-05-21',
  '2026-05-28',
  '2026-06-04',
  '2026-06-11',
  '2026-06-18',
  '2026-06-25',
  '2026-07-02',
  '2026-07-09',
  '2026-07-16',
  '2026-07-23',
];
const horaInicio = '20:30';
const horaFin = '22:00';
const fechaFormatter = new Intl.DateTimeFormat('es-PE', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  year: 'numeric',
});

export default function CursoAntesDecirSiPage() {
  return (
    <>
      <section className="section curso-detail-section curso-detail-section-top">
        <div className="container">
          <div className="curso-detail-heading">
            <h1>{cursoTitle}</h1>
          </div>

          <div className="curso-detail-top">
            <div className="curso-detail-media">
              <img
                src="/images/flyercursos/PostADDS.png"
                alt={cursoTitle}
              />
            </div>

            <div className="curso-detail-dates-panel">
              <span className="section-tag">Fechas del curso</span>
              <h2>Sesiones programadas</h2>
              <ul className="curso-detail-fechas">
                {fechasCurso.map((fecha) => (
                  <li key={fecha}>
                    <strong>{fechaFormatter.format(new Date(`${fecha}T12:00:00`))}</strong>
                    <span>{horaInicio} – {horaFin}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="section curso-detail-section curso-detail-section-body">
        <div className="container">
          <div className="curso-detail-panel">
            <div>
              <span className="section-tag">Sobre el curso</span>
              <h2>Descripción</h2>
              <p>{cursoDescripcion}</p>
            </div>

            <div>
              <h3>Responsables</h3>
              <p>{cursoResponsables}</p>
            </div>

            <div className="curso-detail-actions">
              <a href={manualHref} download className="btn btn-outline">
                Descargar manual
              </a>
              <Link href={inscripcionHref} className="btn btn-primary">
                Inscribirme
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
