/**
 * Script de migración: Cloudinary → Cloudflare R2
 * 
 * Descarga todas las imágenes del Media Library de Cloudinary
 * y las sube al bucket R2 preservando la estructura de carpetas.
 * 
 * Uso:
 *   node scripts/migrate-to-r2.mjs
 */

import { S3Client, PutObjectCommand, HeadObjectCommand } from '@aws-sdk/client-s3';
import https from 'https';
import http from 'http';
import crypto from 'crypto';

// ── Credenciales Cloudinary (solo para migración) ───────────────────────
const CLOUDINARY = {
  cloudName: 'dlumbzsnd',
  apiKey:    '995761378649771',
  apiSecret: 'P4p__0if9EvGHG0_yKoNGbDGdg0',
};

// ── Credenciales R2 ─────────────────────────────────────────────────────
const R2 = {
  endpoint:    'https://7a9f850916f9fd1fb3457f336ff41397.r2.cloudflarestorage.com',
  accessKeyId: '6ae5dfc9a8f3cbabb488b4435222cbe4',
  secretKey:   '7f7e2089655ba32defdb28453b44bd176e2d6896ee1bad4ebca7f8c85b0e2ee3',
  bucketName:  'planpromin',
  publicUrl:   'https://pub-3f09c3012ac6444694ac1ae4da966b48.r2.dev',
};

// ── Carpetas a migrar ───────────────────────────────────────────────────
const FOLDERS_TO_MIGRATE = [
  'mineria',
  'mineria/home',
  'mineria/empresa',
  'mineria/operaciones',
  'mineria/geologia',
  'mineria/seguridad',
  'mineria/medio-ambiente',
  'mineria/comunidades',
  'mineria/noticias',
  'mineria/galeria',
];

// ── S3 Client para R2 ──────────────────────────────────────────────────
const s3 = new S3Client({
  region: 'auto',
  endpoint: R2.endpoint,
  credentials: {
    accessKeyId: R2.accessKeyId,
    secretAccessKey: R2.secretKey,
  },
});

// ── Helpers ─────────────────────────────────────────────────────────────

/** Llamada autenticada a Cloudinary Admin API */
async function cloudinaryAdminGet(path) {
  const url = `https://api.cloudinary.com/v1_1/${CLOUDINARY.cloudName}${path}`;
  const auth = Buffer.from(`${CLOUDINARY.apiKey}:${CLOUDINARY.apiSecret}`).toString('base64');

  return new Promise((resolve, reject) => {
    const req = https.get(url, {
      headers: { Authorization: `Basic ${auth}` }
    }, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(new Error(`Error parsing response from ${path}: ${data.substring(0, 200)}`));
        }
      });
    });
    req.on('error', reject);
  });
}

/** Descargar archivo como Buffer */
function downloadFile(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    client.get(url, (res) => {
      // Seguir redirects
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return downloadFile(res.headers.location).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        return reject(new Error(`HTTP ${res.statusCode} descargando ${url}`));
      }
      const chunks = [];
      res.on('data', (chunk) => chunks.push(chunk));
      res.on('end', () => resolve(Buffer.concat(chunks)));
      res.on('error', reject);
    }).on('error', reject);
  });
}

/** Verificar si un objeto ya existe en R2 */
async function existsInR2(key) {
  try {
    await s3.send(new HeadObjectCommand({
      Bucket: R2.bucketName,
      Key: key,
    }));
    return true;
  } catch {
    return false;
  }
}

/** Subir un Buffer a R2 */
async function uploadToR2(key, buffer, contentType) {
  await s3.send(new PutObjectCommand({
    Bucket: R2.bucketName,
    Key: key,
    Body: buffer,
    ContentType: contentType,
  }));
}

/** Obtener content-type por extensión */
function getContentType(filename) {
  const ext = filename.split('.').pop()?.toLowerCase();
  const types = {
    jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png',
    gif: 'image/gif', webp: 'image/webp', avif: 'image/avif',
    svg: 'image/svg+xml', bmp: 'image/bmp', ico: 'image/x-icon',
    mp4: 'video/mp4',
  };
  return types[ext] || 'application/octet-stream';
}

/** Listar TODOS los recursos de Cloudinary en una carpeta (asset_folder) */
async function listCloudinaryFolder(folder) {
  const allResources = [];
  let nextCursor = undefined;

  do {
    const cursorParam = nextCursor ? `&next_cursor=${encodeURIComponent(nextCursor)}` : '';
    const path = `/resources/image/upload?asset_folder=${encodeURIComponent(folder)}&max_results=500&context=true&tags=true${cursorParam}`;
    
    try {
      const result = await cloudinaryAdminGet(path);
      if (result.resources) {
        allResources.push(...result.resources);
      }
      nextCursor = result.next_cursor;
    } catch (e) {
      console.warn(`  ⚠ Error listando ${folder}:`, e.message);
      break;
    }
  } while (nextCursor);

  return allResources;
}

// ── Main ────────────────────────────────────────────────────────────────
async function main() {
  console.log('╔══════════════════════════════════════════════════════════╗');
  console.log('║  Migración Cloudinary → Cloudflare R2                  ║');
  console.log('║  Bucket: planpromin                                     ║');
  console.log('╚══════════════════════════════════════════════════════════╝');
  console.log();

  let totalFound = 0;
  let totalUploaded = 0;
  let totalSkipped = 0;
  let totalErrors = 0;

  // Coleccionar todos los recursos únicos de todas las carpetas
  const resourceMap = new Map();

  for (const folder of FOLDERS_TO_MIGRATE) {
    console.log(`\n📂 Escaneando carpeta: ${folder}`);
    const resources = await listCloudinaryFolder(folder);
    console.log(`   Encontradas: ${resources.length} imágenes`);
    
    for (const r of resources) {
      if (!resourceMap.has(r.public_id)) {
        r.target_folder = r.asset_folder || folder;
        resourceMap.set(r.public_id, r);
      }
    }
  }

  const allResources = Array.from(resourceMap.values());
  totalFound = allResources.length;
  console.log(`\n📊 Total de imágenes únicas encontradas: ${totalFound}`);
  console.log('─'.repeat(60));

  // Procesar cada imagen
  for (let i = 0; i < allResources.length; i++) {
    const resource = allResources[i];
    const publicId = resource.public_id;
    const format = resource.format || 'jpg';
    const secureUrl = resource.secure_url;
    
    // Construir la ruta correcta usando la carpeta de destino y el nombre de archivo
    const filename = publicId.split('/').pop();
    const folderPrefix = resource.target_folder || 'mineria';
    const r2Key = `${folderPrefix}/${filename}.${format}`;

    const progress = `[${i + 1}/${totalFound}]`;

    // Verificar si ya existe en R2 (para poder re-ejecutar sin duplicar)
    const exists = await existsInR2(r2Key);
    if (exists) {
      console.log(`  ${progress} ⏭ Ya existe: ${r2Key}`);
      totalSkipped++;
      continue;
    }

    try {
      // Descargar de Cloudinary
      process.stdout.write(`  ${progress} ⬇ Descargando: ${publicId}...`);
      const buffer = await downloadFile(secureUrl);
      
      // Subir a R2
      process.stdout.write(` ⬆ Subiendo (${(buffer.length / 1024).toFixed(0)} KB)...`);
      const contentType = getContentType(r2Key);
      await uploadToR2(r2Key, buffer, contentType);
      
      console.log(' ✅');
      totalUploaded++;
    } catch (error) {
      console.log(` ❌ Error: ${error.message}`);
      totalErrors++;
    }
  }

  // Resumen final
  console.log('\n' + '═'.repeat(60));
  console.log('📋 RESUMEN DE MIGRACIÓN');
  console.log('═'.repeat(60));
  console.log(`  📦 Imágenes encontradas:  ${totalFound}`);
  console.log(`  ✅ Subidas exitosamente:  ${totalUploaded}`);
  console.log(`  ⏭  Ya existían en R2:    ${totalSkipped}`);
  console.log(`  ❌ Errores:               ${totalErrors}`);
  console.log('═'.repeat(60));

  if (totalErrors > 0) {
    console.log('\n⚠ Hubo errores. Puedes volver a ejecutar el script — las imágenes ya subidas se saltarán.');
  } else {
    console.log('\n🎉 Migración completada exitosamente!');
  }

  console.log(`\n🌐 Tus imágenes están en: ${R2.publicUrl}/mineria/...`);
}

main().catch(console.error);
