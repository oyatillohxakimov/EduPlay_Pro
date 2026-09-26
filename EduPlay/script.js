const STORAGE_KEY = 'eduplay_state';

const subjects = [
  {
    name: 'Informatika',
    icon: '⌘',
    color: 'purple',
    lessonSummary: '12 mavzu',
    progress: 65,
    note: 'Algoritmlar',
    lessons: [
      { title: 'Kompyuter asoslari', duration: '8 min', description: 'Kompyuter nima, qanday ishlaydi? Asosiy tushunchalarni o‘rganing.' },
      { title: 'Algoritmlar', duration: '12 min', description: 'Algoritm nima, qadamlar ketma-ketligi qanday ishlaydi?' },
      { title: 'O‘zgaruvchilar', duration: '10 min', description: 'Ma’lumotlarni saqlash uchun o‘zgaruvchilar va type tushunchasi.' },
      { title: 'If / Else', duration: '11 min', description: 'Shartlar va qaror qabul qilish mantiqi.' },
      { title: 'Loop', duration: '9 min', description: 'Takrorlanadigan vazifalar uchun sikl ishlatish.' }
    ]
  },
  {
    name: 'Ingliz tili',
    icon: '文',
    color: 'orange',
    lessonSummary: '18 mavzu',
    progress: 42,
    note: 'Daily words',
    lessons: [
      { title: 'Daily words', duration: '7 min', description: 'Har kuni ishlatiladigan eng oddiy so‘zlar.' },
      { title: 'Present Simple', duration: '15 min', description: 'Hozirgi oddiy zamon va gaplar qurilishi.' },
      { title: 'Speaking basics', duration: '12 min', description: 'Oddiy suhbat va savollarni bayon qilish.' }
    ]
  },
  {
    name: 'Matematika',
    icon: '∑',
    color: 'blue',
    lessonSummary: '15 mavzu',
    progress: 28,
    note: 'Kasrlar',
    lessons: [
      { title: 'Sonlar', duration: '8 min', description: 'Natural, butun va kasr sonlar asoslari.' },
      { title: 'Kasrlar', duration: '13 min', description: 'Kasrlar va ularnni soddalashtirish.' },
      { title: 'Tenglamalar', duration: '11 min', description: 'Tenglamalar yechish usullari.' }
    ]
  },
  {
    name: 'Fizika',
    icon: '⚡',
    color: 'green',
    lessonSummary: '10 mavzu',
    progress: 12,
    note: 'Harakat',
    lessons: [
      { title: 'Harakat', duration: '9 min', description: 'Harakat va yo‘nalish tushunchasi.' },
      { title: 'Kuch', duration: '10 min', description: 'Kuchlar va ularning ta’siri.' },
      { title: 'Energiya', duration: '12 min', description: 'Energiya va uni saqlash.' }
    ]
  }
];

function defaultState() {
  return {
    xp: 1260,
    level: 8,
    streak: 7,
    completedLessons: [],
    darkMode: false,
    selectedSubjects: ['Informatika']
  };
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState();
    const parsed = JSON.parse(raw);
    return { ...defaultState(), ...parsed };
  } catch (error) {
    return defaultState();
  }
}

function saveState(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function getLevelFromXp(xp) {
  return Math.floor(xp / 500) + 1;
}

function getSubjectByName(name) {
  return subjects.find((item) => item.name === name) || subjects[0];
}

function addXp(amount) {
  const state = loadState();
  state.xp += amount;
  state.level = getLevelFromXp(state.xp);
  saveState(state);
  updateProgressBadge();
}

function completeLesson(subjectName, lessonTitle) {
  const state = loadState();
  const key = `${subjectName}::${lessonTitle}`;

  if (!state.completedLessons.includes(key)) {
    state.completedLessons.push(key);
    saveState(state);
    addXp(50);
  }

  updateProgressBadge();
}

function updateProgressBadge() {
  const state = loadState();

  const xpEl = document.querySelector('[data-xp]');
  const levelEl = document.querySelector('[data-level]');
  const streakEl = document.querySelector('[data-streak]');

  if (xpEl) xpEl.textContent = state.xp;
  if (levelEl) levelEl.textContent = `Level ${state.level}`;
  if (streakEl) streakEl.textContent = `${state.streak} kun`;
}

const onboarding = document.getElementById('onboarding');
const toast = document.getElementById('toast');
const app = document.querySelector('.app-shell');
const home = document.querySelector('main#home');
const subjectCards = document.getElementById('subjectCards');
const root = document.createElement('div');
root.id = 'screenRoot';
app?.appendChild(root);

const css = document.createElement('link');
css.rel = 'stylesheet';
css.href = 'screens.css';
document.head.appendChild(css);

function notify(message) {
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(notify.timer);
  notify.timer = setTimeout(() => toast.classList.remove('show'), 2200);
}

function closeOnboarding() {
  if (onboarding) onboarding.style.display = 'none';
}

document.getElementById('skipOnboarding')?.addEventListener('click', closeOnboarding);

document.getElementById('startLearning')?.addEventListener('click', () => {
  closeOnboarding();
  notify('Shaxsiy o‘quv yo‘lingiz tayyor!');
});

document.querySelectorAll('#subjectChoices .choice').forEach((choice) => {
  choice.addEventListener('click', () => choice.classList.toggle('selected'));
});

if (subjectCards) {
  subjectCards.innerHTML = subjects.map((s) => `
    <button class="subject-card" data-subject-card="${s.name}">
      <span class="subject-icon ${s.color}">${s.icon}</span>
      <h3>${s.name}</h3>
      <p>${s.lessonSummary} · ${s.note}</p>
      <div class="bar"><i style="width:${s.progress}%"></i></div>
    </button>
  `).join('');
}

document.querySelectorAll('main#home > .section-block, main#home > .learning-panel').forEach((section) => {
  section.remove();
});

function pageHeader(label, title, text) {
  return `
    <div class="screen-header">
      <button class="back-button" data-route="home">← Bosh sahifa</button>
      <p class="eyebrow">${label}</p>
      <h1>${title}</h1>
      <p>${text}</p>
    </div>
  `;
}

function renderLessons(subjectName) {
  const subject = getSubjectByName(subjectName);
  const state = loadState();

  return `
    <div class="lesson-screen">
      ${pageHeader('Fan bo‘limi', subject.name, `${subject.name} fanidagi barcha darslar ro‘yxati.`)}
      <div class="lesson-list">
        ${subject.lessons.map((lesson, index) => {
          const key = `${subject.name}::${lesson.title}`;
          const completed = state.completedLessons.includes(key);

          return `
            <button class="lesson-card ${completed ? 'done' : ''}" data-lesson="${subject.name}|${lesson.title}">
              <div class="lesson-number">${index + 1}</div>
              <div class="lesson-body">
                <div class="lesson-top">
                  <strong>${lesson.title}</strong>
                  <span>${lesson.duration}</span>
                </div>
                <p>${lesson.description}</p>
              </div>
              <div class="lesson-status">${completed ? '✅' : '→'}</div>
            </button>
          `;
        }).join('')}
      </div>
    </div>
  `;
}

function showPage(route, value = '') {
  if (!root || !app) return;

  app.classList.toggle('is-screen-mode', route !== 'home');

  if (route === 'home') {
    root.innerHTML = '';
    home?.scrollIntoView({ behavior: 'smooth' });
    return;
  }

  if (route === 'subjects') {
    root.innerHTML =
      pageHeader('O‘rganishni boshlang', 'Fanlar', 'Har bir fan bo‘yicha mavzularni bosqichma-bosqich o‘rganing.') +
      `<div class="screen-grid">${subjects.map((s) => `
        <button class="large-subject-card" data-subject-screen="${s.name}">
          <span class="subject-icon ${s.color}">${s.icon}</span>
          <h2>${s.name}</h2>
          <p>${s.lessonSummary} · ${s.note}</p>
          <div class="bar"><i style="width:${s.progress}%"></i></div>
          <b>${s.progress}% davom etmoqda →</b>
        </button>
      `).join('')}</div>`;
  }

  if (route === 'subject') {
    const s = getSubjectByName(value);
    root.innerHTML = renderLessons(s.name);
  }

  if (route === 'games') {
    const games = [
      ['crossword', '▦', 'Krossvord', 'Algoritmlar va so‘zlar'],
      ['match', '◈', 'Juftini top', 'Tushunchalarni moslashtir'],
      ['truefalse', '✓?', 'To‘g‘ri yoki noto‘g‘ri', 'Tezkor bilim sinovi'],
      ['scramble', 'Aa', 'So‘zlar labirinti', 'Inglizcha so‘zlarni top'],
      ['order', '123', 'Tartibga keltir', 'Algoritm bosqichlarini joyla'],
      ['speed', '⚡', 'Tezkor savollar', '60 soniyada javob ber']
    ];

    root.innerHTML =
      pageHeader('Bilimni mustahkamla', 'O‘yinlar maydoni', 'Osondan murakkabgacha bilimlaringizni sinang.') +
      `<div class="screen-game-grid">${games.map((g) => `
        <button class="screen-game-card" data-game="${g[0]}">
          <span>${g[1]}</span>
          <h2>${g[2]}</h2>
          <p>${g[3]}</p>
          <b>O‘ynash →</b>
        </button>
      `).join('')}</div>`;
  }

  if (route === 'progress') {
    const state = loadState();

    root.innerHTML =
      pageHeader('Sizning natijalaringiz', 'Progress', 'Har bir kichik yutuq sizni katta maqsadga yaqinlashtiradi.') +
      `<div class="progress-dashboard">
        <div class="progress-big">
          <strong>${state.level * 10}%</strong>
          <span>Umumiy progress</span>
          <div class="progress-ring"><i style="width:${state.level * 10}%"></i></div>
        </div>
        <div class="progress-stats">
          <div><b>${state.xp}</b><small>Umumiy XP</small></div>
          <div><b>${state.streak} kun</b><small>Streak</small></div>
          <div><b>${state.completedLessons.length}</b><small>Tugallangan dars</small></div>
          <div><b>${Math.min(100, Math.round((state.completedLessons.length / 12) * 100))}%</b><small>To‘g‘ri javoblar</small></div>
        </div>
      </div>
      <div class="achievement-panel">
        <h2>Yutuqlar</h2>
        <div class="achievement-list">
          <span>🔥 ${state.streak} kunlik streak</span>
          <span>🚀 Level ${state.level}</span>
          <span>🧠 ${state.completedLessons.length} ta dars</span>
        </div>
      </div>`;
  }

  if (route === 'profile') {
    const state = loadState();
    root.innerHTML =
      pageHeader('EduPlay', 'Profil', 'O‘zingiz haqingizdagi ma’lumotlar va yutuqlar.') +
      `<div class="profile-card">
        <div class="profile-avatar">A</div>
        <h2>EduPlay o‘quvchisi</h2>
        <p>Explorer · Level ${state.level}</p>
        <div class="profile-line"><span>XP</span><b>${state.xp} / 1500</b></div>
        <div class="bar"><i style="width:${Math.min(100, (state.xp / 1500) * 100)}%"></i></div>
        <button class="primary-button" data-route="progress">Statistikani ko‘rish →</button>
      </div>`;
  }

  if (route === 'ai') {
    root.innerHTML =
      pageHeader('Yordamchi', 'AI Mentor', 'Tushunmagan mavzuni sodda qilib tushuntirishga yordam beradi.') +
      `<div class="mentor-card">
        <div class="mentor-avatar">✦</div>
        <h2>Salom! Men EduPlay Mentor.</h2>
        <p>Bugun qaysi mavzuni tushunishda yordam kerak?</p>
        <div class="mentor-options">
          <button data-mentor="Algoritmni tushuntir">Algoritmni tushuntir</button>
          <button data-mentor="Xatoyimni izohla">Xatoyimni izohla</button>
          <button data-mentor="Boshqa misol ber">Boshqa misol ber</button>
        </div>
        <div class="mentor-answer" id="mentorAnswer">Savolni tanlang — men sizni fikrlashga yo‘naltiraman.</div>
      </div>`;
  }

  root.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

const gameData = {
  crossword: {
    title: 'Krossvord: Algoritmlar',
    questions: [
      {
        question: 'Takrorlanadigan buyruqlar ketma-ketligi nima?',
        options: ['A) Shart', 'B) Sikl (Loop)', 'C) O‘zgaruvchi'],
        answer: 1
      },
      {
        question: 'Loop nima uchun ishlatiladi?',
        options: ['A) Rasmni chizish', 'B) Takrorlanadigan vazifalarni bajarish', 'C) Foydalanuvchi ismini olish'],
        answer: 1
      }
    ]
  },
  match: {
    title: 'Juftini top',
    questions: [
      {
        question: 'Variable so‘zining tarjimasini tanlang.',
        options: ['O‘zgaruvchi', 'Algoritm', 'Natija'],
        answer: 0
      }
    ]
  },
  truefalse: {
    title: 'To‘g‘ri yoki noto‘g‘ri',
    questions: [
      {
        question: 'Loop bir xil amallarni qayta-qayta bajarish uchun ishlatiladi.',
        options: ['To‘g‘ri ✓', 'Noto‘g‘ri ×'],
        answer: 0
      }
    ]
  },
  scramble: {
    title: 'So‘zlar labirinti',
    questions: [
      {
        question: 'Harflarni to‘g‘ri tartiblang: G O R I T H M A',
        options: ['ALGORITHM', 'LOGARITHM'],
        answer: 0
      }
    ]
  },
  order: {
    title: 'Tartibga keltir',
    questions: [
      {
        question: 'Algoritmning birinchi qadamini tanlang.',
        options: ['Masalani tushunish', 'Natijani tekshirish'],
        answer: 0
      }
    ]
  },
  speed: {
    title: 'Tezkor savollar',
    questions: [
      {
        question: 'HTML nimani anglatadi?',
        options: ['HyperText Markup Language', 'High Text Machine Logic'],
        answer: 0
      }
    ]
  }
};

const quizState = {
  key: null,
  index: 0
};

function renderQuizQuestion() {
  const modal = document.getElementById('gameModal');
  const title = document.getElementById('gameTitle');
  const content = document.getElementById('gameContent');

  if (!modal || !title || !content || !quizState.key) return;

  const pack = gameData[quizState.key];
  const current = pack.questions[quizState.index];
  const total = pack.questions.length;

  title.textContent = pack.title;

  content.innerHTML = `
    <div class="game-meta">
      <span>${quizState.index + 1}/${total}</span>
      <span>Quiz</span>
    </div>
    <p class="muted">${current.question}</p>
    <div class="game-options">
      ${current.options.map((option, i) => `
        <button class="game-option" data-index="${i}">${option}</button>
      `).join('')}
    </div>
    <div class="game-actions">
      <button class="primary-button" id="nextQuizBtn" disabled>Keyingi savol</button>
    </div>
  `;

  const buttons = content.querySelectorAll('.game-option');
  const nextBtn = document.getElementById('nextQuizBtn');

  buttons.forEach((button) => {
    button.addEventListener('click', () => {
      const selectedIndex = Number(button.dataset.index);
      const isCorrect = selectedIndex === current.answer;

      buttons.forEach((btn) => {
        const idx = Number(btn.dataset.index);
        btn.disabled = true;
        if (idx === current.answer) {
          btn.classList.add('correct');
        } else if (idx === selectedIndex && !isCorrect) {
          btn.classList.add('wrong');
        }
      });

      if (isCorrect) {
        addXp(25);
        notify('+25 XP! To‘g‘ri javob.');
      } else {
        notify('Noto‘g‘ri javob. Qayta o‘ylab ko‘ring.');
      }

      nextBtn.disabled = false;
    });
  });

  nextBtn?.addEventListener('click', () => {
    const pack = gameData[quizState.key];
    const nextIndex = quizState.index + 1;

    if (nextIndex < pack.questions.length) {
      quizState.index = nextIndex;
      renderQuizQuestion();
      return;
    }

    const state = loadState();
    notify(`Test yakunlandi! Jami XP: ${state.xp}`);
    closeGame();
  });
}

function closeGame() {
  const modal = document.getElementById('gameModal');
  if (!modal) return;

  if (document.activeElement instanceof HTMLElement && modal.contains(document.activeElement)) {
    document.activeElement.blur();
  }

  modal.setAttribute('inert', '');
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
}

function openGame(key) {
  const modal = document.getElementById('gameModal');
  if (!modal) return;

  quizState.key = key;
  quizState.index = 0;

  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
  modal.removeAttribute('inert');

  renderQuizQuestion();
}

document.addEventListener('click', (event) => {
  const route = event.target.closest('[data-route]');
  if (route) {
    event.preventDefault();
    showPage(route.dataset.route);
    return;
  }

  const link = event.target.closest('a[href^="#"]');
  if (link) {
    event.preventDefault();
    showPage(link.getAttribute('href').slice(1) || 'home');
    return;
  }

  const subject = event.target.closest('[data-subject-card],[data-subject-screen]');
  if (subject) {
    showPage('subject', subject.dataset.subjectCard || subject.dataset.subjectScreen);
    return;
  }

  const lesson = event.target.closest('[data-lesson]');
  if (lesson) {
    const [subjectName, lessonTitle] = lesson.dataset.lesson.split('|');
    const state = loadState();
    const subject = getSubjectByName(subjectName);
    const selectedLesson = subject.lessons.find((item) => item.title === lessonTitle);

    if (selectedLesson) {
      const key = `${subject.name}::${selectedLesson.title}`;
      const isDone = state.completedLessons.includes(key);

      root.innerHTML = `
        <div class="lesson-detail">
          ${pageHeader('Dars', selectedLesson.title, `${subject.name} fanidagi dars.`)}
          <div class="lesson-content">
            <div class="lesson-badge">${subject.name}</div>
            <h2>${selectedLesson.title}</h2>
            <p>${selectedLesson.description}</p>

            <div class="lesson-stats">
              <span>⏱ ${selectedLesson.duration}</span>
              <span>✓ ${isDone ? 'Yakunlangan' : 'Yangi'}</span>
            </div>

            <div class="lesson-steps">
              <ol>
                <li>Masalani aniqlab oling.</li>
                <li>Vazifani bosqichma-bosqich bajaring.</li>
                <li>Har qadamni yozib oling va tekshiring.</li>
                <li>Natijani umumlashtiring.</li>
              </ol>
            </div>

            <div class="lesson-actions">
              <button class="primary-button" data-lesson-complete="${subject.name}|${selectedLesson.title}">Darsni tugatish ✅</button>
              <button class="primary-button secondary" data-route="subject" data-subject-route="${subject.name}">Orqaga qaytish</button>
            </div>
          </div>
        </div>
      `;
    }
    return;
  }

  const completeLessonBtn = event.target.closest('[data-lesson-complete]');
  if (completeLessonBtn) {
    const [subjectName, lessonTitle] = completeLessonBtn.dataset.lessonComplete.split('|');
    completeLesson(subjectName, lessonTitle);

    notify('Dars yakunlandi! +50 XP');
    showPage('subject', subjectName);
    return;
  }

  const game = event.target.closest('[data-game]');
  if (game) {
    event.preventDefault();
    openGame(game.dataset.game);
    return;
  }

  const mentor = event.target.closest('[data-mentor]');
  if (mentor) {
    const answer = document.getElementById('mentorAnswer');
    if (answer) answer.textContent = `${mentor.dataset.mentor}: avval o‘zingizcha fikrlab ko‘ring, keyin men yo‘l-yo‘riq beraman.`;
  }
});

document.getElementById('themeToggle')?.addEventListener('click', () => {
  const state = loadState();
  state.darkMode = !state.darkMode;
  saveState(state);

  document.body.classList.toggle('dark', state.darkMode);
  notify(state.darkMode ? 'Tungi rejim yoqildi' : 'Yorug‘ rejim yoqildi');
});

document.getElementById('closeGame')?.addEventListener('click', closeGame);
document.getElementById('gameModal')?.addEventListener('click', (event) => {
  if (event.target.id === 'gameModal') closeGame();
});

updateProgressBadge();
const savedTheme = loadState().darkMode;
document.body.classList.toggle('dark', savedTheme);