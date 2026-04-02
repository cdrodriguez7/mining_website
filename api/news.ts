import https from 'https';
import http from 'http';
import { URL } from 'url';

// ─── Fuentes RSS ──────────────────────────────────────────────────────────────
const NEWS_SOURCES = [
  { url: 'https://www.mining.com/feed/',                 source: 'Mining.com',      category: 'Internacional' },
  { url: 'https://www.mch.cl/feed/',                    source: 'Minería Chilena',  category: 'Internacional' },
  { url: 'https://www.bnamericas.com/rss/news/mining',  source: 'BNamericas',       category: 'Regional'      }
];

interface NewsItem {
  id: string;
  title: string;
  description: string;
  link: string;
  pubDate: string;
  source: string;
  image?: string;
  category: string;
}

// ─── Fetch con redirects y timeout configurable ───────────────────────────────
function fetchUrl(url: string, timeoutMs = 8000, redirects = 4): Promise<string> {
  return new Promise((resolve, reject) => {
    if (redirects === 0) return reject(new Error('Too many redirects'));

    let parsed: URL;
    try { parsed = new URL(url); } catch { return reject(new Error('Invalid URL')); }

    const client = parsed.protocol === 'https:' ? https : http;

    const req = (client as typeof https).get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; MiningNewsBot/1.0; +https://plampromin.ec)',
        'Accept': 'text/html,application/xhtml+xml,application/xml,*/*'
      }
    }, (res) => {
      if ((res.statusCode === 301 || res.statusCode === 302 || res.statusCode === 307)
          && res.headers.location) {
        const next = res.headers.location.startsWith('http')
          ? res.headers.location
          : new URL(res.headers.location, url).href;
        return fetchUrl(next, timeoutMs, redirects - 1).then(resolve).catch(reject);
      }
      if (res.statusCode && res.statusCode >= 400) return reject(new Error(`HTTP ${res.statusCode}`));

      let data = '';
      res.setEncoding('utf8');
      res.on('data', (c: string) => { data += c; });
      res.on('end', () => resolve(data));
      res.on('error', reject);
    });

    req.setTimeout(timeoutMs, () => { req.destroy(); reject(new Error('Timeout')); });
    req.on('error', reject);
  });
}

// ─── Scraping de og:image desde la página del artículo ───────────────────────
async function scrapeOgImage(articleUrl: string): Promise<string | undefined> {
  try {
    const html = await fetchUrl(articleUrl, 4000); // timeout corto — caché lo paga una vez/semana

    // og:image (formato estándar y variantes)
    const og = /<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i.exec(html)
            || /<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i.exec(html);
    if (og && og[1].startsWith('http')) return og[1];

    // twitter:image como fallback secundario
    const tw = /<meta[^>]+name=["']twitter:image["'][^>]+content=["']([^"']+)["']/i.exec(html)
            || /<meta[^>]+content=["']([^"']+)["'][^>]+name=["']twitter:image["']/i.exec(html);
    if (tw && tw[1].startsWith('http')) return tw[1];

    return undefined;
  } catch {
    return undefined;
  }
}

// ─── Parser RSS ───────────────────────────────────────────────────────────────
function parseRSS(xml: string, source: string, category: string): NewsItem[] {
  const items: NewsItem[] = [];
  const itemRegex = /<item>([\s\S]*?)<\/item>/g;
  let match: RegExpExecArray | null;

  while ((match = itemRegex.exec(xml)) !== null) {
    const block = match[1];

    const title       = extractTag(block, 'title');
    const link        = extractTag(block, 'link') || extractTag(block, 'guid');
    const contentFull = extractTag(block, 'content:encoded') || '';
    const rawDesc     = extractTag(block, 'description') || '';
    const description = stripHtml(contentFull || rawDesc).slice(0, 300);
    const pubDate     = extractTag(block, 'pubDate') || extractTag(block, 'dc:date') || new Date().toISOString();
    const image       = extractImage(block, contentFull);

    if (!title || !link) continue;

    items.push({
      id: Buffer.from(link).toString('base64').slice(0, 24),
      title: stripHtml(title).slice(0, 200),
      description,
      link,
      pubDate,
      source,
      image,
      category
    });
  }

  return items.slice(0, 8);
}

function extractTag(xml: string, tag: string): string {
  const cdata = new RegExp(`<${tag}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]><\\/${tag}>`, 'i').exec(xml);
  if (cdata) return cdata[1].trim();
  const normal = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'i').exec(xml);
  if (normal) return normal[1].trim();
  return '';
}

function extractImage(block: string, contentEncoded: string): string | undefined {
  // 1. media:thumbnail — más común en feeds WordPress/Jetpack
  const thumb = /<media:thumbnail[^>]+url=["']([^"']+)["']/i.exec(block);
  if (thumb) return thumb[1];

  // 2. media:content con atributo medium="image" o type="image/..."
  const mc1 = /<media:content[^>]+url=["']([^"']+)["'][^>]*(?:medium=["']image["']|type=["']image\/)/i.exec(block)
           || /<media:content[^>]*(?:medium=["']image["']|type=["']image\/)[^>]+url=["']([^"']+)["']/i.exec(block);
  if (mc1) return mc1[1];

  // 3. media:content genérico (cualquier url)
  const mc2 = /<media:content[^>]+url=["']([^"']+)["']/i.exec(block);
  if (mc2) return mc2[1];

  // 4. enclosure type image
  const enc = /<enclosure[^>]+url=["']([^"']+)["'][^>]+type=["']image\//i.exec(block)
           || /<enclosure[^>]+type=["']image\/[^"']*["'][^>]+url=["']([^"']+)["']/i.exec(block);
  if (enc) return enc[1];

  // 5. <image><url> a nivel de item
  const imgTag = /<image[^>]*>[\s\S]*?<url[^>]*>([^<]+)<\/url>/i.exec(block);
  if (imgTag) return imgTag[1].trim();

  // 6. <img src="..."> dentro del content:encoded — sin restricción de extensión
  const fullContent = contentEncoded + block;
  const imgSrc = /<img[^>]+src=["'](https?:\/\/[^"'\s>]+)["']/i.exec(fullContent);
  if (imgSrc && !imgSrc[1].includes('pixel') && !imgSrc[1].includes('tracker')) {
    return imgSrc[1];
  }

  // 7. url absoluta con extensión de imagen dentro de cualquier etiqueta/atributo
  const urlImg = /https?:\/\/[^\s"'<>]+\.(?:jpg|jpeg|png|webp|gif)(?:\?[^\s"'<>]*)?/i.exec(fullContent);
  if (urlImg) return urlImg[0];

  return undefined;
}

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, ' ')
    .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"').replace(/&#039;/g, "'").replace(/&apos;/g, "'")
    .replace(/&nbsp;/g, ' ').replace(/&#\d+;/g, ' ')
    .replace(/\s+/g, ' ').trim();
}

// ─── Handler Vercel ───────────────────────────────────────────────────────────
module.exports = async (req: any, res: any) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Cache-Control', 's-maxage=604800, stale-while-revalidate=86400');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  try {
    // 1. Fetch y parseo de todos los feeds en paralelo
    const settled = await Promise.allSettled(
      NEWS_SOURCES.map(src =>
        fetchUrl(src.url, 8000)
          .then(xml => parseRSS(xml, src.source, src.category))
          .catch(() => [] as NewsItem[])
      )
    );

    let allNews: NewsItem[] = (settled as PromiseSettledResult<NewsItem[]>[])
      .flatMap(r => r.status === 'fulfilled' ? r.value : [])
      .sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime())
      .slice(0, 24);

    // 2. Para noticias sin imagen: scraping de og:image en paralelo
    //    Timeout por artículo: 4s — el caché de 7 días hace que solo ocurra una vez/semana
    const withoutImage = allNews.filter(n => !n.image);

    if (withoutImage.length > 0) {
      const ogResults = await Promise.allSettled(
        withoutImage.map(n => scrapeOgImage(n.link))
      );

      withoutImage.forEach((item, i) => {
        const r = ogResults[i];
        if (r.status === 'fulfilled' && r.value) {
          item.image = r.value;
        }
      });
    }

    // Limitar a 20 noticias finales
    allNews = allNews.slice(0, 20);

    return res.status(200).json({
      success: true,
      cached: false,
      timestamp: new Date().toISOString(),
      count: allNews.length,
      news: allNews
    });

  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: error.message || 'Error al obtener noticias'
    });
  }
};
