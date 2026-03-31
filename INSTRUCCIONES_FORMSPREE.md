# 📋 Instrucciones para Configurar Formspree + Google Sheets

## 🎯 Resumen
El formulario de "Sumate" ahora usa **Formspree** para enviar los datos de forma profesional y se puede integrar automáticamente con **Google Sheets** para almacenar todas las respuestas.

---

## 📝 PASO 1: Crear cuenta en Formspree

1. Ir a [https://formspree.io/](https://formspree.io/)
2. Hacer clic en **"Sign Up"** (Registrarse)
3. Puedes registrarte con:
   - Email y contraseña
   - O con tu cuenta de Google (recomendado)
4. El plan **gratuito** permite hasta **50 envíos por mes** (suficiente para comenzar)

---

## 🔧 PASO 2: Crear un nuevo formulario

1. Una vez dentro, hacer clic en **"+ New Form"**
2. Dale un nombre descriptivo, por ejemplo: `"Formulario Sumate - JFC"`
3. En el campo **"Email"**, ingresa el email donde quieres recibir las notificaciones: `bargasgonzalo08@gmail.com`
4. Hacer clic en **"Create Form"**

---

## 🔑 PASO 3: Obtener tu Form ID

1. Después de crear el formulario, verás una pantalla con detalles
2. Busca el **"Form Endpoint"**, se verá algo así:
   ```
   https://formspree.io/f/xyzabc123
   ```
3. Copia el código que está después de `/f/`, por ejemplo: `xyzabc123`

---

## 💻 PASO 4: Actualizar el código HTML

1. Abre el archivo: `pages/sumate/index.html`
2. Busca la línea que dice:
   ```html
   <form id="joinForm" action="https://formspree.io/f/TU_FORM_ID" method="POST"
   ```
3. Reemplaza `TU_FORM_ID` con tu código real, ejemplo:
   ```html
   <form id="joinForm" action="https://formspree.io/f/xyzabc123" method="POST"
   ```
4. Guarda el archivo

---

## 📊 PASO 5: Integrar con Google Sheets

### Opción A: Usando la integración nativa de Formspree (Plan Premium)

Si decides actualizar al plan premium de Formspree ($10/mes), tendrás integración directa:

1. En el dashboard de Formspree, ve a tu formulario
2. Haz clic en **"Integrations"** (Integraciones)
3. Selecciona **"Google Sheets"**
4. Autoriza la conexión con tu cuenta de Google
5. Selecciona la hoja de cálculo donde quieres guardar los datos
6. ¡Listo! Todos los envíos se guardarán automáticamente

### Opción B: Usando Zapier o Make.com (GRATIS)

Esta es la opción **100% gratuita** más recomendada:

#### Con **Zapier** (más sencillo):

1. Crear cuenta en [https://zapier.com/](https://zapier.com/)
2. Crear un nuevo **"Zap"**
3. **Trigger (Disparador)**:
   - Buscar "Formspree"
   - Seleccionar "New Submission"
   - Conectar tu cuenta de Formspree
   - Seleccionar tu formulario "Formulario Sumate - JFC"
4. **Action (Acción)**:
   - Buscar "Google Sheets"
   - Seleccionar "Create Spreadsheet Row"
   - Conectar tu cuenta de Google
   - Seleccionar tu hoja de cálculo
   - Mapear los campos del formulario a las columnas de la hoja
5. **Activar el Zap**
6. ¡Cada envío del formulario se guardará automáticamente en Google Sheets!

#### Con **Make.com** (antes Integromat):

1. Crear cuenta en [https://www.make.com/](https://www.make.com/)
2. Crear un nuevo **"Scenario"**
3. Agregar módulo **Webhook** como trigger
4. Copiar la URL del webhook
5. En Formspree, ir a tu formulario → Settings → Webhooks
6. Pegar la URL del webhook de Make
7. En Make, agregar módulo **Google Sheets** → "Add a Row"
8. Conectar tu cuenta de Google y mapear los campos
9. **Activar el escenario**

### Opción C: Webhook personalizado (Para desarrolladores)

Si tienes conocimientos de programación, puedes crear tu propio webhook que reciba los datos y los guarde en Google Sheets usando la API de Google.

---

## 📧 PASO 6: Configurar notificaciones por email

En Formspree, puedes personalizar los emails de notificación:

1. Ve a tu formulario en Formspree
2. Haz clic en **"Settings"** (Configuración)
3. En **"Email Notifications"**:
   - Puedes agregar más emails para recibir notificaciones
   - Personalizar el asunto del email
   - Personalizar el mensaje

---

## 🎨 PASO 7: Personalizar mensajes (Opcional)

Puedes personalizar los mensajes que ve el usuario:

### Mensaje de éxito:
El código actual ya muestra un mensaje personalizado con el `alert()`. Si quieres personalizarlo más, edita esta línea en el archivo HTML:

```javascript
alert('¡Gracias por sumarte! Pronto nos pondremos en contacto con vos.');
```

### Página de agradecimiento:
En Formspree, puedes configurar una página de agradecimiento personalizada:

1. Ve a Settings → After Submit
2. Puedes elegir:
   - Mostrar un mensaje
   - Redirigir a una página específica de tu sitio

---

## 🧪 PASO 8: Probar el formulario

1. Sube los cambios a tu servidor/hosting
2. Ve a la página del formulario
3. Llena el formulario con datos de prueba
4. Haz clic en "Sumarme ahora"
5. Verifica:
   - ✅ El botón muestra "Enviando..." y luego "✓ ¡Enviado con éxito!"
   - ✅ Recibes un email en `bargasgonzalo08@gmail.com`
   - ✅ Los datos aparecen en Formspree dashboard
   - ✅ (Si configuraste Google Sheets) Los datos aparecen en tu hoja de cálculo

---

## 📊 Ejemplo de estructura de Google Sheets

Crea una hoja de cálculo con las siguientes columnas:

| Fecha | Nombre | Email | Teléfono | Edad | Localidad | Barrio | Motivo |
|-------|--------|-------|----------|------|-----------|--------|--------|

Los datos se llenarán automáticamente con cada envío.

---

## 💰 Comparación de costos

### Plan Gratuito de Formspree:
- ✅ 50 envíos/mes
- ✅ Notificaciones por email
- ✅ Protección anti-spam
- ❌ Sin integración directa con Google Sheets

### Plan Premium de Formspree ($10/mes):
- ✅ 1000 envíos/mes
- ✅ Integración directa con Google Sheets
- ✅ Sin marca de Formspree
- ✅ Archivo de envíos

### Zapier/Make Gratis:
- ✅ 100 tareas/mes (Zapier) o 1000 operaciones/mes (Make)
- ✅ Integración con Google Sheets y muchas otras apps
- ✅ Automatizaciones más complejas

---

## 🔒 Seguridad y Anti-spam

Formspree incluye protección anti-spam automática, pero puedes agregar más seguridad:

### Agregar reCAPTCHA (Opcional):

1. En Formspree, ve a Settings → reCAPTCHA
2. Activa la protección reCAPTCHA
3. Sigue las instrucciones para agregar el script a tu HTML

---

## 🆘 Soporte

- **Documentación de Formspree**: [https://help.formspree.io/](https://help.formspree.io/)
- **Tutoriales de Zapier**: [https://zapier.com/learn/](https://zapier.com/learn/)
- **API de Google Sheets**: [https://developers.google.com/sheets/api](https://developers.google.com/sheets/api)

---

## ✅ Checklist final

- [ ] Cuenta de Formspree creada
- [ ] Formulario creado en Formspree
- [ ] Form ID copiado y pegado en el HTML
- [ ] Archivo HTML actualizado y subido al servidor
- [ ] Integración con Google Sheets configurada (Zapier/Make)
- [ ] Formulario probado con datos de prueba
- [ ] Notificaciones por email funcionando
- [ ] Datos guardándose correctamente en Google Sheets

---

## 📞 Contacto

Si tienes dudas o necesitas ayuda con la configuración, no dudes en contactar.

¡Éxito con el nuevo formulario profesional! 🚀
