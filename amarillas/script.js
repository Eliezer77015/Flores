/* Estrellas y Partículas de Fondo */
const sparklesContainer = document.getElementById('sparkles-container');

function createSparkle() {
  const el = document.createElement('div');
  const isStar = Math.random() > 0.3;
  
  el.className = isStar ? 'twinkle-star absolute rounded-full bg-yellow-200' : 'floating-sparkle absolute text-yellow-300/80';
  
  const size = Math.random() * 4 + 2;
  const left = Math.random() * 100;
  const top = Math.random() * 100;
  const duration = Math.random() * 6 + 3;
  const delay = Math.random() * 5;

  if (isStar) {
    el.style.width = `${size}px`;
    el.style.height = `${size}px`;
    el.style.left = `${left}%`;
    el.style.top = `${top}%`;
    el.style.boxShadow = `0 0 ${size * 2}px #fef08a`;
    el.style.setProperty('--duration', `${duration}s`);
    el.style.setProperty('--delay', `${delay}s`);
  } else {
    el.innerText = Math.random() > 0.5 ? '✦' : '★';
    el.style.fontSize = `${Math.random() * 12 + 8}px`;
    el.style.left = `${left}%`;
    el.style.bottom = `-5%`;
    el.style.setProperty('--duration', `${duration + 4}s`);
    el.style.setProperty('--delay', `${delay}s`);
  }

  sparklesContainer.appendChild(el);
}

for (let i = 0; i < 40; i++) {
  createSparkle();
}

/* GENERADOR DE IMÁGENES PIXEL ART FLOTANTES */
const pixelImages = [
  'eevee.png',
  'vaporeon.png',
  'miku.png',
  'nightcrowler.png',
  'spiderman1.png',
  'spiderman2.png',
  'spiderman3.png'
];

function spawnPixelArt() {
  if (!sparklesContainer) return;

  const img = document.createElement('img');
  const randomImage = pixelImages[Math.floor(Math.random() * pixelImages.length)];
  
  img.src = randomImage;
  img.alt = 'Pixel Art';
  img.className = 'pixel-art-float';

  // Tamaño aleatorio entre 48px y 72px
  const size = Math.floor(Math.random() * 25) + 48;
  img.style.width = `${size}px`;
  img.style.height = 'auto';

  // Posición aleatoria horizontal (entre 5% y 85%)
  const posX = Math.floor(Math.random() * 80) + 5;
  img.style.left = `${posX}%`;

  // Posición aleatoria vertical en la pantalla
  const posY = Math.floor(Math.random() * 70) + 15;
  img.style.top = `${posY}%`;

  // Duración de la animación flotante (entre 9s y 14s)
  const duration = (Math.random() * 5 + 9).toFixed(1);
  img.style.animationDuration = `${duration}s`;

  sparklesContainer.appendChild(img);

  // Eliminar la imagen del DOM una vez termine su animación
  setTimeout(() => {
    if (img.parentNode) {
      img.parentNode.removeChild(img);
    }
  }, duration * 1000);
}

// Iniciar creando algunas imágenes y luego una nueva cada 3.5 segundos
for (let i = 0; i < 3; i++) {
  setTimeout(spawnPixelArt, i * 1200);
}
setInterval(spawnPixelArt, 3500);


/* Audio Player Sintetizado / MP3 */
class MeltdownAudioPlayer {
  constructor() {
    this.audioCtx = null;
    this.isPlaying = false;
    this.isCustomFile = true;
    this.currentTime = 0;
    this.totalDuration = 328;
    this.timer = null;
    this.noteIndex = 0;
    this.nativeAudio = document.getElementById('native-audio');

    this.notes = [
      370.00, 440.00, 493.88, 554.37, 493.88, 440.00, 370.00, 329.63,
      370.00, 440.00, 554.37, 659.25, 554.37, 493.88, 440.00, 493.88,
      554.37, 659.25, 739.99, 659.25, 554.37, 493.88, 440.00, 370.00
    ];
  }

  initContext() {
    if (!this.audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.audioCtx = new AudioContext();
    }
  }

  playSynthNote(freq) {
    if (!this.audioCtx || this.audioCtx.state === 'suspended') return;
    try {
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);

      gain.gain.setValueAtTime(0.01, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.12, this.audioCtx.currentTime + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.45);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start();
      osc.stop(this.audioCtx.currentTime + 0.5);
    } catch (e) {
      console.log("Synth error", e);
    }
  }

  play() {
    if (this.isCustomFile) {
      this.nativeAudio.play();
      this.isPlaying = true;
      return;
    }

    this.initContext();
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
    this.isPlaying = true;

    this.timer = setInterval(() => {
      this.currentTime++;
      if (this.currentTime > this.totalDuration) {
        this.currentTime = 0;
      }

      const freq = this.notes[this.noteIndex % this.notes.length];
      this.playSynthNote(freq);
      this.noteIndex++;

      updatePlayerUI();
    }, 800);
  }

  pause() {
    this.isPlaying = false;
    if (this.isCustomFile) {
      this.nativeAudio.pause();
    } else if (this.timer) {
      clearInterval(this.timer);
    }
  }

  seek(seconds) {
    this.currentTime = seconds;
    if (this.isCustomFile) {
      this.nativeAudio.currentTime = seconds;
    }
    updatePlayerUI();
  }

  loadCustomAudio(file) {
    const fileURL = URL.createObjectURL(file);
    this.nativeAudio.src = fileURL;
    this.isCustomFile = true;
    
    this.nativeAudio.onloadedmetadata = () => {
      this.totalDuration = Math.floor(this.nativeAudio.duration);
      this.currentTime = 0;
      updatePlayerUI();
      this.play();
    };

    this.nativeAudio.ontimeupdate = () => {
      if (this.isCustomFile && this.isPlaying) {
        this.currentTime = Math.floor(this.nativeAudio.currentTime);
        updatePlayerUI();
      }
    };

    this.nativeAudio.onended = () => {
      this.isPlaying = false;
      updatePlayerUI();
    };
  }
}

const player = new MeltdownAudioPlayer();

/* Elementos del Reproductor */
const playBtn = document.getElementById('play-btn');
const seekSlider = document.getElementById('seek-slider');
const currentTimeEl = document.getElementById('current-time');
const totalDurationEl = document.getElementById('total-duration');
const albumArt = document.getElementById('album-art');
const likeBtn = document.getElementById('like-btn');
const audioFileInput = document.getElementById('audio-file-input');

function formatTime(secs) {
  const m = Math.floor(secs / 60);
  const s = Math.floor(secs % 60);
  return `${m}:${s < 10 ? '0' : ''}${s}`;
}

function updatePlayerUI() {
  seekSlider.value = player.totalDuration > 0 ? (player.currentTime / player.totalDuration) * 100 : 0;
  currentTimeEl.innerText = formatTime(player.currentTime);
  totalDurationEl.innerText = formatTime(player.totalDuration);
  
  if (player.isPlaying) {
    playBtn.innerText = '⏸';
    albumArt.classList.add('scale-110', 'rotate-6');
  } else {
    playBtn.innerText = '▶';
    albumArt.classList.remove('scale-110', 'rotate-6');
  }
}

playBtn.addEventListener('click', () => {
  if (player.isPlaying) {
    player.pause();
  } else {
    player.play();
  }
  updatePlayerUI();
});

seekSlider.addEventListener('input', (e) => {
  const seekTo = (e.target.value / 100) * player.totalDuration;
  player.seek(seekTo);
});

audioFileInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (file) {
    if (player.isPlaying) player.pause();
    player.loadCustomAudio(file);
  }
});

likeBtn.addEventListener('click', () => {
  likeBtn.classList.toggle('text-pink-500');
  likeBtn.classList.toggle('scale-125');
  setTimeout(() => likeBtn.classList.remove('scale-125'), 200);
});