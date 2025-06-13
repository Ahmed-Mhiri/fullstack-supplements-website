package com.supplements.store.controller;


import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.supplements.store.DTO.CustomerDetailsDTO;
import com.supplements.store.DTO.CustomerRequest;
import com.supplements.store.model.Customer;
import com.supplements.store.service.CustomerService;

@RestController
@RequestMapping("/api/customers")
@CrossOrigin(origins = {
    "http://localhost:4200",
    "https://ahmed-mhiri.github.io"
})
    public class CustomerController {

    private final CustomerService customerService;

    @Autowired
    public CustomerController(CustomerService customerService) {
        this.customerService = customerService;
    }

    // This endpoint matches your first JavaScript call
    @PostMapping
    public ResponseEntity<?> createOrUpdateCustomer(@RequestBody CustomerRequest customerRequest) {
        // Basic validation
        if (customerRequest.getFirstName() == null || customerRequest.getFirstName().trim().isEmpty() ||
            customerRequest.getLastName() == null || customerRequest.getLastName().trim().isEmpty() ||
            customerRequest.getEmail() == null || customerRequest.getEmail().trim().isEmpty() ||
            // Add other required field checks from CustomerRequest
            customerRequest.getStreetAddress() == null || customerRequest.getStreetAddress().trim().isEmpty() ||
            customerRequest.getZip() == null || customerRequest.getZip().trim().isEmpty() ||
            customerRequest.getCity() == null || customerRequest.getCity().trim().isEmpty() ||
            customerRequest.getCountry() == null || customerRequest.getCountry().trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Missing required customer fields.");
        }
        try {
            Customer customer = customerService.createOrUpdateCustomer(customerRequest);
            return ResponseEntity.status(HttpStatus.CREATED).body(customer);
        } catch (Exception e) { // Consider more specific exceptions
            // Log error e.getMessage()
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error saving customer: " + e.getMessage());
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Customer> getCustomerById(@PathVariable Long id) {
        return customerService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/email/{email}")
    public ResponseEntity<Customer> getCustomerByEmail(@PathVariable String email) {
        return customerService.findByEmail(email)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    @GetMapping("/details/{email}")
    public ResponseEntity<?> getCustomerDetailsWithOrders(@PathVariable String email) {
    Optional<Customer> customerOpt = customerService.findByEmail(email);
    if (customerOpt.isEmpty()) {
        return ResponseEntity.notFound().build();
    }

    Customer customer = customerOpt.get();
    // Create a DTO to avoid recursive serialization
    return ResponseEntity.ok(new CustomerDetailsDTO(customer));
}

}