package com.example.egitim_oyunu_backend.controller;

import com.example.egitim_oyunu_backend.model.User;
import com.example.egitim_oyunu_backend.repository.UserRepository;
import com.example.egitim_oyunu_backend.security.services.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/users")
public class UserController {
    @Autowired
    private UserRepository userRepository;

    @GetMapping("/profile")
    @PreAuthorize("hasRole('USER') or hasRole('TEACHER') or hasRole('ADMIN')")
    public ResponseEntity<?> getUserProfile() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        
        return ResponseEntity.ok(userDetails);
    }
    
    @GetMapping("/score")
    @PreAuthorize("hasRole('USER') or hasRole('TEACHER') or hasRole('ADMIN')")
    public ResponseEntity<?> getUserScore() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        
        Map<String, Object> response = new HashMap<>();
        response.put("totalScore", userDetails.getTotalScore());
        response.put("level", userDetails.getLevel());
        
        return ResponseEntity.ok(response);
    }
    
    @PutMapping("/score")
    @PreAuthorize("hasRole('USER') or hasRole('TEACHER') or hasRole('ADMIN')")
    public ResponseEntity<?> updateUserScore(@RequestBody Map<String, Integer> scoreData) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        
        User user = userRepository.findById(userDetails.getId())
                .orElseThrow(() -> new RuntimeException("Kullanıcı bulunamadı"));
        
        if (scoreData.containsKey("score")) {
            Integer currentScore = user.getTotalScore();
            Integer newScore = currentScore + scoreData.get("score");
            user.setTotalScore(newScore);
            
            int newLevel = (newScore / 100) + 1;
            user.setLevel(newLevel);
            
            userRepository.save(user);
            
            Map<String, Object> response = new HashMap<>();
            response.put("totalScore", user.getTotalScore());
            response.put("level", user.getLevel());
            response.put("message", "Puan başarıyla güncellendi");
            
            return ResponseEntity.ok(response);
        }
        
        return ResponseEntity.badRequest().body("Geçersiz skor verisi");
    }
} 