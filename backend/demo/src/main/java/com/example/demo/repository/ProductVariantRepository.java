package com.example.demo.repository;

import com.example.demo.model.ProductVariant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface ProductVariantRepository extends JpaRepository<ProductVariant, Integer> {

    List<ProductVariant> findByProductProductId(Integer productId);

    Optional<ProductVariant> findByProductProductIdAndSize(Integer productId, String size);

    List<ProductVariant> findByStockLessThan(Integer threshold);
}