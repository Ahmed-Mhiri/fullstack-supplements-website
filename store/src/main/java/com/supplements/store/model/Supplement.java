package com.supplements.store.model;

import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import jakarta.persistence.*;

@Entity
@JsonPropertyOrder({"id", "name", "description", "category", "goal", "price","discount", "discountPercentage", "priceAfterDiscount"})
public class Supplement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String description;
    private Double price;
    private Double priceAfterDiscount;
    private String category;
    private String goal;
    private String discount;

    private Integer discountPercentage;

    public Supplement() {}

    public Supplement(String name, String description, Double price, String discount, String category, String goal) {
        this.name = name;
        this.description = description;
        this.price = price;
        this.discount = discount;
        this.category = category;
        this.goal = goal;
        calculateDiscountedPrice();
    }

    // Auto-run after loading from database
    @PostLoad
    public void onLoad() {
        calculateDiscountedPrice();
    }

    private void calculateDiscountedPrice() {
        if (price == null || discount == null || discount.equalsIgnoreCase("No")) {
            this.priceAfterDiscount = price;
            this.discountPercentage = 0;
            return;
        }

        try {
            String[] parts = discount.split("-");
            if (parts.length == 2) {
                String percentageStr = parts[1].trim().replace("%", "");
                double percentage = Double.parseDouble(percentageStr);
                this.discountPercentage = (int) percentage;
                this.priceAfterDiscount = price - (price * (percentage / 100));
            } else {
                this.priceAfterDiscount = price;
                this.discountPercentage = 0;
            }
        } catch (Exception e) {
            this.priceAfterDiscount = price;
            this.discountPercentage = 0;
        }
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Double getPrice() { return price; }
    public void setPrice(Double price) {
        this.price = price;
        calculateDiscountedPrice();
    }

    public String getDiscount() { return discount; }
    public void setDiscount(String discount) {
        this.discount = discount;
        calculateDiscountedPrice();
    }

    public Double getPriceAfterDiscount() { return priceAfterDiscount; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getGoal() { return goal; }
    public void setGoal(String goal) { this.goal = goal; }

    public Integer getDiscountPercentage() { return discountPercentage; }
    public void setDiscountPercentage(Integer discountPercentage) { this.discountPercentage = discountPercentage; }
}
