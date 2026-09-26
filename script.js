const subjects = [
  { name: 'Informatika', icon: '⌘', color: 'purple', lessons: '12 mavzu', progress: 65, note: 'Algoritmlar' },
  { name: 'Ingliz tili', icon: '文', color: 'orange', lessons: '18 mavzu', progress: 42, note: 'Daily words' },
  { name: 'Matematika', icon: '∑', color: 'blue', lessons: '15 mavzu', progress: 28, note: 'Kasrlar' },
  { name: 'Fizika', icon: '⚡', color: 'green', lessons: '10 mavzu', progress: 12, note: 'Harakat' }
];
const subjectCards = document.getElementById('subjectCards');
const toast = document.getElementById('toast');
const onboarding = document.getElementById('onboarding');
function renderSubjects(){ subjectCards.innerHTML = subjects.map(s => `<button class="subject-card" data-subject-card="${s.name}"><span class="subject-icon ${s.color}">${s.icon}</span><h3>${s.name}</h3><p>${s.lessons} · ${s.note}</p><div class="bar"><i style="width:${s.progress}%"></i></div></button>`).join(''); }
renderSubjects();
function showToast(message){toast.textContent=message;toast.classList.add('show');setTimeout(()=>toast.classList.remove('show'),2400)}
document.querySelectorAll('.choice').forEach(choice=>choice.addEventListener('click',()=>choice.classList.toggle('selected')));
document.getElementById('startLearning').addEventListener('click',()=>{onboarding.style.display='none';showToast('Shaxsiy o‘quv yo‘lingiz tayyor!');document.getElementById('subjects').scrollIntoView({behavior:'smooth'});});
document.getElementById('skipOnboarding').addEventListener('click',()=>onboarding.style.display='none');
document.querySelectorAll('[data-subject-card]').forEach(()=>{});
subjectCards.addEventListener('click',e=>{const card=e.target.closest('[data-subject-card]');if(card)showToast(`${card.dataset.subjectCard} fani ochilmoqda...`);});
document.getElementById('themeToggle').addEventListener('click',()=>{document.body.classList.toggle('dark');showToast(document.body.classList.contains('dark')?'Tungi rejim yoqildi':'Yorug‘ rejim yoqildi');});
const games={crossword:{title:'Krossvord: Algoritmlar',html:'<p class="muted">Algoritmda takrorlanadigan buyruqlar ketma-ketligi nima deyiladi?</p><button class="game-option" data-answer="no">A) Shart</button><button class="game-option" data-answer="yes">B) Sikl (Loop)</button><button class="game-option" data-answer="no">C) O‘zgaruvchi</button>'},match:{title:'Juftini top',html:'<p class="muted">Inglizcha so‘zning to‘g‘ri tarjimasini tanlang: <b>Variable</b></p><button class="game-option" data-answer="yes">O‘zgaruvchi</button><button class="game-option" data-answer="no">Algoritm</button><button class="game-option" data-answer="no">Natija</button>'},truefalse:{title:'To‘g‘ri yoki noto‘g‘ri',html:'<p class="muted">Loop — bir xil amallarni qayta-qayta bajarish uchun ishlatiladi.</p><button class="game-option" data-answer="yes">To‘g‘ri ✓</button><button class="game-option" data-answer="no">Noto‘g‘ri ×</button>'},scramble:{title:'So‘zlar labirinti',html:'<p class="muted">Harflarni to‘g‘ri tartiblang: <b>G O L O R I T H M A</b></p><button class="game-option" data-answer="yes">ALGORITHM</button><button class="game-option" data-answer="no">LOGARITHM</button>'}};
const gameModal=document.getElementById('gameModal'),gameTitle=document.getElementById('gameTitle'),gameContent=document.getElementById('gameContent');
document.querySelectorAll('[data-game]').forEach(card=>card.addEventListener('click',()=>{const game=games[card.dataset.game];gameTitle.textContent=game.title;gameContent.innerHTML=game.html;gameModal.classList.add('open');gameModal.setAttribute('aria-hidden','false');gameContent.querySelectorAll('.game-option').forEach(option=>option.addEventListener('click',()=>{if(option.dataset.answer==='yes'){option.style.background='#dff8ed';showToast('+25 XP! To‘g‘ri javob.')}else{option.style.background='#ffe6e6';showToast('Yana bir bor o‘ylab ko‘ring.')}}));}));
document.getElementById('closeGame').addEventListener('click',()=>{gameModal.classList.remove('open');gameModal.setAttribute('aria-hidden','true')});gameModal.addEventListener('click',e=>{if(e.target===gameModal)gameModal.classList.remove('open')});

