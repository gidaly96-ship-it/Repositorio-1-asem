# 🚀 GUÍA COMPLETA DE DESPLIEGUE EN VERCEL

## ✅ **TU APP YA ESTÁ LISTA**

Todo está configurado y funcionando:
- ✅ PWA instalable en celular y laptop
- ✅ Nombre personalizable (Paciente/Cliente inteligente)
- ✅ 11 módulos completos funcionando
- ✅ Service worker para funcionar offline
- ✅ Íconos para todos los tamaños de pantalla

---

## 📋 **OPCIÓN 1: Desplegar Usando Figma Make (MÁS FÁCIL)**

### Paso 1: Exportar el proyecto
```
1. En Figma Make, busca el botón "Export" o "Descargar"
2. Descarga todo el código como archivo .zip
3. Descomprime el archivo en tu computadora
```

### Paso 2: Subir a GitHub
```
1. Ve a: https://github.com
2. Haz clic en "New repository"
3. Nombre: "consultorio-app" (o el que quieras)
4. Marca: ☑️ Public
5. NO marques: Initialize with README
6. Clic en "Create repository"
```

### Paso 3: Subir tu código
```bash
# Abre la terminal en la carpeta descomprimida y ejecuta:

git init
git add .
git commit -m "Primera versión de mi app"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/consultorio-app.git
git push -u origin main
```

### Paso 4: Desplegar en Vercel
```
1. Ve a: https://vercel.com
2. Clic en "Sign Up" → Usa GitHub para iniciar sesión
3. Clic en "Add New..." → "Project"
4. Selecciona tu repositorio "consultorio-app"
5. Clic en "Import"
6. Vercel detectará automáticamente la configuración
7. Clic en "Deploy"
8. ¡Espera 1-2 minutos y listo!
```

Tu app estará en: `https://consultorio-app.vercel.app`

---

## 📋 **OPCIÓN 2: Desplegar Directamente Desde Figma (SI ESTÁ DISPONIBLE)**

Si Figma Make tiene integración directa con Vercel:

```
1. En Figma Make, busca: "Deploy" o "Publicar"
2. Selecciona "Vercel"
3. Autoriza la conexión con tu cuenta de Vercel
4. Confirma el despliegue
5. ¡Listo! Tu app estará en línea
```

---

## 📋 **OPCIÓN 3: Desplegar con Vercel CLI (PARA DESARROLLADORES)**

### Instalar Vercel CLI
```bash
npm install -g vercel
```

### Desplegar
```bash
# En la carpeta del proyecto:
vercel login
vercel
```

Sigue las instrucciones en pantalla y tu app se desplegará automáticamente.

---

## 📱 **CÓMO INSTALAR LA APP EN TUS DISPOSITIVOS**

### Una vez desplegada en Vercel:

### 📱 **En Celular (Android/iPhone):**

1. **Abre tu navegador** (Chrome en Android, Safari en iPhone)
2. **Navega a tu URL**: `https://tu-app.vercel.app`
3. **Android:**
   - Verás un banner en la parte inferior que dice "Instalar aplicación"
   - Toca "Instalar ahora"
   - La app aparecerá en tu pantalla de inicio
   
4. **iPhone:**
   - Toca el botón de compartir (cuadrado con flecha ⬆️)
   - Desplázate y toca "Agregar a pantalla de inicio"
   - Toca "Agregar"
   - La app aparecerá en tu pantalla de inicio

### 💻 **En Laptop/PC:**

1. **Abre Chrome o Edge**
2. **Navega a tu URL**: `https://tu-app.vercel.app`
3. **Busca el ícono de instalación** en la barra de direcciones:
   - Chrome: Ícono ⊕ o 🖥️ a la derecha de la URL
   - Edge: Ícono de aplicación en la barra de direcciones
4. **Haz clic en el ícono**
5. **Clic en "Instalar"**
6. La app se abrirá en una ventana independiente
7. Aparecerá en tu menú de aplicaciones

---

## 🎨 **PERSONALIZAR TU APP**

### Cambiar el Nombre:
```
1. Abre la app
2. Pasa el cursor sobre "Consultorio Dental" (esquina superior izquierda)
3. Haz clic en el ícono de lápiz 📝
4. Escribe el nombre que quieras
5. Presiona Enter o "Guardar"
```

**Ejemplos:**
- "Dr. García - Odontología" → Usará "Pacientes"
- "Salón de Belleza Mari" → Usará "Clientes"
- "Taller Mecánico Pro" → Usará "Clientes"
- "Clínica Dental Sonrisa" → Usará "Pacientes"

### Cambiar los Íconos:
```
1. Crea íconos cuadrados con tu logo en estos tamaños:
   - 72x72, 96x96, 128x128, 144x144, 152x152, 192x192, 384x384, 512x512
2. Reemplaza los archivos en /public/icon-*.png
3. Vuelve a desplegar en Vercel
```

### Cambiar Colores:
```
Edita el archivo: /src/styles/theme.css

Busca y cambia:
- --color-primary: #2563eb; (Color azul principal)
- --color-secondary: #10b981; (Color verde)
```

---

## 🔧 **SOLUCIÓN DE PROBLEMAS**

### ❌ Error: "Command not found: pnpm"
```bash
# Instala pnpm primero:
npm install -g pnpm
```

### ❌ La app no se instala en el celular
```
1. Asegúrate de usar HTTPS (Vercel lo hace automáticamente)
2. En Android, usa Chrome (no otros navegadores)
3. En iPhone, usa Safari (no otros navegadores)
4. Verifica que el manifest.json esté accesible: 
   https://tu-app.vercel.app/manifest.json
```

### ❌ El nombre no cambia la terminología
```
1. Borra el caché del navegador
2. Recarga la página con Ctrl+F5 (Cmd+Shift+R en Mac)
3. Verifica que el nombre tenga palabras clave como:
   - "consultorio", "dental", "clínica", "doctor", "médico"
```

### ❌ Los datos se borran al cerrar
```
- Los datos se guardan en localStorage del navegador
- Si cambias de dispositivo, no verás los mismos datos
- Para datos persistentes en la nube, necesitas conectar Supabase
  (ver archivo INSTRUCCIONES-FINALES.md)
```

---

## 🔄 **ACTUALIZAR TU APP**

### Si hiciste cambios y quieres actualizarlos:

**Opción 1: GitHub + Vercel (Recomendado)**
```bash
git add .
git commit -m "Descripción de los cambios"
git push
```
Vercel detectará los cambios y actualizará automáticamente.

**Opción 2: Vercel CLI**
```bash
vercel --prod
```

---

## 🎯 **CHECKLIST FINAL**

Antes de usar tu app en producción, verifica:

- ✅ La app se abre correctamente en `https://tu-app.vercel.app`
- ✅ Se puede instalar en celular (Android/iPhone)
- ✅ Se puede instalar en laptop (Chrome/Edge)
- ✅ El nombre personalizado funciona correctamente
- ✅ La detección Paciente/Cliente funciona
- ✅ Todos los módulos funcionan (Pacientes, Agenda, Finanzas, etc.)
- ✅ La app funciona offline después de la primera visita
- ✅ Los datos se guardan en localStorage

---

## 🆓 **COSTOS**

### Vercel - Plan Hobby (GRATIS para siempre):
- ✅ 100 GB de ancho de banda/mes
- ✅ Despliegues ilimitados
- ✅ SSL/HTTPS automático
- ✅ CDN global
- ✅ Dominio personalizado (opcional)

**Límites del plan gratuito:**
- 100 GB bandwidth/mes (suficiente para ~10,000 usuarios/mes)
- Después de los límites, puedes actualizar al plan Pro ($20/mes)

### GitHub (GRATIS):
- ✅ Repositorios públicos ilimitados
- ✅ Repositorios privados ilimitados (con límites de colaboradores)

### Tu Dominio Personalizado (OPCIONAL):
- Si quieres tu propio dominio (ej: consultorio-garcia.com):
  - Compra dominio: ~$10-15/año (GoDaddy, Namecheap, etc.)
  - Configúralo en Vercel → Settings → Domains

---

## 🎉 **¡FELICIDADES!**

Tu aplicación profesional está lista para usarse. Es:

- ✨ Moderna y rápida
- 📱 Instalable como app nativa
- 🆓 Completamente GRATIS
- 🌐 Accesible desde cualquier dispositivo
- 💾 Con datos persistentes en localStorage
- 🔒 Segura con HTTPS

### 🚀 **Próximos Pasos Opcionales:**

1. **Conectar Supabase** para datos en la nube (ver INSTRUCCIONES-FINALES.md)
2. **Comprar dominio personalizado** (opcional)
3. **Agregar autenticación** para múltiples usuarios
4. **Implementar backups automáticos**

---

## 📞 **¿Necesitas Ayuda?**

- Documentación de Vercel: https://vercel.com/docs
- Documentación de PWA: https://web.dev/progressive-web-apps/
- Documentación de Vite: https://vitejs.dev/

---

**¡Disfruta tu nueva aplicación!** 🎊
