/* ============================================
   WEBCORE MODE TOGGLE & EFFECTS
   ============================================ */

// ============================================
// MODE TOGGLE FUNCTIONALITY
// ============================================

function initWebcoreToggle() {
  const webcoreCSS = document.getElementById("webcore-css");
  const toggleButton = document.getElementById("mode-toggle");

  // Check if webcore mode is saved in localStorage
  const isWebcoreMode = localStorage.getItem("webcoreMode") === "true";

  // Initialize mode based on saved preference
  if (isWebcoreMode) {
    enableWebcoreMode();
  } else {
    disableWebcoreMode();
  }

  // Toggle button click handler
  let mobileTapPending = false;
  let mobileTapTimer = null;

  // Prevent double-tap zoom and mobile tap logic
  let lastTouchEnd = 0;

  toggleButton.addEventListener(
    "touchend",
    (e) => {
      e.preventDefault();
      lastTouchEnd = Date.now();

      if (webcoreCSS.disabled) {
        if (!mobileTapPending) {
          mobileTapPending = true;
          toggleButton.style.background = "#ff0000";
          toggleButton.style.color = "#ffffff";
          mobileTapTimer = setTimeout(() => {
            mobileTapPending = false;
            toggleButton.style.background = "";
            toggleButton.style.color = "";
          }, 1500);
        } else {
          clearTimeout(mobileTapTimer);
          mobileTapPending = false;
          toggleButton.style.background = "";
          toggleButton.style.color = "";
          enableWebcoreMode();
        }
      } else {
        disableWebcoreMode();
      }
    },
    { passive: false },
  );

  toggleButton.addEventListener("click", () => {
    if (Date.now() - lastTouchEnd < 500) return;
    if (webcoreCSS.disabled) {
      enableWebcoreMode();
    } else {
      disableWebcoreMode();
    }
  });

  function enableWebcoreMode() {
    webcoreCSS.disabled = false;
    localStorage.setItem("webcoreMode", "true");
    toggleButton.innerHTML =
      '<span class="btn-long">← TAKE ME BACK</span><span class="btn-short">🎉</span>';

    // Show webcore-only elements
    document.querySelectorAll(".webcore-only").forEach((el) => {
      el.style.display = "block";
    });

    // Initialize webcore effects
    initStarfield();
    initParticles();
    initWebcoreVisitorCounter();

    // Add glitch effect to body briefly
    document.body.style.animation = "glitch-entrance 0.5s";
    setTimeout(() => {
      document.body.style.animation = "";
    }, 500);
  }

  function disableWebcoreMode() {
    webcoreCSS.disabled = true;
    localStorage.setItem("webcoreMode", "false");
    toggleButton.innerHTML =
      '<span class="btn-long">TAKE ME BACK TO 2005 →</span><span class="btn-short">🎉</span>';

    // Hide webcore-only elements
    document.querySelectorAll(".webcore-only").forEach((el) => {
      el.style.display = "none";
    });

    // Clean up effects
    cleanupStarfield();
    cleanupParticles();
    cleanupMidiPlayer();
  }
}

// ============================================
// STARFIELD BACKGROUND
// ============================================

let starfieldInitialized = false;

function initStarfield() {
  if (starfieldInitialized) return;

  const starfield = document.getElementById("starfield");
  if (!starfield) return;

  // Clear existing stars
  starfield.innerHTML = "";

  // Generate 150 stars
  for (let i = 0; i < 150; i++) {
    const star = document.createElement("div");
    star.className = "star";

    // Random position
    star.style.left = Math.random() * 100 + "%";
    star.style.top = Math.random() * 100 + "%";

    // Random animation delay for twinkle effect
    star.style.animationDelay = Math.random() * 3 + "s";

    // Random size (some stars bigger than others)
    const size = Math.random() > 0.8 ? 3 : 2;
    star.style.width = size + "px";
    star.style.height = size + "px";

    starfield.appendChild(star);
  }

  starfieldInitialized = true;
}

function cleanupStarfield() {
  const starfield = document.getElementById("starfield");
  if (starfield) {
    starfield.innerHTML = "";
  }
  starfieldInitialized = false;
}

// ============================================
// FALLING PARTICLES
// ============================================

let particlesInitialized = false;
let particleInterval = null;

function initParticles() {
  if (particlesInitialized) return;

  const particlesContainer = document.getElementById("particles");
  if (!particlesContainer) return;

  // Clear existing particles
  particlesContainer.innerHTML = "";

  // Particle symbols to use
  const symbols = ["★", "☆", "♡", "♥", "♪", "♫", "✨", "💫", "🌟", "⭐"];
  const colors = ["#ff00ff", "#00ffff", "#ffff00", "#00ff00", "#ff0000"];

  // Create initial batch of particles
  for (let i = 0; i < 25; i++) {
    createParticle(particlesContainer, symbols, colors);
  }

  // Continuously add new particles
  particleInterval = setInterval(() => {
    // Only add if less than 30 particles exist
    if (particlesContainer.children.length < 30) {
      createParticle(particlesContainer, symbols, colors);
    }
  }, 800);

  particlesInitialized = true;
}

function createParticle(container, symbols, colors) {
  const particle = document.createElement("div");
  particle.className = "particle";

  // Random symbol
  particle.textContent = symbols[Math.floor(Math.random() * symbols.length)];

  // Random horizontal position
  particle.style.left = Math.random() * 100 + "%";

  // Random color
  particle.style.color = colors[Math.floor(Math.random() * colors.length)];

  // Random size
  particle.style.fontSize = Math.random() * 15 + 15 + "px";

  // Random fall duration (5-12 seconds)
  const duration = Math.random() * 7 + 5;
  particle.style.animationDuration = duration + "s";

  // Random delay
  particle.style.animationDelay = Math.random() * 2 + "s";

  // Add to container
  container.appendChild(particle);

  // Remove particle after animation completes
  setTimeout(
    () => {
      if (particle.parentNode) {
        particle.remove();
      }
    },
    (duration + 2) * 1000,
  );
}

function cleanupParticles() {
  const particlesContainer = document.getElementById("particles");
  if (particlesContainer) {
    particlesContainer.innerHTML = "";
  }

  if (particleInterval) {
    clearInterval(particleInterval);
    particleInterval = null;
  }

  particlesInitialized = false;
}

// ============================================
// WEBCORE VISITOR COUNTER
// ============================================

function initWebcoreVisitorCounter() {
  const counterDisplay = document.querySelector(".counter-display");
  if (!counterDisplay) return;

  // Get the visitor number from ticker or generate the same way
  const tickerText = document.getElementById("ticker")?.textContent || "";
  const match = tickerText.match(/VISITOR NO\. (\d+)/);
  const visitorNum = match
    ? match[1]
    : String(Math.floor(Math.random() * 900000) + 100000);

  // Display the static number
  updateCounterDisplay(counterDisplay, visitorNum);
}

function updateCounterDisplay(element, count) {
  // Format with leading zeros and spaces between digits
  const formatted = count.toString().padStart(6, "0").split("").join(" ");
  element.textContent = formatted;
}

// ============================================
// MIDI PLAYER
// ============================================

let audio = null;

function initMidiPlayer() {
  const playButton = document.querySelector('.midi-button[data-action="play"]');
  const pauseButton = document.querySelector(
    '.midi-button[data-action="pause"]',
  );
  const nextButton = document.querySelector('.midi-button[data-action="next"]');
  const prevButton = document.querySelector('.midi-button[data-action="prev"]');
  const nowPlayingText = document.querySelector(".midi-player .now-playing");

  if (!playButton) return;

  const trackName = "track1.mp3";
  if (nowPlayingText) nowPlayingText.textContent = trackName;

  // Create audio element once
  if (!audio) {
    audio = new Audio("audio/" + trackName);
    audio.loop = true;
    audio.volume = 0.2;
  }

  playButton.addEventListener("click", () => {
    audio.play();
    playButton.style.background = "linear-gradient(180deg, #00ff00, #00aa00)";
  });

  pauseButton.addEventListener("click", () => {
    audio.pause();
    playButton.style.background = "";
  });

  // Next/prev do nothing with a single track but keep buttons functional
  nextButton?.addEventListener("click", () => {});
  prevButton?.addEventListener("click", () => {});
}

function cleanupMidiPlayer() {
  if (audio) {
    audio.pause();
    audio.currentTime = 0;
  }
}

// ============================================
// GLITCH ENTRANCE ANIMATION
// ============================================

const glitchStyle = document.createElement("style");
glitchStyle.textContent = `
@keyframes glitch-entrance {
  0% { transform: translate(0); filter: none; }
  10% { transform: translate(-5px, 5px); filter: hue-rotate(90deg); }
  20% { transform: translate(5px, -5px); filter: hue-rotate(180deg); }
  30% { transform: translate(-5px, -5px); filter: hue-rotate(270deg); }
  40% { transform: translate(5px, 5px); filter: hue-rotate(0deg); }
  50% { transform: translate(0); filter: none; }
  100% { transform: translate(0); filter: none; }
}
`;
document.head.appendChild(glitchStyle);

// ============================================
// EASTER EGG
// ============================================

let konamiCode = [];
const konamiSequence = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a",
];

function initKonamiCode() {
  document.addEventListener("keydown", (e) => {
    konamiCode.push(e.key);
    konamiCode = konamiCode.slice(-10); // Keep last 10 keys

    // Check if sequence matches
    if (konamiCode.join("") === konamiSequence.join("")) {
      const webcoreCSS = document.getElementById("webcore-css");
      if (webcoreCSS && webcoreCSS.disabled) {
        document.body.style.animation = "glitch-entrance 1s";
        setTimeout(() => {
          document.getElementById("mode-toggle").click();
          alert("welcome back to the old internet");
          document.body.style.animation = "";
        }, 500);
      }
      konamiCode = []; // Reset
    }
  });
}

// ============================================
// INITIALIZE EVERYTHING
// Call this when DOM is ready
// ============================================

function initWebcoreEffects() {
  initWebcoreToggle();
  initKonamiCode();

  // Initialize MIDI player if elements exist
  if (document.querySelector(".midi-player")) {
    initMidiPlayer();
  }
}

// Auto-initialize when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initWebcoreEffects);
} else {
  initWebcoreEffects();
}

// ============================================
// CLEANUP ON PAGE UNLOAD
// ============================================

window.addEventListener("beforeunload", () => {
  cleanupStarfield();
  cleanupParticles();
  cleanupMidiPlayer();
});
