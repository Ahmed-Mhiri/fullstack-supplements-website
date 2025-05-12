package com.supplements.store.controller;
import com.supplements.store.DTO.OrderRequest;
import com.supplements.store.model.Order;
import com.supplements.store.service.OrderService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/orders")
@CrossOrigin(origins = "http://localhost:4200") // Adjust to your Angular app's URL
public class OrderController {

    private final OrderService orderService;

    @Autowired
    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    // This endpoint matches your second JavaScript call which includes customer data.
    @PostMapping
    public ResponseEntity<?> placeOrder(@RequestBody OrderRequest orderRequest) {
        // Validate orderRequest
        if (orderRequest.getCustomerRequest() == null) {
            return ResponseEntity.badRequest().body("Customer data is required to place an order.");
        }
        // Add more validation for customerRequest fields if needed (e.g., email, name)
        if (orderRequest.getCustomerRequest().getEmail() == null || orderRequest.getCustomerRequest().getEmail().trim().isEmpty()){
             return ResponseEntity.badRequest().body("Customer email is required.");
        }
        // Validate supplements (e.g., not null, not empty, or allow empty if business logic permits)
        if (orderRequest.getSupplements() == null || orderRequest.getSupplements().isEmpty()) {
    return ResponseEntity.badRequest().body("Supplement list (with quantities) is required.");
        }

        try {
            Order createdOrder = orderService.placeOrder(orderRequest); // This service method handles customer and order
            return ResponseEntity.status(HttpStatus.CREATED).body(createdOrder);
        } catch (Exception e) { // Catch more specific exceptions
            // Log error: e.getMessage()
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error placing order: " + e.getMessage());
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Order> getOrderById(@PathVariable Long id) {
        return orderService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/code/{orderCode}")
    public ResponseEntity<Order> getOrderByOrderCode(@PathVariable String orderCode) {
        return orderService.findByOrderCode(orderCode)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}