package com.supplements.store.service;

import com.supplements.store.DTO.OrderRequest;
import com.supplements.store.model.Customer;
import com.supplements.store.model.Order;
import com.supplements.store.model.OrderStatus;
import com.supplements.store.repository.OrderRepository;

import jakarta.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final CustomerService customerService; // Use CustomerService for customer logic

    @Autowired
    public OrderService(OrderRepository orderRepository, CustomerService customerService) {
        this.orderRepository = orderRepository;
        this.customerService = customerService;
    }

    @Transactional
    public Order createOrder(OrderRequest orderRequest, Customer customer) {
        Order order = new Order();
        order.setOrderCode(generateOrderCode()); // Implement a robust order code generation
        order.setOrderSL(orderRequest.getOrderSL()); // Or generate it if not client-provided
        order.setStatus(OrderStatus.PENDING); // Initial status
        order.setOrderDate(LocalDateTime.now());
        order.setSupplementIds(orderRequest.getSupplementIds());

        // Establish the bidirectional link
        order.setCustomer(customer); // Link order to customer
        // customer.addOrder(order); // This line is good practice but handled by JPA cascade if customer is saved/updated.
                                 // Customer will be saved by customerService.

        return orderRepository.save(order);
    }

    // Method to handle the combined logic as per your frontend's second call
    @Transactional
    public Order placeOrder(OrderRequest orderRequest) {
        // 1. Find or Create Customer
        Customer customer = customerService.createOrUpdateCustomer(orderRequest.getCustomerRequest());

        // 2. Create the Order
        Order order = new Order();
        order.setOrderCode(generateOrderCode());
        order.setOrderSL(orderRequest.getOrderSL()); // If provided, otherwise generate or set null
        order.setStatus(OrderStatus.AWAITING_PAYMENT); // Or PENDING based on your flow
        order.setOrderDate(LocalDateTime.now());
        order.setSupplementIds(orderRequest.getSupplementIds());
        order.setCustomer(customer); // Link to the customer

        // The customer.addOrder(order) is implicitly handled by JPA saving the order
        // which has a reference to a managed (or newly persisted) customer,
        // and the cascade settings on Customer.orders.
        return orderRepository.save(order);
    }


    private String generateOrderCode() {
        // Example: ORD-YYYYMMDD-HHMMSS-RANDOM
        // return "ORD-" + LocalDateTime.now().format(java.time.format.DateTimeFormatter.ofPattern("yyyyMMddHHmmss")) + "-" + UUID.randomUUID().toString().substring(0, 4).toUpperCase();
        return "ORD-" + UUID.randomUUID().toString().toUpperCase();
    }

    public Optional<Order> findByOrderCode(String orderCode) {
        return orderRepository.findByOrderCode(orderCode);
    }

    public Optional<Order> findById(Long id) {
        return orderRepository.findById(id);
    }
}