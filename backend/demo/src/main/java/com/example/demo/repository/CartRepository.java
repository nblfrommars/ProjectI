package com.example.demo.repository;

import com.example.demo.model.Cart;
import com.example.demo.model.User;
import com.example.demo.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CartRepository extends JpaRepository<Cart, Integer> {

    // mo cart theo user
    List<Cart> findByUser(User user);

    // Tim cart theo user
    Optional<Cart> findByUserAndProduct(User user, Product product);
}
