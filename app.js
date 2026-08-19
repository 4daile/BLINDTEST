// ---------- récupération de la question demandée dans l'URL (?q=1) ----------
const params = new URLSearchParams(window.location.search);
let currentIndex = parseInt(params.get('q'), 10);

if (!currentIndex || currentIndex < 1 || currentIndex > SONGS.length) {
  currentIndex = 1;
}

const song = SONGS[currentIndex - 1];
const totalSongs = SONGS.length;

// ---------- éléments du DOM ----------
const questionNumberEl = document.getElementById('questionNumber');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const player = document.getElementById('player');

const answerBox = document.getElementById('answerBox');
const eyeIcon = document.getElementById('eyeIcon');
const answerRevealed = document.getElementById('answerRevealed');
const answerTitle = document.getElementById('answerTitle');
const answerArtist = document.getElementById('answerArtist');
const answerProgressFill = document.getElementById('answerProgressFill');

// ---------- égalisation du volume (Web Audio API) ----------
// On route l'élément <audio> à travers un GainNode dont le niveau vient de
// song.gain (calculé une fois pour toutes dans data.js à partir de la loudness
// LUFS de chaque fichier). Ça évite d'avoir à toucher le volume de la télé
// selon la chanson.
//
// GLOBAL_VOLUME baisse ou monte le volume de TOUTES les chansons d'un coup,
// sans casser l'équilibrage entre elles (le rapport entre les chansons reste
// le même). 1 = volume actuel, 0.5 = deux fois moins fort, 1.2 = 20% plus fort.
const GLOBAL_VOLUME = 0.2;

const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
const gainNode = audioCtx.createGain();
gainNode.gain.value = (song.gain ?? 1) * GLOBAL_VOLUME;
const sourceNode = audioCtx.createMediaElementSource(player);
sourceNode.connect(gainNode);
gainNode.connect(audioCtx.destination);

// ---------- affichage du numéro + navigation ----------
questionNumberEl.textContent = currentIndex;

prevBtn.addEventListener('click', () => {
  if (currentIndex === 1) {
    window.location.href = 'index.html';
  } else {
    window.location.href = `question.html?q=${currentIndex - 1}`;
  }
});

nextBtn.addEventListener('click', () => {
  if (currentIndex === totalSongs) {
    window.location.href = 'index.html';
  } else {
    window.location.href = `question.html?q=${currentIndex + 1}`;
  }
});

// ---------- durées de chaque niveau ----------
const LEVEL_DURATIONS = {
  hardcore: 0.4,
  boss: 3,
  medium: 5,
  noob: song.introEnd,
};

// ---------- lecture d'un extrait avec barre de progression ----------
let activeAnimationFrame = null;
let activePlayButton = null;

function stopPlayback() {
  player.pause();
  if (activeAnimationFrame) {
    cancelAnimationFrame(activeAnimationFrame);
    activeAnimationFrame = null;
  }
  if (activePlayButton) {
    activePlayButton.classList.remove('playing');
    activePlayButton.textContent = 'Play';
    activePlayButton = null;
  }
}

function animateProgress(fillEl, startTime, duration, onDone) {
  const step = () => {
    const elapsed = player.currentTime - startTime;
    const ratio = Math.min(Math.max(elapsed / duration, 0), 1);
    fillEl.style.width = `${ratio * 100}%`;

    if (ratio >= 1) {
      onDone();
      return;
    }
    activeAnimationFrame = requestAnimationFrame(step);
  };
  activeAnimationFrame = requestAnimationFrame(step);
}

// IMPORTANT : player.play() doit être appelé de façon SYNCHRONE, directement
// dans le gestionnaire de clic. Si on attend un événement (ex: 'loadedmetadata')
// avant d'appeler play(), les navigateurs (Safari/iOS en particulier, parfois
// Chrome) considèrent que la lecture n'est plus liée à un geste utilisateur et
// la bloquent silencieusement — c'est ce qui causait le "rien ne se joue".
function startClip(startTime, duration, fillEl, button) {
  // le contexte audio démarre parfois "suspendu" tant qu'aucun geste
  // utilisateur ne l'a débloqué ; on le relance ici, toujours de façon
  // synchrone dans le clic, pour la même raison que pour player.play().
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }

  const isNewSource = !player.src.endsWith(song.file);

  if (isNewSource) {
    player.src = song.file;
  }

  fillEl.style.width = '0%';

  if (!isNewSource && player.readyState >= 1) {
    player.currentTime = startTime;
  }

  const playPromise = player.play();
  if (playPromise && playPromise.catch) {
    playPromise.catch((err) => {
      console.error('Lecture audio bloquée ou impossible :', err);
    });
  }

  if (button) {
    button.classList.add('playing');
    button.textContent = 'Pause';
    activePlayButton = button;
  }

  const beginProgress = () => {
    animateProgress(fillEl, startTime, duration, () => {
      stopPlayback();
      fillEl.style.width = '100%';
    });
  };

  if (isNewSource || player.readyState < 1) {
    // dès que les métadonnées sont dispo, on cale le point de départ exact
    player.addEventListener(
      'loadedmetadata',
      () => {
        player.currentTime = startTime;
        beginProgress();
      },
      { once: true }
    );
  } else {
    beginProgress();
  }
}

function playClip(startTime, duration, fillEl, button) {
  const wasThisButton = activePlayButton === button;
  stopPlayback();

  if (wasThisButton) {
    fillEl.style.width = '0%';
    return; // un second clic sur le même bouton arrête juste la lecture
  }

  startClip(startTime, duration, fillEl, button);
}

// ---------- boutons des 4 niveaux ----------
document.querySelectorAll('.level').forEach((levelEl) => {
  const level = levelEl.dataset.level;
  const duration = LEVEL_DURATIONS[level];
  const button = levelEl.querySelector('.level-play');
  const fillEl = levelEl.querySelector('.progress-fill');

  button.addEventListener('click', () => {
    playClip(0, duration, fillEl, button);
  });
});

// ---------- révélation de la réponse ----------
answerBox.addEventListener('click', () => {
  if (answerBox.classList.contains('revealed')) return;

  answerBox.classList.add('revealed');
  answerBox.classList.remove('hidden-answer');
  eyeIcon.hidden = true;
  answerRevealed.hidden = false;

  answerTitle.textContent = song.title;
  answerArtist.textContent = song.artist;

  stopPlayback();
  startClip(song.chorusStart, song.revealDuration, answerProgressFill, null);
});