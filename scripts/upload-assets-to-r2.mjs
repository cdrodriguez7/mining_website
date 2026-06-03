/**
 * Script de subida: Assets locales → Cloudflare R2
 * 
 * Sube todo el contenido de `src/assets/` (imágenes, logos, planos y videos)
 * al bucket R2 de Cloudflare, preservando la estructura de carpetas.
 * 
 * Uso:
 *   node scripts/upload-assets-to-r2.mjs
 */

import { S3Client, PutObjectCommand, HeadObjectCommand } from '@aws-sdk/client-s3';
import fs from 'fs';
import path from 'path';

// ── Credenciales R2 ─────────────────────────────────────────────────────
const R2 = {
  endpoint:    'https://7a9f850916f9fd1fb3457f336ff41397.r2.cloudflarestorage.com',
  accessKeyId: '6ae5dfc9a8f3cbabb488b4435222cbe4',
  secretKey:   '7f7e2089655ba32defdb28453b44bd176e2d6896ee1bad4ebca7f8c85b0e2ee3',
  bucketName:  'planpromin',
  publicUrl:   'https://pub-3f09c3012ac6444694ac1ae4da966b48.r2.dev',
};

// ── S3 Client para R2 ──────────────────────────────────────────────────
const s3 = new S3Client({
  region: 'auto',
  endpoint: R2.endpoint,
  credentials: {
    accessKeyId: R2.accessKeyId,
    secretAccessKey: R2.secretKey,
  },
});

// ── Helpers de Archivo ──────────────────────────────────────────────────

/** Obtener content-type por extensión */
function getContentType(filename) {
  const ext = filename.split('.').pop()?.toLowerCase();
  const types = {
    jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png',
    gif: 'image/gif', webp: 'image/webp', avif: 'image/avif',
    svg: 'image/svg+xml', bmp: 'image/bmp', ico: 'image/x-icon',
    mp4: 'video/mp4', m4v: 'video/mp4', webm: 'video/webm',
    md: 'text/markdown', txt: 'text/plain', json: 'application/json'
  };
  return types[ext] || 'application/octet-stream';
}

/** Verificar si un objeto ya existe en R2 y tiene el mismo tamaño */
async function existsInR2(key, localSize) {
  try {
    const res = await s3.send(new HeadObjectCommand({
      Bucket: R2.bucketName,
      Key: key,
    }));
    return res.ContentLength === localSize;
  } catch {
    return false;
  }
}

/** Subir un archivo a R2 */
async function uploadFileToR2(filePath, key) {
  const fileBuffer = fs.readFileSync(filePath);
  const contentType = getContentType(filePath);

  await s3.send(new PutObjectCommand({
    Bucket: R2.bucketName,
    Key: key,
    Body: fileBuffer,
    ContentType: contentType,
  }));
}

/** Recorrer directorio recursivamente */
function getAllFiles(dirPath, arrayOfFiles = []) {
  const files = fs.readdirSync(dirPath);

  files.forEach((file) => {
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      arrayOfFiles = getAllFiles(fullPath, arrayOfFiles);
    } else {
      arrayOfFiles.push(fullPath);
    }
  });

  return arrayOfFiles;
}

// ── Main ────────────────────────────────────────────────────────────────
async function main() {
  console.log('╔══════════════════════════════════════════════════════════╗');
  console.log('║  Subida de Assets → Cloudflare R2                       ║');
  console.log('║  Bucket: planpromin                                     ║');
  console.log('╚══════════════════════════════════════════════════════════╝');
  console.log();

  const assetsDir = path.resolve('src/assets');
  if (!fs.existsSync(assetsDir)) {
    console.error('❌ Error: El directorio src/assets no existe.');
    process.exit(1);
  }

  console.log('📂 Escaneando src/assets...');
  const allFiles = getAllFiles(assetsDir);
  const totalFiles = allFiles.length;
  console.log(`📊 Encontrados ${totalFiles} archivos para procesar.`);
  console.log('─'.repeat(60));

  let uploadedCount = 0;
  let skippedCount = 0;
  let errorCount = 0;

  for (let i = 0; i < allFiles.length; i++) {
    const filePath = allFiles[i];
    const relativePath = path.relative(assetsDir, filePath).replace(/\\/g, '/');
    const r2Key = `assets/${relativePath}`;
    const stats = fs.statSync(filePath);
    const localSize = stats.size;
    const progress = `[${i + 1}/${totalFiles}]`;

    // Evitar subir archivos README.md
    if (relativePath.toLowerCase() === 'operaciones/readme.md') {
      console.log(`  ${progress} ⏭ Saltando README.md`);
      skippedCount++;
      continue;
    }

    const alreadyExists = await existsInR2(r2Key, localSize);
    if (alreadyExists) {
      console.log(`  ${progress} ⏭ Ya existe (mismo tamaño): ${r2Key}`);
      skippedCount++;
      continue;
    }

    try {
      process.stdout.write(`  ${progress} ⬇ Procesando: ${r2Key} (${(localSize / 1024).toFixed(1)} KB)...`);
      await uploadFileToR2(filePath, r2Key);
      console.log(' ✅ Subido');
      uploadedCount++;
    } catch (err) {
      console.log(` ❌ Error: ${err.message}`);
      errorCount++;
    }
  }

  console.log('\n' + '═'.repeat(60));
  console.log('📋 RESUMEN DE SUBIDA DE ASSETS');
  console.log('═'.repeat(60));
  console.log(`  📦 Total de archivos:    ${totalFiles}`);
  console.log(`  ✅ Subidos exitosamente:  ${uploadedCount}`);
  console.log(`  ⏭ Saltados/Ya existen:  ${skippedCount}`);
  console.log(`  ❌ Errores:               ${errorCount}`);
  console.log('═'.repeat(60));

  if (errorCount > 0) {
    console.log('\n⚠ Hubo errores. Puedes volver a ejecutar el script.');
  } else {
    console.log('\n🎉 Subida de assets completada con éxito!');
  }
}

main().catch(console.error);
