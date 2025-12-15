package com.example.demo.repository;

import com.example.demo.model.OrderItem;
import com.example.demo.model.Order;
import com.example.demo.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem, Integer> {

    List<OrderItem> findByOrder(Order order);

    List<OrderItem> findByProduct(Product product);
    
    void deleteByOrder(Order order);
}
