# Portfolio

Personal portfolio for Sho, a BS Information Technology student at Cor Jesu College (Digos City). A single-page site with an animated hero, a project card grid, an about section, and contact links, built with React and GSAP.

![Portfolio screenshot](docs/screenshot.png)

## Tech stack

- [React 18](https://react.dev) + [Vite](https://vitejs.dev)
- [React Router 6](https://reactrouter.com) — routing, with a 404 page and hash-based section links
- [GSAP](https://gsap.com) + ScrollTrigger — hero entrance timeline and scroll-triggered reveals
- Plain CSS with custom properties, mobile-first

## Project structure

```
src/
  components/   Nav, Hero, About, Projects, ProjectCard, Contact, Footer, Portrait, ScrollManager
  pages/        Home, NotFound
  data/         site.js (name, links) and projects.js (project cards)
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

- **Your details** — edit `src/data/site.js`. Links left empty are hidden automatically.
- **Projects** — edit `src/data/projects.js`. Each entry takes a title, description, tech list, `image`, `github`, and `demo`.
- **Screenshots** — save images in `public/projects/` and set `image: '/projects/your-file.png'`.
- **Photo** — save a portrait as `public/profile.jpg`. An initial is shown until it exists.

## Deployment

The repo includes `vercel.json` and `public/_redirects` so direct visits to any route work on Vercel and Netlify. Import the repository on either platform; the defaults (build command `npm run build`, output directory `dist`) work as-is.
