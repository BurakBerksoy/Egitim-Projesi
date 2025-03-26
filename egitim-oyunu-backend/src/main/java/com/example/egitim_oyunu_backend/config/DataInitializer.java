package com.example.egitim_oyunu_backend.config;

import com.example.egitim_oyunu_backend.model.ERole;
import com.example.egitim_oyunu_backend.model.Role;
import com.example.egitim_oyunu_backend.repository.RoleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private RoleRepository roleRepository;

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        try {
            initRoles();
        } catch (Exception e) {
            System.err.println("Roller oluşturulurken hata: " + e.getMessage());
        }
    }

    private void initRoles() {
        // Önce her bir rol için veritabanında var mı kontrol et
        if (!roleRepository.existsByName(ERole.ROLE_USER)) {
            Role userRole = new Role();
            userRole.setName(ERole.ROLE_USER);
            roleRepository.save(userRole);
            System.out.println("ROLE_USER oluşturuldu");
        }

        if (!roleRepository.existsByName(ERole.ROLE_TEACHER)) {
            Role teacherRole = new Role();
            teacherRole.setName(ERole.ROLE_TEACHER);
            roleRepository.save(teacherRole);
            System.out.println("ROLE_TEACHER oluşturuldu");
        }

        if (!roleRepository.existsByName(ERole.ROLE_ADMIN)) {
            Role adminRole = new Role();
            adminRole.setName(ERole.ROLE_ADMIN);
            roleRepository.save(adminRole);
            System.out.println("ROLE_ADMIN oluşturuldu");
        }
    }
} 