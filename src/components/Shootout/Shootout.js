import { gsap, Draggable, InertiaPlugin } from "../../lib/gsap.js";

const stage = document.getElementById("shootout-stage");
const ball = document.getElementById("shootout-ball");
const keeper = document.getElementById("shootout-keeper");
const goal = document.getElementById("shootout-goal");
const resultEl = document.getElementById("shootout-result");
const tallyEl = document.getElementById("shootout-tally");
const dots = document.querySelectorAll("#shootout-dots .dot");
const resetBtn = document.getElementById("shootout-reset");

const ROUNDS = 5;
let attempt = 0;
let goals = 0;
let inFlight = false;

InertiaPlugin.track(ball, "x,y");

const drag = Draggable.create(ball, {
  type: "x,y",
  bounds: stage,
  onDragEnd: onRelease,
})[0];

function onRelease() {
  const vx = InertiaPlugin.getVelocity(ball, "x");
  const vy = InertiaPlugin.getVelocity(ball, "y");

  // not a real strike — spring back to the spot
  if (vy > -350 || inFlight || attempt >= ROUNDS) {
    gsap.to(ball, { x: 0, y: 0, duration: 0.6, ease: "elastic.out(1, 0.55)" });
    return;
  }

  inFlight = true;
  drag.disable();

  const ballRect = ball.getBoundingClientRect();
  const goalRect = goal.getBoundingClientRect();
  const ballX = ballRect.left + ballRect.width / 2;
  const ballY = ballRect.top + ballRect.height / 2;

  // where the shot crosses the goal line
  const targetY = goalRect.top + goalRect.height * 0.62;
  const dy = targetY - ballY;
  const t = gsap.utils.clamp(0.28, 0.7, dy / vy);
  const dx = vx * t * 0.85;
  const endX = ballX + dx;

  const inset = goalRect.width * 0.04;
  const onTarget = endX > goalRect.left + inset && endX < goalRect.right - inset;

  // keeper picks a third of the goal
  const dive = gsap.utils.random([-1, 0, 1]);
  const zoneW = goalRect.width / 3;
  const keeperEndX = goalRect.left + goalRect.width / 2 + dive * zoneW;
  const saved = onTarget && Math.abs(endX - keeperEndX) < zoneW * 0.55;

  // keeper dive
  gsap.to(keeper, {
    x: dive * zoneW,
    y: dive === 0 ? -goalRect.height * 0.18 : -goalRect.height * 0.1,
    rotation: dive * 70,
    duration: 0.4,
    delay: 0.08,
    ease: "power2.out",
  });

  // ball flight (shrinks for depth)
  gsap.to(ball, {
    x: `+=${dx}`,
    y: `+=${dy}`,
    scale: 0.45,
    rotation: dx * 0.5,
    duration: 0.45,
    ease: "power1.out",
    onComplete: () => {
      if (!onTarget) return settle("WIDE!", false);
      if (saved) {
        // parried back out
        gsap.to(ball, {
          x: `+=${gsap.utils.random(-60, 60)}`,
          y: "+=130",
          rotation: "+=180",
          duration: 0.5,
          ease: "power1.in",
        });
        return settle("SAVED!", false);
      }
      netRipple();
      confetti(endX, targetY);
      shake();
      settle("GOAL!", true);
    },
  });
}

function settle(word, scored) {
  attempt += 1;
  if (scored) goals += 1;
  dots[attempt - 1].classList.add(scored ? "is-goal" : "is-miss");
  tallyEl.textContent = `${goals} / ${ROUNDS}`;

  gsap.fromTo(
    resultEl,
    { opacity: 1, scale: 0.6 },
    { scale: 1, duration: 0.35, ease: "back.out(2)" }
  );
  gsap.to(resultEl, { duration: 0.4, scrambleText: { text: word, chars: "upperCase", speed: 0.8 } });
  gsap.to(resultEl, { opacity: 0, delay: 1.1, duration: 0.4 });

  gsap.delayedCall(1.2, () => {
    gsap.to(keeper, { x: 0, y: 0, rotation: 0, duration: 0.5, ease: "power2.inOut" });
    if (attempt >= ROUNDS) return finish();
    gsap.to(ball, {
      x: 0,
      y: 0,
      scale: 1,
      rotation: 0,
      duration: 0.55,
      ease: "power2.inOut",
      onComplete: () => {
        inFlight = false;
        drag.enable();
      },
    });
  });
}

function finish() {
  gsap.set(ball, { opacity: 0 });
  const verdict =
    goals === 5 ? "PERFECT. 5/5" :
    goals >= 3 ? `CLINICAL. ${goals}/5` :
    goals >= 1 ? `NERVY. ${goals}/5` :
    "HEARTBREAK. 0/5";
  gsap.set(resultEl, { opacity: 1, scale: 1 });
  gsap.to(resultEl, { duration: 0.8, scrambleText: { text: verdict, chars: "upperCase" } });
  resetBtn.hidden = false;
  gsap.from(resetBtn, { opacity: 0, y: 16, duration: 0.5 });
}

resetBtn.addEventListener("click", () => {
  attempt = 0;
  goals = 0;
  inFlight = false;
  dots.forEach((d) => d.classList.remove("is-goal", "is-miss"));
  tallyEl.textContent = `0 / ${ROUNDS}`;
  resultEl.textContent = "";
  gsap.set(resultEl, { opacity: 0 });
  resetBtn.hidden = true;
  gsap.fromTo(ball, { x: 0, y: 0, scale: 0, opacity: 1 }, { scale: 1, duration: 0.5, ease: "back.out(1.8)" });
  drag.enable();
});

function netRipple() {
  gsap.fromTo(
    goal.querySelector("svg"),
    { scaleY: 1 },
    { scaleY: 1.04, yoyo: true, repeat: 3, duration: 0.07, transformOrigin: "top center" }
  );
}

function shake() {
  gsap.fromTo(stage, { x: -5 }, { x: 5, repeat: 5, yoyo: true, duration: 0.05, clearProps: "x" });
}

function confetti(clientX, clientY) {
  const stageRect = stage.getBoundingClientRect();
  const px = clientX - stageRect.left;
  const py = clientY - stageRect.top;
  const colors = ["#6cace4", "#f2c14e", "#f2efe6", "#2ec27e"];

  for (let i = 0; i < 46; i++) {
    const piece = document.createElement("div");
    piece.className = "confetti";
    piece.style.background = colors[i % colors.length];
    piece.style.left = `${px}px`;
    piece.style.top = `${py}px`;
    stage.appendChild(piece);

    gsap.to(piece, {
      physics2D: {
        velocity: gsap.utils.random(260, 620),
        angle: gsap.utils.random(-140, -40),
        gravity: 900,
      },
      rotation: gsap.utils.random(-360, 360),
      opacity: 0,
      duration: gsap.utils.random(1, 1.7),
      ease: "none",
      onComplete: () => piece.remove(),
    });
  }
}

// entrance
gsap.from(stage, {
  opacity: 0,
  y: 60,
  duration: 0.9,
  ease: "power3.out",
  scrollTrigger: { trigger: stage, start: "top 80%" },
});
