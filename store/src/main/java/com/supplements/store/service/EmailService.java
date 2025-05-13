package com.supplements.store.service;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    // Optionally, you can inject the "from" email address from the properties file.
    @Value("${spring.mail.from}")
    private String fromEmail;

    public void sendHtmlEmail(String to, String subject, String htmlContent) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            // Dynamically use the customer email as the recipient.
            helper.setFrom(fromEmail); // Or specify a fixed email
            helper.setTo(to);  // Customer email address dynamically passed
            helper.setSubject(subject);
            helper.setText(htmlContent, true);  // true indicates HTML content

            mailSender.send(message);
        } catch (MessagingException e) {
            throw new RuntimeException("Failed to send email", e);
        }
    }
}
