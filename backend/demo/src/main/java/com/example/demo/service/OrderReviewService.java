package com.example.demo.service;

import com.example.demo.dto.OrderReviewDTO;
import com.example.demo.model.*;
import com.example.demo.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;
@Service
public class OrderReviewService {

    @Autowired private OrderReviewRepository orderReviewRepository;
    @Autowired private UserRepository userRepository;
    @Autowired private OrderRepository orderRepository;

    @Transactional
    public OrderReviewDTO.Response addOrderReview(OrderReviewDTO.Request request) {
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User không tồn tại"));

        Order order = orderRepository.findById(request.getOrderId())
                .orElseThrow(() -> new RuntimeException("Đơn hàng không tồn tại"));

        if (orderReviewRepository.existsByOrder_OrderId(request.getOrderId())) {
            throw new RuntimeException("Đơn hàng này đã được đánh giá rồi");
        }

        OrderReview review = new OrderReview();
        review.setUser(user);
        review.setOrder(order);
        review.setRating(request.getRating());
        review.setComment(request.getComment());

        OrderReview saved = orderReviewRepository.save(review);
        return convertToResponseDTO(saved);
    }

    public List <OrderReviewDTO.Response> getAllReviews(){
        List<OrderReview> orderReviews = orderReviewRepository.findAll();
        return orderReviews.stream()
            .map(this::convertToResponseDTO)
            .collect(Collectors.toList());
    }

    private OrderReviewDTO.Response convertToResponseDTO(OrderReview review) {
        OrderReviewDTO.Response res = new OrderReviewDTO.Response();
        res.setReviewId(review.getReviewId());
        res.setOrderId(review.getOrder().getOrderId());
        res.setEmail(review.getUser().getEmail());
        res.setRating(review.getRating());
        res.setComment(review.getComment());
        res.setCreatedAt(review.getCreatedAt());
        return res;
    }
}
