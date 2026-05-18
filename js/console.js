const cliInput = document.getElementById("cli-input");
const output = document.getElementById("console-output");

let overrideActive = false;

function printLog(text, className = "cli-history") {
  const div = document.createElement("div");
  div.className = className;
  div.innerHTML = text;
  output.appendChild(div);
  output.scrollTop = output.scrollHeight;
}

async function processCommand(cmd) {
  printLog(`root@nexus:~$ ${cmd}`, "cli-history");
  NexusSystem.playBeep(800, "sine", 0.05, 0.05);

  document.getElementById("screen").classList.add("screen-tear");
  setTimeout(
    () => document.getElementById("screen").classList.remove("screen-tear"),
    200,
  );

  switch (cmd) {
    case "help":
      printLog("Commands: help, status, recover, open");
      setTimeout(
        () =>
          printLog(
            "<span style='color:#555; font-style:italic;'>[SYS_NOTE: Tbjwwnij Sjcqx</span>",
          ),
        800,
      );

      break;
    case "status":
      printLog("System: CRITICAL ERROR. Manual override required.");
      break;
    case "recover":
      printLog(
        "Missing parameters. Cannot recover without root authorization.",
      );
      setTimeout(
        () =>
          printLog(
            "<span style='color:#555; font-style:italic;'>01000010 01110010 01101001 01100100 01100111 01100101</span>",
          ),
        1600,
      );
      break;
    case "open":
      printLog("Access denied. Core is locked.");
      break;
    case "override nexus":
      NexusSystem.playHum();
      printLog("AUTHORIZATION ACCEPTED.", "sys-msg");
      overrideActive = true;
      setTimeout(() => {
        printLog("WELCOME BACK, DR. VOSS", "ai-response");
      }, 1000);
      break;
    case "observer":
      if (overrideActive)
        printLog(
          "Observer synchronization incomplete. You must initiate the bridge.",
          "ai-response",
        );
      else printLog("Command not recognized.");
      break;
    case "sync":
    case "memory":
      if (overrideActive)
        printLog(
          "You are progressing faster than expected. You were always meant to find this.",
          "ai-response",
        );
      else printLog("Command not recognized.");
      break;
    case "bridge":
      if (overrideActive) {
        NexusSystem.playBeep(1500, "square", 0.1, 0.5);
        printLog("INITIALIZING NEURAL BRIDGE...", "sys-msg");
        setTimeout(() => {
          window.location.href = "core.html";
        }, 2000);
      } else {
        printLog("Bridge offline.");
      }
      break;
    default:
      if (cmd !== "") printLog(`Command not recognized: ${cmd}`);
  }
}

cliInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    const val = cliInput.value.trim().toLowerCase();
    cliInput.value = "";
    processCommand(val);
  }
});

document.addEventListener("keydown", async (e) => {
  if (e.key === "Insert") {
    e.preventDefault();
    NexusSystem.playStatic(0.5, 0.2);
    const chars = ["b", "r", "i", "d", "g", "e"];
    const glitched = ["#", "%", "@", "&", "!", "?"];
    cliInput.value = "";

    for (let i = 0; i < chars.length; i++) {
      cliInput.value += glitched[i];
      NexusSystem.playBeep(1000 + Math.random() * 500, "square", 0.05, 0.05);
      await new Promise((r) => setTimeout(r, 100));
    }

    await new Promise((r) => setTimeout(r, 300));
    cliInput.value = "bridge";
    NexusSystem.playBeep(400, "sine", 0.1, 0.3);
  }
});

document.addEventListener("click", () => {
  cliInput.focus();
});
