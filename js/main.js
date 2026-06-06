/* =====================================================================
   아이블레스 — 인터랙션
   헤더 스크롤 · 모바일 메뉴 · 탭/서브탭 · 스크롤 리빌 · 카운트업 · 미터
   ===================================================================== */
(() => {
  "use strict";

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- 헤더 스크롤 그림자 ---------- */
  const header = document.getElementById("siteHeader");
  const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 8);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---------- 모바일 메뉴 ---------- */
  const navToggle = document.getElementById("navToggle");
  const mobileNav = document.getElementById("mobileNav");
  if (navToggle && mobileNav) {
    const setOpen = (open) => {
      navToggle.setAttribute("aria-expanded", String(open));
      navToggle.setAttribute("aria-label", open ? "메뉴 닫기" : "메뉴 열기");
      mobileNav.hidden = !open;
    };
    navToggle.addEventListener("click", () =>
      setOpen(navToggle.getAttribute("aria-expanded") !== "true")
    );
    mobileNav.querySelectorAll("a").forEach((a) =>
      a.addEventListener("click", () => setOpen(false))
    );
  }

  /* ---------- 메인 탭 ---------- */
  const tabBtns = document.querySelectorAll(".tab-btn");
  const panels = document.querySelectorAll(".tab-panel");
  tabBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const target = btn.dataset.tab;
      tabBtns.forEach((b) => {
        const active = b === btn;
        b.classList.toggle("is-active", active);
        b.setAttribute("aria-selected", String(active));
      });
      panels.forEach((p) => {
        const active = p.dataset.panel === target;
        p.classList.toggle("is-active", active);
        p.hidden = !active;
      });
      runMeters();
    });
  });

  /* ---------- 레벨링 서브탭 ---------- */
  const subBtns = document.querySelectorAll(".subtab-btn");
  const subPanels = document.querySelectorAll(".subpanel");
  subBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const target = btn.dataset.sub;
      subBtns.forEach((b) => {
        const active = b === btn;
        b.classList.toggle("is-active", active);
        b.setAttribute("aria-selected", String(active));
      });
      subPanels.forEach((p) => {
        const active = p.dataset.subpanel === target;
        p.classList.toggle("is-active", active);
        p.hidden = !active;
      });
    });
  });

  /* ---------- 스크롤 리빌 ---------- */
  const reveals = document.querySelectorAll(".reveal");
  if (prefersReduced || !("IntersectionObserver" in window)) {
    reveals.forEach((el) => el.classList.add("is-visible"));
  } else {
    const io = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          obs.unobserve(entry.target);
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
    );
    reveals.forEach((el) => io.observe(el));
  }

  /* ---------- 4대 영역 미터 ---------- */
  function runMeters() {
    document.querySelectorAll(".tab-panel.is-active .skills-meters").forEach((block) => {
      block.querySelectorAll(".meter").forEach((m) => m.classList.add("run"));
    });
  }
  const skillsBlock = document.querySelector(".skills-meters");
  if (skillsBlock) {
    if (prefersReduced || !("IntersectionObserver" in window)) {
      skillsBlock.querySelectorAll(".meter").forEach((m) => m.classList.add("run"));
    } else {
      const mo = new IntersectionObserver(
        (entries, obs) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.querySelectorAll(".meter").forEach((m) => m.classList.add("run"));
            obs.unobserve(entry.target);
          });
        },
        { threshold: 0.4 }
      );
      mo.observe(skillsBlock);
    }
  }

  /* ---------- 스탯 카운트업 ---------- */
  const counters = document.querySelectorAll(".count");
  const animateCount = (el) => {
    const target = Number(el.dataset.target) || 0;
    const suffix = el.dataset.suffix || "";
    if (prefersReduced) {
      el.textContent = target + suffix;
      return;
    }
    const duration = 1400;
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased) + suffix;
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  if (counters.length) {
    if (!("IntersectionObserver" in window)) {
      counters.forEach(animateCount);
    } else {
      const co = new IntersectionObserver(
        (entries, obs) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            animateCount(entry.target);
            obs.unobserve(entry.target);
          });
        },
        { threshold: 0.6 }
      );
      counters.forEach((c) => co.observe(c));
    }
  }

  /* ---------- 해시(#) 진입 시 해당 탭 활성화 ---------- */
  function activateTabFromHash() {
    const id = (location.hash || "").replace("#", "");
    if (!id) return;
    const btn = document.querySelector('.tab-btn[data-tab="' + id + '"]');
    if (btn && btn.getAttribute("aria-selected") !== "true") btn.click();
  }
  window.addEventListener("hashchange", activateTabFromHash);
  activateTabFromHash();
})();
