export const environment = {
  production: false,
  // Dev: llama al proxy local /api/metalprice para incluir el precio del cobre de Yahoo
  metalpriceUrl: '/api/metalprice',
  baseUrl: 'http://localhost:3000/api',
  r2: {
    publicUrl: 'https://pub-3f09c3012ac6444694ac1ae4da966b48.r2.dev',
    bucketName: 'planpromin',
    customDomain: '',
    imageResizing: false
  }
};