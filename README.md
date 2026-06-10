# 🧪 html-testing

HTML/CSS/JS testing playground — a collection of interactive tools for game dev and general tinkering. No build step, no dependencies to install: every page is a standalone HTML file using React (UMD) + Babel standalone from a CDN.

## Tools

| Page | What's inside |
|---|---|
| `index.html` | Landing page with search/filter over all tools |
| `math.html` | Game math: lerp & easing curves, draggable vector math, projectile motion, steering behaviors, distance functions |
| `perf.html` | Performance calculators: frame budget, VRAM estimator, LOD distances, chunk/grid memory, draw call budget |
| `noise.html` | Perlin noise lab: fBm/ridged presets, color modes, animated Z, PNG export, Godot FastNoiseLite snippet export |
| `colors.html` | Color toolkit: HSV picker, palette generator, WCAG contrast checker, gradient builder, color blender |
| `shaders.html` | Shader math: SDF visualizer, UV patterns, color space converter, shader function grapher, normal map viewer |
| `bitwise.html` | Bitwise playground: binary visualizer, op calculator, bit flags editor with GDScript export, powers of 2, optimization tricks |
| `random.html` | RNG & probability: drop chance calculator, weighted loot table simulator, dice distribution roller |
| `finance.html` | Investment calculator: compound interest with growth chart, yearly/quarterly tables, CSV export |

## Shared UX (`shared.js` / `shared.css`)

Every page gets, with a single `<script src="shared.js">`:

- Animated techno-grid background (respects `prefers-reduced-motion`)
- Navigation bar with active-page highlight
- **Command palette** — `Ctrl+K` / `⌘K` / `/` to fuzzy-jump between tools
- **Double-click any code/formula block to copy it** (with toast confirmation)
- Back-to-top button on long pages
- Toast notifications (`window.htToast('…')` for page scripts to reuse)
- Emoji favicon injection

Some tools (Noise Lab, Finance) also persist your settings to `localStorage`.

## Adding a new page

1. Create `yourpage.html` (copy an existing page as a template — keep `<div id="root">` and `<script src="shared.js">` inside `<body>`).
2. Add it to `NAV_LINKS` in `shared.js` (label + icon + description — the palette picks it up automatically).
3. Add a card to the `pages` array in `index.html`.

## Local Dev

Just open any `.html` file in your browser, or use a local server:

```bash
# Python
python3 -m http.server 8080

# Node
npx serve .
```

> Clipboard features require a secure context (https or localhost).

## GitHub Pages

This repo has GitHub Pages enabled — visit:
**https://erubay.github.io/html-testing/**
