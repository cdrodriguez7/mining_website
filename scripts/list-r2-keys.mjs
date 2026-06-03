import { S3Client, ListObjectsV2Command } from '@aws-sdk/client-s3';

const R2 = {
  endpoint:    'https://7a9f850916f9fd1fb3457f336ff41397.r2.cloudflarestorage.com',
  accessKeyId: '6ae5dfc9a8f3cbabb488b4435222cbe4',
  secretKey:   '7f7e2089655ba32defdb28453b44bd176e2d6896ee1bad4ebca7f8c85b0e2ee3',
  bucketName:  'planpromin',
};

const s3 = new S3Client({
  region: 'auto',
  endpoint: R2.endpoint,
  credentials: {
    accessKeyId: R2.accessKeyId,
    secretAccessKey: R2.secretKey,
  },
});

async function main() {
  const result = await s3.send(new ListObjectsV2Command({
    Bucket: R2.bucketName,
    MaxKeys: 100
  }));

  if (result.Contents) {
    console.log(`Encontrados ${result.Contents.length} objetos en R2:`);
    result.Contents.forEach(obj => {
      console.log(` - ${obj.Key} (${obj.Size} bytes)`);
    });
  } else {
    console.log('No se encontraron objetos en el bucket R2.');
  }
}

main().catch(console.error);
