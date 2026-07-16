import { gsap, SplitText, Draggable } from "../../lib/gsap.js";

const KICKOFF = new Date("2026-07-19T15:00:00-04:00"); // the final: 3PM EDT, MetLife Stadium

// --- intro ---
const argSplit = SplitText.create(".hero-line-arg", { type: "chars" });
const engSplit = SplitText.create(".hero-line-eng", { type: "chars" });

const intro = gsap.timeline({ defaults: { ease: "power4.out" } });
intro
  .from(argSplit.chars, { yPercent: 110, skewY: 6, duration: 1, stagger: 0.035 }, 0.15)
  .from(engSplit.chars, { yPercent: -110, skewY: -6, duration: 1, stagger: 0.035 }, 0.3)
  .from(".hero-line-vs", { opacity: 0, letterSpacing: "1.2em", duration: 1 }, 0.5)
  .from(".hero-kicker, .hero-countdown, .hero-hint", { opacity: 0, y: 16, duration: 0.7, stagger: 0.12 }, 0.7)
  .from(".hero-ball", { scale: 0, rotation: -180, ease: "back.out(1.6)", duration: 0.8 }, 1)
  .from("#hero-marquee", { opacity: 0, duration: 0.6 }, 1.1);

// --- countdown ---
const countdownEl = document.getElementById("countdown");
const labelEl = document.querySelector(".hero-countdown-label");
const pad = (n) => String(n).padStart(2, "0");

function tick() {
  const diff = KICKOFF - Date.now();
  if (diff <= 0) {
    labelEl.textContent = "It's on";
    countdownEl.textContent = "LIVE";
    countdownEl.classList.add("is-live");
    return;
  }
  const h = Math.floor(diff / 3.6e6);
  const m = Math.floor((diff % 3.6e6) / 6e4);
  const s = Math.floor((diff % 6e4) / 1000);
  countdownEl.textContent = `${pad(h)}:${pad(m)}:${pad(s)}`;
  setTimeout(tick, 1000 - (Date.now() % 1000));
}
tick();

// scramble the digits in on load
gsap.from(countdownEl, {
  duration: 1.6,
  delay: 0.9,
  scrambleText: { text: "{original}", chars: "0123456789", speed: 0.4 },
});

// --- draggable ball ---
const ball = document.getElementById("hero-ball");
const spin = gsap.to(ball.querySelector("svg"), {
  rotation: 360,
  duration: 14,
  ease: "none",
  repeat: -1,
});

Draggable.create(ball, {
  type: "x,y",
  bounds: "#hero",
  inertia: true,
  edgeResistance: 0.7,
  onDragStart: () => spin.timeScale(5),
  onThrowComplete: () => spin.timeScale(1),
});

// --- marquee ---
const track = document.querySelector("#hero-marquee .marquee-track");
track.appendChild(track.firstElementChild.cloneNode(true));
gsap.to(track, { xPercent: -50, duration: 28, ease: "none", repeat: -1 });
