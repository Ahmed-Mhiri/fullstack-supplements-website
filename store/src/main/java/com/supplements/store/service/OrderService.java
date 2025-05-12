package com.supplements.store.service;

import com.supplements.store.DTO.OrderRequest;
import com.supplements.store.DTO.OrderSupplementDTO;
import com.supplements.store.model.Customer;
import com.supplements.store.model.Order;
import com.supplements.store.model.OrderStatus;
import com.supplements.store.model.OrderSupplement;
import com.supplements.store.model.Supplement;
import com.supplements.store.repository.OrderRepository;

import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final CustomerService customerService;
    private final EmailService emailService;
    private final SupplementService supplementService;

    @Autowired
    public OrderService(OrderRepository orderRepository, CustomerService customerService, EmailService emailService, SupplementService supplementService) {
        this.orderRepository = orderRepository;
        this.customerService = customerService;
        this.emailService = emailService;
        this.supplementService = supplementService;
    }

    @Transactional
    public Order createOrder(OrderRequest orderRequest, Customer customer) {
        List<OrderSupplement> supplements = mapToOrderSupplements(orderRequest.getSupplements());

        // Calculate total price of the order
        Order order = new Order();
        order.setOrderCode(generateOrderCode());
        order.setOrderSL(orderRequest.getOrderSL());
        order.setStatus(OrderStatus.PENDING);
        order.setOrderDate(LocalDateTime.now());
        order.setCustomer(customer);
        order.setSupplements(supplements);
        order.setOrderSL(generateOrderSL(supplements, customer.getId()));

        // Optionally, you could save the price in the order object, if needed.
        // order.setTotalPrice(totalPrice);

        return orderRepository.save(order);
    }

    @Transactional
    public Order placeOrder(OrderRequest orderRequest) {
        Customer customer = customerService.createOrUpdateCustomer(orderRequest.getCustomerRequest());
        List<OrderSupplement> supplements = mapToOrderSupplements(orderRequest.getSupplements());

        // Calculate total price of the order
        Order order = new Order();
        order.setOrderCode(generateOrderCode());
        order.setStatus(OrderStatus.AWAITING_PAYMENT);
        order.setOrderDate(LocalDateTime.now());
        order.setCustomer(customer);
        order.setSupplements(supplements);
        order.setOrderSL(generateOrderSL(supplements, customer.getId()));

        Order savedOrder = orderRepository.save(order);
        double totalPrice = calculateTotalPrice(orderRequest.getSupplements());
        // Build and send the email
        String htmlEmail = buildOrderHtmlEmail(savedOrder, totalPrice);
        emailService.sendHtmlEmail(customer.getEmail(), "Your Supplement Order Confirmation", htmlEmail);


        return savedOrder;
    }

    private List<OrderSupplement> mapToOrderSupplements(List<OrderSupplementDTO> supplementDTOs) {
        return supplementDTOs.stream()
                .map(dto -> new OrderSupplement(dto.getSupplementId(), dto.getQuantity()))
                .toList();
    }

    private String generateOrderCode() {
        return "ORD-" + UUID.randomUUID().toString().toUpperCase();
    }

    public Optional<Order> findByOrderCode(String orderCode) {
        return orderRepository.findByOrderCode(orderCode);
    }

    public Optional<Order> findById(Long id) {
        return orderRepository.findById(id);
    }

    private String generateOrderSL(List<OrderSupplement> supplements, Long customerId) {
        StringBuilder raw = new StringBuilder();

        supplements.stream()
                .sorted((a, b) -> a.getSupplementId().compareTo(b.getSupplementId()))
                .forEach(supp -> raw.append(supp.getSupplementId())
                        .append(":")
                        .append(supp.getQuantity())
                        .append("-"));

        raw.append("C").append(customerId);
        raw.append("-").append(LocalDateTime.now().toString()); // Add timestamp for uniqueness

        return "SL-" + hash(raw.toString());
    }

    private String hash(String input) {
        try {
            java.security.MessageDigest digest = java.security.MessageDigest.getInstance("SHA-256");
            byte[] hashBytes = digest.digest(input.getBytes(java.nio.charset.StandardCharsets.UTF_8));
            StringBuilder hexString = new StringBuilder();
            for (byte b : hashBytes) {
                hexString.append(String.format("%02x", b));
            }
            return hexString.substring(0, 16); // shorten hash to 16 chars if desired
        } catch (java.security.NoSuchAlgorithmException e) {
            throw new RuntimeException("SHA-256 algorithm not available", e);
        }
    }

    public double calculateTotalPrice(List<OrderSupplementDTO> orderSupplements) {
        double totalPrice = 0.0;

        for (OrderSupplementDTO dto : orderSupplements) {
            Supplement supplement = supplementService.getSupplementById(dto.getSupplementId());
            double price = supplement.getPriceEuro().doubleValue();  // Assuming priceEuro is a BigDecimal
            totalPrice += price * dto.getQuantity();
        }

        return totalPrice;
    }
    private String buildOrderHtmlEmail(Order order, double totalPrice) {
    StringBuilder itemsHtml = new StringBuilder();

    for (OrderSupplement supp : order.getSupplements()) {
        Supplement supplement = supplementService.getSupplementById(supp.getSupplementId());
        int qty = supp.getQuantity();
        double price = supplement.getPriceEuro().doubleValue();
        double subtotal = price * qty;

        itemsHtml.append("<tr>")
                .append("<td style='padding: 10px; display: flex; align-items: center;'>")
                .append("<img src='").append(supplement.getImageUrl()).append("' alt='").append(supplement.getName())
                .append("' style='width: 50px; height: 50px; object-fit: contain; margin-right: 10px; border-radius: 4px; border: 1px solid #ccc;'>")
                .append("<span>").append(supplement.getName()).append("</span>")
                .append("</td>")
                .append("<td style='padding: 10px;'>").append(qty).append("</td>")
                .append("<td style='padding: 10px;'>€").append(String.format("%.2f", price)).append("</td>")
                .append("<td style='padding: 10px;'>€").append(String.format("%.2f", subtotal)).append("</td>")
                .append("</tr>");
    }

    return """
        <html>
        <head>
            <style>
                body {
                    font-family: 'Poppins', sans-serif;
                    background-color: #f5f5f5;
                    margin: 0;
                    padding: 0;
                    color: #333;
                }
                .email-container {
                    max-width: 600px;
                    margin: 20px auto;
                    background-color: #ffffff;
                    padding: 20px;
                    border-radius: 8px;
                    box-shadow: 0 0 10px rgba(0,0,0,0.05);
                }
                h2 {
                    color: #0073e6;
                    font-size: 22px;
                    margin-top: 0;
                }
                table {
                    width: 100%%;
                    border-collapse: collapse;
                    margin-top: 20px;
                }
                th {
                    background-color: #eaf3ff;
                    text-align: left;
                    padding: 10px;
                    font-weight: 600;
                    font-size: 14px;
                }
                td {
                    font-size: 14px;
                    border-top: 1px solid #eee;
                }
                .total {
                    text-align: right;
                    margin-top: 20px;
                    font-size: 16px;
                    font-weight: bold;
                }
                .footer {
                    margin-top: 30px;
                    font-size: 12px;
                    text-align: center;
                    color: #999;
                }
                @media (max-width: 600px) {
                    .email-container {
                        padding: 15px;
                    }
                    table, thead, tbody, th, td, tr {
                        display: block;
                        width: 100%%;
                    }
                    tr {
                        margin-bottom: 15px;
                        border-bottom: 1px solid #eee;
                    }
                    th {
                        display: none;
                    }
                    td {
                        display: flex;
                        justify-content: space-between;
                        padding: 8px 0;
                    }
                    td:first-child {
                        flex-direction: column;
                        align-items: flex-start;
                    }
                }
            </style>
        </head>
        <body>
            <div class="email-container">
                <h2>Thank you for your order, %s!</h2>
                <p><strong>Order Code:</strong> %s<br/>
                   <strong>Order Date:</strong> %s</p>
                
                <table>
                    <thead>
                        <tr>
                            <th>Item</th><th>Qty</th><th>Price</th><th>Subtotal</th>
                        </tr>
                    </thead>
                    <tbody>
                        %s
                    </tbody>
                </table>
                
                <p class="total">Total Price: €%.2f</p>
                <p>We’ll notify you once your order is shipped.</p>
                <div class="footer">
                    &copy; 2025 Supplements Store. All rights reserved.
                </div>
            </div>
        </body>
        </html>
        """.formatted(
            order.getCustomer().getFirstName(),
            order.getOrderCode(),
            order.getOrderDate(),
            itemsHtml.toString(),
            totalPrice
        );
}


}
