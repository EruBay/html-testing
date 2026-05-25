// ── Techno grid background + shared nav ──
// Include once per page: <script src="shared.js"></script>
// It auto-injects the grid canvas and nav bar.

(function () {
    // ── Grid config ──
    const GRID = 25;
    const LINE_W = 3;
    const COLOR = 'rgba(102, 126, 234, 0.08)';
    const SPEED_X = 12;
    const SPEED_Y = 8;

    // ── Nav links (add new pages here) ──
    const NAV_LINKS = [
        { label: 'Home', href: 'index.html' },
        { label: 'Finance', href: 'finance.html' },
        { label: 'Game Math', href: 'math.html' },
        { label: 'Perf Tools', href: 'perf.html' },
        { label: 'Noise Lab', href: 'noise.html' },
        { label: 'Colors', href: 'colors.html' },
        { label: 'Shaders', href: 'shaders.html' },
        { label: 'Bitwise', href: 'bitwise.html' },
    ];

    // ── Inject grid canvas ──
    const wrap = document.createElement('div');
    wrap.className = 'grid-bg';
    const canvas = document.createElement('canvas');
    wrap.appendChild(canvas);
    document.body.prepend(wrap);

    // ── Inject nav ──
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
        if (currentPage === link.href) a.className = 'active';
        nav.appendChild(a);
    });

    // Insert nav after grid, before content
    const firstContent = document.getElementById('root') || document.querySelector('main') || document.querySelector('.container');
    if (firstContent) {
        firstContent.parentNode.insertBefore(nav, firstContent);
    } else {
        document.body.appendChild(nav);
    }

    // ── Animate grid ──
    const ctx = canvas.getContext('2d');
    let offsetX = 0, offsetY = 0, last = 0;

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resize);
    resize();

    function draw(ts) {
        const dt = last ? (ts - last) / 1000 : 0;
        last = ts;
        offsetX = (offsetX + SPEED_X * dt) % GRID;
        offsetY = (offsetY + SPEED_Y * dt) % GRID;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = COLOR;
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

        requestAnimationFrame(draw);
    }
    requestAnimationFrame(draw);
})();
