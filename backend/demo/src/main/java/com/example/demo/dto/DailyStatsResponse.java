package com.example.demo.dto;

import java.math.BigDecimal;
import java.util.List;

public class DailyStatsResponse {
    private long orderCount;
    private BigDecimal totalRevenue;
    private List<String> bestSellingProducts;

    public DailyStatsResponse(long orderCount, BigDecimal totalRevenue, List<String> bestSellingProducts) {
        this.orderCount = orderCount;
        this.totalRevenue = totalRevenue;
        this.bestSellingProducts = bestSellingProducts;
    }

    public long getOrderCount() { return orderCount; }
    public BigDecimal getTotalRevenue() { return totalRevenue; }
    public List<String> getBestSellingProducts() { return bestSellingProducts; }
}
