document.getElementById("archive-pin").addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    const val = e.target.value.trim();
    if (val === "7429") {
      NexusSystem.playBeep(1200, "sine", 0.1, 0.2);
      document.body.innerHTML =
        '<div style="background:#000; color:#33ff33; width:100vw; height:100vh; position:fixed; top:0; left:0; display:flex; align-items:center; justify-content:center; flex-direction:column; font-family:monospace; z-index:9999;"><h1 class="glitch" data-text="ACCESS GRANTED">ACCESS GRANTED</h1><p>Decrypting archive server...</p></div>';
      setTimeout(() => {
        window.location.href = "archive.html";
      }, 1500);
    } else {
      NexusSystem.playBeep(200, "square", 0.1, 0.4);
      e.target.value = "";
      e.target.placeholder = "INVALID PIN";
      setTimeout(() => {
        e.target.placeholder = "****";
      }, 2000);
    }
  }
});
