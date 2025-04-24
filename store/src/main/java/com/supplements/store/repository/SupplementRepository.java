package com.supplements.store.repository;

import com.supplements.store.model.Supplement;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SupplementRepository extends JpaRepository<Supplement, Long> {
}
