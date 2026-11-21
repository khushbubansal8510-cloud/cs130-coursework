/* ==========================================================================
   Prakash Bansal — Portfolio Scripts
   Vanilla JavaScript, no dependencies.
   ========================================================================== */

/* --------------------------------------------------------------------------
   CONFIG — edit your contact details here; they update the whole page.
   -------------------------------------------------------------------------- */
const CONFIG = {
  email: "hello@prakashbansal.com",             // your email address
  whatsapp: "910000000000",                      // country code + number, digits only (e.g. 919876543210)
  whatsappMessage: "Hi Prakash! I saw your portfolio and would like to discuss a project.",
  instagram: "your-username",                    // Instagram username (without @)
  linkedin: "https://www.linkedin.com/in/your-profile",
  // Optional: a form backend (e.g. "https://formspree.io/f/xxxxxxx").
  // Leave empty to open the visitor's email app with the message pre-filled.
  formEndpoint: "",
};

(() => {
  "use strict";

  const $ = (s, ctx = document) => ctx.querySelector(s);
  const $$ = (s, ctx = document) => [...ctx.querySelectorAll(s)];
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isFinePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  document.documentElement.classList.remove("no-js");

  /* ---------- Apply contact config ---------- */
  function applyConfig() {
    const waUrl = `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(CONFIG.whatsappMessage)}`;
    const links = {
      email: `mailto:${CONFIG.email}`,
      whatsapp: waUrl,
      instagram: `https://instagram.com/${CONFIG.instagram}`,
      linkedin: CONFIG.linkedin,
    };
    $$("[data-link]").forEach((el) => {
      const url = links[el.dataset.link];
      if (url) el.href = url;
    });
    $$('[data-text="email"]').forEach((el) => (el.textContent = CONFIG.email));
    $$('[data-text="instagram"]').forEach((el) => (el.textContent = `@${CONFIG.instagram}`));
    const year = $("#year");
    if (year) year.textContent = new Date().getFullYear();
  }

  /* ---------- Preloader ---------- */
  function initPreloader() {
    const pre = $("#preloader");
    document.body.classList.add("is-loading");
    const hide = () => {
      pre?.classList.add("done");
      document.body.classList.remove("is-loading");
      // Kick off hero reveals right after the loader fades
      setTimeout(() => $$(".hero .reveal").forEach((el) => el.classList.add("in-view")), 150);
    };
    if (document.readyState === "complete") setTimeout(hide, 400);
    else window.addEventListener("load", () => setTimeout(hide, 400));
    setTimeout(hide, 3000); // safety net if some asset is slow
  }

  /* ---------- Header: scrolled state, hide on scroll down, progress bar ---------- */
  function initHeader() {
    const header = $("#header");
    const progress = $("#scrollProgress");
    const toTop = $("#toTop");
    let lastY = window.scrollY;
    let ticking = false;

    const update = () => {
      const y = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      header.classList.toggle("scrolled", y > 30);
      // Hide header when scrolling down past the hero, show when scrolling up
      const menuOpen = $("#navLinks").classList.contains("open");
      header.classList.toggle("hidden", !menuOpen && y > lastY && y > 600);
      progress.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
      toTop.classList.toggle("show", y > 700);
      lastY = y;
      ticking = false;
    };

    window.addEventListener("scroll", () => {
      if (!ticking) { requestAnimationFrame(update); ticking = true; }
    }, { passive: true });
    update();
  }

  /* ---------- Mobile navigation ---------- */
  function initMobileNav() {
    const toggle = $("#navToggle");
    const links = $("#navLinks");
    const setOpen = (open) => {
      links.classList.toggle("open", open);
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      document.body.style.overflow = open ? "hidden" : "";
    };
    toggle.addEventListener("click", () => setOpen(!links.classList.contains("open")));
    $$(".nav__link", links).forEach((a) => a.addEventListener("click", () => setOpen(false)));
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") setOpen(false); });
    window.addEventListener("resize", () => { if (window.innerWidth > 960) setOpen(false); });
  }

  /* ---------- Active nav link on scroll ---------- */
  function initScrollSpy() {
    const navLinks = $$(".nav__link");
    const sections = navLinks.map((a) => $(a.getAttribute("href"))).filter(Boolean);
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          navLinks.forEach((a) => a.classList.toggle("active", a.getAttribute("href") === `#${entry.target.id}`));
        }
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    sections.forEach((s) => observer.observe(s));
  }

  /* ---------- Reveal on scroll (+ stagger within groups) ---------- */
  function initReveal() {
    // Stagger cards that sit side by side in grids
    [".services__grid", ".skills__grid", ".work-grid", ".contact__list", ".hero__content"].forEach((sel) => {
      $$(sel).forEach((group) => {
        $$(":scope > .reveal, :scope > li.reveal", group).forEach((el, i) => el.style.setProperty("--d", `${(i % 6) * 0.08}s`));
      });
    });

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });

    // Hero items are revealed by the preloader instead
    $$(".reveal").filter((el) => !el.closest(".hero")).forEach((el) => observer.observe(el));
  }

  /* ---------- Typed role text ---------- */
  function initTyped() {
    const el = $("#typed");
    if (!el) return;
    const words = ["Graphic Design", "Video Editing", "Motion Graphics", "Brand Identities", "360° & VR Content", "Visual Stories"];
    if (prefersReducedMotion) { el.textContent = words[0]; return; }
    let w = 0, c = words[0].length, deleting = true;
    const tick = () => {
      const word = words[w];
      el.textContent = word.slice(0, c);
      let delay = deleting ? 45 : 90;
      if (deleting) {
        c--;
        if (c < 0) { deleting = false; w = (w + 1) % words.length; c = 0; delay = 300; }
      } else {
        c++;
        if (c > words[w].length) { deleting = true; c = words[w].length; delay = 1800; }
      }
      setTimeout(tick, delay);
    };
    setTimeout(tick, 2600);
  }

  /* ---------- Counters ---------- */
  function initCounters() {
    const counters = $$(".counter");
    const run = (el) => {
      const target = +el.dataset.target;
      if (prefersReducedMotion) { el.textContent = target; return; }
      const start = performance.now();
      const dur = 1600;
      const step = (now) => {
        const p = Math.min((now - start) / dur, 1);
        el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach((e) => { if (e.isIntersecting) { setTimeout(() => run(e.target), 700); obs.unobserve(e.target); } });
    }, { threshold: 0.6 });
    counters.forEach((c) => observer.observe(c));
  }

  /* ---------- Skill bars ----------
     Bars fill fully by default (no invented percentages).
     Add data-level="NN" on a .skill-card to show your own value. */
  function initSkills() {
    const cards = $$(".skill-card");
    cards.forEach((card) => {
      const level = parseInt(card.dataset.level, 10);
      if (!Number.isNaN(level)) {
        card.style.setProperty("--level", `${Math.max(0, Math.min(level, 100))}%`);
        const label = document.createElement("span");
        label.className = "skill-card__level";
        label.textContent = `${level}%`;
        $(".skill-card__body", card).appendChild(label);
      }
    });
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in-view"); obs.unobserve(e.target); } });
    }, { threshold: 0.4 });
    cards.forEach((c) => observer.observe(c));
  }

  /* ---------- Portfolio filter ---------- */
  function initFilter() {
    const buttons = $$(".filter");
    const items = $$(".work");
    buttons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const f = btn.dataset.filter;
        buttons.forEach((b) => { b.classList.toggle("active", b === btn); b.setAttribute("aria-selected", String(b === btn)); });

        // Fade out, swap visibility, fade in
        items.forEach((item) => item.classList.add("is-filtering"));
        setTimeout(() => {
          items.forEach((item) => {
            const show = f === "all" || item.dataset.category === f;
            item.classList.toggle("is-hidden", !show);
            item.classList.add("in-view"); // make sure revealed
          });
          requestAnimationFrame(() => requestAnimationFrame(() => {
            items.forEach((item) => item.classList.remove("is-filtering"));
          }));
        }, 300);
      });
    });
  }

  /* ---------- Lightbox ---------- */
  function initLightbox() {
    const box = $("#lightbox");
    const media = $("#lightboxMedia");
    const title = $("#lightboxTitle");
    const cat = $("#lightboxCat");
    let current = 0;
    let lastFocus = null;

    const visibleItems = () => $$(".work").filter((w) => !w.classList.contains("is-hidden"));

    const render = (item) => {
      media.innerHTML = "";
      if (item.dataset.video) {
        const iframe = document.createElement("iframe");
        iframe.src = item.dataset.video;
        iframe.title = $("h3", item).textContent;
        iframe.allow = "autoplay; encrypted-media; picture-in-picture; fullscreen";
        iframe.allowFullscreen = true;
        media.appendChild(iframe);
      } else {
        const visual = $(".work__media", item).firstElementChild.cloneNode(true);
        media.appendChild(visual);
      }
      title.textContent = $("h3", item).textContent;
      cat.textContent = $(".work__cat", item).textContent;
    };

    const open = (item) => {
      const list = visibleItems();
      current = list.indexOf(item);
      lastFocus = document.activeElement;
      render(item);
      box.hidden = false;
      document.body.style.overflow = "hidden";
      requestAnimationFrame(() => box.classList.add("open"));
      $("#lightboxClose").focus();
    };
    const close = () => {
      box.classList.remove("open");
      document.body.style.overflow = "";
      setTimeout(() => { box.hidden = true; media.innerHTML = ""; }, 400);
      lastFocus?.focus();
    };
    const go = (dir) => {
      const list = visibleItems();
      current = (current + dir + list.length) % list.length;
      render(list[current]);
    };

    $$(".work").forEach((item) => {
      item.addEventListener("click", () => open(item));
      item.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(item); } });
    });
    $("#lightboxClose").addEventListener("click", close);
    $("#lightboxPrev").addEventListener("click", () => go(-1));
    $("#lightboxNext").addEventListener("click", () => go(1));
    box.addEventListener("click", (e) => { if (e.target === box) close(); });
    document.addEventListener("keydown", (e) => {
      if (box.hidden) return;
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    });
  }

  /* ---------- Contact form ---------- */
  function initForm() {
    const form = $("#contactForm");
    const status = $("#formStatus");
    const label = $(".btn__label", form);

    const validators = {
      name: (v) => v.trim().length >= 2 || "Please enter your name.",
      email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) || "Please enter a valid email address.",
      service: (v) => !!v || "Please choose a service.",
      message: (v) => v.trim().length >= 10 || "Please write at least 10 characters.",
    };

    const validateField = (el) => {
      const result = validators[el.name]?.(el.value);
      const field = el.closest(".field");
      const err = $(".field__error", field);
      const ok = result === true;
      field.classList.toggle("invalid", !ok);
      err.textContent = ok ? "" : result;
      return ok;
    };

    $$("input, select, textarea", form).forEach((el) => {
      el.addEventListener("blur", () => validateField(el));
      el.addEventListener("input", () => { if (el.closest(".field").classList.contains("invalid")) validateField(el); });
    });

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const fields = $$("input, select, textarea", form);
      const allValid = fields.map(validateField).every(Boolean);
      if (!allValid) {
        status.className = "form-status error";
        status.textContent = "Please fix the highlighted fields.";
        fields.find((f) => f.closest(".field").classList.contains("invalid"))?.focus();
        return;
      }

      const data = Object.fromEntries(new FormData(form));

      // Option A: send to a form backend (Formspree, Getform, etc.)
      if (CONFIG.formEndpoint) {
        label.textContent = "Sending…";
        try {
          const res = await fetch(CONFIG.formEndpoint, {
            method: "POST",
            headers: { Accept: "application/json", "Content-Type": "application/json" },
            body: JSON.stringify(data),
          });
          if (!res.ok) throw new Error("Request failed");
          status.className = "form-status success";
          status.textContent = "Thank you! Your message has been sent. I'll get back to you soon.";
          form.reset();
        } catch {
          status.className = "form-status error";
          status.textContent = `Something went wrong. Please email me directly at ${CONFIG.email}.`;
        } finally {
          label.textContent = "Send Message";
        }
        return;
      }

      // Option B (default): open the visitor's email app with the message pre-filled
      const subject = `New project enquiry: ${data.service}`;
      const body = `Hi Prakash,\n\n${data.message}\n\n— ${data.name} (${data.email})`;
      window.location.href = `mailto:${CONFIG.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      status.className = "form-status success";
      status.textContent = "Opening your email app… Thank you for reaching out!";
      form.reset();
    });
  }

  /* ---------- Hero canvas: connected particle field ---------- */
  function initCanvas() {
    const canvas = $("#heroCanvas");
    if (!canvas || prefersReducedMotion) return;
    const ctx = canvas.getContext("2d");
    const hero = $(".hero");
    let w, h, particles = [], raf, visible = true;
    const mouse = { x: -9999, y: -9999 };
    const colors = ["255,107,26", "45,140,255", "0,229,255"];

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = hero.offsetWidth; h = hero.offsetHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.min(Math.floor((w * h) / 16000), 90);
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * w, y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.35, vy: (Math.random() - 0.5) * 0.35,
        r: Math.random() * 1.6 + 0.6,
        c: colors[Math.floor(Math.random() * colors.length)],
      }));
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;

        // Gentle repel from the mouse
        const dxm = p.x - mouse.x, dym = p.y - mouse.y;
        const dm = Math.hypot(dxm, dym);
        if (dm < 120) { p.x += dxm / dm; p.y += dym / dm; }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.c},0.8)`;
        ctx.fill();

        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j];
          const dx = p.x - q.x, dy = p.y - q.y;
          const d = dx * dx + dy * dy;
          if (d < 15000) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y);
            ctx.strokeStyle = `rgba(${p.c},${0.14 * (1 - d / 15000)})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }
      raf = requestAnimationFrame(draw);
    };

    // Pause the animation when the hero is off-screen (saves battery)
    new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      cancelAnimationFrame(raf);
      if (visible) raf = requestAnimationFrame(draw);
    }).observe(hero);

    hero.addEventListener("mousemove", (e) => {
      const rect = hero.getBoundingClientRect();
      mouse.x = e.clientX - rect.left; mouse.y = e.clientY - rect.top;
    });
    hero.addEventListener("mouseleave", () => { mouse.x = mouse.y = -9999; });

    let resizeTimer;
    window.addEventListener("resize", () => { clearTimeout(resizeTimer); resizeTimer = setTimeout(resize, 200); });
    resize();
  }

  /* ---------- Desktop-only: custom cursor, magnetic buttons, tilt, spotlight ---------- */
  function initPointerEffects() {
    if (!isFinePointer || prefersReducedMotion) return;

    // Custom cursor
    const cursor = $("#cursor"), dot = $("#cursorDot");
    let cx = 0, cy = 0, tx = 0, ty = 0;
    window.addEventListener("mousemove", (e) => {
      if (!document.body.classList.contains("has-cursor")) { cx = e.clientX; cy = e.clientY; document.body.classList.add("has-cursor"); }
      tx = e.clientX; ty = e.clientY;
      dot.style.transform = `translate3d(${tx}px, ${ty}px, 0)`;
    });
    const loop = () => {
      cx += (tx - cx) * 0.18; cy += (ty - cy) * 0.18;
      cursor.style.transform = `translate3d(${cx}px, ${cy}px, 0)`;
      requestAnimationFrame(loop);
    };
    loop();
    $$("a, button, .work, .filter, input, select, textarea").forEach((el) => {
      el.addEventListener("mouseenter", () => cursor.classList.add("is-hover"));
      el.addEventListener("mouseleave", () => cursor.classList.remove("is-hover"));
    });
    document.addEventListener("mouseleave", () => document.body.classList.remove("has-cursor"));
    document.addEventListener("mouseenter", () => document.body.classList.add("has-cursor"));

    // Magnetic buttons
    $$(".magnetic").forEach((btn) => {
      btn.addEventListener("mousemove", (e) => {
        const r = btn.getBoundingClientRect();
        const x = e.clientX - r.left - r.width / 2;
        const y = e.clientY - r.top - r.height / 2;
        btn.style.transform = `translate(${x * 0.2}px, ${y * 0.3}px)`;
      });
      btn.addEventListener("mouseleave", () => (btn.style.transform = ""));
    });

    // 3D tilt + spotlight position on cards
    $$(".tilt").forEach((card) => {
      card.addEventListener("mousemove", (e) => {
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width;
        const py = (e.clientY - r.top) / r.height;
        const max = card.classList.contains("visual-stack") ? 10 : 6;
        card.style.transform = `perspective(900px) rotateX(${(0.5 - py) * max}deg) rotateY(${(px - 0.5) * max}deg) translateY(-4px)`;
        card.style.setProperty("--mx", `${px * 100}%`);
        card.style.setProperty("--my", `${py * 100}%`);
      });
      card.addEventListener("mouseleave", () => (card.style.transform = ""));
    });

    // The hero visual tilts with the whole hero area
    const stack = $(".visual-stack");
    $(".hero").addEventListener("mousemove", (e) => {
      const px = e.clientX / window.innerWidth - 0.5;
      const py = e.clientY / window.innerHeight - 0.5;
      stack.style.transform = `rotateY(${px * 12}deg) rotateX(${-py * 10}deg)`;
    });
  }

  /* ---------- Timeline progress line ---------- */
  function initTimeline() {
    const timeline = $("#timeline");
    const fill = $("#timelineFill");
    if (!timeline || !fill) return;
    const update = () => {
      const r = timeline.getBoundingClientRect();
      const vh = window.innerHeight;
      const progress = Math.min(Math.max((vh * 0.6 - r.top) / r.height, 0), 1);
      fill.style.height = `${progress * 100}%`;
    };
    window.addEventListener("scroll", () => requestAnimationFrame(update), { passive: true });
    update();
  }

  /* ---------- Init ---------- */
  applyConfig();
  initPreloader();
  initHeader();
  initMobileNav();
  initScrollSpy();
  initReveal();
  initTyped();
  initCounters();
  initSkills();
  initFilter();
  initLightbox();
  initForm();
  initCanvas();
  initPointerEffects();
  initTimeline();
})();
