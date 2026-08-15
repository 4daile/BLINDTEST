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
  hardcore: 1,
  boss: 3,
  medium: 5,
  noob: song.introEnd,
};

// ---------- lecture d'un extrait (0 -> durée) avec barre de progression ----------
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
    const ratio = Math.min(elapsed / duration, 1);
    fillEl.style.width = `${ratio * 100}%`;

    if (ratio >= 1) {
      onDone();
      return;
    }
    activeAnimationFrame = requestAnimationFrame(step);
  };
  activeAnimationFrame = requestAnimationFrame(step);
}

function playClip(startTime, duration, fillEl, button) {
  const wasThisButton = activePlayButton === button;
  stopPlayback();

  if (wasThisButton) {
    fillEl.style.width = '0%';
    return; // un second clic sur le même bouton arrête juste la lecture
  }

  fillEl.style.width = '0%';
  player.src = song.file;

  const startPlayback = () => {
    player.currentTime = startTime;
    player.play();
    button.classList.add('playing');
    button.textContent = 'Pause';
    activePlayButton = button;

    animateProgress(fillEl, startTime, duration, () => {
      stopPlayback();
      fillEl.style.width = '100%';
    });
  };

  if (player.readyState >= 1) {
    startPlayback();
  } else {
    player.addEventListener('loadedmetadata', startPlayback, { once: true });
  }
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
  answerProgressFill.style.width = '0%';
  player.src = song.file;

  const startPlayback = () => {
    player.currentTime = song.chorusStart;
    player.play();
    animateProgress(answerProgressFill, song.chorusStart, song.revealDuration, () => {
      player.pause();
      answerProgressFill.style.width = '100%';
    });
  };

  if (player.readyState >= 1) {
    startPlayback();
  } else {
    player.addEventListener('loadedmetadata', startPlayback, { once: true });
  }
});