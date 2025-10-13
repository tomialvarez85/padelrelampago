# 🏓 Pádel Relámpago - Sistema de Gestión de Torneos

Una aplicación web moderna para gestionar torneos de pádel a 1 Set. Desarrollada con React, TypeScript y Vite.

## ✨ Características

- **Gestión de Equipos**: Ingresa facilmente los apellidos de los jugadores para formar equipos
- **Armado de Grupos**: Distribución manual de equipos en grupos según preferencias
- **Fase de Grupos**: Todos contra todos dentro de cada grupo
- **Fase de Eliminación**: Cuartos de final, semifinales y final automáticas
- **Gestión de Resultados**: Ingresa y edita los resultados de cada partido
- **Estadísticas Completas**: Seguimiento de victorias, derrotas y porcentajes de cada equipo
- **Almacenamiento Local**: Todos los datos se guardan en localStorage del navegador
- **Interfaz Moderna**: Diseño responsive y atractivo

## 🚀 Instalación y Uso

### Prerrequisitos
- Node.js (version 18 o superior)
- npm o yarn

### Instalación

1. Clona el repositorio:
```bash
git clone <url-del-repositorio>
cd padelrelampago-v1
```

2. Instala las dependencias:
```bash
npm install
```

3. Ejecuta la aplicación en modo desarrollo:
```bash
npm run dev
```

4. Abre tu navegador en `http://localhost:5173`

### Construcción para Producción

```bash
npm run build
```

## 📱 Cómo Usar la Aplicación

### 1. Crear un Torneo
- Haz clic en "Crear Nuevo Torneo"
- Ingresa el nombre del torneo
- Ingresa los apellidos de ambos jugadores de cada equipo
- Agrega al menos 4 equipos para poder crear el torneo
- Haz clic en "Crear Torneo"

### 2. Iniciar el Torneo
- Selecciona el torneo creado
- Haz clic en "Armar Grupos" para distribuir los equipos manualmente
- Puedes usar "Distribuir automáticamente" para una distribución inicial aleatoria
- Ajusta los grupos según tus preferencias moviendo equipos entre grupos
- Haz clic en "Crear Grupos y Iniciar Torneo" cuando estés satisfecho

### 3. Gestionar Partidos
- Ve a la pestaña "Grupos" para ver todos los partidos de la fase de grupos
- Haz clic en "Ingresar Resultado" para cada partido
- Ingresa las puntuaciones de ambos equipos
- Los resultados se guardan automáticamente

### 4. Seguir la Eliminación
- Una vez completados todos los partidos de grupos, se generarán automáticamente los cuartos de final
- Continúa ingresando resultados para avanzar a semifinales y final
- El campeón se mostrará automáticamente al completar la final

### 5. Ver Estadísticas
- Ve a la pestaña "Estadísticas" para ver el rendimiento de todos los equipos
- Incluye victorias, derrotas, total de partidos y porcentaje de victorias

## 🏗️ Estructura del Proyecto

```
src/
├── components/          # Componentes de React
│   ├── TournamentList.tsx
│   ├── CreateTournament.tsx
│   ├── TournamentView.tsx
│   ├── MatchCard.tsx
│   ├── GroupView.tsx
│   ├── BracketView.tsx
│   └── StatsView.tsx
├── services/           # Lógica de negocio
│   └── tournamentService.ts
├── types/              # Definiciones de tipos TypeScript
│   └── index.ts
├── App.tsx             # Componente principal
├── App.css             # Estilos principales
└── index.css           # Estilos base
```

## 🎯 Tecnologías Utilizadas

- **React 18**: Framework de interfaz de usuario
- **TypeScript**: Tipado estático para mayor robustez
- **Vite**: Herramienta de construcción rápida
- **Lucide React**: Iconos modernos
- **localStorage**: Almacenamiento de datos en el navegador
- **CSS Grid & Flexbox**: Layouts modernos y responsive

## 📊 Funcionalidades Técnicas

### Gestión de Datos
- Almacenamiento persistente en localStorage
- Estructura de datos optimizada para torneos
- Cálculo automático de estadísticas

### Lógica de Torneos
- Distribución manual de equipos en grupos
- Creación automática de brackets de eliminación
- Cálculo de posiciones por victorias y games
- Avance automático entre fases

### Interfaz de Usuario
- Diseño responsive para móviles y desktop
- Navegación intuitiva entre vistas
- Feedback visual para estados de partidos
- Formularios validados

## 🎨 Características de Diseño

- **Gradientes Modernos**: Fondo con gradiente atractivo
- **Glassmorphism**: Efectos de cristal en tarjetas
- **Animaciones Suaves**: Transiciones y hover effects
- **Paleta de Colores**: Colores consistentes y accesibles
- **Tipografía Clara**: Jerarquía visual bien definida

## 🔧 Personalización

### Modificar Estilos
Los estilos están organizados en `src/App.css` y se pueden personalizar fácilmente:

- Cambiar colores del tema
- Modificar espaciados y tamaños
- Ajustar animaciones y transiciones

### Agregar Funcionalidades
La estructura modular permite agregar fácilmente nuevas características:

- Nuevos tipos de torneos
- Estadísticas adicionales
- Exportación de datos
- Integración con APIs externas

## 📝 Notas de Desarrollo

### Almacenamiento
- Los datos se guardan en localStorage del navegador
- No se requiere base de datos externa
- Los datos persisten entre sesiones

### Rendimiento
- Componentes optimizados con React hooks
- Cálculos de estadísticas eficientes
- Interfaz responsive y fluida

### Compatibilidad
- Funciona en navegadores modernos
- Soporte completo para móviles
- No requiere conexión a internet

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 🆘 Soporte

Si tienes alguna pregunta o problema:

1. Revisa la documentación
2. Busca en los issues existentes
3. Crea un nuevo issue con detalles del problema

---

¡Disfruta organizando tus torneos de pádel! 🏓
