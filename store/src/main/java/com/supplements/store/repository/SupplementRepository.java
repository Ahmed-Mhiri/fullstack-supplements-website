package com.supplements.store.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.supplements.store.model.Supplement;

public interface SupplementRepository extends JpaRepository<Supplement, Long> {
    Page<Supplement> findByCategoryContaining(String category, Pageable pageable);
    Page<Supplement> findByBrandContaining(String brand, Pageable pageable);
    Page<Supplement> findByGoalsContaining(String goals, Pageable pageable);
    Page<Supplement> findByCategoryContainingAndBrandContaining(String category, String brand, Pageable pageable);
    Page<Supplement> findByCategoryContainingAndGoalsContaining(String category, String goals, Pageable pageable);
    Page<Supplement> findByCategoryContainingAndGoalsContainingAndBrandContaining(String category, String goals, String brand, Pageable pageable);
}
