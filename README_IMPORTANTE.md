# 🚀 PROYECTO MINING WEBSITE - VERCEL + CLOUDINARY

## ✅ YA ESTÁ CONFIGURADO

Este proyecto ya tiene TODO lo necesario para funcionar con:
- ✅ Angular 17.3 (compatible con Node 20)
- ✅ Vercel Serverless Backend
- ✅ Cloudinary API
- ✅ Todas las dependencias correctas

## 📋 PASOS PARA USAR

### 1. Instalar Dependencias

```powershell
npm install
```

### 2. Configurar Variables de Entorno en Vercel

Ve a https://vercel.com/dashboard → Tu Proyecto → Settings → Environment Variables

Agrega estas 3 variables:

```
CLOUDINARY_CLOUD_NAME = dlumbzsnd
CLOUDINARY_API_KEY = 995761378649771
CLOUDINARY_API_SECRET = P4p__0if9EvGHG0_yKoNGbDGdg0
```

Selecciona: ✓ Production ✓ Preview ✓ Development

### 3. Deploy a Vercel

```powershell
git add .
git commit -m "feat: Angular 17 + Vercel + Cloudinary integrado"
git push origin main
```

O deploy directo:

```powershell
vercel --prod
```

### 4. Verificar

Abre: https://tu-proyecto.vercel.app/api/images?folder=mineria/maquinaria

Deberías ver JSON con las imágenes.

## 📁 ESTRUCTURA DE CARPETAS EN CLOUDINARY

```
mineria/
├── maquinaria/
├── infraestructura/
├── extraccion/
├── procesamiento/
├── seguridad/
└── medio-ambiente/
```

## 🎯 ARCHIVOS CLAVE

- `api/images.ts` - Backend serverless
- `src/environments/environment.prod.ts` - Config producción
- `src/app/core/services/cloudinary-backend.service.ts` - Servicio API
- `src/app/core/services/gallery.service.ts` - Lógica galería
- `src/app/features/gallery/gallery.component.ts` - Componente galería
- `vercel.json` - Config Vercel

## ✅ CARACTERÍSTICAS

✓ Carga automática de imágenes desde Cloudinary
✓ Sin lista manual - 100% dinámico
✓ Backend seguro (API Secret protegido)
✓ Gratis en Vercel Free tier
✓ Deploy automático con git push

## 🐛 SOLUCIÓN DE PROBLEMAS

**Error de compilación:**
```powershell
Remove-Item -Recurse -Force node_modules, .angular
npm install
ng serve
```

**Imágenes no cargan:**
1. Verifica variables de entorno en Vercel
2. Prueba: https://tu-proyecto.vercel.app/api/images?folder=mineria/maquinaria
3. Revisa consola del navegador (F12)

