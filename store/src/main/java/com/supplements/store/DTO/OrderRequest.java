package com.supplements.store.DTO;

import java.util.List;

public class OrderRequest {
    private CustomerRequest customerRequest;
    private List<OrderSupplementDTO> supplements; 
    private String orderSL;

    public CustomerRequest getCustomerRequest() {
        return customerRequest;
    }

    public void setCustomerRequest(CustomerRequest customerRequest) {
        this.customerRequest = customerRequest;
    }

    public List<OrderSupplementDTO> getSupplements() {
        return supplements;
    }

    public void setSupplements(List<OrderSupplementDTO> supplements) {
        this.supplements = supplements;
    }

    public String getOrderSL() {
        return orderSL;
    }

    public void setOrderSL(String orderSL) {
        this.orderSL = orderSL;
    }
}
