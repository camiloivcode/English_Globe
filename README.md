# 🌍 English Globe

Globo terráqueo 3D interactivo que muestra países de habla inglesa. Desarrollado con Three.js con fines educativos para una clase de inglés.

![Demo](https://via.placeholder.com/800x400/2c3e50/ffffff?text=English+Globe+Demo)

## ✨ Características

- 🎮 Globo 3D interactivo con controles de rotación
- 🏴 8 países de habla inglesa con información detallada
- 📊 Estadísticas de población e idioma
- 📱 Diseño completamente responsivo
- 🎨 Animaciones suaves y efectos visuales

## 🚀 Demo en Vivo

[Ver proyecto en vivo](https://english-globe-harold.netlify.app)

## 🛠️ Tecnologías Utilizadas

- **Three.js** - Biblioteca de gráficos 3D
- **HTML5/CSS3** - Estructura y estilos
- **JavaScript ES6+** - Lógica de aplicación
- **GSAP** - Animaciones
- **Netlify** - Despliegue

## 📦 Instalación Local

1. Clona el repositorio:
```bash
git clone https://github.com/tu-usuario/english-globe.git
Abre index.html en tu navegador o usa un servidor local:

bash
# Usando Python
python -m http.server 8000

# Usando Node.js
npx serve .
🎮 Cómo Usar
Arrastra para rotar el globo

Pasa el mouse sobre países resaltados para ver información

Haz clic en nombres de países en la lista para navegar

Usa la rueda del mouse para acercar/alejar

📋 Países Incluidos
Estados Unidos 🇺🇸 - 331M habitantes, 79% habla inglés

Reino Unido 🇬🇧 - 67M habitantes, 98% habla inglés

Canadá 🇨🇦 - 38M habitantes, 86% habla inglés

Australia 🇦🇺 - 25M habitantes, 97% habla inglés

India 🇮🇳 - 1.38B habitantes, 12% habla inglés

Sudáfrica 🇿🇦 - 60M habitantes, 31% habla inglés

Irlanda 🇮🇪 - 5M habitantes, 99% habla inglés

Nueva Zelanda 🇳🇿 - 5M habitantes, 96% habla inglés

🏗️ Estructura del Proyecto
text
english-globe/
├── index.html              # Archivo HTML principal
├── css/
│   └── style.css           # Todos los estilos CSS
├── js/
│   └── main.js             # Configuración de Three.js y lógica
└── assets/
    └── textures/
        └── earth_daymap.jpg # Textura de la Tierra
🔧 Configuración Técnica
Three.js
Escena 3D con luces ambientales y direccionales

Controles OrbitControls para interacción

Geometría esférica de alta resolución

Material Phong con reflejos especulares

Optimizaciones
Detección por raycasting con función throttle (50ms)

Event listeners eficientes

Animaciones suaves con GSAP

Diseño responsivo

🌐 Despliegue
Este proyecto está desplegado en Netlify:

URL Principal: https://english-globe-harold.netlify.app

Método de Despliegue: Conexión directa con GitHub

Configuración: No requiere comando de build

👨‍💻 Autor
Camilo_Iriarte - camiloivcode
yenifer_padilla - git hub

📄 Licencia
Este proyecto fue creado con fines educativos para un concurso de clase de inglés.

🙏 Agradecimientos
Comunidad de Three.js

Google Fonts por la tipografía Poppins

GSAP por la biblioteca de animaciones

Netlify por el hosting gratuito

Profesores por la oportunidad del concurso

📞 Soporte
Si tienes preguntas o problemas:

Revisa que todos los archivos estén en las carpetas correctas

Verifica que la textura esté en assets/textures/earth_daymap.jpg

Asegúrate de tener conexión a internet (las librerías se cargan por CDN)

🐛 Problemas Comunes
Textura no carga: Verifica la ruta del archivo

Errores en consola: Revisa que Three.js y GSAP se carguen correctamente

Rendimiento lento: Funciona mejor en Chrome/Firefox actualizados
