# Prakash Bansal — Creative Portfolio

A premium, fully responsive portfolio website for **Prakash Bansal**, Graphic Designer · Video Editor · Motion Graphics Artist.

Built with plain **HTML, CSS and JavaScript**. There is no build step and nothing to install, so it runs anywhere and deploys straight to GitHub Pages.

## Features

- Dark black and charcoal theme with orange and electric-blue accents, plus glassmorphism
- Animated hero with an interactive particle canvas, glowing orbs, typed role text and counters
- Sections: Home, About, Services, Skills, Portfolio (filterable, with a lightbox), Experience timeline, Contact
- Smooth scrolling, scroll-spy navigation, scroll progress bar, reveal-on-scroll animations
- Custom cursor, magnetic buttons and 3D tilt cards (desktop only)
- Mobile menu, with layouts tuned for desktop, tablet and mobile
- Contact form with validation, plus WhatsApp, Instagram and LinkedIn links
- SEO: meta and Open Graph tags, JSON-LD structured data, `sitemap.xml`, `robots.txt`, custom `404.html`
- Accessibility: skip link, keyboard-friendly lightbox, focus styles and `prefers-reduced-motion` support

## Project structure

```
index.html          ← all page content
css/style.css       ← all styles (with a table of contents at the top)
js/main.js          ← interactions + CONFIG for contact details
assets/img/         ← favicon, social share image, your photo
assets/work/        ← put your portfolio images/videos here
404.html, robots.txt, sitemap.xml, .nojekyll
```

## Customising

| What | Where |
|---|---|
| Email, WhatsApp number, Instagram, LinkedIn | `CONFIG` at the top of `js/main.js` |
| Receive form messages directly | Set `CONFIG.formEndpoint` to a [Formspree](https://formspree.io) form URL. If it is empty, the form opens the visitor's email app. |
| Your photo | Replace the `.portrait__inner` placeholder in the About section with `<img src="assets/img/prakash.jpg" alt="Prakash Bansal">` |
| Portfolio items | In `index.html`, replace each `<div class="work__placeholder …">` with `<img src="assets/work/your-file.jpg" alt="…" loading="lazy">`. Add `data-video="https://www.youtube.com/embed/VIDEO_ID"` to a `.work` item to play a video in the lightbox. |
| Experience timeline | Edit the years, titles and descriptions in the Experience section to match your real roles and clients |
| Skill levels (optional) | Bars are shown full by default, with no made-up percentages. Add `data-level="85"` to a `.skill-card` to show your own value. |

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
