package com.example.demo.dto;

import java.math.BigDecimal;
import java.sql.Timestamp;
import java.util.List;

public class OrderDTO {

    public static class Request {
        private Integer userId;
        private String phoneNumber;
        private String address;
        private List<OrderItemRequest> items;
        private String paymentMethod;

        public Request() {}

        public Integer getUserId() { return userId; }
        public void setUserId(Integer userId) { this.userId = userId; }
        public String getPhoneNumber() { return phoneNumber; }
        public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }
        public String getAddress() { return address; }
        public void setAddress(String address) { this.address = address; }
        public List<OrderItemRequest> getItems() { return items; }
        public void setItems(List<OrderItemRequest> items) { this.items = items; }
        public String getPaymentMethod() { return paymentMethod; }
        public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }
    }

    public static class OrderItemRequest {
        private Integer variantId;
        private Integer quantity;

        public OrderItemRequest() {}

        public Integer getVariantId() { return variantId; }
        public void setVariantId(Integer variantId) { this.variantId = variantId; }

        public Integer getQuantity() { return quantity; }
        public void setQuantity(Integer quantity) { this.quantity = quantity; }
    }

    public static class Response {
        private Integer orderId;
        private Integer userId;
        private BigDecimal totalPrice;
        private String email;  
        private String status;
        private Timestamp createdAt;
        private String phoneNumber;
        private String address;
        private String paymentMethod; 
        private List<OrderItemResponse> orderItems;

        public Response() {}

        public Integer getOrderId() { return orderId; }
        public void setOrderId(Integer orderId) { this.orderId = orderId; }
        public BigDecimal getTotalPrice() { return totalPrice; }
        public void setTotalPrice(BigDecimal totalPrice) { this.totalPrice = totalPrice; }
        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }
        public Timestamp getCreatedAt() { return createdAt; }
        public void setCreatedAt(Timestamp createdAt) { this.createdAt = createdAt; }
        public String getPhoneNumber() { return phoneNumber; }
        public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }
        public String getAddress() { return address; }
        public void setAddress(String address) { this.address = address; }
        public List<OrderItemResponse> getOrderItems() { return orderItems; }
        public void setOrderItems(List<OrderItemResponse> orderItems) { this.orderItems = orderItems; }
        public String getPaymentMethod() { return paymentMethod; }
        public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }
        public Integer getUserId() {return userId;}
        public void setUserId(Integer userId) {this.userId = userId;}
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
    }

    public static class OrderItemResponse {
        private String productName;
        private String imageUrl;
        private Integer quantity;
        private BigDecimal price;
        private String size;
        private BigDecimal subTotal;

        public OrderItemResponse() {}

        public String getProductName() { return productName; }
        public void setProductName(String productName) { this.productName = productName; }
        public String getImageUrl() { return imageUrl; }
        public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
        public Integer getQuantity() { return quantity; }
        public void setQuantity(Integer quantity) { this.quantity = quantity; }
        public BigDecimal getPrice() { return price; }
        public void setPrice(BigDecimal price) { this.price = price; }
        public String getSize() { return size; }
        public void setSize(String size) { this.size = size; }
        public BigDecimal getSubTotal() { return subTotal; }
        public void setSubTotal(BigDecimal subTotal) { this.subTotal = subTotal; }
    }
}