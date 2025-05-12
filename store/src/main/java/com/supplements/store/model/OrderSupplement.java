package com.supplements.store.model;

import java.util.Objects;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;

@Embeddable
public class OrderSupplement {

    @Column(name = "supplement_id", nullable = false)
    private Long supplementId;

    @Column(name = "quantity", nullable = false)
    private Integer quantity;

    public OrderSupplement() {}

    public OrderSupplement(Long supplementId, Integer quantity) {
        this.supplementId = supplementId;
        this.quantity = quantity;
    }

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

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof OrderSupplement)) return false;
        OrderSupplement that = (OrderSupplement) o;
        return Objects.equals(supplementId, that.supplementId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(supplementId);
    }
}
