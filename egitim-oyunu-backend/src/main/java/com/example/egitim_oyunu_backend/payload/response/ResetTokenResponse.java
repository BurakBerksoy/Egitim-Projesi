package com.example.egitim_oyunu_backend.payload.response;

public class ResetTokenResponse {
    private String token;
    private String message;

    public ResetTokenResponse(String token, String message) {
        this.token = token;
        this.message = message;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
} 