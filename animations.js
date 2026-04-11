/* ══════════════════════════════════════════════════════════
   animations.js — Full-panel entrance animations
   ══════════════════════════════════════════════════════════ */

/* ── 1. Animated number counters ─────────────────────────── */
function countUp(el, target, duration, prefix, suffix) {
  duration = duration || 1400;
  prefix = prefix || '';
  suffix = suffix || '';
  const isNeg = target < 0;
  const absTarget = Math.abs(target);
  const str = String(Math.abs(target));
  const decimals = str.includes('.') ? str.split('.')[1].length : 0;
  let start = null;
  function step(ts) {
    if (!start) start = ts;
    const prog = Math.min((ts - start) / duration, 1);
    const eased = 1 - Math.pow(1 - prog, 3);
    const cur = absTarget * eased;
    el.textContent = prefix + (isNeg ? '\u2212' : '') + cur.toFixed(decimals) + suffix;
    if (prog < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

function initCounters() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const target = parseFloat(e.target.dataset.count);
      const prefix = e.target.dataset.prefix || '';
      const suffix = e.target.dataset.suffix || '';
      countUp(e.target, target, 1400, prefix, suffix);
      obs.unobserve(e.target);
    });
  }, { threshold: 0.6 });
  document.querySelectorAll('[data-count]').forEach(el => obs.observe(el));
}

/* ── 2. Full-panel scroll reveals ────────────────────────── */
function initScrollReveal() {
  // Animate whole cards and panels as complete units — no individual text reveals
  const targets = document.querySelectorAll(
    '.card:not(.no-anim), .stat-card, .finding-box, [data-reveal]'
  );

  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const delay = parseInt(e.target.dataset.delay || 0);
      setTimeout(() => e.target.classList.add('panel-visible'), delay);
      obs.unobserve(e.target);
    });
  }, { threshold: 0.06, rootMargin: '0px 0px -24px 0px' });

  targets.forEach(el => {
    el.classList.add('panel-enter');
    obs.observe(el);
  });
}

/* ── 3. Staggered card grids ─────────────────────────────── */
function initStaggered() {
  document.querySelectorAll('[data-stagger]').forEach(parent => {
    const children = Array.from(parent.children);
    const delay = parseInt(parent.dataset.staggerDelay) || 70;
    const obs = new IntersectionObserver(entries => {
      if (!entries[0].isIntersecting) return;
      children.forEach((child, i) => {
        child.classList.add('panel-enter');
        setTimeout(() => child.classList.add('panel-visible'), i * delay);
      });
      obs.unobserve(parent);
    }, { threshold: 0.08 });
    obs.observe(parent);
  });
}

/* ── 4. Stat card row stagger ────────────────────────────── */
function initStatCardStagger() {
  document.querySelectorAll('.stats-row').forEach(row => {
    const cards = Array.from(row.querySelectorAll('.stat-card'));
    const obs = new IntersectionObserver(entries => {
      if (!entries[0].isIntersecting) return;
      cards.forEach((c, i) => {
        c.classList.add('panel-enter');
        setTimeout(() => c.classList.add('panel-visible'), i * 65);
      });
      obs.unobserve(row);
    }, { threshold: 0.1 });
    obs.observe(row);
  });
}

/* ── 5. Section header wipe-in ───────────────────────────── */
function initSectionHeaders() {
  document.querySelectorAll('.section-header').forEach(el => {
    const obs = new IntersectionObserver(entries => {
      if (!entries[0].isIntersecting) return;
      el.classList.add('header-wipe-in');
      obs.unobserve(el);
    }, { threshold: 0.3 });
    obs.observe(el);
  });
}

/* ── 6. Pulsing glow on primary finding ──────────────────── */
function initPrimaryGlow() {
  const els = document.querySelectorAll('.primary-glow');
  els.forEach(el => {
    let growing = true, size = 10;
    setInterval(() => {
      size = growing ? size + 1 : size - 1;
      if (size >= 22) growing = false;
      if (size <= 8)  growing = true;
      el.style.boxShadow = `0 0 ${size}px ${size/2}px rgba(220,38,38,0.35)`;
    }, 60);
  });
}

/* ── 7. Smooth horizontal drag-scroll ────────────────────── */
function initSmoothScroll() {
  document.querySelectorAll('.hm-wrap, [data-hscroll]').forEach(el => {
    let isDown = false, startX, scrollLeft;
    el.addEventListener('mousedown', e => {
      isDown = true; el.style.cursor = 'grabbing';
      startX = e.pageX - el.offsetLeft;
      scrollLeft = el.scrollLeft;
    });
    el.addEventListener('mouseleave', () => { isDown = false; el.style.cursor = 'grab'; });
    el.addEventListener('mouseup',    () => { isDown = false; el.style.cursor = 'grab'; });
    el.addEventListener('mousemove', e => {
      if (!isDown) return;
      e.preventDefault();
      el.scrollLeft = scrollLeft - (e.pageX - el.offsetLeft - startX) * 1.5;
    });
    el.style.cursor = 'grab';
  });
}

/* ── 8. Hero entrance — stagger badges ───────────────────── */
function initHeroEntrance() {
  const badges = document.querySelectorAll('.hero-badges .badge');
  badges.forEach((b, i) => {
    b.style.opacity = '0';
    b.style.transform = 'translateY(12px)';
    b.style.transition = `opacity 0.5s ease ${200 + i * 80}ms, transform 0.5s ease ${200 + i * 80}ms`;
    requestAnimationFrame(() => requestAnimationFrame(() => {
      b.style.opacity = '1';
      b.style.transform = 'translateY(0)';
    }));
  });

  const findingBox = document.querySelector('.finding-box');
  if (findingBox) {
    findingBox.style.opacity = '0';
    findingBox.style.transform = 'translateY(16px)';
    findingBox.style.transition = 'opacity 0.6s ease 600ms, transform 0.6s ease 600ms';
    requestAnimationFrame(() => requestAnimationFrame(() => {
      findingBox.style.opacity = '1';
      findingBox.style.transform = 'translateY(0)';
    }));
  }
}

/* ── 9. CSS injection ─────────────────────────────────────── */
(function injectCSS() {
  const style = document.createElement('style');
  style.textContent = `
    /* ── Panel entrance (full card/section) ── */
    @keyframes panelUp {
      from { opacity:0; transform:translateY(36px) scale(0.97); }
      to   { opacity:1; transform:translateY(0)    scale(1);    }
    }
    @keyframes panelLeft {
      from { opacity:0; transform:translateX(-28px); }
      to   { opacity:1; transform:translateX(0);     }
    }
    @keyframes headerWipe {
      from { opacity:0; transform:translateX(-16px); clip-path:inset(0 100% 0 0); }
      to   { opacity:1; transform:translateX(0);     clip-path:inset(0 0% 0 0);   }
    }
    @keyframes fadeIn  { from{opacity:0;} to{opacity:1;} }
    @keyframes shimmer { 0%{background-position:-200% 0;} 100%{background-position:200% 0;} }
    @keyframes pulse   { 0%,100%{transform:scale(1);} 50%{transform:scale(1.04);} }
    @keyframes twinkle { 0%,100%{opacity:1;} 50%{opacity:0.4;} }

    /* Panel enter/visible */
    .panel-enter {
      opacity: 0;
      transform: translateY(36px) scale(0.97);
      transition: opacity 0.65s cubic-bezier(0.16,1,0.3,1),
                  transform 0.65s cubic-bezier(0.16,1,0.3,1),
                  box-shadow 0.2s;
    }
    .panel-visible {
      opacity: 1 !important;
      transform: translateY(0) scale(1) !important;
    }

    /* Section header wipe */
    .section-header { overflow: hidden; }
    .header-wipe-in h2 {
      animation: panelLeft 0.55s cubic-bezier(0.16,1,0.3,1) both;
    }
    .header-wipe-in p {
      animation: panelLeft 0.55s cubic-bezier(0.16,1,0.3,1) 80ms both;
    }

    /* Primary glow */
    .primary-glow { transition: box-shadow 0.06s; }

    /* Stat cards */
    .stat-card { transition: transform 0.2s, box-shadow 0.2s; }
    .stat-card:hover { transform: translateY(-4px); box-shadow: 0 8px 24px rgba(0,0,0,0.13); }

    /* Cards */
    .card { transition: transform 0.2s, box-shadow 0.2s; }
    .card:hover { box-shadow: 0 6px 20px rgba(0,0,0,0.10); }

    /* Tab styles */
    .viz-tab { padding:.45rem 1rem;border:none;background:none;cursor:pointer;font-size:.85rem;
               font-weight:600;color:#64748b;border-bottom:3px solid transparent;
               margin-bottom:-1px;font-family:inherit;transition:all 0.15s; }
    .viz-tab.active { color:#1d4ed8;border-bottom-color:#1d4ed8; }
    .viz-tab:hover:not(.active) { color:#1e293b;border-bottom-color:#cbd5e1; }

    .story-tab { padding:.38rem .9rem;border:1px solid #e2e8f0;border-radius:20px;
                 background:#fff;cursor:pointer;font-size:.8rem;font-weight:500;
                 color:#64748b;margin:.2rem;transition:all 0.15s; }
    .story-tab.active { background:#1d4ed8;color:#fff;border-color:#1d4ed8; }
    .story-tab:hover:not(.active) { background:#f8fafc;color:#1e293b; }

    /* Leading edge gene chips */
    .le-gene-chip { display:inline-flex;align-items:center;gap:.25rem;padding:.2rem .5rem;
                    border-radius:20px;font-size:.73rem;font-weight:600;margin:.15rem;
                    cursor:pointer;transition:all 0.15s;border:1px solid transparent; }
    .le-gene-chip:hover { transform:scale(1.08);box-shadow:0 2px 8px rgba(0,0,0,0.15); }

    /* Overlap cells */
    .overlap-cell { width:32px;height:28px;border-radius:4px;display:inline-flex;
                    align-items:center;justify-content:center;font-size:.65rem;
                    font-weight:700;cursor:pointer;transition:transform 0.12s; }
    .overlap-cell:hover { transform:scale(1.15);z-index:10;position:relative; }

    /* Tooltip */
    [data-tooltip] { position:relative; }
    [data-tooltip]:hover::after {
      content:attr(data-tooltip);position:absolute;bottom:calc(100% + 6px);
      left:50%;transform:translateX(-50%);background:#1e293b;color:#fff;
      padding:.35rem .65rem;border-radius:6px;font-size:.73rem;white-space:nowrap;
      z-index:1000;pointer-events:none;animation:fadeIn 0.15s ease;
    }

    .waterfall-bar { cursor:pointer;transition:opacity 0.15s; }
    .waterfall-bar:hover { opacity:0.82; }

    .radar-legend-dot { width:12px;height:12px;border-radius:50%;display:inline-block; }

    #ner-network-svg circle { transition:r 0.2s,stroke-width 0.2s; }
    #ner-network-svg circle:hover { stroke-width:3; }
    #ner-network-svg text { pointer-events:none;user-select:none; }
  `;
  document.head.appendChild(style);
})();

/* ── MAIN INIT ────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', function () {
  // Hero badges animate immediately
  initHeroEntrance();

  setTimeout(() => {
    initScrollReveal();
    initStaggered();
    initStatCardStagger();
    initSectionHeaders();
    initPrimaryGlow();
    initCounters();
    initSmoothScroll();
  }, 150);
});
