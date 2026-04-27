/**
 * POST /api/contact
 * Guarda la solicitud de contacto en Google Sheets.
 *
 * Variables de entorno requeridas en Vercel y .env.local:
 *   GOOGLE_CLIENT_ID       — OAuth2 client ID
 *   GOOGLE_CLIENT_SECRET   — OAuth2 client secret
 *   GOOGLE_REDIRECT_URI    — https://developers.google.com/oauthplayground
 *   GOOGLE_REFRESH_TOKEN   — refresh token obtenido desde OAuth Playground
 *   GOOGLE_SPREADSHEET_ID  — ID del spreadsheet de la URL de Google Sheets
 */
const { google } = require('googleapis');

const TIPO_LABEL: Record<string, string> = {
  cotizacion:  'Solicitud de Cotización',
  informacion: 'Información General',
  operaciones: 'Consulta Operaciones',
  otro:        'Otro'
};

module.exports = async (req: any, res: any) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') { res.status(200).end(); return; }
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  const { tipoSolicitud, nombre, empresa, email, telefono, asunto, mensaje } = req.body ?? {};

  // Validación server-side
  if (!nombre || !email || !asunto || !mensaje) {
    return res.status(400).json({ success: false, error: 'Faltan campos obligatorios.' });
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ success: false, error: 'Email inválido.' });
  }

  const clientId      = process.env['GOOGLE_CLIENT_ID'];
  const clientSecret  = process.env['GOOGLE_CLIENT_SECRET'];
  const redirectUri   = process.env['GOOGLE_REDIRECT_URI'];
  const refreshToken  = process.env['GOOGLE_REFRESH_TOKEN'];
  const spreadsheetId = process.env['GOOGLE_SPREADSHEET_ID'];

  if (!clientId || !clientSecret || !redirectUri || !refreshToken || !spreadsheetId) {
    console.error('[contact] Variables de entorno de Google Sheets no configuradas');
    return res.status(500).json({ success: false, error: 'Servicio no configurado.' });
  }

  try {
    const auth = new google.auth.OAuth2(clientId, clientSecret, redirectUri);
    auth.setCredentials({ refresh_token: refreshToken });

    const sheets = google.sheets({ version: 'v4', auth });

    const now = new Date();
    const fecha = now.toLocaleDateString('es-EC', { timeZone: 'America/Guayaquil' });
    const hora  = now.toLocaleTimeString('es-EC', { timeZone: 'America/Guayaquil', hour: '2-digit', minute: '2-digit' });

    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: 'Contacto!A:I',
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [[
          fecha,
          hora,
          TIPO_LABEL[tipoSolicitud] ?? tipoSolicitud ?? '—',
          nombre,
          empresa || '—',
          email,
          telefono || '—',
          asunto,
          mensaje
        ]]
      }
    });

    console.log(`[contact] Solicitud guardada: ${nombre} <${email}>`);
    return res.status(200).json({ success: true });

  } catch (err: any) {
    console.error('[contact] Error Google Sheets:', err.message, err.code, err.status, JSON.stringify(err.errors));
    return res.status(502).json({ success: false, error: err.message ?? 'Error al guardar la solicitud.' });
  }
};
