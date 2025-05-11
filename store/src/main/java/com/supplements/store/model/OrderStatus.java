package com.supplements.store.model;

public enum OrderStatus {
    PENDING,        // Order received, awaiting processing
    PROCESSING,     // Order is being prepared
    AWAITING_PAYMENT, // Order is awaiting payment confirmation
    PAID,           // Payment confirmed
    SHIPPED,        // Order has been shipped
    DELIVERED,      // Order has been delivered
    CANCELLED,      // Order has been cancelled
    REFUNDED        // Order has been refunded
}