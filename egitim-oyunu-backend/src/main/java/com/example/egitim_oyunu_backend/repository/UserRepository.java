package com.example.egitim_oyunu_backend.repository;

import com.example.egitim_oyunu_backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
    
    Optional<User> findByEmail(String email);
    
    Optional<User> findByResetToken(String resetToken);
    
    Boolean existsByUsername(String username);
    
    Boolean existsByEmail(String email);
} 