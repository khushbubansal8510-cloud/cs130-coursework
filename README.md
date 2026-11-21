# Prakash Bansal — Creative Portfolio

A premium, fully responsive portfolio website for **Prakash Bansal**, Graphic Designer · Video Editor · Motion Graphics Artist.

Built with plain **HTML, CSS and JavaScript**. There is no build step and nothing to install, so it runs anywhere and deploys straight to GitHub Pages.

## Features

- Dark black and charcoal theme with orange and electric-blue accents, plus glassmorphism
- Animated hero with an interactive particle canvas, glowing orbs, typed role text and counters
- **About** with a professional introduction and four specialisation cards (Branding, Visual Storytelling, 360° Video Editing, VR Content Creation)
- **Services** with six service cards and a 4-step "How I work" process
- **Skills** with the 10 tools grouped into Design / Video & Motion / Immersive & AI, plus nine creative expertise tiles
- **Portfolio** with 15 project cards in five categories (Graphic Design, Video Editing, Motion Graphics, Branding, VR / 360°), filter buttons with counts, and a preview popup with keyboard navigation
- **Experience** summary plus a timeline with key responsibilities for each stage
- **Contact** with WhatsApp and email buttons, copy-email, and a validated form that sends via WhatsApp or email
- SEO: meta and Open Graph tags, JSON-LD structured data, `sitemap.xml`, `robots.txt`, custom `404.html`
- Accessibility: no automated (axe-core) WCAG 2 AA violations, keyboard focus traps in the menu and preview popup, screen-reader labels, and `prefers-reduced-motion` support

## Project structure

```
index.html          ← all page content
css/style.css       ← all styles (with a table of contents at the top)
js/main.js          ← interactions + CONFIG for contact details
assets/img/         ← favicon, social share image, your photo
assets/work/        ← portfolio images (graphic-01.svg … vr-03.svg placeholders)
404.html, robots.txt, sitemap.xml, .nojekyll
```

## Customising

| What | Where |
|---|---|
| Email, WhatsApp number, Instagram, LinkedIn | `CONFIG` at the top of `js/main.js`. Every link and button on the page updates from it. |
| Receive form messages directly | Set `CONFIG.formEndpoint` to a [Formspree](https://formspree.io) form URL. If it is empty, "Send via Email" opens the visitor's email app. "Send via WhatsApp" always opens a pre-filled WhatsApp chat. |
| Your photo | Replace the `.portrait__inner` placeholder in the About section with `<img src="assets/img/prakash.jpg" alt="Prakash Bansal">` |
| Portfolio images | Put your image in `assets/work/` and change the `src` of the matching card (e.g. `graphic-01.svg` → `graphic-01.jpg`). Also update its `alt`, title, description and tools. A 4:3 image (e.g. 1200×900) fits best. |
| Portfolio videos | Add `data-video="https://www.youtube.com/embed/VIDEO_ID"` to a `<article class="project">` to play it in the preview popup |
| Experience timeline | Edit the years, titles and points in the Experience section to match your real roles and clients |
| Skill levels (optional) | Bars are shown full by default, with no made-up percentages. Add `data-level="85"` to a `<li class="tool">` to show your own value. |

## Preview locally

Double-click `index.html` to open it in your browser, or run a small local server from this folder:

```bash
python3 -m http.server 8000
```

Then open <http://localhost:8000>.

## Publish with GitHub Pages

1. Merge this work into your default branch (`main`).
2. On GitHub, open the repository and go to **Settings → Pages**.
3. Under **Build and deployment**, set **Source** to **Deploy from a branch**, pick the `main` branch and the `/ (root)` folder, then click **Save**.
4. After a minute or two the site is live at
   `https://khushbubansal8510-cloud.github.io/cs130-coursework/`

If you later use a custom domain or a different repository name, update the URLs in `index.html` (canonical and `og:url`), `sitemap.xml` and `robots.txt`.
