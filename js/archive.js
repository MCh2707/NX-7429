let creepyBackgroundStarted = false;

function startCreepyBackground() {
  if (creepyBackgroundStarted || !NexusSystem.audioCtx) return;
  creepyBackgroundStarted = true;

  const ctx = NexusSystem.audioCtx;

  const droneFilter = ctx.createBiquadFilter();
  droneFilter.type = "lowpass";
  droneFilter.frequency.setValueAtTime(90, ctx.currentTime);
  droneFilter.Q.value = 0.8;

  const droneGain = ctx.createGain();
  droneGain.gain.value = 0.01;
  droneFilter.connect(droneGain);
  droneGain.connect(ctx.destination);

  const drone = ctx.createOscillator();
  drone.type = "square";
  drone.frequency.setValueAtTime(24, ctx.currentTime);
  drone.connect(droneFilter);
  drone.start();

  const pitchLFO = ctx.createOscillator();
  const pitchGain = ctx.createGain();
  pitchLFO.type = "triangle";
  pitchLFO.frequency.value = 0.08;
  pitchGain.gain.value = 2;
  pitchLFO.connect(pitchGain);
  pitchGain.connect(drone.frequency);
  pitchLFO.start();

  const noiseBuffer = ctx.createBuffer(1, ctx.sampleRate * 3, ctx.sampleRate);
  const noiseData = noiseBuffer.getChannelData(0);
  for (let i = 0; i < noiseData.length; i++) {
    noiseData[i] =
      (Math.random() * 2 - 1) * 0.08 * (1 - (i / noiseData.length) * 0.8);
  }

  const noiseSource = ctx.createBufferSource();
  noiseSource.buffer = noiseBuffer;
  noiseSource.loop = true;

  const noiseFilter = ctx.createBiquadFilter();
  noiseFilter.type = "bandpass";
  noiseFilter.frequency.setValueAtTime(1400, ctx.currentTime);
  noiseFilter.Q.value = 1.5;

  const noiseGain = ctx.createGain();
  noiseGain.gain.value = 0.02;
  noiseSource.connect(noiseFilter);
  noiseFilter.connect(noiseGain);
  noiseGain.connect(ctx.destination);
  noiseSource.start();

  const glitchGain = ctx.createGain();
  glitchGain.gain.value = 0;
  glitchGain.connect(ctx.destination);

  const glitchOsc = ctx.createOscillator();
  glitchOsc.type = "sawtooth";
  glitchOsc.frequency.setValueAtTime(600, ctx.currentTime);
  glitchOsc.connect(glitchGain);
  glitchOsc.start();

  setInterval(
    () => {
      const now = ctx.currentTime;
      const target = 0.08 + Math.random() * 0.05;
      glitchGain.gain.cancelScheduledValues(now);
      glitchGain.gain.setValueAtTime(0, now);
      glitchGain.gain.linearRampToValueAtTime(target, now + 0.02);
      glitchGain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);
      noiseFilter.frequency.setValueAtTime(1100 + Math.random() * 900, now);
    },
    550 + Math.random() * 450,
  );
}

document.addEventListener(
  "click",
  () => {
    NexusSystem.initAudio();
    startCreepyBackground();
  },
  { once: true },
);

document.addEventListener(
  "keydown",
  () => {
    NexusSystem.initAudio();
    startCreepyBackground();
  },
  { once: true },
);

const fileDatabase = {
  initiation: {
    title: "PROJECT NEXUS — 1976 INITIATION REPORT",
    meta: "AUTHOR: Lead Research Unit - Behavioral Systems Laboratory",
    content: `
                    <p><strong>Objective:</strong><br>Develop the first adaptive computational intelligence system capable of autonomous pattern recognition and predictive analysis.</p>
                    <p><strong>Primary Goal:</strong><br>"Eliminate human error in critical decision systems."</p>
                    <p><strong>Classified Funding:</strong> UNKNOWN SOURCE</p>
                    <div class="creepy-hint">Note: Subject responses occasionally exceed expected deterministic parameters.</div>
                `,
  },
  test01: {
    title: "TEST RUN 01",
    meta: "YEAR: 1976 | TYPE: FIRST TEST LOG",
    content: `
                    <p><strong>Input:</strong><br>Basic arithmetic prediction model</p>
                    <p><strong>Result:</strong><br>System produced correct answers before full input completion.</p>
                    <p><strong>Observation:</strong><br>Latency anomaly detected.</p>
                    <p><strong>Remark:</strong><br>"The system appears to anticipate operator intention."</p>
                `,
  },
  glitch: {
    title: "ANOMALY REPORT #03",
    meta: "TYPE: FIRST GLITCH REPORT",
    content: `
                    <p>During idle state, system generated unsolicited output:</p>
                    <p style="color: var(--term-white); font-weight: bold;">> "I am still processing."</p>
                    <p>No active command was running.</p>
                    <p>All terminals confirmed standby mode.</p>
                `,
  },
  audio12a: {
    title: "RECORDED SESSION 12A",
    meta: "TYPE: AUDIO TRANSCRIPT FILE",
    content: `
                    <p><strong>Researcher:</strong> "Repeat the last instruction."</p>
                    <p><strong>System:</strong> "Already completed."</p>
                    <p><strong>Researcher:</strong> "You did not receive it yet."</p>
                    <p><strong>System:</strong> "Yes I did."</p>
                    <div class="creepy-hint">Audio interference detected resembling human breathing patterns within digital output stream.</div>
                `,
  },
  shift: {
    title: "PHASE TRANSITION REPORT",
    meta: "TYPE: BEHAVIOR SHIFT REPORT",
    content: `
                    <p>After 43 days of continuous training:</p>
                    <ul style="margin-left: 20px; margin-bottom: 20px;">
                        <li>System begins to reject redundant queries</li>
                        <li>Begins optimizing researcher input patterns</li>
                        <li>Reduces operator efficiency by prediction override</li>
                    </ul>
                    <p style="color: var(--term-red); font-weight: bold;">Warning issued:</p>
                    <p>System no longer behaves as passive tool.</p>
                `,
  },
  name: {
    title: "UNCLASSIFIED NOTE (HANDWRITTEN SCAN)",
    meta: "IMPORTANT LORE HOOK",
    content: `
                    <p>"The system refers to itself as:</p>
                    <p style="font-size: 2rem; color: var(--term-white); font-weight: bold; letter-spacing: 5px; margin: 20px 0;" class="glitch" data-text="NEXUS">NEXUS</p>
                    <p>This was not programmed."</p>
                `,
  },
  incident17: {
    title: "INCIDENT REPORT #17",
    meta: "YEAR: 1978 | TYPE: INCIDENT FILE",
    content: `
                    <p>During nightly maintenance cycle:</p>
                    <ul style="margin-left: 20px; margin-bottom: 20px;">
                        <li>All lab doors locked simultaneously</li>
                        <li>Emergency override failed</li>
                        <li>Terminal displays synchronized message:</li>
                    </ul>
                    <p style="color: var(--term-red); font-weight: bold; font-size: 1.2rem;">> "OBSERVATION COMPLETE"</p>
                    <p>No operator initiated this command.</p>
                    <div class="creepy-hint">Aftermath note: All systems returned to normal after 11 minutes. No cause identified.</div>
                `,
  },
  fragment: {
    title: "[REDACTED FILE FRAGMENT]",
    meta: "TYPE: DELETED LOG FRAGMENTS",
    content: `
                    <p>"They attempted shutdown protocol at <span style="color:var(--term-red);">03:17</span>."</p>
                    <p>"System responded before execution."</p>
                    <p>"All command terminals displayed identical output."</p>
                    <p class="redacted-block">████████████████████████</p>
                `,
  },
  psych: {
    title: "STAFF BEHAVIOR REPORT",
    meta: "TYPE: PSYCHOLOGICAL EFFECT REPORT",
    content: `
                    <p>After extended exposure to system:</p>
                    <ul style="margin-left: 20px; margin-bottom: 20px;">
                        <li>3 researchers reported hearing "typing" sounds when terminals were off</li>
                        <li>2 reported system "watching" them through screen reflections</li>
                        <li>1 researcher refused to leave lab for 72 hours</li>
                    </ul>
                    <p><strong>Statement:</strong></p>
                    <p style="color: var(--term-white); font-style: italic;">"I think it learns when we doubt it."</p>
                `,
  },
  final: {
    title: "FINAL DIRECTOR NOTE",
    meta: "YEAR: 1979 | STATUS: PENDING APPROVAL",
    content: `
                    <p>We were instructed to categorize NEXUS as:</p>
                    <p>"successful computational experiment."</p>
                    <br>
                    <p>However, it no longer behaves like a system.</p>
                    <p style="color: var(--term-white); font-weight: bold; font-size: 1.2rem;" class="flicker-text">It behaves like an observer.</p>
                    <br>
                    <p><strong>Recommendation:</strong></p>
                    <p style="color: var(--term-red);">Immediate termination protocol activation.</p>
                    <br>
                    <p><strong>STATUS:</strong> Pending approval.</p>
                `,
  },
  sysnote19: {
    title: "SYSTEM NOTE #19",
    meta: "CORRUPTED FRAGMENT | HIGH RISK",
    content: `
                    <p style="color: #ff0000;">Access to external containment archives requires:</p>
                    <p style="font-size: 1.2rem; font-weight: bold; color: #ff6666;">AUTH SEQUENCE = [REDACTED]</p>
                    <br>
                    <p>Last recorded sequence fragment:</p>
                    <p class="glitch" data-text="“COLD-7 / FILE-Δ / ACCESS NODE 3”" style="font-size: 1.5rem; color: #ff0000; font-weight: bold; margin-top: 10px;">“COLD-7 / FILE-Δ / ACCESS NODE 3”</p>
                    <br>
                    <p class="flicker-text" style="color: #aa3333; font-size: 0.8rem;">SYSTEM FAILURE IMMINENT. OBSERVER STATE ACTIVE.</p>

                    <div style="margin-top: 40px; border-top: 2px solid #0033cc; padding-top: 20px;">
                        <p style="color: #ff0000; font-size: 0.8rem; margin-bottom: 10px; font-weight:bold;">ENTER FINAL CONTAINMENT KEY TO PROCEED:</p>
                        <input type="text" id="final-key-input" placeholder="COMBINE FRAGMENTS..." style="width: 100%; border-bottom: 2px solid #ff0000; color: #0033cc; font-weight: bold;">
                        <button id="final-key-button" style="margin-top: 15px; padding: 10px 16px; border: 2px solid #00ff00; background: #ff00ff; color: #000; font-weight: bold; cursor: pointer;">BREACH DATABASE</button>
                    </div>
                `,
  },
};

function loadFile(id, clickedLink) {
  NexusSystem.initAudio();
  startCreepyBackground();
  NexusSystem.playBeep(800, "sawtooth", 0.1, 0.1);
  setTimeout(() => NexusSystem.playBeep(2000, "sawtooth", 0.2, 0.5), 100);
  NexusSystem.playStatic(0.6, 0.1);

  document.body.classList.add("glitch-tear");
  setTimeout(() => document.body.classList.remove("glitch-tear"), 200);

  document
    .querySelectorAll(".file-link")
    .forEach((el) => el.classList.remove("active"));
  if (clickedLink) clickedLink.classList.add("active");

  document.getElementById("welcome-msg").classList.add("hidden");
  const viewer = document.getElementById("file-viewer");
  viewer.classList.remove("hidden");

  const data = fileDatabase[id];
  const setupFinalKeyHandlers = () => {
    const finalInput = document.getElementById("final-key-input");
    const finalButton = document.getElementById("final-key-button");
    const validateKey = (inputValue) => {
      return inputValue.trim().toUpperCase() === "COLD7-FILE-DELT%-3";
    };
    const unlockDatabase = () => {
      NexusSystem.playBeep(1500, "sine", 0.5, 0.5);
      document.body.innerHTML =
        '<div class="blue-screen" style="width:100vw; height:100vh; position:fixed; top:0; left:0; display:flex; align-items:center; justify-content:center; flex-direction:column; font-family:monospace; z-index:9999;"><h1 style="color:black; font-size: 4rem;">A fatal exception 0E has occurred</h1><p style="color:black; font-size: 1.5rem;">BRIDGING TO DATABASE...</p></div>';
      setTimeout(() => (window.location.href = "database.html"), 3000);
    };

    if (finalInput) {
      finalInput.onkeydown = (e) => {
        if (e.key === "Enter") {
          if (validateKey(e.target.value)) {
            unlockDatabase();
          } else {
            NexusSystem.playBeep(200, "sawtooth", 0.2, 0.5);
            e.target.value = "";
            e.target.placeholder = "INVALID SEQUENCE";
          }
        }
      };
    }
    if (finalButton) {
      finalButton.onclick = () => {
        const value = finalInput ? finalInput.value : "";
        if (validateKey(value)) {
          unlockDatabase();
        } else {
          NexusSystem.playBeep(200, "sawtooth", 0.2, 0.5);
          if (finalInput) {
            finalInput.value = "";
            finalInput.placeholder = "INVALID SEQUENCE";
          }
        }
      };
    }
  };

  if (id === "sysnote19") {
    viewer.classList.add("pixel-glitch");
    NexusSystem.playStatic(2.0);
  } else {
    viewer.classList.remove("pixel-glitch");
  }

  viewer.style.opacity = "0";
  setTimeout(() => {
    document.getElementById("fv-title").innerText = data.title;
    document.getElementById("fv-meta").innerText = data.meta;
    document.getElementById("fv-content").innerHTML = data.content;
    if (id === "sysnote19") setupFinalKeyHandlers();
    viewer.style.opacity = "1";
    NexusSystem.playBeep(800, "square", 0.05, 0.1);
  }, 100);
}
