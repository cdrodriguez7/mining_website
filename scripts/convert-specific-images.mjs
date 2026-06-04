import fs from 'fs';
import path from 'path';
import heicConvert from 'heic-convert';

async function main() {
  // 1. Convertir 'PARA PB2.HEIC' a 'plantas_beneficio.jpg'
  const heicInputPath = path.resolve('src/assets/PARA PB2.HEIC');
  const plantasOutputPath = path.resolve('src/assets/plantas_beneficio.jpg');

  if (fs.existsSync(heicInputPath)) {
    console.log(`⏳ Leyendo archivo HEIC: ${heicInputPath}...`);
    const inputBuffer = fs.readFileSync(heicInputPath);

    console.log('⏳ Convirtiendo PARA PB2 a JPEG (esto puede tomar unos segundos)...');
    const outputBuffer = await heicConvert({
      buffer: inputBuffer,
      format: 'JPEG',
      quality: 0.9
    });

    console.log(`⏳ Guardando plantas_beneficio.jpg en: ${plantasOutputPath}...`);
    fs.writeFileSync(plantasOutputPath, outputBuffer);
    console.log('✅ plantas_beneficio.jpg generado con éxito.');
  } else {
    console.error(`❌ Error: El archivo ${heicInputPath} no existe.`);
  }

  // 2. Copiar/Renombrar '1. FASE FINAL.jpeg' a 'gestion_relaveras.jpg'
  const jpegInputPath = path.resolve('src/assets/1. FASE FINAL.jpeg');
  const relaverasOutputPath = path.resolve('src/assets/gestion_relaveras.jpg');

  if (fs.existsSync(jpegInputPath)) {
    console.log(`⏳ Copiando ${jpegInputPath} a ${relaverasOutputPath}...`);
    fs.copyFileSync(jpegInputPath, relaverasOutputPath);
    console.log('✅ gestion_relaveras.jpg generado con éxito.');
  } else {
    console.error(`❌ Error: El archivo ${jpegInputPath} no existe.`);
  }

  console.log('🎉 Proceso de imágenes terminado.');
}

main().catch((err) => {
  console.error('❌ Error durante el procesamiento de imágenes:', err);
  process.exit(1);
});
