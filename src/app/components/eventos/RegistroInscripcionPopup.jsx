'use client';

import { useEffect, useState } from 'react';

export default function RegistroInscripcionPopup({
  evento,
  onClose,
  flujoPagoCurso = false,
  whatsappNumero = '',
  modoWhatsApp = false,
}) {
  const abierta = Boolean(evento);
  const [modoLlamada, setModoLlamada] = useState(false);
  const [modoFormulario, setModoFormulario] = useState(false);
  const [pasoCurso, setPasoCurso] = useState(null);
  const [solicitudEnviada, setSolicitudEnviada] = useState(false);
  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [comprobante, setComprobante] = useState(null);
  const [enviando, setEnviando] = useState(false);
  const [feedback, setFeedback] = useState({ tipo: 'idle', mensaje: '' });

  const precioCurso = {
    CursoAntesdeseruno: '10 soles',
    finanzas: '20 soles por pareja',
    CursoAntesde: '10 soles',
    CursoMatrimoniosvirtual: '20 soles por pareja',
  }[evento?.id] || evento?.precio || 'el monto indicado';

  const abrirWhatsApp = () => {
    if (!whatsappNumero) return;

    const mensajeWhatsApp = encodeURIComponent(
      `Hola, necesito información sobre el curso ${evento.nombre}.`
    );
    window.open(`https://wa.me/${whatsappNumero}?text=${mensajeWhatsApp}`, '_blank', 'noopener,noreferrer');
  };

  useEffect(() => {
    if (!abierta) return undefined;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [abierta, onClose]);

  useEffect(() => {
    if (!abierta) return;

    setModoLlamada(false);
    setModoFormulario(false);
    setPasoCurso(flujoPagoCurso ? 'pago' : null);
    setSolicitudEnviada(false);
    setNombre('');
    setTelefono('');
    setMensaje('');
    setComprobante(null);
    setEnviando(false);
    setFeedback({ tipo: 'idle', mensaje: '' });
  }, [abierta, evento, flujoPagoCurso]);

  const enviarSolicitudLlamada = async (event) => {
    event.preventDefault();

    const nombreNormalizado = nombre.trim();
    const telefonoNormalizado = telefono.trim();
    const digitos = telefonoNormalizado.replace(/\D/g, '');

    if (nombreNormalizado.length < 2) {
      setFeedback({ tipo: 'error', mensaje: 'Ingresa tu nombre.' });
      return;
    }

    if (digitos.length < 7) {
      setFeedback({ tipo: 'error', mensaje: 'Ingresa un número de teléfono válido.' });
      return;
    }

    setEnviando(true);
    setFeedback({ tipo: 'idle', mensaje: '' });

    try {
      const response = await fetch('/api/inscripciones/llamada', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombre: nombreNormalizado,
          telefono: telefonoNormalizado,
          eventoNombre: evento?.nombre || '',
          ministerio: evento?.ministerio || '',
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data?.error || 'No pudimos enviar tu solicitud.');
      }

      setNombre('');
      setTelefono('');
      setFeedback({ tipo: 'idle', mensaje: '' });
      setSolicitudEnviada(true);
    } catch (error) {
      setFeedback({
        tipo: 'error',
        mensaje: error?.message || 'No pudimos registrar tu número. Intenta de nuevo.',
      });
    } finally {
      setEnviando(false);
    }
  };

  const enviarFormulario = async (event) => {
    event.preventDefault();

    const nombreNormalizado = nombre.trim();
    const telefonoNormalizado = telefono.trim();
    const digitos = telefonoNormalizado.replace(/\D/g, '');

    if (nombreNormalizado.length < 2) {
      setFeedback({ tipo: 'error', mensaje: 'Ingresa tu nombre.' });
      return;
    }

    if (digitos.length < 7) {
      setFeedback({ tipo: 'error', mensaje: 'Ingresa un número de teléfono válido.' });
      return;
    }

    setEnviando(true);
    setFeedback({ tipo: 'idle', mensaje: '' });

    try {
      const response = await fetch('/api/inscripciones/formulario', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: nombreNormalizado,
          telefono: telefonoNormalizado,
          cursoId: evento?.id || '',
          mensaje: mensaje.trim(),
        }),
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data?.detail || data?.error || 'No se pudo enviar el formulario.');
      }

      setSolicitudEnviada(true);
    } catch (error) {
      setFeedback({
        tipo: 'error',
        mensaje: error?.message || 'No se pudo enviar el formulario.',
      });
    } finally {
      setEnviando(false);
    }
  };

  const continuarDatosCurso = () => {
    const nombreNormalizado = nombre.trim();
    const telefonoNormalizado = telefono.trim();
    const digitos = telefonoNormalizado.replace(/\D/g, '');

    if (nombreNormalizado.length < 2) {
      setFeedback({ tipo: 'error', mensaje: 'Ingresa tu nombre completo.' });
      return;
    }

    if (digitos.length < 7) {
      setFeedback({ tipo: 'error', mensaje: 'Ingresa un número de teléfono válido.' });
      return;
    }

    setFeedback({ tipo: 'idle', mensaje: '' });
    setPasoCurso('comprobante');
  };

  const seleccionarComprobante = (event) => {
    const archivo = event.target.files?.[0];
    if (!archivo) return;

    if (!archivo.type.startsWith('image/')) {
      setComprobante(null);
      setFeedback({ tipo: 'error', mensaje: 'Selecciona una imagen del comprobante.' });
      return;
    }

    if (archivo.size > 5 * 1024 * 1024) {
      setComprobante(null);
      setFeedback({ tipo: 'error', mensaje: 'La imagen no debe superar los 5 MB.' });
      return;
    }

    const lector = new FileReader();
    lector.onload = () => {
      setComprobante({
        nombre: archivo.name,
        tipo: archivo.type,
        contenido: lector.result,
      });
      setFeedback({ tipo: 'idle', mensaje: '' });
    };
    lector.onerror = () => {
      setComprobante(null);
      setFeedback({ tipo: 'error', mensaje: 'No se pudo leer la imagen.' });
    };
    lector.readAsDataURL(archivo);
  };

  const enviarInscripcionCurso = async (event) => {
    event.preventDefault();

    const nombreNormalizado = nombre.trim();
    const telefonoNormalizado = telefono.trim();

    if (!comprobante) {
      setFeedback({ tipo: 'error', mensaje: 'Adjunta la captura del pago realizado.' });
      return;
    }

    setEnviando(true);
    setFeedback({ tipo: 'idle', mensaje: '' });

    try {
      const response = await fetch('/api/inscripciones/formulario', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: nombreNormalizado,
          telefono: telefonoNormalizado,
          cursoId: evento?.id || '',
          mensaje: 'Inscripción después de realizar el pago por Yape.',
          requiereComprobante: true,
          comprobante,
        }),
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data?.detail || data?.error || 'No se pudo enviar tu inscripción.');
      }

      setSolicitudEnviada(true);
    } catch (error) {
      setFeedback({
        tipo: 'error',
        mensaje: error?.message || 'No se pudo registrar tu inscripción. Intenta de nuevo.',
      });
    } finally {
      setEnviando(false);
    }
  };

  if (!abierta) return null;

  return (
    <div
      className="registro-popup-backdrop"
      role="presentation"
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="registro-popup" role="dialog" aria-modal="true" aria-labelledby="registro-popup-title">
        <button
          type="button"
          className="registro-popup-close"
          onClick={onClose}
          aria-label="Cerrar ventana de inscripción"
        >
          <i className="fas fa-times"></i>
        </button>

        {solicitudEnviada ? (
          <div className="registro-llamada-exito" role="status" aria-live="polite">
            {flujoPagoCurso ? (
              <>
                <p>¡Solicitud de registro exitosa!</p>
                <a
                  className="registro-whatsapp-btn"
                  href="https://wa.me/51910364746?text=Hola%2C%20acabo%20de%20registrarme%20en%20un%20curso%20y%20quiero%20unirme%20al%20grupo%20de%20WhatsApp."
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i className="fab fa-whatsapp" aria-hidden="true"></i>
                  Unirme al grupo de WhatsApp
                </a>
              </>
            ) : (
              <p>¡Solicitud de registro exitosa!</p>
            )}
          </div>
        ) : pasoCurso === 'pago' ? (
          <>
            <p className="registro-popup-tag">Inscripción al curso</p>
            <h3 id="registro-popup-title">Realiza tu pago</h3>
            <p className="registro-popup-evento">Curso: <strong>{evento.nombre}</strong></p>
            <div className="registro-pago-instrucciones">
              <p>Para inscribirte, realiza un pago de <strong>{precioCurso}</strong> por Yape al número:</p>
              <strong className="registro-pago-numero">910364746</strong>
              <p>Realiza el pago a nombre de <strong>Elizabeth Karem Santivanez Medina</strong>.</p>
              <img
                className="registro-pago-qr"
                src="/images/yape.png"
                alt="Código QR para pagar por Yape"
              />
              <p>Luego presiona continuar para completar tus datos.</p>
            </div>
            <button
              type="button"
              className="btn btn-primary registro-llamada-submit registro-pago-continuar"
              onClick={() => setPasoCurso('formulario')}
            >
              Continuar
            </button>
          </>
        ) : pasoCurso === 'formulario' ? (
          <>
            <p className="registro-popup-tag">Datos de inscripción</p>
            <h3 id="registro-popup-title">Completa tus datos</h3>
            <form className="registro-llamada-form" onSubmit={enviarInscripcionCurso}>
              <label className="registro-llamada-label" htmlFor="registro-curso">
                Curso
              </label>
              <input
                id="registro-curso"
                className="registro-llamada-input"
                value={evento.nombre}
                readOnly
              />

              <label className="registro-llamada-label" htmlFor="registro-nombre-curso">
                Nombre completo
              </label>
              <input
                id="registro-nombre-curso"
                name="nombre"
                type="text"
                className="registro-llamada-input"
                placeholder="Tu nombre completo"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
                autoFocus
              />

              <label className="registro-llamada-label" htmlFor="registro-telefono-curso">
                Número de teléfono
              </label>
              <input
                id="registro-telefono-curso"
                name="telefono"
                type="tel"
                inputMode="tel"
                className="registro-llamada-input"
                placeholder="Ejemplo: 999 999 999"
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                required
              />

              <button
                type="button"
                className="btn btn-primary registro-llamada-submit"
                onClick={continuarDatosCurso}
              >
                Continuar
              </button>
              {feedback.tipo === 'error' && (
                <p className="registro-llamada-feedback error">{feedback.mensaje}</p>
              )}
            </form>
          </>
        ) : pasoCurso === 'comprobante' ? (
          <>
            <p className="registro-popup-tag">Comprobante de pago</p>
            <h3 id="registro-popup-title">Sube tu captura</h3>
            <p className="registro-popup-evento">Adjunta la captura del pago de <strong>{precioCurso}</strong> realizado por Yape.</p>
            <form className="registro-llamada-form" onSubmit={enviarInscripcionCurso}>
              <label className="registro-llamada-label" htmlFor="registro-comprobante">
                Captura del pago
              </label>
              <input
                id="registro-comprobante"
                name="comprobante"
                type="file"
                accept="image/*"
                className="registro-comprobante-input"
                onChange={seleccionarComprobante}
                required
              />
              {comprobante && (
                <p className="registro-comprobante-nombre">Archivo seleccionado: {comprobante.nombre}</p>
              )}
              <button type="submit" className="btn btn-primary registro-llamada-submit" disabled={enviando}>
                {enviando ? 'Enviando...' : 'Enviar inscripción'}
              </button>
              {feedback.tipo === 'error' && (
                <p className="registro-llamada-feedback error">{feedback.mensaje}</p>
              )}
            </form>
          </>
        ) : modoFormulario ? (
          <>
            <p className="registro-popup-tag">Formulario de inscripción</p>
            <h3 id="registro-popup-title">Completa tus datos</h3>
            <p className="registro-popup-evento">Curso: <strong>{evento.nombre}</strong></p>
            <form className="registro-llamada-form" onSubmit={enviarFormulario}>
              <label className="registro-llamada-label" htmlFor="registro-formulario-nombre">
                Nombre completo
              </label>
              <input
                id="registro-formulario-nombre"
                name="nombre"
                type="text"
                className="registro-llamada-input"
                placeholder="Tu nombre completo"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
                autoFocus
              />

              <label className="registro-llamada-label" htmlFor="registro-formulario-telefono">
                Número de teléfono
              </label>
              <input
                id="registro-formulario-telefono"
                name="telefono"
                type="tel"
                inputMode="tel"
                className="registro-llamada-input"
                placeholder="Ejemplo: 999 999 999"
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                required
              />

              <label className="registro-llamada-label" htmlFor="registro-formulario-mensaje">
                Consulta
              </label>
              <textarea
                id="registro-formulario-mensaje"
                name="mensaje"
                className="registro-llamada-input registro-formulario-textarea"
                placeholder="Escribe tu consulta"
                rows="4"
                value={mensaje}
                onChange={(e) => setMensaje(e.target.value)}
                required
              />

              <button type="submit" className="btn btn-primary registro-llamada-submit" disabled={enviando}>
                {enviando ? 'Enviando...' : 'Enviar formulario'}
              </button>
              {feedback.tipo === 'error' && (
                <p className="registro-llamada-feedback error">{feedback.mensaje}</p>
              )}
            </form>
          </>
        ) : (
          <>
            <p className="registro-popup-tag">Inscripción</p>
            <h3 id="registro-popup-title">{modoLlamada ? 'Déjanos tu nombre y número' : '¿Cómo quieres inscribirte?'}</h3>
            <p className="registro-popup-evento">Evento: <strong>{evento.nombre}</strong></p>

            {modoLlamada ? (
              <form className="registro-llamada-form" onSubmit={enviarSolicitudLlamada}>
                <label className="registro-llamada-label" htmlFor="registro-nombre">
                  Nombre
                </label>
                <input
                  id="registro-nombre"
                  name="nombre"
                  type="text"
                  className="registro-llamada-input"
                  placeholder="Tu nombre"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  required
                  autoFocus
                />

                <label className="registro-llamada-label" htmlFor="registro-telefono">
                  Número de teléfono
                </label>
                <input
                  id="registro-telefono"
                  name="telefono"
                  type="tel"
                  inputMode="tel"
                  className="registro-llamada-input"
                  placeholder="Ejemplo: 999 999 999"
                  value={telefono}
                  onChange={(e) => setTelefono(e.target.value)}
                  required
                />

                <button type="submit" className="btn btn-primary registro-llamada-submit" disabled={enviando}>
                  {enviando ? 'Enviando...' : 'Enviar'}
                </button>

                {feedback.tipo === 'error' && (
                  <p className="registro-llamada-feedback error">{feedback.mensaje}</p>
                )}
              </form>
            ) : (
              <div className="registro-popup-options">
                <button
                  type="button"
                  className="registro-popup-option registro-popup-option-call"
                  onClick={() => {
                    if (modoWhatsApp && whatsappNumero) {
                      abrirWhatsApp();
                    } else if (modoWhatsApp) {
                      setFeedback({ tipo: 'error', mensaje: 'Este curso aún no tiene un número de WhatsApp configurado.' });
                    } else {
                      setModoLlamada(true);
                      setSolicitudEnviada(false);
                      setFeedback({ tipo: 'idle', mensaje: '' });
                    }
                  }}
                >
                  <i className={modoWhatsApp ? 'fab fa-whatsapp' : 'fas fa-phone'}></i>
                  <span>{modoWhatsApp
                    ? 'Quiero enviar un mensaje de WhatsApp para más información'
                    : 'Quiero que me llamen para inscribirme'}</span>
                </button>

                <button
                  type="button"
                  className="registro-popup-option registro-popup-option-form"
                  onClick={() => {
                    setModoFormulario(true);
                    setFeedback({ tipo: 'idle', mensaje: '' });
                  }}
                >
                  <i className="fas fa-file-signature"></i>
                  <span>Quiero rellenar un formulario para inscribirme</span>
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}