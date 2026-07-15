import { gsap } from "../../lib/gsap.js";

const cards = gsap.utils.toArray(".faceoff-card");

// slide in from opposite wings
gsap.from(".faceoff-card-arg", {
  x: -120,
  opacity: 0,
  duration: 1,
  ease: "power3.out",
  scrollTrigger: { trigger: ".faceoff-grid", start: "top 75%" },
});
gsap.from(".faceoff-card-eng", {
  x: 120,
  opacity: 0,
  duration: 1,
  ease: "power3.out",
  scrollTrigger: { trigger: ".faceoff-grid", start: "top 75%" },
});
gsap.from(".faceoff-vs", {
  scale: 0,
  rotation: -45,
  duration: 0.7,
  delay: 0.4,
  ease: "back.out(2)",
  scrollTrigger: { trigger: ".faceoff-grid", start: "top 75%" },
});

// pointer-follow 3D tilt
cards.forEach((card) => {
  const rx = gsap.quickTo(card, "rotationX", { duration: 0.5, ease: "power2.out" });
  const ry = gsap.quickTo(card, "rotationY", { duration: 0.5, ease: "power2.out" });

  card.addEventListener("pointermove", (e) => {
    const r = card.getBoundingClientRect();
    const nx = (e.clientX - r.left) / r.width - 0.5;
    const ny = (e.clientY - r.top) / r.height - 0.5;
    ry(nx * 14);
    rx(-ny * 10);
  });

  card.addEventListener("pointerleave", () => {
    rx(0);
    ry(0);
  });
});
