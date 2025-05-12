package com.supplements.store.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.supplements.store.model.Supplement;
import com.supplements.store.repository.SupplementRepository;

@Service
public class SupplementService {

    private final SupplementRepository supplementRepository;

    @Autowired
    public SupplementService(SupplementRepository supplementRepository) {
        this.supplementRepository = supplementRepository;
    }

    // Fetch supplement by its ID
    public Supplement getSupplementById(Long supplementId) {
        return supplementRepository.findById(supplementId)
                .orElseThrow(() -> new RuntimeException("Supplement not found with id: " + supplementId));
    }
}