# 📁 Estructura de Imágenes — Operaciones

Esta carpeta contiene todas las imágenes de las secciones de operaciones del sitio web.

## 🏗️ Relaveras (`relaveras/`)

Cada relavera tiene su propia carpeta con subcarpetas organizadas por sección:

```
relaveras/
├── fdn-1/                  ← Relavera FDN-1 (Principal)
│   ├── galeria/            ← Fotos de obra (Tab: Galería de Obra)
│   │   ├── img-01.jpg
│   │   ├── img-02.jpg
│   │   └── ...
│   ├── planos/             ← Planos de ingeniería CAD (Tab: Ficha Técnica)
│   │   ├── plano-01.jpg
│   │   ├── plano-02.jpg
│   │   └── ...
│   └── estabilidad/        ← Imágenes de análisis de estabilidad (Factor de Seguridad)
│       ├── pie.png         ← Diagrama de estabilidad del Pie del Dique
│       ├── talud.png       ← Diagrama de estabilidad del Talud Externo
│       └── corona.png      ← Diagrama de estabilidad de la Corona
├── ponce-sur/              ← Relavera Ponce Sur
│   ├── galeria/
│   ├── planos/
│   └── estabilidad/
│       ├── pie.png
│       ├── talud.png
│       └── corona.png
├── el-salto/               ← Relavera El Salto
│   ├── galeria/
│   ├── planos/
│   └── estabilidad/
│       ├── pie.png
│       ├── talud.png
│       └── corona.png
├── mirador/                ← Relavera Mirador
│   ├── galeria/
│   ├── planos/
│   └── estabilidad/
│       ├── pie.png
│       ├── talud.png
│       └── corona.png
├── ponce-norte/            ← Relavera Ponce Norte
│   ├── galeria/
│   ├── planos/
│   └── estabilidad/
│       ├── pie.png
│       ├── talud.png
│       └── corona.png
├── rio-chico/              ← Relavera Río Chico
│   ├── galeria/
│   ├── planos/
│   └── estabilidad/
│       ├── pie.png
│       ├── talud.png
│       └── corona.png
└── estabilidad/            ← (Respaldo) Imágenes compartidas genéricas
    ├── pie-estabilidad.png
    ├── talud-estabilidad.png
    └── corona-estabilidad.png
```

## ⚙️ Plantas de Beneficio (`plantas/`)

Cada planta tiene su propia carpeta:

```
plantas/
├── shumiral/               ← Complejo Metalúrgico Shumiral
│   ├── galeria/            ← Fotos de obra (Tab: Galería)
│   │   ├── img-01.jpg
│   │   ├── img-02.jpg
│   │   └── ...
│   ├── planos/             ← Planos de ingeniería / diagramas de flujo
│   │   ├── plano-01.jpg
│   │   └── ...
│   └── etapas/             ← Fotos específicas de cada etapa del proceso
│       ├── trituración.jpg
│       ├── molienda.jpg
│       └── ...
└── lajo/                   ← Planta de Beneficio Lajo
    ├── galeria/
    ├── planos/
    └── etapas/
```

## 📌 Convención de Nombres

| Tipo          | Formato                          | Ejemplo               |
|---------------|----------------------------------|-----------------------|
| Galería       | `img-01.jpg`, `img-02.jpg`       | `img-01.jpg`          |
| Planos        | `plano-01.jpg`, `plano-02.jpg`   | `plano-01.jpg`        |
| Estabilidad   | `{zona}-estabilidad.png`         | `pie-estabilidad.png` |
| Etapas        | nombre descriptivo `.jpg`        | `trituración.jpg`     |

## 📐 Formatos Recomendados

- **Fotografías**: `.jpg` o `.jpeg` (comprimidas, ≤ 500 KB idealmente)
- **Planos técnicos**: `.jpg` o `.png` (resolución mínima 1200x900 px)
- **Diagramas de estabilidad**: `.png` (con fondo transparente si es posible)
- **Aspect ratio recomendado**: `16:9` para galerías, `4:3` para planos

## ⚡ Cómo Agregar Imágenes

1. Coloca la imagen en la subcarpeta correspondiente
2. Nombra el archivo siguiendo la convención (ej. `img-03.jpg`)
3. En el componente TypeScript (`.ts`), agrega un nuevo objeto al array `images` o `blueprints`:

```typescript
{
  url: 'assets/operaciones/relaveras/fdn-1/galeria/img-03.jpg',
  caption: 'Descripción de la nueva imagen aquí.'
}
```

4. El componente mostrará automáticamente la nueva imagen en el carrusel.
