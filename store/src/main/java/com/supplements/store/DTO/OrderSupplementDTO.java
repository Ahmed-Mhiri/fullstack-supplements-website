package com.supplements.store.DTO;

import com.fasterxml.jackson.annotation.JsonProperty;

public class OrderSupplementDTO {
    @JsonProperty("supplementId")  // Ensure the fields match the JSON keys
    private Long supplementId;

    @JsonProperty("quantity")
    private Integer quantity;

    public Long getSupplementId() {
        return supplementId;
    }

    public void setSupplementId(Long supplementId) {
        this.supplementId = supplementId;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }
}
