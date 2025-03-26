package com.example.egitim_oyunu_backend.payload.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class LoginRequest {
    @NotBlank
    private String username;

    @NotBlank
    private String password;
    
    // Email alanını seçimli olarak ekleyebiliriz, frontend'den gelen isteklere destek için
    private String email;
    
    // Username boşsa, email'i kullanmak için yardımcı metot
    public String getEffectiveUsername() {
        return (username != null && !username.trim().isEmpty()) ? username : email;
    }
    
    @Override
    public String toString() {
        return "LoginRequest [username=" + username + ", email=" + email + ", password length=" + 
               (password != null ? password.length() : 0) + "]";
    }
} 