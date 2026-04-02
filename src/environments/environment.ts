export const environment = {
  production: true,
  // Prod: usa el serverless /api/metalprice (API key en Vercel env vars)
  metalpriceUrl: '/api/metalprice',
  baseUrl: '/api',
  cloudinary: {
    cloudName: 'dlumbzsnd',
    uploadPreset: 'PLAMPROMINV1'
  }
};