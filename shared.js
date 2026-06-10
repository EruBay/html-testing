// ── Shared page chrome: techno grid background, nav, command palette,
//    toasts, back-to-top, copy helpers ──
// Include once per page: <script src="shared.js"></script>
// Safe to include in <head> or <body> — it waits for the DOM when needed.

(function () {
    'use strict';

    // ── Grid config ──
    const GRID = 25;
    const LINE_W = 3;
    const GRID_COLOR = 'rgba(102, 126, 234, 0.08)';
    const SPEED_X = 12;
    const SPEED_Y = 8;

    // ── Nav links (add new pages here — palette picks them up too) ──
    const NAV_LINKS = [
        { icon: '🏠', label: 'Home', href: 'index.html', desc: 'Landing page & tool directory' },
        { icon: '💰', label: 'Finance', href: 'finance.html', desc: 'Compound interest & investment growth' },
        { icon: '📐', label: 'Game Math', href: 'math.html', desc: 'Lerp, vectors, projectiles, steering' },
        { icon: '⚙️', label: 'Perf Tools', href: 'perf.html', desc: 'Frame budget, VRAM, LOD, chunks' },
        { icon: '🌊', label: 'Noise Lab', href: 'noise.html', desc: 'Perlin noise playground & export' },
        { icon: '🎨', label: 'Colors', href: 'colors.html', desc: 'Picker, palettes, contrast, gradients' },
        { icon: '✨', label: 'Shaders', href: 'shaders.html', desc: 'SDF, UV patterns, GLSL reference' },
        { icon: '🔢', label: 'Bitwise', href: 'bitwise.html', desc: 'Bit flags, masks & binary tricks' },
        { icon: '🎲', label: 'Random', href: 'random.html', desc: 'Drop chance, loot tables, dice math' },
    ];

    const reduceMotion = window.matchMedia
        && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // ── Favicon (emoji, no extra file needed) ──
    function injectFavicon() {
        if (document.querySelector('link[rel~="icon"]')) return;
        const link = document.createElement('link');
        link.rel = 'icon';
        link.href = 'data:image/svg+xml,' + encodeURIComponent(
            '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">🧪</text></svg>'
        );
        document.head.appendChild(link);
    }

    // ── Grid canvas ──
    function injectGrid() {
        const wrap = document.createElement('div');
        wrap.className = 'grid-bg';
        const canvas = document.createElement('canvas');
        wrap.appendChild(canvas);
        document.body.prepend(wrap);
        return canvas;
    }

    function startGrid(canvas) {
        const ctx = canvas.getContext('2d');
        let offsetX = 0, offsetY = 0, last = 0;

        function resize() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }

        function drawFrame() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.strokeStyle = GRID_COLOR;
            ctx.lineWidth = LINE_W;
            for (let x = -GRID + offsetX; x <= canvas.width + GRID; x += GRID) {
                ctx.beginPath();
                ctx.moveTo(x, 0);
                ctx.lineTo(x, canvas.height);
                ctx.stroke();
            }
            for (let y = -GRID + offsetY; y <= canvas.height + GRID; y += GRID) {
                ctx.beginPath();
                ctx.moveTo(0, y);
                ctx.lineTo(canvas.width, y);
                ctx.stroke();
            }
        }

        window.addEventListener('resize', () => { resize(); if (reduceMotion) drawFrame(); });
        resize();

        if (reduceMotion) {
            drawFrame();
            return;
        }

        function tick(ts) {
            const dt = last ? (ts - last) / 1000 : 0;
            last = ts;
            offsetX = (offsetX + SPEED_X * dt) % GRID;
            offsetY = (offsetY + SPEED_Y * dt) % GRID;
            drawFrame();
            requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
    }

    // ── Nav bar ──
    function injectNav() {
        const nav = document.createElement('nav');
        const logo = document.createElement('span');
        logo.className = 'logo';
        logo.textContent = '🧪 HTML Testing';
        nav.appendChild(logo);

        const currentPage = location.pathname.split('/').pop() || 'index.html';
        NAV_LINKS.forEach(link => {
            const a = document.createElement('a');
            a.href = link.href;
            a.textContent = link.label;
            if (currentPage === link.href) {
                a.className = 'active';
                a.setAttribute('aria-current', 'page');
            }
            nav.appendChild(a);
        });

        const kbd = document.createElement('button');
        kbd.id = 'ht-nav-kbd';
        kbd.type = 'button';
        kbd.title = 'Quick switch (Ctrl+K or /)';
        kbd.textContent = /Mac|iPhone|iPad/.test(navigator.platform || '') ? '⌘ K' : 'Ctrl K';
        kbd.addEventListener('click', () => window.htOpenPalette && window.htOpenPalette());
        nav.appendChild(kbd);

        // Insert nav before page content
        const firstContent = document.getElementById('root')
            || document.getElementById('app')
            || document.querySelector('main')
            || document.querySelector('.container');
        if (firstContent) {
            firstContent.parentNode.insertBefore(nav, firstContent);
        } else {
            document.body.appendChild(nav);
        }
    }

    // ── Toast (global helper: window.htToast('message')) ──
    function setupToast() {
        let el = null, timer = null;
        window.htToast = function (msg) {
            if (!el) {
                el = document.createElement('div');
                el.id = 'ht-toast';
                el.setAttribute('role', 'status');
                document.body.appendChild(el);
            }
            el.textContent = msg;
            // restart transition even for back-to-back toasts
            el.classList.remove('show');
            void el.offsetWidth;
            el.classList.add('show');
            clearTimeout(timer);
            timer = setTimeout(() => el.classList.remove('show'), 1800);
        };
    }

    // ── Back to top ──
    function setupTopButton() {
        const btn = document.createElement('button');
        btn.id = 'ht-top-btn';
        btn.type = 'button';
        btn.textContent = '↑';
        btn.title = 'Back to top';
        btn.setAttribute('aria-label', 'Back to top');
        btn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
        });
        document.body.appendChild(btn);
        const onScroll = () => btn.classList.toggle('visible', window.scrollY > 400);
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
    }

    // ── Double-click any code/formula block to copy it ──
    function setupCopy() {
        document.addEventListener('dblclick', (e) => {
            if (!e.target || !e.target.closest) return;
            if (e.target.closest('button, input, a, select, textarea')) return;
            const block = e.target.closest('.formula-box, .code-block, .trick-code');
            if (!block) return;
            const text = (block.innerText || '').trim();
            if (!text || !navigator.clipboard) return;
            navigator.clipboard.writeText(text)
                .then(() => window.htToast('📋 Copied code to clipboard'))
                .catch(() => {});
        });
    }

    // ── Command palette (Ctrl+K / Cmd+K / "/") ──
    function setupPalette() {
        let overlay = null, input = null, list = null;
        let filtered = NAV_LINKS, active = 0;

        function build() {
            overlay = document.createElement('div');
            overlay.id = 'ht-palette';
            overlay.innerHTML =
                '<div id="ht-palette-box">' +
                '<input id="ht-palette-input" type="text" placeholder="Jump to a tool…" autocomplete="off" spellcheck="false">' +
                '<div id="ht-palette-list"></div>' +
                '<div id="ht-palette-foot"><span><b>↑↓</b> navigate</span><span><b>↵</b> open</span><span><b>esc</b> close</span></div>' +
                '</div>';
            document.body.appendChild(overlay);
            input = overlay.querySelector('#ht-palette-input');
            list = overlay.querySelector('#ht-palette-list');

            overlay.addEventListener('mousedown', (e) => { if (e.target === overlay) close(); });
            input.addEventListener('input', () => render(input.value));
            input.addEventListener('keydown', (e) => {
                if (e.key === 'ArrowDown') { e.preventDefault(); move(1); }
                else if (e.key === 'ArrowUp') { e.preventDefault(); move(-1); }
                else if (e.key === 'Enter') { if (filtered[active]) location.href = filtered[active].href; }
                else if (e.key === 'Escape') { close(); }
            });
        }

        function render(query) {
            const q = (query || '').trim().toLowerCase();
            filtered = NAV_LINKS.filter(l => !q || (l.label + ' ' + l.desc).toLowerCase().includes(q));
            active = 0;
            list.innerHTML = '';
            if (!filtered.length) {
                const empty = document.createElement('div');
                empty.className = 'ht-palette-empty';
                empty.textContent = 'No matching tools';
                list.appendChild(empty);
                return;
            }
            filtered.forEach((l, i) => {
                const item = document.createElement('div');
                item.className = 'ht-palette-item' + (i === active ? ' active' : '');
                const icon = document.createElement('span');
                icon.className = 'pi-icon';
                icon.textContent = l.icon;
                const text = document.createElement('span');
                const label = document.createElement('div');
                label.className = 'pi-label';
                label.textContent = l.label;
                const desc = document.createElement('div');
                desc.className = 'pi-desc';
                desc.textContent = l.desc;
                text.appendChild(label);
                text.appendChild(desc);
                item.appendChild(icon);
                item.appendChild(text);
                item.addEventListener('click', () => { location.href = l.href; });
                item.addEventListener('mousemove', () => {
                    if (active !== i) { active = i; highlight(); }
                });
                list.appendChild(item);
            });
        }

        function highlight() {
            Array.from(list.children).forEach((el, i) => el.classList.toggle('active', i === active));
            const el = list.children[active];
            if (el && el.scrollIntoView) el.scrollIntoView({ block: 'nearest' });
        }

        function move(dir) {
            if (!filtered.length) return;
            active = (active + dir + filtered.length) % filtered.length;
            highlight();
        }

        function open() {
            if (!overlay) build();
            overlay.classList.add('open');
            input.value = '';
            render('');
            setTimeout(() => input.focus(), 0);
        }

        function close() {
            if (overlay) { overlay.classList.remove('open'); input.blur(); }
        }

        function isOpen() {
            return !!overlay && overlay.classList.contains('open');
        }

        const isTyping = (el) => el && (
            el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' ||
            el.tagName === 'SELECT' || el.isContentEditable
        );

        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && (e.key === 'k' || e.key === 'K')) {
                e.preventDefault();
                if (isOpen()) close(); else open();
            } else if (e.key === '/' && !isOpen() && !isTyping(e.target)) {
                e.preventDefault();
                open();
            } else if (e.key === 'Escape' && isOpen()) {
                close();
            }
        });

        window.htOpenPalette = open;
    }

    function init() {
        injectFavicon();
        const canvas = injectGrid();
        injectNav();
        setupToast();
        setupTopButton();
        setupCopy();
        setupPalette();
        startGrid(canvas);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
