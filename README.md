# 🔥 Streakly

**Streakly** - App de seguimiento de hábitos y rachas para Android

## 📱 ¿Qué es Streakly?

Streakly es una aplicación web progresiva (PWA) diseñada para ayudarte a construir y mantener hábitos saludables a través del seguimiento de rachas. Cada día que completes un hábito, tu racha aumentará, motivándote a continuar.

## ✨ Características

- ✅ **Crear hábitos personalizados** con emojis
- 🔥 **Sistema de rachas** (streaks) que te motiva a mantener tus hábitos
- 📊 **Estadísticas en tiempo real** de tu progreso
- 🏷️ **Filtrar por categorías**: Salud, Productividad, Deporte, Estudio, Otros
- 🗑️ **Eliminar hábitos** fácilmente
- 💾 **Persistencia de datos** con localStorage
- 📴 **Modo offline** con Service Worker
- 🔐 **Autenticación con Firebase** (email/contraseña y Google)
- 📱 **Instalable como app** en dispositivos móviles y escritorio

## 🚀 Demo en vivo

🌐 **Visita la app**: [https://anibaljgg.github.io/streakly/](https://anibaljgg.github.io/streakly/)

> ⚠️ **Nota**: Debido al caché agresivo de GitHub Pages CDN, la app puede tardar 10-30 minutos en actualizar después de cada cambio. Para usar la versión más reciente, descarga el proyecto y ábrelo localmente (ver instrucciones abajo).

## 📦 Instalación y uso local

### Opción 1: Descargar y abrir directamente

1. **Descarga el proyecto**:
   ```
   https://github.com/Anibaljgg/streakly/archive/refs/heads/main.zip
   ```

2. **Extrae el ZIP** en tu computadora

3. **Abre el archivo `index.html`** con tu navegador:
   - Doble clic en `index.html`
   - O arrastra el archivo al navegador

4. ¡Listo! La app funcionará al 100% en modo local con localStorage

### Opción 2: Servidor local

#### Con Python (preinstalado en Mac/Linux):
```bash
cd streakly-main
python -m http.server 8000
```
Luego abre: `http://localhost:8000`

#### Con Node.js:
```bash
cd streakly-main
npx serve
```
Luego abre la URL que muestre

## 🎯 Cómo usar

1. Abre la app en tu navegador
2. **Crea una cuenta** o **inicia sesión** con:
   - Email y contraseña
   - Cuenta de Google 🔑
3. Añade tus primeros hábitos usando el botón "+"
4. Marca los hábitos como completados cada día
5. ¡Observa cómo crecen tus rachas! 🔥

## 🔧 Tecnologías utilizadas

- **HTML5** - Estructura de la aplicación
- **CSS3** - Estilos y diseño responsive
- **JavaScript** (ES6+) - Lógica de la aplicación
- **Firebase**:
  - Authentication (Email/Password y Google)
  - Firestore (base de datos en tiempo real)
- **PWA** - Progressive Web App
  - Service Worker para modo offline
  - Manifest.json para instalación
- **GitHub Pages** - Hosting gratuito

## 🔥 Configuración de Firebase

La app ya está configurada con Firebase. Si quieres usar tu propia configuración:

1. Crea un proyecto en [Firebase Console](https://console.firebase.google.com/)
2. Habilita Authentication (Email/Password y Google)
3. Crea una base de datos Firestore
4. Copia tu configuración en `app.js`:

```javascript
const firebaseConfig = {
  apiKey: "TU-API-KEY",
  authDomain: "tu-proyecto.firebaseapp.com",
  projectId: "tu-proyecto",
  // ... resto de configuración
};
```

## 📂 Estructura del proyecto

```
streakly/
├── index.html          # Página principal
├── app.js              # Lógica de la aplicación y Firebase
├── sw.js               # Service Worker para modo offline
├── manifest.json       # Configuración PWA
├── INSTRUCCIONES.md    # Instrucciones detalladas de uso
├── README.md           # Este archivo
└── android/            # Proyecto Android (opcional)
```

## 📋 Estado del proyecto

✅ **Archivos principales**:
- `app.js` - CORRECTO - Firebase configurado
- `index.html` - CORRECTO - UI completa en español
- `manifest.json` - CORRECTO - PWA configurado
- `sw.js` - CORRECTO - Service Worker funcional

⏳ **GitHub Pages**: Actualizando (puede tardar 10-30 minutos)

## 📱 Versión Android

El proyecto incluye una carpeta `android/` con un proyecto completo de Android que puede ser compilado con Android Studio.

## 🐛 Solución de problemas

### La app no carga en GitHub Pages

Debido al caché agresivo del CDN de GitHub Pages, los cambios pueden tardar. **Solución**:
1. Descarga el ZIP del proyecto
2. Abre `index.html` localmente
3. Todo funcionará perfectamente

### Los datos no se guardan

Asegúrate de:
- Tener localStorage habilitado en tu navegador
- No estar en modo incógnito/privado
- Tener JavaScript habilitado

## 🤝 Contribuciones

¡Las contribuciones son bienvenidas! Si encuentras un bug o tienes una sugerencia:

1. Haz fork del proyecto
2. Crea una rama para tu feature (`git checkout -b feature/nueva-caracteristica`)
3. Commit tus cambios (`git commit -m 'Añadir nueva característica'`)
4. Push a la rama (`git push origin feature/nueva-caracteristica`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.

## 👤 Autor

**Anibal JGG**
- GitHub: [@Anibaljgg](https://github.com/Anibaljgg)

## 🙏 Agradecimientos

- Proyecto creado para Universae DAM Línea 3
- Inspirado en apps de seguimiento de hábitos como Habitica y Streaks

---

⭐ Si te gusta este proyecto, ¡dale una estrella en GitHub!
