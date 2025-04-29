package com.supplements.store.controller;

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
import com.supplements.store.repository.SupplementRepository;

@RestController
@RequestMapping("/api/supplements")
@CrossOrigin(origins = "http://localhost:4200") // Allow only requests from Angular
public class SupplementController {

    private final SupplementRepository repository;

    public SupplementController(SupplementRepository repository) {
        this.repository = repository;
    }

    // Method to get supplements with pagination
    @GetMapping
    public Page<Supplement> getSupplements(
            @RequestParam(defaultValue = "0") int page, 
            @RequestParam(defaultValue = "20") int size) {
        return repository.findAll(PageRequest.of(page, size)); // Paginated request
    }

    // Method to create a supplement
    @PostMapping
    public Supplement create(@RequestBody Supplement supplement) {
        return repository.save(supplement);
    }
}
