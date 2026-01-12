package com.example.demo.controller;

import com.example.demo.model.Cart;
import com.example.demo.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("api/cart")
@CrossOrigin(origins = "*")
public class CartController {
    @Autowired
    private CartService cartService;
    @GetMapping("/{userId}")
    public ResponseEntity <List<Cart>> getCart (@PathVariable Integer userId){
        return ResponseEntity.ok(cartService.getCartByUser(userId));
    }
    @PostMapping("/add")
    public ResponseEntity<Cart> add(@RequestBody Map<String, Object> payload)
    {
        Integer userId = (Integer) payload.get("userId");
        Integer productId = (Integer) payload.get("productId");
        Integer qty = (Integer) payload.get("quantity");
        String size = (String) payload.get("size");

        return ResponseEntity.ok(cartService.addToCart(userId, productId, qty, size));
    }

    @PutMapping("/update/{cartId}")
    public ResponseEntity<Cart> update(@PathVariable Integer cartId, @RequestBody Map<String, Integer> payload) {
        return ResponseEntity.ok(cartService.updateQuantity(cartId, payload.get("quantity")));
    }


    @DeleteMapping("/remove/{cartId}")
    public ResponseEntity<?> remove(@PathVariable Integer cartId) {
        cartService.removeFromCart(cartId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/clear/{userId}")
    public ResponseEntity<?> clear(@PathVariable Integer userId) {
        cartService.clearCart(userId);
        return ResponseEntity.ok().build();
    }

}
