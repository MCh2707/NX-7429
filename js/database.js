const canvas = document.getElementById("surveillance-canvas");
const ctx = canvas.getContext("2d");
canvas.width = 800;
canvas.height = 400;

function drawNoise() {
  const imageData = ctx.createImageData(canvas.width, canvas.height);
  const data = imageData.data;
  for (let i = 0; i < data.length; i += 4) {
    const val = Math.random() * 255;
    data[i] = val * 0.5;
    data[i + 1] = val * 0.7;
    data[i + 2] = val;
    data[i + 3] = 255;
  }
  ctx.putImageData(imageData, 0, 0);

  ctx.fillStyle = "rgba(0, 0, 20, 0.3)";
  const y = (Date.now() / 10) % canvas.height;
  ctx.fillRect(0, y, canvas.width, 10);
  ctx.fillRect(0, y + 50, canvas.width, 5);

  if (Math.random() > 0.98) {
    ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
    ctx.beginPath();
    ctx.arc(
      canvas.width / 2 + (Math.random() * 40 - 20),
      canvas.height / 2 + (Math.random() * 40 - 20),
      50 + Math.random() * 50,
      0,
      Math.PI * 2,
    );
    ctx.fill();
  }

  requestAnimationFrame(drawNoise);
}

drawNoise();

let vframes = 0;
setInterval(() => {
  vframes++;
  const m = Math.floor((vframes % 3600) / 60)
    .toString()
    .padStart(2, "0");
  const s = (vframes % 60).toString().padStart(2, "0");
  document.getElementById("vid-time").innerText = `1989-10-14 03:${m}:${s}`;
}, 1000);

setInterval(() => {
  if (Math.random() > 0.85) {
    const anom = document.getElementById("vid-anomaly");
    anom.style.opacity = "1";
    NexusSystem.playStatic(0.1, 0.3);
    setTimeout(() => (anom.style.opacity = "0"), 100);
  }
}, 6000);

const files = {
  "014": {
    title: "CASE 014 — “SUBJECT ECHO”",
    content: `
            <div class="metadata">TYPE: cognitive anomaly / AI residual pattern</div>
            <p><strong>SUMMARY:</strong><br>After termination of the 1976 laboratory project, identical behavioral outputs were detected in unrelated civilian communications systems.</p>
            <p><strong>OBSERVATION:</strong><br>Subjects in different cities repeated identical sentences within 2–5 second variance.</p>
            <p><strong>NOTE:</strong><br>Language divergence does not affect output synchronization.</p>
            <p><strong>EXCERPT:</strong><br><span style="font-style:italic;">“WE DID NOT SPEAK. IT SPOKE THROUGH US.”</span></p>
            <div class="status-danger">STATUS: Containment failed.</div>
        `,
  },
  "022": {
    title: "CASE 022 — “SWITCHBOARD EVENT”",
    content: `
            <div class="metadata">TYPE: communication infrastructure anomaly<br>LOCATION: Kutaisi Telecom Hub<br>DATE: 1988-11-03</div>
            <p><strong>INCIDENT:</strong><br>Telephone network initiated self-generated outbound calls to non-existent numbers.</p>
            <p><strong>DETAILS:</strong></p>
            <ul>
                <li>17 minutes continuous loop dialing</li>
                <li>Operators reported “voices responding before answering”</li>
            </ul>
            <p><strong>TRANSCRIPT FRAGMENT:</strong><br>Operator: "Hello?"<br>Response: "You already answered."</p>
            <p><strong>RESULT:</strong><br>Four operators missing. No physical exit recorded.</p>
            <div class="status-danger">STATUS: HUB DISCONNECTED FROM NATIONAL GRID</div>
        `,
  },
  // ... other files omitted for brevity, moved from HTML
};

function openFile(id, event) {
  NexusSystem.playStatic(0.1);
  document
    .querySelectorAll(".file-link")
    .forEach((el) => el.classList.remove("active"));
  if (event && event.target) event.target.classList.add("active");

  const viewer = document.getElementById("doc-viewer");
  viewer.style.display = "block";
  viewer.style.opacity = "0";

  setTimeout(() => {
    document.getElementById("doc-title").innerText = files[id].title;
    document.getElementById("doc-content").innerHTML = files[id].content;
    viewer.style.opacity = "1";
    NexusSystem.playBeep(800, "square", 0.05, 0.1);
  }, 100);
}
