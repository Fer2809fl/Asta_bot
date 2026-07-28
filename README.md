<div align="center">

<!-- BANNER -->

<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=2,10,20&height=180&section=header&text=%E3%80%8E%F0%9D%95%AC%F0%9D%96%98%F0%9D%96%86%E3%80%8F%20%F0%9D%95%B7%F0%9D%96%94%F0%9D%96%99&fontSize=50&fontColor=fff&animation=fadeIn&fontAlignY=38&desc=WhatsApp%20Multi-Device%20%7C%20Econom%C3%ADa%20%2B%20Gacha%20%2B%20IA%20%2B%20Descargas&descAlignY=58&descSize=16" />


<br>

<p>
  <img src="https://img.shields.io/badge/Node.js-18%2B-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" />
  <img src="https://img.shields.io/badge/Baileys-Multi--Device-25D366?style=for-the-badge&logo=whatsapp&logoColor=white" />
  <img src="https://img.shields.io/badge/License-Open%20Source-FFD700?style=for-the-badge" />
</p>

<p>
  <img src="https://img.shields.io/badge/IA-ChatGPT%20%7C%20Gemini%20%7C%20Copilot-412991?style=flat-square&logo=openai&logoColor=white" />
  <img src="https://img.shields.io/badge/Econom%C3%ADa-Trabajo%20%7C%20Miner%C3%ADa%20%7C%20Pesca-10B981?style=flat-square" />
  <img src="https://img.shields.io/badge/Descargas-YT%20%7C%20TK%20%7C%20IG%20%7C%20FB-FF0000?style=flat-square&logo=youtube&logoColor=white" />
</p>

<br>

<p>
  <b>Bot de WhatsApp multifuncional</b> construido sobre <code>Baileys</code>.
  <br>
  Economía, gacha, IA, descargas multimedia, administración de grupos y más.
  <br>
  <b>Completamente gratuito y de código abierto.</b>
</p>

<p>
  <sub>Usa <code>!menu</code> en el chat para ver todos los comandos disponibles.</sub>
</p>

<img src="https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/rainbow.png" width="100%">

</div>

<br>

## 📑 Índice

- [Características](#-características)
- [Requisitos](#-requisitos)
- [Instalación](#-instalación)
  - [Cloud / VPS](#cloud--vps)
  - [Termux (Android)](#termux-android)
- [Mantener Activo 24/7](#-mantener-activo-247)
- [Configuración](#-configuración)
- [Solución de Problemas](#-solución-de-problemas)
- [Equipo](#-equipo)
- [Enlaces](#-enlaces)
- [Licencia](#-licencia)

<br>

<img src="https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/rainbow.png" width="100%">

<br>

## ✨ Características

<div align="center">

| Categoría | Descripción |
|:---------:|:------------|
| 🧠 **IA** | ChatGPT, Gemini, Copilot, generación de imágenes, texto a voz |
| 🪙 **Economía** | Trabajo, minería, pesca, apuestas, inversiones |
| 🎴 **Gacha** | Roll de personajes, harem, intercambios |
| 👥 **Grupos** | Warns, mute, antilink, bienvenida, promociones |
| 📥 **Descargas** | YouTube, TikTok, Instagram, Facebook, Spotify, Pinterest, APKs |
| 🎨 **Stickers** | Normales, animados, con fondo removido |
| 🤖 **Sub-bots** | Vinculación por QR o código, multi-sesión |

</div>

<br>

<img src="https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/rainbow.png" width="100%">

<br>

## ⚙️ Requisitos

| Requisito | Versión Mínima |
|-----------|----------------|
| Node.js | 18.x LTS |
| Git | 2.x |
| FFmpeg | Última estable |
| Python | 3.x *(solo Termux)* |
| SQLite | 3.x |

<br>

<img src="https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/rainbow.png" width="100%">

<br>

## 🚀 Instalación

### Cloud / VPS

```bash
git clone https://github.com/Fer2809fl/Asta_bot.git
cd Asta_bot
npm install
npm start
```

### Termux (Android)

```bash
# 1. Preparar entorno
termux-setup-storage
pkg update -y && pkg upgrade -y
pkg install -y git nodejs-lts ffmpeg python make clang sqlite

# 2. Clonar repositorio
git clone https://github.com/Fer2809fl/Asta_bot.git
cd Asta_bot

# 3. Configurar variables de entorno
export GYP_DEFINES="android_ndk_path=''"
export FFMPEG_BIN=$(command -v ffmpeg)

# 4. Instalar dependencias
npm install
# Si aparece (Y/I/N/O/D/Z) [default=N] ? → escribe "y" y ENTER

# 5. Iniciar
npm start
```

**Para persistir las variables de entorno:**

```bash
echo 'export GYP_DEFINES="android_ndk_path=''"' >> ~/.bashrc
echo 'export FFMPEG_BIN=$(command -v ffmpeg)' >> ~/.bashrc
source ~/.bashrc
```

<br>

<img src="https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/rainbow.png" width="100%">

<br>

## 🔄 Mantener Activo 24/7

```bash
termux-wake-lock && npm i -g pm2 && pm2 start index.js --name asta_bot && pm2 save && pm2 logs
```

### Comandos útiles de PM2

| Comando | Acción |
|---------|--------|
| `pm2 logs` | Ver ejecución en tiempo real |
| `pm2 stop asta_bot` | Detener el bot |
| `pm2 start asta_bot` | Reiniciar el bot |
| `pm2 restart asta_bot` | Reinicio forzado |
| `pm2 delete asta_bot` | Eliminar proceso |
| `pm2 monit` | Monitor interactivo |

<br>

<img src="https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/rainbow.png" width="100%">

<br>

## 🔧 Configuración

Edita `config.js` en la raíz del proyecto:

| Opción | Descripción |
|--------|-------------|
| `prefix` | Prefijos de comandos (`!` `.` `/`) |
| `botname` | Nombre del bot |
| `wm` | Marca de agua |
| `logo` | Logo del bot |
| `owners` | Números de los propietarios |
| `ayudantes` | Números autorizados para sugerencias |

<br>

<img src="https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/rainbow.png" width="100%">

<br>

## 🛠️ Solución de Problemas

### El bot se detuvo

```bash
cd Asta_bot && npm start
```

### Nuevo inicio de sesión (sesión corrupta)

> Detén el bot con `Ctrl + Z` luego `ENTER` hasta que aparezca `Asta $`

```bash
cd Asta_bot && rm -rf sessions/Owner && npm start
```

### Error `android_ndk_path` / `better-sqlite3` / `sqlite3` en Termux

```bash
export GYP_DEFINES="android_ndk_path=''"
export FFMPEG_BIN=$(command -v ffmpeg)
rm -rf node_modules package-lock.json
npm install
```

### Error `ffmpeg-static: No binary found for architecture`

```bash
pkg install -y ffmpeg
export FFMPEG_BIN=$(command -v ffmpeg)
rm -rf node_modules package-lock.json
npm install
```

<br>

<img src="https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/rainbow.png" width="100%">

<br>

## 👥 Equipo

### Propietarios

| Nombre | Rol | Estado |
|--------|-----|:------:|
| **Fernando** | Creador & Desarrollador Principal | ✅ Activo |
| **Neykoor** | Co-Propietario | ✅ Activo |
| **Orion'Wolf**|Co-Propietario| 🛜 Semi-Activo|

### Colaboradores

Gracias a todos los que han contribuido al proyecto. Si deseas colaborar, abre un [Pull Request](https://github.com/Fer2809fl/Asta_bot/pulls) o contacta a los propietarios.

<br>

<img src="https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/rainbow.png" width="100%">

<br>

## 🔗 Enlaces

- [📦 Repositorio](https://github.com/Fer2809fl/Asta_bot)
- [🐛 Reportar Bug](https://github.com/Fer2809fl/Asta_bot/issues)
- [🔃 Pull Request](https://github.com/Fer2809fl/Asta_bot/pulls)

<br>

<img src="https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/rainbow.png" width="100%">

<br>

## 📄 Licencia

Este proyecto se distribuye bajo una licencia de código abierto. Puedes editarlo completamente siempre que des créditos a los creadores originales.

<div align="center">

<br>

**『𝕬𝖘𝖆』** — Powered By ғᴇʀɴᴀɴᴅᴏ

𓏸𓈒 Asta-Bot ꨶ〆⁾

<br>

<p>
  <a href="https://github.com/Fer2809fl/Asta_bot">⭐ Star en GitHub</a> •
  <a href="https://github.com/Fer2809fl/Asta_bot/issues">🐛 Reportar Bug</a> •
  <a href="https://github.com/Fer2809fl/Asta_bot/pulls">🔃 Pull Request</a>
</p>

<br>

<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=2,10,20&height=100&section=footer&animation=fadeIn" />

</div>