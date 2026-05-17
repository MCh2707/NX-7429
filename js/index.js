document.addEventListener("DOMContentLoaded", async () => {
  if (NexusSystem.checkReactivated()) return;

  setTimeout(async () => {
    const intro =
      "Recovery node detected.<br><br>Incoming emergency transmission...<br>";
    await NexusSystem.typeText("intro-text", intro, 100);

    setTimeout(async () => {
      const el = document.getElementById("intro-text");
      el.innerHTML +=
        "<br><span class='dim'>[AUDIO TRANSCRIPT]: If you are hearing this, the system has already failed.</span>";
      NexusSystem.playStatic(1.5);

      setTimeout(() => {
        document.getElementById("btn-container").classList.remove("hidden");
      }, 3000);
    }, 2500);
  }, 4000);

  document.getElementById("btn-access").addEventListener("click", () => {
    NexusSystem.playBeep(800, "square", 0.1, 0.1);
    document.getElementById("btn-container").classList.add("hidden");
    document.getElementById("login-form-container").classList.remove("hidden");
  });

  document.getElementById("btn-login-submit").addEventListener("click", () => {
    const user = document.getElementById("login-user").value.trim();
    const pass = document.getElementById("login-pass").value.trim();

    if (user === "EV-7429" && pass === "genesis") {
      NexusSystem.playBeep(1500, "sine", 0.1, 0.2);
      document.getElementById("login-error").classList.add("hidden");

      document.getElementById("error-msg").innerText =
        "AUTHENTICATION SUCCESSFUL. REDIRECTING...";
      document.getElementById("error-msg").classList.remove("hidden");
      document.getElementById("error-msg").classList.remove("error");

      setTimeout(() => {
        document.body.classList.add("glitch-tear");
        NexusSystem.playStatic(0.5);
      }, 500);

      setTimeout(() => {
        const overlay = document.getElementById("glitch-overlay");
        overlay.classList.remove("hidden");
        overlay.style.opacity = "1";
        window.location.href = "dashboard.html";
      }, 1500);
    } else {
      NexusSystem.playBeep(200, "sawtooth", 0.1, 0.3);
      document.getElementById("login-error").classList.remove("hidden");
      document.getElementById("login-user").value = "";
      document.getElementById("login-pass").value = "";
    }
  });

  document.getElementById("btn-status").addEventListener("click", () => {
    NexusSystem.playBeep(1200, "sine", 0.1, 0.1);
    document.getElementById("status-container").classList.toggle("hidden");
  });
});
