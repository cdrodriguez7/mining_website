/* eslint-disable @typescript-eslint/no-var-requires */
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3') as typeof import('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner') as typeof import('@aws-sdk/s3-request-presigner');

module.exports = async (req: any, res: any) => {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { folder, filename } = req.query;

    if (!filename || typeof filename !== 'string') {
      return res.status(400).json({ success: false, error: 'Parametro filename es requerido' });
    }

    const endpoint   = process.env['R2_ENDPOINT'];
    const accessKey  = process.env['R2_ACCESS_KEY_ID'];
    const secretKey  = process.env['R2_SECRET_ACCESS_KEY'];
    const bucketName = process.env['R2_BUCKET_NAME'];
    const publicUrl  = (process.env['R2_PUBLIC_URL'] || '').replace(/\/$/, '');

    if (!endpoint || !accessKey || !secretKey || !bucketName || !publicUrl) {
      return res.status(500).json({ success: false, error: 'Configuracion de R2 incompleta' });
    }

    const s3 = new S3Client({
      region: 'auto',
      endpoint,
      credentials: {
        accessKeyId: accessKey,
        secretAccessKey: secretKey
      }
    });

    // Sanitizar nombre de archivo
    const safeName = filename.replace(/[^a-zA-Z0-9._-]/g, '_');

    // Construir el key: folder/timestamp_filename
    const timestamp = Date.now();
    const key = folder
      ? `${folder.replace(/\/$/, '')}/${timestamp}_${safeName}`
      : `uploads/${timestamp}_${safeName}`;

    console.log('[API Upload] Generando presigned URL para:', key);

    // Generar presigned URL (válida por 10 minutos)
    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      // El Content-Type lo pondrá el frontend en la petición PUT
    });

    const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 600 });

    return res.status(200).json({
      success: true,
      uploadUrl,
      key,
      publicUrl: `${publicUrl}/${key}`
    });

  } catch (error: any) {
    console.error('[API Upload] Error:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Error al generar URL de subida'
    });
  }
};

export {};
