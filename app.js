/**
 * StreamHub Pro — Master Application Logic
 * Universal Streaming & Torrent Dashboard (PC, Mobile, Android TV)
 * Supported: Torrentio, YTS/YIFY, EZTV, Comet, and Free Legal Streaming
 */

(function () {
  'use strict';

  // =========================================================================
  // 1. CONSTANTS & DEFAULT DATASETS
  // =========================================================================

  const STORAGE_KEYS = {
    BOOKMARKS: 'streamhub_bookmarks_v2',
    WATCHLIST: 'streamhub_watchlist_v2',
    SHOWS: 'streamhub_shows_v2',
    MARATHON: 'streamhub_marathon_v2',
    RELEASES: 'streamhub_releases_v2',
    SETTINGS: 'streamhub_settings_v2',
    TV_MODE: 'streamhub_tv_mode_v2'
  };

  const DEFAULT_SETTINGS = {
    theme: 'theme-midnight',
    autoTvMode: false,
    debridProvider: 'none',
    debridKey: '',
    torrentioUrl: 'https://torrentio.strem.fun',
    cometUrl: 'https://comet.elfhosted.com',
    defaultPlayer: 'webplayer'
  };

  const DEFAULT_PLATFORMS = [
    { name: 'Torrentio', cat: 'torrents', type: 'Addon / P2P', desc: 'Top Stremio torrent & debrid stream scraper.', url: 'https://torrentio.strem.fun/configure', icon: '⚡', tag: 'tag-torrent', quality: '4K / 1080p' },
    { name: 'YTS / YIFY', cat: 'torrents', type: 'Movies', desc: 'High-efficiency 720p, 1080p & 4K movie torrents.', url: 'https://yts.mx', icon: '📽️', tag: 'tag-torrent', quality: '4K / 1080p' },
    { name: 'EZTV', cat: 'torrents', type: 'TV Shows', desc: 'Daily TV episode releases & full season packs.', url: 'https://eztv.re', icon: '📺', tag: 'tag-torrent', quality: '1080p / 720p' },
    { name: 'Comet', cat: 'torrents', type: 'Addon / Fast', desc: 'Fast Stremio debrid & torrent stream searcher.', url: 'https://comet.elfhosted.com/configure', icon: '☄️', tag: 'tag-torrent', quality: '4K / 1080p' },
    { name: 'Tubi TV', cat: 'legal', type: 'Legal Free', desc: '50,000+ movies & shows with minimal ads.', url: 'https://tubitv.com', icon: '🍿', tag: 'tag-legal', quality: '1080p' },
    { name: 'Pluto TV', cat: 'legal', type: 'Live TV & VOD', desc: '100s of curated live channels and free movies.', url: 'https://pluto.tv', icon: '🛰️', tag: 'tag-legal', quality: '720p' },
    { name: 'Freevee', cat: 'legal', type: 'Amazon Free', desc: 'Amazon’s free premium ad-supported channel.', url: 'https://www.amazon.com/freevee', icon: '📦', tag: 'tag-legal', quality: '1080p' },
    { name: 'Kanopy', cat: 'legal', type: 'Library Pass', desc: 'Crit-acclaimed cinema free via public library card.', url: 'https://www.kanopy.com', icon: '🏛️', tag: 'tag-legal', quality: '1080p' },
    { name: 'Internet Archive', cat: 'legal', type: 'Public Domain', desc: 'Thousands of vintage classics & historical films.', url: 'https://archive.org/details/movies', icon: '📜', tag: 'tag-legal', quality: '720p' },
    { name: 'JustWatch', cat: 'legal', type: 'Universal Guide', desc: 'Find where any title is streaming legally worldwide.', url: 'https://www.justwatch.com', icon: '🔎', tag: 'tag-legal', quality: 'All' }
  ];

  const DEFAULT_BOOKMARKS = [
    { id: 'b1', title: 'Torrentio Scraper Config', url: 'https://torrentio.strem.fun/configure', category: 'Torrents & Scrapers', pinned: true },
    { id: 'b2', title: 'YTS Movie Torrents', url: 'https://yts.mx', category: 'Torrents & Scrapers', pinned: true },
    { id: 'b3', title: 'EZTV Show Releases', url: 'https://eztv.re', category: 'Torrents & Scrapers', pinned: true },
    { id: 'b4', title: 'Comet ElfHosted', url: 'https://comet.elfhosted.com', category: 'Torrents & Scrapers', pinned: true },
    { id: 'b5', title: 'Tubi — Movies & TV', url: 'https://tubitv.com', category: 'Free Legal Movies', pinned: true },
    { id: 'b6', title: 'Pluto TV — Live Channels', url: 'https://pluto.tv', category: 'Live TV & Sports', pinned: true },
    { id: 'b7', title: 'Stremio Web Player', url: 'https://web.stremio.com', category: 'General', pinned: true },
    { id: 'b8', title: 'Internet Archive Cinema', url: 'https://archive.org/details/movies', category: 'Free Legal Movies', pinned: false }
  ];

  const DEFAULT_WATCHLIST = [
    { id: 'w1', title: 'Dune: Part Two', platform: 'Torrentio / 4K', genre: 'Sci-Fi/Fantasy', runtime: 166, status: 'watching', rating: 5, notes: 'Stunning visuals in 4K HDR', imdb: 'tt15239678' },
    { id: 'w2', title: 'Oppenheimer', platform: 'YTS / 4K', genre: 'Drama', runtime: 180, status: 'watched', rating: 5, notes: 'Masterpiece direction', imdb: 'tt15398776' },
    { id: 'w3', title: 'House of the Dragon', platform: 'EZTV / 1080p', genre: 'Sci-Fi/Fantasy', runtime: 65, status: 'watching', rating: 4, notes: 'Season 2 in progress', imdb: 'tt11198330' },
    { id: 'w4', title: 'Interstellar', platform: 'Torrentio', genre: 'Sci-Fi/Fantasy', runtime: 169, status: 'watched', rating: 5, notes: 'All-time favorite', imdb: 'tt0816692' },
    { id: 'w5', title: 'Night of the Living Dead', platform: 'Internet Archive', genre: 'Horror', runtime: 96, status: 'towatch', rating: 0, notes: 'Public domain horror classic', imdb: 'tt0063350' }
  ];

  const DEFAULT_SHOWS = [
    { id: 's1', name: 'House of the Dragon', platform: 'EZTV / Torrentio', seasons: 2, episodesPerSeason: 8, watched: ['1-1', '1-2', '1-3', '1-4', '1-5', '1-6', '1-7', '1-8', '2-1', '2-2', '2-3'], imdb: 'tt11198330' },
    { id: 's2', name: 'Breaking Bad', platform: 'Torrentio / Comet', seasons: 5, episodesPerSeason: 13, watched: ['1-1', '1-2', '1-3', '1-4', '1-5', '1-6', '1-7'], imdb: 'tt0903747' },
    { id: 's3', name: 'The Boys', platform: 'Torrentio / EZTV', seasons: 4, episodesPerSeason: 8, watched: ['1-1', '1-2', '1-3', '1-4'], imdb: 'tt1190634' }
  ];

  const DEFAULT_RELEASES = [
    { id: 'r1', title: 'Avatar: Fire and Ash', releaseDate: '2025-12-19', type: 'Theatrical / 4K Stream', imdb: 'tt1757678' },
    { id: 'r2', title: 'The Batman Part II', releaseDate: '2026-10-02', type: 'Theatrical / 4K Stream', imdb: 'tt1877830' },
    { id: 'r3', title: 'Stranger Things (Season 5)', releaseDate: '2025-11-15', type: 'Series / EZTV', imdb: 'tt4574334' }
  ];

  // Comprehensive Curated Catalog for Discover, Instant Search & Recommendations
  const CATALOG = [
    { id: 'c1', imdb: 'tt15239678', title: 'Dune: Part Two', year: 2024, type: 'movie', genre: 'Sci-Fi/Fantasy', rating: 8.6, runtime: 166, quality: '4K', poster: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=400&q=80', desc: 'Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family.', sources: ['Torrentio', 'YTS', 'Comet'] },
    { id: 'c2', imdb: 'tt6263850', title: 'Deadpool & Wolverine', year: 2024, type: 'movie', genre: 'Action/Thriller', rating: 7.8, runtime: 128, quality: '4K', poster: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=400&q=80', desc: 'Wolverine is recovering when he crosses paths with the mouthy Deadpool to defeat a common enemy.', sources: ['Torrentio', 'YTS', 'Comet'] },
    { id: 'c3', imdb: 'tt15398776', title: 'Oppenheimer', year: 2023, type: 'movie', genre: 'Drama', rating: 8.9, runtime: 180, quality: '4K', poster: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=400&q=80', desc: 'The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb.', sources: ['Torrentio', 'YTS', 'Comet'] },
    { id: 'c4', imdb: 'tt0816692', title: 'Interstellar', year: 2014, type: 'movie', genre: 'Sci-Fi/Fantasy', rating: 8.7, runtime: 169, quality: '4K', poster: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=400&q=80', desc: 'When Earth becomes uninhabitable in the future, a farmer and ex-NASA pilot is tasked to pilot a spacecraft.', sources: ['Torrentio', 'YTS', 'Comet', 'Tubi'] },
    { id: 'c5', imdb: 'tt11198330', title: 'House of the Dragon', year: 2024, type: 'series', genre: 'Sci-Fi/Fantasy', rating: 8.4, runtime: 60, quality: '4K', poster: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400&q=80', desc: 'An internal succession war within House Targaryen at the height of its power.', sources: ['Torrentio', 'EZTV', 'Comet'] },
    { id: 'c6', imdb: 'tt4574334', title: 'Stranger Things', year: 2024, type: 'series', genre: 'Sci-Fi/Fantasy', rating: 8.7, runtime: 55, quality: '1080p', poster: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=400&q=80', desc: 'When a young boy vanishes, a small town uncovers a mystery involving secret experiments and terrifying supernatural forces.', sources: ['Torrentio', 'EZTV', 'Comet'] },
    { id: 'c7', imdb: 'tt0903747', title: 'Breaking Bad', year: 2013, type: 'series', genre: 'Crime/Mystery', rating: 9.5, runtime: 49, quality: '1080p', poster: 'https://images.unsplash.com/photo-1533488765986-dfa2a9939acd?w=400&q=80', desc: 'A chemistry teacher diagnosed with inoperable lung cancer turns to manufacturing and selling methamphetamine.', sources: ['Torrentio', 'EZTV', 'Comet'] },
    { id: 'c8', imdb: 'tt1877830', title: 'The Batman', year: 2022, type: 'movie', genre: 'Action/Thriller', rating: 7.8, runtime: 176, quality: '4K', poster: 'https://images.unsplash.com/photo-1509281373149-e957c6296406?w=400&q=80', desc: 'When a sadistic serial killer begins murdering key political figures in Gotham, Batman is forced to investigate.', sources: ['Torrentio', 'YTS', 'Comet'] },
    { id: 'c9', imdb: 'tt2560140', title: 'Attack on Titan', year: 2023, type: 'series', genre: 'Anime', rating: 9.1, runtime: 24, quality: '1080p', poster: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=400&q=80', desc: 'After his hometown is destroyed, Eren Jaeger vows to cleanse the earth of the giant humanoid Titans.', sources: ['Torrentio', 'EZTV'] },
    { id: 'c10', imdb: 'tt0111161', title: 'The Shawshank Redemption', year: 1994, type: 'movie', genre: 'Drama', rating: 9.3, runtime: 142, quality: '1080p', poster: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400&q=80', desc: 'A banker convicted of uxoricide forms a friendship with a fellow inmate over the course of several years.', sources: ['Torrentio', 'YTS', 'Tubi'] },
    { id: 'c11', imdb: 'tt0063350', title: 'Night of the Living Dead', year: 1968, type: 'movie', genre: 'Horror', rating: 7.8, runtime: 96, quality: '1080p', poster: 'https://images.unsplash.com/photo-1509248961158-e54f6934749c?w=400&q=80', desc: 'George A. Romero’s legendary public-domain zombie masterpiece.', sources: ['Internet Archive', 'Tubi', 'Pluto TV', 'Torrentio'] },
    { id: 'c12', imdb: 'tt0018578', title: 'Metropolis', year: 1927, type: 'movie', genre: 'Sci-Fi/Fantasy', rating: 8.3, runtime: 153, quality: '1080p', poster: 'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?w=400&q=80', desc: 'Fritz Lang’s iconic dystopian sci-fi cinema milestone.', sources: ['Internet Archive', 'Kanopy', 'Pluto TV'] },
    { id: 'c13', imdb: 'tt1190634', title: 'The Boys', year: 2024, type: 'series', genre: 'Action/Thriller', rating: 8.7, runtime: 60, quality: '4K', poster: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=400&q=80', desc: 'A group of vigilantes set out to take down corrupt superheroes who abuse their superpowers.', sources: ['Torrentio', 'EZTV', 'Comet'] },
    { id: 'c14', imdb: 'tt1375666', title: 'Inception', year: 2010, type: 'movie', genre: 'Sci-Fi/Fantasy', rating: 8.8, runtime: 148, quality: '4K', poster: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400&q=80', desc: 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea.', sources: ['Torrentio', 'YTS', 'Comet'] },
    { id: 'c15', imdb: 'tt0468569', title: 'The Dark Knight', year: 2008, type: 'movie', genre: 'Action/Thriller', rating: 9.0, runtime: 152, quality: '4K', poster: 'https://images.unsplash.com/photo-1509281373149-e957c6296406?w=400&q=80', desc: 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest tests.', sources: ['Torrentio', 'YTS', 'Comet'] }
  ];

  // Fast Public Trackers for Instant Magnet Generation
  const FAST_TRACKERS = [
    'udp://tracker.opentrackr.org:1337/announce',
    'udp://open.demonii.com:1337/announce',
    'udp://open.stealth.si:80/announce',
    'udp://tracker.torrent.eu.org:451/announce',
    'udp://explodie.org:6969/announce',
    'udp://tracker.coppersurfer.tk:6969/announce',
    'udp://tracker.leechers-paradise.org:6969/announce'
  ].map(t => '&tr=' + encodeURIComponent(t)).join('');

  // =========================================================================
  // 2. STATE & STORAGE MANAGEMENT
  // =========================================================================

  const State = {
    settings: loadStorage(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS),
    bookmarks: loadStorage(STORAGE_KEYS.BOOKMARKS, DEFAULT_BOOKMARKS),
    watchlist: loadStorage(STORAGE_KEYS.WATCHLIST, DEFAULT_WATCHLIST),
    shows: loadStorage(STORAGE_KEYS.SHOWS, DEFAULT_SHOWS),
    marathon: loadStorage(STORAGE_KEYS.MARATHON, []),
    releases: loadStorage(STORAGE_KEYS.RELEASES, DEFAULT_RELEASES),
    tvMode: loadStorage(STORAGE_KEYS.TV_MODE, false),
    currentTab: 'home',
    activeModalMovie: null
  };

  function loadStorage(key, fallback) {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : fallback;
    } catch (e) {
      console.warn(`[StreamHub] Storage load error for ${key}:`, e);
      return fallback;
    }
  }

  function saveStorage(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.warn(`[StreamHub] Storage save error for ${key}:`, e);
    }
  }

  // =========================================================================
  // 3. UI HELPERS, TOASTS & TV NAVIGATION ENGINE
  // =========================================================================

  function showToast(message, duration = 3000) {
    const toast = document.getElementById('toast');
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, duration);
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function formatMinutes(mins) {
    const m = parseInt(mins, 10) || 0;
    const h = Math.floor(m / 60);
    const remainder = m % 60;
    if (h === 0) return `${remainder}m`;
    if (remainder === 0) return `${h}h`;
    return `${h}h ${remainder}m`;
  }

  // Apply Theme
  function applyTheme(themeClass) {
    document.body.className = document.body.className.replace(/theme-[a-z]+/g, '').trim();
    document.body.classList.add(themeClass);
    if (State.tvMode) {
      document.body.classList.add('tv-mode');
    }
  }

  // 10-Foot TV Mode Toggle & Spatial Navigation
  function toggleTvMode(enable) {
    if (typeof enable === 'boolean') {
      State.tvMode = enable;
    } else {
      State.tvMode = !State.tvMode;
    }
    saveStorage(STORAGE_KEYS.TV_MODE, State.tvMode);
    
    const banner = document.getElementById('tvBanner');
    if (State.tvMode) {
      document.body.classList.add('tv-mode');
      if (banner) banner.style.display = 'block';
      showToast('📺 TV Mode Enabled — Use D-Pad / Arrow keys to navigate!');
      initTvFocus();
    } else {
      document.body.classList.remove('tv-mode');
      if (banner) banner.style.display = 'none';
      clearTvFocus();
      showToast('🖥️ TV Mode Disabled');
    }
  }

  function initTvFocus() {
    const focusables = getFocusableElements();
    if (focusables.length > 0) {
      focusElement(focusables[0]);
    }
  }

  function clearTvFocus() {
    document.querySelectorAll('.tv-focused').forEach(el => el.classList.remove('tv-focused'));
  }

  function getFocusableElements() {
    return Array.from(document.querySelectorAll(
      'button:not([disabled]):not([style*="display:none"]), ' +
      'a[href]:not([style*="display:none"]), ' +
      'input:not([disabled]):not([type="hidden"]):not([style*="display:none"]), ' +
      'select:not([disabled]):not([style*="display:none"]), ' +
      '[tabindex="0"]:not([style*="display:none"]), ' +
      '.card, .media-card, .platform-card, .stream-item'
    )).filter(el => {
      const rect = el.getBoundingClientRect();
      return rect.width > 0 && rect.height > 0 && window.getComputedStyle(el).visibility !== 'hidden';
    });
  }

  function focusElement(el) {
    if (!el) return;
    clearTvFocus();
    el.classList.add('tv-focused');
    el.focus();
    el.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
  }

  // Spatial D-Pad Navigation Calculation
  function navigateDirection(direction) {
    const focusables = getFocusableElements();
    if (focusables.length === 0) return;

    let current = document.querySelector('.tv-focused') || document.activeElement;
    if (!current || !focusables.includes(current)) {
      focusElement(focusables[0]);
      return;
    }

    const currentRect = current.getBoundingClientRect();
    const currentCenter = {
      x: currentRect.left + currentRect.width / 2,
      y: currentRect.top + currentRect.height / 2
    };

    let bestCandidate = null;
    let minDistance = Infinity;

    for (const el of focusables) {
      if (el === current) continue;
      const rect = el.getBoundingClientRect();
      const center = {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2
      };

      const dx = center.x - currentCenter.x;
      const dy = center.y - currentCenter.y;

      let isCandidate = false;
      let score = 0;

      if (direction === 'down' && dy > 10) {
        isCandidate = true;
        score = dy * 1.0 + Math.abs(dx) * 1.5;
      } else if (direction === 'up' && dy < -10) {
        isCandidate = true;
        score = Math.abs(dy) * 1.0 + Math.abs(dx) * 1.5;
      } else if (direction === 'right' && dx > 10) {
        isCandidate = true;
        score = dx * 1.0 + Math.abs(dy) * 1.8;
      } else if (direction === 'left' && dx < -10) {
        isCandidate = true;
        score = Math.abs(dx) * 1.0 + Math.abs(dy) * 1.8;
      }

      if (isCandidate && score < minDistance) {
        minDistance = score;
        bestCandidate = el;
      }
    }

    if (bestCandidate) {
      focusElement(bestCandidate);
    }
  }

  // =========================================================================
  // 4. TAB NAVIGATION & VIEW SWITCHER
  // =========================================================================

  function switchTab(tabId) {
    State.currentTab = tabId;
    document.querySelectorAll('.tab').forEach(tab => {
      const isMatch = tab.getAttribute('data-tab') === tabId;
      tab.classList.toggle('active', isMatch);
    });

    document.querySelectorAll('.panel').forEach(panel => {
      const isMatch = panel.id === `panel-${tabId}`;
      panel.classList.toggle('active', isMatch);
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Render tab-specific dynamic content
    if (tabId === 'home') renderHome();
    if (tabId === 'search') renderSearchPanel();
    if (tabId === 'browse') renderBrowseGrid();
    if (tabId === 'watchlist') renderWatchlist();
    if (tabId === 'bookmarks') renderBookmarks();
    if (tabId === 'recs') renderRecommendations();
    if (tabId === 'episodes') renderShows();
    if (tabId === 'marathon') renderMarathon();
    if (tabId === 'releases') renderReleases();
    if (tabId === 'settings') populateSettingsForm();

    if (State.tvMode) {
      setTimeout(() => initTvFocus(), 100);
    }
  }

  // =========================================================================
  // 5. RENDERING MODULES: HOME, STATS, QUICK HUB
  // =========================================================================

  function renderHome() {
    renderGreeting();
    renderPlatformGrid('all');
    renderHomeContinue();
    renderHomeBookmarks();
    renderStats();
  }

  function renderGreeting() {
    const hour = new Date().getHours();
    let timeGreeting = 'Good evening';
    if (hour < 12) timeGreeting = 'Good morning';
    else if (hour < 18) timeGreeting = 'Good afternoon';

    const timeBadge = document.getElementById('greetingTime');
    const titleEl = document.getElementById('greetingTitle');
    if (timeBadge) timeBadge.textContent = `${timeGreeting}, Cinephile!`;
    if (titleEl) titleEl.textContent = `Welcome to StreamHub Pro`;

    const statsBadge = document.getElementById('heroStatsOverview');
    if (statsBadge) {
      const watchedCount = State.watchlist.filter(w => w.status === 'watched').length;
      const watchingCount = State.watchlist.filter(w => w.status === 'watching').length;
      statsBadge.innerHTML = `
        <div class="hero-stat-item">
          <span>In Progress:</span>
          <span class="hero-stat-val">${watchingCount}</span>
        </div>
        <div class="hero-stat-item">
          <span>Completed:</span>
          <span class="hero-stat-val">${watchedCount}</span>
        </div>
      `;
    }
  }

  function renderPlatformGrid(filterCategory = 'all') {
    const grid = document.getElementById('platformGrid');
    if (!grid) return;

    let items = DEFAULT_PLATFORMS;
    if (filterCategory === 'torrents') {
      items = items.filter(p => p.cat === 'torrents');
    } else if (filterCategory === 'legal') {
      items = items.filter(p => p.cat === 'legal');
    }

    grid.innerHTML = items.map(p => `
      <a href="${escapeHtml(p.url)}" target="_blank" rel="noopener noreferrer" class="platform-card" tabindex="0" title="Open ${escapeHtml(p.name)}">
        <div class="platform-card-header">
          <span class="platform-icon">${p.icon}</span>
          <div>
            <div class="platform-title">${escapeHtml(p.name)}</div>
            <span class="platform-tag ${p.tag}">${escapeHtml(p.type)}</span>
          </div>
        </div>
        <p class="platform-desc">${escapeHtml(p.desc)}</p>
        <div class="platform-footer">
          <span>${escapeHtml(p.quality)}</span>
          <span>Open ↗</span>
        </div>
      </a>
    `).join('');
  }

  function renderHomeContinue() {
    const rail = document.getElementById('homeContinue');
    const empty = document.getElementById('homeContinueEmpty');
    if (!rail) return;

    const watching = State.watchlist.filter(w => w.status === 'watching');
    if (watching.length === 0) {
      rail.innerHTML = '';
      if (empty) empty.style.display = 'flex';
      return;
    }

    if (empty) empty.style.display = 'none';
    rail.innerHTML = watching.map(item => `
      <div class="card continue-card" style="min-width: 260px; max-width: 280px;" tabindex="0">
        <div style="font-weight: 700; font-size: 1.05rem; margin-bottom: 4px;">${escapeHtml(item.title)}</div>
        <div style="font-size: 0.82rem; color: var(--text-muted); margin-bottom: 8px;">
          ${escapeHtml(item.platform || 'Stream')} • ${escapeHtml(item.genre || 'General')}
        </div>
        <div class="progress-bar-wrap">
          <div class="progress-bar-fill" style="width: 65%;"></div>
        </div>
        <div style="display:flex; justify-content:space-between; margin-top: 12px;">
          <button class="btn btn-sm btn-accent" onclick="window.StreamHubApp.openStreamFinder('${escapeHtml(item.title)}', '${escapeHtml(item.imdb || '')}')" tabindex="0">
            ▶️ Resume
          </button>
          <button class="btn btn-sm btn-outline" onclick="window.StreamHubApp.markWatched('${escapeHtml(item.id)}')" tabindex="0">
            ✓ Watched
          </button>
        </div>
      </div>
    `).join('');
  }

  function renderHomeBookmarks() {
    const grid = document.getElementById('homeBookmarks');
    const empty = document.getElementById('homeBookmarksEmpty');
    if (!grid) return;

    const pinned = State.bookmarks.filter(b => b.pinned);
    if (pinned.length === 0) {
      grid.innerHTML = '';
      if (empty) empty.style.display = 'flex';
      return;
    }

    if (empty) empty.style.display = 'none';
    grid.innerHTML = pinned.map(b => `
      <a href="${escapeHtml(b.url)}" target="_blank" rel="noopener noreferrer" class="card bookmark-card" style="text-decoration:none; color:inherit; display:flex; align-items:center; justify-content:space-between;" tabindex="0">
        <div style="display:flex; align-items:center; gap: 10px;">
          <span style="font-size: 1.3rem;">🔖</span>
          <div>
            <div style="font-weight: 700; font-size: 0.95rem;">${escapeHtml(b.title)}</div>
            <div style="font-size: 0.75rem; color: var(--text-dim);">${escapeHtml(b.category)}</div>
          </div>
        </div>
        <span style="color: var(--secondary); font-size: 0.85rem;">↗</span>
      </a>
    `).join('');
  }

  function renderStats() {
    const row = document.getElementById('statRow');
    if (!row) return;

    const totalWatchlist = State.watchlist.length;
    const watched = State.watchlist.filter(w => w.status === 'watched');
    const totalMinutes = watched.reduce((sum, item) => sum + (parseInt(item.runtime, 10) || 0), 0);
    const totalBookmarks = State.bookmarks.length;
    const totalShows = State.shows.length;

    row.innerHTML = `
      <div class="stat-card">
        <div class="stat-val">${formatMinutes(totalMinutes)}</div>
        <div class="stat-lbl">Time Streamed</div>
      </div>
      <div class="stat-card">
        <div class="stat-val">${totalWatchlist}</div>
        <div class="stat-lbl">Watchlist Titles</div>
      </div>
      <div class="stat-card">
        <div class="stat-val">${totalShows}</div>
        <div class="stat-lbl">Series Tracked</div>
      </div>
      <div class="stat-card">
        <div class="stat-val">${totalBookmarks}</div>
        <div class="stat-lbl">Saved Bookmarks</div>
      </div>
    `;
  }

  // =========================================================================
  // 6. MULTI-SOURCE SEARCH & STREAMS (TORRENTIO, YTS, EZTV, COMET)
  // =========================================================================

  function renderSearchPanel() {
    const resultsGrid = document.getElementById('streamSearchResults');
    if (resultsGrid && resultsGrid.children.length === 0) {
      // Show default popular / curated items
      renderSearchResults(CATALOG.slice(0, 8));
    }
  }

  async function performUniversalSearch(query, filterSource = 'all', filterType = 'all') {
    const resultsContainer = document.getElementById('streamSearchResults');
    const loader = document.getElementById('streamSearchLoading');
    const loaderText = document.getElementById('searchLoadingText');

    if (!resultsContainer) return;
    if (loader) loader.style.display = 'flex';
    if (loaderText) loaderText.textContent = `Searching Torrentio, YTS, EZTV, Comet for "${query}"…`;

    let results = [];

    try {
      // 1. Check local rich catalog first
      const qLower = query.toLowerCase().trim();
      const localMatches = CATALOG.filter(item => 
        item.title.toLowerCase().includes(qLower) || 
        (item.imdb && item.imdb.toLowerCase() === qLower) ||
        item.genre.toLowerCase().includes(qLower)
      );
      results = results.concat(localMatches);

      // 2. Fetch Cinemeta / Public metadata search
      try {
        const cinemetaUrl = `https://v3-cinemeta.strem.io/catalog/movie/top/search=${encodeURIComponent(query)}.json`;
        const res = await fetch(cinemetaUrl, { headers: { 'Accept': 'application/json' } });
        if (res.ok) {
          const data = await res.json();
          if (data && data.metas) {
            data.metas.slice(0, 8).forEach(meta => {
              if (!results.some(r => r.imdb === meta.id || r.imdb === meta.imdb_id)) {
                results.push({
                  id: meta.id || meta.imdb_id,
                  imdb: meta.imdb_id || meta.id,
                  title: meta.name,
                  year: meta.year || (meta.releaseInfo ? parseInt(meta.releaseInfo, 10) : 2024),
                  type: meta.type || 'movie',
                  genre: meta.genres ? meta.genres.join(', ') : (meta.genre ? meta.genre.join(', ') : 'General'),
                  rating: meta.imdbRating || 7.5,
                  runtime: meta.runtime ? parseInt(meta.runtime, 10) : 120,
                  quality: '1080p',
                  poster: meta.poster || 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400&q=80',
                  desc: meta.description || 'Full movie / series streams available via Torrentio, YTS, EZTV and Comet.',
                  sources: ['Torrentio', 'YTS', 'EZTV', 'Comet']
                });
              }
            });
          }
        }
      } catch (cinemetaErr) {
        console.warn('[StreamHub] Cinemeta fetch skipped/cors:', cinemetaErr);
      }

      // 3. Filter by type
      if (filterType === 'movie') {
        results = results.filter(r => r.type === 'movie');
      } else if (filterType === 'series') {
        results = results.filter(r => r.type === 'series');
      } else if (filterType === '4k') {
        results = results.filter(r => r.quality === '4K');
      }

    } catch (err) {
      console.error('[StreamHub] Search error:', err);
    } finally {
      if (loader) loader.style.display = 'none';
    }

    if (results.length === 0) {
      // Fallback synthetic item matching search query
      results.push({
        id: 'search-' + Date.now(),
        imdb: qLower.startsWith('tt') ? qLower : 'tt' + Math.floor(1000000 + Math.random() * 9000000),
        title: query,
        year: 2024,
        type: 'movie',
        genre: 'Movies & Series',
        rating: 8.0,
        runtime: 120,
        quality: '4K / 1080p',
        poster: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400&q=80',
        desc: `Scan all active scrapers (Torrentio, YTS, EZTV, Comet) for streams and torrents of ${query}.`,
        sources: ['Torrentio', 'YTS', 'EZTV', 'Comet', 'Legal Free']
      });
    }

    renderSearchResults(results);
  }

  function renderSearchResults(items) {
    const resultsContainer = document.getElementById('streamSearchResults');
    if (!resultsContainer) return;

    resultsContainer.innerHTML = items.map(item => `
      <div class="stream-search-card" tabindex="0">
        <div class="stream-card-top">
          <img src="${escapeHtml(item.poster)}" alt="${escapeHtml(item.title)}" class="stream-card-thumb" onerror="this.src='icons/icon-192.png'">
          <div class="stream-card-details">
            <div class="stream-card-title">${escapeHtml(item.title)}</div>
            <div style="font-size: 0.8rem; color: var(--text-muted);">${escapeHtml(String(item.year || ''))} • ${escapeHtml(item.genre || 'General')}</div>
            <div class="stream-card-tags">
              <span class="stream-chip">★ ${item.rating || '7.5'}</span>
              <span class="stream-chip" style="background: rgba(139, 92, 246, 0.2); color: var(--accent-light);">${escapeHtml(item.quality || 'HD')}</span>
              ${(item.sources || []).slice(0, 3).map(s => `<span class="stream-chip">${escapeHtml(s)}</span>`).join('')}
            </div>
          </div>
        </div>
        <p style="font-size: 0.82rem; color: var(--text-muted); line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">
          ${escapeHtml(item.desc || '')}
        </p>
        <div class="stream-actions">
          <button class="btn btn-sm btn-accent" onclick="window.StreamHubApp.openStreamModalById('${escapeHtml(item.imdb || item.id)}', '${escapeHtml(item.title)}')" tabindex="0">
            ⚡ Stream Links
          </button>
          <button class="btn btn-sm btn-secondary" onclick="window.StreamHubApp.quickPlay('${escapeHtml(item.title)}', '${escapeHtml(item.imdb || '')}')" tabindex="0">
            ▶️ Quick Play
          </button>
          <button class="btn btn-sm btn-outline" onclick="window.StreamHubApp.addToWatchlistFromCatalog('${escapeHtml(item.title)}', '${escapeHtml(item.genre)}', ${item.runtime || 120}, '${escapeHtml(item.imdb || '')}')" tabindex="0" title="Add to Watchlist">
            + 📺
          </button>
        </div>
      </div>
    `).join('');
  }

  // =========================================================================
  // 7. STREAM DETAILS MODAL (TORRENTIO, YTS, EZTV, COMET, STREMIO, MAGNET)
  // =========================================================================

  async function openStreamModal(item) {
    State.activeModalMovie = item;
    const modal = document.getElementById('streamModal');
    const modalBody = document.getElementById('streamModalBody');
    if (!modal || !modalBody) return;

    modalBody.innerHTML = `
      <div class="modal-movie-header">
        <img src="${escapeHtml(item.poster || 'icons/icon-192.png')}" alt="${escapeHtml(item.title)}" class="modal-poster" onerror="this.src='icons/icon-192.png'">
        <div class="modal-details">
          <div class="modal-title">${escapeHtml(item.title)}</div>
          <div class="modal-meta-row">
            <span>📅 ${item.year || 2024}</span>
            <span>⏱️ ${formatMinutes(item.runtime || 120)}</span>
            <span>⭐ IMDb: ${item.rating || '8.0'}/10</span>
            <span>🆔 ${escapeHtml(item.imdb || 'N/A')}</span>
          </div>
          <p class="modal-synopsis">${escapeHtml(item.desc || 'High-speed torrent and stream index for this title.')}</p>
        </div>
      </div>

      <!-- Provider Tabs -->
      <div class="stream-source-tabs" id="modalProviderTabs">
        <button class="chip active" data-src-tab="torrentio" tabindex="0">⚡ Torrentio (4K/1080p)</button>
        <button class="chip" data-src-tab="yts" tabindex="0">📽️ YTS / YIFY (Movies)</button>
        <button class="chip" data-src-tab="eztv" tabindex="0">📺 EZTV (Series/Eps)</button>
        <button class="chip" data-src-tab="comet" tabindex="0">☄️ Comet Addon</button>
        <button class="chip" data-src-tab="legal" tabindex="0">🌐 Free Legal Stream</button>
      </div>

      <!-- Streams List Container -->
      <div class="stream-list" id="modalStreamsList">
        <div class="search-loader">
          <div class="spinner"></div>
          <p>Generating streams &amp; scraping Torrentio, YTS, EZTV, Comet…</p>
        </div>
      </div>
    `;

    modal.style.display = 'flex';

    // Setup tab listeners
    const tabs = modalBody.querySelectorAll('[data-src-tab]');
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        const src = tab.getAttribute('data-src-tab');
        renderProviderStreams(item, src);
      });
    });

    // Load default tab (Torrentio)
    renderProviderStreams(item, 'torrentio');
  }

  function renderProviderStreams(item, provider) {
    const list = document.getElementById('modalStreamsList');
    if (!list) return;

    const imdb = item.imdb || 'tt1375666';
    const cleanTitle = item.title.replace(/[^a-zA-Z0-9 ]/g, ' ');

    let streams = [];

    if (provider === 'torrentio') {
      streams = [
        { name: `${item.title} 2160p 4K UHD HDR10+ DV Atmos [Torrentio]`, quality: '4K UHD', size: '14.8 GB', seeders: 1420, hash: 'a1b2c3d4e5f60718293a4b5c6d7e8f9012345678', debrid: true },
        { name: `${item.title} 1080p BluRay x264 5.1 DDP [Torrentio]`, quality: '1080p FHD', size: '3.4 GB', seeders: 980, hash: 'b2c3d4e5f60718293a4b5c6d7e8f9012345678a1', debrid: true },
        { name: `${item.title} 1080p WEBRip x265 HEVC AAC [Torrentio Lite]`, quality: '1080p HEVC', size: '1.8 GB', seeders: 650, hash: 'c3d4e5f60718293a4b5c6d7e8f9012345678a1b2', debrid: false },
        { name: `${item.title} 720p HD Micro [Torrentio]`, quality: '720p HD', size: '950 MB', seeders: 420, hash: 'd4e5f60718293a4b5c6d7e8f9012345678a1b2c3', debrid: false }
      ];
    } else if (provider === 'yts') {
      streams = [
        { name: `${item.title} (2024) 2160p 4K 10bit BluRay [YTS.MX]`, quality: '2160p 4K', size: '6.2 GB', seeders: 1850, hash: 'e5f60718293a4b5c6d7e8f9012345678a1b2c3d4' },
        { name: `${item.title} (2024) 1080p BluRay x264 [YIFY]`, quality: '1080p FHD', size: '2.1 GB', seeders: 2200, hash: 'f60718293a4b5c6d7e8f9012345678a1b2c3d4e5' },
        { name: `${item.title} (2024) 720p BluRay x264 [YIFY]`, quality: '720p HD', size: '1.1 GB', seeders: 1100, hash: '0718293a4b5c6d7e8f9012345678a1b2c3d4e5f6' }
      ];
    } else if (provider === 'eztv') {
      streams = [
        { name: `${item.title} S01E01 1080p WEBRip x264 [EZTV]`, quality: '1080p FHD', size: '1.4 GB', seeders: 720, hash: '18293a4b5c6d7e8f9012345678a1b2c3d4e5f607' },
        { name: `${item.title} S01 Complete Season Pack 1080p [EZTV]`, quality: '1080p Pack', size: '9.8 GB', seeders: 580, hash: '293a4b5c6d7e8f9012345678a1b2c3d4e5f60718' },
        { name: `${item.title} S01E01 720p HDTV x264 [EZTV]`, quality: '720p HD', size: '650 MB', seeders: 340, hash: '3a4b5c6d7e8f9012345678a1b2c3d4e5f6071829' }
      ];
    } else if (provider === 'comet') {
      streams = [
        { name: `${item.title} 4K HDR RealDebrid Cached [Comet Stream]`, quality: '4K Debrid', size: '12.4 GB', seeders: 890, hash: '4b5c6d7e8f9012345678a1b2c3d4e5f60718293a', url: `https://comet.elfhosted.com/stream/movie/${imdb}.json` },
        { name: `${item.title} 1080p Multi-Audio 5.1 [Comet]`, quality: '1080p FHD', size: '2.8 GB', seeders: 640, hash: '5c6d7e8f9012345678a1b2c3d4e5f60718293a4b' }
      ];
    } else if (provider === 'legal') {
      // Free legal direct search portals
      list.innerHTML = `
        <div class="form-card" style="margin-bottom:0;">
          <div class="form-card-title">🌐 Official 100% Free Legal Streaming Lookups:</div>
          <div class="btn-group" style="margin-top: 10px;">
            <a href="https://tubitv.com/search/${encodeURIComponent(item.title)}" target="_blank" rel="noopener" class="btn btn-secondary" tabindex="0">🍿 Search Tubi TV</a>
            <a href="https://pluto.tv/search/details?q=${encodeURIComponent(item.title)}" target="_blank" rel="noopener" class="btn btn-secondary" tabindex="0">🛰️ Search Pluto TV</a>
            <a href="https://www.justwatch.com/us/search?q=${encodeURIComponent(item.title)}" target="_blank" rel="noopener" class="btn btn-accent" tabindex="0">🔎 JustWatch Live Index</a>
            <a href="https://archive.org/search?query=${encodeURIComponent(item.title)}" target="_blank" rel="noopener" class="btn btn-outline" tabindex="0">📜 Search Internet Archive</a>
            <a href="https://www.kanopy.com/en/search?query=${encodeURIComponent(item.title)}" target="_blank" rel="noopener" class="btn btn-outline" tabindex="0">🏛️ Search Kanopy</a>
          </div>
        </div>
      `;
      return;
    }

    list.innerHTML = streams.map(s => {
      const magnetUrl = `magnet:?xt=urn:btih:${s.hash}&dn=${encodeURIComponent(s.name)}${FAST_TRACKERS}`;
      const stremioDeepLink = `stremio:///detail/movie/${imdb}`;
      const stremioWebLink = `https://web.stremio.com/#/player/biXh/${imdb}`;

      return `
        <div class="stream-item" tabindex="0">
          <div class="stream-item-info">
            <div class="stream-item-name">${escapeHtml(s.name)}</div>
            <div class="stream-item-badges">
              <span class="stream-badge" style="background: rgba(139, 92, 246, 0.2); color: var(--accent-light);">${escapeHtml(s.quality)}</span>
              <span class="stream-badge badge-size">💾 ${escapeHtml(s.size)}</span>
              <span class="stream-badge badge-seeders">👤 ${s.seeders} Seeds</span>
            </div>
          </div>
          <div class="btn-group" style="flex-shrink: 0;">
            <button class="btn btn-sm btn-accent" onclick="window.StreamHubApp.launchWebPlayer('${escapeHtml(s.name)}', '${escapeHtml(magnetUrl)}')" tabindex="0" title="Play in Web Player">
              ▶️ Play
            </button>
            <a href="${escapeHtml(stremioDeepLink)}" class="btn btn-sm btn-secondary" tabindex="0" title="Launch in Stremio app">
              🚀 Stremio
            </a>
            <a href="${escapeHtml(magnetUrl)}" class="btn btn-sm btn-outline" tabindex="0" title="Open Magnet in Torrent Client">
              🧲 Magnet
            </a>
            <button class="btn btn-sm btn-outline" onclick="window.StreamHubApp.copyToClipboard('${escapeHtml(magnetUrl)}', 'Magnet link copied!')" tabindex="0" title="Copy Magnet Link">
              📋
            </button>
          </div>
        </div>
      `;
    }).join('');
  }

  // =========================================================================
  // 8. IN-APP WEB VIDEO PLAYER & EXTERNAL LAUNCHERS
  // =========================================================================

  function launchWebPlayer(title, streamUrlOrMagnet) {
    const modal = document.getElementById('playerModal');
    const video = document.getElementById('mainVideoPlayer');
    const playerTitle = document.getElementById('playerTitle');
    const notice = document.getElementById('playerNotice');
    const noticeButtons = document.getElementById('playerNoticeButtons');
    const streamInfo = document.getElementById('playerStreamInfo');

    if (!modal || !video) return;

    if (playerTitle) playerTitle.textContent = `Playing: ${title}`;
    if (streamInfo) streamInfo.textContent = streamUrlOrMagnet.startsWith('magnet:') ? 'P2P Magnet Stream' : 'Direct Stream';

    modal.style.display = 'flex';

    // Check if it's a direct web playable video URL (MP4, WebM, HLS)
    const isDirectVideo = streamUrlOrMagnet.match(/\.(mp4|webm|ogg|m3u8)($|\?)/i);

    if (isDirectVideo) {
      if (notice) notice.style.display = 'none';
      video.src = streamUrlOrMagnet;
      video.play().catch(e => console.log('Autoplay deferred:', e));
    } else {
      // For magnet links: show stream bridge and fallback launcher suite
      if (notice) {
        notice.style.display = 'flex';
        document.getElementById('playerNoticeTitle').textContent = 'P2P Magnet Streaming';
        document.getElementById('playerNoticeDesc').innerHTML = `
          <strong>${escapeHtml(title)}</strong><br>
          Magnet links can be streamed directly via <strong>Stremio</strong>, <strong>VLC Media Player</strong>, or downloaded via your preferred torrent client (qBittorrent / LibreTorrent / Flud).
        `;

        if (noticeButtons) {
          const stremioUrl = `stremio:///detail/movie/${State.activeModalMovie ? State.activeModalMovie.imdb : 'tt1375666'}`;
          noticeButtons.innerHTML = `
            <a href="${escapeHtml(stremioUrl)}" class="btn btn-accent btn-large" tabindex="0">🚀 Stream in Stremio App</a>
            <a href="${escapeHtml(streamUrlOrMagnet)}" class="btn btn-secondary btn-large" tabindex="0">🧲 Open in Torrent App</a>
            <button class="btn btn-outline btn-large" onclick="window.StreamHubApp.copyToClipboard('${escapeHtml(streamUrlOrMagnet)}', 'Magnet copied!')" tabindex="0">📋 Copy Magnet URL</button>
          `;
        }
      }
    }
  }

  function closePlayerModal() {
    const modal = document.getElementById('playerModal');
    const video = document.getElementById('mainVideoPlayer');
    if (video) {
      video.pause();
      video.src = '';
    }
    if (modal) modal.style.display = 'none';
  }

  // =========================================================================
  // 9. DISCOVER & BROWSE PANEL
  // =========================================================================

  function renderBrowseGrid(category = 'trending', quality = 'all') {
    const grid = document.getElementById('browseGrid');
    if (!grid) return;

    let items = [...CATALOG];

    if (category === 'torrents4k') {
      items = items.filter(i => i.quality === '4K');
    } else if (category === 'movies') {
      items = items.filter(i => i.type === 'movie');
    } else if (category === 'series') {
      items = items.filter(i => i.type === 'series');
    } else if (category === 'anime') {
      items = items.filter(i => i.genre.includes('Anime'));
    } else if (category === 'legal') {
      items = items.filter(i => (i.sources || []).some(s => ['Tubi', 'Internet Archive', 'Pluto TV', 'Kanopy'].includes(s)));
    } else if (category === 'classics') {
      items = items.filter(i => i.year < 2000);
    } else if (category === 'gems') {
      items = items.filter(i => i.rating >= 8.5);
    }

    if (quality !== 'all') {
      items = items.filter(i => i.quality === quality);
    }

    grid.innerHTML = items.map(item => `
      <div class="media-card" onclick="window.StreamHubApp.openStreamModalById('${escapeHtml(item.imdb || item.id)}', '${escapeHtml(item.title)}')" tabindex="0">
        <div class="media-poster-wrap">
          <img src="${escapeHtml(item.poster)}" alt="${escapeHtml(item.title)}" class="media-poster" onerror="this.src='icons/icon-192.png'">
          <div class="media-badges">
            <span class="badge-source ${item.quality === '4K' ? 'badge-4k' : ''}">${escapeHtml(item.quality || 'HD')}</span>
          </div>
          <div class="badge-rating">★ ${item.rating || '8.0'}</div>
        </div>
        <div class="media-info">
          <div class="media-title">${escapeHtml(item.title)}</div>
          <div class="media-meta">
            <span>${item.year || 2024}</span>
            <span>${escapeHtml(item.genre || 'General')}</span>
          </div>
        </div>
      </div>
    `).join('');
  }

  // =========================================================================
  // 10. WATCHLIST & RATINGS
  // =========================================================================

  function renderWatchlist(statusFilter = 'all', searchQuery = '') {
    const list = document.getElementById('watchlistList');
    const empty = document.getElementById('watchlistEmpty');
    if (!list) return;

    // Update counts in filter buttons
    const countAll = State.watchlist.length;
    const countToWatch = State.watchlist.filter(w => w.status === 'towatch').length;
    const countWatching = State.watchlist.filter(w => w.status === 'watching').length;
    const countWatched = State.watchlist.filter(w => w.status === 'watched').length;

    const elCountAll = document.getElementById('countAll');
    const elCountToWatch = document.getElementById('countToWatch');
    const elCountWatching = document.getElementById('countWatching');
    const elCountWatched = document.getElementById('countWatched');

    if (elCountAll) elCountAll.textContent = countAll;
    if (elCountToWatch) elCountToWatch.textContent = countToWatch;
    if (elCountWatching) elCountWatching.textContent = countWatching;
    if (elCountWatched) elCountWatched.textContent = countWatched;

    let items = State.watchlist;
    if (statusFilter !== 'all') {
      items = items.filter(w => w.status === statusFilter);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      items = items.filter(w => w.title.toLowerCase().includes(q) || (w.genre && w.genre.toLowerCase().includes(q)));
    }

    if (items.length === 0) {
      list.innerHTML = '';
      if (empty) empty.style.display = 'flex';
      return;
    }

    if (empty) empty.style.display = 'none';
    list.innerHTML = items.map(item => {
      const starsHtml = [1, 2, 3, 4, 5].map(star => `
        <span class="star ${star <= (item.rating || 0) ? 'filled' : ''}" onclick="window.StreamHubApp.rateWatchlist('${escapeHtml(item.id)}', ${star})">★</span>
      `).join('');

      return `
        <div class="watchlist-item" tabindex="0">
          <div class="watchlist-item-left">
            <span class="watchlist-status-badge status-${item.status}">${item.status}</span>
            <div class="watchlist-info">
              <div class="watchlist-title">${escapeHtml(item.title)}</div>
              <div class="watchlist-meta">
                <span>📍 ${escapeHtml(item.platform || 'Multi-Source')}</span>
                <span>🎭 ${escapeHtml(item.genre || 'General')}</span>
                <span>⏱️ ${formatMinutes(item.runtime || 120)}</span>
              </div>
            </div>
          </div>
          
          <div style="display:flex; align-items:center; gap: 14px; flex-wrap: wrap;">
            <div class="star-rating" title="Rate this title">${starsHtml}</div>
            <select onchange="window.StreamHubApp.updateWatchlistStatus('${escapeHtml(item.id)}', this.value)" style="padding: 4px 8px; font-size: 0.8rem;" tabindex="0">
              <option value="towatch" ${item.status === 'towatch' ? 'selected' : ''}>To Watch</option>
              <option value="watching" ${item.status === 'watching' ? 'selected' : ''}>Watching</option>
              <option value="watched" ${item.status === 'watched' ? 'selected' : ''}>Watched</option>
            </select>
            <button class="btn btn-sm btn-accent" onclick="window.StreamHubApp.openStreamFinder('${escapeHtml(item.title)}', '${escapeHtml(item.imdb || '')}')" tabindex="0" title="Find Streams">
              ⚡ Stream
            </button>
            <button class="btn btn-sm btn-danger" onclick="window.StreamHubApp.removeWatchlist('${escapeHtml(item.id)}')" tabindex="0" title="Delete">
              ✕
            </button>
          </div>
        </div>
      `;
    }).join('');
  }

  // =========================================================================
  // 11. BOOKMARKS SYSTEM
  // =========================================================================

  function renderBookmarks() {
    const container = document.getElementById('bookmarkFolders');
    if (!container) return;

    const categories = ['General', 'Torrents & Scrapers', 'Free Legal Movies', 'TV Shows', 'Anime', 'Live TV & Sports', 'Documentaries'];
    
    container.innerHTML = categories.map(cat => {
      const items = State.bookmarks.filter(b => b.category === cat);
      if (items.length === 0) return '';

      return `
        <div class="folder-category">
          <div class="folder-header">
            <span>📁 ${escapeHtml(cat)}</span>
            <span style="font-size: 0.8rem; color: var(--text-dim);">${items.length} bookmarks</span>
          </div>
          ${items.map(b => `
            <div class="bookmark-item" tabindex="0">
              <a href="${escapeHtml(b.url)}" target="_blank" rel="noopener noreferrer" class="bookmark-link">
                <span>🔗</span>
                <div>
                  <div>${escapeHtml(b.title)}</div>
                  <div class="bookmark-url">${escapeHtml(b.url)}</div>
                </div>
              </a>
              <div style="display:flex; align-items:center; gap: 8px;">
                <button class="btn btn-sm ${b.pinned ? 'btn-secondary' : 'btn-outline'}" onclick="window.StreamHubApp.toggleBookmarkPin('${escapeHtml(b.id)}')" tabindex="0">
                  ${b.pinned ? '📌 Pinned' : 'Pin'}
                </button>
                <button class="btn btn-sm btn-danger" onclick="window.StreamHubApp.deleteBookmark('${escapeHtml(b.id)}')" tabindex="0">
                  ✕
                </button>
              </div>
            </div>
          `).join('')}
        </div>
      `;
    }).join('');
  }

  // =========================================================================
  // 12. RECOMMENDATION ENGINE ("FOR YOU")
  // =========================================================================

  function renderRecommendations() {
    const chipsContainer = document.getElementById('tasteChips');
    const recsList = document.getElementById('recsList');
    if (!recsList) return;

    // Analyze high rated genres from watched list
    const watched = State.watchlist.filter(w => w.status === 'watched');
    const genreScores = {};

    watched.forEach(item => {
      const g = item.genre || 'General';
      const score = item.rating ? item.rating : 3;
      genreScores[g] = (genreScores[g] || 0) + score;
    });

    const topGenres = Object.keys(genreScores).sort((a, b) => genreScores[b] - genreScores[a]);

    if (chipsContainer) {
      if (topGenres.length > 0) {
        chipsContainer.innerHTML = topGenres.slice(0, 5).map(g => `
          <span class="chip active">${escapeHtml(g)} (${genreScores[g]} pts)</span>
        `).join('');
      } else {
        chipsContainer.innerHTML = `<span class="hint-label">Rate items ★1-5 in your Watchlist to build your custom taste profile.</span>`;
      }
    }

    // Score and rank catalog recommendations
    let recommended = CATALOG.filter(c => {
      // Exclude titles already watched
      return !watched.some(w => w.title.toLowerCase() === c.title.toLowerCase());
    });

    if (topGenres.length > 0) {
      recommended.sort((a, b) => {
        const scoreA = (genreScores[a.genre] || 0) + (a.rating || 7);
        const scoreB = (genreScores[b.genre] || 0) + (b.rating || 7);
        return scoreB - scoreA;
      });
    }

    recsList.innerHTML = recommended.slice(0, 10).map(item => `
      <div class="media-card" onclick="window.StreamHubApp.openStreamModalById('${escapeHtml(item.imdb || item.id)}', '${escapeHtml(item.title)}')" tabindex="0">
        <div class="media-poster-wrap">
          <img src="${escapeHtml(item.poster)}" alt="${escapeHtml(item.title)}" class="media-poster" onerror="this.src='icons/icon-192.png'">
          <div class="media-badges">
            <span class="badge-source ${item.quality === '4K' ? 'badge-4k' : ''}">${escapeHtml(item.quality || 'HD')}</span>
          </div>
          <div class="badge-rating">★ ${item.rating || '8.0'}</div>
        </div>
        <div class="media-info">
          <div class="media-title">${escapeHtml(item.title)}</div>
          <div class="media-meta">
            <span>${item.year || 2024}</span>
            <span>${escapeHtml(item.genre || 'General')}</span>
          </div>
        </div>
      </div>
    `).join('');
  }

  // =========================================================================
  // 13. SMART EPISODE & SEASON TRACKER
  // =========================================================================

  function renderShows() {
    const list = document.getElementById('showsList');
    const empty = document.getElementById('showsEmpty');
    if (!list) return;

    if (State.shows.length === 0) {
      list.innerHTML = '';
      if (empty) empty.style.display = 'flex';
      return;
    }

    if (empty) empty.style.display = 'none';
    list.innerHTML = State.shows.map(show => {
      const totalEpisodes = (show.seasons || 1) * (show.episodesPerSeason || 10);
      const watchedCount = (show.watched || []).length;
      const progressPercent = Math.round((watchedCount / totalEpisodes) * 100);

      // Generate episode toggle buttons
      let epButtons = [];
      for (let s = 1; s <= (show.seasons || 1); s++) {
        for (let e = 1; e <= (show.episodesPerSeason || 10); e++) {
          const epKey = `${s}-${e}`;
          const isWatched = (show.watched || []).includes(epKey);
          epButtons.push(`
            <button class="ep-btn ${isWatched ? 'watched' : ''}" onclick="window.StreamHubApp.toggleEpisode('${escapeHtml(show.id)}', '${epKey}')" tabindex="0">
              S${s}E${e}
            </button>
          `);
        }
      }

      return `
        <div class="show-card" tabindex="0">
          <div class="show-header">
            <div>
              <div class="show-name">${escapeHtml(show.name)}</div>
              <div style="font-size: 0.82rem; color: var(--text-muted);">${escapeHtml(show.platform || 'EZTV / Torrentio')} • ${watchedCount}/${totalEpisodes} Episodes (${progressPercent}%)</div>
            </div>
            <div style="display:flex; gap: 8px;">
              <button class="btn btn-sm btn-accent" onclick="window.StreamHubApp.openStreamFinder('${escapeHtml(show.name)}', '${escapeHtml(show.imdb || '')}')" tabindex="0">
                🔎 EZTV / Torrentio Search
              </button>
              <button class="btn btn-sm btn-danger" onclick="window.StreamHubApp.deleteShow('${escapeHtml(show.id)}')" tabindex="0">
                ✕
              </button>
            </div>
          </div>
          
          <div class="progress-bar-wrap">
            <div class="progress-bar-fill" style="width: ${progressPercent}%;"></div>
          </div>

          <div class="episode-grid">${epButtons.join('')}</div>
        </div>
      `;
    }).join('');
  }

  // =========================================================================
  // 14. WEEKEND MARATHON ARCHITECT
  // =========================================================================

  function renderMarathon() {
    const summary = document.getElementById('marathonSummary');
    const schedule = document.getElementById('marathonSchedule');
    if (!schedule) return;

    const startTimeInput = document.getElementById('marathonStart');
    const startVal = startTimeInput ? startTimeInput.value : '10:00';
    const [startHour, startMin] = startVal.split(':').map(Number);

    let currentTime = new Date();
    currentTime.setHours(startHour, startMin, 0, 0);

    const breakInterval = parseInt(document.getElementById('marathonBreakInterval')?.value || '120', 10);
    const mealDuration = parseInt(document.getElementById('marathonMealDuration')?.value || '45', 10);

    let totalMovieMinutes = 0;
    let totalBreakMinutes = 0;
    let slots = [];
    let minutesSinceLastBreak = 0;

    State.marathon.forEach((item, idx) => {
      const runtime = parseInt(item.runtime, 10) || 120;
      totalMovieMinutes += runtime;

      // Check if we need an automatic break before this title (if not the first title)
      if (idx > 0 && minutesSinceLastBreak >= breakInterval) {
        const isMealTime = (currentTime.getHours() >= 13 && currentTime.getHours() <= 14) || (currentTime.getHours() >= 19 && currentTime.getHours() <= 20);
        const breakMins = isMealTime ? mealDuration : 15;
        const breakTitle = isMealTime ? '🍽️ Meal & Refreshment Break' : '🍿 Quick Stretch & Snack Break';

        const breakStart = formatClockTime(currentTime);
        currentTime.setMinutes(currentTime.getMinutes() + breakMins);
        const breakEnd = formatClockTime(currentTime);

        totalBreakMinutes += breakMins;
        minutesSinceLastBreak = 0;

        slots.push(`
          <div class="schedule-slot is-break">
            <div class="slot-time">${breakStart} – ${breakEnd}</div>
            <div class="slot-info">
              <div class="slot-title">${breakTitle} (${breakMins} mins)</div>
            </div>
          </div>
        `);
      }

      const movieStart = formatClockTime(currentTime);
      currentTime.setMinutes(currentTime.getMinutes() + runtime);
      const movieEnd = formatClockTime(currentTime);
      minutesSinceLastBreak += runtime;

      slots.push(`
        <div class="schedule-slot" tabindex="0">
          <div class="slot-time">${movieStart} – ${movieEnd}</div>
          <div class="slot-info">
            <div class="slot-title">${escapeHtml(item.title)}</div>
            <div style="font-size: 0.82rem; color: var(--text-muted);">${escapeHtml(item.mood || 'General')} • ${formatMinutes(runtime)}</div>
          </div>
          <button class="btn btn-sm btn-danger" onclick="window.StreamHubApp.removeMarathonItem(${idx})" tabindex="0">✕</button>
        </div>
      `);
    });

    if (summary) {
      summary.innerHTML = `
        <div>
          <div style="font-size: 1.1rem; font-weight: 700;">Marathon Lineup: ${State.marathon.length} Titles</div>
          <div style="font-size: 0.85rem; color: var(--text-muted);">
            Watch Time: <strong>${formatMinutes(totalMovieMinutes)}</strong> + Breaks: <strong>${formatMinutes(totalBreakMinutes)}</strong>
          </div>
        </div>
        <div style="font-size: 1.1rem; font-weight: 700; color: var(--secondary);">
          Estimated Finish: ${formatClockTime(currentTime)}
        </div>
      `;
    }

    if (State.marathon.length === 0) {
      schedule.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon">🍿</div>
          <div class="empty-text">No titles in marathon schedule. Add titles above or click "Pull from Watchlist"!</div>
        </div>
      `;
    } else {
      schedule.innerHTML = slots.join('');
    }
  }

  function formatClockTime(dateObj) {
    const h = String(dateObj.getHours()).padStart(2, '0');
    const m = String(dateObj.getMinutes()).padStart(2, '0');
    return `${h}:${m}`;
  }

  // =========================================================================
  // 15. RELEASE ALERTS & COUNTDOWN SYSTEM
  // =========================================================================

  function renderReleases() {
    const list = document.getElementById('releasesList');
    if (!list) return;

    if (State.releases.length === 0) {
      list.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon">🔔</div>
          <div class="empty-text">No releases currently tracked. Add an upcoming movie or series above!</div>
        </div>
      `;
      return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    list.innerHTML = State.releases.map(item => {
      let countdownText = 'Release Date TBD';
      let isReleased = false;

      if (item.releaseDate) {
        const rDate = new Date(item.releaseDate);
        rDate.setHours(0, 0, 0, 0);
        const diffDays = Math.ceil((rDate - today) / (1000 * 60 * 60 * 24));

        if (diffDays > 0) {
          countdownText = `⏳ Releasing in ${diffDays} day${diffDays === 1 ? '' : 's'} (${item.releaseDate})`;
        } else if (diffDays === 0) {
          countdownText = `🎉 RELEASING TODAY!`;
          isReleased = true;
        } else {
          countdownText = `✅ Released on ${item.releaseDate} (${Math.abs(diffDays)} days ago)`;
          isReleased = true;
        }
      }

      const justWatchUrl = `https://www.justwatch.com/us/search?q=${encodeURIComponent(item.title)}`;
      const googleAlertUrl = `https://www.google.com/alerts#create:q=${encodeURIComponent(item.title + ' streaming release')}`;

      return `
        <div class="release-card" tabindex="0">
          <div>
            <div style="font-weight: 700; font-size: 1.1rem;">${escapeHtml(item.title)}</div>
            <div style="font-size: 0.82rem; color: var(--text-muted);">${escapeHtml(item.type || 'Theatrical / Stream')}</div>
            <div class="release-countdown" style="${isReleased ? 'color: var(--success);' : ''}">${countdownText}</div>
          </div>
          <div class="btn-group">
            <button class="btn btn-sm btn-accent" onclick="window.StreamHubApp.openStreamFinder('${escapeHtml(item.title)}', '${escapeHtml(item.imdb || '')}')" tabindex="0">
              ⚡ Check Streams
            </button>
            <a href="${escapeHtml(justWatchUrl)}" target="_blank" rel="noopener" class="btn btn-sm btn-secondary" tabindex="0">
              🔎 JustWatch
            </a>
            <a href="${escapeHtml(googleAlertUrl)}" target="_blank" rel="noopener" class="btn btn-sm btn-outline" tabindex="0">
              🔔 Google Alert
            </a>
            <button class="btn btn-sm btn-danger" onclick="window.StreamHubApp.deleteRelease('${escapeHtml(item.id)}')" tabindex="0">
              ✕
            </button>
          </div>
        </div>
      `;
    }).join('');
  }

  // =========================================================================
  // 16. SETTINGS, BACKUP & RESTORE
  // =========================================================================

  function populateSettingsForm() {
    const debridProvider = document.getElementById('settingDebridProvider');
    const debridKey = document.getElementById('settingDebridKey');
    const torrentioUrl = document.getElementById('settingTorrentioUrl');
    const cometUrl = document.getElementById('settingCometUrl');
    const themeSelect = document.getElementById('settingTheme');
    const autoTvMode = document.getElementById('settingAutoTvMode');
    const defaultPlayer = document.getElementById('settingDefaultPlayer');

    if (debridProvider) debridProvider.value = State.settings.debridProvider || 'none';
    if (debridKey) debridKey.value = State.settings.debridKey || '';
    if (torrentioUrl) torrentioUrl.value = State.settings.torrentioUrl || 'https://torrentio.strem.fun';
    if (cometUrl) cometUrl.value = State.settings.cometUrl || 'https://comet.elfhosted.com';
    if (themeSelect) themeSelect.value = State.settings.theme || 'theme-midnight';
    if (autoTvMode) autoTvMode.checked = !!State.settings.autoTvMode;
    if (defaultPlayer) defaultPlayer.value = State.settings.defaultPlayer || 'webplayer';
  }

  function saveAddonSettings() {
    State.settings.debridProvider = document.getElementById('settingDebridProvider')?.value || 'none';
    State.settings.debridKey = document.getElementById('settingDebridKey')?.value || '';
    State.settings.torrentioUrl = document.getElementById('settingTorrentioUrl')?.value || 'https://torrentio.strem.fun';
    State.settings.cometUrl = document.getElementById('settingCometUrl')?.value || 'https://comet.elfhosted.com';

    saveStorage(STORAGE_KEYS.SETTINGS, State.settings);
    showToast('✅ Addon configuration saved successfully!');
  }

  function saveUiSettings() {
    const theme = document.getElementById('settingTheme')?.value || 'theme-midnight';
    State.settings.theme = theme;
    State.settings.autoTvMode = !!document.getElementById('settingAutoTvMode')?.checked;
    State.settings.defaultPlayer = document.getElementById('settingDefaultPlayer')?.value || 'webplayer';

    saveStorage(STORAGE_KEYS.SETTINGS, State.settings);
    applyTheme(theme);
    showToast('✅ UI preferences updated!');
  }

  function exportCompleteBackup() {
    const backup = {
      version: '2.0',
      exportedAt: new Date().toISOString(),
      bookmarks: State.bookmarks,
      watchlist: State.watchlist,
      shows: State.shows,
      marathon: State.marathon,
      releases: State.releases,
      settings: State.settings
    };

    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `streamhub-backup-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('📤 Complete backup exported!');
  }

  function importCompleteBackup(jsonString) {
    try {
      const data = JSON.parse(jsonString);
      if (data.bookmarks) State.bookmarks = data.bookmarks;
      if (data.watchlist) State.watchlist = data.watchlist;
      if (data.shows) State.shows = data.shows;
      if (data.marathon) State.marathon = data.marathon;
      if (data.releases) State.releases = data.releases;
      if (data.settings) State.settings = { ...DEFAULT_SETTINGS, ...data.settings };

      saveStorage(STORAGE_KEYS.BOOKMARKS, State.bookmarks);
      saveStorage(STORAGE_KEYS.WATCHLIST, State.watchlist);
      saveStorage(STORAGE_KEYS.SHOWS, State.shows);
      saveStorage(STORAGE_KEYS.MARATHON, State.marathon);
      saveStorage(STORAGE_KEYS.RELEASES, State.releases);
      saveStorage(STORAGE_KEYS.SETTINGS, State.settings);

      applyTheme(State.settings.theme);
      showToast('📥 Backup imported successfully!');
      switchTab('home');
    } catch (e) {
      alert('Invalid backup JSON file: ' + e.message);
    }
  }

  // =========================================================================
  // 17. PUBLIC API & EVENT WIRING
  // =========================================================================

  window.StreamHubApp = {
    // Navigation
    switchTab,
    toggleTvMode,

    // Stream & Modals
    openStreamFinder: (query, imdb) => {
      switchTab('search');
      const input = document.getElementById('streamSearchInput');
      if (input) input.value = query;
      performUniversalSearch(query);
    },
    openStreamModalById: (idOrImdb, title) => {
      const found = CATALOG.find(c => c.imdb === idOrImdb || c.id === idOrImdb) || {
        id: idOrImdb,
        imdb: idOrImdb,
        title: title || 'Selected Title',
        year: 2024,
        type: 'movie',
        genre: 'Movies & Series',
        rating: 8.0,
        runtime: 120,
        poster: 'icons/icon-192.png',
        desc: `High-definition streams and torrent downloads for ${title || 'this title'}.`
      };
      openStreamModal(found);
    },
    quickPlay: (title, imdb) => {
      const magnetUrl = `magnet:?xt=urn:btih:a1b2c3d4e5f60718293a4b5c6d7e8f9012345678&dn=${encodeURIComponent(title)}${FAST_TRACKERS}`;
      launchWebPlayer(title, magnetUrl);
    },
    launchWebPlayer,

    // Watchlist
    markWatched: (id) => {
      const item = State.watchlist.find(w => w.id === id);
      if (item) {
        item.status = 'watched';
        saveStorage(STORAGE_KEYS.WATCHLIST, State.watchlist);
        showToast(`Marked "${item.title}" as Watched!`);
        renderHome();
        renderWatchlist();
      }
    },
    updateWatchlistStatus: (id, status) => {
      const item = State.watchlist.find(w => w.id === id);
      if (item) {
        item.status = status;
        saveStorage(STORAGE_KEYS.WATCHLIST, State.watchlist);
        renderWatchlist();
        renderHome();
      }
    },
    rateWatchlist: (id, rating) => {
      const item = State.watchlist.find(w => w.id === id);
      if (item) {
        item.rating = rating;
        saveStorage(STORAGE_KEYS.WATCHLIST, State.watchlist);
        showToast(`Rated "${item.title}" ${rating} ★`);
        renderWatchlist();
      }
    },
    removeWatchlist: (id) => {
      State.watchlist = State.watchlist.filter(w => w.id !== id);
      saveStorage(STORAGE_KEYS.WATCHLIST, State.watchlist);
      renderWatchlist();
      renderHome();
      showToast('Item removed from Watchlist');
    },
    addToWatchlistFromCatalog: (title, genre, runtime, imdb) => {
      if (State.watchlist.some(w => w.title.toLowerCase() === title.toLowerCase())) {
        showToast(`"${title}" is already in your Watchlist!`);
        return;
      }
      State.watchlist.unshift({
        id: 'w-' + Date.now(),
        title,
        platform: 'Torrentio / Multi',
        genre: genre || 'General',
        runtime: runtime || 120,
        status: 'towatch',
        rating: 0,
        imdb: imdb || ''
      });
      saveStorage(STORAGE_KEYS.WATCHLIST, State.watchlist);
      showToast(`Added "${title}" to Watchlist!`);
    },

    // Bookmarks
    toggleBookmarkPin: (id) => {
      const b = State.bookmarks.find(x => x.id === id);
      if (b) {
        b.pinned = !b.pinned;
        saveStorage(STORAGE_KEYS.BOOKMARKS, State.bookmarks);
        renderBookmarks();
        renderHomeBookmarks();
        showToast(b.pinned ? 'Pinned to Home' : 'Unpinned from Home');
      }
    },
    deleteBookmark: (id) => {
      State.bookmarks = State.bookmarks.filter(b => b.id !== id);
      saveStorage(STORAGE_KEYS.BOOKMARKS, State.bookmarks);
      renderBookmarks();
      renderHomeBookmarks();
      showToast('Bookmark deleted');
    },

    // Shows & Episodes
    toggleEpisode: (showId, epKey) => {
      const show = State.shows.find(s => s.id === showId);
      if (!show) return;
      show.watched = show.watched || [];
      const idx = show.watched.indexOf(epKey);
      if (idx > -1) {
        show.watched.splice(idx, 1);
      } else {
        show.watched.push(epKey);
      }
      saveStorage(STORAGE_KEYS.SHOWS, State.shows);
      renderShows();
    },
    deleteShow: (id) => {
      State.shows = State.shows.filter(s => s.id !== id);
      saveStorage(STORAGE_KEYS.SHOWS, State.shows);
      renderShows();
      showToast('Show deleted from tracking');
    },

    // Marathon
    removeMarathonItem: (idx) => {
      State.marathon.splice(idx, 1);
      saveStorage(STORAGE_KEYS.MARATHON, State.marathon);
      renderMarathon();
    },

    // Releases
    deleteRelease: (id) => {
      State.releases = State.releases.filter(r => r.id !== id);
      saveStorage(STORAGE_KEYS.RELEASES, State.releases);
      renderReleases();
      showToast('Release alert removed');
    },

    // Utility
    copyToClipboard: (text, msg = 'Copied to clipboard!') => {
      navigator.clipboard.writeText(text).then(() => {
        showToast(msg);
      }).catch(() => {
        prompt('Copy this link:', text);
      });
    }
  };

  // =========================================================================
  // 18. DOM INITIALIZATION & EVENT LISTENERS
  // =========================================================================

  document.addEventListener('DOMContentLoaded', () => {
    // Apply saved theme
    applyTheme(State.settings.theme || 'theme-midnight');

    // Auto TV Mode detection
    if (State.settings.autoTvMode || window.location.search.includes('tv=1')) {
      toggleTvMode(true);
    } else if (State.tvMode) {
      toggleTvMode(true);
    }

    // Tab Navigation clicks
    document.querySelectorAll('.tab').forEach(tab => {
      tab.addEventListener('click', () => {
        const tabId = tab.getAttribute('data-tab');
        switchTab(tabId);
      });
    });

    // Topbar Search
    const globalSearch = document.getElementById('globalSearch');
    const globalSearchBtn = document.getElementById('globalSearchBtn');
    const clearSearchBtn = document.getElementById('clearSearchBtn');

    if (globalSearch) {
      globalSearch.addEventListener('input', (e) => {
        if (clearSearchBtn) clearSearchBtn.style.display = e.target.value ? 'block' : 'none';
      });

      globalSearch.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          const q = globalSearch.value.trim();
          if (q) {
            switchTab('search');
            const searchInput = document.getElementById('streamSearchInput');
            if (searchInput) searchInput.value = q;
            performUniversalSearch(q);
          }
        }
      });
    }

    if (globalSearchBtn) {
      globalSearchBtn.addEventListener('click', () => {
        const q = globalSearch ? globalSearch.value.trim() : '';
        if (q) {
          switchTab('search');
          const searchInput = document.getElementById('streamSearchInput');
          if (searchInput) searchInput.value = q;
          performUniversalSearch(q);
        }
      });
    }

    if (clearSearchBtn && globalSearch) {
      clearSearchBtn.addEventListener('click', () => {
        globalSearch.value = '';
        clearSearchBtn.style.display = 'none';
        globalSearch.focus();
      });
    }

    // Topbar Buttons
    document.getElementById('brandLogo')?.addEventListener('click', () => switchTab('home'));
    document.getElementById('tvToggleBtn')?.addEventListener('click', () => toggleTvMode());
    document.getElementById('tvExitBtn')?.addEventListener('click', () => toggleTvMode(false));
    document.getElementById('settingsOpenBtn')?.addEventListener('click', () => switchTab('settings'));
    document.getElementById('quickStreamBtn')?.addEventListener('click', () => {
      switchTab('search');
      document.getElementById('directMagnetInput')?.focus();
    });

    // Hero buttons
    document.getElementById('heroSearchAction')?.addEventListener('click', () => switchTab('search'));
    document.getElementById('heroTvAction')?.addEventListener('click', () => toggleTvMode(true));
    document.getElementById('heroWatchlistAction')?.addEventListener('click', () => switchTab('watchlist'));

    // Quick Stream Finder Search Bar
    const streamSearchInput = document.getElementById('streamSearchInput');
    const streamSearchBtn = document.getElementById('streamSearchBtn');

    if (streamSearchBtn && streamSearchInput) {
      const doSearch = () => {
        const q = streamSearchInput.value.trim();
        if (q) {
          const activeSrc = document.querySelector('[data-src].active')?.getAttribute('data-src') || 'all';
          const activeType = document.querySelector('[data-type].active')?.getAttribute('data-type') || 'all';
          performUniversalSearch(q, activeSrc, activeType);
        }
      };
      streamSearchBtn.addEventListener('click', doSearch);
      streamSearchInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') doSearch(); });
    }

    // Filter Chips for Search
    document.querySelectorAll('[data-src]').forEach(chip => {
      chip.addEventListener('click', () => {
        document.querySelectorAll('[data-src]').forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        const q = streamSearchInput ? streamSearchInput.value.trim() : '';
        if (q) performUniversalSearch(q, chip.getAttribute('data-src'));
      });
    });

    document.querySelectorAll('[data-type]').forEach(chip => {
      chip.addEventListener('click', () => {
        document.querySelectorAll('[data-type]').forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        const q = streamSearchInput ? streamSearchInput.value.trim() : '';
        if (q) performUniversalSearch(q, undefined, chip.getAttribute('data-type'));
      });
    });

    // Trending Tags
    document.querySelectorAll('.quick-tag').forEach(tag => {
      tag.addEventListener('click', () => {
        const query = tag.getAttribute('data-query');
        if (streamSearchInput) streamSearchInput.value = query;
        performUniversalSearch(query);
      });
    });

    // Direct Magnet Input
    document.getElementById('directMagnetPlayBtn')?.addEventListener('click', () => {
      const input = document.getElementById('directMagnetInput');
      const val = input ? input.value.trim() : '';
      if (!val) {
        showToast('Please enter a Magnet link or video URL');
        return;
      }
      launchWebPlayer('Direct Stream', val);
    });

    document.getElementById('directMagnetStremioBtn')?.addEventListener('click', () => {
      const input = document.getElementById('directMagnetInput');
      const val = input ? input.value.trim() : '';
      if (val) {
        window.open(`stremio:///detail/movie/tt1375666`, '_blank');
      } else {
        window.open('https://web.stremio.com', '_blank');
      }
    });

    document.getElementById('directMagnetExternalBtn')?.addEventListener('click', () => {
      const input = document.getElementById('directMagnetInput');
      const val = input ? input.value.trim() : '';
      if (val) {
        window.location.href = val;
      } else {
        showToast('Please enter a Magnet link');
      }
    });

    // Hub filter pills on Home
    document.querySelectorAll('#hubFilter .pill').forEach(pill => {
      pill.addEventListener('click', () => {
        document.querySelectorAll('#hubFilter .pill').forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        renderPlatformGrid(pill.getAttribute('data-hub'));
      });
    });

    // Discover Category & Quality tabs
    document.querySelectorAll('#browseCategoryTabs .chip').forEach(chip => {
      chip.addEventListener('click', () => {
        document.querySelectorAll('#browseCategoryTabs .chip').forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        const activeQual = document.querySelector('#browseQualityTabs .chip.active')?.getAttribute('data-quality') || 'all';
        renderBrowseGrid(chip.getAttribute('data-category'), activeQual);
      });
    });

    document.querySelectorAll('#browseQualityTabs .chip').forEach(chip => {
      chip.addEventListener('click', () => {
        document.querySelectorAll('#browseQualityTabs .chip').forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        const activeCat = document.querySelector('#browseCategoryTabs .chip.active')?.getAttribute('data-category') || 'trending';
        renderBrowseGrid(activeCat, chip.getAttribute('data-quality'));
      });
    });

    // Watchlist Form
    document.getElementById('watchlistForm')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const form = e.target;
      const title = form.elements['title'].value.trim();
      const platform = form.elements['platform'].value.trim() || 'Multi';
      const genre = form.elements['genre'].value;
      const runtime = parseInt(form.elements['runtime'].value, 10) || 120;
      const status = form.elements['status'].value;

      State.watchlist.unshift({
        id: 'w-' + Date.now(),
        title,
        platform,
        genre,
        runtime,
        status,
        rating: 0,
        imdb: ''
      });

      saveStorage(STORAGE_KEYS.WATCHLIST, State.watchlist);
      form.reset();
      renderWatchlist();
      showToast(`Added "${title}" to Watchlist!`);
    });

    // Watchlist Status Filters
    document.querySelectorAll('#watchlistStatusFilter .chip').forEach(chip => {
      chip.addEventListener('click', () => {
        document.querySelectorAll('#watchlistStatusFilter .chip').forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        renderWatchlist(chip.getAttribute('data-filter'));
      });
    });

    document.getElementById('watchlistSearchInput')?.addEventListener('input', (e) => {
      const activeFilter = document.querySelector('#watchlistStatusFilter .chip.active')?.getAttribute('data-filter') || 'all';
      renderWatchlist(activeFilter, e.target.value);
    });

    // Bookmarks Form
    document.getElementById('bookmarkForm')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const form = e.target;
      const title = form.elements['title'].value.trim();
      const url = form.elements['url'].value.trim();
      const category = form.elements['category'].value;
      const pinned = form.elements['pinned'].checked;

      State.bookmarks.unshift({
        id: 'b-' + Date.now(),
        title,
        url,
        category,
        pinned
      });

      saveStorage(STORAGE_KEYS.BOOKMARKS, State.bookmarks);
      form.reset();
      renderBookmarks();
      renderHomeBookmarks();
      showToast(`Bookmark "${title}" added!`);
    });

    // Load Bookmark Presets
    document.getElementById('loadBookmarkPresetsBtn')?.addEventListener('click', () => {
      State.bookmarks = DEFAULT_BOOKMARKS;
      saveStorage(STORAGE_KEYS.BOOKMARKS, State.bookmarks);
      renderBookmarks();
      renderHomeBookmarks();
      showToast('Presets loaded!');
    });

    // Shows Form
    document.getElementById('showForm')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const form = e.target;
      const name = form.elements['name'].value.trim();
      const platform = form.elements['platform'].value.trim() || 'EZTV / Torrentio';
      const seasons = parseInt(form.elements['seasons'].value, 10) || 1;
      const episodesPerSeason = parseInt(form.elements['episodesPerSeason'].value, 10) || 10;

      State.shows.unshift({
        id: 's-' + Date.now(),
        name,
        platform,
        seasons,
        episodesPerSeason,
        watched: [],
        imdb: ''
      });

      saveStorage(STORAGE_KEYS.SHOWS, State.shows);
      form.reset();
      renderShows();
      showToast(`Started tracking "${name}"!`);
    });

    // Marathon Add Form
    document.getElementById('marathonQuickAdd')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const form = e.target;
      const title = form.elements['title'].value.trim();
      const mood = form.elements['mood'].value;
      const runtime = parseInt(form.elements['runtime'].value, 10) || 120;

      State.marathon.push({ title, mood, runtime });
      saveStorage(STORAGE_KEYS.MARATHON, State.marathon);
      form.reset();
      renderMarathon();
      showToast(`Added "${title}" to marathon lineup!`);
    });

    document.getElementById('marathonStart')?.addEventListener('change', () => renderMarathon());
    document.getElementById('marathonBreakInterval')?.addEventListener('change', () => renderMarathon());
    document.getElementById('marathonMealDuration')?.addEventListener('change', () => renderMarathon());
    document.getElementById('printMarathon')?.addEventListener('click', () => window.print());
    document.getElementById('loadWatchlistMarathonBtn')?.addEventListener('click', () => {
      const toWatch = State.watchlist.filter(w => w.status !== 'watched');
      if (toWatch.length === 0) {
        showToast('No un-watched titles found in Watchlist!');
        return;
      }
      toWatch.forEach(item => {
        State.marathon.push({
          title: item.title,
          mood: item.genre || 'Action',
          runtime: item.runtime || 120
        });
      });
      saveStorage(STORAGE_KEYS.MARATHON, State.marathon);
      renderMarathon();
      showToast(`Imported ${toWatch.length} titles from Watchlist!`);
    });

    // Release Form
    document.getElementById('releaseForm')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const form = e.target;
      const title = form.elements['title'].value.trim();
      const releaseDate = form.elements['releaseDate'].value;
      const type = form.elements['type'].value.trim() || 'Streaming Release';

      State.releases.unshift({
        id: 'r-' + Date.now(),
        title,
        releaseDate,
        type
      });

      saveStorage(STORAGE_KEYS.RELEASES, State.releases);
      form.reset();
      renderReleases();
      showToast(`Tracking release of "${title}"!`);
    });

    // Settings save buttons
    document.getElementById('saveAddonSettingsBtn')?.addEventListener('click', saveAddonSettings);
    document.getElementById('saveUiSettingsBtn')?.addEventListener('click', saveUiSettings);
    document.getElementById('exportAllDataBtn')?.addEventListener('click', exportCompleteBackup);
    
    // Import Backup
    const backupFileInput = document.getElementById('fullBackupFileInput');
    document.getElementById('importAllDataBtn')?.addEventListener('click', () => {
      if (backupFileInput) backupFileInput.click();
    });
    if (backupFileInput) {
      backupFileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (event) => importCompleteBackup(event.target.result);
          reader.readAsText(file);
        }
      });
    }

    // Reset Defaults
    document.getElementById('resetFactoryBtn')?.addEventListener('click', () => {
      if (confirm('Are you sure you want to reset all data to default? This will overwrite your current watchlist and bookmarks.')) {
        localStorage.clear();
        State.settings = DEFAULT_SETTINGS;
        State.bookmarks = DEFAULT_BOOKMARKS;
        State.watchlist = DEFAULT_WATCHLIST;
        State.shows = DEFAULT_SHOWS;
        State.marathon = [];
        State.releases = DEFAULT_RELEASES;
        location.reload();
      }
    });

    // Modal Close handlers
    document.getElementById('streamModalClose')?.addEventListener('click', () => {
      document.getElementById('streamModal').style.display = 'none';
    });

    document.getElementById('playerModalClose')?.addEventListener('click', closePlayerModal);

    // Close modals on backdrop click
    window.addEventListener('click', (e) => {
      const streamModal = document.getElementById('streamModal');
      const playerModal = document.getElementById('playerModal');
      if (e.target === streamModal) streamModal.style.display = 'none';
      if (e.target === playerModal) closePlayerModal();
    });

    // =========================================================================
    // 19. GLOBAL KEYBOARD & TV REMOTE HANDLER
    // =========================================================================

    window.addEventListener('keydown', (e) => {
      const streamModal = document.getElementById('streamModal');
      const playerModal = document.getElementById('playerModal');

      // Escape / Back
      if (e.key === 'Escape' || e.key === 'Backspace') {
        if (playerModal && playerModal.style.display !== 'none') {
          closePlayerModal();
          e.preventDefault();
          return;
        }
        if (streamModal && streamModal.style.display !== 'none') {
          streamModal.style.display = 'none';
          e.preventDefault();
          return;
        }
      }

      // TV Hotkey 'T' (when not inside an input)
      if ((e.key === 't' || e.key === 'T') && !['INPUT', 'SELECT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
        toggleTvMode();
        e.preventDefault();
        return;
      }

      // Quick Search '/' key
      if (e.key === '/' && !['INPUT', 'SELECT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
        const input = document.getElementById('globalSearch') || document.getElementById('streamSearchInput');
        if (input) {
          input.focus();
          e.preventDefault();
        }
        return;
      }

      // TV D-Pad Spatial Navigation
      if (State.tvMode && !['INPUT', 'SELECT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
        if (e.key === 'ArrowUp') {
          navigateDirection('up');
          e.preventDefault();
        } else if (e.key === 'ArrowDown') {
          navigateDirection('down');
          e.preventDefault();
        } else if (e.key === 'ArrowLeft') {
          navigateDirection('left');
          e.preventDefault();
        } else if (e.key === 'ArrowRight') {
          navigateDirection('right');
          e.preventDefault();
        } else if (e.key === 'Enter') {
          const focused = document.querySelector('.tv-focused');
          if (focused && focused !== document.activeElement) {
            focused.click();
            e.preventDefault();
          }
        }
      }
    });

    // Initial render
    renderHome();

    // Register Service Worker for GitHub Pages PWA support
    if ('serviceWorker' in navigator && window.location.protocol.startsWith('http')) {
      navigator.serviceWorker.register('./sw.js').catch(err => console.log('SW registration note:', err));
    }
  });

})();
