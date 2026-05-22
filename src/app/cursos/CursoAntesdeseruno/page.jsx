import Link from 'next/link';

const cursoTitle = 'Antes de ser uno - Curso para Novios';
const cursoDescripcion =
  'Este curso es una guía práctica y espiritual diseñada para parejas en etapa de noviazgo que desean prepararse en serio para el matrimonio, poniendo a Cristo como la base de su proyecto de vida.';
const cursoResponsables = 'Hector Yaranga y Katy';
const manualHref = '/manuales/manual_ADSU.pdf';
const inscripcionHref = `/contacto?${new URLSearchParams({
  tipo: 'inscripcion',
  preferencia: 'formulario',
  cursoId: 'CursoAntesdeseruno',
  evento: cursoTitle,
}).toString()}`;

const fechasCurso = [
  '2026-05-18',
  '2026-05-25',
  '2026-06-01',
  '2026-06-08',
  '2026-06-15',
  '2026-06-22',
  '2026-06-29',
  '2026-07-06',
  '2026-07-13',
  '2026-07-20',
  '2026-07-27',
];
const horaInicio = '20:30';
const horaFin = '22:00';
const fechaFormatter = new Intl.DateTimeFormat('es-PE', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  year: 'numeric',
});

export default function CursoAntesDeSerUnoPage() {
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
                src="/images/flyercursos/PostADSU.png"
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
