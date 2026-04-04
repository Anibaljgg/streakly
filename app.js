// Streakly - app.js
// Versión local (sin Firebase)

// Estado de la app
let currentUser = 'local-user'; // Usuario único para localStorage
let habits = [];

// Inicializar la app
function init() {
    loadLocalData();
    setupAuthListener();
}

// Cargar datos de localStorage
function loadLocalData() {
    const saved = localStorage.getItem('streakly-habits');
    if (saved) {
        habits = JSON.parse(saved);
    }
    console.log('Datos cargados desde localStorage');
}

// Guardar datos en localStorage
function saveLocalData() {
    localStorage.setItem('streakly-habits', JSON.stringify(habits));
    console.log('Datos guardados en localStorage');
}

// Configurar listener de autenticación (simulado)
function setupAuthListener() {
    // Simular usuario autenticado automáticamente
    setTimeout(() => {
        showApp();
        loadHabitsFromFirestore();
    }, 100);
}

// Registro / Login con email (simulado - solo guarda en local)
function registerUser(email, password) {
    if (!email || !password) {
        alert('Por favor ingresa email y contraseña');
        return;
    }
    
    // Simular registro exitoso
    currentUser = email;
    showApp();
    loadHabitsFromFirestore();
}

function loginUser(email, password) {
    if (!email || !password) {
        alert('Por favor ingresa email y contraseña');
        return;
    }
    
    // Simular login exitoso
    currentUser = email;
    showApp();
    loadHabitsFromFirestore();
}

// Login con Google (simulado)
function loginWithGoogle() {
    // Simular login con Google
    currentUser = 'google-user@gmail.com';
    showApp();
    loadHabitsFromFirestore();
}

// Cerrar sesión
function logout() {
    currentUser = null;
    habits = [];
    showAuth();
}

// Mostrar/ocultar secciones
function showAuth() {
    document.getElementById('auth-section').style.display = 'flex';
    document.getElementById('app-section').style.display = 'none';
}

function showApp() {
    document.getElementById('auth-section').style.display = 'none';
    document.getElementById('app-section').style.display = 'block';
}

// Cargar hábitos (desde localStorage)
function loadHabitsFromFirestore() {
    loadLocalData();
    renderHabits();
    updateStats();
}

// Añadir hábito
function addHabit(name, emoji, category) {
    const habit = {
        id: Date.now().toString(),
        name: name,
        emoji: emoji,
        category: category,
        completedDates: [],
        createdAt: new Date().toISOString(),
        streak: 0
    };
    
    habits.push(habit);
    saveLocalData();
    renderHabits();
    updateStats();
}

// Marcar hábito como completado
function toggleHabit(habitId) {
    const habit = habits.find(h => h.id === habitId);
    if (!habit) return;
    
    const today = new Date().toISOString().split('T')[0];
    const index = habit.completedDates.indexOf(today);
    
    if (index > -1) {
        // Ya está completado, desmarcarlo
        habit.completedDates.splice(index, 1);
    } else {
        // Marcarlo como completado
        habit.completedDates.push(today);
    }
    
    // Calcular racha
    habit.streak = calculateStreak(habit.completedDates);
    
    saveLocalData();
    renderHabits();
    updateStats();
}

// Calcular racha
function calculateStreak(completedDates) {
    if (completedDates.length === 0) return 0;
    
    const sorted = completedDates.sort().reverse();
    const today = new Date().toISOString().split('T')[0];
    
    let streak = 0;
    let checkDate = new Date(today);
    
    for (let i = 0; i < sorted.length; i++) {
        const dateStr = checkDate.toISOString().split('T')[0];
        if (sorted[i] === dateStr) {
            streak++;
            checkDate.setDate(checkDate.getDate() - 1);
        } else {
            break;
        }
    }
    
    return streak;
}

// Eliminar hábito
function deleteHabit(habitId) {
    if (!confirm('¿Estás seguro de que quieres eliminar este hábito?')) return;
    
    habits = habits.filter(h => h.id !== habitId);
    saveLocalData();
    renderHabits();
    updateStats();
}

// Renderizar hábitos
function renderHabits(filter = 'all') {
    const container = document.getElementById('habits-container');
    if (!container) return;
    
    container.innerHTML = '';
    
    let filteredHabits = habits;
    if (filter !== 'all') {
        filteredHabits = habits.filter(h => h.category === filter);
    }
    
    const today = new Date().toISOString().split('T')[0];
    
    filteredHabits.forEach(habit => {
        const isCompleted = habit.completedDates.includes(today);
        
        const habitEl = document.createElement('div');
        habitEl.className = `habit-card ${isCompleted ? 'completed' : ''}`;
        habitEl.innerHTML = `
            <div class="habit-header">
                <span class="habit-emoji">${habit.emoji}</span>
                <div class="habit-info">
                    <h3>${habit.name}</h3>
                    <span class="habit-category">${habit.category}</span>
                </div>
            </div>
            <div class="habit-stats">
                <div class="stat">
                    <span class="stat-label">Racha</span>
                    <span class="stat-value">${habit.streak} 🔥</span>
                </div>
                <div class="stat">
                    <span class="stat-label">Total</span>
                    <span class="stat-value">${habit.completedDates.length}</span>
                </div>
            </div>
            <div class="habit-actions">
                <button onclick="toggleHabit('${habit.id}')" class="btn-toggle">
                    ${isCompleted ? '✓ Completado' : 'Marcar completado'}
                </button>
                <button onclick="deleteHabit('${habit.id}')" class="btn-delete">🗑️</button>
            </div>
        `;
        
        container.appendChild(habitEl);
    });
    
    if (filteredHabits.length === 0) {
        container.innerHTML = '<p class="no-habits">No hay hábitos. ¡Añade tu primer hábito!</p>';
    }
}

// Actualizar estadísticas
function updateStats() {
    const totalHabits = habits.length;
    const today = new Date().toISOString().split('T')[0];
    const completedToday = habits.filter(h => h.completedDates.includes(today)).length;
    const totalStreak = habits.reduce((sum, h) => sum + h.streak, 0);
    
    document.getElementById('total-habits').textContent = totalHabits;
    document.getElementById('completed-today').textContent = completedToday;
    document.getElementById('total-streak').textContent = totalStreak;
}

// Event listeners del DOM
document.addEventListener('DOMContentLoaded', () => {
    init();
    
    // Botón de login
    const loginBtn = document.getElementById('login-btn');
    if (loginBtn) {
        loginBtn.addEventListener('click', () => {
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            loginUser(email, password);
        });
    }
    
    // Botón de registro
    const registerBtn = document.getElementById('register-btn');
    if (registerBtn) {
        registerBtn.addEventListener('click', () => {
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            registerUser(email, password);
        });
    }
    
    // Botón de Google
    const googleBtn = document.getElementById('google-btn');
    if (googleBtn) {
        googleBtn.addEventListener('click', loginWithGoogle);
    }
    
    // Botón de logout
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', logout);
    }
    
    // Botón de añadir hábito
    const addBtn = document.getElementById('add-habit-btn');
    if (addBtn) {
        addBtn.addEventListener('click', () => {
            const name = prompt('Nombre del hábito:');
            if (!name) return;
            
            const emoji = prompt('Emoji (ej: 💪, 📚, 🏃):') || '✅';
            const category = prompt('Categoría (Salud, Productividad, Deporte, Estudio, Otros):') || 'Otros';
            
            addHabit(name, emoji, category);
        });
    }
    
    // Filtros
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const filter = btn.dataset.filter;
            renderHabits(filter);
            
            // Actualizar botón activo
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });
});
