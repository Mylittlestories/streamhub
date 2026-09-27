# 🎬 StreamHub Pro — Universal Streaming & Torrent Dashboard

> **The ultimate command center for movies, TV series, and streams.**  
> Seamlessly integrates **Torrentio**, **YIFY / YTS**, **EZTV**, **Comet**, and **100% Free Legal Platforms** into one fast, modern dashboard designed for **PC**, **Android Phones**, and **Smart TVs (Android TV / Google TV / Fire TV)**.

[![GitHub Pages Deployment](https://img.shields.io/badge/GitHub_Pages-Ready-brightgreen?style=for-the-badge&logo=github)](https://pages.github.com/)
[![PWA Ready](https://img.shields.io/badge/PWA-Installable-blue?style=for-the-badge&logo=pwa)](https://web.dev/progressive-web-apps/)
[![TV Navigation](https://img.shields.io/badge/TV_Mode-10--Foot_D--Pad-purple?style=for-the-badge&logo=androidauto)](./)
[![License](https://img.shields.io/badge/License-MIT-orange?style=for-the-badge)](./LICENSE)

---

## 🌟 Key Features

### ⚡ Torrent & Addon Scraper Integration
- **Torrentio Addon:** Real-time stream lookups with quality badges (4K UHD HDR/DV, 1080p, 720p), file sizes, and seeder metrics.
- **YIFY / YTS (Movies):** High-efficiency movie torrents in 720p, 1080p, and 2160p 4K with instant magnet generation.
- **EZTV (TV Series):** Daily TV episode updates, complete season packs, and direct episode magnet links.
- **Comet Addon:** Fast torrent/Debrid index for ultra-quick stream extraction.
- **Direct Magnet & Stream Launcher:** One-click playback in **In-App Web Player**, **Stremio App** (`stremio://`), **VLC Player**, or standard torrent clients (qBittorrent, LibreTorrent, Flud).
- **Real-Debrid & Addon Configuration:** Optional API key integration for fast cached streaming.

### 🌐 Free Legal Streaming Integration
- Direct links and search integrations for **Tubi TV**, **Pluto TV**, **Freevee**, **Kanopy**, **Plex Free**, and **Internet Archive**.
- Live global streaming availability lookups via **JustWatch**.

### 📺 10-Foot Smart TV & Remote Control Mode
- **Spatial D-Pad Navigation:** Built-in geometric navigation engine for remote controls (Arrow keys: Up/Down/Left/Right, OK/Enter, Back/Escape).
- **High-Contrast TV Focus:** Glowing luminous indicators and smooth auto-scrolling optimized for living room TV screens.
- **TV Hotkey:** Press `T` on any keyboard to toggle TV Mode instantly.

### 📱 Android Phone & Desktop PC Optimized
- **Responsive Layout:** Adaptive design from 320px mobile up to 4K desktop screens.
- **Progressive Web App (PWA):** Installable on Android, Windows, Mac, and ChromeOS with offline caching.
- **Mobile Bottom Navigation:** Ergonomic thumb-friendly navigation bar.

### 🛠️ Complete Suite of Tools
- **Universal Watchlist:** Track progress (To Watch, Watching, Watched), 1–5 star ratings, runtime tracking, and genre filtering.
- **Smart Recommendation Engine ("For You"):** Algorithm that tunes recommendations based on your highest-rated watched titles.
- **Smart Episode & Season Tracker:** Checklist for TV show episodes with percentage progress bars and direct EZTV episode search links.
- **Weekend Marathon Architect:** Binge-watching itinerary planner with auto-calculated breaks (snack & meal intervals) and printable schedule.
- **Release Alerts & Countdown:** Live countdown timers for anticipated movies and shows.
- **Customizable Themes:** Midnight Cinema, OLED Pure Black, Cyberpunk Neon, Emerald Matrix, Crimson Luxe.
- **Full Backup & Restore:** 1-click JSON export and import across all your devices.

---

## 🚀 How to Deploy to GitHub Pages (Static Hosting)

This project is 100% client-side (HTML5, CSS3, ES6+ JavaScript), requiring **zero build steps** and **no backend server**. It runs straight from GitHub Pages.

### Step 1: Push to GitHub

If you are initializing a new repository on your computer:
```bash
# Initialize git in the project root
git init
git add .
git commit -m "Initial commit of StreamHub Pro"

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
5. Wait 30–60 seconds. GitHub will provide your live URL:
   ```
   https://<your-username>.github.io/<your-repo-name>/
   ```

*(The included `.nojekyll` file ensures all static assets, manifests, and icons load without interference from Jekyll).*

---

## 📱 How to Use on Your Devices

### 🖥️ Desktop PC / Mac / Linux
- Open the live URL in Google Chrome, Microsoft Edge, Mozilla Firefox, or Safari.
- Click the install icon in the URL bar to install StreamHub as a standalone desktop app.
- **Keyboard Shortcuts:**
  - `T` — Toggle 10-Foot TV Mode
  - `/` — Focus global search bar
  - `Esc` / `Backspace` — Close modals or return to previous tab
  - `Space` — Play / Pause video

### 📱 Android Phone / Tablet
- Open the GitHub Pages link in **Chrome** or **Brave**.
- Tap the **⋮ (Menu)** icon in the top-right corner.
- Tap **"Add to Home screen"** or **"Install app"**.
- StreamHub will launch in fullscreen with native PWA speed and bottom tab navigation.

### 📺 Android TV / Google TV / Fire TV
- Open any TV browser on your Smart TV (e.g. **TV Bro**, **Amazon Silk**, **JioPages**, or **Puffin TV**).
- Navigate to your GitHub Pages URL.
- StreamHub will detect TV viewing distance or you can click **"Switch to TV Mode"** / press the TV Mode button.
- Use the **D-Pad arrows** on your TV remote to jump between movies, stream links, and tabs!

---

## 🔌 Stremio, VLC & Debrid Setup

### Stremio Deep Linking
- When you click **"🚀 Stremio"** on any stream result, StreamHub invokes `stremio:///detail/...` to open the movie or show directly inside your installed Stremio application.

### Debrid Providers (Optional)
- Head to **Settings ⚙️** → **Torrentio & Debrid Settings**.
- Choose your provider (**Real-Debrid**, **AllDebrid**, **Premiumize**, or **TorBox**) and paste your API key.
- Your key remains stored locally inside your browser's private storage (`localStorage`) and is never uploaded anywhere.

---

## 📁 Repository Structure

```
├── index.html              # Main responsive Single Page Application
├── style.css               # Complete stylesheet (Themes, TV Mode, Animations, Print)
├── app.js                  # Modular vanilla JS logic (Search, APIs, TV spatial nav, Player)
├── manifest.webmanifest    # PWA Web Application Manifest
├── sw.js                   # Progressive Web App Service Worker (offline cache)
├── .nojekyll               # Disables Jekyll processing on GitHub Pages
├── 404.html                # GitHub Pages redirect fallback
├── icons/
│   ├── icon-192.png        # 192x192 app icon
│   ├── icon-512.png        # 512x512 maskable app icon
│   ├── apple-touch-icon.png# iOS touch icon
│   ├── favicon.png         # 64x64 favicon
│   └── logo.svg            # Scalable vector logo
├── favicon.ico             # Root favicon
└── README.md               # Documentation & deployment guide
```

---

## ⚖️ Disclaimer & License

StreamHub Pro is a client-side media dashboard and metadata indexing interface. It does not host, upload, or store any media files or torrents on its servers. All streaming lookups rely on third-party public indexers or licensed free ad-supported platforms.

Released under the [MIT License](./LICENSE).
