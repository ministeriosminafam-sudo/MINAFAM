import Link from 'next/link';

const cursoTitle = 'Sanando y Fortaleciendo Matrimonios VIRTUAL - 1';
const cursoDescripcion =
  'Dirigido a matrimonios que desean fortalecer y restaurar sus relaciones conforme al diseño de Dios.';
const cursoResponsables = 'Pr. Jaime Espiritu y Betty Javier';
const manualHref = '/manuales/pendiente.pdf';
const inscripcionHref = `/contacto?${new URLSearchParams({
  tipo: 'inscripcion',
  preferencia: 'formulario',
  cursoId: 'CursoMatrimoniosvirtual',
  evento: cursoTitle,
}).toString()}`;

const fechasCurso = [
  '2026-05-23',
  '2026-05-30',
  '2026-06-06',
  '2026-06-13',
  '2026-06-20',
  '2026-06-27',
  '2026-07-04',
  '2026-07-11',
  '2026-07-18',
  '2026-07-25',
  '2026-08-01',
  '2026-08-08',
  '2026-08-15',
  '2026-08-22',
  '2026-08-29',
  '2026-09-05',
  '2026-09-12',
  '2026-09-19',
];
const horaInicio = '20:30';
const horaFin = '21:30';
const fechaFormatter = new Intl.DateTimeFormat('es-PE', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  year: 'numeric',
});

export default function CursoMatrimoniosVirtualPage() {
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
                src="/images/flyercursos/MATRIMONIOSVIRTUAL.png"
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
