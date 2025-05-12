package com.supplements.store.controller;
import java.util.Map;

import com.supplements.store.DTO.VerificationRequest;
import com.supplements.store.service.AuthService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/send-code")
    public ResponseEntity<Map<String, String>> sendCode(@RequestBody VerificationRequest request) {
        authService.generateAndSendCode(request.getEmail());
        return ResponseEntity.ok(Map.of("message", "Verification code sent to email."));
    }

    @PostMapping("/verify-code")
    public ResponseEntity<Map<String, Boolean>> verifyCode(@RequestBody VerificationRequest request) {
        boolean isValid = authService.verifyCode(request.getEmail(), request.getCode());
        return ResponseEntity.ok(Map.of("valid", isValid));
    }
}
