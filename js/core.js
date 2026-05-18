// Session remains locked if reactivated

document.addEventListener("DOMContentLoaded", () => {
  NexusSystem.playBeep(400, "square", 0.1, 100);

  const alarmInterval = setInterval(() => {
    NexusSystem.playBeep(400, "square", 0.1, 0.5);
    setTimeout(() => NexusSystem.playBeep(600, "square", 0.1, 0.5), 500);
  }, 1000);

  let time = 299;
  const cdEl = document.getElementById("countdown");
  const timer = setInterval(() => {
    time--;
    const m = Math.floor(time / 60)
      .toString()
      .padStart(2, "0");
    const s = (time % 60).toString().padStart(2, "0");
    cdEl.innerText = `${m}:${s}`;
    if (time <= 0) clearInterval(timer);
  }, 1000);

  const inputEl = document.getElementById("shutdown-code");
  const hintEl = document.createElement("div");
  hintEl.style.color = "rgba(255, 255, 255, 0.2)";
  hintEl.style.marginTop = "20px";
  hintEl.style.fontSize = "1.1rem";
  hintEl.style.fontFamily = "'Times New Roman', Times, serif";
  hintEl.style.fontStyle = "italic";
  hintEl.style.letterSpacing = "8px";
  hintEl.style.minHeight = "30px";
  hintEl.style.textShadow = "0 0 5px rgba(255,255,255,0.1)";
  document.getElementById("input-section").appendChild(hintEl);

  let hintLevel = 0;
  inputEl.addEventListener("input", () => {
    const val = inputEl.value.trim().toLowerCase();
    if (val === "ac" && hintLevel < 1) {
      hintLevel = 1;
      hintEl.innerText = "Don't.██ t██s.";
      NexusSystem.playStatic(0.1);
    } else if (val === "activate" && hintLevel < 2) {
      hintLevel = 2;
      hintEl.innerText = "D█n't lis█en t█ █E██S.";
      NexusSystem.playStatic(0.4, 0.2);
      document.body.classList.add("glitch-tear");
      setTimeout(() => document.body.classList.remove("glitch-tear"), 300);
    } else if (val !== "activate" && val !== "ac") {
      hintEl.innerText = "";
      hintLevel = 0;
    }
  });

  document.getElementById("btn-submit").addEventListener("click", () => {
    const val = document
      .getElementById("shutdown-code")
      .value.trim()
      .toLowerCase();
    if (val !== "activate") {
      alert("INVALID COMMAND");
      return;
    }

    clearInterval(timer);
    clearInterval(alarmInterval);
    document.getElementById("input-section").classList.add("hidden");
    document.getElementById("ending-sequence").classList.remove("hidden");

    runEnding();
  });

  async function runEnding() {
    NexusSystem.playHum();

    document.getElementById("activation-window").style.display = "block";

    await NexusSystem.typeText(
      "act-text-1",
      "If you are reading this, you were always a part of this system..",
      120,
      true,
    );
    await new Promise((r) => setTimeout(r, 3500));

    document
      .getElementById("act-text-2")
      .setAttribute("data-text", "NEXUS REACTIVATED");
    await NexusSystem.typeText("act-text-2", "NEXUS REACTIVATED", 400, true);

    await new Promise((r) => setTimeout(r, 3000));
    await NexusSystem.typeText(
      "act-text-3",
      "NEW OPERATOR DETECTED",
      150,
      true,
    );

    setTimeout(() => {
      document.getElementById("blackout-screen").classList.add("active");
      setTimeout(async () => {
        const fm = document.getElementById("final-message");
        fm.innerHTML =
          "This game was created by MCh27<br>All files, events, and systems presented in this experience are fictional.";
        NexusSystem.playStatic(2);

        setTimeout(() => {
          fm.innerHTML = "";

          setTimeout(() => {
            localStorage.setItem("nexus_reactivated", "true");
            location.reload();
          }, 4000);
        }, 5000);
      }, 2000);
    }, 4000);
  }
});
