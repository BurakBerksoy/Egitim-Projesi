package com.example.egitim_oyunu_backend.controller;

import com.example.egitim_oyunu_backend.model.ERole;
import com.example.egitim_oyunu_backend.model.Role;
import com.example.egitim_oyunu_backend.model.User;
import com.example.egitim_oyunu_backend.payload.request.LoginRequest;
import com.example.egitim_oyunu_backend.payload.request.SignupRequest;
import com.example.egitim_oyunu_backend.payload.request.ProfileUpdateRequest;
import com.example.egitim_oyunu_backend.payload.request.PasswordChangeRequest;
import com.example.egitim_oyunu_backend.payload.request.ForgotPasswordRequest;
import com.example.egitim_oyunu_backend.payload.request.ResetPasswordRequest;
import com.example.egitim_oyunu_backend.payload.response.JwtResponse;
import com.example.egitim_oyunu_backend.payload.response.MessageResponse;
import com.example.egitim_oyunu_backend.payload.response.ResetTokenResponse;
import com.example.egitim_oyunu_backend.repository.RoleRepository;
import com.example.egitim_oyunu_backend.repository.UserRepository;
import com.example.egitim_oyunu_backend.security.jwt.JwtUtils;
import com.example.egitim_oyunu_backend.security.services.UserDetailsImpl;
import com.example.egitim_oyunu_backend.service.EmailService;
import jakarta.annotation.PostConstruct;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.Date;
import java.util.Optional;
import java.util.UUID;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    UserRepository userRepository;

    @Autowired
    RoleRepository roleRepository;

    @Autowired
    PasswordEncoder encoder;

    @Autowired
    JwtUtils jwtUtils;

    @Autowired
    private EmailService emailService;
    
    @Value("${app.frontend.url:http://localhost:5173}")
    private String frontendUrl;

    @PostConstruct
    public void init() {
        // Test kullanıcısı henüz yoksa oluştur
        if (!userRepository.existsByEmail("test@example.com")) {
            System.out.println("Test kullanıcısı oluşturuluyor...");
            
            User testUser = new User(
                "testuser",
                "test@example.com",
                encoder.encode("test123") // Şifreyi şifrele
            );
            
            Set<Role> roles = new HashSet<>();
            Role userRole = roleRepository.findByName(ERole.ROLE_USER)
                .orElseThrow(() -> new RuntimeException("Hata: Rol bulunamadı."));
            roles.add(userRole);
            testUser.setRoles(roles);
            
            userRepository.save(testUser);
            System.out.println("Test kullanıcısı başarıyla oluşturuldu!");
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        try {
            // Gelen istek parametrelerini logla
            System.out.println("Login isteği alındı: " + loginRequest.toString());
            
            // Email ve username alanlarını kontrol et
            String usernameOrEmail = loginRequest.getEffectiveUsername();
            
            if (usernameOrEmail == null || usernameOrEmail.trim().isEmpty()) {
                System.err.println("Hata: Kullanıcı adı veya email boş!");
                return ResponseEntity
                        .badRequest()
                        .body(new MessageResponse("Hata: Kullanıcı adı veya email adresi gereklidir."));
            }
            
            System.out.println("Giriş isteği - username/email: " + usernameOrEmail + ", şifre uzunluğu: " + 
                (loginRequest.getPassword() != null ? loginRequest.getPassword().length() : 0));
            
            // Kullanıcı var mı kontrol et
            try {
                userRepository.findByUsername(usernameOrEmail)
                    .orElseGet(() -> userRepository.findByEmail(usernameOrEmail)
                        .orElseThrow(() -> {
                            System.err.println("Kullanıcı bulunamadı: " + usernameOrEmail);
                            return new UsernameNotFoundException("Kullanıcı bulunamadı: " + usernameOrEmail);
                        }));
                System.out.println("Kullanıcı bulundu: " + usernameOrEmail);
            } catch (UsernameNotFoundException e) {
                return ResponseEntity
                        .badRequest()
                        .body(new MessageResponse("Hata: " + e.getMessage()));
            }
            
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            usernameOrEmail, 
                            loginRequest.getPassword()));

            SecurityContextHolder.getContext().setAuthentication(authentication);
            String jwt = jwtUtils.generateJwtToken(authentication);

            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
            List<String> roles = userDetails.getAuthorities().stream()
                    .map(item -> item.getAuthority())
                    .collect(Collectors.toList());

            System.out.println("Login başarılı. Kullanıcı: " + userDetails.getUsername() + ", Token oluşturuldu");
            
            return ResponseEntity.ok(new JwtResponse(jwt,
                    userDetails.getId(),
                    userDetails.getUsername(),
                    userDetails.getEmail(),
                    userDetails.getTotalScore(),
                    userDetails.getLevel(),
                    roles));
        } catch (Exception e) {
            System.err.println("Giriş hatası: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Hata: Kullanıcı adı veya şifre hatalı! " + e.getMessage()));
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signUpRequest) {
        // Kullanıcı adı veya e-posta adresi zaten var mı kontrol et
        if (userRepository.existsByUsername(signUpRequest.getUsername())) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Hata: Bu kullanıcı adı zaten kullanılıyor!"));
        }

        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Hata: Bu e-posta adresi zaten kullanılıyor!"));
        }

        // Yeni kullanıcıyı oluştur
        User user = new User(
                signUpRequest.getUsername(),
                signUpRequest.getEmail(),
                encoder.encode(signUpRequest.getPassword()) // Şifreyi şifrele
        );

        Set<String> strRoles = signUpRequest.getRole();
        Set<Role> roles = new HashSet<>();

        // Rol bilgisi verilmediyse varsayılan olarak ROLE_USER atanır
        if (strRoles == null || strRoles.isEmpty()) {
            Role userRole = roleRepository.findByName(ERole.ROLE_USER)
                    .orElseThrow(() -> new RuntimeException("Hata: Rol bulunamadı."));
            roles.add(userRole);
        } else {
            strRoles.forEach(role -> {
                switch (role) {
                    case "admin":
                        Role adminRole = roleRepository.findByName(ERole.ROLE_ADMIN)
                                .orElseThrow(() -> new RuntimeException("Hata: Rol bulunamadı."));
                        roles.add(adminRole);
                        break;
                    case "teacher":
                        Role teacherRole = roleRepository.findByName(ERole.ROLE_TEACHER)
                                .orElseThrow(() -> new RuntimeException("Hata: Rol bulunamadı."));
                        roles.add(teacherRole);
                        break;
                    default:
                        Role userRole = roleRepository.findByName(ERole.ROLE_USER)
                                .orElseThrow(() -> new RuntimeException("Hata: Rol bulunamadı."));
                        roles.add(userRole);
                }
            });
        }

        user.setRoles(roles);
        userRepository.save(user);

        return ResponseEntity.ok(new MessageResponse("Kullanıcı başarıyla kaydedildi!"));
    }

    // Kullanıcı profili güncelleme
    @PostMapping("/profile/update")
    public ResponseEntity<?> updateProfile(@Valid @RequestBody ProfileUpdateRequest updateRequest, @RequestHeader("Authorization") String token) {
        try {
            // Token kontrolü
            if (token == null || !token.startsWith("Bearer ")) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new MessageResponse("Hata: Yetkilendirme hatası!"));
            }
            
            String jwt = token.substring(7);
            
            if (!jwtUtils.validateJwtToken(jwt)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new MessageResponse("Hata: Geçersiz token!"));
            }
            
            String username = jwtUtils.getUserNameFromJwtToken(jwt);
            
            // Kullanıcıyı bul
            User user = userRepository.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("Kullanıcı bulunamadı!"));
            
            // Kullanıcı bilgilerini güncelle
            if (updateRequest.getUsername() != null && !updateRequest.getUsername().trim().isEmpty()) {
                // Kullanıcı adı kontrolü
                if (!user.getUsername().equals(updateRequest.getUsername()) && 
                    userRepository.existsByUsername(updateRequest.getUsername())) {
                    return ResponseEntity.badRequest()
                            .body(new MessageResponse("Hata: Bu kullanıcı adı zaten kullanılıyor!"));
                }
                user.setUsername(updateRequest.getUsername());
            }
            
            if (updateRequest.getEmail() != null && !updateRequest.getEmail().trim().isEmpty()) {
                // Email kontrolü
                if (!user.getEmail().equals(updateRequest.getEmail()) && 
                    userRepository.existsByEmail(updateRequest.getEmail())) {
                    return ResponseEntity.badRequest()
                            .body(new MessageResponse("Hata: Bu e-posta adresi zaten kullanılıyor!"));
                }
                user.setEmail(updateRequest.getEmail());
            }
            
            if (updateRequest.getBio() != null) {
                user.setBio(updateRequest.getBio());
            }
            
            // Kullanıcıyı kaydet
            userRepository.save(user);
            
            return ResponseEntity.ok(new MessageResponse("Profil başarıyla güncellendi!"));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Hata: " + e.getMessage()));
        }
    }
    
    // Şifre değiştirme
    @PostMapping("/profile/change-password")
    public ResponseEntity<?> changePassword(@Valid @RequestBody PasswordChangeRequest passwordRequest, @RequestHeader("Authorization") String token) {
        try {
            // Token kontrolü
            if (token == null || !token.startsWith("Bearer ")) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new MessageResponse("Hata: Yetkilendirme hatası!"));
            }
            
            String jwt = token.substring(7);
            
            if (!jwtUtils.validateJwtToken(jwt)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new MessageResponse("Hata: Geçersiz token!"));
            }
            
            String username = jwtUtils.getUserNameFromJwtToken(jwt);
            
            // Kullanıcıyı bul
            User user = userRepository.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("Kullanıcı bulunamadı!"));
            
            // Mevcut şifreyi kontrol et
            if (!encoder.matches(passwordRequest.getCurrentPassword(), user.getPassword())) {
                return ResponseEntity.badRequest()
                        .body(new MessageResponse("Hata: Mevcut şifre yanlış!"));
            }
            
            // Yeni şifreyi ayarla
            user.setPassword(encoder.encode(passwordRequest.getNewPassword()));
            
            // Kullanıcıyı kaydet
            userRepository.save(user);
            
            return ResponseEntity.ok(new MessageResponse("Şifre başarıyla değiştirildi!"));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Hata: " + e.getMessage()));
        }
    }

    // Şifremi unuttum
    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@Valid @RequestBody ForgotPasswordRequest forgotRequest) {
        try {
            // E-posta kontrolü
            if (!userRepository.existsByEmail(forgotRequest.getEmail())) {
                return ResponseEntity.badRequest()
                        .body(new MessageResponse("Bu e-posta adresi ile kayıtlı kullanıcı bulunamadı."));
            }
            
            // Kullanıcıyı bul
            User user = userRepository.findByEmail(forgotRequest.getEmail())
                    .orElseThrow(() -> new RuntimeException("Kullanıcı bulunamadı!"));
            
            // Reset token oluştur (12 karakterlik rastgele bir token)
            String resetToken = generateResetToken();
            
            // Token'ın geçerlilik süresini ayarla (1 saat)
            Date expiryDate = new Date(System.currentTimeMillis() + 3600000);
            
            // Token'ı kullanıcıya kaydet
            user.setResetToken(resetToken);
            user.setResetTokenExpiry(expiryDate);
            userRepository.save(user);
            
            // Şifre sıfırlama URL'si oluştur
            String resetUrl = frontendUrl + "/reset-password?token=" + resetToken;
            
            // E-posta göndermeyi dene
            boolean emailSent = emailService.sendPasswordResetEmail(user.getEmail(), resetToken, resetUrl);
            
            if (emailSent) {
                return ResponseEntity.ok(new MessageResponse("Şifre sıfırlama bağlantısı e-posta adresinize gönderildi."));
            } else {
                // E-posta gönderimi başarısız oldu ama simülasyon modu aktif, token'ı doğrudan dön
                return ResponseEntity.ok(new ResetTokenResponse(resetToken, 
                    "GELİŞTİRME MODU: E-posta gönderilemedi. Lütfen bu token'ı kullanın: " + resetToken));
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Şifre sıfırlama işlemi sırasında bir hata oluştu: " + e.getMessage()));
        }
    }
    
    // Reset token doğrulama
    @GetMapping("/reset-password/validate")
    public ResponseEntity<?> validateResetToken(@RequestParam("token") String token) {
        try {
            // Token ile kullanıcıyı bul
            Optional<User> userOpt = userRepository.findByResetToken(token);
            
            if (!userOpt.isPresent()) {
                return ResponseEntity.badRequest()
                        .body(new MessageResponse("Geçersiz şifre sıfırlama bağlantısı."));
            }
            
            User user = userOpt.get();
            
            // Token'ın süresinin geçip geçmediğini kontrol et
            if (user.getResetTokenExpiry().before(new Date())) {
                return ResponseEntity.badRequest()
                        .body(new MessageResponse("Şifre sıfırlama bağlantısının süresi dolmuş."));
            }
            
            return ResponseEntity.ok(new MessageResponse("Şifre sıfırlama bağlantısı geçerli."));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Token doğrulama sırasında bir hata oluştu: " + e.getMessage()));
        }
    }
    
    // Şifre sıfırlama
    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@Valid @RequestBody ResetPasswordRequest resetRequest) {
        try {
            // Token ile kullanıcıyı bul
            Optional<User> userOpt = userRepository.findByResetToken(resetRequest.getToken());
            
            if (!userOpt.isPresent()) {
                return ResponseEntity.badRequest()
                        .body(new MessageResponse("Geçersiz şifre sıfırlama bağlantısı."));
            }
            
            User user = userOpt.get();
            
            // Token'ın süresinin geçip geçmediğini kontrol et
            if (user.getResetTokenExpiry().before(new Date())) {
                return ResponseEntity.badRequest()
                        .body(new MessageResponse("Şifre sıfırlama bağlantısının süresi dolmuş."));
            }
            
            // Yeni şifreyi kontrol et
            if (!resetRequest.getNewPassword().equals(resetRequest.getConfirmPassword())) {
                return ResponseEntity.badRequest()
                        .body(new MessageResponse("Şifreler eşleşmiyor."));
            }
            
            // Kullanıcının şifresini güncelle
            user.setPassword(encoder.encode(resetRequest.getNewPassword()));
            
            // Reset token'ı temizle
            user.setResetToken(null);
            user.setResetTokenExpiry(null);
            
            // Kullanıcıyı kaydet
            userRepository.save(user);
            
            return ResponseEntity.ok(new MessageResponse("Şifreniz başarıyla sıfırlandı."));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Şifre sıfırlama sırasında bir hata oluştu: " + e.getMessage()));
        }
    }
    
    // Random token üret
    private String generateResetToken() {
        return UUID.randomUUID().toString().substring(0, 12);
    }
} 