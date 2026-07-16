import { gsap, ScrollTrigger } from "../../lib/gsap.js";

const panels = gsap.utils.toArray(".rivalry-panel");
const years = gsap.utils.toArray(".rivalry-year");
const paths = gsap.utils.toArray(".rivalry-pitch .traj");
const ball = document.querySelector(".rivalry-ball");

const media = gsap.matchMedia();

media.add("(min-width: 821px)", () => {
  const master = gsap.timeline({
    scrollTrigger: {
      trigger: "#rivalry",
      start: "top top",
      end: "+=" + panels.length * 1400,
      pin: true,
      scrub: 0.8,
      invalidateOnRefresh: true,
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
      .to({}, { duration: 0.6 });

    if (i < panels.length - 1) {
      seg
        .to(panel, { autoAlpha: 0, y: -40, duration: 0.4 })
        .to(years[i], { opacity: 0, duration: 0.4 }, "<")
        .to([paths[i], ball], { autoAlpha: 0, duration: 0.3 }, "<");
    }

    master.add(seg);
  });
});

media.add("(max-width: 820px)", () => {
  gsap.set(paths, { autoAlpha: 0.55, drawSVG: "100%" });
  gsap.set(ball, { autoAlpha: 0 });

  panels.forEach((panel) => {
    gsap.from(panel, {
      autoAlpha: 0,
      y: 28,
      duration: 0.65,
      ease: "power2.out",
      scrollTrigger: {
        trigger: panel,
        start: "top 88%",
        once: true,
      },
    });
  });
});

ScrollTrigger.refresh();
