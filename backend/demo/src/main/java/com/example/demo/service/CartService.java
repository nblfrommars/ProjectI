package com.example.demo.service;

import com.example.demo.model.Cart;
import com.example.demo.model.Product;
import com.example.demo.model.User;
import com.example.demo.repository.CartRepository;
import com.example.demo.repository.ProductRepository;
import com.example.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
@Service
public class CartService {
    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductRepository productRepository;

    public List<Cart> getCartByUser(Integer userId){
        return cartRepository.findByUser_Id(userId);
    }

    public Cart addToCart(Integer userId, Integer productId, Integer qty, String size){
        User user  = userRepository.findById(userId)
        .orElseThrow(() -> new RuntimeException("User không tồn tại"));
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Sản phẩm không tồn tại"));
        return cartRepository.findByUser_IdAndProduct_ProductIdAndSize(userId, productId, size)
        .map(existingCart -> {
            existingCart.setQuantity(existingCart.getQuantity()+qty);
            return cartRepository.save(existingCart);
        })
        .orElseGet(() -> {
            Cart newCart = new Cart(user, product, qty, size);
            return cartRepository.save(newCart);
        });
    }

    public Cart updateQuantity(Integer cartId, Integer qty){
        Cart cart = cartRepository.findById(cartId)
        .orElseThrow(() -> new RuntimeException("Không tìm thấy giỏ hàng"));
        cart.setQuantity(qty);
        return cartRepository.save(cart);
    }

    public void removeFromCart(Integer cartId) {
        cartRepository.deleteById(cartId);
    }

    @Transactional
    public void clearCart(Integer userId) {
        cartRepository.deleteByUser_Id(userId);
    }
}
