package com.supplements.store.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Map;
import java.util.Random;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class AuthService {

    @Autowired
    private EmailService emailService;

    private static final int CODE_EXPIRY_MINUTES = 15;

    private record CodeData(String code, Instant expiresAt) {}

    private final Map<String, CodeData> emailCodeMap = new ConcurrentHashMap<>();

    public void generateAndSendCode(String email) {
    String code = String.format("%06d", new Random().nextInt(999999));
    Instant expiry = Instant.now().plusSeconds(CODE_EXPIRY_MINUTES * 60);
    emailCodeMap.put(email, new CodeData(code, expiry));

    String subject = "Your Login Code";

    String htmlContent = """
        <html>
            <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
                <div style="max-width: 600px; margin: auto; background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                    <h2 style="color: #2a7ae2;">Your Login Code</h2>
                    <p>Hello,</p>
                    <p>Here is your 6-digit verification code:</p>
                    <div style="font-size: 24px; font-weight: bold; background-color: #eef2ff; padding: 10px; border-radius: 5px; display: inline-block;">
                        %s
                    </div>
                    <p style="margin-top: 20px;">This code will expire in 15 minutes.</p>
                    <p style="color: #888;">If you did not request this code, you can safely ignore this email.</p>
                </div>
            </body>
        </html>
        """.formatted(code);

    emailService.sendHtmlEmail(email, subject, htmlContent);
}

    public boolean verifyCode(String email, String inputCode) {
        CodeData codeData = emailCodeMap.get(email);
        if (codeData == null) return false;
        if (Instant.now().isAfter(codeData.expiresAt())) return false;
        return codeData.code().equals(inputCode);
    }
}