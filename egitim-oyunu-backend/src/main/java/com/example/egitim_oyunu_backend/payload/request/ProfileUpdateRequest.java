package com.example.egitim_oyunu_backend.payload.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;

public class ProfileUpdateRequest {
    @Size(min = 3, max = 20)
    private String username;

    @Size(max = 50)
    @Email
    private String email;

    @Size(max = 500)
    private String bio;

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getBio() {
        return bio;
    }

    public void setBio(String bio) {
        this.bio = bio;
    }
} 