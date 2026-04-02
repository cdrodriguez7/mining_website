// Serverless function — llama a MetalpriceAPI desde el servidor
// para evitar problemas de CORS y no exponer la API key en el cliente.
// Desplegado en Vercel como GET /api/metalprice
const https = require('https');

module.exports = async (req: any, res: any) => {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // API key: variable de entorno en Vercel (METALPRICE_API_KEY)
  // o valor hardcodeado como fallback para desarrollo local
  const apiKey = process.env.METALPRICE_API_KEY || '25d0e09e06c131e31f3900e844a22fbd';
  const symbols = 'XAU,XAG';
  const upstream = `https://api.metalpriceapi.com/v1/latest?api_key=${apiKey}&base=USD&currencies=${symbols}`;

  console.log('[metalprice] Consultando MetalpriceAPI...');

  try {
    const data = await fetchJson(upstream);

    if (!data?.success) {
      console.error('[metalprice] API retornó error:', data?.error);
      return res.status(502).json({ success: false, error: data?.error ?? 'API error' });
    }

    console.log('[metalprice] Respuesta OK, rates:', Object.keys(data.rates ?? {}));

    // Cache corto (5 min en Vercel Edge) para no agotar la cuota del plan gratuito
    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=60');
    return res.status(200).json(data);

  } catch (err: any) {
    console.error('[metalprice] Error de red:', err.message);
    return res.status(502).json({ success: false, error: err.message });
  }
};

function fetchJson(url: string): Promise<any> {
  return new Promise((resolve, reject) => {
    https.get(url, (response: any) => {
      let raw = '';
      response.on('data', (chunk: any) => { raw += chunk; });
      response.on('end', () => {
        try { resolve(JSON.parse(raw)); }
        catch (e) { reject(new Error('Respuesta no es JSON válido')); }
      });
    }).on('error', reject);
  });
}
