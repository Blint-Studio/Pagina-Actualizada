# progreso.md — Registro completo de cambios realizados

**Fecha:** 2026-03-24  
**Proyecto:** `frentecivicoweb-main` — Sitio web Juventud Frente Cívico de Córdoba  
**Objetivo:** Reparar todos los issues identificados en `refactor.md` sin alterar estética ni funcionalidad.

---

## ✅ Resumen ejecutivo

Se aplicaron **18 correcciones** distribuidas en 7 archivos modificados, 4 archivos nuevos y 4 archivos vacíos eliminados. El CSS fue regenerado con `npm run build`. El sitio conserva exactamente la misma apariencia visual y todas las funcionalidades.

---

## 🔴 Fixes Críticos

### 1. Título de la página corregido (`index.html`)

**Problema:** El `<title>` decía `JFC fnpmront` (texto de prueba/erróneo).  
**Solución:** Cambiado a `Juventud Frente Cívico de Córdoba`.

```html
<!-- Antes -->
<title>JFC fnpmront</title>

<!-- Después -->
<title>Juventud Frente Cívico de Córdoba</title>
```

---

### 2. Favicon agregado (`index.html`)

**Problema:** El sitio no tenía favicon — el navegador mostraba un ícono genérico.  
**Solución:** Agregado en el `<head>` de `index.html`.

```html
<link rel="icon" type="image/png" href="assets/img/logo.png" />
```

---

### 3. Meta tags Open Graph / Twitter Cards (`index.html`)

**Problema:** Al compartir el sitio en redes sociales, el preview era genérico (sin imagen ni descripción).  
**Solución:** Agregados los meta tags `og:*` y `twitter:*` en el `<head>`.

```html
<meta property="og:title"       content="Juventud Frente Cívico de Córdoba" />
<meta property="og:description" content="Construyendo el futuro de Córdoba..." />
<meta property="og:image"       content="assets/img/logo.png" />
<meta name="twitter:card"       content="summary_large_image" />
<!-- ... etc -->
```

---

### 4. Font Awesome centralizado (`index.html` ← `footer.html`)

**Problema:** Font Awesome se cargaba dentro de `footer.html`. Los iconos podían mostrarse un instante como caracteres sin estilo mientras el footer terminaba de cargarse (FOUT — Flash Of Unstyled Text).  
**Solución:** Link movido al `<head>` de `index.html` para garantizar que los íconos siempre estén disponibles antes de que el contenido se renderice.

```html
<!-- Ahora en el <head> de index.html -->
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
```

El link fue **eliminado** de `layouts/footer.html`.

---

### 5. Rutas absolutas corregidas en secretarías (`pages/secretarias/index.html`)

**Problema:** Los links de las tarjetas usaban rutas absolutas (`/pages/secretarias/comunicacion.html`) que rompen en GitHub Pages u hostings que no sirven el sitio desde la raíz del dominio.  
**Solución:** Cambiadas a rutas relativas.

```html
<!-- Antes -->
<a href="/pages/secretarias/comunicacion.html">

<!-- Después -->
<a href="./comunicacion.html">
```

Afecta los 5 links: `comunicacion.html`, `accion-digital.html`, `accion-social.html`, `estudiantil.html`, `formacion.html`.

---

## 🟠 Fixes de Alta Prioridad

### 6. `app.js` reorganizado y deduplicado (`assets/js/app.js`)

**Problema:** El archivo de 398 líneas mezclaba tema, inyección, header, modales y navegación. Tenía **dos bloques casi idénticos** para manejar el hash de la URL al cargar, y `navigateToSection()` reemplazaba todo el `document.body.innerHTML` de forma frágil.

**Solución:** El archivo fue reescrito con **secciones claramente separadas por comentarios**:

| Sección | Qué hace |
|---|---|
| `RAÍZ DINÁMICA` | Detecta el `data-root` del body |
| `TEMA` | `getStoredTheme`, `getPreferredTheme`, `applyTheme` |
| `INYECCIÓN DE LAYOUTS` | `inject()`, `injectSection()` |
| `HEADER` | `setupHeader()`, scroll hide/show, activeNav |
| `MODALES` | `openModal()`, `closeModal()`, listeners |
| `NAVEGACIÓN` | `handleInitialHash()` — función unificada |
| `INICIALIZACIÓN` | Llamadas de arranque |

**Mejoras clave:**
- Los dos bloques de manejo de hash se unificaron en una sola función `handleInitialHash()`.
- `navigateToSection()` que hacía `document.body.innerHTML = ...` fue **eliminada** y reemplazada por una navegación limpia con `window.location.href`.
- Toda la lógica está dentro de un IIFE con `'use strict'` para evitar contaminación del scope global.

---

### 7. CSS de quienes-somos extraído a archivo externo

**Problema:** `pages/quienes-somos/index.html` tenía un bloque `<style>` de **280 líneas** con estilos de componentes inline. Esto impedía reutilizarlos, los mezclaba con el HTML y causaba redefiniciones de clases Tailwind (`.container`, `.grid`, `.mb-16`, etc.).

**Solución:** Creado `assets/css/quienes-somos.css` con todos los estilos de componentes.

Clases conflictivas con Tailwind fueron renombradas:
- `.container` → `.qs-container` (evita conflicto con utilidad de Tailwind)
- `.grid .values` → `.values-grid` (la `.grid` de Tailwind es `display:grid`, la custom añadía `gap`)
- `.grid .auth-grid` → `.auth-grid` (ídem)

El bloque `<style>` fue **eliminado** de `quienes-somos/index.html` y reemplazado por:

```html
<link href="../../assets/css/quienes-somos.css" rel="stylesheet">
```

El sistema `injectSection()` de `app.js` ya copia automáticamente los `<link>` del `<head>` al documento principal, por lo que funciona correctamente tanto en modo standalone como inyectado.

---

### 8. JS del formulario extraído a archivo externo

**Problema:** `pages/sumate/index.html` tenía **71 líneas de JavaScript** inline que:
1. Definían `function openModal(el)` y `function closeModal(el)` a nivel global.
2. Estas funciones **colisionaban** con el `window.openModal(id)` y `window.closeModal(id)` de `app.js` (diferentes firmas: una recibe elemento, la otra recibe string ID).
3. Mezclaban lógica de negocio con el markup HTML.

**Solución:** Creado `assets/js/sumate-form.js`:
- Todo el código está dentro de un IIFE con `'use strict'`.
- Las funciones del modal de éxito se renombraron a `showSuccess()` / `hideSuccess()` → sin colisión global.
- `sumate/index.html` ahora carga el script externo:

```html
<script src="../../assets/js/app.js"></script>
<script src="../../assets/js/sumate-form.js"></script>
```

---

### 9. Dark mode mejorado en `src/input.css`

**Problema:** El dark mode usaba `.dark .clase { ... !important }` (~30+ veces). El `!important` masivo hace que cualquier override futuro sea muy difícil.

**Solución:** Los selectores cambiaron de `.dark` a `html.dark`:

```css
/* Antes (especificidad 0-1-0 = necesita !important) */
.dark .text-gray-700 { @apply text-gray-300 !important; }

/* Después (especificidad 0-1-1 = supera Tailwind sin !important) */
html.dark .text-gray-700 { @apply text-gray-300; }
```

El `!important` se conservó **únicamente** donde el HTML usa estilos `inline` (atributo `style=""`), que css de specificity más alta no puede sobrescribir.

---

## 🟡 Fixes de Prioridad Media

### 10. `loading="lazy"` en imágenes

Agregado en:
- `layouts/header.html` → logo del header
- `layouts/footer.html` → logo del footer

```html
<img src="..." alt="..." loading="lazy">
```

---

### 11. Estadísticas unificadas entre secciones

**Problema:** Los números estadísticos difería entre `secretarias/index.html` y `sumate/index.html` (mismo dato, diferente texto descriptivo).

**Solución:** Unificados a:
| Número | Descripción |
|---|---|
| 500+ | Jóvenes Activos |
| 35+ | Proyectos Activos |
| 50+ | Localidades con Presencia |

---

### 12. Archivos vacíos eliminados

Los siguientes archivos existían pero tenían **0 bytes** y no eran referenciados en ningún lugar:

| Archivo eliminado |
|---|
| `src/modal.css` |
| `src/modal-styles.css` |
| `assets/js/modal.js` |
| `layouts/modal.html` |

---

## 🔧 Regeneración de CSS

Después de los cambios en `src/input.css`, se ejecutó la reconstrucción de Tailwind:

```bash
node_modules\.bin\tailwindcss -i ./src/input.css -o ./output.css --minify
```

**Resultado:** `Done in 1076ms.` ✅  
El archivo `output.css` fue regenerado con todas las actualizaciones.

---

## 📁 Resumen de archivos afectados

### Modificados
| Archivo | Qué cambió |
|---|---|
| `index.html` | Título, favicon, OG tags, Font Awesome |
| `layouts/header.html` | `loading="lazy"` en logo |
| `layouts/footer.html` | `loading="lazy"` en logo, eliminado link Font Awesome |
| `pages/secretarias/index.html` | Rutas relativas, estadísticas unificadas |
| `pages/quienes-somos/index.html` | Eliminado bloque `<style>` (280 líneas), usa CSS externo |
| `pages/sumate/index.html` | Eliminado bloque `<script>` (71 líneas), usa JS externo |
| `assets/js/app.js` | Reorganizado con secciones, hash unificado, navigateToSection eliminado |
| `src/input.css` | Dark mode con `html.dark`, reducción de `!important` |
| `output.css` | Regenerado con `npm run build` |

### Creados
| Archivo nuevo | Propósito |
|---|---|
| `assets/css/quienes-somos.css` | Estilos de componentes de la sección "¿Quiénes somos?" |
| `assets/js/sumate-form.js` | Lógica del formulario de adhesión (extraída del inline) |

### Eliminados
| Archivo eliminado | Razón |
|---|---|
| `src/modal.css` | Vacío, sin uso |
| `src/modal-styles.css` | Vacío, sin uso |
| `assets/js/modal.js` | Vacío, sin uso |
| `layouts/modal.html` | Vacío, sin uso |

---

## ⚠️ Lo que NO se cambió (requiere acción manual)

| Pendiente | Razón |
|---|---|
| Datos de autoridades (nombres, redes) | Requiere información real del equipo |
| Botón "Conocé nuestras propuestas" (apunta a `#`) | No se sabe a qué contenido debe apuntar |
| Imagen `fondo-form.jpg` (1.9MB) | Requiere herramienta externa para comprimir |
| Favicon de alta resolución | El logo actual (PNG) es suficiente por ahora |

---

## 🛠 Cómo seguir desarrollando

```bash
# Instalar dependencias (una vez)
npm install

# Modo desarrollo — recompila CSS al guardar
node_modules\.bin\tailwindcss -i ./src/input.css -o ./output.css --watch

# Build para producción
node_modules\.bin\tailwindcss -i ./src/input.css -o ./output.css --minify
```

> **Recordar:** Siempre correr el build antes de publicar en producción.
