'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';

const DIAS = ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'];
const MESES = [
  'Enero',
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Diciembre',
];

const MINISTERIO_COLORS = {
  'matrimonios y familias': '#c0392b',
  novios: '#2563eb',
  jovenes: '#0d9488',
  finanzas: '#f59e0b',
  general: '#64748b',
};

const MIXED_DAY_COLOR = '#7c3aed';
const DEFAULT_MINISTERIO_COLOR = '#0ea5a4';

function toDate(fecha) {
  return new Date(`${fecha}T12:00:00`);
}

function formatDateKey(fecha) {
  const year = fecha.getFullYear();
  const month = String(fecha.getMonth() + 1).padStart(2, '0');
  const day = String(fecha.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function normalizeMinisterioName(ministerio) {
  return String(ministerio || 'General')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLowerCase();
}

function getMinisterioColor(ministerio) {
  return MINISTERIO_COLORS[normalizeMinisterioName(ministerio)] || DEFAULT_MINISTERIO_COLOR;
}

function hexToRgba(hex, alpha) {
  if (typeof hex !== 'string' || !hex.startsWith('#')) {
    return `rgba(192,57,43,${alpha})`;
  }

  const normalized = hex.length === 4
    ? `#${hex[1]}${hex[1]}${hex[2]}${hex[2]}${hex[3]}${hex[3]}`
    : hex;

  const r = parseInt(normalized.slice(1, 3), 16);
  const g = parseInt(normalized.slice(3, 5), 16);
  const b = parseInt(normalized.slice(5, 7), 16);

  return `rgba(${r},${g},${b},${alpha})`;
}

export default function EventosCalendar({
  eventos,
  showCta = false,
  ctaHref = '/eventos',
  ctaLabel = 'Ver todos los eventos',
}) {
  const eventosOrdenados = useMemo(
    () => [...eventos].sort((a, b) => toDate(a.fecha) - toDate(b.fecha)),
    [eventos]
  );

  const mesInicial = useMemo(() => {
    if (eventosOrdenados.length === 0) {
      const hoy = new Date();
      return new Date(hoy.getFullYear(), hoy.getMonth(), 1);
    }

    const primeraFecha = toDate(eventosOrdenados[0].fecha);
    return new Date(primeraFecha.getFullYear(), primeraFecha.getMonth(), 1);
  }, [eventosOrdenados]);

  const [mesActual, setMesActual] = useState(mesInicial);
  const [fechaSeleccionada, setFechaSeleccionada] = useState(
    eventosOrdenados[0]?.fecha ?? formatDateKey(mesInicial)
  );
  const [eventoActivoIndex, setEventoActivoIndex] = useState(0);

  const eventosPorFecha = useMemo(() => {
    const mapa = new Map();
    for (const evento of eventosOrdenados) {
      if (!mapa.has(evento.fecha)) {
        mapa.set(evento.fecha, []);
      }
      mapa.get(evento.fecha).push(evento);
    }
    return mapa;
  }, [eventosOrdenados]);

  useEffect(() => {
    const year = mesActual.getFullYear();
    const month = mesActual.getMonth();

    const primerEventoMes = eventosOrdenados.find((evento) => {
      const fechaEvento = toDate(evento.fecha);
      return fechaEvento.getFullYear() === year && fechaEvento.getMonth() === month;
    });

    if (primerEventoMes) {
      setFechaSeleccionada(primerEventoMes.fecha);
      return;
    }

    setFechaSeleccionada(formatDateKey(new Date(year, month, 1)));
  }, [mesActual, eventosOrdenados]);

  useEffect(() => {
    setEventoActivoIndex(0);
  }, [fechaSeleccionada]);

  const year = mesActual.getFullYear();
  const month = mesActual.getMonth();
  const primerDiaSemana = new Date(year, month, 1).getDay();
  const diasDelMes = new Date(year, month + 1, 0).getDate();
  const celdas = Array.from({ length: primerDiaSemana + diasDelMes }, (_, index) => {
    const dia = index - primerDiaSemana + 1;
    return dia > 0 ? dia : null;
  });

  const eventosDelDia = eventosPorFecha.get(fechaSeleccionada) ?? [];
  const eventoPrincipal = eventosDelDia[eventoActivoIndex] ?? eventosDelDia[0] ?? null;
  const etiquetaSesionActual = eventoPrincipal?.etiquetaSesion;

  const eventosEnMesActual = useMemo(
    () =>
      eventosOrdenados.filter((evento) => {
        const fechaEvento = toDate(evento.fecha);
        return fechaEvento.getFullYear() === year && fechaEvento.getMonth() === month;
      }),
    [eventosOrdenados, year, month]
  );

  const ministeriosEnVista = useMemo(
    () => [...new Set(eventosOrdenados.map((evento) => evento.ministerio || 'General'))],
    [eventosOrdenados]
  );

  return (
    <>
      <div className="eventos-calendar-shell">
        <div className="calendar-panel">
          <div className="calendar-title-row">
            <h3><i className="fas fa-calendar-alt"></i> Calendario de Eventos</h3>
          </div>

          <div className="calendar-controls">
            <button
              type="button"
              className="calendar-nav"
              onClick={() => setMesActual(new Date(year, month - 1, 1))}
              aria-label="Mes anterior"
            >
              <i className="fas fa-chevron-left"></i>
            </button>
            <h4>{MESES[month]} {year}</h4>
            <button
              type="button"
              className="calendar-nav"
              onClick={() => setMesActual(new Date(year, month + 1, 1))}
              aria-label="Mes siguiente"
            >
              <i className="fas fa-chevron-right"></i>
            </button>
          </div>

          <div className="calendar-weekdays">
            {DIAS.map((dia) => (
              <span key={dia}>{dia}</span>
            ))}
          </div>

          <div className="calendar-days-grid">
            {celdas.map((dia, index) => {
              if (!dia) {
                return <span key={`empty-${index}`} className="calendar-day-empty" aria-hidden="true"></span>;
              }

              const fecha = new Date(year, month, dia);
              const dateKey = formatDateKey(fecha);
              const eventosEnFecha = eventosPorFecha.get(dateKey) ?? [];
              const cantidadEventos = eventosEnFecha.length;
              const tieneEvento = cantidadEventos > 0;
              const esCursoSemanal = eventosEnFecha.some((evento) => evento.totalSesiones > 1);
              const ministeriosEnFecha = [...new Set(eventosEnFecha.map((evento) => evento.ministerio || 'General'))];
              const colorDia = ministeriosEnFecha.length > 1
                ? MIXED_DAY_COLOR
                : ministeriosEnFecha.length === 1
                  ? getMinisterioColor(ministeriosEnFecha[0])
                  : null;
              const esSeleccionada = fechaSeleccionada === dateKey;
              const estilosDia = colorDia
                ? {
                    '--calendar-day-color': colorDia,
                    '--calendar-day-fill': hexToRgba(colorDia, 0.12),
                    '--calendar-day-fill-hover': hexToRgba(colorDia, 0.18),
                    '--calendar-day-fill-selected': hexToRgba(colorDia, 0.28),
                  }
                : undefined;

              return (
                <button
                  key={dateKey}
                  type="button"
                  className={`calendar-day${tieneEvento ? ' has-event' : ''}${esCursoSemanal ? ' weekly-course' : ''}${esSeleccionada ? ' selected' : ''}`}
                  style={estilosDia}
                  onClick={() => setFechaSeleccionada(dateKey)}
                  aria-label={
                    tieneEvento
                      ? `Seleccionar ${dia} de ${MESES[month]}, con ${cantidadEventos} evento${cantidadEventos > 1 ? 's' : ''}`
                      : `Seleccionar ${dia} de ${MESES[month]}`
                  }
                >
                  <span>{dia}</span>
                  {tieneEvento && (
                    <span className="event-dots" aria-hidden="true">
                      {eventosEnFecha.slice(0, 3).map((evento, dotIndex) => (
                        <i
                          className="event-dot"
                          key={`${dateKey}-dot-${dotIndex}`}
                          style={{ backgroundColor: getMinisterioColor(evento.ministerio || 'General') }}
                        ></i>
                      ))}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="calendar-legend">
            <span><i className="legend-box legend-box-outline"></i> Con evento</span>
            {ministeriosEnVista.map((ministerio) => {
              const color = getMinisterioColor(ministerio);

              return (
                <span key={`legend-${ministerio}`}>
                  <i
                    className="legend-box legend-box-ministerio"
                    style={{
                      borderColor: color,
                      backgroundColor: hexToRgba(color, 0.2),
                    }}
                  ></i>
                  {ministerio}
                </span>
              );
            })}
            <span><i className="legend-box legend-box-fill"></i> Seleccionado</span>
          </div>
        </div>

        <div className="evento-banner-panel">
          {eventoPrincipal ? (
            <article className="evento-banner" key={eventoPrincipal.idSesion || eventoPrincipal.id}>
              {eventosDelDia.length > 1 ? (
                <div className="evento-banner-media multi">
                  <div className="evento-banner-media-grid">
                    {eventosDelDia.map((evento, index) => (
                      <button
                        key={evento.idSesion || evento.id}
                        type="button"
                        className={`evento-banner-media-item-btn${eventoActivoIndex === index ? ' active' : ''}`}
                        onClick={() => setEventoActivoIndex(index)}
                        aria-label={`Ver detalles de ${evento.nombre}`}
                      >
                        <div className="evento-banner-media-item">
                          <img
                            src={
                              evento.imagen ||
                              `https://placehold.co/720x360/c0392b/ffffff?text=${encodeURIComponent(evento.nombre)}`
                            }
                            alt={evento.nombre}
                          />
                          {evento.featured && <span className="evento-badge">Destacado</span>}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="evento-banner-media">
                  <img
                    src={
                      eventoPrincipal.imagen ||
                      `https://placehold.co/720x360/c0392b/ffffff?text=${encodeURIComponent(eventoPrincipal.nombre)}`
                    }
                    alt={eventoPrincipal.nombre}
                  />
                  {eventoPrincipal.featured && <span className="evento-badge">Destacado</span>}
                </div>
              )}
              <div className="evento-banner-content">
                {eventosDelDia.length > 1 && (
                  <div className="evento-banner-switcher" role="tablist" aria-label="Seleccionar evento del día">
                    {eventosDelDia.map((evento, index) => (
                      <button
                        key={`${evento.idSesion || evento.id}-switch`}
                        type="button"
                        className={`evento-switch-chip${eventoActivoIndex === index ? ' active' : ''}`}
                        onClick={() => setEventoActivoIndex(index)}
                        aria-pressed={eventoActivoIndex === index}
                      >
                        {evento.etiquetaSesion || `Sesion ${index + 1} clase`}
                      </button>
                    ))}
                  </div>
                )}

                {etiquetaSesionActual && (
                  <p className="evento-banner-session-label">
                    {etiquetaSesionActual}
                  </p>
                )}

                <p className="evento-banner-date">
                  <i className="fas fa-calendar-alt"></i>
                  {toDate(eventoPrincipal.fecha).toLocaleDateString('es-ES', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </p>
                <h3>{eventoPrincipal.nombre}</h3>
                <p>{eventoPrincipal.descripcion}</p>

                <div className="evento-banner-meta">
                  <span><i className="fas fa-map-marker-alt"></i> {eventoPrincipal.ubicacion}</span>
                  <span><i className="fas fa-clock"></i> {eventoPrincipal.hora_inicio}</span>
                </div>

                {eventosDelDia.length > 1 && (
                  <p className="evento-extra-count">
                    Se muestran {eventosDelDia.length} flyers. Estás viendo el evento {eventoActivoIndex + 1} de {eventosDelDia.length}.
                  </p>
                )}

                <Link href="/eventos" className="btn btn-sm btn-primary">Ver detalles</Link>
              </div>
            </article>
          ) : (
            <div className="evento-empty">
              <i className="fas fa-calendar-day"></i>
              <h3>{eventosEnMesActual.length === 0 ? 'No hay eventos este mes' : 'No hay eventos esta fecha'}</h3>
              <p>
                {eventosEnMesActual.length === 0
                  ? 'Selecciona otro mes para ver los próximos eventos.'
                  : 'Prueba con otro día que tenga marca de evento en el calendario.'}
              </p>
            </div>
          )}
        </div>
      </div>

      {showCta && (
        <div className="section-cta">
          <Link href={ctaHref} className="btn btn-outline">{ctaLabel}</Link>
        </div>
      )}
    </>
  );
}