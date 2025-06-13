package com.supplements.store.controller;

import java.util.Arrays;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.supplements.store.model.Supplement;
import com.supplements.store.repository.SupplementRepository;  // Added to handle returning all supplements

@RestController
@RequestMapping("/api/supplements")
@CrossOrigin(origins = {
    "http://localhost:4200",
    "https://ahmed-mhiri.github.io"
})
public class SupplementController {

    private final SupplementRepository repository;

    public SupplementController(SupplementRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public Page<Supplement> getSupplements(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String goals,
            @RequestParam(required = false) String brand) {

        PageRequest pageRequest = PageRequest.of(page, size);

        // Handle grouped categories
        if ("Sports Nutrition".equalsIgnoreCase(category)) {
            List<String> categories = Arrays.asList("Protein", "Amino Acids", "Boosters", "Carbohydrates", "Creatine",
                    "Fitness Food", "Fitness Packages", "Minerals", "Vitamins", "Weight Gainers", "Other");
            return repository.findByCategoryIn(categories, pageRequest);
        }

        if ("Dietary Supplement".equalsIgnoreCase(category)) {
            List<String> categories = Arrays.asList("Vitamins", "Minerals", "Fitness Packages", "Other");
            return repository.findByCategoryIn(categories, pageRequest);
        }

        // Filter logic combinations
        if (category != null && brand != null && goals != null) {
            return repository.findByCategoryAndBrandAndGoal(category, brand, goals, pageRequest);
        } else if (category != null && goals != null) {
            return repository.findByCategoryAndGoal(category, goals, pageRequest);
        } else if (goals != null) {
            return repository.findByGoalsContainingIgnoreCase(goals, pageRequest);
        } else if (category != null && brand != null) {
            return repository.findByCategoryAndBrandIgnoreCase(category, brand, pageRequest);

// If only category is provided
        } else if (category != null) {
            return repository.findByCategoryContainingIgnoreCase(category, pageRequest);

// If only brand is provided
        } else if (brand != null) {
            return repository.findByBrandContainingIgnoreCase(brand, pageRequest);
        }

        // Default: return all
        return repository.findAll(pageRequest);
    }

    @GetMapping("/search")
    public Page<Supplement> searchSupplements(
            @RequestParam String query,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {

        PageRequest pageRequest = PageRequest.of(page, size);
        return repository.findByNameContainingIgnoreCase(query, pageRequest);
    }

    @GetMapping("/all")
    public List<Supplement> getAllSupplements() {
        return repository.findAll();
    }

    @GetMapping("/{id}")
    public Supplement getSupplementById(@PathVariable Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Supplement not found with id: " + id));
    }

    @PostMapping
    public Supplement create(@RequestBody Supplement supplement) {
        return repository.save(supplement);
    }
}

