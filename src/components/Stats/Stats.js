import { gsap } from "../../lib/gsap.js";

gsap.utils.toArray(".stats-row").forEach((row) => {
  const arg = Number(row.dataset.arg);
  const eng = Number(row.dataset.eng);
  const total = arg + eng || 1;
  const gapPct = 1.5; // breathing room where the two fills meet

  const argFill = row.querySelector(".stats-fill-arg");
  const engFill = row.querySelector(".stats-fill-eng");
  argFill.style.width = `${(arg / total) * 100 - gapPct}%`;
  engFill.style.width = `${(eng / total) * 100 - gapPct}%`;

  const tl = gsap.timeline({
    scrollTrigger: { trigger: row, start: "top 85%" },
    defaults: { duration: 1.1, ease: "power3.out" },
  });

  tl.fromTo(argFill, { scaleX: 0 }, { scaleX: 1 })
    .fromTo(engFill, { scaleX: 0 }, { scaleX: 1 }, "<")
    .to(row.querySelectorAll(".stats-val"), {
      textContent: (i, el) => el.dataset.target,
      snap: { textContent: 1 },
      duration: 1.2,
    }, "<");
});

gsap.from(".stats-note, .stats-legend", {
  opacity: 0,
  y: 14,
  duration: 0.8,
  scrollTrigger: { trigger: ".stats-rows", start: "top 80%" },
});
