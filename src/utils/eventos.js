function toDate(fecha) {
  return new Date(`${fecha}T12:00:00`);
}

function getEtiquetaSesion(numeroSesion) {
  const etiquetas = [
    'Primera',
    'Segunda',
    'Tercera',
    'Cuarta',
    'Quinta',
    'Sexta',
    'Septima',
    'Octava',
    'Novena',
    'Decima',
  ];

  return etiquetas[numeroSesion - 1] || `Sesion ${numeroSesion}`;
}

export function getEventoFechas(evento) {
  const sesiones =
    Array.isArray(evento.fechas) && evento.fechas.length > 0
      ? evento.fechas
          .map((item) => {
            if (typeof item === 'string') {
              return {
                fecha: item,
                hora_inicio: evento.hora_inicio,
                hora_fin: evento.hora_fin,
              };
            }

            return {
              fecha: item?.fecha,
              hora_inicio: item?.hora_inicio ?? evento.hora_inicio,
              hora_fin: item?.hora_fin ?? evento.hora_fin,
            };
          })
          .filter((sesion) => Boolean(sesion.fecha))
      : evento.fecha
        ? [
            {
              fecha: evento.fecha,
              hora_inicio: evento.hora_inicio,
              hora_fin: evento.hora_fin,
            },
          ]
        : [];

  return sesiones.sort((a, b) => toDate(a.fecha) - toDate(b.fecha));
}

export function getPrimeraFechaEvento(evento) {
  return getEventoFechas(evento)[0]?.fecha ?? null;
}

export function getEventosOrdenados(eventos) {
  return [...eventos].sort((a, b) => {
    const fechaA = getPrimeraFechaEvento(a);
    const fechaB = getPrimeraFechaEvento(b);

    if (!fechaA && !fechaB) return 0;
    if (!fechaA) return 1;
    if (!fechaB) return -1;

    return toDate(fechaA) - toDate(fechaB);
  });
}

export function expandEventosPorFechas(eventos) {
  return getEventosOrdenados(eventos).flatMap((evento) => {
    const sesiones = getEventoFechas(evento);

    return sesiones.map((sesion, index) => ({
      ...evento,
      fecha: sesion.fecha,
      hora_inicio: sesion.hora_inicio,
      hora_fin: sesion.hora_fin,
      idSesion: `${evento.id}-${sesion.fecha}-${index}`,
      eventoBaseId: evento.id,
      totalSesiones: sesiones.length,
      numeroSesion: index + 1,
      etiquetaSesion: `${getEtiquetaSesion(index + 1)} clase`,
    }));
  });
}
