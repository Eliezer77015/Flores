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

/* IMÁGENES PIXEL ART FLOTANTES */
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

  const size = Math.floor(Math.random() * 25) + 48;
  img.style.width = `${size}px`;
  img.style.height = 'auto';

  const posX = Math.floor(Math.random() * 80) + 5;
  img.style.left = `${posX}%`;

  const posY = Math.floor(Math.random() * 70) + 15;
  img.style.top = `${posY}%`;

  const duration = (Math.random() * 5 + 9).toFixed(1);
  img.style.animationDuration = `${duration}s`;

  sparklesContainer.appendChild(img);

  setTimeout(() => {
    if (img.parentNode) {
      img.parentNode.removeChild(img);
    }
  }, duration * 1000);
}

for (let i = 0; i < 3; i++) {
  setTimeout(spawnPixelArt, i * 1200);
}
setInterval(spawnPixelArt, 3500);

/* LISTA DE CANCIONES (PLAYLIST) */
const playlist = [
  { title: "Risk It All", artist: "Bruno Mars", file: "Bruno Mars - Risk It All.mp3", icon: "🎸" },
  { title: "Meltdown", artist: "Iroha", file: "Iroha - Meltdown.mp3", icon: "👑" },
  { title: "Itte", artist: "Yorushika", file: "Yorushika - Itte.mp3", icon: "🌸" },
  { title: "Vegetable", artist: "Miku", file: "Miku - Vegetable.mp3", icon: "🥬" },
  { title: "This Is for", artist: "Twice", file: "Twice - This Is for.mp3", icon: "💖" },
  { title: "Heart Shaker", artist: "Twice", file: "Twice - Heart Shaker.mp3", icon: "💓" },
  { title: "What is Love", artist: "Twice", file: "Twice What is love.mp3", icon: "💌" },
  { title: "New Jeans", artist: "NewJeans", file: "NewJeans - New Jeans.mp3", icon: "👖" },
  { title: "Ditto", artist: "NewJeans", file: "NewJeans - Ditto.mp3", icon: "🎧" }
];

let currentIndex = 0;
let isPlaying = false;
let isLooping = false;

const audio = document.getElementById('native-audio');
const playBtn = document.getElementById('play-btn');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const loopBtn = document.getElementById('loop-btn');
const seekSlider = document.getElementById('seek-slider');
const currentTimeEl = document.getElementById('current-time');
const totalDurationEl = document.getElementById('total-duration');
const songTitleEl = document.getElementById('song-title');
const songArtistEl = document.getElementById('song-artist');
const playlistIndexEl = document.getElementById('playlist-index');
const albumArt = document.getElementById('album-art');
const likeBtn = document.getElementById('like-btn');

function loadSong(index) {
  const song = playlist[index];
  songTitleEl.innerText = song.title;
  songArtistEl.innerText = song.artist;
  albumArt.innerText = song.icon;
  playlistIndexEl.innerText = `${index + 1}/${playlist.length}`;
  audio.src = song.file;
  seekSlider.value = 0;
  currentTimeEl.innerText = "0:00";
  totalDurationEl.innerText = "0:00";
}

function playSong() {
  isPlaying = true;
  audio.play().catch(e => console.log("Se requiere interacción para reproducir el audio."));
  updateUI();
}

function pauseSong() {
  isPlaying = false;
  audio.pause();
  updateUI();
}

function nextSong() {
  currentIndex = (currentIndex + 1) % playlist.length;
  loadSong(currentIndex);
  if (isPlaying) playSong();
}

function prevSong() {
  currentIndex = (currentIndex - 1 + playlist.length) % playlist.length;
  loadSong(currentIndex);
  if (isPlaying) playSong();
}

function updateUI() {
  if (isPlaying) {
    playBtn.innerText = '⏸';
    albumArt.classList.add('scale-105');
    albumArt.classList.remove('scale-110', 'rotate-6');
  } else {
    playBtn.innerText = '▶';
    albumArt.classList.remove('scale-105', 'scale-110', 'rotate-6');
  }
}

function formatTime(secs) {
  if (isNaN(secs)) return "0:00";
  const m = Math.floor(secs / 60);
  const s = Math.floor(secs % 60);
  return `${m}:${s < 10 ? '0' : ''}${s}`;
}

// Eventos de reproducción y navegación
playBtn.addEventListener('click', () => {
  if (isPlaying) {
    pauseSong();
  } else {
    playSong();
  }
});

nextBtn.addEventListener('click', nextSong);
prevBtn.addEventListener('click', prevSong);

// Evento del botón de Bucle
loopBtn.addEventListener('click', () => {
  isLooping = !isLooping;
  if (isLooping) {
    loopBtn.classList.remove('text-purple-300/60');
    loopBtn.classList.add('text-yellow-300', 'scale-110');
  } else {
    loopBtn.classList.remove('text-yellow-300', 'scale-110');
    loopBtn.classList.add('text-purple-300/60');
  }
});

// Actualización de tiempo y barra de progreso
audio.addEventListener('timeupdate', () => {
  if (audio.duration) {
    seekSlider.value = (audio.currentTime / audio.duration) * 100;
    currentTimeEl.innerText = formatTime(audio.currentTime);
    totalDurationEl.innerText = formatTime(audio.duration);
  }
});

// Evento cuando termina la canción
audio.addEventListener('ended', () => {
  if (isLooping) {
    audio.currentTime = 0;
    playSong();
  } else {
    nextSong();
  }
});

seekSlider.addEventListener('input', (e) => {
  if (audio.duration) {
    audio.currentTime = (e.target.value / 100) * audio.duration;
  }
});

likeBtn.addEventListener('click', () => {
  likeBtn.classList.toggle('text-pink-500');
  likeBtn.classList.toggle('scale-125');
  setTimeout(() => likeBtn.classList.remove('scale-125'), 200);
});

// Cargar la primera canción al inicio
loadSong(currentIndex);