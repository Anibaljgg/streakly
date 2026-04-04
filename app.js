// Streakly - app.js
// Estado de la app
let currentUser = 'local-user';
let habits = [];

function init() {
  loadLocalData();
  setupAuthListener();
}

function loadLocalData() {
  try {
    const saved = localStorage.getItem('streakly-habits');
    if (saved) habits = JSON.parse(saved);
  } catch(e) { habits = []; }
}

function saveLocalData() {
  try {
    localStorage.setItem('streakly-habits', JSON.stringify(habits));
  } catch(e) {}
}

function setupAuthListener() {
  setTimeout(() => {
    showApp();
    loadHabitsFromFirestore();
  }, 100);
}

// Auth simulada (sin Firebase)
function loginWithEmail() {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  if (!email || !password) { alert('Por favor ingresa email y contraseña'); return; }
  currentUser = email;
  document.getElementById('user-name').textContent = email;
  showApp();
  loadHabitsFromFirestore();
}

function registerWithEmail() {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  if (!email || !password) { alert('Por favor ingresa email y contraseña'); return; }
  currentUser = email;
  document.getElementById('user-name').textContent = email;
  showApp();
  loadHabitsFromFirestore();
}

function loginWithGoogle() {
  currentUser = 'google-user@gmail.com';
  document.getElementById('user-name').textContent = currentUser;
  showApp();
  loadHabitsFromFirestore();
}

function logout() {
  currentUser = null;
  habits = [];
  document.getElementById('auth-section').style.display = 'flex';
  document.getElementById('app-section').style.display = 'none';
}

function showApp() {
  document.getElementById('auth-section').style.display = 'none';
  document.getElementById('app-section').style.display = 'block';
}

function loadHabitsFromFirestore() {
  loadLocalData();
  renderHabits();
  updateStats();
}

// Fecha local correcta (evita desfase UTC/CEST)
function getLocalDateStr(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function saveHabit() {
  const name = document.getElementById('new-habit-name').value.trim();
  if (!name) { alert('Por favor ingresa el nombre del hábito'); return; }
  const emoji = document.getElementById('new-habit-emoji').value.trim() || '✅';
  const category = document.getElementById('new-habit-category').value;
  addHabit(name, emoji, category);
  document.getElementById('new-habit-name').value = '';
  document.getElementById('new-habit-emoji').value = '';
  closeModal('add-modal');
}

function addHabit(name, emoji, category) {
  const habit = {
    id: Date.now().toString(),
    name, emoji, category,
    completedDates: [],
    createdAt: new Date().toISOString(),
    streak: 0
  };
  habits.push(habit);
  saveLocalData();
  renderHabits();
  updateStats();
  showToast(`Hábito "${name}" añadido ✅`);
}

function toggleHabit(habitId) {
  const habit = habits.find(h => h.id === habitId);
  if (!habit) return;
  const today = getLocalDateStr(new Date());
  // Eliminar duplicados
  habit.completedDates = [...new Set(habit.completedDates)];
  const index = habit.completedDates.indexOf(today);
  if (index > -1) {
    habit.completedDates.splice(index, 1);
  } else {
    habit.completedDates.push(today);
  }
  habit.streak = calculateStreak(habit.completedDates);
  saveLocalData();
  renderHabits();
  updateStats();
}

// Calcular racha (corregido: fecha local + sin duplicados + DST safe)
function calculateStreak(completedDates) {
  if (!completedDates || completedDates.length === 0) return 0;
  const sorted = [...new Set(completedDates)].sort().reverse();
  let checkDate = new Date(getLocalDateStr(new Date()) + 'T12:00:00');
  let streak = 0;
  for (let i = 0; i < sorted.length; i++) {
    const expected = getLocalDateStr(checkDate);
    if (sorted[i] === expected) {
      streak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      break;
    }
  }
  return streak;
}

function deleteHabit(habitId) {
  if (!confirm('¿Estás seguro de que quieres eliminar este hábito?')) return;
  habits = habits.filter(h => h.id !== habitId);
  saveLocalData();
  renderHabits();
  updateStats();
}

// Renderizar hábitos (corregido: usa id 'habits-list' + HTML del card completo)
function renderHabits() {
  const filter = document.getElementById('filter-category') ? document.getElementById('filter-category').value : 'all';
  const container = document.getElementById('habits-list');
  if (!container) return;
  container.innerHTML = '';

  let filtered = filter === 'all' ? habits : habits.filter(h => h.category === filter);
  const today = getLocalDateStr(new Date());

  if (filtered.length === 0) {
    container.innerHTML = '<div class="empty-state"><p>No hay hábitos. ¡Añade tu primer hábito!</p></div>';
    return;
  }

  filtered.forEach(habit => {
    const isCompleted = habit.completedDates.includes(today);
    const el = document.createElement('div');
    el.className = `habit-card ${isCompleted ? 'completed' : ''}`;
    el.innerHTML = `
      <div class="habit-emoji">${habit.emoji}</div>
      <div class="habit-info">
        <h3>${habit.name}</h3>
        <span class="category-badge">${habit.category}</span>
        <div class="habit-stats">
          <span>Racha &nbsp;<strong>${habit.streak} 🔥</strong></span>
          <span>Total &nbsp;<strong>${habit.completedDates.length}</strong></span>
        </div>
      </div>
      <div class="habit-actions">
        <button class="btn-complete ${isCompleted ? 'done' : ''}" onclick="toggleHabit('${habit.id}')">
          ${isCompleted ? '✓' : '○'}
        </button>
        <button class="btn-delete" onclick="deleteHabit('${habit.id}')">🗑️</button>
      </div>`;
    container.appendChild(el);
  });
}

function updateStats() {
  const today = getLocalDateStr(new Date());
  const completedToday = habits.filter(h => h.completedDates.includes(today)).length;
  const bestStreak = habits.length > 0 ? Math.max(...habits.map(h => h.streak)) : 0;
  document.getElementById('stat-total').textContent = habits.length;
  document.getElementById('stat-today').textContent = completedToday;
  document.getElementById('stat-streak').textContent = bestStreak;
}

// Modal helpers
function openModal(id) {
  document.getElementById(id).style.display = 'flex';
  setTimeout(() => document.getElementById('new-habit-name').focus(), 100);
}
function closeModal(id) {
  document.getElementById(id).style.display = 'none';
}

// Toast
let toastTimer;
function showToast(msg) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2500);
}

// Cerrar modal al hacer click fuera
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('click', e => {
      if (e.target === modal) modal.style.display = 'none';
    });
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Enter' && document.getElementById('add-modal').style.display === 'flex') {
      saveHabit();
    }
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal').forEach(m => m.style.display = 'none');
    }
  });
});
