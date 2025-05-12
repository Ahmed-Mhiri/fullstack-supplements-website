package com.supplements.store.service;

import com.supplements.store.DTO.CustomerRequest;
import com.supplements.store.model.Customer;
import com.supplements.store.repository.CustomerRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Objects;
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

    if (existingCustomerOpt.isPresent()) {
        Customer customer = existingCustomerOpt.get();

        if (!hasCustomerDataChanged(customer, request)) {
            System.out.println("Customer data unchanged. No update required.");
            return customer;
        }

        System.out.println("Updating customer with new data...");

        customer.setFirstName(request.getFirstName());
        customer.setLastName(request.getLastName());
        customer.setCompany(request.getCompany());
        customer.setCountry(request.getCountry());
        customer.setPhoneNumber(request.getPhoneNumber());
        customer.setStreetAddress(request.getStreetAddress());
        customer.setZip(request.getZip());
        customer.setCity(request.getCity());

        return customerRepository.save(customer);
    } else {
        System.out.println("Creating new customer.");
        Customer customer = new Customer();
        customer.setFirstName(request.getFirstName());
        customer.setLastName(request.getLastName());
        customer.setCompany(request.getCompany());
        customer.setEmail(request.getEmail());
        customer.setCountry(request.getCountry());
        customer.setPhoneNumber(request.getPhoneNumber());
        customer.setStreetAddress(request.getStreetAddress());
        customer.setZip(request.getZip());
        customer.setCity(request.getCity());

        return customerRepository.save(customer);
    }
}

    public Optional<Customer> findByEmail(String email) {
        return customerRepository.findByEmail(email);
    }

    public Optional<Customer> findById(Long id) {
        return customerRepository.findById(id);
    }
    private boolean hasCustomerDataChanged(Customer existing, CustomerRequest request) {
    return !Objects.equals(existing.getFirstName(), request.getFirstName()) ||
           !Objects.equals(existing.getLastName(), request.getLastName()) ||
           !Objects.equals(existing.getCompany(), request.getCompany()) ||
           !Objects.equals(existing.getCountry(), request.getCountry()) ||
           !Objects.equals(existing.getPhoneNumber(), request.getPhoneNumber()) ||
           !Objects.equals(existing.getStreetAddress(), request.getStreetAddress()) ||
           !Objects.equals(existing.getZip(), request.getZip()) ||
           !Objects.equals(existing.getCity(), request.getCity());
}
}