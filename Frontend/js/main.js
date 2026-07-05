// ══════════════════════════════════════════════════════════════
//  SkyRoute – Shared utilities (auth, theme, navbar, map)
// ══════════════════════════════════════════════════════════════

// ── Auth ──────────────────────────────────────────────────────
function getUser() {
  try { return JSON.parse(localStorage.getItem('skyroute_user') || 'null'); } catch { return null; }
}
function saveUser(u) { localStorage.setItem('skyroute_user', JSON.stringify(u)); }
function clearUser() { localStorage.removeItem('skyroute_user'); }
function logout() { clearUser(); window.location.href = 'index.html'; }

// ── Theme ─────────────────────────────────────────────────────
function getTheme() { return localStorage.getItem('skyroute_theme') || 'light'; }
function applyTheme(t) {
  document.documentElement.setAttribute('data-theme', t);
  localStorage.setItem('skyroute_theme', t);
  const icon = document.getElementById('theme-icon');
  if (icon) {
    icon.innerHTML = t === 'dark'
      ? `<svg class="icon-svg" viewBox="0 0 24 24"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`
      : `<svg class="icon-svg" viewBox="0 0 24 24"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`;
  }
}
function toggleTheme() {
  const t = getTheme() === 'dark' ? 'light' : 'dark';
  applyTheme(t);
}

// ── Navbar ────────────────────────────────────────────────────
function buildNavbar(activePage) {
  const user = getUser();
  const pages = [
    { href: 'index.html',     label: 'Home' },
    { href: 'dashboard.html', label: 'Dashboard' },
    { href: 'index.html#features', label: 'Features' },
    { href: 'index.html#networks', label: 'Networks' },
  ];

  const links = pages.map(p => {
    let href = p.href;
    if (activePage === 'index.html') {
      if (p.href === 'index.html#features') href = '#features';
      if (p.href === 'index.html#networks') href = '#networks';
    }
    const isActive = activePage === p.href;
    return `<a href="${href}" class="nav-link${isActive ? ' active' : ''}">${p.label}</a>`;
  }).join('');

  const authSection = user
    ? `<div class="nav-profile-wrap">
        <button class="nav-profile-btn" onclick="toggleProfileMenu()" id="profile-trigger">
          <span class="nav-avatar" style="display:flex;align-items:center;justify-content:center">
            <svg class="icon-svg" style="width:12px;height:12px;stroke-width:2.5px" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          </span>
          <span class="nav-username">${user.name.split(' ')[0]}</span>
          <span class="nav-chevron" id="profile-chevron" style="display:flex;align-items:center">
            <svg class="icon-svg" style="width:10px;height:10px" viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"/></svg>
          </span>
        </button>
        <div class="profile-dropdown hidden" id="profile-dropdown">
          <div class="dropdown-header">
            <div class="dropdown-name">${user.name}</div>
            <div class="dropdown-email">${user.email}</div>
          </div>
          <button class="dropdown-item danger" onclick="logout()" style="display:flex;align-items:center;gap:6px">
            <svg class="icon-svg" viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
            Sign Out
          </button>
        </div>
       </div>`
    : `<div class="nav-auth">
        <a href="login.html" class="btn btn-ghost">Log In</a>
        <a href="signup.html" class="btn btn-primary btn-sm">Get Started</a>
       </div>`;

  const brandPlane = `<svg class="icon-svg" viewBox="0 0 100 100" style="width:22px;height:22px;stroke:none;fill:var(--primary);margin-right:2px"><path d="M50 5 L55 25 L85 55 L85 65 L55 50 L55 80 L68 90 L68 95 L50 90 L32 95 L32 90 L45 80 L45 50 L15 65 L15 55 L45 25 Z" /></svg>`;

  return `
    <nav class="navbar" id="navbar">
      <div class="container nav-inner">
        <a href="index.html" class="nav-brand">
          ${brandPlane}
          Sky<span class="text-primary">Route</span>
        </a>
        <div class="nav-links" id="nav-links">${links}</div>
        <div class="nav-right">
          <button class="btn-icon" onclick="toggleTheme()" title="Toggle theme">
            <span id="theme-icon" style="display:flex;align-items:center;justify-content:center"></span>
          </button>
          ${authSection}
          <button class="btn-icon mobile-menu-btn" onclick="toggleMobileMenu()" id="mobile-toggle">☰</button>
        </div>
      </div>
      <div class="mobile-menu hidden" id="mobile-menu">
        ${pages.map(p => {
          let href = p.href;
          if (activePage === 'index.html') {
            if (p.href === 'index.html#features') href = '#features';
            if (p.href === 'index.html#networks') href = '#networks';
          }
          return `<a href="${href}" class="mobile-link${activePage === p.href ? ' active' : ''}" onclick="toggleMobileMenu()">${p.label}</a>`;
        }).join('')}
        ${user
          ? `<button class="mobile-link danger" onclick="logout()" style="display:flex;align-items:center;gap:6px">
              <svg class="icon-svg" viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
              Sign Out
             </button>`
          : `<a href="login.html" class="mobile-link">Log In</a><a href="signup.html" class="mobile-link primary">Get Started</a>`
        }
      </div>
    </nav>`;
}

function toggleMobileMenu() {
  const menu = document.getElementById('mobile-menu');
  const btn = document.getElementById('mobile-toggle');
  menu.classList.toggle('hidden');
  btn.textContent = menu.classList.contains('hidden') ? '☰' : '✕';
}

function toggleProfileMenu() {
  const dd = document.getElementById('profile-dropdown');
  const ch = document.getElementById('profile-chevron');
  dd.classList.toggle('hidden');
  ch.style.transform = dd.classList.contains('hidden') ? '' : 'rotate(180deg)';
}

document.addEventListener('click', e => {
  const wrap = document.querySelector('.nav-profile-wrap');
  const dd = document.getElementById('profile-dropdown');
  if (wrap && dd && !wrap.contains(e.target)) dd.classList.add('hidden');
});

// ── Footer ────────────────────────────────────────────────────
function buildFooter() {
  const brandPlane = `<svg class="icon-svg" viewBox="0 0 100 100" style="width:14px;height:14px;stroke:none;fill:#fff"><path d="M50 5 L55 25 L85 55 L85 65 L55 50 L55 80 L68 90 L68 95 L50 90 L32 95 L32 90 L45 80 L45 50 L15 65 L15 55 L45 25 Z" /></svg>`;
  return `
    <footer class="footer">
      <div class="container footer-inner">
        <div class="footer-brand">
          <div class="brand-icon sm">${brandPlane}</div>
          <span>Sky<span class="text-primary">Route</span></span>
        </div>
        <p class="footer-copy">© ${new Date().getFullYear()} SkyRoute. Powered by Dijkstra's algorithm · 47 airports · 264 routes.</p>
        <div class="footer-links">
          <a href="index.html">Home</a>
          <a href="dashboard.html">Dashboard</a>
          <a href="login.html">Login</a>
        </div>
      </div>
    </footer>`;
}

// ── Map (Leaflet) ─────────────────────────────────────────────
let leafletMap = null;

function destroyMap() {
  if (leafletMap) { leafletMap.remove(); leafletMap = null; }
}

function initMap(containerId, result, sourceId, destId) {
  if (!window.L) return;
  destroyMap();
  const el = document.getElementById(containerId);
  if (!el) return;

  const isDark = getTheme() === 'dark';
  const tile = isDark
    ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
    : 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';

  leafletMap = L.map(el, { center: [20, 10], zoom: 2, zoomControl: true, attributionControl: false });
  L.tileLayer(tile, { maxZoom: 18, subdomains: 'abcd' }).addTo(leafletMap);

  const PRIMARY = '#0ea5e9';
  const DIM = isDark ? '#1e3a5f' : '#bfdbfe';
  const routeSet = new Set(result?.path || []);

  // Background network (real segments, deduped)
  const drawn = new Set();
  for (const seg of SEGMENTS) {
    const key = [seg.from, seg.to].sort().join('~');
    if (drawn.has(key)) continue;
    drawn.add(key);
    if (result?.found && routeSet.has(seg.from) && routeSet.has(seg.to)) continue;
    const a = AIRPORT_MAP[seg.from], b = AIRPORT_MAP[seg.to];
    if (!a || !b) continue;
    L.polyline(greatCirclePoints(a.lat, a.lng, b.lat, b.lng, 30),
      { color: DIM, weight: 0.5, opacity: 0.45, dashArray: '3 6' }).addTo(leafletMap);
  }

  // Active route arcs
  if (result?.found) {
    for (const step of result.steps) {
      const a = AIRPORT_MAP[step.from], b = AIRPORT_MAP[step.to];
      if (!a || !b) continue;
      const pts = greatCirclePoints(a.lat, a.lng, b.lat, b.lng, 80);
      L.polyline(pts, { color: PRIMARY, weight: 8, opacity: 0.1 }).addTo(leafletMap);
      L.polyline(pts, { color: PRIMARY, weight: 2.5, opacity: 0.9, dashArray: '10 5', lineCap: 'round' }).addTo(leafletMap);
      const mid = pts[Math.floor(pts.length / 2)];
      L.marker(mid, {
        icon: L.divIcon({
          html: `<svg class="icon-svg" viewBox="0 0 100 100" style="width:16px;height:16px;fill:${PRIMARY};stroke:none;transform:rotate(45deg)"><path d="M50 5 L55 25 L85 55 L85 65 L55 50 L55 80 L68 90 L68 95 L50 90 L32 95 L32 90 L45 80 L45 50 L15 65 L15 55 L45 25 Z" /></svg>`,
          className: '',
          iconSize: [16, 16],
          iconAnchor: [8, 8]
        })
      }).addTo(leafletMap);
    }
  }

  // Airport markers
  const typeColor = { hub:'#0ea5e9', international:'#8b5cf6', national:'#10b981' };
  for (const ap of AIRPORTS) {
    const apt = AIRPORT_MAP[ap[0]];
    const isEndpoint = apt.id === sourceId || apt.id === destId;
    const isOnRoute = result?.found && routeSet.has(apt.id);
    const color = isEndpoint ? '#f97316' : isOnRoute ? PRIMARY : (typeColor[apt.type] || '#64748b');
    const sz = isEndpoint ? 14 : isOnRoute ? 11 : apt.type === 'hub' ? 9 : 7;
    const border = (isEndpoint || isOnRoute) ? '#fff' : 'transparent';

    const icon = L.divIcon({
      html: `<div style="width:${sz}px;height:${sz}px;background:${color};border:2px solid ${border};border-radius:50%;box-shadow:0 0 6px ${color}80"></div>`,
      className: '', iconSize: [sz, sz], iconAnchor: [sz/2, sz/2]
    });
    const mk = L.marker([apt.lat, apt.lng], { icon }).addTo(leafletMap);
    const typeLabel = { hub:'Major Hub', international:'International', national:'National / Domestic' }[apt.type] || apt.type;
    mk.bindPopup(`
      <div style="font-family:Inter,sans-serif;min-width:180px">
        <div style="font-weight:700;font-size:14px">${apt.name} <span style="color:${color}">(${apt.id})</span></div>
        <div style="font-size:12px;color:#475569;margin:3px 0">${apt.airport}</div>
        <span style="font-size:11px;background:${color}20;color:${color};padding:2px 8px;border-radius:999px;font-weight:600">${typeLabel}</span>
        <span style="font-size:11px;color:#94a3b8;margin-left:4px">${apt.country} · ${apt.region}</span>
        ${isOnRoute ? `<div style="margin-top:6px;font-size:11px;color:${PRIMARY};font-weight:600">● On active route</div>` : ''}
      </div>`, { maxWidth: 260, className: 'skyroute-popup' });
  }

  // Fit to route
  if (result?.found && result.path.length >= 2) {
    const locs = result.path.map(id => AIRPORT_MAP[id]).filter(Boolean);
    const lats = locs.map(l => l.lat), lngs = locs.map(l => l.lng);
    leafletMap.fitBounds([
      [Math.min(...lats) - 8, Math.min(...lngs) - 15],
      [Math.max(...lats) + 8, Math.max(...lngs) + 15]
    ], { padding: [40, 40] });
  }

  // Legend
  const legendEl = L.control({ position: 'bottomright' });
  legendEl.onAdd = () => {
    const d = L.DomUtil.create('div');
    d.style.cssText = `background:${isDark?'rgba(15,23,42,0.9)':'rgba(255,255,255,0.92)'};border:1px solid ${isDark?'#1e293b':'#e2e8f0'};border-radius:10px;padding:8px 12px;font-family:Inter,sans-serif;font-size:11px;color:${isDark?'#94a3b8':'#475569'};line-height:1.9;backdrop-filter:blur(8px)`;
    d.innerHTML = `<div style="font-weight:700;margin-bottom:3px;color:${isDark?'#f1f5f9':'#1e293b'}">Airport Types</div>
      <div><span style="display:inline-block;width:9px;height:9px;border-radius:50%;background:#0ea5e9;margin-right:5px;vertical-align:middle"></span>Major Hub</div>
      <div><span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:#8b5cf6;margin-right:5px;vertical-align:middle"></span>International</div>
      <div><span style="display:inline-block;width:7px;height:7px;border-radius:50%;background:#10b981;margin-right:5px;vertical-align:middle"></span>National / Domestic</div>
      <div><span style="display:inline-block;width:12px;height:12px;border-radius:50%;background:#f97316;margin-right:5px;vertical-align:middle"></span>Selected</div>`;
    return d;
  };
  legendEl.addTo(leafletMap);
}

// ── Select helpers ────────────────────────────────────────────
function buildAirportOptions(selectedId) {
  return REGIONS.map(region => {
    const aps = AIRPORTS.filter(a => a[7] === region).sort((a, b) => a[1].localeCompare(b[1]));
    const opts = aps.map(a => {
      const label = { hub:'Hub', international:'Intl', national:'National' }[a[5]] || a[5];
      const sel = a[0] === selectedId ? ' selected' : '';
      return `<option value="${a[0]}"${sel}>${a[1]} (${a[0]}) · ${label}</option>`;
    }).join('');
    return `<optgroup label="${region}">${opts}</optgroup>`;
  }).join('');
}

// ── Custom Cursor Trail (Sunset Airplane Spotter) ───────────
function initCustomCursor() {
  if (window.matchMedia('(pointer: coarse)').matches) return; // Skip mobile/touch

  const plane = document.createElement('div');
  plane.id = 'custom-cursor-plane';
  plane.className = 'custom-cursor-plane';
  plane.innerHTML = `<svg viewBox="0 0 100 100" style="fill:currentColor;stroke:none;width:100%;height:100%"><path d="M50 5 L55 25 L85 55 L85 65 L55 50 L55 80 L68 90 L68 95 L50 90 L32 95 L32 90 L45 80 L45 50 L15 65 L15 55 L45 25 Z" /></svg>`;
  document.body.appendChild(plane);

  const light = document.createElement('div');
  light.id = 'custom-cursor-light';
  light.className = 'custom-cursor-light';
  document.body.appendChild(light);

  const canvas = document.createElement('canvas');
  canvas.id = 'cursor-trail-canvas';
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  
  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  let mouseX = null;
  let mouseY = null;
  let planeX = null;
  let planeY = null;
  let planeAngle = 0;
  const trailPoints = [];

  window.addEventListener('mousemove', e => {
    if (mouseX === null) {
      planeX = e.clientX;
      planeY = e.clientY;
    }
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  document.addEventListener('mouseleave', () => {
    mouseX = null;
    mouseY = null;
  });

  function tick() {
    if (mouseX !== null && planeX !== null) {
      const ease = 0.08;
      const dx = mouseX - planeX;
      const dy = mouseY - planeY;
      const dist = Math.hypot(dx, dy);

      planeX += dx * ease;
      planeY += dy * ease;

      if (dist > 1.5) {
        const targetAngle = Math.atan2(dy, dx) * 180 / Math.PI + 90;
        let diff = targetAngle - planeAngle;
        while (diff < -180) diff += 360;
        while (diff > 180) diff -= 360;
        planeAngle += diff * 0.12;
      }

      plane.style.transform = `translate3d(${planeX}px, ${planeY}px, 0) rotate(${planeAngle}deg)`;
      light.style.transform = `translate3d(${planeX}px, ${planeY}px, 0)`;

      trailPoints.push({ x: planeX, y: planeY, time: Date.now() });
    }

    const now = Date.now();
    while (trailPoints.length > 0 && now - trailPoints[0].time > 800) {
      trailPoints.shift();
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (trailPoints.length > 1) {
      for (let i = 1; i < trailPoints.length; i++) {
        const p1 = trailPoints[i - 1];
        const p2 = trailPoints[i];
        const age = now - p1.time;
        const pct = 1 - (age / 800);
        if (pct <= 0) continue;

        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);

        ctx.lineWidth = 1 + pct * 4;
        const alpha = pct * 0.45;

        let r, g, b;
        if (pct > 0.5) {
          const t = (pct - 0.5) * 2;
          r = 255;
          g = Math.floor(107 + (123 * t));
          b = Math.floor(53 + (97 * t));
        } else {
          const t = pct * 2;
          r = Math.floor(139 + (116 * t));
          g = Math.floor(92 + (15 * t));
          b = Math.floor(246 - (193 * t));
        }

        ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.stroke();
      }
    }

    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);

  const interactives = 'a, button, select, input, textarea, [role="button"], .swap-btn, .opt-btn, .route-chip';
  document.addEventListener('mouseover', e => {
    if (e.target.closest(interactives)) {
      plane.classList.add('hovering');
    }
  });

  document.addEventListener('mouseout', e => {
    if (e.target.closest(interactives)) {
      plane.classList.remove('hovering');
    }
  });

  window.addEventListener('click', e => {
    const particle = document.createElement('div');
    particle.className = 'custom-cursor-click-particle';
    particle.style.left = e.clientX + 'px';
    particle.style.top = e.clientY + 'px';
    particle.style.width = '20px';
    particle.style.height = '20px';
    document.body.appendChild(particle);

    setTimeout(() => {
      particle.remove();
    }, 500);
  });
}

// ── Init ──────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  applyTheme(getTheme());
  const navEl = document.getElementById('navbar-container');
  const footEl = document.getElementById('footer-container');
  if (navEl) {
    navEl.outerHTML = buildNavbar(window._activePage || 'index.html');
    applyTheme(getTheme());
  }
  if (footEl) footEl.outerHTML = buildFooter();
  initCustomCursor();
});
