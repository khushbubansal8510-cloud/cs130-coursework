/* ==========================================================================
   Prakash Bansal — Portfolio Scripts
   Vanilla JavaScript, no dependencies.
   ========================================================================== */

/* --------------------------------------------------------------------------
   CONFIG: edit your contact details here. They update every link on the page.
   -------------------------------------------------------------------------- */
const CONFIG = {
  email: "hello@prakashbansal.com",             // your email address
  whatsapp: "910000000000",                      // country code + number, digits only (e.g. 919876543210)
  whatsappMessage: "Hi Prakash! I saw your portfolio and would like to discuss a project.",
  instagram: "your-username",                    // Instagram username (without @)
  linkedin: "https://www.linkedin.com/in/your-profile",
  // Optional: a form backend (e.g. "https://formspree.io/f/xxxxxxx").
  // When set, "Send via Email" posts the form there instead of opening the visitor's email app.
  formEndpoint: "",
};

(() => {
  "use strict";

  const $ = (s, ctx = document) => ctx.querySelector(s);
  const $$ = (s, ctx = document) => [...ctx.querySelectorAll(s)];
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isFinePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  document.documentElement.classList.remove("no-js");

  /* ---------- Helpers ---------- */
  const digitsOnly = (v) => String(v).replace(/\D/g, "");
  const whatsappUrl = (text) => `https://wa.me/${digitsOnly(CONFIG.whatsapp)}?text=${encodeURIComponent(text)}`;
  const mailtoUrl = (subject = "", body = "") => {
    const params = [];
    if (subject) params.push(`subject=${encodeURIComponent(subject)}`);
    if (body) params.push(`body=${encodeURIComponent(body)}`);
    return `mailto:${CONFIG.email}${params.length ? `?${params.join("&")}` : ""}`;
  };
  // "+91 98765 43210" style for Indian numbers, "+<digits>" otherwise
  const formatPhone = (raw) => {
    const d = digitsOnly(raw);
    return d.length === 12 && d.startsWith("91") ? `+91 ${d.slice(2, 7)} ${d.slice(7)}` : `+${d}`;
  };

  /* ---------- Apply contact config ---------- */
  function applyConfig() {
    const links = {
      email: mailtoUrl(),
      whatsapp: whatsappUrl(CONFIG.whatsappMessage),
      instagram: `https://instagram.com/${CONFIG.instagram}`,
      linkedin: CONFIG.linkedin,
    };
    $$("[data-link]").forEach((el) => {
      const url = links[el.dataset.link];
      if (url) el.href = url;
    });
    $$('[data-text="email"]').forEach((el) => (el.textContent = CONFIG.email));
    $$('[data-text="whatsapp"]').forEach((el) => (el.textContent = formatPhone(CONFIG.whatsapp)));
    $$('[data-text="instagram"]').forEach((el) => (el.textContent = `@${CONFIG.instagram}`));
    const year = $("#year");
    if (year) year.textContent = new Date().getFullYear();

    // Friendly reminder for the site owner while placeholder details are still in place
    if (/^910+$/.test(digitsOnly(CONFIG.whatsapp)) || CONFIG.email.endsWith("prakashbansal.com")) {
      console.info("Portfolio: update CONFIG in js/main.js with your real email and WhatsApp number.");
    }
  }

  /* ---------- Preloader ---------- */
  function initPreloader() {
    const pre = $("#preloader");
    let done = false;
    document.body.classList.add("is-loading");
    const hide = () => {
      if (done) return;
      done = true;
      pre?.classList.add("done");
      document.body.classList.remove("is-loading");
      // Kick off hero reveals right after the loader fades
      setTimeout(() => $$(".hero .reveal").forEach((el) => el.classList.add("in-view")), 150);
    };
    if (document.readyState === "complete") setTimeout(hide, 300);
    else window.addEventListener("load", () => setTimeout(hide, 300));
    setTimeout(hide, 2500); // safety net if a font or asset is slow
  }

  /* ---------- Header: scrolled state, hide on scroll down, progress bar ---------- */
  function initHeader() {
    const header = $("#header");
    const progress = $("#scrollProgress");
    const toTop = $("#toTop");
    const navLinks = $("#navLinks");
    let lastY = window.scrollY;
    let ticking = false;

    const update = () => {
      const y = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      header.classList.toggle("scrolled", y > 30);
      // Hide header when scrolling down past the hero, show when scrolling up
      const keepVisible = navLinks.classList.contains("open") || header.contains(document.activeElement);
      header.classList.toggle("hidden", !keepVisible && y > lastY && y > 600);
      progress.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
      toTop.classList.toggle("show", y > 700);
      lastY = y;
      ticking = false;
    };

    window.addEventListener("scroll", () => {
      if (!ticking) { requestAnimationFrame(update); ticking = true; }
    }, { passive: true });
    // Keyboard users tabbing into the header should always see it
    header.addEventListener("focusin", () => header.classList.remove("hidden"));
    update();
  }

  /* ---------- Mobile navigation ---------- */
  function initMobileNav() {
    const toggle = $("#navToggle");
    const links = $("#navLinks");
    const isOpen = () => links.classList.contains("open");
    const setOpen = (open, returnFocus = false) => {
      links.classList.toggle("open", open);
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      document.body.style.overflow = open ? "hidden" : "";
      if (open) setTimeout(() => $(".nav__link", links).focus(), 60);
      else if (returnFocus) toggle.focus();
    };
    toggle.addEventListener("click", () => setOpen(!isOpen()));
    $$(".nav__link", links).forEach((a) => a.addEventListener("click", () => setOpen(false)));
    document.addEventListener("keydown", (e) => {
      if (!isOpen()) return;
      if (e.key === "Escape") setOpen(false, true);
      // Keep Tab focus inside the open menu (links + close button)
      if (e.key === "Tab") {
        const items = [toggle, ...$$(".nav__link", links)];
        const i = items.indexOf(document.activeElement);
        if (e.shiftKey && i <= 0) { e.preventDefault(); items[items.length - 1].focus(); }
        else if (!e.shiftKey && i === items.length - 1) { e.preventDefault(); items[0].focus(); }
      }
    });
    window.addEventListener("resize", () => { if (window.innerWidth > 960 && isOpen()) setOpen(false); });
  }

  /* ---------- Active nav link on scroll ---------- */
  function initScrollSpy() {
    const navLinks = $$(".nav__link");
    const sections = navLinks.map((a) => $(a.getAttribute("href"))).filter(Boolean);
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navLinks.forEach((a) => {
          const active = a.getAttribute("href") === `#${entry.target.id}`;
          a.classList.toggle("active", active);
          if (active) a.setAttribute("aria-current", "true");
          else a.removeAttribute("aria-current");
        });
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    sections.forEach((s) => observer.observe(s));
  }

  /* ---------- Reveal on scroll (+ stagger within groups) ---------- */
  function initReveal() {
    // Stagger items that sit side by side
    [".services__grid", ".toolkit", ".project-grid", ".contact__list", ".specialties",
     ".expertise__grid", ".process__steps", ".exp-summary", ".hero__content"].forEach((sel) => {
      $$(sel).forEach((group) => {
        $$(":scope > .reveal", group).forEach((el, i) => el.style.setProperty("--d", `${(i % 3) * 0.08}s`));
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

  /* ---------- Typed role text (decorative; screen readers get a static sentence) ---------- */
  function initTyped() {
    const el = $("#typed");
    if (!el) return;
    const words = ["Graphic Design", "Video Editing", "Motion Graphics", "Brand Identities", "360° & VR Content", "Visual Stories"];
    if (prefersReducedMotion) { el.textContent = words[0]; return; }
    let w = 0, c = words[0].length, deleting = true;
    const tick = () => {
      el.textContent = words[w].slice(0, c);
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
    $$(".counter").forEach((c) => observer.observe(c));
  }

  /* ---------- Skill bars ----------
     Bars fill completely when the group scrolls into view (no invented percentages).
     Add data-level="NN" to a .tool to show your own value. */
  function initSkills() {
    $$(".tool").forEach((tool) => {
      const level = parseInt(tool.dataset.level, 10);
      if (Number.isNaN(level)) return;
      const clamped = Math.max(0, Math.min(level, 100));
      tool.style.setProperty("--level", `${clamped}%`);
      const label = document.createElement("span");
      label.className = "tool__level";
      label.textContent = `${clamped}%`;
      $(".tool__info h4", tool).appendChild(label);
    });
  }

  /* ---------- Portfolio filter ---------- */
  function initFilter() {
    const buttons = $$(".filter");
    const items = $$(".project");
    const status = $("#filterStatus");

    // Show how many projects each category has
    buttons.forEach((btn) => {
      const f = btn.dataset.filter;
      const n = f === "all" ? items.length : items.filter((i) => i.dataset.category === f).length;
      const count = $(".filter__count", btn);
      if (count) { count.textContent = n; count.setAttribute("aria-hidden", "true"); }
      btn.setAttribute("aria-label", `${btn.firstChild.textContent.trim()} (${n} projects)`);
    });

    buttons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const f = btn.dataset.filter;
        buttons.forEach((b) => { b.classList.toggle("active", b === btn); b.setAttribute("aria-pressed", String(b === btn)); });

        const apply = () => {
          let shown = 0;
          items.forEach((item) => {
            const show = f === "all" || item.dataset.category === f;
            item.classList.toggle("is-hidden", !show);
            item.classList.add("in-view"); // make sure newly shown cards are revealed
            if (show) shown++;
          });
          status.textContent = `Showing ${shown} ${shown === 1 ? "project" : "projects"}.`;
        };

        if (prefersReducedMotion) { apply(); return; }
        // Fade out, swap visibility, fade back in
        items.forEach((item) => item.classList.add("is-filtering"));
        setTimeout(() => {
          apply();
          requestAnimationFrame(() => requestAnimationFrame(() => items.forEach((item) => item.classList.remove("is-filtering"))));
        }, 250);
      });
    });
  }

  /* ---------- Lightbox ---------- */
  function initLightbox() {
    const box = $("#lightbox");
    const media = $("#lightboxMedia");
    const els = {
      title: $("#lightboxTitle"), cat: $("#lightboxCat"), desc: $("#lightboxDesc"),
      tools: $("#lightboxTools"), counter: $("#lightboxCounter"),
    };
    const closeBtn = $("#lightboxClose");
    let list = [];
    let current = 0;
    let lastFocus = null;

    const visibleItems = () => $$(".project").filter((p) => !p.classList.contains("is-hidden"));

    const render = () => {
      const item = list[current];
      media.innerHTML = "";
      media.classList.toggle("lightbox__media--video", !!item.dataset.video);
      if (item.dataset.video) {
        const iframe = document.createElement("iframe");
        iframe.src = item.dataset.video;
        iframe.title = $(".project__title", item).textContent;
        iframe.allow = "autoplay; encrypted-media; picture-in-picture; fullscreen";
        iframe.allowFullscreen = true;
        media.appendChild(iframe);
      } else {
        const img = $("img", item).cloneNode();
        img.loading = "eager";
        media.appendChild(img);
      }
      els.title.textContent = $(".project__title", item).textContent;
      els.cat.textContent = $(".project__cat", item).textContent;
      els.desc.textContent = $(".project__desc", item).textContent;
      els.tools.innerHTML = $(".project__tools", item).innerHTML;
      els.counter.textContent = `${current + 1} / ${list.length}`;
    };

    const open = (item) => {
      list = visibleItems();
      current = Math.max(0, list.indexOf(item));
      lastFocus = document.activeElement;
      render();
      box.hidden = false;
      document.body.style.overflow = "hidden";
      requestAnimationFrame(() => box.classList.add("open"));
      closeBtn.focus();
    };
    const close = () => {
      box.classList.remove("open");
      document.body.style.overflow = "";
      setTimeout(() => { box.hidden = true; media.innerHTML = ""; }, 350);
      lastFocus?.focus();
    };
    const go = (dir) => {
      current = (current + dir + list.length) % list.length;
      render();
    };

    $$(".project__media").forEach((btn) => btn.addEventListener("click", () => open(btn.closest(".project"))));
    closeBtn.addEventListener("click", close);
    $("#lightboxPrev").addEventListener("click", () => go(-1));
    $("#lightboxNext").addEventListener("click", () => go(1));
    box.addEventListener("click", (e) => { if (e.target === box) close(); });
    document.addEventListener("keydown", (e) => {
      if (box.hidden) return;
      if (e.key === "Escape") close();
      else if (e.key === "ArrowRight") go(1);
      else if (e.key === "ArrowLeft") go(-1);
      else if (e.key === "Tab") {
        // Focus trap: keep keyboard focus inside the dialog
        const focusables = $$("button, iframe, a[href]", box).filter((el) => el.offsetParent !== null);
        const first = focusables[0], last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });
  }

  /* ---------- Copy email to clipboard ---------- */
  function initCopyEmail() {
    const btn = $("#copyEmail");
    if (!btn) return;
    const label = $(".copy-btn__label", btn);
    btn.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(CONFIG.email);
      } catch {
        // Fallback for older browsers / non-secure contexts
        const t = document.createElement("textarea");
        t.value = CONFIG.email; t.setAttribute("readonly", ""); t.style.position = "fixed"; t.style.opacity = "0";
        document.body.appendChild(t); t.select(); document.execCommand("copy"); t.remove();
      }
      btn.classList.add("copied");
      label.textContent = "Copied!";
      btn.setAttribute("aria-label", "Email address copied");
      setTimeout(() => { btn.classList.remove("copied"); label.textContent = "Copy"; btn.setAttribute("aria-label", "Copy email address"); }, 2000);
    });
  }

  /* ---------- Contact form ----------
     Two submit buttons: WhatsApp (opens a pre-filled chat) and Email
     (opens the visitor's email app, or posts to CONFIG.formEndpoint if set). */
  function initForm() {
    const form = $("#contactForm");
    const status = $("#formStatus");

    const validators = {
      name: (v) => v.trim().length >= 2 || "Please enter your name.",
      email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) || "Please enter a valid email address.",
      service: (v) => !!v || "Please choose a service.",
      message: (v) => v.trim().length >= 10 || "Please write at least 10 characters.",
    };
    const fields = $$("input, select, textarea", form);

    const validateField = (el) => {
      const result = validators[el.name]?.(el.value);
      const field = el.closest(".field");
      const ok = result === true;
      field.classList.toggle("invalid", !ok);
      el.setAttribute("aria-invalid", String(!ok));
      $(".field__error", field).textContent = ok ? "" : result;
      return ok;
    };

    fields.forEach((el) => {
      el.addEventListener("blur", () => { if (el.value) validateField(el); });
      el.addEventListener("input", () => { if (el.closest(".field").classList.contains("invalid")) validateField(el); });
      el.addEventListener("change", () => { if (el.tagName === "SELECT") validateField(el); });
    });

    const setStatus = (type, text) => { status.className = `form-status ${type}`; status.textContent = text; };

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const via = e.submitter?.value || "email";
      const allValid = fields.map(validateField).every(Boolean);
      if (!allValid) {
        setStatus("error", "Please fix the highlighted fields.");
        fields.find((f) => f.getAttribute("aria-invalid") === "true")?.focus();
        return;
      }

      const data = Object.fromEntries(new FormData(form));
      const summary = `Hi Prakash,\n\n${data.message.trim()}\n\nService: ${data.service}\nName: ${data.name.trim()}\nEmail: ${data.email.trim()}`;

      if (via === "whatsapp") {
        window.open(whatsappUrl(summary), "_blank", "noopener");
        setStatus("success", "Opening WhatsApp with your message. Just press send!");
        form.reset();
        return;
      }

      if (CONFIG.formEndpoint) {
        const btn = e.submitter;
        const label = btn && $(".btn__label", btn);
        if (label) label.textContent = "Sending…";
        if (btn) btn.disabled = true;
        try {
          const res = await fetch(CONFIG.formEndpoint, {
            method: "POST",
            headers: { Accept: "application/json", "Content-Type": "application/json" },
            body: JSON.stringify(data),
          });
          if (!res.ok) throw new Error("Request failed");
          setStatus("success", "Thank you! Your message has been sent. I'll get back to you soon.");
          form.reset();
        } catch {
          setStatus("error", `Something went wrong. Please email me directly at ${CONFIG.email}.`);
        } finally {
          if (label) label.textContent = "Send via Email";
          if (btn) btn.disabled = false;
        }
        return;
      }

      window.location.href = mailtoUrl(`New project enquiry: ${data.service}`, summary);
      setStatus("success", "Opening your email app with the message ready to send. Thank you!");
      form.reset();
    });
  }

  /* ---------- Hero canvas: connected particle field ---------- */
  function initCanvas() {
    const canvas = $("#heroCanvas");
    if (!canvas || prefersReducedMotion) return;
    const ctx = canvas.getContext("2d");
    const hero = $(".hero");
    let w, h, particles = [], raf = 0, inView = true;
    const mouse = { x: -9999, y: -9999 };
    const colors = ["255,107,26", "45,140,255", "0,229,255"];

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = hero.offsetWidth; h = hero.offsetHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.min(Math.floor((w * h) / (w < 640 ? 22000 : 16000)), 90);
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
        if (dm < 120 && dm > 0) { p.x += dxm / dm; p.y += dym / dm; }

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

    // Only animate while the hero is on screen and the tab is visible (saves battery)
    const sync = () => {
      cancelAnimationFrame(raf);
      if (inView && !document.hidden) raf = requestAnimationFrame(draw);
    };
    new IntersectionObserver(([entry]) => { inView = entry.isIntersecting; sync(); }).observe(hero);
    document.addEventListener("visibilitychange", sync);

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

    // Custom cursor (shown after the first mouse move)
    const cursor = $("#cursor"), dot = $("#cursorDot");
    let cx = 0, cy = 0, tx = 0, ty = 0;
    window.addEventListener("mousemove", (e) => {
      if (!document.body.classList.contains("has-cursor")) { cx = e.clientX; cy = e.clientY; document.body.classList.add("has-cursor"); }
      tx = e.clientX; ty = e.clientY;
      dot.style.transform = `translate3d(${tx}px, ${ty}px, 0)`;
    }, { passive: true });
    const loop = () => {
      cx += (tx - cx) * 0.18; cy += (ty - cy) * 0.18;
      cursor.style.transform = `translate3d(${cx}px, ${cy}px, 0)`;
      requestAnimationFrame(loop);
    };
    loop();
    // One delegated listener instead of one per element
    const interactive = "a, button, input, select, textarea, label";
    document.addEventListener("mouseover", (e) => cursor.classList.toggle("is-hover", !!e.target.closest(interactive)));
    document.addEventListener("mouseleave", () => document.body.classList.remove("has-cursor"));

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

    // 3D tilt + spotlight position on service cards
    $$(".tilt").forEach((card) => {
      card.addEventListener("mousemove", (e) => {
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width;
        const py = (e.clientY - r.top) / r.height;
        card.style.transform = `perspective(900px) rotateX(${(0.5 - py) * 6}deg) rotateY(${(px - 0.5) * 6}deg) translateY(-4px)`;
        card.style.setProperty("--mx", `${px * 100}%`);
        card.style.setProperty("--my", `${py * 100}%`);
      });
      card.addEventListener("mouseleave", () => (card.style.transform = ""));
    });

    // The hero visual tilts with the mouse across the hero
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
    let ticking = false;
    const update = () => {
      const r = timeline.getBoundingClientRect();
      const progress = Math.min(Math.max((window.innerHeight * 0.6 - r.top) / r.height, 0), 1);
      fill.style.height = `${progress * 100}%`;
      ticking = false;
    };
    window.addEventListener("scroll", () => { if (!ticking) { requestAnimationFrame(update); ticking = true; } }, { passive: true });
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
  initCopyEmail();
  initForm();
  initCanvas();
  initPointerEffects();
  initTimeline();
})();
