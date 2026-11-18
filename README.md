# Sanny Sabio — Portfolio (`Carbon & Bone` Edition)

Personal portfolio for **Sanny Sabio** — BS Information Technology student & Full-Stack / Blockchain Developer at Cor Jesu College, Digos City, Philippines.

Combines:
- **`sandrabamboo.com` Dual-Surface Theme & Effects** — Carbon (`#121213`) default surface, Warm Bone (`#ebe9e3`) contrast surface, and Lime (`#bccf3f`) signal accent; CSS `@property` scroll-triggered surface relighting (`[data-relight="contrast"]`), Venetian-blind shutter view transition on theme toggle, `8×8px` lime square cursor point expanding into uppercase lime action badges, sibling row focus dimming, bottom hairline scroll progress track with a `7px` lime indicator point, stepped film grain, and Web Audio tactile UI sound synthesis (`Sound off` / `Sound on`).
- **`vexoo.framer.website` Frosted Bento Hub Hero** — Top editorial meta bar (`Sanny Sabio · Full-Stack & Systems Developer · Digos City • Live GMT+8`) and a 5-region frosted glass bento grid (`About ↗`, `Portfolio ↗` refracting the giant backdrop wordmark, `Contact ↗`, monochrome studio `Portrait` card, 3-icon `Tech Dock`, and `Resume ↗`).
- **`lynard.dev` Editorial Architecture** — Hanging spring-physics draggable Lanyard ID badge (`NO. 001`), word-by-word scroll-scrubbed manifesto, expandable `Show Preview ↓` project drawers with browser mockup + Project Brief (`https://github.com/EDTECH-CJC/Edtech`), infinite skills marquee + 4-column indexed skills matrix, flat-aligned sticky certificates deck (`DOC // 01 OF 05`) + Lightbox, 3-column Experience & Education timeline (`2023 — PRESENT` on BS in Information Technology), world-map Contact composer, and interactive 2-Page Spread Curriculum Vitae modal.

## Content Configuration

All portfolio content lives in a single data module:

- [`src/data/portfolio.js`](./src/data/portfolio.js) — `site`, `about`, `projects`, `skills`, `certificates`, and `timeline`.

## Development

```bash
npm install
npm run dev
```

## Production Build

```bash
npm run build
npm run preview
```
