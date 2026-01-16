package com.example.demo.controller;

import com.example.demo.dto.OrderReviewDTO;
import com.example.demo.service.OrderReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
@RestController
@RequestMapping("/api/order-reviews")
public class OrderReviewController {

    @Autowired
    private OrderReviewService orderReviewService;

    @PostMapping("/add")
    public ResponseEntity<?> addReview(@RequestBody OrderReviewDTO.Request request) {
        try {
            return ResponseEntity.ok(orderReviewService.addOrderReview(request));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<List<OrderReviewDTO.Response>> getAllReviews() {
    List<OrderReviewDTO.Response> list = orderReviewService.getAllReviews();
    return ResponseEntity.ok(list);
}
}