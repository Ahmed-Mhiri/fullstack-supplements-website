package com.supplements.store.DTO;
import java.time.LocalDateTime;

import com.supplements.store.model.Customer;
import com.supplements.store.model.Order;
import com.supplements.store.model.OrderStatus;

import java.util.List;
import java.util.stream.Collectors;

public class CustomerDetailsDTO {
    public String firstName;
    public String lastName;
    public String email;
    public List<OrderSummaryDTO> orders;

    public CustomerDetailsDTO(Customer customer) {
        this.firstName = customer.getFirstName();
        this.lastName = customer.getLastName();
        this.email = customer.getEmail();
        this.orders = customer.getOrders().stream()
                .map(OrderSummaryDTO::new)
                .collect(Collectors.toList());
    }

    public static class OrderSummaryDTO {
        public String orderCode;
        public OrderStatus status;
        public LocalDateTime orderDate;
        public List<SupplementDTO> supplements;

        public OrderSummaryDTO(Order order) {
            this.orderCode = order.getOrderCode();
            this.status = order.getStatus();
            this.orderDate = order.getOrderDate(); // Added here
            this.supplements = order.getSupplements().stream()
                    .map(supp -> new SupplementDTO(supp.getSupplementId(), supp.getQuantity()))
                    .collect(Collectors.toList());
        }
    }

    public static class SupplementDTO {
        public Long supplementId;
        public int quantity;

        public SupplementDTO(Long supplementId, int quantity) {
            this.supplementId = supplementId;
            this.quantity = quantity;
        }
    }
}


