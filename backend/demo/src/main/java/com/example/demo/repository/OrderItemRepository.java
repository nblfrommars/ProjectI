package com.example.demo.repository;

import com.example.demo.model.OrderItem;
import com.example.demo.model.Order;
import com.example.demo.model.Product;
import com.example.demo.model.ProductVariant;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem, Integer> {

    List<OrderItem> findByOrder(Order order);

    List<OrderItem> findByProductVariant_Product(Product product);
    List<OrderItem> findByProductVariant(ProductVariant variant);
    
    void deleteByOrder(Order order);
}
