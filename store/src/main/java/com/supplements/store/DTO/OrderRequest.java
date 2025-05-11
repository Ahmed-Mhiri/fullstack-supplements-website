package com.supplements.store.DTO;

import java.util.List;


public class OrderRequest {
    private CustomerRequest customerRequest; // Renamed from customerData to match your TS
    private List<Long> supplementIds;
    private String orderSL; // Optional: if orderSL is provided by client during order creation

    // Getters and Setters
    public CustomerRequest getCustomerRequest() { return customerRequest; }
    public void setCustomerRequest(CustomerRequest customerRequest) { this.customerRequest = customerRequest; }
    public List<Long> getSupplementIds() { return supplementIds; }
    public void setSupplementIds(List<Long> supplementIds) { this.supplementIds = supplementIds; }
    public String getOrderSL() { return orderSL; }
    public void setOrderSL(String orderSL) { this.orderSL = orderSL; }
}