package com.example.egitim_oyunu_backend.payload.response;

import lombok.Data;

import java.util.List;

@Data
public class JwtResponse {
    private String token;
    private String type = "Bearer";
    private Long id;
    private String username;
    private String email;
    private Integer totalScore;
    private Integer level;
    private List<String> roles;

    public JwtResponse(String accessToken, Long id, String username, String email,
                       Integer totalScore, Integer level, List<String> roles) {
        this.token = accessToken;
        this.id = id;
        this.username = username;
        this.email = email;
        this.totalScore = totalScore;
        this.level = level;
        this.roles = roles;
    }
} 