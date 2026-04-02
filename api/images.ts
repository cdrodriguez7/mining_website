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
      return res.status(400).json({ success: false, error: 'Parametro folder es requerido' });
    }

    if (
      !process.env.CLOUDINARY_CLOUD_NAME ||
      !process.env.CLOUDINARY_API_KEY ||
      !process.env.CLOUDINARY_API_SECRET
    ) {
      return res.status(500).json({ success: false, error: 'Configuracion de Cloudinary incompleta' });
    }

    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key:    process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET
    });

    console.log('[API] Buscando por asset_folder (Location):', folder);

    const resourceMap = new Map<string, any>();

    // ── Estrategia principal: asset_folder ──────────────────────────────────
    // Usa el campo "Location" del Media Library de Cloudinary (modo Dynamic Folders).
    // Es independiente del public_id — busca por dónde está guardada la imagen en la UI.
    try {
      let nextCursor: string | undefined;
      do {
        const result: any = await cloudinary.api.resources_by_asset_folder(folder, {
          max_results: 500,
          context:     true,
          tags:        true,
          fields:      'public_id,asset_folder,display_name,secure_url,width,height,format,created_at,bytes,context,tags',
          ...(nextCursor ? { next_cursor: nextCursor } : {})
        });
        result.resources.forEach((r: any) => resourceMap.set(r.public_id, r));
        console.log(`[API] asset_folder "${folder}" — lote: ${result.resources.length}`);
        nextCursor = result.next_cursor;
      } while (nextCursor);
    } catch (e: any) {
      console.warn('[API] resources_by_asset_folder falló:', e.message);
    }

    // ── Subcarpetas: si pidieron la carpeta raíz, recorre sus hijos ─────────
    // Necesario para SECTION_FOLDERS.ALL = 'mineria', que debe traer todo.
    try {
      const subResult = await cloudinary.api.sub_folders(folder);
      const subFolders: string[] = subResult.folders.map((f: any) => f.path);
      console.log(`[API] subcarpetas de "${folder}":`, subFolders);

      await Promise.all(subFolders.map(async (sf: string) => {
        try {
          let nextCursor: string | undefined;
          do {
            const sfResult: any = await cloudinary.api.resources_by_asset_folder(sf, {
              max_results: 500,
              context:     true,
              tags:        true,
              fields:      'public_id,asset_folder,display_name,secure_url,width,height,format,created_at,bytes,context,tags',
              ...(nextCursor ? { next_cursor: nextCursor } : {})
            });
            sfResult.resources.forEach((r: any) => {
              if (!resourceMap.has(r.public_id)) resourceMap.set(r.public_id, r);
            });
            console.log(`[API]   subcarpeta "${sf}": ${sfResult.resources.length}`);
            nextCursor = sfResult.next_cursor;
          } while (nextCursor);
        } catch { /* subcarpeta vacía */ }
      }));
    } catch (e: any) {
      console.warn('[API] sub_folders falló:', e.message);
    }

    // ── Fallback: prefix-based (Fixed Folders / public_id contiene ruta) ────
    // Solo se activa si los métodos anteriores no encontraron nada.
    if (resourceMap.size === 0) {
      console.warn('[API] asset_folder vacío — intentando prefix fallback...');
      try {
        const prefixResult = await cloudinary.api.resources({
          type:        'upload',
          prefix:      folder,
          max_results: 500,
          context:     true,
          tags:        true
        });
        prefixResult.resources.forEach((r: any) => resourceMap.set(r.public_id, r));
        console.log(`[API] prefix fallback "${folder}": ${prefixResult.resources.length}`);
      } catch (e: any) {
        console.warn('[API] prefix fallback también falló:', e.message);
      }
    }

    const allResources = Array.from(resourceMap.values());
    console.log(`[API] Total: ${allResources.length} recursos en "${folder}"`);

    const images = allResources.map((resource: any) => {
      // asset_folder = Location real en el Media Library (ej: "mineria/noticias")
      // Usamos su último segmento como nombre de carpeta para los filtros del frontend
      const assetFolder: string = resource.asset_folder || folder;
      const folderName  = assetFolder.split('/').pop() || assetFolder;

      // display_name o último segmento del public_id como nombre de archivo
      const fileName = resource.display_name
        || resource.public_id.split('/').pop()
        || resource.public_id;

      return {
        publicId:    resource.public_id,
        title:       resource.context?.custom?.caption || formatTitle(fileName),
        description: resource.context?.custom?.alt     || `Imagen de ${folderName}`,
        folder:      folderName,
        assetFolder: assetFolder,
        tags:        resource.tags    || [folderName],
        width:       resource.width,
        height:      resource.height,
        format:      resource.format,
        createdAt:   resource.created_at,
        secureUrl:   resource.secure_url,
        bytes:       resource.bytes   || 0
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
      error: error.message || 'Error al obtener imagenes de Cloudinary'
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
