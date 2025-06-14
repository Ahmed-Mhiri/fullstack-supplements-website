package com.supplements.store.config; // Make sure this package name matches your project

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            // 1. Disable CSRF Protection, as it's not needed for our API
            .csrf(csrf -> csrf.disable())

            // 2. Define Authorization Rules
            .authorizeHttpRequests(auth -> auth
                // 3. This is the crucial instruction for the "security guard"
                .requestMatchers("/api/**").permitAll() // ALLOWS all requests to /api/

                // 4. Any other request that might exist must be authenticated
                .anyRequest().authenticated()
            );

        return http.build();
    }
}