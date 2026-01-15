package com.example.demo.repository;
import com.example.demo.model.Cart;
import com.example.demo.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CartRepository extends JpaRepository<Cart, Integer> {

    List<Cart> findByUser(User user);

    List<Cart> findByUser_Id(Integer userId);

    Optional<Cart> findByUser_IdAndProductVariant_VariantId(Integer userId, Integer variantId);

    void deleteByUser_Id(Integer userId);
}