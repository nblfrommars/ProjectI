package com.example.demo.service;

import com.example.demo.model.Cart;
import com.example.demo.model.ProductVariant;
import com.example.demo.model.User;
import com.example.demo.repository.CartRepository;
import com.example.demo.repository.ProductVariantRepository;
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
    private ProductVariantRepository variantRepository;

    public List<Cart> getCartByUser(Integer userId){
        return cartRepository.findByUser_Id(userId);
    }

    /**
     * @param variantId: ID của biến thể (ví dụ ID của "Áo thun size M")
     */
    public Cart addToCart(Integer userId, Integer variantId, Integer qty){
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User không tồn tại"));

        ProductVariant variant = variantRepository.findById(variantId)
                .orElseThrow(() -> new RuntimeException("Biến thể sản phẩm không tồn tại"));

        if (variant.getStock() < qty) {
            throw new RuntimeException("Số lượng trong kho không đủ (Còn lại: " + variant.getStock() + ")");
        }

        return cartRepository.findByUser_IdAndProductVariant_VariantId(userId, variantId)
            .map(existingCart -> {
                existingCart.setQuantity(existingCart.getQuantity() + qty);
                return cartRepository.save(existingCart);
            })
            .orElseGet(() -> {
                Cart newCart = new Cart(user, variant, qty);
                return cartRepository.save(newCart);
            });
    }

    public Cart updateQuantity(Integer cartId, Integer qty){
        Cart cart = cartRepository.findById(cartId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy giỏ hàng"));
        
        if (cart.getProductVariant().getStock() < qty) {
            throw new RuntimeException("Kho không đủ hàng");
        }

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