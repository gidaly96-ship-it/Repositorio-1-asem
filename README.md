# 🚀 Sistema de Gestión para Consultorios/Negocios

## 📱 Progressive Web App (PWA)

Aplicación completa de gestión que puede instalarse como app nativa en celular y laptop.

### ✨ Características:

- 👥 **Gestión de Pacientes/Clientes** - Sistema inteligente que detecta el tipo de negocio
- 💰 **Finanzas** - Control de ingresos y egresos con gráficas
- 📅 **Agenda** - General y por especialidad
- 🔔 **Recordatorios** - Pagos y publicidad
- 📊 **Deudas** - Control de deudas y acreencias
- 📝 **Notas** - Sistema de notas con categorías y colores
- 📇 **Directorio** - Base de datos de proveedores
- 🛒 **Lista de Compras** - Con comparación de proveedores
- ✅ **Checklists** - Múltiples listas personalizables
- 🧮 **Calculadora** - Costos por hora y por tratamiento

### 🎯 Detección Inteligente:

La app detecta automáticamente el tipo de negocio basándose en el nombre que configures:
- **Consultorios/Clínicas**: Usa "Paciente/Pacientes"
- **Otros Negocios**: Usa "Cliente/Clientes"

### 📦 Tecnologías:

- **React** + **TypeScript**
- **Tailwind CSS** v4
- **React Router** v7
- **Recharts** para gráficas
- **Radix UI** para componentes
- **PWA** con service worker

### 🔧 Instalación:

```bash
pnpm install
pnpm build
```

### 🌐 Desplegar en Vercel:

1. Conecta este repositorio con Vercel
2. Vercel detectará automáticamente la configuración
3. Tu app estará disponible en: `https://tu-app.vercel.app`

### 📱 Instalar en Dispositivos:

#### En Celular (Android/iPhone):
1. Abre la app en Chrome/Safari
2. Toca el banner "Instalar Aplicación"
3. Confirma la instalación
4. La app aparecerá en tu pantalla de inicio

#### En Laptop/PC:
1. Abre la app en Chrome/Edge
2. Busca el ícono ⊕ en la barra de direcciones
3. Haz clic en "Instalar"
4. La app se abrirá en ventana independiente

### ⚙️ Personalización:

- **Nombre**: Editable desde la interfaz (esquina superior izquierda)
- **Colores**: Configurables en `/src/styles/theme.css`
- **Logo**: Reemplaza los íconos en `/public/icon-*.png`

### 🔒 Seguridad:

**⚠️ IMPORTANTE:** Esta aplicación no está diseñada para almacenar información médica real o datos personales sensibles (PII) sin medidas adicionales de seguridad.

Para uso profesional con datos reales:
- Implementa cifrado de extremo a extremo
- Cumple con regulaciones locales (HIPAA, GDPR, etc.)
- Considera servidores dedicados con certificaciones
- Implementa autenticación robusta

### 📄 Licencia:

MIT License - Úsalo libremente para tu negocio.

---

Creado con ❤️ para consultorios, clínicas y negocios.
