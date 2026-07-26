<p align="center">
  <img src="https://raw.githubusercontent.com/Fer2809fl/asta-/refs/heads/main/src/database/menu.jpg" alt="『𝕬𝖘𝖆』" style="width: 75%; height: auto; max-width: 100px; border-radius: 10px;">
</p>

<p align="center">
  <a href="https://github.com/Fer2809fl/Asta_bot">
    <img title="『𝕬𝖘𝖆』" src="https://img.shields.io/badge/¡Disfruta de un Bot totalmente gratuito, con múltiples funciones y de código abierto! -purple?colorA=%239b33b0&colorB=%23ff0000" alt="Badge">
  </a>
</p>

<p align="center">

[![Node.js](https://img.shields.io/badge/Node.js-%3E%3D20.0.0-339933?logo=node.js&logoColor=white)](https://nodejs.org)
[![License](https://img.shields.io/badge/Licencia-GPL-blue)](./LICENSE)
[![Baileys](https://img.shields.io/badge/Baileys-Multi--Device-25D366?logo=whatsapp&logoColor=white)](https://github.com/Fer2809fl/Baileys)
[![Stars](https://img.shields.io/github/stars/Fer2809fl/Asta_bot?style=social)](https://github.com/Fer2809fl/Asta_bot)

</p>

---

## ◈ Descripción

**『𝕬𝖘𝖆』** es un bot de WhatsApp multifuncional (Multi-Device) basado en `baileys`. Ofrece economía, gacha, IA, descargas, administración de grupos y mucho más, todo en un solo bot completamente gratuito y de código abierto.

> **Powered By** ғᴇʀɴᴀɴᴅᴏ

Este proyecto está en **constante evolución**. Estamos comprometidos en ofrecer a nuestra comunidad un bot increíble. Te invitamos a instalarlo y estar al tanto de todas las novedades.

---

## ◈ Características Principales

| Categoría | Comandos Disponibles |
|---|---|
| 🧠 **IA** | ChatGPT, Gemini, Copilot, generación de imágenes, texto a voz |
| 🪙 **Economía** | Trabajo, minería, pesca, apuestas, inversiones |
| 🎴 **Gacha** | Roll de personajes, harem, intercambios |
| 👥 **Grupos** | Warns, mute, antilink, bienvenida, promociones |
| 📥 **Descargas** | YouTube, TikTok, Instagram, Facebook, Spotify, Pinterest, APKs |
| 🎨 **Stickers** | Normales, animados, con fondo removido |
| 🤖 **Sub-bots** | Vinculación por QR o código, multi-sesión |

> Usa **`!menu`** dentro del chat para ver la lista completa de comandos.

---

## ◈ Información General

<div align="center">

| Dato | Valor |
|---|---|
| **Prefijos** | `!` `.` `/` |
| **Nombre** | 『𝕬𝖘𝖆』 |
| **Icono** | 🤖 |
| **Marca** | 𓏸𓈒 Asta-Bot ꨶ〆⁾ |
| **Desarrollador** | Fernando |
| **Advertencias Máx.** | 3 |
| **Soporte Total** | 50 |

</div>

---

## ◈ Equipo

### ◆ Propietarios

| Contacto | Nombre | Estado |
|---|---|---|
| `+52 14183357841` | Fernando | ✅ Activo |
| `+52 16631079388` | Neykoor | ✅ Activo |
| `+52 14181450063` | Fernando | ✅ Activo |

### ◆ Colaboradores

`+58 4223201386` • `+59 167062252` • `+51 939170057` • `+1 8096521129` • `+59 5981286874` • `+52 17207439397` • `+52 15632332034`

---

## ◈ Enlaces Oficiales

<p align="center">

[![Canal](https://img.shields.io/badge/📢_Únete_al_Canal-25D366?style=for-the-badge&logo=whatsapp&logoColor=white)](https://whatsapp.com/channel/0029Vb7uWR9E50UdCUthCR2B)
[![Grupo](https://img.shields.io/badge/👥_Únete_al_Grupo-25D366?style=for-the-badge&logo=whatsapp&logoColor=white)](https://chat.whatsapp.com/H6uionZcKu9Hpa0CLDrInn)
[![Repo](https://img.shields.io/badge/💻_Ver_Repositorio-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/Fer2809fl/Asta_bot)

</p>

---

## ◈ Instalación

### ☁️ Cloud / VPS

```bash
git clone https://github.com/Fer2809fl/Asta_bot
cd Asta_bot
npm install
npm start
```

### 📱 Termux

```bash
# Actualizar paquetes
termux-setup-storage
pkg update -y && pkg upgrade -y
pkg install -y git nodejs-lts ffmpeg python make clang sqlite

# Clonar repositorio
git clone https://github.com/Fer2809fl/Asta_bot
cd Asta_bot
```

**Variables de entorno (evitan errores de compilación):**

```bash
export GYP_DEFINES="android_ndk_path=''"
export FFMPEG_BIN=$(command -v ffmpeg)
```

Para no escribirlas cada vez, agrégalas a tu perfil:

```bash
echo 'export GYP_DEFINES="android_ndk_path=\x27\x27"' >> ~/.bashrc
echo 'export FFMPEG_BIN=$(command -v ffmpeg)' >> ~/.bashrc
source ~/.bashrc
```

Instala el bot:

```bash
npm install
npm start
```

> Si aparece `(Y/I/N/O/D/Z) [default=N] ?` usa la letra **"y"** y luego **ENTER**.

---

## ◈ Mantener el Bot Activo (24/7)

```bash
termux-wake-lock && npm i -g pm2 && pm2 start index.js --name asta_bot && pm2 save && pm2 logs
```

### Comandos Útiles de PM2

| Comando | Acción |
|---|---|
| `pm2 logs` | Ver ejecución actual |
| `pm2 stop asta_bot` | Detener ejecución |
| `pm2 start asta_bot` | Reiniciar ejecución |
| `pm2 delete asta_bot` | Eliminar historial |

### Bot 24/7 Oficial

Si buscas un bot 24/7 de Asta Bot, contacta: **[Aquí](https://wa.me/524181450063)**

Usa el comando `#code` en el chat.

---

## ◈ Solución de Problemas

### 🔴 El bot se detuvo

```bash
cd Asta_bot && npm start
```

### 🔴 Nuevo inicio de sesión

> Detén el bot con `Ctrl + Z + ENTER` hasta que aparezca `Asta $`

```bash
cd Asta_bot && rm -rf sessions/Owner && npm start
```

### 🔴 Error `android_ndk_path` / `better-sqlite3` / `sqlite3` en Termux

Si `npm install` falla con errores de compilación nativa:

```bash
export GYP_DEFINES="android_ndk_path=''"
export FFMPEG_BIN=$(command -v ffmpeg)
rm -rf node_modules package-lock.json
npm install
```

### 🔴 Error `ffmpeg-static: No binary found for architecture`

```bash
pkg install -y ffmpeg
export FFMPEG_BIN=$(command -v ffmpeg)
rm -rf node_modules package-lock.json
npm install
```

---

## ◈ Configuración

Edita `config.js` en la raíz del proyecto:

- `prefix` — Prefijos de comandos
- `botname`, `wm`, `logo` — Nombre, marca de agua y logo
- `owners` — Números de los dueños
- `ayudantes` — Números autorizados para sugerencias

---

## ◈ Colaboradores

<a href="https://github.com/Fer2809fl/Asta_bot">
  <img src="https://contrib.rocks/image?repo=Fer2809fl/Asta_bot" alt="Colaboradores">
</a>

---

## ◈ Creador

<p align="center">
  <img src="https://github.com/Fer2809fl.png" alt="Fernando" style="width: 150px; height: 150px; border-radius: 50%; border: 3px solid #9b33b0;">
</p>

<p align="center">
  <strong style="font-size: 1.5em;">Fernando</strong>
</p>

<p align="center">
  <sub>Desarrollador principal de 『𝕬𝖘𝖆』</sub>
</p>

---

<p align="center">
  <sub>𓏸𓈒 Asta-Bot ꨶ〆⁾ — Powered By ғᴇʀɴᴀɴᴅᴏ</sub>
</p>

> **Nota:** Este bot puede ser editado completamente. La única condición es dar los créditos a los creadores.
