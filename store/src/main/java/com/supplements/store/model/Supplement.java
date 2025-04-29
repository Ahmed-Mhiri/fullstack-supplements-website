package com.supplements.store.model;

import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import jakarta.persistence.*;
import java.math.BigDecimal;


@Entity
@JsonPropertyOrder({
        "id", "name", "priceEuro", "imageUrl", "productUrl", "flavor", "weightVolume",
        "brand", "category", "goals"
})
public class Supplement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    // Store price as BigDecimal for precision
    private BigDecimal priceEuro;

    private String imageUrl;
    private String productUrl;
    private String flavor;
    private String weightVolume;
    private String brand;
    private String category;
    private String goals;

    // Default constructor
    public Supplement() {}

    // Constructor with parameters
    public Supplement(String name, BigDecimal priceEuro, String imageUrl, String productUrl, String flavor,
                      String weightVolume, String brand, String category, String goals) {
        this.name = name;
        this.priceEuro = priceEuro;
        this.imageUrl = imageUrl;
        this.productUrl = productUrl;
        this.flavor = flavor;
        this.weightVolume = weightVolume;
        this.brand = brand;
        this.category = category;
        this.goals = goals;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public BigDecimal getPriceEuro() {
        return priceEuro;
    }

    public void setPriceEuro(BigDecimal priceEuro) {
        this.priceEuro = priceEuro;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public String getProductUrl() {
        return productUrl;
    }

    public void setProductUrl(String productUrl) {
        this.productUrl = productUrl;
    }

    public String getFlavor() {
        return flavor;
    }

    public void setFlavor(String flavor) {
        this.flavor = flavor;
    }

    public String getWeightVolume() {
        return weightVolume;
    }

    public void setWeightVolume(String weightVolume) {
        this.weightVolume = weightVolume;
    }

    public String getBrand() {
        return brand;
    }

    public void setBrand(String brand) {
        this.brand = brand;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getGoals() {
        return goals;
    }

    public void setGoals(String goals) {
        this.goals = goals;
    }
}
