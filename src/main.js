/* ============================================================
   MAIN — Application entry point
   
   Bootstraps the app: builds sidebar navigation, wires up
   controls, initializes the router, and starts on the
   welcome screen.
   ============================================================ */

import { getState, setState, subscribe } from './core/state.js';
import { registerRoute, initRouter, navigate } from './core/router.js';
import { animator } from './core/animator.js';
import { categories, algorithms } from './data/algoInfo.js';
import { initSortVisualizer } from './visualizers/sortVisualizer.js';
import { initSearchVisualizer } from './visualizers/searchVisualizer.js';
import { initGraphVisualizer } from './visualizers/graphVisualizer.js';
import { initGridVisualizer } from './visualizers/gridVisualizer.js';
import { initDsVisualizer } from './visualizers/dsVisualizer.js';

/* ---------- Sidebar Navigation ---------- */

function buildSidebar() {
    const nav = document.getElementById('sidebar-nav');
    if (!nav) return;

    const categoryIcons = {
        sorting: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="cat-icon"><path d="M3 6h18M3 12h12M3 18h6"/></svg>`,
        searching: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="cat-icon"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>`,
        graph: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="cat-icon"><circle cx="6" cy="6" r="3"/><circle cx="18" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="18" r="3"/><line x1="9" y1="6" x2="15" y2="6"/><line x1="6" y1="9" x2="6" y2="15"/><line x1="18" y1="9" x2="18" y2="15"/></svg>`,
        pathfinding: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="cat-icon"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 3v18"/></svg>`,
        'data-structures': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="cat-icon"><rect x="4" y="4" width="16" height="4" rx="1"/><rect x="4" y="10" width="16" height="4" rx="1"/><rect x="4" y="16" width="16" height="4" rx="1"/></svg>`,
    };

    const chevronSvg = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="chevron"><polyline points="9 18 15 12 9 6"/></svg>`;

    categories.forEach((cat) => {
        const catEl = document.createElement('div');
        catEl.className = 'nav-category open';

        const catBtn = document.createElement('button');
        catBtn.className = 'nav-category-btn';
        catBtn.innerHTML = `${categoryIcons[cat.id] || ''}${cat.name}${chevronSvg}`;
        catBtn.addEventListener('click', () => {
            catEl.classList.toggle('open');
        });

        const itemsEl = document.createElement('div');
        itemsEl.className = 'nav-items';

        cat.algorithms.forEach((algoId) => {
            const info = algorithms[algoId];
            if (!info) return;
            const item = document.createElement('button');
            item.className = 'nav-item';
            item.textContent = info.name;
            item.dataset.route = `/${cat.id}/${algoId}`;
            item.addEventListener('click', () => {
                navigate(`/${cat.id}/${algoId}`);
            });
            itemsEl.appendChild(item);
        });

        catEl.appendChild(catBtn);
        catEl.appendChild(itemsEl);
        nav.appendChild(catEl);
    });
}

function updateActiveNavItem(path) {
    const items = document.querySelectorAll('.nav-item');
    items.forEach((item) => {
        item.classList.toggle('active', item.dataset.route === path);
    });
}

/* ---------- Control Wiring ---------- */

function wireControls() {
    // Play / Pause
    const btnPlay = document.getElementById('btn-play');
    btnPlay?.addEventListener('click', () => animator.toggle());

    subscribe('isPlaying', (playing) => {
        btnPlay?.classList.toggle('playing', playing);
    });

    // Step
    document.getElementById('btn-step')?.addEventListener('click', () => animator.step());

    // Reset
    document.getElementById('btn-reset')?.addEventListener('click', () => animator.reset());

    // Generate new data (same as reset for sorting/searching)
    document.getElementById('btn-generate')?.addEventListener('click', () => {
        animator.reset();
    });

    // Speed slider
    const speedSlider = document.getElementById('speed-slider');
    const speedValue = document.getElementById('speed-value');
    speedSlider?.addEventListener('input', (e) => {
        const val = parseInt(e.target.value);
        setState('speed', val);
        if (speedValue) speedValue.textContent = val;
    });

    // Size slider
    const sizeSlider = document.getElementById('size-slider');
    const sizeValue = document.getElementById('size-value');
    sizeSlider?.addEventListener('input', (e) => {
        const val = parseInt(e.target.value);
        setState('size', val);
        if (sizeValue) sizeValue.textContent = val;
    });

    // Info panel toggle
    const infoPanel = document.getElementById('info-panel');
    document.getElementById('btn-info-toggle')?.addEventListener('click', () => {
        infoPanel?.classList.toggle('hidden');
    });

    // Code panel toggle
    const codePanel = document.getElementById('code-panel');
    document.getElementById('btn-code-toggle')?.addEventListener('click', () => {
        codePanel?.classList.toggle('hidden');
    });

    // Panel close buttons
    document.getElementById('info-close')?.addEventListener('click', () => {
        infoPanel?.classList.add('hidden');
    });
    document.getElementById('code-close')?.addEventListener('click', () => {
        codePanel?.classList.add('hidden');
    });

    // Theme toggle
    document.getElementById('theme-toggle')?.addEventListener('click', () => {
        const newTheme = getState('theme') === 'dark' ? 'light' : 'dark';
        setState('theme', newTheme);
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('algovis-theme', newTheme);
    });

    // Sidebar toggle
    document.getElementById('sidebar-toggle')?.addEventListener('click', () => {
        document.getElementById('app')?.classList.toggle('sidebar-collapsed');
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        // Skip if user is typing in an input
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

        switch (e.key.toLowerCase()) {
            case ' ':
                e.preventDefault();
                animator.toggle();
                break;
            case 'arrowright':
                e.preventDefault();
                animator.step();
                break;
            case 'r':
                animator.reset();
                break;
            case 'g':
                animator.reset();
                break;
            case 'i':
                infoPanel?.classList.toggle('hidden');
                break;
            case 'c':
                codePanel?.classList.toggle('hidden');
                break;
        }
    });
}

/* ---------- Route Registration ---------- */

function registerRoutes() {
    // Welcome / home
    registerRoute('/', () => {
        showWelcome();
        updateBreadcrumb('Home', 'Welcome');
    });

    // Register all algorithm routes
    categories.forEach((cat) => {
        cat.algorithms.forEach((algoId) => {
            const path = `/${cat.id}/${algoId}`;
            registerRoute(path, () => {
                const info = algorithms[algoId];
                updateBreadcrumb(cat.name, info?.name || algoId);
                updateActiveNavItem(path);
                animator.reset();

                switch (cat.id) {
                    case 'sorting':
                        return initSortVisualizer(algoId);
                    case 'searching':
                        return initSearchVisualizer(algoId);
                    case 'graph':
                        return initGraphVisualizer(algoId);
                    case 'pathfinding':
                        return initGridVisualizer(algoId);
                    case 'data-structures':
                        return initDsVisualizer(algoId);
                }
            });
        });
    });
}

function updateBreadcrumb(category, algo) {
    const catEl = document.querySelector('.breadcrumb-category');
    const algoEl = document.querySelector('.breadcrumb-algo');
    if (catEl) catEl.textContent = category;
    if (algoEl) algoEl.textContent = algo;
}

/* ---------- Welcome Screen ---------- */

function showWelcome() {
    const canvas = document.getElementById('vis-canvas');
    if (!canvas) return;

    const cardData = [
        { icon: '⇅', title: 'Sorting', count: '6 algorithms', route: '/sorting/bubble-sort' },
        { icon: '🔍', title: 'Searching', count: '2 algorithms', route: '/searching/linear-search' },
        { icon: '◉', title: 'Graph', count: '3 algorithms', route: '/graph/bfs-graph' },
        { icon: '⬡', title: 'Pathfinding', count: '2 algorithms', route: '/pathfinding/a-star' },
        { icon: '☰', title: 'Data Structures', count: '4 structures', route: '/data-structures/stack' },
    ];

    canvas.innerHTML = `
    <div class="welcome-view fade-in">
      <h2>Algorithm Visualizer</h2>
      <p>Explore sorting, searching, graph, pathfinding, and data structure algorithms with interactive step-by-step animations.</p>
      <div class="welcome-cards">
        ${cardData.map((card) => `
          <div class="welcome-card" data-route="${card.route}">
            <div class="welcome-card-icon">${card.icon}</div>
            <div class="welcome-card-title">${card.title}</div>
            <div class="welcome-card-count">${card.count}</div>
          </div>
        `).join('')}
      </div>
    </div>
  `;

    // Wire up welcome card clicks
    canvas.querySelectorAll('.welcome-card').forEach((card) => {
        card.addEventListener('click', () => {
            navigate(card.dataset.route);
        });
    });

    // Clear info + code panels
    const infoContent = document.getElementById('info-content');
    if (infoContent) infoContent.innerHTML = '';
    const codeContent = document.getElementById('code-content');
    if (codeContent) codeContent.innerHTML = '';
}

/* ---------- Init ---------- */

function init() {
    // Apply saved theme
    const savedTheme = getState('theme');
    document.documentElement.setAttribute('data-theme', savedTheme);

    buildSidebar();
    wireControls();
    registerRoutes();
    initRouter();
}

// Go!
init();
