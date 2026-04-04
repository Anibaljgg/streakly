package com.universae.streakly.ui;

import android.os.Bundle;
import android.view.MenuItem;
import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import androidx.fragment.app.Fragment;
import androidx.lifecycle.ViewModelProvider;
import com.google.android.material.bottomnavigation.BottomNavigationView;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseUser;
import com.universae.streakly.R;
import com.universae.streakly.data.viewmodel.HabitViewModel;
import com.universae.streakly.ui.auth.LoginActivity;
import com.universae.streakly.ui.habits.HabitsFragment;
import com.universae.streakly.ui.profile.ProfileFragment;
import com.universae.streakly.ui.stats.StatsFragment;

/**
 * MainActivity - Actividad principal de la aplicación Streakly
 * Implementa navegación mediante BottomNavigationView con Fragments
 * Integra Firebase Authentication y Room Database local
 */
public class MainActivity extends AppCompatActivity {

    private FirebaseAuth mAuth;
    private HabitViewModel habitViewModel;
    private BottomNavigationView bottomNavigationView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        // Inicializar Firebase Auth
        mAuth = FirebaseAuth.getInstance();
        FirebaseUser currentUser = mAuth.getCurrentUser();

        // Si no hay usuario autenticado, ir a Login
        if (currentUser == null) {
            startActivity(new Intent(this, LoginActivity.class));
            finish();
            return;
        }

        // Inicializar ViewModel para sincronización de datos
        habitViewModel = new ViewModelProvider(this).get(HabitViewModel.class);

        // Configurar Bottom Navigation
        bottomNavigationView = findViewById(R.id.bottom_navigation);
        bottomNavigationView.setOnItemSelectedListener(new BottomNavigationView.OnNavigationItemSelectedListener() {
            @Override
            public boolean onNavigationItemSelected(@NonNull MenuItem item) {
                Fragment selectedFragment = null;
                int itemId = item.getItemId();

                if (itemId == R.id.nav_habits) {
                    selectedFragment = new HabitsFragment();
                } else if (itemId == R.id.nav_stats) {
                    selectedFragment = new StatsFragment();
                } else if (itemId == R.id.nav_profile) {
                    selectedFragment = new ProfileFragment();
                }

                if (selectedFragment != null) {
                    getSupportFragmentManager().beginTransaction()
                            .replace(R.id.fragment_container, selectedFragment)
                            .commit();
                    return true;
                }
                return false;
            }
        });

        // Cargar fragment inicial
        if (savedInstanceState == null) {
            getSupportFragmentManager().beginTransaction()
                    .replace(R.id.fragment_container, new HabitsFragment())
                    .commit();
            bottomNavigationView.setSelectedItemId(R.id.nav_habits);
        }

        // Observar datos del ViewModel
        observeViewModel();
    }

    /**
     * Observa cambios en los datos del ViewModel
     * Sincroniza entre SQLite local y Firestore remoto
     */
    private void observeViewModel() {
        habitViewModel.getAllHabits().observe(this, habits -> {
            // Aquí se sincronizarían los cambios locales con Firestore
            // Implementar lógica de sincronización bidireccional
        });
    }

    @Override
    protected void onStart() {
        super.onStart();
        // Verificar autenticación al iniciar
        FirebaseUser currentUser = mAuth.getCurrentUser();
        if (currentUser == null) {
            startActivity(new Intent(this, LoginActivity.class));
            finish();
        }
    }
}
