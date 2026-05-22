import Link from 'next/link';

const cursoTitle = 'Sanando y Fortaleciendo Matrimonios - 1';
const cursoDescripcion =
  'Dirigido a matrimonios que desean fortalecer y restaurar sus relaciones conforme al diseño de Dios.';
const cursoResponsables = 'Pr. Jaime Espiritu y Betty Javier';
const manualHref = '/manuales/pendiente.pdf';
const inscripcionHref = `/contacto?${new URLSearchParams({
  tipo: 'inscripcion',
  preferencia: 'formulario',
  cursoId: 'CursoMatrimonios',
  evento: cursoTitle,
}).toString()}`;

const fechasCurso = [
  '2026-05-03',
  '2026-05-10',
  '2026-05-17',
  '2026-05-24',
  '2026-05-31',
  '2026-06-07',
  '2026-06-14',
  '2026-06-21',
  '2026-06-28',
  '2026-07-05',
  '2026-07-12',
  '2026-07-19',
  '2026-07-26',
  '2026-08-02',
  '2026-08-09',
  '2026-08-16',
  '2026-08-23',
  '2026-08-30',
];
const horaInicio = '16:00';
const horaFin = '18:00';
const fechaFormatter = new Intl.DateTimeFormat('es-PE', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  year: 'numeric',
});

export default function CursoMatrimoniosPage() {
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
                src="/images/flyercursos/PostMatrimonios.png"
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
