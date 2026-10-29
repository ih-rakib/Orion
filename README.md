# Orion

**A growing atlas of the universe, life, time, and everything we discover.**

Orion is an evolving knowledge platform built to explore the cosmos and the connections between it and our own world. From planets, stars, galaxies, and black holes to Earth's oceans, the history of life, ancient worlds, and the future of science, Orion is designed to keep growing as new questions and discoveries emerge.

This is a long-term project. Its architecture is designed so new subjects can be added over time without rebuilding the website for every topic.

## Vision

- **Explore:** discover subjects across space, Earth, life, history, and science.
- **Connect:** follow relationships between objects, events, ideas, and discoveries through the interactive Knowledge Graph.
- **Understand:** present clear explanations that welcome curious readers.
- **Verify:** make room for sources, references, dates, and scientific uncertainty.
- **Grow:** build a flexible foundation for new categories and experiences.

## Planned areas

- **The Cosmos** — planets, moons, stars, nebulae, galaxies, supernovae, and black holes.
- **Our Solar System** — the Sun, Earth, Mars, Pluto, and the worlds beyond.
- **Earth** — oceans, climate, geology, ecosystems, and the changing planet.
- **Life** — evolution, dinosaurs, whales, biodiversity, and the origins of life.
- **Time & History** — the ancient past, cosmic history, major events, and possible futures.
- **Science & Discovery** — mathematics, evidence, scientific methods, and ideas that expand our understanding.
- **Technology & Engineering** — computing, artificial intelligence, engineering systems, and tools that change what people can do.
- **People & Culture** — human origins, societies, history, language, creativity, and the ways people make meaning.

These are starting points, not limits. Orion is not a space-only website: the same knowledge system is intended to support any worthwhile field, from medicine and economics to philosophy, music, agriculture, sport, and topics that have not been imagined yet.

## Content authoring

Subject records are maintained in [`content/orion-library.json`](content/orion-library.json) and follow a shared content contract. Checks cover unique slugs, registered categories, valid HTTPS references, working related-subject links, and editorial metadata. See [`content/README.md`](content/README.md) for the authoring checklist and [`content/subjects/template.json`](content/subjects/template.json) for a starter record. These checks run in the project validation workflow.

## Technology

- **Next.js and React** for the web application and reusable, dynamic pages.
- **TypeScript** for safer, maintainable code.
- **Tailwind CSS** for a responsive, consistent interface.
- **Supabase / PostgreSQL** when the project is ready for structured content, relationships, and editorial tools.
- **Three.js, React Three Fiber, and Drei** for interactive 3D experiences.
- **GitHub** for source control and **Vercel** for deployment.

Technology choices can evolve as the project's needs become clearer. The priority is a maintainable platform, not complexity for its own sake.

## Current foundation

The initial version includes a responsive homepage with sticky desktop navigation, a mobile navigation menu, a unified global search command palette with instant suggestions across subjects, timeline events, planets, moons, landmarks, and collections (Ctrl/⌘+K or /), plus a homepage search field that queries the same global index, a floating back-to-top control, a dedicated 3D Solar System call-to-action and featured explorer card, a creator profile with professional background and external social/contact links, eight extensible subject categories, a searchable and filterable knowledge library with 20 starter subjects across astronomy, planetary science, climate, biology, human origins, ancient civilizations, mathematics and artificial intelligence, reusable subject detail pages, related-subject navigation, a source-aware subject template, a 15-milestone deep-time timeline with cited further reading, an interactive Solar System explorer, and a WebGL-powered 3D Solar System scene built with Three.js and React Three Fiber. The 2D explorer lets visitors select the Sun, all eight planets, Pluto, or Earth's Moon to see concise descriptions, facts, and NASA reading links. The 3D view lets visitors rotate and zoom the scene, select the Sun and planets, explore 11 individually selectable major moons (including the Moon, Phobos, Deimos, Io, Europa, Ganymede, Callisto, Titan, Enceladus, Titania, and Triton), select six illustrative surface landmarks across Earth and Mars (the Himalayas, Amazon Basin, Grand Canyon, Olympus Mons, Valles Marineris, and Gale Crater), pause/resume illustrative orbital motion, and open related NASA or scientific reading links. Earth, Mars, and Pluto also link to Orion's own subject guides. Both views are educational models—not scale-accurate representations or precision orbital simulations. The 3D model compresses planetary sizes and distances for visibility. The 3D view now loads equirectangular planetary surface maps from Solar System Scope (CC BY 4.0) for Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, Neptune, and Pluto, with procedural maps retained as a fallback if remote textures fail; Earth’s cloud layer and atmospheric halos remain stylized effects. These maps are educational visualizations, not validated datasets for scientific analysis. The site also includes page metadata, a custom favicon, and a custom not-found page. The first subjects are starter content, not a complete encyclopedia. Each starter guide now includes at least one external reference from a scientific agency or museum; these are further-reading starting points, not yet claim-by-claim citations.

Planned future directions include adding more disciplines and deeper topic coverage, claim-level citations, source review dates, richer media, more detailed interactive visualizations, structured content management, scientific data integrations, NASA-derived photographic textures, scientifically accurate cloud maps and atmospheric scattering, more moons, mission and spacecraft views, and contributor tools.

## Run locally

Requirements: Node.js 20.9 or newer.

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Before a production deployment, set `NEXT_PUBLIC_SITE_URL` to the canonical public URL so the generated sitemap uses the correct domain.

## Quality checks

Run the same core checks locally before publishing changes:

```bash
npm run typecheck
npm test
npm run lint
npm run build
```

The content tests check that subject URLs are unique, category URLs resolve, every related-subject link points to an existing entry, and starter pages include the content fields they need. GitHub Actions is configured to run these checks on pushes to `master` and pull requests.

## Guiding principles

1. **Curiosity first.** Make exploration intuitive and enjoyable.
2. **Evidence matters.** Distinguish established knowledge, active research, hypotheses, and speculation.
3. **Connections are valuable.** Related subjects should help readers move naturally through the knowledge library.
4. **Mobile matters.** The experience should work well on phones, tablets, and desktops.
5. **Build for the long term.** Prefer reusable systems and documented decisions over one-off solutions.
6. **Respect the reader.** Keep explanations clear and make sources discoverable.

## Project status

Orion is at its foundation stage. Planned capabilities are not presented as completed features; the README and implementation will evolve alongside the platform.

---

*The universe is vast. Orion is a place to keep exploring it.*
