const cloudinary = require('cloudinary').v2;

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
      return res.status(400).json({
        success: false,
        error: 'Parametro folder es requerido'
      });
    }

    if (!process.env.CLOUDINARY_CLOUD_NAME || 
        !process.env.CLOUDINARY_API_KEY || 
        !process.env.CLOUDINARY_API_SECRET) {
      console.error('[ERROR] Variables de entorno faltantes');
      return res.status(500).json({
        success: false,
        error: 'Configuracion de Cloudinary incompleta',
        debug: {
          cloudName: !!process.env.CLOUDINARY_CLOUD_NAME,
          apiKey: !!process.env.CLOUDINARY_API_KEY,
          apiSecret: !!process.env.CLOUDINARY_API_SECRET
        }
      });
    }

    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET
    });

    console.log('[API] Buscando imagenes con prefix:', folder);

    const result = await cloudinary.api.resources({
      type: 'upload',
      prefix: folder,
      max_results: 500,
      context: true,
      tags: true
    });

    console.log('[API] Recursos encontrados:', result.resources.length);

    const images = result.resources.map((resource: any) => {
      const pathParts = resource.public_id.split('/');
      const folderName = pathParts.length > 1 
        ? pathParts[pathParts.length - 2] 
        : 'mineria';
      const fileName = pathParts[pathParts.length - 1];
      
      return {
        publicId: resource.public_id,
        title: resource.context?.custom?.caption || formatTitle(fileName),
        description: resource.context?.custom?.alt || `Imagen de ${folderName}`,
        folder: folderName,
        tags: resource.tags || [folderName],
        width: resource.width,
        height: resource.height,
        format: resource.format,
        createdAt: resource.created_at,
        secureUrl: resource.secure_url,
        bytes: resource.bytes || 0
      };
    });

    console.log('[API] Imagenes formateadas:', images.length);

    return res.status(200).json({
      success: true,
      folder,
      count: images.length,
      images
    });

  } catch (error: any) {
    console.error('[API] Error:', error);
    
    return res.status(500).json({
      success: false,
      error: error.message || 'Error al obtener imagenes de Cloudinary',
      stack: error.stack
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
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ') || 'Imagen';
}