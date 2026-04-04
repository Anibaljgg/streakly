// Streakly app.js — i18n + heatmap + calendar
let currentUser = 'local-user';
let habits = [];
let currentLang = localStorage.getItem('streakly-lang') || 'es';
let calHabitId = null;
let calYear, calMonth;

// ── TRANSLATIONS ─────────────────────────────────────────────
const TRANSLATIONS = {
  es: {
    subtitle: 'Construye hábitos. Mantén tu racha.',
    login: 'Iniciar sesión', register: 'Crear cuenta', google: 'Entrar con Google',
    logout: 'Salir', addHabit: '➕ Agregar hábito',
    totalHabits: 'Hábitos totales', completedToday: 'Completados hoy', bestStreak: 'Mejor racha',
    heatmap: '📊 Actividad anual', filterAll: 'Todas las categorías',
    catSalud: 'Salud', catFitness: 'Fitness', catAprendizaje: 'Aprendizaje', catTrabajo: 'Trabajo', catOtro: 'Otro',
    modalAddTitle: 'Agregar nuevo hábito', habitNamePH: 'Nombre del hábito', emojiPH: 'Emoji (ej: 💪)',
    cancel: 'Cancelar', save: 'Agregar', close: 'Cerrar',
    streakLbl: 'Racha', totalLbl: 'Total', calBtn: '📅',
    deleteConfirm: '¿Eliminar este hábito?', emptyState: 'No hay hábitos. ¡Añade el primero!',
    toastAdded: 'Hábito añadido ✅', toastDone: '¡Completado! 🔥', toastUndone: 'Desmarcado',
    completed: 'Completado', today: 'Hoy',
    days: ['Dom','Lun','Mar','Mié','Jue','Vie','Sáb'],
    months: ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'],
    monthsShort: ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic']
  },
  en: {
    subtitle: 'Build habits. Keep your streak.',
    login: 'Log in', register: 'Create account', google: 'Sign in with Google',
    logout: 'Log out', addHabit: '➕ Add habit',
    totalHabits: 'Total habits', completedToday: 'Completed today', bestStreak: 'Best streak',
    heatmap: '📊 Annual activity', filterAll: 'All categories',
    catSalud: 'Health', catFitness: 'Fitness', catAprendizaje: 'Learning', catTrabajo: 'Work', catOtro: 'Other',
    modalAddTitle: 'Add new habit', habitNamePH: 'Habit name', emojiPH: 'Emoji (e.g. 💪)',
    cancel: 'Cancel', save: 'Add', close: 'Close',
    streakLbl: 'Streak', totalLbl: 'Total', calBtn: '📅',
    deleteConfirm: 'Delete this habit?', emptyState: 'No habits yet. Add your first one!',
    toastAdded: 'Habit added ✅', toastDone: 'Completed! 🔥', toastUndone: 'Unmarked',
    completed: 'Completed', today: 'Today',
    days: ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'],
    months: ['January','February','March','April','May','June','July','August','September','October','November','December'],
    monthsShort: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
  },
  de: {
    subtitle: 'Gewohnheiten aufbauen. Streak halten.',
    login: 'Anmelden', register: 'Konto erstellen', google: 'Mit Google anmelden',
    logout: 'Abmelden', addHabit: '➕ Gewohnheit hinzufügen',
    totalHabits: 'Gewohnheiten gesamt', completedToday: 'Heute erledigt', bestStreak: 'Beste Serie',
    heatmap: '📊 Jahresaktivität', filterAll: 'Alle Kategorien',
    catSalud: 'Gesundheit', catFitness: 'Fitness', catAprendizaje: 'Lernen', catTrabajo: 'Arbeit', catOtro: 'Andere',
    modalAddTitle: 'Neue Gewohnheit', habitNamePH: 'Name der Gewohnheit', emojiPH: 'Emoji (z.B. 💪)',
    cancel: 'Abbrechen', save: 'Hinzufügen', close: 'Schließen',
    streakLbl: 'Serie', totalLbl: 'Gesamt', calBtn: '📅',
    deleteConfirm: 'Gewohnheit löschen?', emptyState: 'Keine Gewohnheiten. Füge die erste hinzu!',
    toastAdded: 'Hinzugefügt ✅', toastDone: 'Erledigt! 🔥', toastUndone: 'Abgehakt',
    completed: 'Erledigt', today: 'Heute',
    days: ['So','Mo','Di','Mi','Do','Fr','Sa'],
    months: ['Januar','Februar','März','April','Mai','Juni','Juli','August','September','Oktober','November','Dezember'],
    monthsShort: ['Jan','Feb','Mär','Apr','Mai','Jun','Jul','Aug','Sep','Okt','Nov','Dez']
  },
  fr: {
    subtitle: 'Construis des habitudes. Garde ta série.',
    login: 'Se connecter', register: 'Créer un compte', google: 'Connexion avec Google',
    logout: 'Déconnexion', addHabit: '➕ Ajouter une habitude',
    totalHabits: 'Habitudes totales', completedToday: "Terminées aujourd'hui", bestStreak: 'Meilleure série',
    heatmap: '📊 Activité annuelle', filterAll: 'Toutes les catégories',
    catSalud: 'Santé', catFitness: 'Fitness', catAprendizaje: 'Apprentissage', catTrabajo: 'Travail', catOtro: 'Autre',
    modalAddTitle: 'Ajouter une habitude', habitNamePH: "Nom de l'habitude", emojiPH: 'Emoji (ex: 💪)',
    cancel: 'Annuler', save: 'Ajouter', close: 'Fermer',
    streakLbl: 'Série', totalLbl: 'Total', calBtn: '📅',
    deleteConfirm: 'Supprimer cette habitude?', emptyState: 'Aucune habitude. Ajoutez la première!',
    toastAdded: 'Habitude ajoutée ✅', toastDone: 'Complété! 🔥', toastUndone: 'Décoché',
    completed: 'Complété', today: "Aujourd'hui",
    days: ['Dim','Lun','Mar','Mer','Jeu','Ven','Sam'],
    months: ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre'],
    monthsShort: ['Jan','Fév','Mar','Avr','Mai','Jun','Jul','Aoû','Sep','Oct','Nov','Déc']
  },
  pt: {
    subtitle: 'Construa hábitos. Mantenha sua sequência.',
    login: 'Entrar', register: 'Criar conta', google: 'Entrar com Google',
    logout: 'Sair', addHabit: '➕ Adicionar hábito',
    totalHabits: 'Hábitos totais', completedToday: 'Concluídos hoje', bestStreak: 'Melhor sequência',
    heatmap: '📊 Atividade anual', filterAll: 'Todas as categorias',
    catSalud: 'Saúde', catFitness: 'Fitness', catAprendizaje: 'Aprendizado', catTrabajo: 'Trabalho', catOtro: 'Outro',
    modalAddTitle: 'Adicionar novo hábito', habitNamePH: 'Nome do hábito', emojiPH: 'Emoji (ex: 💪)',
    cancel: 'Cancelar', save: 'Adicionar', close: 'Fechar',
    streakLbl: 'Sequência', totalLbl: 'Total', calBtn: '📅',
    deleteConfirm: 'Excluir este hábito?', emptyState: 'Nenhum hábito. Adicione o primeiro!',
    toastAdded: 'Hábito adicionado ✅', toastDone: 'Concluído! 🔥', toastUndone: 'Desmarcado',
    completed: 'Concluído', today: 'Hoje',
    days: ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'],
    months: ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'],
    monthsShort: ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez']
  }
};

function tr(key) { return (TRANSLATIONS[currentLang] || TRANSLATIONS.es)[key] || key; }

function setLang(lang) {
  currentLang = lang;
  localStorage.setItem('streakly-lang', lang);
  applyTranslations();
  renderHabits();
  renderHeatmap();
  const root = document.getElementById('html-root');
  if (root) root.lang = lang;
}

function applyTranslations() {
  const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
  const ph  = (id, val) => { const el = document.getElementById(id); if (el) el.placeholder = val; };
  set('auth-subtitle', tr('subtitle'));
  set('btn-login-lbl', tr('login'));
  set('btn-register-lbl', tr('register'));
  set('btn-google-lbl', tr('google'));
  set('btn-logout-lbl', tr('logout'));
  set('btn-add-lbl', tr('addHabit'));
  set('lbl-total-habits', tr('totalHabits'));
  set('lbl-completed-today', tr('completedToday'));
  set('lbl-best-streak', tr('bestStreak'));
  set('lbl-heatmap', tr('heatmap'));
  set('modal-add-title', tr('modalAddTitle'));
  set('btn-cancel-lbl', tr('cancel'));
  set('btn-save-lbl', tr('save'));
  set('btn-close-cal', tr('close'));
  set('lbl-completed', tr('completed'));
  set('lbl-today', tr('today'));
  ph('new-habit-name', tr('habitNamePH'));
  ph('new-habit-emoji', tr('emojiPH'));
  // Filter + modal category options
  const catMap = { 'filter-all': 'filterAll', 'cat-salud': 'catSalud', 'cat-fitness': 'catFitness',
    'cat-aprendizaje': 'catAprendizaje', 'cat-trabajo': 'catTrabajo', 'cat-otro': 'catOtro' };
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const k = catMap[el.getAttribute('data-i18n')]; if (k) el.textContent = tr(k);
  });
  // Active lang buttons
  document.querySelectorAll('.lang-btn, .lang-btn-app').forEach(b => {
    b.classList.toggle('active', b.textContent.trim() === currentLang.toUpperCase());
  });
}

// ── AUTH ──────────────────────────────────────────────────
function init() {
  loadLocalData();
  setTimeout(() => { showApp(); loadHabitsFromFirestore(); }, 100);
}
function loadLocalData() {
  try { const s = localStorage.getItem('streakly-habits'); if (s) habits = JSON.parse(s); } catch(e) { habits = []; }
}
function saveLocalData() {
  try { localStorage.setItem('streakly-habits', JSON.stringify(habits)); } catch(e) {}
}
function loginWithEmail() {
  const e = document.getElementById('email').value, p = document.getElementById('password').value;
  if (!e || !p) { alert('Email y contraseña requeridos'); return; }
  currentUser = e; const un = document.getElementById('user-name'); if (un) un.textContent = e;
  showApp(); loadHabitsFromFirestore();
}
function registerWithEmail() {
  const e = document.getElementById('email').value, p = document.getElementById('password').value;
  if (!e || !p) { alert('Email y contraseña requeridos'); return; }
  currentUser = e; const un = document.getElementById('user-name'); if (un) un.textContent = e;
  showApp(); loadHabitsFromFirestore();
}
function loginWithGoogle() {
  currentUser = 'google@user.com';
  const un = document.getElementById('user-name'); if (un) un.textContent = currentUser;
  showApp(); loadHabitsFromFirestore();
}
function logout() {
  currentUser = null; habits = [];
  document.getElementById('auth-section').style.display = 'flex';
  document.getElementById('app-section').style.display = 'none';
}
function showApp() {
  document.getElementById('auth-section').style.display = 'none';
  document.getElementById('app-section').style.display = 'block';
}
function loadHabitsFromFirestore() { loadLocalData(); renderHabits(); updateStats(); renderHeatmap(); }

// ── DATE UTILS ─────────────────────────────────────────────
function getLocalDateStr(d) {
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}
function calculateStreak(dates) {
  if (!dates || !dates.length) return 0;
  const sorted = [...new Set(dates)].sort().reverse();
  let check = new Date(getLocalDateStr(new Date()) + 'T12:00:00'), streak = 0;
  for (const d of sorted) {
    if (d === getLocalDateStr(check)) { streak++; check.setDate(check.getDate()-1); } else break;
  }
  return streak;
}

// ── HABITS ────────────────────────────────────────────────
function saveHabit() {
  const name = document.getElementById('new-habit-name').value.trim();
  if (!name) { alert(tr('habitNamePH')); return; }
  const emoji = document.getElementById('new-habit-emoji').value.trim() || '✅';
  const category = document.getElementById('new-habit-category').value;
  habits.push({ id: Date.now().toString(), name, emoji, category, completedDates: [], createdAt: new Date().toISOString(), streak: 0 });
  saveLocalData(); renderHabits(); updateStats(); renderHeatmap();
  document.getElementById('new-habit-name').value = '';
  document.getElementById('new-habit-emoji').value = '';
  closeModal('add-modal'); showToast(tr('toastAdded'));
}
function toggleHabit(id) {
  const h = habits.find(x => x.id === id); if (!h) return;
  const today = getLocalDateStr(new Date());
  h.completedDates = [...new Set(h.completedDates)];
  const i = h.completedDates.indexOf(today);
  if (i > -1) { h.completedDates.splice(i,1); showToast(tr('toastUndone')); }
  else { h.completedDates.push(today); showToast(tr('toastDone')); }
  h.streak = calculateStreak(h.completedDates);
  saveLocalData(); renderHabits(); updateStats(); renderHeatmap();
}
function deleteHabit(id) {
  if (!confirm(tr('deleteConfirm'))) return;
  habits = habits.filter(h => h.id !== id);
  saveLocalData(); renderHabits(); updateStats(); renderHeatmap();
}
function renderHabits() {
  const filter = document.getElementById('filter-category')?.value || 'all';
  const container = document.getElementById('habits-list'); if (!container) return;
  container.innerHTML = '';
  const today = getLocalDateStr(new Date());
  const filtered = filter === 'all' ? habits : habits.filter(h => h.category === filter);
  if (!filtered.length) {
    container.innerHTML = `<div class="empty-state"><p>${tr('emptyState')}</p></div>`; return;
  }
  filtered.forEach(h => {
    const done = h.completedDates.includes(today);
    const el = document.createElement('div');
    el.className = `habit-card ${done ? 'completed' : ''}`;
    el.innerHTML = `
      <div class="habit-emoji">${h.emoji}</div>
      <div class="habit-info">
        <h3>${h.name}</h3>
        <span class="category-badge">${h.category}</span>
        <div class="habit-stats">
          <span>${tr('streakLbl')}&nbsp;<strong>${h.streak} 🔥</strong></span>
          <span>${tr('totalLbl')}&nbsp;<strong>${h.completedDates.length}</strong></span>
        </div>
      </div>
      <div class="habit-actions">
        <button class="btn-complete ${done?'done':''}" onclick="event.stopPropagation();toggleHabit('${h.id}')">${done?'✓':'○'}</button>
        <button class="btn-delete" onclick="event.stopPropagation();deleteHabit('${h.id}')">&#128465;</button>
        <button class="btn-delete" style="background:rgba(108,99,255,0.2)" onclick="event.stopPropagation();openCalendar('${h.id}')">📅</button>
      </div>`;
    container.appendChild(el);
  });
}
function updateStats() {
  const today = getLocalDateStr(new Date());
  document.getElementById('stat-total').textContent = habits.length;
  document.getElementById('stat-today').textContent = habits.filter(h => h.completedDates.includes(today)).length;
  document.getElementById('stat-streak').textContent = habits.length ? Math.max(...habits.map(h=>h.streak)) : 0;
}

// ── HEATMAP (GitHub style, últimas 52 semanas) ───────────────────────
function renderHeatmap() {
  const grid = document.getElementById('heatmap-grid');
  const monthsEl = document.getElementById('heatmap-months');
  if (!grid) return;
  grid.innerHTML = ''; monthsEl.innerHTML = '';

  const counts = {};
  habits.forEach(h => h.completedDates.forEach(d => { counts[d] = (counts[d]||0)+1; }));
  const maxCount = Math.max(1, ...Object.values(counts));

  const today = new Date(getLocalDateStr(new Date()) + 'T12:00:00');
  const start = new Date(today); start.setDate(start.getDate() - 364);
  start.setDate(start.getDate() - start.getDay()); // retroceder al domingo

  let col = null, prevMonth = -1, colIdx = 0;
  for (let d = new Date(start); d <= today; d.setDate(d.getDate()+1)) {
    if (d.getDay() === 0) { col = document.createElement('div'); col.className='heatmap-col'; grid.appendChild(col); colIdx++; }
    const ds = getLocalDateStr(d);
    const count = counts[ds] || 0;
    const cell = document.createElement('div');
    cell.className = 'heatmap-cell';
    if (count > 0) {
      const r = count / maxCount;
      cell.classList.add(r < 0.25 ? 'l1' : r < 0.5 ? 'l2' : r < 0.75 ? 'l3' : 'l4');
    }
    cell.setAttribute('data-tip', `${ds}: ${count}`);
    if (col) col.appendChild(cell);
    if (d.getMonth() !== prevMonth) {
      const m = document.createElement('span');
      m.textContent = tr('monthsShort')[d.getMonth()];
      m.style.cssText = `min-width:${colIdx*16}px;display:inline-block;`;
      monthsEl.appendChild(m); prevMonth = d.getMonth(); colIdx = 0;
    }
  }
  // Leyenda
  let legend = document.getElementById('heatmap-legend');
  if (!legend) {
    legend = document.createElement('div');
    legend.id = 'heatmap-legend';
    legend.style.cssText = 'display:flex;align-items:center;gap:4px;margin-top:8px;font-size:0.75rem;opacity:0.6;';
    legend.innerHTML = '<span>Less</span><div style="width:13px;height:13px;border-radius:2px;background:#1e1e3a"></div><div style="width:13px;height:13px;border-radius:2px;background:#1e3a2a"></div><div style="width:13px;height:13px;border-radius:2px;background:#2d6a3f"></div><div style="width:13px;height:13px;border-radius:2px;background:#3d9e57"></div><div style="width:13px;height:13px;border-radius:2px;background:#4caf50"></div><span>More</span>';
    document.querySelector('.heatmap-wrap')?.appendChild(legend);
  }
}

// ── CALENDAR ─────────────────────────────────────────────────
function openCalendar(habitId) {
  calHabitId = habitId;
  const h = habits.find(x => x.id === habitId); if (!h) return;
  document.getElementById('cal-habit-title').textContent = `📅 ${h.name}`;
  const now = new Date(); calYear = now.getFullYear(); calMonth = now.getMonth();
  renderCalendar(); openModal('cal-modal');
}
function calNav(dir) {
  calMonth += dir;
  if (calMonth > 11) { calMonth = 0; calYear++; }
  if (calMonth < 0) { calMonth = 11; calYear--; }
  renderCalendar();
}
function renderCalendar() {
  const h = habits.find(x => x.id === calHabitId); if (!h) return;
  document.getElementById('cal-month-label').textContent = `${tr('months')[calMonth]} ${calYear}`;
  const grid = document.getElementById('cal-grid'); grid.innerHTML = '';
  tr('days').forEach(d => { const el = document.createElement('div'); el.className='cal-day-name'; el.textContent=d; grid.appendChild(el); });
  const firstDay = new Date(calYear, calMonth, 1).getDay();
  const daysInMonth = new Date(calYear, calMonth+1, 0).getDate();
  const today = getLocalDateStr(new Date());
  for (let i = 0; i < firstDay; i++) { const el = document.createElement('div'); el.className='cal-day empty'; grid.appendChild(el); }
  for (let d = 1; d <= daysInMonth; d++) {
    const ds = `${calYear}-${String(calMonth+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
    const el = document.createElement('div');
    const done = h.completedDates.includes(ds);
    const isToday = ds === today;
    el.className = `cal-day ${isToday ? 'today' : done ? 'completed' : 'normal'}`;
    el.textContent = d;
    grid.appendChild(el);
  }
}

// ── MODAL & TOAST ────────────────────────────────────────────
function openModal(id) { const m = document.getElementById(id); if (m) m.style.display='flex'; }
function closeModal(id) { const m = document.getElementById(id); if (m) m.style.display='none'; }
let toastTimer;
function showToast(msg) {
  const el = document.getElementById('toast'); if (!el) return;
  el.textContent = msg; el.classList.add('show');
  clearTimeout(toastTimer); toastTimer = setTimeout(()=>el.classList.remove('show'), 2200);
}

// ── INIT ───────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  applyTranslations();
  init();
  document.querySelectorAll('.modal').forEach(m => m.addEventListener('click', e => { if (e.target===m) m.style.display='none'; }));
  document.addEventListener('keydown', e => {
    if (e.key==='Escape') document.querySelectorAll('.modal').forEach(m => m.style.display='none');
    const addModal = document.getElementById('add-modal');
    if (e.key==='Enter' && addModal && addModal.style.display==='flex') saveHabit();
  });
  const hn = document.getElementById('new-habit-name');
  if (hn) hn.addEventListener('keydown', e => { if (e.key==='Enter') saveHabit(); });
});
