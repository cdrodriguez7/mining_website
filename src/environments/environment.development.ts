export const environment = {
  production: false,
  // Dev: llama directamente a MetalpriceAPI (CORS soportado)
  // así no necesita que npm run start:api esté corriendo
  metalpriceUrl: 'https://api.metalpriceapi.com/v1/latest?api_key=25d0e09e06c131e31f3900e844a22fbd&base=USD&currencies=XAU,XAG',
  baseUrl: 'http://localhost:3000/api',
  r2: {
    publicUrl: 'https://pub-3f09c3012ac6444694ac1ae4da966b48.r2.dev',
    bucketName: 'planpromin',
    customDomain: '',
    imageResizing: false
  }
};