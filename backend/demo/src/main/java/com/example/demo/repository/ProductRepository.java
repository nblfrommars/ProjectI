package com.example.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.example.demo.model.Product;
import java.util.Optional;
import java.util.List;
import com.example.demo.model.Category;
@Repository
public interface ProductRepository extends JpaRepository<Product, Integer>{
    Optional<Product> findByProductName(String productName);
    List<Product> findByCategory(Category category);
    boolean existsByProductName(String productName);
}