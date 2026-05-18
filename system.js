const NexusSystem = {
    audioCtx: null,
    audioInitialized: false,
    mouseSpeed: 0,
    lastMouseX: 0,
    lastMouseY: 0,
    lastMouseTime: Date.now(),
    degradedElements: [],

    initAudio: function () {
        if (this.audioInitialized) return;
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return;

        this.audioCtx = new AudioContext();
        this.audioInitialized = true;
        this.startAmbience();
        this.startHardwareArtifacts();
        this.playHum();
    },

    playHum: function () {
        if (window.customScaryAudio) return;
        if (!this.audioCtx) return;
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(55, this.audioCtx.currentTime);
        gain.gain.value = 0.05;
        osc.connect(gain);
        gain.connect(this.audioCtx.destination);
        osc.start();
    },

    playBeep: function (freq = 600, type = 'square', vol = 0.05, duration = 0.05) {
        if (!this.audioCtx) return;
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);
        gain.gain.setValueAtTime(vol, this.audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + duration);
        osc.connect(gain);
        gain.connect(this.audioCtx.destination);
        osc.start();
        osc.stop(this.audioCtx.currentTime + duration);
    },

    playStatic: function (duration = 0.5, intensity = 0.05) {
        if (!this.audioCtx) return;
        const bufferSize = this.audioCtx.sampleRate * duration;
        const buffer = this.audioCtx.createBuffer(1, bufferSize, this.audioCtx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }
        const noise = this.audioCtx.createBufferSource();
        noise.buffer = buffer;

        const filter = this.audioCtx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(2000 + Math.random() * 2000, this.audioCtx.currentTime);
        filter.frequency.exponentialRampToValueAtTime(100, this.audioCtx.currentTime + duration);

        const gain = this.audioCtx.createGain();
        gain.gain.value = intensity + (Math.random() * 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + duration);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.audioCtx.destination);
        noise.start();
    },

    startAmbience: function () {
        if (window.customScaryAudio) return;
        if (!this.audioCtx) return;

        this.droneOsc = this.audioCtx.createOscillator();
        const droneGain = this.audioCtx.createGain();
        this.droneOsc.type = 'triangle';
        this.droneOsc.frequency.value = 45;

        const lfo = this.audioCtx.createOscillator();
        const lfoGain = this.audioCtx.createGain();
        lfo.type = 'sine';
        lfo.frequency.value = 0.1; 
        lfo.connect(lfoGain);
        lfoGain.connect(droneGain.gain);
        lfoGain.gain.value = 0.05; 
        droneGain.gain.value = 0.08; 

        this.droneOsc.connect(droneGain);
        droneGain.connect(this.audioCtx.destination);

        this.droneOsc.start();
        lfo.start();

        const bufferSize = this.audioCtx.sampleRate * 5;
        const noiseBuffer = this.audioCtx.createBuffer(1, bufferSize, this.audioCtx.sampleRate);
        const data = noiseBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = (Math.random() * 2 - 1) * 0.1 + (i > 0 ? data[i - 1] * 0.9 : 0);
        }
        const noiseSrc = this.audioCtx.createBufferSource();
        noiseSrc.buffer = noiseBuffer;
        noiseSrc.loop = true;

        const noiseFilter = this.audioCtx.createBiquadFilter();
        noiseFilter.type = 'lowpass';
        noiseFilter.frequency.value = 300; // Muffled distant rumble

        const noiseGain = this.audioCtx.createGain();
        noiseGain.gain.value = 0.4;

        noiseSrc.connect(noiseFilter);
        noiseFilter.connect(noiseGain);
        noiseGain.connect(this.audioCtx.destination);
        noiseSrc.start();
    },

    startHardwareArtifacts: function () {
        setInterval(() => {
            if (Math.random() > 0.7) {
                // Hard drive click
                this.playBeep(4000, 'square', 0.1, 0.01);
                setTimeout(() => this.playBeep(4200, 'square', 0.1, 0.01), 20);
                setTimeout(() => this.playBeep(3800, 'square', 0.1, 0.01), 40);
            }

            if (Math.random() > 0.95 && this.droneOsc) {
                // Massive power failure pitch down
                const now = this.audioCtx.currentTime;
                this.droneOsc.frequency.cancelScheduledValues(now);
                this.droneOsc.frequency.setValueAtTime(45, now);
                this.droneOsc.frequency.exponentialRampToValueAtTime(10, now + 1.5);
                setTimeout(() => {
                    this.droneOsc.frequency.setValueAtTime(45, this.audioCtx.currentTime);
                }, 2000);
            }
        }, 3000);
    },

    typeText: async function (elementId, text, speed = 50, useBeeps = true) {
        const el = document.getElementById(elementId);
        if (!el) return;

        el.innerHTML = '';
        const cursor = document.createElement('span');
        cursor.className = 'cursor';
        el.parentNode.insertBefore(cursor, el.nextSibling);

        let i = 0;
        return new Promise(resolve => {
            function type() {
                if (i < text.length) {
                    if (text.charAt(i) === '<') {
                        let tag = '';
                        while (text.charAt(i) !== '>' && i < text.length) {
                            tag += text.charAt(i);
                            i++;
                        }
                        tag += '>';
                        el.innerHTML += tag;
                        i++;
                    } else {
                        el.innerHTML += text.charAt(i);
                        if (useBeeps && text.charAt(i) !== ' ') {
                            NexusSystem.playBeep(800 + Math.random() * 200, 'sine', 0.02, 0.03);
                        }
                        i++;
                    }
                    setTimeout(type, speed + (Math.random() * speed));
                } else {
                    cursor.remove();
                    resolve();
                }
            }
            type();
        });
    },

    initAntiCheat: function () {
        // Detect DevTools by observing severe viewport discrepancy
        setInterval(() => {
            const threshold = 160;
            if (window.outerWidth - window.innerWidth > threshold || window.outerHeight - window.innerHeight > threshold) {
                // Punish the player
                console.log("%cI SEE YOU LOOKING.", "color: red; font-size: 40px; font-weight: bold; background: black; text-shadow: 0 0 10px red;");
                document.body.classList.add('glitch-tear');
                this.playStatic(0.5, 0.2);
            }
        }, 2000);

        // Aggressively hijack console logs
        const originalLog = console.log;
        console.log = function () {
            originalLog.apply(console, arguments);
            originalLog("%cYOU CANNOT HIDE IN THE CODE.", "color: red; font-style: italic;");
        };
    },

    startReactiveGlitching: function () {
        document.addEventListener('mousemove', (e) => {
            const now = Date.now();
            const dt = now - this.lastMouseTime;
            const dx = e.clientX - this.lastMouseX;
            const dy = e.clientY - this.lastMouseY;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (dt > 0) {
                this.mouseSpeed = distance / dt;
            }

            this.lastMouseX = e.clientX;
            this.lastMouseY = e.clientY;
            this.lastMouseTime = now;

            // If player moves mouse frantically, punish them
            if (this.mouseSpeed > 5 && Math.random() > 0.9) {
                document.body.classList.add('glitch-tear');
                this.playStatic(0.2, 0.1);
                setTimeout(() => document.body.classList.remove('glitch-tear'), 100);
            }
        });
    },

    startEscapePrevention: function () {
        document.addEventListener('mouseleave', () => {
            // Player is trying to leave the window
            const flash = document.createElement('div');
            flash.className = 'subliminal-flash';
            flash.style.fontSize = '8rem';
            flash.innerText = "DO NOT TURN AWAY";
            flash.style.opacity = '1';
            flash.style.backgroundColor = '#000';
            flash.style.width = '100vw';
            flash.style.height = '100vh';
            flash.style.display = 'flex';
            flash.style.justifyContent = 'center';
            flash.style.alignItems = 'center';
            document.body.appendChild(flash);
            this.playBeep(200, 'sawtooth', 0.3, 0.5);

            setTimeout(() => {
                flash.remove();
            }, 500);
        });
    },

    startDataDegradation: function () {
        // Slowly corrupt random text nodes on the page over time
        setInterval(() => {
            // Find all elements that might contain text
            const elements = Array.from(document.querySelectorAll('p, span, td, li, h1, h2, h3'));
            if (elements.length === 0) return;

            const target = elements[Math.floor(Math.random() * elements.length)];

            // Only corrupt if it has direct text nodes and isn't a vital puzzle element
            if (target.children.length === 0 && target.innerText.length > 5 && !target.id.includes('input') && !target.classList.contains('glitch')) {
                let text = target.innerText;
                const index = Math.floor(Math.random() * text.length);
                const chars = ['█', '#', '@', '%', '∆', '?', '_'];
                const glitchChar = chars[Math.floor(Math.random() * chars.length)];

                text = text.substring(0, index) + glitchChar + text.substring(index + 1);
                target.innerText = text;
                target.style.color = 'var(--term-dim)'; // Make it look decaying
            }
        }, 5000); // Decays every 5 seconds
    },

    enableParasiticCursor: function () {
        document.body.classList.add('no-cursor');

        const cursor = document.createElement('div');
        cursor.className = 'custom-cursor';
        document.body.appendChild(cursor);

        const trail = document.createElement('div');
        trail.className = 'cursor-trail';
        document.body.appendChild(trail);

        let mouseX = window.innerWidth / 2;
        let mouseY = window.innerHeight / 2;
        let trailX = mouseX;
        let trailY = mouseY;
        let time = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        const animateCursor = () => {
            time += 0.05;

            // The cursor subtly resists and drifts in a sine wave pattern, feeling parasitic
            const driftX = Math.sin(time) * 8;
            const driftY = Math.cos(time * 0.8) * 8;

            cursor.style.left = (mouseX + driftX) + 'px';
            cursor.style.top = (mouseY + driftY) + 'px';

            trailX += ((mouseX + driftX) - trailX) * 0.15;
            trailY += ((mouseY + driftY) - trailY) * 0.15;
            trail.style.left = trailX + 'px';
            trail.style.top = trailY + 'px';

            requestAnimationFrame(animateCursor);
        };
        animateCursor();

        // Hide standard cursors on inputs and buttons
        const interactables = document.querySelectorAll('input, button, a, .folder, .file-link');
        interactables.forEach(el => {
            el.classList.add('no-cursor');
            el.style.cursor = 'none';
        });
    },

    checkReactivated: function () {
        if (localStorage.getItem('nexus_reactivated') === 'true') {
            document.body.innerHTML = '';
            document.body.style.backgroundColor = '#000';
            document.body.style.display = 'flex';
            document.body.style.justifyContent = 'center';
            document.body.style.alignItems = 'center';

            const msg = document.createElement('div');
            msg.style.textAlign = 'center';

            const title = document.createElement('h1');
            title.className = 'glitch';
            title.setAttribute('data-text', 'NEXUS REACTIVATED');
            title.innerText = 'NEXUS REACTIVATED';
            title.style.color = '#33ff33';

            const sub = document.createElement('p');
            sub.innerText = 'NEW OPERATOR DETECTED';
            sub.style.color = '#1a801a';
            sub.style.marginTop = '20px';

            msg.appendChild(title);
            msg.appendChild(sub);

            const playAgainBtn = document.createElement('button');
            playAgainBtn.innerText = 'DE-AUTHORIZE & RESTART SYSTEM';
            playAgainBtn.style.marginTop = '40px';
            playAgainBtn.style.padding = '12px 24px';
            playAgainBtn.style.background = 'transparent';
            playAgainBtn.style.border = '1px solid #1a801a';
            playAgainBtn.style.color = '#33ff33';
            playAgainBtn.style.fontFamily = "'Courier New', Courier, monospace";
            playAgainBtn.style.fontSize = '0.9rem';
            playAgainBtn.style.letterSpacing = '2px';
            playAgainBtn.style.cursor = 'pointer';
            playAgainBtn.style.transition = 'all 0.2s';
            playAgainBtn.onmouseover = () => {
                playAgainBtn.style.background = '#1a801a';
                playAgainBtn.style.color = '#000';
            };
            playAgainBtn.onmouseout = () => {
                playAgainBtn.style.background = 'transparent';
                playAgainBtn.style.color = '#33ff33';
            };
            playAgainBtn.onclick = () => {
                localStorage.removeItem('nexus_reactivated');
                window.location.href = 'index.html';
            };
            msg.appendChild(playAgainBtn);

            document.body.appendChild(msg);

            this.initAudio();
            return true;
        }
        return false;
    },

    init: function () {
        if (this.checkReactivated()) return;

        const initInteraction = () => {
            this.initAudio();
            document.removeEventListener('click', initInteraction);
            document.removeEventListener('keydown', initInteraction);
        };
        document.addEventListener('click', initInteraction);
        document.addEventListener('keydown', initInteraction);

        console.log("%cSYSTEM OBSERVING...", "color: red; font-size: 20px; font-weight: bold; background: black;");

        this.enableParasiticCursor();
        this.startReactiveGlitching();
        this.startEscapePrevention();
        this.startDataDegradation();
        this.initAntiCheat();

        // Start random subliminal flashes as well
        setInterval(() => {
            if (Math.random() > 0.8) {
                const flash = document.createElement('div');
                flash.className = 'subliminal-flash';
                flash.innerText = "I REMEMBER";
                document.body.appendChild(flash);
                flash.style.opacity = '1';
                setTimeout(() => flash.remove(), 30);
            }
        }, 45000);
    }
};

document.addEventListener('DOMContentLoaded', () => {
    NexusSystem.init();
});
