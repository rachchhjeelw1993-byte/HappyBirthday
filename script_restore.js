
const sections = document.querySelectorAll(".view");
const navButtons = document.querySelectorAll(".nav-btn, .btn[data-target]");

function showView(targetId) {
  sections.forEach((section) => {
    const isActive = section.id === targetId;
    if (isActive) section.classList.add("active");
    else section.classList.remove("active");
  });
  navButtons.forEach((button) => {
    const shouldBeActive = button.dataset.target === targetId;
    button.classList.toggle("active", shouldBeActive);
  });
  if (targetId === "balloons") createBalloons();
}

const storyLetterEnvelope = document.getElementById("birthdayEnvelope");
const storySealButton = document.getElementById("envelopeSeal");
const storyPlayButton = document.getElementById("closeLetterBtn");
const questionModal = document.getElementById("questionModal");
const birthdayWish = document.getElementById("birthdayWish");
const nextFromBalloons = document.getElementById("nextFromBalloons");
const finalInvite = document.getElementById("finalInvite");
const surpriseButtonFromWish = document.getElementById("surpriseButtonFromWish");

function openEnvelope(envelope, triggerButton, revealButton) {
  if (!envelope) return;
  envelope.classList.add("opened");

  if (triggerButton) triggerButton.style.pointerEvents = "none";
  if (revealButton) {
    revealButton.classList.remove("hidden");
    revealButton.classList.add("visible");
  }
}

function bindEnvelopeEvents() {
  const envelope = document.getElementById("birthdayEnvelope") || document.getElementById("storyLetterEnvelope");
  const sealButton = document.getElementById("envelopeSeal") || document.getElementById("sealButton");
  const closeLetterBtn = document.getElementById("closeLetterBtn") || document.getElementById("storyPlayButton");

  if (sealButton && envelope) {
    sealButton.style.pointerEvents = "auto";
    sealButton.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      envelope.classList.add("opened");
      sealButton.style.pointerEvents = "none";
    }, { once: true });
  }

  if (closeLetterBtn) {
    closeLetterBtn.addEventListener("click", () => {
      showView("balloons");
    }, { once: true });
  }
}

bindEnvelopeEvents();

if (storyPlayButton) {
  storyPlayButton.addEventListener("click", () => {
    showView("balloons");
  });
}

if (surpriseButtonFromWish) {
  surpriseButtonFromWish.addEventListener("click", () => {
    showView("rsvp");
  });
}

const noButton = document.querySelector(".no-btn");
if (noButton) {
  const moveNoButton = () => {
    const parent = noButton.parentElement;
    if (!parent) return;
    const maxX = Math.max(18, parent.clientWidth - noButton.offsetWidth - 18);
    const maxY = Math.max(18, parent.clientHeight - noButton.offsetHeight - 18);
    const nextX = Math.random() * maxX;
    const nextY = Math.random() * maxY;
    noButton.style.position = "absolute";
    noButton.style.left = `${nextX}px`;
    noButton.style.top = `${nextY}px`;
    noButton.style.transform = "none";
  };

  noButton.style.position = "relative";
  noButton.style.pointerEvents = "auto";
  noButton.addEventListener("mouseenter", moveNoButton);
  noButton.addEventListener("mousemove", moveNoButton);
  noButton.addEventListener("click", (event) => {
    event.preventDefault();
    moveNoButton();
  });
}

const yesButton = document.querySelector(".yes-btn");
if (yesButton && questionModal && finalInvite) {
  yesButton.addEventListener("click", () => {
    questionModal.classList.add("hidden");
    questionModal.classList.remove("visible");
    finalInvite.classList.remove("hidden");
    finalInvite.classList.add("visible");
  });
}

if (nextFromBalloons) {
  nextFromBalloons.addEventListener("click", () => {
    showView("rsvp");
  });
}

navButtons.forEach((button) => {
  button.addEventListener("click", () => {
    if (button.dataset.target) showView(button.dataset.target);
  });
});

const polaroidSlides = Array.from(document.querySelectorAll(".polaroid-slide"));
let currentSlideIndex = 0;
function updatePolaroidSlide(index) {
  if (!polaroidSlides.length) return;
  currentSlideIndex = (index + polaroidSlides.length) % polaroidSlides.length;
  polaroidSlides.forEach((slide, slideIndex) => slide.classList.toggle("active", slideIndex === currentSlideIndex));
}
const prevSlideButton = document.querySelector(".polaroid-nav.prev");
const nextSlideButton = document.querySelector(".polaroid-nav.next");
if (prevSlideButton) {
  prevSlideButton.addEventListener("click", (e) => {
    e.stopPropagation();
    updatePolaroidSlide(currentSlideIndex - 1);
  });
}
if (nextSlideButton) {
  nextSlideButton.addEventListener("click", (e) => {
    e.stopPropagation();
    updatePolaroidSlide(currentSlideIndex + 1);
  });
}

const musicToggle = document.getElementById("musicToggle");
const bgMusic = document.getElementById("bgMusic");
let audioContext = null;

function playBirthdayMelody() {
  const notes = [392, 440, 523.25, 440, 392, 349.23, 392, 440, 523.25, 587.33, 523.25, 440];
  if (!audioContext) {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    audioContext = new AudioCtx();
  }
  if (audioContext.state === "suspended") audioContext.resume();
  const start = audioContext.currentTime + 0.08;
  notes.forEach((frequency, index) => {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    oscillator.type = "triangle";
    oscillator.frequency.setValueAtTime(frequency, start + index * 0.35);
    gainNode.gain.setValueAtTime(0.0001, start + index * 0.35);
    gainNode.gain.exponentialRampToValueAtTime(0.06, start + index * 0.35 + 0.04);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, start + index * 0.35 + 0.23);
    oscillator.connect(gainNode).connect(audioContext.destination);
    oscillator.start(start + index * 0.35);
    oscillator.stop(start + index * 0.35 + 0.24);
  });
}

if (musicToggle && bgMusic) {
  musicToggle.addEventListener("click", () => {
    if (!bgMusic.paused) {
      bgMusic.pause();
      musicToggle.textContent = "♫ Music On";
      musicToggle.classList.remove("playing");
      return;
    }
    playBirthdayMelody();
    musicToggle.textContent = "♫ Music Off";
    musicToggle.classList.add("playing");
    bgMusic.src = "https://soundhelix.com";
    bgMusic.play().catch(() => {});
  });
}

const messageSet = [
  "Because you always know how to make me smile! 💖",
  "Because you're the best listener I know! ✨",
  "Because your laugh is contagious! ✨",
  "Because you make every moment special! 🎂",
  "Because you are my forever home! ❤️",
  "Because you turn ordinary days into beautiful memories. 🌷",
  "Because your love makes life brighter and softer. 🌟",
  "Because with you, even chaos feels cozy. 💫"
];

function createBalloons() {
  const scene = document.getElementById("balloonScene");
  if (!scene || scene.dataset.ready === "true") return;
  scene.dataset.ready = "true";
  scene.innerHTML = "";

  const positions = [
    { left: "10%", top: "58%", scale: 1.0, hue: 330 },
    { left: "23%", top: "42%", scale: 1.12, hue: 320 },
    { left: "38%", top: "56%", scale: 1.06, hue: 345 },
    { left: "52%", top: "38%", scale: 1.16, hue: 350 },
    { left: "66%", top: "52%", scale: 1.09, hue: 335 },
    { left: "79%", top: "42%", scale: 1.13, hue: 340 },
    { left: "88%", top: "58%", scale: 1.02, hue: 325 }
  ];

  positions.forEach((position, index) => {
    const balloon = document.createElement("button");
    balloon.type = "button";
    balloon.className = "balloon";
    balloon.style.left = position.left;
    balloon.style.top = position.top;
    balloon.style.transform = `scale(${position.scale})`;
    balloon.style.setProperty("--hue", String(position.hue));

    const msg = document.createElement("span");
    msg.className = "balloon-message";
    msg.textContent = messageSet[index % messageSet.length];
    balloon.appendChild(msg);

    balloon.addEventListener("click", () => {
      if (balloon.classList.contains("burst")) return;

      balloon.classList.add("burst");
      balloon.setAttribute("data-read", "true");

      const allBalloons = scene.querySelectorAll(".balloon");
      const allPopped = [...allBalloons].every((item) => item.classList.contains("burst"));

      if (allPopped) {
        const nextButton = document.getElementById("nextFromBalloons");
        if (nextButton) {
          nextButton.classList.remove("hidden");
          nextButton.style.opacity = "0";
          nextButton.style.transition = "opacity 0.5s ease-in";
          setTimeout(() => {
            nextButton.style.opacity = "1";
          }, 100);
        }
      }
    });
    scene.appendChild(balloon);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  bindEnvelopeEvents();
  showView("hero");
});

/* ========================================================
   DYNAMIC HIGH-DENSITY CELEBRATION PARTY BACKGROUND
   ======================================================== */

function initBirthdayConfettiStorm() {
  const container = document.createElement("div");
  container.className = "party-bg-canvas";

  const existingCanvas = document.querySelector(".party-bg-canvas");
  if (!existingCanvas) {
    document.body.appendChild(container);
  }

  const renderContainer = document.querySelector(".party-bg-canvas") || container;
  const emojiPool = ["🎈", "🎂", "🎁", "✨", "💖", "🌷", "🥳"];

  setInterval(() => {
    if (document.hidden) return;

    const particle = document.createElement("div");
    particle.className = "bg-floating-item";

    particle.textContent = emojiPool[Math.floor(Math.random() * emojiPool.length)];
    particle.style.left = `${Math.random() * 100}%`;

    const randomScale = 0.6 + Math.random() * 0.9;
    particle.style.fontSize = `${randomScale * 1.5}rem`;

    const randomSpeed = 7 + Math.random() * 6;
    particle.style.animationDuration = `${randomSpeed}s`;
    particle.style.setProperty("--start-rotation", `${Math.random() * 360}deg`);
    particle.style.setProperty("--drift-x", `${-50 + Math.random() * 100}px`);

    renderContainer.appendChild(particle);

    setTimeout(() => {
      particle.remove();
    }, randomSpeed * 1000);
  }, 350);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initBirthdayConfettiStorm);
} else {
  initBirthdayConfettiStorm();
}

