import Link from 'next/link';

const cursoTitle = 'Curso de Finanzas';
const cursoDescripcion =
  'Dirigido a quienes desean administrar sus recursos conforme a los principios bíblicos.';
const cursoResponsables = 'Pr. Cesar Atachagua y Karen';
const manualHref = '/manuales/manual_finanzas.pdf';
const inscripcionHref = `/contacto?${new URLSearchParams({
  tipo: 'inscripcion',
  preferencia: 'formulario',
  cursoId: 'finanzas',
  evento: cursoTitle,
}).toString()}`;

const fechasCurso = [
  '2026-05-20',
  '2026-05-27',
  '2026-06-03',
  '2026-06-10',
  '2026-06-17',
  '2026-06-24',
  '2026-07-01',
  '2026-07-08',
  '2026-07-15',
  '2026-07-22',
  '2026-07-29',
  '2026-08-05',
  '2026-08-12',
];
const horaInicio = '20:30';
const horaFin = '22:00';
const fechaFormatter = new Intl.DateTimeFormat('es-PE', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  year: 'numeric',
});

export default function CursoFinanzasPage() {
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
                src="/images/flyercursos/PostFinanzas.png"
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
