/* ============================================================
   for you ♡ • interaksi
   ============================================================ */
const CONFIG = {
  // password = tanggal lahir, 6 digit
  password: "020710",
};

/* ============================================================
   CHARACTER BUILDER — setiap mood menggunakan foto figurine
   ============================================================ */
const MOOD_PHOTOS = {
  normal: "img6.PNG",   // coffee boy — chill, santai
  curious: "img5.png",  // beanie girl — curious, tertanya-tanya
  happy: "img2.png",    // bear boy — happy, excited!
  angry: "img1.png",    // red hood TNT — marah!
  arms: "img3.png",     // box monster — tangan ke atas!
};

function buildCat(mood) {
  const photo = MOOD_PHOTOS[mood] || MOOD_PHOTOS.normal;
  const cls = mood === "arms" ? "cat happy-arms" : "cat";
  return `<img class="${cls}" src="${photo}" alt="" draggable="false" />`;
}

document.querySelectorAll(".cat-wrap[data-cat]").forEach((wrap) => {
  wrap.insertAdjacentHTML("afterbegin", buildCat(wrap.dataset.cat));
});

/* tap karakter -> mantul */
document.addEventListener("click", (e) => {
  const cat = e.target.closest(".cat");
  if (!cat) return;
  cat.classList.remove("boing");
  void cat.offsetWidth;
  cat.classList.add("boing");
  spawnHearts(6);
  setTimeout(() => cat.classList.remove("boing"), 560);
});

/* ---------- background music (intro screens) ---------- */
const musicToggle = document.getElementById("musicToggle");

function tryPlayMusic() {
  if (typeof window.loadTrack === "function") {
    const audio = document.getElementById("audioPlayer");
    if (audio) audio.volume = 0.5;
    window.loadTrack(0, true);
    musicToggle.classList.add("playing");
  }
}

document.addEventListener("click", () => {
  const audio = document.getElementById("audioPlayer");
  if (audio && audio.paused) tryPlayMusic();
}, { once: true });

musicToggle.addEventListener("click", () => {
  const audio = document.getElementById("audioPlayer");
  if (audio && audio.paused) {
    audio.play()
      .then(() => musicToggle.classList.add("playing"))
      .catch(() => { });
  } else if (audio) {
    audio.pause();
    musicToggle.classList.remove("playing");
  }
});

/* ---------- screen navigation ---------- */
const screens = document.querySelectorAll(".screen");

function showScreen(id) {
  screens.forEach((s) => {
    s.classList.toggle("active", s.dataset.screen === id);
  });
  spawnHearts(8);
  if (id === "gate") resetPin();
}

document.querySelectorAll("[data-go]").forEach((btn) => {
  btn.addEventListener("click", () => showScreen(btn.dataset.go));
});

/* ---------- password keypad ---------- */
const pinDots = document.getElementById("pinDots");
const keypad = document.getElementById("keypad");
let pin = "";

function renderPin() {
  pinDots.querySelectorAll("span").forEach((d, i) => {
    d.classList.toggle("filled", i < pin.length);
  });
}
function resetPin() {
  pin = "";
  renderPin();
}

keypad.addEventListener("click", (e) => {
  const btn = e.target.closest("button");
  if (!btn) return;
  const key = btn.dataset.key;

  if (key === "del") {
    pin = pin.slice(0, -1);
  } else if (pin.length < 6) {
    pin += key;
  }
  renderPin();

  if (pin.length === 6) {
    setTimeout(checkPin, 180);
  }
});

function checkPin() {
  if (pin === CONFIG.password) {
    spawnHearts(20);
    showScreen("intro");
  } else {
    pinDots.classList.add("shake");
    setTimeout(() => {
      pinDots.classList.remove("shake");
      resetPin();
    }, 500);
  }
}

/* ---------- "noo" button runs away ---------- */
const nooBtn = document.getElementById("nooBtn");
let dodges = 0;
function dodge() {
  dodges++;
  const dx = (Math.random() - 0.5) * 180;
  const dy = (Math.random() - 0.5) * 120;
  nooBtn.style.transform = `translate(${dx}px, ${dy}px) rotate(${dx / 12}deg)`;
}
nooBtn.addEventListener("mouseenter", dodge);
nooBtn.addEventListener("touchstart", (e) => {
  if (dodges < 2) { e.preventDefault(); dodge(); }
});

/* ---------- floating hearts ---------- */
const heartsBg = document.getElementById("heartsBg");
const HEART_EMOJI = ["🥕", "🥕", "🥕", "🥕"];

function spawnHearts(count) {
  for (let n = 0; n < count; n++) {
    const h = document.createElement("span");
    h.className = "fh";
    h.textContent = HEART_EMOJI[(Math.random() * HEART_EMOJI.length) | 0];
    h.style.left = Math.random() * 100 + "%";
    h.style.bottom = "-30px";
    h.style.fontSize = 16 + Math.random() * 18 + "px";
    h.style.animationDuration = 4 + Math.random() * 4 + "s";
    heartsBg.appendChild(h);
    setTimeout(() => h.remove(), 8500);
  }
}

setInterval(() => spawnHearts(2), 2200);
spawnHearts(6);

/* ═══════════════════════════════════════════════════════════
   OCEAN PAGE — transition, bubble canvas, playlist, garden
   ═══════════════════════════════════════════════════════════ */

document.getElementById("enterOcean").addEventListener("click", () => {
  // hide intro app, show ocean page
  document.getElementById("app").style.display = "none";
  document.body.classList.add("ocean-mode");

  const oceanPage = document.getElementById("ocean-page");
  oceanPage.style.display = "block";

  // start ocean systems
  initBubbleCanvas();
  initGarden();
  initScrollReveal();
  initTypewriter();
});

/* ---------- BUBBLE CANVAS ---------- */
let petals = [];
let animating = false;

function initBubbleCanvas() {
  const canvas = document.getElementById("petal-canvas");
  const ctx = canvas.getContext("2d");

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);

  const COLORS = [
    "rgba(95,208,224,0.55)",
    "rgba(80,180,205,0.45)",
    "rgba(170,235,245,0.50)",
    "rgba(60,150,190,0.40)",
    "rgba(111,224,196,0.30)",
  ];

  function createPetal() {
    return {
      x: Math.random() * canvas.width,
      y: canvas.height + 20,
      size: Math.random() * 7 + 4,
      speed: Math.random() * 1.2 + 0.8,
      drift: (Math.random() - 0.5) * 0.8,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      opacity: Math.random() * 0.4 + 0.25,
    };
  }

  function drawPetal(p) {
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.globalAlpha = p.opacity;
    ctx.font = `${p.size * 2.5}px sans-serif`;
    ctx.fillText("🥕", 0, 0);
    ctx.restore();
  }

  function animate() {
    if (!animating) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (petals.length < 60 && Math.random() < 0.35) petals.push(createPetal());
    petals = petals.filter((p) => p.y > -30);
    petals.forEach((p) => {
      p.y -= p.speed;
      p.x += p.drift + Math.sin(p.y * 0.012) * 0.6;
      drawPetal(p);
    });
    requestAnimationFrame(animate);
  }

  animating = true;
  animate();
}

/* ---------- OCEAN PLAYLIST ---------- */
const playlist = [
  { title: "Matilda", artist: "Harry Styles", src: "song1.mp3", emoji: "🌼" },
  { title: "Saturn", artist: "Sleeping At Last", src: "song2.mp3", emoji: "🎂" },
  { title: "End of Beginning", artist: "Djo", src: "song3.mp3", emoji: "🌃" },
];
let currentTrack = 0;
let isPlaying = false;

function initOceanPlaylist() {
  const audio = document.getElementById("audioPlayer");
  const playBtn = document.getElementById("playBtn");
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");
  const disc = document.getElementById("musicDisc");
  const titleEl = document.getElementById("trackTitle");
  const artistEl = document.getElementById("trackArtist");
  const trackListEl = document.getElementById("trackList");

  // render track list
  playlist.forEach((t, i) => {
    const row = document.createElement("div");
    row.className = "track-row";
    row.dataset.index = i;
    row.innerHTML = `
      <div class="track-num"><span>${i + 1}</span></div>
      <div class="track-thumb">${t.emoji}</div>
      <div class="track-meta">
        <div class="tm-title">${t.title}</div>
        <div class="tm-artist">${t.artist}</div>
      </div>
      <div class="track-play">▶</div>`;
    row.addEventListener("click", () => loadTrack(i, true));
    trackListEl.appendChild(row);
  });

  function updateHighlight() {
    document.querySelectorAll(".track-row").forEach((r) => {
      const active = Number(r.dataset.index) === currentTrack;
      r.classList.toggle("active", active);
      const play = r.querySelector(".track-play");
      if (play) play.textContent = active && isPlaying ? "⏸" : "▶";
    });
    playBtn.textContent = isPlaying ? "⏸" : "▶";
    disc.classList.toggle("playing", isPlaying);
  }

  audio.addEventListener("play", () => { isPlaying = true; updateHighlight(); });
  audio.addEventListener("pause", () => { isPlaying = false; updateHighlight(); });
  audio.addEventListener("ended", () => nextTrack());

  window.loadTrack = function (i, autoplay) {
    currentTrack = (i + playlist.length) % playlist.length;
    const t = playlist[currentTrack];
    titleEl.textContent = t.title;
    artistEl.textContent = t.artist;
    audio.src = t.src;
    if (autoplay) audio.play().catch(() => { });
    updateHighlight();
  };

  window.nextTrack = function () { loadTrack(currentTrack + 1, true); };
  window.prevTrack = function () { loadTrack(currentTrack - 1, true); };

  playBtn.addEventListener("click", () => {
    if (audio.paused) audio.play().catch(() => { });
    else audio.pause();
  });
  prevBtn.addEventListener("click", () => prevTrack());
  nextBtn.addEventListener("click", () => nextTrack());

  loadTrack(currentTrack, false);
}

/* ---------- FLOWER GARDEN ---------- */
function initGarden() {
  document.querySelectorAll(".flower-item").forEach((el) => {
    el.addEventListener("click", () => {
      document.querySelectorAll(".flower-item").forEach((f) => f.classList.remove("bloomed"));
      el.classList.add("bloomed");
      const msg = document.getElementById("garden-message");
      msg.style.opacity = "0";
      setTimeout(() => {
        msg.textContent = el.dataset.msg;
        msg.style.opacity = "1";
      }, 300);
    });
  });
}

/* ---------- SCROLL REVEAL ---------- */
function initScrollReveal() {
  const elements = document.querySelectorAll(".reveal");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const delay = entry.target.closest(".grid-container")
            ? Array.from(entry.target.parentElement.children).indexOf(entry.target) * 80
            : 0;
          setTimeout(() => entry.target.classList.add("visible"), delay);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );
  elements.forEach((el) => observer.observe(el));

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    elements.forEach((el) => el.classList.add("visible"));
  }
}

/* ---------- TYPEWRITER EFFECT ---------- */
function initTypewriter() {
  const letterBox = document.querySelector('.letter-display-box');
  if (!letterBox) return;

  const paragraphs = Array.from(letterBox.querySelectorAll('.letter-paragraph'));
  const texts = paragraphs.map(p => {
    const text = p.textContent;
    p.textContent = '';
    return text;
  });

  let started = false;

  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && !started) {
      started = true;
      typeLetter();
    }
  }, { threshold: 0.15 });

  observer.observe(letterBox);

  function typeLetter() {
    let pIndex = 0;
    let charIndex = 0;

    function typeChar() {
      if (pIndex >= paragraphs.length) return;

      const currentText = texts[pIndex];
      const p = paragraphs[pIndex];

      if (charIndex < currentText.length) {
        p.textContent += currentText.charAt(charIndex);
        charIndex++;
        setTimeout(typeChar, 10 + Math.random() * 25);
      } else {
        pIndex++;
        charIndex = 0;
        setTimeout(typeChar, 250);
      }
    }
    typeChar();
  }
}

/* ---------- PHOTO MODAL LOGIC ---------- */
const photoModal = document.getElementById("photo-modal");
const modalImg = document.getElementById("modal-img");
const modalClose = document.querySelector(".modal-close");

if (photoModal && modalImg && modalClose) {
  document.querySelectorAll(".album-card img").forEach(img => {
    img.addEventListener("click", () => {
      photoModal.style.display = "flex";
      // Slight delay to allow display:flex to apply before adding class for opacity transition
      setTimeout(() => photoModal.classList.add("show"), 10);
      modalImg.src = img.src;
    });
  });

  function closePhotoModal() {
    photoModal.classList.remove("show");
    setTimeout(() => photoModal.style.display = "none", 300);
  }

  modalClose.addEventListener("click", closePhotoModal);
  photoModal.addEventListener("click", (e) => {
    if (e.target !== modalImg) {
      closePhotoModal();
    }
  });
}

// Initialize playlist immediately so music logic works everywhere
initOceanPlaylist();
