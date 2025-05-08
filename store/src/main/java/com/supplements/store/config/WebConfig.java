package com.supplements.store.config;  // Ensure this is within your base package or relevant package

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        // Allow CORS for the frontend running on localhost:4200
        registry.addMapping("/api/**")  // Allow CORS for any endpoint that starts with /api
                .allowedOrigins("http://localhost:4200")  // Allow requests from the Angular app
                .allowedMethods("GET", "POST", "PUT", "DELETE")  // Allow specific methods
                .allowedHeaders("*")  // Allow all headers
                .allowCredentials(true);  // Allow credentials (if needed)
    }
}
