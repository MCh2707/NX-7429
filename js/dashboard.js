function toggleProfile() {
  document.getElementById("profile-panel").classList.toggle("open");
  NexusSystem.playBeep(1200, "sine", 0.1, 0.1);
}

const clockEl = document.getElementById("sys-clock");
setInterval(() => {
  if (Math.random() > 0.8) {
    clockEl.innerText = "07:42";
    clockEl.style.color = "var(--term-red)";
    clockEl.style.animation = "glitch-skew 0.2s infinite";
    setTimeout(() => {
      clockEl.style.color = "";
      clockEl.style.animation = "";
    }, 1000);
  } else {
    const now = new Date();
    clockEl.innerText = now.toLocaleTimeString("en-GB");
  }
}, 1000);

const sequence = ["inbox", "proj", "inbox"];
let currentIndex = 0;

function handleNavSeq(id) {
  NexusSystem.playBeep(800, "square", 0.05, 0.1);

  if (id === "sec") {
    document.body.classList.add("glitch-tear");
    NexusSystem.playStatic(0.5);
    setTimeout(() => {
      window.location.href = "archive.html";
    }, 500);
    return;
  }

  if (id === "priv") {
    window.location.href = "profile.html";
    return;
  }

  if (id === sequence[currentIndex]) {
    currentIndex++;
    if (currentIndex === sequence.length) {
      NexusSystem.playBeep(1500, "sine", 0.2, 0.5);
      const privNav = document.getElementById("nav-priv");
      privNav.style.opacity = "1";
      privNav.style.pointerEvents = "all";
      privNav.style.color = "var(--term-green)";
      privNav.innerText = "Personal / Private (UNLOCKED)";

      const flash = document.createElement("div");
      flash.className = "subliminal-flash";
      flash.innerText = "DIRECTORY UNLOCKED";
      flash.style.opacity = "1";
      document.body.appendChild(flash);
      setTimeout(() => flash.remove(), 1000);
    }
  } else {
    currentIndex = 0;
  }
}

const ghostFile = document.getElementById("ghost-file");
setInterval(() => {
  if (Math.random() > 0.7) {
    ghostFile.classList.add("visible");
    setTimeout(() => {
      ghostFile.classList.remove("visible");
    }, 1000);
  }
}, 8000);

const activityWidget = document.getElementById("activity-widget");
activityWidget.addEventListener("mouseenter", () => {
  const trail = document.querySelector(".cursor-trail");
  if (trail) trail.style.transition = "transform 0.5s ease-out";
});
activityWidget.addEventListener("mouseleave", () => {
  const trail = document.querySelector(".cursor-trail");
  if (trail) trail.style.transition = "transform 0.1s ease-out";
});

ghostFile.addEventListener("click", (e) => {
  e.preventDefault();
  NexusSystem.playBeep(2000, "square", 0.2, 0.1);
  alert("CORRUPTED FILE. FRAGMENT: 'THEY ARE LISTENING'");
  ghostFile.classList.remove("visible");
});

const vossImg = document.getElementById("voss-img");
setInterval(() => {
  if (Math.random() > 0.9) {
    vossImg.style.transform = "scaleX(-1)";
    setTimeout(() => {
      vossImg.style.transform = "none";
    }, 50);
  }
}, 5000);

document.getElementById("btn-dossier").addEventListener("mouseenter", () => {
  NexusSystem.playStatic(0.5);
  document.body.classList.add("glitch-tear");
  setTimeout(() => {
    window.location.href = "profile.html";
  }, 400);
});
