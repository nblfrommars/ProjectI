package com.example.demo.dto;

import java.math.BigDecimal;

public class ProductSalesDTO {
    private String productName;
    private int totalQuantity;
    private BigDecimal totalRevenue;

    public ProductSalesDTO(String productName, int totalQuantity, BigDecimal totalRevenue) {
        this.productName = productName;
        this.totalQuantity = totalQuantity;
        this.totalRevenue = totalRevenue;
    }

    public String getProductName() { return productName; }
    public int getTotalQuantity() { return totalQuantity; }
    public BigDecimal getTotalRevenue() { return totalRevenue; }
}