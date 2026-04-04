package com.universae.streakly.data.model;

import androidx.room.Entity;
import androidx.room.PrimaryKey;
import androidx.room.ColumnInfo;
import java.util.Date;

/**
 * Entidad Habit - Modelo de datos para hábitos
 * Utiliza Room para persistencia local (SQLite)
 * Compatible con Firebase Firestore para sincronización en la nube
 */
@Entity(tableName = "habits")
public class Habit {

    @PrimaryKey(autoGenerate = true)
    private long id;

    @ColumnInfo(name = "user_id")
    private String userId;

    @ColumnInfo(name = "name")
    private String name;

    @ColumnInfo(name = "emoji")
    private String emoji;

    @ColumnInfo(name = "category")
    private String category; // salud, fitness, aprendizaje, trabajo, otro

    @ColumnInfo(name = "streak")
    private int streak; // Días consecutivos

    @ColumnInfo(name = "total_days")
    private int totalDays; // Días totales completados

    @ColumnInfo(name = "last_completed")
    private Date lastCompleted;

    @ColumnInfo(name = "created_at")
    private Date createdAt;

    @ColumnInfo(name = "synced_with_cloud")
    private boolean syncedWithCloud;

    // Constructor
    public Habit(String userId, String name, String emoji, String category) {
        this.userId = userId;
        this.name = name;
        this.emoji = emoji;
        this.category = category;
        this.streak = 0;
        this.totalDays = 0;
        this.createdAt = new Date();
        this.syncedWithCloud = false;
    }

    // Getters y Setters
    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmoji() {
        return emoji;
    }

    public void setEmoji(String emoji) {
        this.emoji = emoji;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public int getStreak() {
        return streak;
    }

    public void setStreak(int streak) {
        this.streak = streak;
    }

    public int getTotalDays() {
        return totalDays;
    }

    public void setTotalDays(int totalDays) {
        this.totalDays = totalDays;
    }

    public Date getLastCompleted() {
        return lastCompleted;
    }

    public void setLastCompleted(Date lastCompleted) {
        this.lastCompleted = lastCompleted;
    }

    public Date getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }

    public boolean isSyncedWithCloud() {
        return syncedWithCloud;
    }

    public void setSyncedWithCloud(boolean syncedWithCloud) {
        this.syncedWithCloud = syncedWithCloud;
    }

    /**
     * Método para completar el hábito del día
     * Actualiza la racha si se completó ayer, sino reinicia a 1
     */
    public void complete() {
        Date today = new Date();
        if (lastCompleted != null) {
            long diffInMillis = today.getTime() - lastCompleted.getTime();
            long diffInDays = diffInMillis / (1000 * 60 * 60 * 24);
            
            if (diffInDays == 1) {
                // Completado ayer, incrementar racha
                streak++;
            } else if (diffInDays > 1) {
                // Se rompió la racha
                streak = 1;
            }
            // Si diffInDays == 0, ya se completó hoy (no hacer nada)
        } else {
            // Primera vez
            streak = 1;
        }
        
        totalDays++;
        lastCompleted = today;
        syncedWithCloud = false; // Marcar para sincronizar
    }
}
