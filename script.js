const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.14 }
);

document.querySelectorAll("[data-reveal]").forEach((item) => revealObserver.observe(item));

const officialScore = document.querySelector(".official-score-card strong[data-count-target]");
const officialSection = document.querySelector(".official-section");

if (officialScore && officialSection && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const target = Number(officialScore.dataset.countTarget || 100);
  const duration = 720;

  const scoreObserver = new IntersectionObserver(
    ([entry]) => {
      if (!entry.isIntersecting || officialScore.dataset.counted === "true") return;

      officialScore.dataset.counted = "true";
      const start = performance.now();

      const updateScore = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const value = Math.round(target * eased);

        officialScore.textContent = `${value}/100`;

        if (progress < 1) {
          requestAnimationFrame(updateScore);
        }
      };

      officialScore.textContent = "0/100";
      requestAnimationFrame(updateScore);
      scoreObserver.disconnect();
    },
    { threshold: 0.42 }
  );

  scoreObserver.observe(officialSection);
}

const navLinks = [...document.querySelectorAll(".site-nav a")];
const sections = navLinks
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

const navObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      const id = `#${entry.target.id}`;
      navLinks.forEach((link) => {
        link.classList.toggle("active", link.getAttribute("href") === id);
      });
    });
  },
  { rootMargin: "-45% 0px -48% 0px" }
);

sections.forEach((section) => navObserver.observe(section));

const hero = document.querySelector(".hero");
const stickyCtaObserver = hero
  ? new IntersectionObserver(
      ([entry]) => {
        document.body.classList.toggle("show-sticky-cta", !entry.isIntersecting);
      },
      { rootMargin: "0px 0px -35% 0px" }
    )
  : null;

if (hero && stickyCtaObserver) {
  stickyCtaObserver.observe(hero);
}

let mouseFrame = null;

const updateMouseGlow = (event) => {
  if (window.matchMedia("(pointer: coarse)").matches) return;

  if (mouseFrame) cancelAnimationFrame(mouseFrame);
  mouseFrame = requestAnimationFrame(() => {
    document.documentElement.style.setProperty("--mouse-x", `${event.clientX}px`);
    document.documentElement.style.setProperty("--mouse-y", `${event.clientY}px`);
  });
};

window.addEventListener("pointermove", updateMouseGlow, { passive: true });
