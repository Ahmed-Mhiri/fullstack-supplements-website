package com.supplements.store.model;

import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "orders") // JPA uses "order" by default, which can be a SQL keyword.
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String orderCode; // e.g., a generated unique identifier

    private String orderSL; // "Order Serial Line"? Clarify if this has specific meaning or generation logic

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private OrderStatus status;

    @Column(nullable = false, updatable = false) // Typically set on creation
    private LocalDateTime orderDate;

    // Bidirectional Many-to-One: Many Orders belong to one Customer
    @ManyToOne(fetch = FetchType.LAZY) // LAZY is generally preferred for performance
    @JoinColumn(name = "customer_id", nullable = false) // Foreign key in the orders table
    @JsonIgnore
    private Customer customer;

    @ElementCollection(fetch = FetchType.LAZY)
    @CollectionTable(name = "order_supplement_ids", joinColumns = @JoinColumn(name = "order_id"))
    private List<OrderSupplement> supplements = new ArrayList<>();

    // Getters and setters for all fields
    public List<OrderSupplement> getSupplements() {
        return supplements;
    }

    public void setSupplements(List<OrderSupplement> supplements) {
        this.supplements = supplements;
    }

    // Constructors
    public Order() {
        this.orderDate = LocalDateTime.now(); // Default order date to now
        this.status = OrderStatus.PENDING;    // Default status
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getOrderCode() {
        return orderCode;
    }

    public void setOrderCode(String orderCode) {
        this.orderCode = orderCode;
    }

    public String getOrderSL() {
        return orderSL;
    }

    public void setOrderSL(String orderSL) {
        this.orderSL = orderSL;
    }

    public OrderStatus getStatus() {
        return status;
    }

    public void setStatus(OrderStatus status) {
        this.status = status;
    }

    public LocalDateTime getOrderDate() {
        return orderDate;
    }

    public void setOrderDate(LocalDateTime orderDate) {
        this.orderDate = orderDate;
    }

    public Customer getCustomer() {
        return customer;
    }

    public void setCustomer(Customer customer) {
        this.customer = customer;
    }


    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Order order = (Order) o;
        return Objects.equals(id, order.id) && Objects.equals(orderCode, order.orderCode);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, orderCode);
    }

    @Override
    public String toString() {
        return "Order{" +
               "id=" + id +
               ", orderCode='" + orderCode + '\'' +
               ", status=" + status +
               ", orderDate=" + orderDate +
               ", customerId=" + (customer != null ? customer.getId() : "null") +
               '}';
    }
}