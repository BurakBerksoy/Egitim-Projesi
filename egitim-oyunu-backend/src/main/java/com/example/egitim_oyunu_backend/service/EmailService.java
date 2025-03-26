package com.example.egitim_oyunu_backend.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class EmailService {
    
    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);
    
    @Autowired
    private JavaMailSender mailSender;
    
    @Value("${spring.mail.username}")
    private String mailUsername;
    
    @Value("${app.mail.sender:noreply@egitim-oyunu.com}")
    private String mailSenderAddress;
    
    @Value("${app.mail.simulation.enabled:false}")
    private boolean simulationEnabled;
    
    /**
     * Şifre sıfırlama e-postası gönderir
     * 
     * @param to Alıcı e-posta adresi
     * @param token Şifre sıfırlama token'ı
     * @param resetUrl Şifre sıfırlama bağlantısı
     * @return true: E-posta başarıyla gönderildi, false: Hata oluştu ama simülasyon modu aktif
     * @throws RuntimeException E-posta gönderilemedi ve simülasyon modu kapalı ise
     */
    public boolean sendPasswordResetEmail(String to, String token, String resetUrl) {
        if (simulationEnabled) {
            logger.info("Simülasyon modu aktif: E-posta gönderimi simüle ediliyor. Token: {}, URL: {}", token, resetUrl);
            // E-posta göndermeyi deneyecek ama hata durumunda exception fırlatmayacak
            try {
                sendActualEmail(to, token, resetUrl);
                return true;
            } catch (Exception e) {
                logger.warn("Simülasyon modunda e-posta gönderimi başarısız oldu: {}, kullanıcı tokeni doğrudan alacak", e.getMessage());
                return false;
            }
        } else {
            // Normal mod - hata durumunda exception fırlatır
            sendActualEmail(to, token, resetUrl);
            return true;
        }
    }
    
    private void sendActualEmail(String to, String token, String resetUrl) {
        try {
            logger.info("E-posta gönderme işlemi başlatılıyor. Alıcı: {}, Token: {}", to, token);
            logger.info("Mail yapılandırması: E-posta kullanıcı adı: {}", mailUsername);
            
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            
            // E-posta adreslerini logla
            logger.info("Gönderici: {}, Alıcı: {}", mailSenderAddress, to);
            
            helper.setFrom(mailSenderAddress);
            helper.setTo(to);
            helper.setSubject("Şifre Sıfırlama - Eğitici Oyunlar");
            
            // HTML e-posta içeriği
            String htmlContent = createPasswordResetEmailContent(resetUrl);
            helper.setText(htmlContent, true);
            
            logger.info("E-posta gönderiliyor...");
            mailSender.send(message);
            logger.info("Şifre sıfırlama e-postası başarıyla gönderildi: {}", to);
        } catch (MessagingException e) {
            logger.error("E-posta gönderirken hata oluştu: {}", e.getMessage());
            logger.error("Hata detayları:", e);
            throw new RuntimeException("E-posta gönderirken bir hata oluştu: " + e.getMessage(), e);
        } catch (Exception e) {
            logger.error("Beklenmeyen bir hata oluştu: {}", e.getMessage());
            logger.error("Hata detayları:", e);
            throw new RuntimeException("E-posta gönderirken beklenmeyen bir hata oluştu: " + e.getMessage(), e);
        }
    }
    
    private String createPasswordResetEmailContent(String resetUrl) {
        StringBuilder builder = new StringBuilder();
        builder.append("<!DOCTYPE html>");
        builder.append("<html>");
        builder.append("<head>");
        builder.append("<meta charset=\"UTF-8\">");
        builder.append("<title>Şifre Sıfırlama</title>");
        builder.append("<style>");
        builder.append("body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }");
        builder.append(".container { max-width: 600px; margin: 0 auto; padding: 20px; }");
        builder.append(".header { background-color: #4f46e5; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }");
        builder.append(".content { padding: 20px; background-color: #f9f9f9; border-radius: 0 0 5px 5px; }");
        builder.append(".button { display: inline-block; background-color: #4f46e5; color: white; text-decoration: none; padding: 10px 20px; border-radius: 5px; margin: 20px 0; }");
        builder.append(".footer { margin-top: 20px; font-size: 12px; color: #888; text-align: center; }");
        builder.append("</style>");
        builder.append("</head>");
        builder.append("<body>");
        builder.append("<div class=\"container\">");
        builder.append("<div class=\"header\">");
        builder.append("<h1>Eğitici Oyunlar</h1>");
        builder.append("</div>");
        builder.append("<div class=\"content\">");
        builder.append("<h2>Şifre Sıfırlama İsteği</h2>");
        builder.append("<p>Hesabınız için bir şifre sıfırlama isteği aldık. Şifrenizi sıfırlamak için aşağıdaki düğmeye tıklayın:</p>");
        builder.append("<div style=\"text-align: center;\">");
        builder.append("<a href=\"").append(resetUrl).append("\" class=\"button\">Şifremi Sıfırla</a>");
        builder.append("</div>");
        builder.append("<p>Eğer bu işlemi siz başlatmadıysanız, bu e-postayı görmezden gelebilirsiniz.</p>");
        builder.append("<p>Bu bağlantı 1 saat boyunca geçerlidir.</p>");
        builder.append("</div>");
        builder.append("<div class=\"footer\">");
        builder.append("<p>© 2023 Eğitici Oyunlar. Tüm hakları saklıdır.</p>");
        builder.append("</div>");
        builder.append("</div>");
        builder.append("</body>");
        builder.append("</html>");
        return builder.toString();
    }
} 