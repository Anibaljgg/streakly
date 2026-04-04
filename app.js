// Streakly - app.js
// Configuracion Firebase
const firebaseConfig = {
  apiKey: "AIzaSyA0D69-UeOtJD2+ML1bxzWsOQPJbB_2m3g",
  authDomain: "streakly-c1324.firebaseapp.com",
  projectId: "streakly-c1324",
  storageBucket: "streakly-c1324.firebasestorage.app",
  messagingSenderId: "629706853224",
  appId: "1:629706853224:web:1ebf20c5e9cbf5e4b164dd"
};
// Estado de la app
let currentUser = null;
let habits = [];
let db = null;
let auth = null;
let useFirebase = false;

// Inicializar Firebase si esta disponible
function initFirebase() {
  try {
    if (typeof firebase !== 'undefined') {
      firebase.initializeApp(firebaseConfig);
      auth = firebase.auth();
      db = firebase.firestore();
      useFirebase = true;
      setupAuthListener();
    }
  } catch(e) {
    console.log('Firebase no disponible, usando modo local');
    loadLocalData();
  }
}

function setupAuthListener() {
  auth.onAuthStateChanged(user => {
    currentUser = user;
    if (user) {
      showApp();
      loadHabitsFromFirestore();
    } else {
      showAuth();
    }
  });
}

// Registro / Login con email
function registerWithEmail() {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  if (!email || !password) return showToast('Completa todos los campos');
  if (useFirebase) {
    auth.createUserWithEmailAndPassword(email, password)
      .then(() => showToast('Cuenta creada!'))
      .catch(e => showToast('Error: ' + e.message));
  } else {
    loginLocal(email);
  }
}

function loginWithEmail() {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  if (!email || !password) return showToast('Completa todos los campos');
  if (useFirebase) {
    auth.signInWithEmailAndPassword(email, password)
      .catch(e => showToast('Error: ' + e.message));
  } else {
    loginLocal(email);
  }
}

function loginWithGoogle() {
  if (useFirebase) {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider).catch(e => showToast('Error: ' + e.message));
  } else {
    loginLocal('usuario@demo.com');
  }
}

function logout() {
  if (useFirebase) {
    auth.signOut();
  } else {
    currentUser = null;
    habits = [];
    showAuth();
  }
}

// Modo local (sin Firebase)
function loginLocal(email) {
  currentUser = { email, displayName: email.split('@')[0] };
  document.getElementById('user-name').textContent = currentUser.displayName;
  loadLocalData();
  showApp();
}

function loadLocalData() {
  const stored = localStorage.getItem('streakly_habits');
  habits = stored ? JSON.parse(stored) : getDefaultHabits();
  renderHabits();
}

function saveLocalData() {
  localStorage.setItem('streakly_habits', JSON.stringify(habits));
}

function getDefaultHabits() {
  return [
    { id: '1', name: 'Beber agua', emoji: '💧', category: 'salud', streak: 0, completedToday: false, totalDays: 0, createdAt: new Date().toISOString() },
    { id: '2', name: 'Hacer ejercicio', emoji: '🏋️', category: 'fitness', streak: 0, completedToday: false, totalDays: 0, createdAt: new Date().toISOString() },
    { id: '3', name: 'Leer 20 minutos', emoji: '📚', category: 'aprendizaje', streak: 0, completedToday: false, totalDays: 0, createdAt: new Date().toISOString() }
  ];
}

// Firestore
async function loadHabitsFromFirestore() {
  if (!useFirebase || !currentUser) return;
  try {
    const snapshot = await db.collection('habits').where('userId', '==', currentUser.uid).get();
    habits = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    if (habits.length === 0) {
      habits = getDefaultHabits();
      habits.forEach(h => saveHabitToFirestore(h));
    }
    renderHabits();
  } catch(e) {
    console.log('Error cargando Firestore, usando localStorage', e);
    loadLocalData();
  }
}

async function saveHabitToFirestore(habit) {
  if (!useFirebase || !currentUser) return;
  try {
    await db.collection('habits').doc(habit.id).set({ ...habit, userId: currentUser.uid });
  } catch(e) { console.log('Error guardando en Firestore', e); }
}

// CRUD Habitos
function addHabit() {
  const name = document.getElementById('new-habit-name').value.trim();
  const emoji = document.getElementById('new-habit-emoji').value || '⭐';
  const category = document.getElementById('new-habit-category').value;
  if (!name) return showToast('Escribe el nombre del habito');

  const habit = {
    id: Date.now().toString(),
    name, emoji, category,
    streak: 0,
    completedToday: false,
    totalDays: 0,
    lastCompleted: null,
    createdAt: new Date().toISOString()
  };

  habits.push(habit);
  if (useFirebase) saveHabitToFirestore(habit);
  else saveLocalData();

  document.getElementById('new-habit-name').value = '';
  closeModal('add-modal');
  renderHabits();
  showToast('Habito agregado!');
}

function completeHabit(id) {
  const habit = habits.find(h => h.id === id);
  if (!habit) return;

  const today = new Date().toDateString();
  const lastDate = habit.lastCompleted ? new Date(habit.lastCompleted).toDateString() : null;

  if (lastDate === today) {
    showToast('Ya completaste este habito hoy');
    return;
  }

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const wasYesterday = lastDate === yesterday.toDateString();

  habit.streak = wasYesterday ? habit.streak + 1 : 1;
  habit.completedToday = true;
  habit.totalDays += 1;
  habit.lastCompleted = new Date().toISOString();

  if (useFirebase) saveHabitToFirestore(habit);
  else saveLocalData();

  renderHabits();
  showToast('Racha: ' + habit.streak + ' dias!');
}

function deleteHabit(id) {
  if (!confirm('Eliminar este habito?')) return;
  habits = habits.filter(h => h.id !== id);
  if (useFirebase && currentUser) {
    db.collection('habits').doc(id).delete().catch(console.error);
  } else {
    saveLocalData();
  }
  renderHabits();
  showToast('Habito eliminado');
}

// Renderizado
function renderHabits() {
  const container = document.getElementById('habits-list');
  if (!container) return;

  const filter = document.getElementById('filter-category')?.value || 'all';
  const filtered = filter === 'all' ? habits : habits.filter(h => h.category === filter);

  if (filtered.length === 0) {
    container.innerHTML = '<div class="empty-state"><p>No tienes habitos aun. Agrega uno!</p></div>';
    return;
  }

  container.innerHTML = filtered.map(h => {
    const today = new Date().toDateString();
    const lastDate = h.lastCompleted ? new Date(h.lastCompleted).toDateString() : null;
    const done = lastDate === today;
    return `
    <div class="habit-card ${done ? 'completed' : ''}" id="habit-${h.id}">
      <div class="habit-emoji">${h.emoji}</div>
      <div class="habit-info">
        <h3>${h.name}</h3>
        <span class="category-badge">${h.category}</span>
        <div class="habit-stats">
          <span>🔥 ${h.streak} dias</span>
          <span>📅 ${h.totalDays} totales</span>
        </div>
      </div>
      <div class="habit-actions">
        <button class="btn-complete ${done ? 'done' : ''}" onclick="completeHabit('${h.id}')">
          ${done ? '✅' : '⭕'}
        </button>
        <button class="btn-delete" onclick="deleteHabit('${h.id}')">🗑️</button>
      </div>
    </div>`;
  }).join('');

  updateStats();
}

function updateStats() {
  const total = habits.length;
  const today = new Date().toDateString();
  const completedToday = habits.filter(h => h.lastCompleted && new Date(h.lastCompleted).toDateString() === today).length;
  const maxStreak = Math.max(0, ...habits.map(h => h.streak));

  document.getElementById('stat-total').textContent = total;
  document.getElementById('stat-today').textContent = completedToday;
  document.getElementById('stat-streak').textContent = maxStreak;
}

// UI
function showApp() {
  document.getElementById('auth-section').style.display = 'none';
  document.getElementById('app-section').style.display = 'block';
  if (currentUser) {
    document.getElementById('user-name').textContent = currentUser.displayName || currentUser.email;
  }
  renderHabits();
}

function showAuth() {
  document.getElementById('auth-section').style.display = 'flex';
  document.getElementById('app-section').style.display = 'none';
}

function openModal(id) {
  document.getElementById(id).style.display = 'flex';
}

function closeModal(id) {
  document.getElementById(id).style.display = 'none';
}

function showToast(msg) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3000);
}

// Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/streakly/sw.js')
      .then(() => console.log('SW registrado'))
      .catch(e => console.log('SW error', e));
  });
}

// Iniciar
window.addEventListener('DOMContentLoaded', () => {
  initFirebase();
  if (!useFirebase) {
    loadLocalData();
    showApp();
  }
});
