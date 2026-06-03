export const environment = {
  production: true,
  // Prod: usa el serverless /api/metalprice (API key en Vercel env vars)
  metalpriceUrl: '/api/metalprice',
  baseUrl: '/api',
  r2: {
    publicUrl: 'https://pub-3f09c3012ac6444694ac1ae4da966b48.r2.dev',
    bucketName: 'planpromin',
    // Para habilitar Cloudflare Image Resizing se requiere un custom domain
    // con plan Pro o superior. Cuando lo tengas, cambia customDomain y pon
    // imageResizing: true.
    customDomain: '',        // ej: 'https://cdn.planpromin.com'
    imageResizing: false
  }
};