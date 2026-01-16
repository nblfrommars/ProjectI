package com.example.demo.service;

import com.example.demo.dto.ProductReviewDTO;
import com.example.demo.model.*;
import com.example.demo.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProductReviewService {

    @Autowired private ProductReviewRepository reviewRepository;
    @Autowired private UserRepository userRepository;
    @Autowired private OrderItemRepository orderItemRepository;

    @Transactional
    public ProductReviewDTO.Response addReview(ProductReviewDTO.Request request) {
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy User"));

        OrderItem orderItem = orderItemRepository.findById(request.getOrderItemId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy món hàng"));

        if (reviewRepository.existsByOrderItem_OrderItemId(request.getOrderItemId())) {
            throw new RuntimeException("Sản phẩm này đã được đánh giá rồi");
        }

        ProductReview review = new ProductReview();
        review.setUser(user);
        review.setOrderItem(orderItem);
        review.setProduct(orderItem.getProductVariant().getProduct());
        review.setProductVariant(orderItem.getProductVariant());
        review.setRating(request.getRating());
        review.setComment(request.getComment());

        ProductReview saved = reviewRepository.save(review);
        return convertToResponseDTO(saved);
    }

    public List<ProductReviewDTO.Response> getReviewsByProduct(Integer productId) {
        return reviewRepository.findByProduct_ProductIdOrderByCreatedAtDesc(productId)
                .stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }

    private ProductReviewDTO.Response convertToResponseDTO(ProductReview review) {
        ProductReviewDTO.Response res = new ProductReviewDTO.Response();
        res.setReviewId(review.getReviewId());
        res.setEmail(review.getUser().getEmail());
        res.setProductName(review.getProduct().getProductName());
        res.setSize(review.getProductVariant().getSize());
        res.setRating(review.getRating());
        res.setComment(review.getComment());
        res.setCreatedAt(review.getCreatedAt());
        return res;
    }
}