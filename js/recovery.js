document.addEventListener('DOMContentLoaded', () => {
  NexusSystem.playHum();
  NexusSystem.playStatic(0.5);

  const subs = [
    "It's me...",
    "please, follow my instructions...",
    "You think they wanted to hide the truth.",
    "No.",
    "They wanted to bury it.",
    "But I left a way back.",
    "Find the console."
  ];

  let index = 0;
  const subEl = document.getElementById('subtitles');

  function showSubs() {
    if (index < subs.length) {
      subEl.innerText = subs[index];

      if (index === 2) {
        NexusSystem.playBeep(2000, 'square', 0.1, 0.1);
        const frame = document.getElementById('flash-frame');
        frame.style.opacity = '1';
        setTimeout(() => {
          frame.style.opacity = '0';
        }, 100);
      }

      index++;
      setTimeout(showSubs, 3000);
    } else {
      subEl.innerText = "[ SIGNAL TERMINATED ]";
      NexusSystem.playStatic(1);
    }
  }

  setTimeout(showSubs, 2000);
});