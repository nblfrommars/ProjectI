package com.example.demo.service;

import com.example.demo.dto.DailyStatsResponse;
import com.example.demo.dto.ProductSalesDTO;
import com.example.demo.model.Order;
import com.example.demo.model.OrderItem;
import com.example.demo.model.Product;
import com.example.demo.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.sql.Timestamp;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class StatisticsService {
    @Autowired 
    private OrderRepository orderRepository;
    
    public DailyStatsResponse getDailyStats() {
        LocalDateTime startOfDay = LocalDateTime.now().with(LocalTime.MIN);
        LocalDateTime endOfDay = LocalDateTime.now().with(LocalTime.MAX);

        List<Order> dailyOrders = orderRepository.findByCreatedAtBetween(
                Timestamp.valueOf(startOfDay), 
                Timestamp.valueOf(endOfDay)
        );

        BigDecimal totalRevenue = dailyOrders.stream()
                .filter(o -> !"cancelled".equalsIgnoreCase(o.getStatus()))
                .map(Order::getTotalPrice)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        long orderCount = dailyOrders.size();
        Map<String, Integer> productQtyMap = new HashMap<>();

        for (Order order : dailyOrders) {
            if ("cancelled".equalsIgnoreCase(order.getStatus())) continue;
            
            for (OrderItem item : order.getOrderItems()) {
                String name = item.getProductVariant().getProduct().getProductName();
                productQtyMap.put(name, productQtyMap.getOrDefault(name, 0) + item.getQuantity());
            }
        }

        int maxQty = productQtyMap.values().stream().max(Integer::compare).orElse(0);
        List<String> bestSellers = new ArrayList<>();
        if (maxQty > 0) {
            for (Map.Entry<String, Integer> entry : productQtyMap.entrySet()) {
                if (entry.getValue() == maxQty) {
                    bestSellers.add(entry.getKey());
                }
            }
        }
        return new DailyStatsResponse(orderCount, totalRevenue, bestSellers);
    }

    public DailyStatsResponse getStatsByRange(LocalDate startDate, LocalDate endDate) {
        Timestamp start = Timestamp.valueOf(startDate.atStartOfDay());
        Timestamp end = Timestamp.valueOf(endDate.atTime(LocalTime.MAX));

        List<Order> orders = orderRepository.findByCreatedAtBetween(start, end);

        BigDecimal totalRevenue = orders.stream()
                .filter(o -> !"cancelled".equalsIgnoreCase(o.getStatus()))
                .map(Order::getTotalPrice)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        long orderCount = orders.size();
        
        Map<String, Integer> productQtyMap = new HashMap<>();
        for (Order order : orders) {
            if ("cancelled".equalsIgnoreCase(order.getStatus())) continue;
            for (OrderItem item : order.getOrderItems()) {
                String name = item.getProductVariant().getProduct().getProductName();
                productQtyMap.put(name, productQtyMap.getOrDefault(name, 0) + item.getQuantity());
            }
        }

        int maxQty = productQtyMap.values().stream().max(Integer::compare).orElse(0);
        List<String> bestSellers = productQtyMap.entrySet().stream()
                .filter(entry -> entry.getValue() == maxQty && maxQty > 0)
                .map(Map.Entry::getKey)
                .collect(Collectors.toList());

        return new DailyStatsResponse(orderCount, totalRevenue, bestSellers);
    }

    public List<ProductSalesDTO> getProductSalesStats(LocalDate startDate, LocalDate endDate) {
        Timestamp start = Timestamp.valueOf(startDate.atStartOfDay());
        Timestamp end = Timestamp.valueOf(endDate.atTime(LocalTime.MAX));
        List<Order> orders = orderRepository.findByCreatedAtBetween(start, end);

        Map<String, ProductSalesDTO> reportMap = new HashMap<>();

        for (Order order : orders) {
            if ("cancelled".equalsIgnoreCase(order.getStatus())) continue;

            for (OrderItem item : order.getOrderItems()) {
                Product product = item.getProductVariant().getProduct();
                String name = product.getProductName();
                int qty = item.getQuantity();
                BigDecimal revenue = item.getPrice().multiply(new BigDecimal(qty));

                if (reportMap.containsKey(name)) {
                    ProductSalesDTO existing = reportMap.get(name);
                    reportMap.put(name, new ProductSalesDTO(
                        name,
                        existing.getTotalQuantity() + qty,
                        existing.getTotalRevenue().add(revenue)
                    ));
                } else {
                    reportMap.put(name, new ProductSalesDTO(name, qty, revenue));
                }
            }
        }
        return reportMap.values().stream()
                .sorted(Comparator.comparing(ProductSalesDTO::getTotalRevenue).reversed())
                .collect(Collectors.toList());
    }
}