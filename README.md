# Portfolio

Personal portfolio for Sho, a BS Information Technology student at Cor Jesu College (Digos City). An editorial site with an animated hero, a live local-time clock, a project card grid, a short About section plus a full About page, and contact links, built with React and GSAP.

![Portfolio screenshot](docs/screenshot.png)

## Tech stack

- [React 18](https://react.dev) + [Vite](https://vitejs.dev)
- [React Router 6](https://reactrouter.com) — routes for Home and About, a 404 page, and hash-based section links
- [GSAP](https://gsap.com) + ScrollTrigger — hero entrance timeline and scroll-triggered reveals
- Plain CSS with custom properties, mobile-first
- Fraunces (serif) and Inter (sans) from Google Fonts

## Project structure

```
src/
  components/   Nav, Hero, Clock, About, Projects, ProjectCard, Contact, Footer, Portrait, ScrollManager
  pages/        Home, About, NotFound
  data/         portfolio.js — all personal content in one file
  index.css     design tokens and all styles
```

## Setup

```bash
git clone <this-repo-url>
cd portfolio
npm install
npm run dev
```

Open the URL Vite prints (usually http://localhost:5173).

```bash
npm run build     # production build into dist/
npm run preview   # serve the production build locally
```

## Customizing

- **Everything** — edit `src/data/portfolio.js`. It holds your details, projects, and About content. Links left empty are hidden automatically.
- **Projects** — each entry takes a title, description, tech list, `image`, `github`, and `demo`.
- **Clock** — set `timezone` in `portfolio.js` to change the city time shown in the hero.
- **Screenshots** — save images in `public/projects/` and set `image: '/projects/your-file.png'`.
- **Photo** — save a portrait as `public/profile.jpg`. An initial is shown until it exists.

## Deployment

The repo includes `vercel.json` and `public/_redirects` so direct visits to any route work on Vercel and Netlify. Import the repository on either platform; the defaults (build command `npm run build`, output directory `dist`) work as-is.
