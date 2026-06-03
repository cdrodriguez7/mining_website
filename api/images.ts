import { S3Client, ListObjectsV2Command } from '@aws-sdk/client-s3';

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

  try {
    const { folder } = req.query;

    if (!folder || typeof folder !== 'string') {
      return res.status(400).json({ success: false, error: 'Parametro folder es requerido' });
    }

    const endpoint   = process.env.R2_ENDPOINT;
    const accessKey  = process.env.R2_ACCESS_KEY_ID;
    const secretKey  = process.env.R2_SECRET_ACCESS_KEY;
    const bucketName = process.env.R2_BUCKET_NAME;
    const publicUrl  = process.env.R2_PUBLIC_URL;

    console.log('[API] Env check:', {
      endpoint: endpoint ? 'OK' : 'MISSING',
      accessKey: accessKey ? 'OK' : 'MISSING',
      secretKey: secretKey ? 'OK' : 'MISSING',
      bucketName: bucketName ? 'OK' : 'MISSING',
      publicUrl: publicUrl ? 'OK' : 'MISSING',
    });

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

    const baseUrl = publicUrl.replace(/\/$/, '');

    console.log('[API] Listando objetos R2 con prefijo:', folder);

    // Asegurar que el prefix termine en / para listar "dentro" de la carpeta
    const prefix = folder.endsWith('/') ? folder : folder + '/';

    const allObjects: any[] = [];
    let continuationToken: string | undefined;

    // Listar objetos directos en esta carpeta + subcarpetas
    do {
      const command = new ListObjectsV2Command({
        Bucket: bucketName,
        Prefix: prefix,
        MaxKeys: 1000,
        ...(continuationToken ? { ContinuationToken: continuationToken } : {})
      });

      const result = await s3.send(command);

      if (result.Contents) {
        allObjects.push(...result.Contents);
      }

      continuationToken = result.IsTruncated ? result.NextContinuationToken : undefined;
      console.log(`[API] Lote: ${result.Contents?.length || 0} objetos (truncated: ${result.IsTruncated})`);
    } while (continuationToken);

    console.log(`[API] Total: ${allObjects.length} objetos en "${folder}"`);

    // Filtrar solo archivos de imagen (no carpetas vacías ni otros archivos)
    const imageExtensions = new Set([
      'jpg', 'jpeg', 'png', 'gif', 'webp', 'avif', 'svg', 'bmp', 'tiff', 'ico'
    ]);

    const images = allObjects
      .filter((obj: any) => {
        // Excluir "carpetas" (keys que terminan en /)
        if (obj.Key.endsWith('/')) return false;
        // Solo imágenes
        const ext = obj.Key.split('.').pop()?.toLowerCase() || '';
        return imageExtensions.has(ext);
      })
      .map((obj: any) => {
        const key: string = obj.Key;
        const ext = key.split('.').pop()?.toLowerCase() || '';

        // Extraer la carpeta inmediata (último directorio antes del archivo)
        const parts = key.split('/');
        const fileName = parts.pop() || key;
        const parentPath = parts.join('/');
        const folderName = parts.pop() || folder;

        return {
          publicId:    key,
          title:       formatTitle(fileName.replace(/\.[^/.]+$/, '')),
          description: `Imagen de ${folderName}`,
          folder:      folderName,
          assetFolder: parentPath,
          tags:        [folderName],
          width:       0,  // R2 no almacena dimensiones; el frontend las maneja
          height:      0,
          format:      ext,
          createdAt:   obj.LastModified ? obj.LastModified.toISOString() : new Date().toISOString(),
          secureUrl:   `${baseUrl}/${key}`,
          bytes:       obj.Size || 0
        };
      });

    return res.status(200).json({
      success: true,
      folder,
      count:  images.length,
      images
    });

  } catch (error: any) {
    console.error('[API] Error general:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Error al obtener imagenes de R2'
    });
  }
};

function formatTitle(fileName: string): string {
  return fileName
    .replace(/[-_]/g, ' ')
    .replace(/\d+/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .split(' ')
    .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ') || 'Imagen';
}
