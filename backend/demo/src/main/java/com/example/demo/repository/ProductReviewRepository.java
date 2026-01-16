package com.example.demo.repository;

import com.example.demo.model.ProductReview;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ProductReviewRepository extends JpaRepository<ProductReview, Integer> {
    List<ProductReview> findByProduct_ProductIdOrderByCreatedAtDesc(Integer productId);
    boolean existsByOrderItem_OrderItemId(Integer orderItemId);
    @Query("SELECT AVG(r.rating) FROM ProductReview r WHERE r.product.productId = ?1")
    Double getAverageRatingByProductId(Integer productId);
}
