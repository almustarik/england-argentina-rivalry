import { gsap, ScrollTrigger } from "../../lib/gsap.js";

const panels = gsap.utils.toArray(".rivalry-panel");
const years = gsap.utils.toArray(".rivalry-year");
const paths = gsap.utils.toArray(".rivalry-pitch .traj");
const ball = document.querySelector(".rivalry-ball");

const master = gsap.timeline({
  scrollTrigger: {
    trigger: "#rivalry",
    start: "top top",
    end: "+=" + panels.length * 1400,
    pin: true,
    scrub: 0.8,
  },
});

panels.forEach((panel, i) => {
  const seg = gsap.timeline();

  seg
    .fromTo(panel, { autoAlpha: 0, y: 50 }, { autoAlpha: 1, y: 0, duration: 0.5, ease: "power2.out" })
    .fromTo(years[i], { opacity: 0, scale: 1.15 }, { opacity: 1, scale: 1, duration: 0.5 }, "<")
    .set([paths[i], ball], { autoAlpha: 1 }, "<0.25")
    .fromTo(paths[i], { drawSVG: "0%" }, { drawSVG: "100%", duration: 1.4, ease: "none" }, "<")
    .to(
      ball,
      {
        motionPath: { path: paths[i], align: paths[i], alignOrigin: [0.5, 0.5] },
        duration: 1.4,
        ease: "none",
      },
      "<"
    )
    // dwell so the reader can take it in
    .to({}, { duration: 0.6 });

  // fade the moment out (keep the last one on screen)
  if (i < panels.length - 1) {
    seg
      .to(panel, { autoAlpha: 0, y: -40, duration: 0.4 })
      .to(years[i], { opacity: 0, duration: 0.4 }, "<")
      .to([paths[i], ball], { autoAlpha: 0, duration: 0.3 }, "<");
  }

  master.add(seg);
});

ScrollTrigger.refresh();
