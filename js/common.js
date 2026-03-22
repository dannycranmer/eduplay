/* EduPlay — Shared utilities */

// Mobile nav — full-screen takeover (single .open class)
function initNav() {
  const hamburger = document.querySelector('.hamburger');
  const mobileNav = document.querySelector('.mobile-nav');
  const overlay = document.querySelector('.nav-overlay');
  if (!hamburger || !mobileNav) return;

  let isOpen = false;

  function openNav() {
    if (isOpen) return;
    isOpen = true;
    hamburger.classList.add('active');
    mobileNav.classList.add('open');
    if (overlay) overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeNav() {
    if (!isOpen) return;
    isOpen = false;
    hamburger.classList.remove('active');
    mobileNav.classList.remove('open');
    if (overlay) overlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', () => isOpen ? closeNav() : openNav());

  // Close on overlay tap
  if (overlay) overlay.addEventListener('click', closeNav);

  // Close on X button
  const closeBtn = mobileNav.querySelector('.mobile-nav-close');
  if (closeBtn) closeBtn.addEventListener('click', closeNav);

  // Close on link click
  mobileNav.querySelectorAll('a').forEach(a => a.addEventListener('click', closeNav));

  // Close on Escape key
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && isOpen) closeNav();
  });
}

// Score tracker (session only)
class ScoreTracker {
  constructor() {
    this.correct = 0;
    this.wrong = 0;
    this.streak = 0;
    this.bestStreak = 0;
    this.total = 0;
    this.startTime = null;
  }

  start() {
    this.startTime = Date.now();
  }

  recordCorrect() {
    this.correct++;
    this.streak++;
    this.total++;
    if (this.streak > this.bestStreak) this.bestStreak = this.streak;
  }

  recordWrong() {
    this.wrong++;
    this.streak = 0;
    this.total++;
  }

  get accuracy() {
    return this.total === 0 ? 0 : Math.round((this.correct / this.total) * 100);
  }

  get elapsedSeconds() {
    if (!this.startTime) return 0;
    return Math.round((Date.now() - this.startTime) / 1000);
  }

  get elapsedFormatted() {
    const s = this.elapsedSeconds;
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return m > 0 ? `${m}m ${sec}s` : `${sec}s`;
  }

  getEmoji() {
    const pct = this.accuracy;
    if (pct >= 90) return '🌟';
    if (pct >= 70) return '🎉';
    if (pct >= 50) return '👍';
    return '💪';
  }

  getMessage() {
    const pct = this.accuracy;
    if (pct >= 90) return 'Amazing job! You\'re a math superstar!';
    if (pct >= 70) return 'Great work! Keep practicing!';
    if (pct >= 50) return 'Good effort! Try again to improve!';
    return 'Keep trying! Practice makes perfect!';
  }
}

// Generate random integer between min and max (inclusive)
function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Shuffle array in place (Fisher-Yates)
function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = randInt(0, i);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Generate wrong answers near the correct one
function generateChoices(correct, count = 4, spread = 5) {
  const choices = new Set([correct]);
  let attempts = 0;
  while (choices.size < count && attempts < 100) {
    let wrong = correct + randInt(-spread, spread);
    if (wrong < 0) wrong = randInt(0, spread);
    if (wrong !== correct) choices.add(wrong);
    attempts++;
  }
  return shuffle([...choices]);
}

// Animate element with class
function animateEl(el, animClass) {
  el.classList.remove(animClass);
  void el.offsetWidth; // trigger reflow
  el.classList.add(animClass);
}

// Format seconds as mm:ss
function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

// Update score display
function updateScoreDisplay(tracker) {
  const correctEl = document.getElementById('score-correct');
  const wrongEl = document.getElementById('score-wrong');
  const streakEl = document.getElementById('score-streak');
  if (correctEl) correctEl.textContent = tracker.correct;
  if (wrongEl) wrongEl.textContent = tracker.wrong;
  if (streakEl) streakEl.textContent = tracker.streak;
}

// Show results screen
function showResults(tracker, containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = `
    <div class="results-screen animate-slide-up">
      <div class="results-emoji">${tracker.getEmoji()}</div>
      <h2>${tracker.getMessage()}</h2>
      <div class="results-stats">
        <div class="stat-card">
          <div class="stat-value">${tracker.correct}</div>
          <div class="stat-label">Correct</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${tracker.total}</div>
          <div class="stat-label">Questions</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${tracker.accuracy}%</div>
          <div class="stat-label">Accuracy</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${tracker.bestStreak}</div>
          <div class="stat-label">Best Streak</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${tracker.elapsedFormatted}</div>
          <div class="stat-label">Time</div>
        </div>
      </div>
      <div class="btn-group">
        <button class="btn btn-primary btn-lg" onclick="location.reload()">Play Again</button>
        <a href="index.html" class="btn btn-secondary btn-lg">More Games</a>
      </div>
    </div>
  `;
}

// Desktop dropdown nav
function initDropdowns() {
  document.querySelectorAll('.nav-dropdown').forEach(dd => {
    const trigger = dd.querySelector('.nav-dropdown-trigger');
    if (!trigger) return;

    trigger.addEventListener('click', e => {
      e.stopPropagation();
      const wasOpen = dd.classList.contains('open');
      // Close all dropdowns first
      document.querySelectorAll('.nav-dropdown.open').forEach(d => d.classList.remove('open'));
      if (!wasOpen) dd.classList.add('open');
    });
  });

  // Close dropdowns on outside click
  document.addEventListener('click', () => {
    document.querySelectorAll('.nav-dropdown.open').forEach(d => d.classList.remove('open'));
  });

  // Close on Escape
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.nav-dropdown.open').forEach(d => d.classList.remove('open'));
    }
  });
}

// Init on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initDropdowns();
});
