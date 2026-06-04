import fs from 'fs';
import path from 'path';
import heicConvert from 'heic-convert';

async function main() {
  const inputPath = path.resolve('src/assets/concentrado.HEIC');
  const outputPath = path.resolve('src/assets/concentrado.jpg');

  if (!fs.existsSync(inputPath)) {
    console.error(`❌ Error: El archivo ${inputPath} no existe.`);
    process.exit(1);
  }

  console.log(`⏳ Leyendo archivo HEIC: ${inputPath}...`);
  const inputBuffer = fs.readFileSync(inputPath);

  console.log('⏳ Convirtiendo a JPEG (esto puede tomar unos segundos)...');
  const outputBuffer = await heicConvert({
    buffer: inputBuffer,
    format: 'JPEG',
    quality: 0.9 // calidad de salida
  });

  console.log(`⏳ Guardando archivo convertido: ${outputPath}...`);
  fs.writeFileSync(outputPath, outputBuffer);

  console.log('🎉 ¡Conversión completada con éxito!');
}

main().catch((err) => {
  console.error('❌ Error durante la conversión:', err);
  process.exit(1);
});
