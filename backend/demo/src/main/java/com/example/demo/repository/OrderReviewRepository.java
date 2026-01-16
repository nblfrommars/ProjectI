package com.example.demo.repository;

import com.example.demo.model.OrderReview;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderReviewRepository extends JpaRepository<OrderReview, Integer> {
    boolean existsByOrder_OrderId(Integer orderId);
}