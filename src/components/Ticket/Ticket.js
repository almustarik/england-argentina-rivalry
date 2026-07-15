import { gsap } from "../../lib/gsap.js";

gsap.from("#ticket-card", {
  y: 80,
  rotation: -2.5,
  opacity: 0,
  duration: 1,
  ease: "power3.out",
  scrollTrigger: { trigger: "#ticket-card", start: "top 82%" },
});

gsap.from(".ticket-barcode .bar", {
  scaleY: 0,
  transformOrigin: "bottom center",
  stagger: { each: 0.02, from: "random" },
  duration: 0.4,
  ease: "power2.out",
  scrollTrigger: { trigger: "#ticket-card", start: "top 70%" },
});
