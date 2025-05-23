package com.supplements.store.repository;

import com.supplements.store.model.Customer;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;


public interface CustomerRepository extends JpaRepository<Customer, Long> {
    Optional<Customer> findByEmail(String email); // Find customer by email
    Optional<Customer> findById(Long id);
}