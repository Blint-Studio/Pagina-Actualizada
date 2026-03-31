# Diagnóstico y Plan de Refactorización

> Análisis completo del proyecto `frentecivicoweb-main`. Prioridades: 🔴 Crítico · 🟠 Alto · 🟡 Medio · 🟢 Bajo

---

## 🔎 Diagnóstico General

| Área | Estado | Calificación |
|---|---|---|
| Estructura de archivos | Modular y clara | ✅ Buena |
| HTML semántico | Mezcla de semántico e inline styles | ⚠️ Regular |
| CSS / TailwindCSS | Duplicación de estilos entre archivos | ⚠️ Regular |
| JavaScript | Monolito de 398 líneas, sin módulos | ⚠️ Regular |
| Performance | Imagen pesada, no hay lazy loading | ⚠️ Regular |
| SEO / Accesibilidad | Deficiencias en título, favicon, alt texts | 🔴 Malo |
| Mantenibilidad | Datos hardcodeados, placeholders sin completar | 🔴 Malo |
| Dark mode | Implementado, pero con muchos `!important` | ⚠️ Regular |
| Formulario | Funciona bien con Formspree | ✅ Buena |
| Responsive | Mobile-first correcto | ✅ Buena |

---

## 🔴 Problemas Críticos (resolver antes de publicar)

### 1. Título incorrecto en `index.html`

```html
<!-- ACTUAL (línea 7 de index.html) -->
<title>JFC fnpmront</title>

<!-- CORRECTO -->
<title>Juventud Frente Cívico de Córdoba</title>
```

**Impacto:** SEO, primeras impresiones, pestaña del navegador.

---

### 2. Sin favicon

Ningún archivo HTML tiene `<link rel="icon">`. El navegador muestra un ícono genérico.

**Fix:** Agregar en el `<head>` de `index.html`:
```html
<link rel="icon" type="image/png" href="assets/img/logo.png">
```

---

### 3. Autoridades con datos placeholder

En `pages/quienes-somos/index.html`, todas las tarjetas de autoridades dicen "Nombre Apellido" y todos los links sociales son `href="#"`. Los modales también tienen datos ficticios.

**Fix:** Completar los datos reales de cada autoridad. Es la tarea de contenido más urgente.

---

### 4. Imagen `fondo-form.jpg` sin optimizar

El archivo pesa **1.89 MB** y se usa como fondo del formulario de adhesión. Esto penaliza fuertemente el tiempo de carga.

**Fix:** Comprimir a < 300KB usando [Squoosh](https://squoosh.app/) o similar. Considerar formato WebP.

---

### 5. Rutas absolutas en links de secretarías

En `pages/secretarias/index.html`, los links usan rutas absolutas:
```html
<a href="/pages/secretarias/comunicacion.html">
```

Esto rompe en GitHub Pages u hostings que no estén en la raíz del dominio. 

**Fix:** Cambiar a rutas relativas:
```html
<a href="comunicacion.html">
```

---

## 🟠 Problemas de Alta Prioridad

### 6. `app.js` es un monolito de 398 líneas

El archivo único mezcla: gestión de tema, inyección de páginas, configuración del header, navegación suave, modales, scroll handling. Es difícil de mantener.

**Refactorización sugerida — separar en módulos:**

```
assets/js/
├── app.js          ← Orquestador (solo inicialización e imports)
├── theme.js        ← getStoredTheme, applyTheme, themeToggle
├── injector.js     ← inject(), injectSection(), persistModals()
├── header.js       ← setupHeader(), scroll hide/show, activeNav
├── modals.js       ← openModal(), closeModal(), listeners
└── navigation.js   ← smooth scroll, hash handling
```

> **Nota:** Requiere usar `type="module"` en los scripts o un bundler simple (esbuild/rollup).

---

### 7. Estilos CSS duplicados entre páginas

`pages/quienes-somos/index.html` tiene ~280 líneas de CSS inline que reimplementan clases de Tailwind ya existentes (`.container`, `.mb-16`, `.text-center`, `.font-bold`, `.grid`, etc.) y también agrega estilos de tarjetas que deberían estar en `src/input.css`.

**Fix:** Mover todos los estilos custom de `quienes-somos` al archivo `src/input.css` bajo `@layer components`:

```css
/* src/input.css */
@layer components {
  .authority-card { /* ... */ }
  .authority-avatar { /* ... */ }
  .card { /* ... */ }
  .btn { /* ... */ }
  .btn-gradient-coral { /* ... */ }
  /* etc. */
}
```

---

### 8. Exceso de `!important` en el dark mode

`src/input.css` usa `!important` en casi todas las reglas de dark mode (~30+ veces). Esto hace que cualquier override futuro sea muy difícil.

**Fix:** Aumentar la especificidad de los selectores en vez de usar `!important`:

```css
/* En vez de: */
.dark .text-gray-700 { @apply text-gray-300 !important; }

/* Usar: */
html.dark .text-gray-700 { @apply text-gray-300; }
```

---

### 9. Font Awesome se carga solo en el footer

`layouts/footer.html` carga Font Awesome al final. Si el footer no se inyecta antes de que se rendericen los iconos, estos se muestran vacíos por un instante.

**Fix:** Mover el link de Font Awesome al `<head>` del `index.html`:
```html
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
```

---

### 10. No hay meta OG tags (Open Graph / Twitter Cards)

Compartir el sitio en redes sociales muestra un preview genérico sin imagen ni descripción atractiva.

**Fix:** Agregar en el `<head>` del `index.html`:
```html
<meta property="og:title" content="Juventud Frente Cívico de Córdoba">
<meta property="og:description" content="Construyendo el futuro de Córdoba. Participá · Proponé · Hacé que pase.">
<meta property="og:image" content="https://tu-dominio.com/assets/img/logo.png">
<meta property="og:url" content="https://tu-dominio.com">
<meta name="twitter:card" content="summary_large_image">
```

---

## 🟡 Mejoras de Prioridad Media

### 11. Sin lazy loading en imágenes

Aunque hay pocas imágenes, las subpáginas de secretarías podrían tener más en el futuro.

**Fix:** Agregar `loading="lazy"` a todas las etiquetas `<img>` que no sean above-the-fold:
```html
<img loading="lazy" src="..." alt="...">
```

---

### 12. Animaciones con `style` inline en `sumate/index.html`

Los elementos `.animate-on-scroll` tienen la animación definida como atributo `style`, no como clase CSS:
```html
<div style="animation: fadeIn 1.2s ease-out;">
```

Esto impide gestionarlos desde hojas de estilo y dificulta el control de accesibilidad (usuarios con `prefers-reduced-motion`).

**Fix:** Mover a clases en `src/input.css` y respetar la preferencia del usuario:
```css
@media (prefers-reduced-motion: no-preference) {
  .animate-fade-in { animation: fadeIn 1s ease-out; }
}
```

---

### 13. `navigateToSection()` reemplaza todo el body

La función `navigateToSection()` en `app.js` hace fetch de `index.html` y reemplaza `document.body.innerHTML` completo. Esto es una técnica muy frágil que puede perder event listeners y causar comportamientos inesperados.

**Fix:** Usar `history.pushState()` + recarga selectiva de la sección, o simplemente navegar vía `href`.

---

### 14. Lógica de hash duplicada

En `app.js` hay dos bloques casi idénticos para manejar el hash al cargar (uno para `index.html`, otro para `/`). 

**Fix:** Unificar en una función:
```js
function handleInitialHash() {
  const isIndex = location.pathname.endsWith('index.html') 
               || location.pathname.endsWith('/');
  if (!isIndex || !location.hash) return;
  const id = location.hash.slice(1);
  history.replaceState(null, '', location.pathname);
  setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }), 300);
}
```

---

### 15. Archivos vacíos sin uso

Los siguientes archivos existen pero están **vacíos** y no son referenciados ni usados:
- `src/modal.css`
- `src/modal-styles.css`  
- `assets/js/modal.js`
- `layouts/modal.html`

**Fix:** Eliminarlos para no causar confusión.

---

### 16. Los links de "Conocé nuestras propuestas" no llevan a ningún lado

En `pages/quienes-somos/index.html`, el botón CTA principal dice "Conocé nuestras propuestas" pero su `href="#"` no apunta a ningún contenido.

**Fix:** O eliminar el botón, o apuntarlo a una sección/página real de propuestas.

---

### 17. Estadísticas inconsistentes entre secciones

- `pages/secretarias/index.html`: dice "25+ Proyectos en Marcha" y "500+ Miembros".
- `pages/sumate/index.html`: dice "25+ Proyectos Activos" y "500+ Jóvenes Activos".

Los números coinciden, pero los textos descriptivos difieren levemente. Unificar la redacción.

---

## 🟢 Mejoras de Baja Prioridad (futuro)

### 18. Extraer datos a JSON (Data Layer)

Actualmente el contenido (autoridades, secretarías, estadísticas) está hardcodeado en el HTML. A futuro, considerar un archivo `data/content.json` que `app.js` lea y renderice dinámicamente mediante templates JS.

**Beneficio:** Actualizar contenido sin tocar HTML.

---

### 19. Convertir a componentes reutilizables

Bloques como las tarjetas de autoridades, tarjetas de secretarías y tarjetas de beneficios son estructuralmente idénticas pero están copiadas y pegadas. Podrían convertirse en funciones JS generadoras de HTML:

```js
function renderAuthorityCard({ name, role, color, modalId }) {
  return `<div class="authority-card">...</div>`;
}
```

---

### 20. Agregar transiciones de página

Actualmente no hay transición visual al hacer scroll entre secciones del landing. Considerar `IntersectionObserver` con clases de fade-in para animar la entrada de cada sección al viewport.

---

### 21. Considerar un generador de sitios estáticos

Si el proyecto crece (más páginas, más secciones), evaluar migrar a:
- **Astro** (ideal para sitios HTML con componentes parciales)
- **11ty (Eleventy)** (muy ligero, compatible con el stack actual)

Ambos permiten mantener la filosofía modular actual pero con un sistema de templates real, sin necesidad de `fetch()` en el cliente.

---

### 22. Agregar `sitemap.xml` y `robots.txt`

Para mejorar el SEO e indexación en buscadores.

**robots.txt básico:**
```
User-agent: *
Allow: /
Sitemap: https://tu-dominio.com/sitemap.xml
```

---

## 📊 Resumen de Tareas por Prioridad

### 🔴 Crítico (hacer antes de publicar)
- [ ] Corregir `<title>` del `index.html`
- [ ] Agregar favicon
- [ ] Completar datos reales de autoridades (nombres, redes)
- [ ] Optimizar `fondo-form.jpg` (de 1.9MB a <300KB)
- [ ] Cambiar rutas absolutas de secretarías a relativas

### 🟠 Alto (sprint siguiente)
- [ ] Separar `app.js` en módulos
- [ ] Mover estilos inline de `quienes-somos` a `src/input.css`
- [ ] Eliminar `!important` del dark mode
- [ ] Mover Font Awesome al `<head>` de `index.html`
- [ ] Agregar meta OG/Twitter tags

### 🟡 Medio (cuando haya tiempo)
- [ ] Agregar `loading="lazy"` a imágenes
- [ ] Mover animaciones inline a clases CSS
- [ ] Refactorizar `navigateToSection()`
- [ ] Unificar las dos funciones de manejo de hash
- [ ] Eliminar archivos vacíos
- [ ] Revisar/completar botón "Conocé nuestras propuestas"
- [ ] Unificar estadísticas entre secciones

### 🟢 Bajo (mejoras futuras)
- [ ] Data layer JSON para autoridades/secretarías
- [ ] Componentes JS reutilizables
- [ ] Transiciones de entrada al hacer scroll
- [ ] Evaluar migración a Astro o 11ty
- [ ] Agregar `sitemap.xml` y `robots.txt`

---

## 🔧 Cómo hacer los refactors sin romper nada

### Regla general
> Cada cambio debería poder hacerse de forma **aislada**. Editar un archivo a la vez, verificar en el navegador, y solo entonces avanzar al siguiente.

### Orden recomendado
1. **Primero:** Fixes críticos de contenido (título, favicon, autoridades, imagen).
2. **Segundo:** CSS — mover estilos de `quienes-somos` a `src/input.css` y correr `npm run build`.
3. **Tercero:** JS — separar `app.js` en módulos uno por uno, verificando que nada se rompa en cada paso.
4. **Cuarto:** SEO y accesibilidad (OG tags, `alt` texts, `aria` labels).
5. **Quinto:** Optimizaciones de performance y mejoras de UX menor.

### Cómo probar cambios localmente
```bash
# Terminal 1: compilar CSS en modo watch
npm run dev

# En el navegador: abrir index.html con Live Server (VS Code)
# o con un servidor simple:
npx serve .
```

### Si algo se rompe
- Revisar la consola del navegador (F12 → Console).
- Los errores más comunes son: ruta incorrecta en `fetch()`, clase de Tailwind no generada (requiere `npm run build`), ID de modal mal escrito.
- Usar `git diff` para ver qué cambió.
