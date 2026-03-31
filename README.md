# Juventud Frente Cívico — Sitio Web Oficial

**Sitio web institucional de la Juventud del Frente Cívico de Córdoba.**  
Landing page modular con secciones de presentación, autoridades, secretarías y formulario de adhesión.

---

## 📋 Índice

1. [Descripción General](#-descripción-general)
2. [Stack Tecnológico](#-stack-tecnológico)
3. [Paleta de Colores y Diseño](#-paleta-de-colores-y-diseño)
4. [Estructura del Proyecto](#-estructura-del-proyecto)
5. [Arquitectura y Funcionamiento](#-arquitectura-y-funcionamiento)
6. [Secciones y Páginas](#-secciones-y-páginas)
7. [Funcionalidades](#-funcionalidades)
8. [Scripts y Comandos](#-scripts-y-comandos)
9. [Cómo Desarrollar](#-cómo-desarrollar)
10. [Cómo Editar Contenido](#-cómo-editar-contenido)
11. [Despliegue](#-despliegue)

---

## 📖 Descripción General

Este sitio es un **landing page político-institucional** para la Juventud del Frente Cívico de Córdoba. Está construido con HTML y CSS puro + TailwindCSS (sin frameworks de JS ni server-side rendering). El contenido se ensambla de forma **modular**: cada sección vive en su propio archivo HTML bajo `pages/`, y se inyectan dinámicamente en la página principal mediante `fetch()`.

**Objetivo principal:** Presentar la organización política, sus autoridades, sus secretarías temáticas, y permitir que nuevos miembros se sumen mediante un formulario conectado a Formspree.

---

## 🛠 Stack Tecnológico

| Tecnología | Versión | Uso |
|---|---|---|
| HTML5 | — | Estructura de todas las páginas |
| CSS / TailwindCSS | v3.4.x | Estilos utilitarios y sistema de diseño |
| Vanilla JavaScript (ES2020+) | — | Interactividad, inyección de secciones, modales |
| Inter (Google Fonts) | — | Tipografía principal |
| Font Awesome | 6.4.0 | Iconos de redes sociales (Instagram, TikTok) |
| Formspree | — | Backend del formulario de adhesión |
| PostCSS + Autoprefixer | — | Procesamiento CSS para compatibilidad |
| Node.js + npm | — | Solo para compilar TailwindCSS (no corre en prod) |

> ⚠️ **No hay servidor** — el sitio es completamente estático. Puede desplegarse en cualquier CDN o hosting de archivos estáticos (GitHub Pages, Netlify, Vercel, etc.)

---

## 🎨 Paleta de Colores y Diseño

Los colores de marca están definidos en `tailwind.config.js` y como variables CSS en `pages/quienes-somos/index.html`:

| Token | Valor | Uso |
|---|---|---|
| `brandBlue` | `#001F71` | Color principal, títulos, botones |
| `brandCyan` | `#5CBFDF` | Acento secundario, detalles |
| `brandCoral` | `#FF5A36` | CTA (llamadas a la acción), highlights |

**Modo oscuro:** Soportado mediante la clase `.dark` en `<html>`. El sistema cambia:
- Fondos blancos → grises oscuros
- `brandBlue` → `brandCyan` (para contraste)
- Scrollbar coral → cyan

**Tipografía:** `Inter` (Google Fonts), cargada en todos los archivos HTML con pesos 300–900.

---

## 📁 Estructura del Proyecto

```
frentecivicoweb-main/
│
├── index.html              ← Página raíz (orquestador de secciones)
├── output.css              ← CSS compilado por Tailwind (NO editar manualmente)
├── package.json            ← Dependencias npm (solo TailwindCSS + PostCSS)
├── tailwind.config.js      ← Configuración de Tailwind (colores, fuentes, etc.)
├── postcss.config.js       ← Config de PostCSS
├── .gitignore
│
├── src/
│   ├── input.css           ← Fuente CSS principal de Tailwind + estilos custom
│   ├── modal.css           ← (vacío / sin usar actualmente)
│   └── modal-styles.css    ← (vacío / sin usar actualmente)
│
├── assets/
│   ├── css/
│   │   └── modal.css       ← Estilos de modales (usados en quienes-somos)
│   ├── js/
│   │   ├── app.js          ← Script principal (inyección, header, modales, tema)
│   │   ├── modal.js        ← (vacío)
│   │   └── modals.js       ← (archivo pequeño, funciones de modal alternativas)
│   └── img/
│       ├── logo.png        ← Logo de la organización
│       └── fondo-form.jpg  ← Imagen de fondo del formulario de adhesión
│
├── layouts/
│   ├── header.html         ← Header fijo (nav + logo + botón móvil)
│   ├── footer.html         ← Footer + botón flotante de WhatsApp
│   └── modal.html          ← (vacío)
│
└── pages/
    ├── hero/
    │   └── index.html      ← Sección "portada" con gradiente y CTA
    ├── quienes-somos/
    │   └── index.html      ← Sección "quiénes somos" + autoridades + modales
    ├── secretarias/
    │   ├── index.html      ← Listado de las 5 secretarías
    │   ├── comunicacion.html
    │   ├── accion-digital.html
    │   ├── accion-social.html
    │   ├── estudiantil.html
    │   └── formacion.html
    ├── sumate/
    │   └── index.html      ← Formulario de adhesión + sección de contacto
    └── autoridades/
        └── index.html      ← (página standalone de autoridades)
```

---

## ⚙️ Arquitectura y Funcionamiento

### Sistema de Inyección Modular

El núcleo del sistema está en `assets/js/app.js`. Cuando se carga `index.html`, el script:

1. **Inyecta el header** desde `layouts/header.html` en `<div id="app-header">`.
2. **Inyecta el footer** desde `layouts/footer.html` en `<div id="app-footer">`.
3. **Inyecta cada sección** del landing desde sus páginas correspondientes:

```js
window.injectSection('landing-hero',        'pages/hero/index.html');
window.injectSection('landing-quienes',     'pages/quienes-somos/index.html');
window.injectSection('landing-secretarias', 'pages/secretarias/index.html');
window.injectSection('landing-sumate',      'pages/sumate/index.html');
```

La función `injectSection()` hace un `fetch()` al HTML de la página, extrae el primer `<section>`, lo inserta en el placeholder y **también migra estilos, scripts y modales** del `<head>` de cada página al documento principal.

> 📌 Cada página en `pages/` es también un HTML **independiente y autosuficiente** — puede abrirse directamente en el navegador y funciona sola.

### Sistema de Tema (Dark Mode)

- El tema activo se guarda en `localStorage` con la clave `'theme'`.
- Al cargar la página, se lee el tema guardado (o el preferido del sistema).
- El botón de toggle se crea **dinámicamente** por JS si no existe en el header.
- En modo oscuro, se agrega la clase `.dark` al `<html>`.
- Los overrides CSS de dark mode están en `src/input.css` bajo `@layer utilities`.

### Sistema de Modales

- Cada autoridad en `quienes-somos` tiene un botón que llama a `openModal('id')`.
- `openModal()` y `closeModal()` están expuestos globalmente en `window`.
- Los modales se cierran con: botón ✕, clic en el overlay, o tecla `Escape`.
- Al abrir un modal se bloquea el scroll del body.

### Navegación Suave (Smooth Scroll)

- Los links del header con `href="#landing-X"` disparan scroll suave a la sección.
- Si se navega desde una página interna (ej. secretaría) de vuelta al index, el hash se procesa al cargar.
- El history se limpia (`history.replaceState`) para no dejar hashes en la URL.

---

## 📄 Secciones y Páginas

### 1. Hero (`pages/hero/index.html`)

- **Qué muestra:** Pantalla completa con gradiente de fondo animado, título principal y dos botones CTA.
- **Funcionalidades:** Botón "Sumate al cambio" con animación de bounce, botón "Conocé Más" con scroll suave.
- **CSS inline:** Define `.hero-bg` (gradiente radial + lineal) y animación `@keyframes bounce`.

### 2. Quiénes Somos (`pages/quienes-somos/index.html`)

- **Qué muestra:** Grid de 6 valores institucionales, botón "Conocé nuestras propuestas", grid de autoridades.
- **Autoridades:** 8 tarjetas con cargo, nombre, redes sociales y botón "Conoceme" que abre un modal.
- **Modales:** Cada autoridad tiene su modal con: avatar, nombre, cargo, redes, formación, experiencia y propuestas.
- **CSS adicional:** `assets/css/modal.css` + estilos inline extensos (tarjetas, botones gradiente, social links).

  > ⚠️ Los nombres de las autoridades son **placeholders** ("Nombre Apellido") — deben completarse con información real.

### 3. Secretarías (`pages/secretarias/index.html`)

- **Qué muestra:** 5 tarjetas con efecto 3D hover, estadísticas de la organización.
- **Secretarías:** Comunicación, Digitalización e Innovación, Acción Social, Estudiantil, Formación.
- **Links:** Cada tarjeta enlaza a su página dedicada en `/pages/secretarias/[nombre].html`.
- **Sub-páginas:** Cada secretaría tiene su propia página standalone con descripción, actividades, equipo, etc.

### 4. Sumate (`pages/sumate/index.html`)

- **Qué muestra:** 6 tarjetas de beneficios, formulario de adhesión, estadísticas, contacto WhatsApp.
- **Formulario:** Campos: nombre, email, teléfono, edad, localidad (con `<datalist>`), barrio, motivación.
- **Backend:** Envío a Formspree (`https://formspree.io/f/mjkpeebn`) via `fetch()` + JSON.
- **UX:** Validación cliente-side, estado de carga, modal de éxito, reset del formulario.

### 5. Header (`layouts/header.html`)

- Header fijo (`position: fixed`), glassmorphism con `backdrop-blur`.
- Desktop: logo + nav (3 links) + botón "Sumate al cambio".
- Móvil: logo + hamburger → menú desplegable.
- El botón de dark mode se inyecta dinámicamente por JS.
- Header se oculta al hacer scroll hacia abajo y reaparece al subir (tras 100px).

### 6. Footer (`layouts/footer.html`)

- Grid 3 columnas: logo + tagline + CTA / navegación / redes sociales.
- Redes: Instagram, X (Twitter), TikTok.
- Botón flotante de WhatsApp (fijo, esquina inferior derecha).

---

## ✨ Funcionalidades

| Funcionalidad | Archivo | Descripción |
|---|---|---|
| Inyección modular de secciones | `app.js` | Cada sección se carga vía `fetch()` desde páginas independientes |
| Dark mode toggle | `app.js` + `input.css` | Persiste en `localStorage`, respeta `prefers-color-scheme` |
| Header hide/show en scroll | `app.js` | Se oculta al bajar (>100px) y reaparece al subir |
| Smooth scroll interno | `app.js` | Scroll suave a secciones con limpieza del hash en URL |
| Modales de autoridades | `quienes-somos/index.html` | 8 modales con info detallada de cada autoridad |
| Formulario Formspree | `sumate/index.html` | Envío async con validación, estados de carga y modal de éxito |
| WhatsApp flotante | `layouts/footer.html` | Link directo a WhatsApp con mensaje predefinido |
| Responsive design | Global | Mobile-first, breakpoints: `sm` (640px), `md` (768px), `lg` (1024px) |
| Tarjetas 3D hover | `secretarias/index.html` + `sumate/index.html` | `translateY + rotateX` con `transform-style: preserve-3d` |
| Dark mode scrollbar | `src/input.css` | Scrollbar coral en claro, cyan en oscuro (WebKit + Firefox) |
| Botón bounce animado | `hero/index.html` | Animación bounce en CTA principal, se detiene al hover |

---

## 🚀 Scripts y Comandos

Primero instalar dependencias (solo la primera vez):

```bash
npm install
```

### Desarrollo (modo watch — recompila CSS al guardar)

```bash
npm run dev
```

Esto ejecuta: `tailwindcss -i ./src/input.css -o ./output.css --watch`

> Dejar este comando corriendo mientras editás. No hay servidor de desarrollo — abrir `index.html` directamente en el navegador o usar la extensión "Live Server" de VS Code.

### Build (producción)

```bash
npm run build
```

Esto ejecuta: `tailwindcss -i ./src/input.css -o ./output.css --minify`

> Ejecutar este comando **antes de subir al servidor** para generar un `output.css` minificado y optimizado.

---

## ✏️ Cómo Editar Contenido

### Cambiar textos del Hero

Editar `pages/hero/index.html`. El texto principal está en el `<h1>` y el párrafo bajo él.

### Cambiar datos de las Autoridades

Editar `pages/quienes-somos/index.html`.

- Buscar los `<div class="authority-card">` para cambiar cargos y nombres.
- Los **modales** están a partir de la línea ~710. Buscar `id="modal-[cargo]"` para actualizar cada perfil.
- Para cambiar redes sociales: reemplazar `href="#"` por la URL real de cada persona.

### Cambiar datos de las Secretarías

- Información en la tarjeta: `pages/secretarias/index.html`.
- Página detallada de cada secretaría: `pages/secretarias/[nombre].html`.

### Cambiar el formulario de adhesión

Editar `pages/sumate/index.html`:

- Para cambiar el endpoint de Formspree, buscar `FORMSPREE_ENDPOINT` ≈ línea 298.
- Para agregar/quitar campos del formulario, editar el `<form id="joinForm">`.
- Para agregar localidades al datalist, agregar `<option value="...">` dentro de `<datalist id="localidades">`.

### Cambiar links de WhatsApp

El número y el mensaje están en dos lugares:
1. `layouts/footer.html` — botón flotante.
2. `pages/sumate/index.html` — botón de contacto dentro de la sección.

Buscar `wa.me/5493513362057` y reemplazar con el número deseado.

### Cambiar colores de marca

Editar `tailwind.config.js`:

```js
colors: {
  brandBlue:  '#001F71',  // Azul principal
  brandCyan:  '#5CBFDF',  // Cyan acento
  brandCoral: '#FF5A36'   // Coral/rojo CTA
}
```

Luego ejecutar `npm run build` para regenerar `output.css`.

### Cambiar el logo

Reemplazar `assets/img/logo.png` con el nuevo logo (mismo nombre de archivo para no tener que actualizar referencias).

### Agregar una nueva secretaría

1. Crear `pages/secretarias/nueva-secretaria.html` (copiar de otro archivo existente como base).
2. Agregar una nueva `<article>` card en `pages/secretarias/index.html`.
3. Ejecutar `npm run build`.

---

## 🌐 Despliegue

El sitio es **completamente estático** — solo archivos HTML/CSS/JS e imágenes.

### Opción A: GitHub Pages

1. Subir el repositorio a GitHub.
2. Ir a Settings → Pages → Source: `main` branch.
3. El sitio será accesible en `https://[usuario].github.io/[repo]/`.

> ⚠️ **Importante:** Las rutas absolutas como `/pages/secretarias/comunicacion.html` en las tarjetas de secretarías **no funcionarán** en GitHub Pages si el sitio no está en la raíz del dominio. Deberán cambiarse a rutas relativas o configurarse un dominio custom.

### Opción B: Netlify / Vercel

1. Conectar el repositorio.
2. Build command: `npm run build`.
3. Publish directory: `.` (raíz del proyecto).
4. Las rutas absolutas funcionarán correctamente.

### Opción C: Hosting Tradicional (FTP)

1. Ejecutar `npm run build` localmente.
2. Subir **todos** los archivos (incluyendo `output.css` generado) via FTP.
3. El `index.html` debe ser el archivo raíz del dominio.

### Antes de desplegar — checklist

- [ ] Ejecutar `npm run build` para generar CSS minificado.
- [ ] Completar nombres y datos de todas las autoridades.
- [ ] Reemplazar los `href="#"` de redes sociales con URLs reales.
- [ ] Verificar que el endpoint de Formspree sea el correcto.
- [ ] Reemplazar el número de WhatsApp si es necesario.
- [ ] Verificar el `<title>` del `index.html` (actualmente dice `JFC fnpmront`).
- [ ] Agregar favicon (`<link rel="icon">` en el `<head>`).

---

## 📌 Notas Importantes

- `output.css` está en el repositorio pero es un **archivo generado**. No editarlo manualmente — siempre regenerarlo con `npm run build` o `npm run dev`.
- Cada página en `pages/` tiene su propio `<link rel="stylesheet" href="../../output.css">` para poder abrirse de forma stand-alone.
- El `data-root="../../"` en el `<body>` de cada sub-página le indica a `app.js` desde dónde cargar los layouts.
- La imagen `fondo-form.jpg` pesa ~1.9MB — se recomienda optimizarla antes de producción.
- Font Awesome se carga solo en `footer.html` (para los iconos de Instagram y TikTok).

---

*© 2025 Juventud Frente Cívico de Córdoba. Participá · Proponé · Hacé que pase.*
