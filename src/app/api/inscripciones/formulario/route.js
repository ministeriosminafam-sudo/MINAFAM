import { NextResponse } from 'next/server';
import eventos from '../../../../../data/eventos.json';

function normalizeMinisterio(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLowerCase();
}

function resolveMinisterioSection(ministerio) {
  const normalized = normalizeMinisterio(ministerio);

  if (normalized.includes('matrimonios')) return 'matrimonios';
  if (normalized.includes('novios')) return 'novios';
  if (normalized.includes('finanzas')) return 'finanzas';
  if (normalized.includes('jovenes')) return 'Jovenes';

  return 'llamadas directas';
}

function sanitizeName(value) {
  return String(value || '').trim();
}

function sanitizePhone(value) {
  return String(value || '').trim();
}

function sanitizeMessage(value) {
  return String(value || '').trim();
}

function sanitizeReceipt(value) {
  if (!value || typeof value !== 'object') return null;

  const nombre = String(value.nombre || '').trim();
  const tipo = String(value.tipo || '').trim().toLowerCase();
  const contenido = String(value.contenido || '').trim();

  if (!nombre || !tipo.startsWith('image/') || !contenido.startsWith('data:image/')) {
    return null;
  }

  return { nombre, tipo, contenido };
}

export async function POST(request) {
  let body;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: 'No se pudo leer la solicitud.' },
      { status: 400 }
    );
  }

  const nombre = sanitizeName(body?.nombre);
  const telefono = sanitizePhone(body?.telefono);
  const mensaje = sanitizeMessage(body?.mensaje);
  const cursoId = String(body?.cursoId || '').trim();
  const requiereComprobante = body?.requiereComprobante === true;
  const comprobante = sanitizeReceipt(body?.comprobante);

  if (nombre.length < 2) {
    return NextResponse.json(
      { error: 'Nombre inválido.' },
      { status: 400 }
    );
  }

  const digitos = telefono.replace(/\D/g, '');
  if (digitos.length < 7) {
    return NextResponse.json(
      { error: 'Número de teléfono inválido.' },
      { status: 400 }
    );
  }

  if (!cursoId) {
    return NextResponse.json(
      { error: 'Selecciona un curso.' },
      { status: 400 }
    );
  }

  if (requiereComprobante && !comprobante) {
    return NextResponse.json(
      { error: 'Adjunta una captura válida del pago.' },
      { status: 400 }
    );
  }

  const curso = eventos.find((evento) => evento.id === cursoId);
  if (!curso) {
    return NextResponse.json(
      { error: 'Curso no válido.' },
      { status: 400 }
    );
  }

  const ministerio = String(curso.ministerio || '').trim();
  const seccionMinisterio = resolveMinisterioSection(ministerio);

  const payload = {
    fecha: new Date().toISOString(),
    nombre,
    telefono,
    curso: curso.nombre,
    mensaje: mensaje || 'Inscripción por formulario',
    seccionPrincipal: 'formularios cursos',
    ministerio,
    seccionesDestino: [seccionMinisterio],
    ...(comprobante ? { comprobante } : {}),
  };

  const webhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL;
  if (!webhookUrl) {
    return NextResponse.json(
      {
        error:
          'Falta configurar GOOGLE_SHEETS_WEBHOOK_URL para enviar datos a Google Sheets.',
      },
      { status: 500 }
    );
  }

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
      cache: 'no-store',
    });

    const responseText = await response.text();
    let webhookData = null;

    try {
      webhookData = JSON.parse(responseText);
    } catch {
      webhookData = null;
    }

    const comprobanteNoConfirmado = requiereComprobante && !webhookData?.comprobanteUrl;

    if (!response.ok || webhookData?.ok === false || comprobanteNoConfirmado) {
      return NextResponse.json(
        {
          error: 'Google Sheets rechazó la solicitud.',
          detail: webhookData?.error || (comprobanteNoConfirmado
            ? 'Apps Script no devolvió el enlace del comprobante. Verifica que la implementación desplegada incluya DriveApp y la columna COMPROBANTE.'
            : responseText.slice(0, 400)),
        },
        { status: 502 }
      );
    }

    return NextResponse.json({
      ok: true,
      message: 'Inscripción enviada correctamente.',
      comprobanteUrl: webhookData?.comprobanteUrl || null,
    });
  } catch {
    return NextResponse.json(
      { error: 'No fue posible conectar con Google Sheets.' },
      { status: 502 }
    );
  }
}
