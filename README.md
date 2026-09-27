# 🎬 StreamHub Pro — Universal Streaming & Torrent Dashboard

> **The ultimate command center for movies, TV series, and streams.**  
> Seamlessly integrates **Torrentio**, **YIFY / YTS**, **EZTV**, **Comet**, and **100% Free Legal Platforms** into one fast, modern dashboard with a **built-in cinema player (just like Stremio & Kodi)** designed for **PC**, **Android Phones**, and **Smart TVs (Android TV / Google TV / Fire TV)**.

[![GitHub Pages Deployment](https://img.shields.io/badge/GitHub_Pages-Ready-brightgreen?style=for-the-badge&logo=github)](https://pages.github.com/)
[![PWA Ready](https://img.shields.io/badge/PWA-Installable-blue?style=for-the-badge&logo=pwa)](https://web.dev/progressive-web-apps/)
[![Embedded Player](https://img.shields.io/badge/Player-Kodi_%26_Stremio_Style-blueviolet?style=for-the-badge)](./)
[![TV Navigation](https://img.shields.io/badge/TV_Mode-10--Foot_D--Pad-purple?style=for-the-badge&logo=androidauto)](./)
[![License](https://img.shields.io/badge/License-MIT-orange?style=for-the-badge)](./LICENSE)

---

## 🌟 Key Features

### 🍿 Embedded Cinema Player (Kodi & Stremio Experience)
- **Cinema On-Screen Display (OSD):** Auto-hides after 3.5 seconds of inactivity, re-appears on remote keypress, touch, or mouse movement.
- **On-the-Fly Stream Switcher:** Switch between 4K UHD Torrentio, 1080p YTS, 1080p EZTV, and Comet Debrid streams directly inside the video player without exiting!
- **HLS (.m3u8), MP4 & WebTorrent Support:** Bundled with local `hls.min.js` and `webtorrent.min.js` for instant in-browser torrent and web streaming with live P2P download/upload stats and peer indicators.
- **Aspect Ratio Selector:** Toggle between *Original / Fit*, *Fill Screen (Crop)*, *Stretch 16:9*, and *Cinemascope 21:9*.
- **Subtitles & Captions Suite:** Multi-language subtitle tracks, custom `.srt`/`.vtt` file loader, and real-time subtitle sync adjustment (±0.5s).
- **Audio Boost & Night Mode:** Dialogue enhancer (+150% boost) and dynamic range compression for quiet nighttime viewing.
- **"Up Next" Auto-Binge Prompt:** Automatic countdown banner in the final 30 seconds of an episode to seamlessly transition to the next episode.
- **Playback Resume Memory:** Automatically saves your exact timestamp so you can pick up where you left off.

---

### ⚡ Torrent & Addon Scraper Integration
- **Torrentio Addon:** Real-time stream lookups with quality badges (4K UHD HDR/DV, 1080p, 720p), file sizes, and seeder metrics.
- **YIFY / YTS (Movies):** High-efficiency movie torrents in 720p, 1080p, and 2160p 4K with instant magnet generation.
- **EZTV (TV Series):** Daily TV episode updates, complete season packs, and direct episode magnet links.
- **Comet Addon:** Fast torrent/Debrid index for ultra-quick stream extraction.
- **Direct Magnet & Stream Launcher:** One-click playback in **Embedded Player**, **Stremio App** (`stremio://`), **VLC Player**, or standard torrent clients (qBittorrent, LibreTorrent, Flud).
- **Real-Debrid & Addon Configuration:** Optional API key integration for fast cached streaming.

---

### 📺 10-Foot Smart TV & Remote Control Mode
- **Spatial D-Pad Navigation:** Built-in geometric navigation engine for remote controls (Arrow keys: Up/Down/Left/Right, OK/Enter, Back/Escape).
- **High-Contrast TV Focus:** Glowing luminous indicators and smooth auto-scrolling optimized for living room TV screens.
- **TV Hotkey:** Press `T` on any keyboard to toggle TV Mode instantly.

---

### 🎮 Player Hotkeys & Remote Shortcuts

| Action | Keyboard / Remote Shortcut |
|---|---|
| **Play / Pause** | `Space` or `Enter` / `OK` |
| **Seek -10s / +10s** | `ArrowLeft` / `ArrowRight` |
| **Volume Up / Down** | `ArrowUp` / `ArrowDown` |
| **Fullscreen Toggle** | `F` |
| **Mute / Unmute** | `M` |
| **Subtitles Toggle** | `S` or `C` |
| **Next Episode** | `N` |
| **Exit Player / Back** | `Esc` or `Backspace` |
| **Toggle TV Mode** | `T` |
| **Global Search** | `/` |

---

## 🚀 How to Deploy to GitHub Pages (Static Hosting)

This project is 100% client-side (HTML5, CSS3, ES6+ JavaScript, bundled libs), requiring **zero build steps** and **no backend server**. It runs straight from GitHub Pages.

### Step 1: Push to GitHub

If you are initializing a new repository on your computer:
```bash
# Initialize git in the project root
git init
git add .
git commit -m "feat: complete StreamHub Pro with embedded Kodi/Stremio player"

# Create main branch and link to your GitHub repo
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO-NAME.git
git push -u origin main
```

### Step 2: Enable GitHub Pages in 3 Clicks

1. Go to your repository on **GitHub.com**.
2. Click on **Settings** (top menu bar) → select **Pages** (in the left sidebar).
3. Under **Build and deployment** → **Source**, select **Deploy from a branch**.
4. Set the branch to **`main`** and folder to **`/ (root)`**, then click **Save**.
5. In ~30 seconds, your site will be live at:
   ```
   https://<your-username>.github.io/<your-repo-name>/
   ```

*(The included `.nojekyll` file ensures all static assets, manifests, and icons load without interference from Jekyll).*

---

## 📱 How to Use on Your Devices

### 🖥️ Desktop PC / Mac / Linux
- Open the live URL in Google Chrome, Microsoft Edge, Mozilla Firefox, or Safari.
- Click the install icon in the URL bar to install StreamHub as a standalone desktop app.

### 📱 Android Phone / Tablet
- Open the GitHub Pages link in **Chrome** or **Brave**.
- Tap the **⋮ (Menu)** icon in the top-right corner.
- Tap **"Add to Home screen"** or **"Install app"**.
- StreamHub will launch in fullscreen with native PWA speed and bottom tab navigation.

### 📺 Android TV / Google TV / Fire TV
- Open any TV browser on your Smart TV (e.g. **TV Bro**, **Amazon Silk**, **JioPages**, or **Puffin TV**).
- Navigate to your GitHub Pages URL.
- StreamHub will detect TV viewing distance or you can click **"Switch to TV Mode"** / press the TV Mode button.
- Use the **D-Pad arrows** on your TV remote to jump between movies, stream links, and player controls!

---

## 📁 Repository Structure

```
├── index.html              # Main responsive Single Page Application
├── style.css               # Complete stylesheet (Themes, TV Mode, Cinema OSD, Animations)
├── app.js                  # Modular vanilla JS logic (Search, Streams, Cinema Player, Storage)
├── manifest.webmanifest    # PWA Web Application Manifest
├── sw.js                   # Progressive Web App Service Worker (offline cache)
├── .nojekyll               # Disables Jekyll processing on GitHub Pages
├── 404.html                # GitHub Pages redirect fallback
├── libs/
│   ├── hls.min.js          # Standalone HLS (.m3u8) streaming library
│   └── webtorrent.min.js   # Standalone in-browser WebTorrent P2P library
├── icons/
│   ├── icon-192.png        # 192x192 app icon
│   ├── icon-512.png        # 512x512 maskable app icon
│   ├── apple-touch-icon.png# iOS touch icon
│   ├── favicon.png         # 64x64 favicon
│   └── logo.svg            # Scalable vector logo
├── favicon.ico             # Root favicon
├── README.md               # Documentation & deployment guide
├── LICENSE                 # MIT License
└── .gitignore              # Clean Git ignore rules
```

---

## ⚖️ Disclaimer & License

StreamHub Pro is a client-side media dashboard and metadata indexing interface. It does not host, upload, or store any media files or torrents on its servers. All streaming lookups rely on third-party public indexers or licensed free ad-supported platforms.

Released under the [MIT License](./LICENSE).
