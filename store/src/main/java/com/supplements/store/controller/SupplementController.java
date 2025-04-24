package com.supplements.store.controller;

import com.supplements.store.model.Supplement;
import com.supplements.store.repository.SupplementRepository;
import org.springframework.web.bind.annotation.*;


import java.util.List;


@RestController
@RequestMapping("/api/supplements")
@CrossOrigin(origins = "http://localhost:4200") // Allow only requests from Angular
public class SupplementController {

    private final SupplementRepository repository;

    public SupplementController(SupplementRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<Supplement> getAll() {
        return repository.findAll();
    }

    @PostMapping
    public Supplement create(@RequestBody Supplement supplement) {
        return repository.save(supplement);
    }
}
