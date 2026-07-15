import { gsap } from "../../lib/gsap.js";

// second marquee runs the opposite way
const track = document.querySelector("#footer-marquee .marquee-track");
track.appendChild(track.firstElementChild.cloneNode(true));
gsap.fromTo(track, { xPercent: -50 }, { xPercent: 0, duration: 24, ease: "none", repeat: -1 });

// animate the block as one — SplitText transforms would break the
// background-clip:text gradient on the words
gsap.from(".footer-big", {
  y: 70,
  opacity: 0,
  duration: 1,
  ease: "power3.out",
  scrollTrigger: { trigger: ".footer-big", start: "top 88%" },
});

gsap.from(".footer-links a", {
  y: 20,
  opacity: 0,
  stagger: 0.08,
  duration: 0.6,
  ease: "power2.out",
  scrollTrigger: { trigger: ".footer-links", start: "top 92%" },
});
