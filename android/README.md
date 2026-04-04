# Streakly - App Android (Proyecto Esqueleto)

## Descripción
Streakly es una aplicación Android para el seguimiento de hábitos y rachas, desarrollada en Java siguiendo la arquitectura MVVM.

## Estructura del Proyecto

```
android/
├── build.gradle              # Configuración de dependencias
├── src/
│   ├── main/
│   │   ├── AndroidManifest.xml
│   │   ├── java/com/universae/streakly/
│   │   │   ├── ui/
│   │   │   │   ├── MainActivity.java          # Actividad principal con navegación
│   │   │   │   ├── auth/                      # Autenticación Firebase
│   │   │   │   ├── habits/                    # Gestión de hábitos
│   │   │   │   ├── stats/                     # Estadísticas y gráficas
│   │   │   │   └── profile/                   # Perfil de usuario
│   │   │   ├── data/
│   │   │   │   ├── model/
│   │   │   │   │   └── Habit.java             # Modelo de datos con Room
│   │   │   │   ├── dao/                       # DAO para SQLite
│   │   │   │   ├── database/                  # Room Database
│   │   │   │   ├── repository/                # Repositorios de datos
│   │   │   │   └── viewmodel/                 # ViewModels
│   │   │   └── network/                   # API REST con Retrofit
│   │   └── res/                       # Recursos (layouts XML, drawables, etc.)
```

## Tecnologías Implementadas

### Arquitectura
- **Patrón MVVM** (Model-View-ViewModel)
- **LiveData** y **ViewModel** para gestión de estado
- **Navigation Component** para navegación entre fragmentos

### Base de Datos
- **Room Database** (SQLite) para persistencia local
- **Firebase Firestore** para sincronización en la nube
- Sincronización bidireccional entre local y remoto

### Autenticación
- **Firebase Authentication**
  - Email/Password
  - Google Sign-In
- Gestión de sesiones de usuario

### Networking
- **Retrofit 2** para consumo de API REST
- **Gson Converter** para serialización JSON

### UI/UX
- **Material Design Components**
- **ViewBinding** para acceso seguro a vistas
- **BottomNavigationView** para navegación principal
- **RecyclerView** para listas eficientes

## Características Principales

### 1. Gestión de Hábitos
- Crear, editar y eliminar hábitos personalizados
- Categorías: Salud, Fitness, Aprendizaje, Trabajo, Otro
- Emojis personalizados para cada hábito
- Sistema de rachas (streak) para motivación

### 2. Seguimiento de Rachas
- Cálculo automático de días consecutivos
- Notificaciones para mantener rachas activas
- Historial de completados

### 3. Estadísticas
- Gráficas de progreso
- Racha máxima alcanzada
- Porcentaje de completado semanal/mensual
- Comparación entre hábitos

### 4. Sincronización
- **Modo Offline-First**: Funciona sin conexión
- Sincronización automática con Firestore cuando hay conexión
- Resolución de conflictos por timestamp

### 5. Seguridad y Optimización
- Cifrado de datos sensibles
- Validación de entrada de usuario
- Manejo de errores robusto
- Optimización de consultas a BD
- Caché de imágenes

## Dependencias Principales

```gradle
// AndroidX
implementation 'androidx.appcompat:appcompat:1.6.1'
implementation 'com.google.android.material:material:1.11.0'
implementation 'androidx.lifecycle:lifecycle-viewmodel-ktx:2.7.0'
implementation 'androidx.navigation:navigation-fragment:2.7.6'

// Firebase
implementation platform('com.google.firebase:firebase-bom:32.7.0')
implementation 'com.google.firebase:firebase-auth'
implementation 'com.google.firebase:firebase-firestore'

// Room Database
implementation 'androidx.room:room-runtime:2.6.1'
annotationProcessor 'androidx.room:room-compiler:2.6.1'

// Retrofit
implementation 'com.squareup.retrofit2:retrofit:2.9.0'
implementation 'com.squareup.retrofit2:converter-gson:2.9.0'
```

## Configuración

### Requisitos Previos
- Android Studio Arctic Fox o superior
- JDK 8 o superior
- SDK Android 24 (Nougat) o superior
- Cuenta de Firebase activa

### Instalación
1. Clonar el repositorio:
```bash
git clone https://github.com/Anibaljgg/streakly.git
cd streakly/android
```

2. Configurar Firebase:
   - Descargar `google-services.json` desde Firebase Console
   - Colocar en `android/app/`

3. Abrir proyecto en Android Studio

4. Compilar y ejecutar en emulador o dispositivo físico

## Uso

### Crear un Hábito
1. Iniciar sesión con email o Google
2. Tap en botón "+"
3. Ingresar nombre, emoji y categoría
4. Guardar

### Completar Hábito
1. Tap en el botón circular del hábito
2. La racha se actualiza automáticamente
3. Cambio sincronizado con Firestore

## API REST (Futura Implementación)

El proyecto incluye Retrofit configurado para consumir una API REST personalizada:

```java
GET    /api/habits          # Obtener todos los hábitos
POST   /api/habits          # Crear hábito
PUT    /api/habits/{id}     # Actualizar hábito
DELETE /api/habits/{id}     # Eliminar hábito
POST   /api/habits/{id}/complete  # Marcar como completado
```

## Arquitectura MVVM

```
View (Activity/Fragment)
    ↓
ViewModel (LiveData)
    ↓
Repository (abstraction)
    │
    ├── Local Data Source (Room)
    │
    └── Remote Data Source (Firebase/Retrofit)
```

## Testing

```bash
# Unit Tests
./gradlew test

# Integration Tests
./gradlew connectedAndroidTest
```

## Contribuciones

Este es un proyecto académico para la Universae DAM - Línea 3.

## Licencia

MIT License - Ver archivo LICENSE para más detalles.

## Autor

Anibal González - Proyecto Final DAM 2025
