// Serverless function — llama a MetalpriceAPI y Yahoo Finance desde el servidor
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
  const apiKey = process.env['METALPRICE_API_KEY'] || '25d0e09e06c131e31f3900e844a22fbd';
  const symbols = 'XAU,XAG';
  const upstream = `https://api.metalpriceapi.com/v1/latest?api_key=${apiKey}&base=USD&currencies=${symbols}`;

  console.log('[metalprice] Consultando MetalpriceAPI y Yahoo Finance...');

  try {
    const [data, copperData] = await Promise.all([
      fetchJson(upstream).catch(err => {
        console.error('[metalprice] Error Metalprice:', err.message);
        return null;
      }),
      fetchJson('https://query1.finance.yahoo.com/v8/finance/chart/HG=F').catch(err => {
        console.error('[metalprice] Error Yahoo Finance (Cobre):', err.message);
        return null;
      })
    ]);

    if (!data || !data.success) {
      console.error('[metalprice] API retornó error:', data?.error);
      return res.status(502).json({ success: false, error: data?.error ?? 'API error' });
    }

    console.log('[metalprice] Respuesta OK, rates:', Object.keys(data.rates ?? {}));

    if (copperData?.chart?.result?.[0]?.meta?.regularMarketPrice) {
      const copperPrice = copperData.chart.result[0].meta.regularMarketPrice;
      if (!data.rates) data.rates = {};
      data.rates['XCU'] = 1 / copperPrice;
      console.log('[metalprice] Precio de cobre obtenido:', copperPrice);
    }

    // Cache corto (5 min en Vercel Edge) para no agotar la cuota del plan gratuito
    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=60');
    return res.status(200).json(data);

  } catch (err: any) {
    console.error('[metalprice] Error general:', err.message);
    return res.status(502).json({ success: false, error: err.message });
  }
};

function fetchJson(url: string): Promise<any> {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } }, (response: any) => {
      let raw = '';
      response.on('data', (chunk: any) => { raw += chunk; });
      response.on('end', () => {
        try { resolve(JSON.parse(raw)); }
        catch (e) { reject(new Error('Respuesta no es JSON válido')); }
      });
    }).on('error', reject);
  });
}

export {};
