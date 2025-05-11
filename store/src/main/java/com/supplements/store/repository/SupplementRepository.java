package com.supplements.store.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.supplements.store.model.Supplement;

import java.util.List;


public interface SupplementRepository extends JpaRepository<Supplement, Long> {

    // Grouped categories
    Page<Supplement> findByCategoryIn(List<String> categories, Pageable pageable);

    // Search by name
    Page<Supplement> findByNameContainingIgnoreCase(String name, Pageable pageable);

    // Case-insensitive filtering by single field
    @Query("SELECT s FROM Supplement s WHERE LOWER(s.category) LIKE LOWER(CONCAT('%', :category, '%'))")
    Page<Supplement> findByCategoryContainingIgnoreCase(@Param("category") String category, Pageable pageable);

    @Query("SELECT s FROM Supplement s WHERE LOWER(s.brand) LIKE LOWER(CONCAT('%', :brand, '%'))")
    Page<Supplement> findByBrandContainingIgnoreCase(@Param("brand") String brand, Pageable pageable);

    @Query("SELECT s FROM Supplement s WHERE LOWER(s.goals) LIKE LOWER(CONCAT('%', :goals, '%'))")
    Page<Supplement> findByGoalsContainingIgnoreCase(@Param("goals") String goals, Pageable pageable);

    // category + brand
    @Query("SELECT s FROM Supplement s WHERE " +
            "LOWER(s.category) LIKE LOWER(CONCAT('%', :category, '%')) AND " +
            "LOWER(s.brand) LIKE LOWER(CONCAT('%', :brand, '%'))")
    Page<Supplement> findByCategoryAndBrandIgnoreCase(@Param("category") String category,
                                                      @Param("brand") String brand,
                                                      Pageable pageable);

    // category + goals
    @Query("SELECT s FROM Supplement s WHERE " +
            "LOWER(s.category) LIKE LOWER(CONCAT('%', :category, '%')) AND " +
            "LOWER(s.goals) LIKE LOWER(CONCAT('%', :goals, '%'))")
    Page<Supplement> findByCategoryAndGoal(@Param("category") String category,
                                           @Param("goals") String goals,
                                           Pageable pageable);

    // category + brand + goals
    @Query("SELECT s FROM Supplement s WHERE " +
            "LOWER(s.category) LIKE LOWER(CONCAT('%', :category, '%')) AND " +
            "LOWER(s.brand) LIKE LOWER(CONCAT('%', :brand, '%')) AND " +
            "LOWER(s.goals) LIKE LOWER(CONCAT('%', :goals, '%'))")
    Page<Supplement> findByCategoryAndBrandAndGoal(@Param("category") String category,
                                                   @Param("brand") String brand,
                                                   @Param("goals") String goals,
                                                   Pageable pageable);
}