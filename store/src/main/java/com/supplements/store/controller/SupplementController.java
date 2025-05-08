package com.supplements.store.controller;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.supplements.store.model.Supplement;
import com.supplements.store.repository.SupplementRepository;  // Added to handle returning all supplements

@RestController
@RequestMapping("/api/supplements")
@CrossOrigin(origins = "http://localhost:4200") // Allow requests from Angular frontend
public class SupplementController {

    private final SupplementRepository repository;

    public SupplementController(SupplementRepository repository) {
        this.repository = repository;
    }

    // GET endpoint with optional filters for category, goals, and brand, plus pagination
    @GetMapping
    public Page<Supplement> getSupplements(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String goals,
            @RequestParam(required = false) String brand) {

        PageRequest pageRequest = PageRequest.of(page, size);

        if (category != null && goals != null) {
            return repository.findByCategoryContainingAndGoalsContaining(category, goals, pageRequest);
        } else if (category != null && brand != null) {
            return repository.findByCategoryContainingAndBrandContaining(category, brand, pageRequest);
        } else if (goals != null) {
            return repository.findByGoalsContaining(goals, pageRequest);
        } else if (brand != null) {
            return repository.findByBrandContaining(brand, pageRequest);
        } else if (category != null) {
            return repository.findByCategoryContaining(category, pageRequest);
        } else {
            return repository.findAll(pageRequest);
        }
    }


    // New GET endpoint to fetch all supplements without pagination
    @GetMapping("/all")
    public List<Supplement> getAllSupplements() {
        return repository.findAll();  // Returns all supplements without pagination
    }

    // POST endpoint to add a new supplement
    @PostMapping
    public Supplement create(@RequestBody Supplement supplement) {
        return repository.save(supplement);
    }
}
