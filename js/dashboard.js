// CYRANET INTRANET — EMPLOYEE TERMINAL v4.2
// dashboard.js — Session handler for E.VOSS@CYR-WS-07

// --- Clock ---
const clockEl = document.getElementById('sys-clock');
function updateClock() {
  const now = new Date();
  // Occasionally show the "frozen" time as an eerie detail
  if (Math.random() > 0.97) {
    clockEl.textContent = '07:42:00';
    clockEl.style.color = 'var(--warn)';
    setTimeout(() => { clockEl.style.color = ''; }, 1200);
  } else {
    clockEl.textContent = now.toLocaleTimeString('en-GB');
  }
}
setInterval(updateClock, 1000);
updateClock();

// --- Profile panel ---
function toggleProfile() {
  const panel = document.getElementById('profile-panel');
  panel.classList.toggle('open');
  if (typeof NexusSystem !== 'undefined') NexusSystem.playBeep(900, 'sine', 0.05, 0.08);
}

// --- Navigation sequence puzzle ---
// Sequence: Research Logs → Employee Messages → Research Logs → unlocks Deleted Files
const unlockSeq = ['inbox', 'proj', 'inbox'];
let seqIndex = 0;

function handleNavSeq(id) {
  if (typeof NexusSystem !== 'undefined') NexusSystem.playBeep(700, 'square', 0.03, 0.06);

  if (id === 'sec') {
    // Archive Access → navigate to archive
    if (typeof NexusSystem !== 'undefined') NexusSystem.playBeep(900, 'sine', 0.05, 0.15);
    setTimeout(() => { window.location.href = 'archive.html'; }, 200);
    return;
  }

  if (id === 'priv') {
    const el = document.getElementById('nav-deleted');
    if (el.style.pointerEvents === 'all') {
      window.location.href = 'profile.html';
    }
    return;
  }

  // Sequence tracking
  if (id === unlockSeq[seqIndex]) {
    seqIndex++;
    if (seqIndex === unlockSeq.length) {
      seqIndex = 0;
      // Unlock "Deleted Files"
      const navDel = document.getElementById('nav-deleted');
      navDel.classList.remove('nav-unlock');
      navDel.style.opacity = '1';
      navDel.style.pointerEvents = 'all';
      navDel.innerHTML = '<span class="nav-icon">&#9658;</span>Deleted Files <span style="font-size:0.6rem;color:var(--ok);">[UNLOCKED]</span>';
      if (typeof NexusSystem !== 'undefined') NexusSystem.playBeep(1200, 'sine', 0.1, 0.4);

      const flash = document.createElement('div');
      flash.style.cssText = 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);font-family:monospace;font-size:0.9rem;color:#4a7a4a;pointer-events:none;z-index:9999;opacity:1;transition:opacity 1s;';
      flash.textContent = 'DIRECTORY ACCESS GRANTED';
      document.body.appendChild(flash);
      setTimeout(() => { flash.style.opacity = '0'; setTimeout(() => flash.remove(), 1000); }, 1500);
    }
  } else {
    seqIndex = 0;
  }
}

// --- Ghost file ---
const ghostFile = document.getElementById('ghost-file');
if (ghostFile) {
  setInterval(() => {
    if (Math.random() > 0.72) {
      ghostFile.classList.add('visible');
      setTimeout(() => ghostFile.classList.remove('visible'), 1200);
    }
  }, 7000);

  ghostFile.addEventListener('click', (e) => {
    e.preventDefault();
    if (typeof NexusSystem !== 'undefined') NexusSystem.playBeep(1800, 'square', 0.08, 0.1);
    ghostFile.classList.remove('visible');
    // Show small inline message, no alert()
    const msg = document.createElement('span');
    msg.style.cssText = 'margin-left:12px;font-size:0.68rem;color:var(--err);';
    msg.textContent = '[CORRUPTED — FRAGMENT: "THEY ARE LISTENING"]';
    ghostFile.parentNode.appendChild(msg);
    setTimeout(() => msg.remove(), 3000);
  });
}

// --- Voss photo subtle glitch ---
const vossImg = document.getElementById('voss-img');
if (vossImg) {
  setInterval(() => {
    if (Math.random() > 0.92) {
      vossImg.style.transform = 'scaleX(-1)';
      setTimeout(() => { vossImg.style.transform = 'none'; }, 60);
    }
  }, 6000);
}

// --- Dossier button ---
const btnDossier = document.getElementById('btn-dossier');
if (btnDossier) {
  btnDossier.addEventListener('click', () => {
    if (typeof NexusSystem !== 'undefined') NexusSystem.playBeep(900, 'sine', 0.05, 0.1);
    window.location.href = 'profile.html';
  });
}

// --- Subtle background instability (very occasional column shift) ---
let instabilityTimer = null;
function scheduleInstability() {
  const delay = 15000 + Math.random() * 30000;
  instabilityTimer = setTimeout(() => {
    document.documentElement.style.transform = 'translateX(1px)';
    setTimeout(() => {
      document.documentElement.style.transform = '';
      scheduleInstability();
    }, 80);
  }, delay);
}
scheduleInstability();
