package com.supplements.store.service;

import com.supplements.store.DTO.CustomerRequest;
import com.supplements.store.model.Customer;
import com.supplements.store.repository.CustomerRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

import jakarta.transaction.Transactional;

@Service
public class CustomerService {

    private final CustomerRepository customerRepository;

    @Autowired
    public CustomerService(CustomerRepository customerRepository) {
        this.customerRepository = customerRepository;
    }

    @Transactional
    public Customer createOrUpdateCustomer(CustomerRequest request) {
        Optional<Customer> existingCustomerOpt = customerRepository.findByEmail(request.getEmail());

        Customer customer;
        if (existingCustomerOpt.isPresent()) {
            customer = existingCustomerOpt.get();
            // Update fields from request
            customer.setFirstName(request.getFirstName());
            customer.setLastName(request.getLastName());
            customer.setCompany(request.getCompany());
            // Email is key, usually not updated this way, or requires special handling
            customer.setCountry(request.getCountry());
            customer.setPhoneNumber(request.getPhoneNumber());
            customer.setStreetAddress(request.getStreetAddress());
            customer.setZip(request.getZip());
            customer.setCity(request.getCity());
        } else {
            customer = new Customer();
            customer.setFirstName(request.getFirstName());
            customer.setLastName(request.getLastName());
            customer.setCompany(request.getCompany());
            customer.setEmail(request.getEmail());
            customer.setCountry(request.getCountry());
            customer.setPhoneNumber(request.getPhoneNumber());
            customer.setStreetAddress(request.getStreetAddress());
            customer.setZip(request.getZip());
            customer.setCity(request.getCity());
        }
        return customerRepository.save(customer);
    }

    public Optional<Customer> findByEmail(String email) {
        return customerRepository.findByEmail(email);
    }

    public Optional<Customer> findById(Long id) {
        return customerRepository.findById(id);
    }
}