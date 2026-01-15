package com.example.demo.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;

@Entity
@Table(
    name = "cart_items",
    uniqueConstraints = {
        @UniqueConstraint(columnNames = {"id", "variant_id"}) 
    }
)
public class Cart {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer cartId;

    @ManyToOne
    @JoinColumn(name = "id", nullable = false)
    @JsonIgnoreProperties("carts") 
    private User user;

    @ManyToOne
    @JoinColumn(name = "variant_id", nullable = false)
    @JsonIgnoreProperties({"carts", "orderItems"}) 
    private ProductVariant productVariant;

    @Column(nullable = false)
    private Integer quantity = 1;

    public Cart() {}

    public Cart(User user, ProductVariant productVariant, Integer quantity) {
        this.user = user;
        this.productVariant = productVariant;
        this.quantity = quantity;
    }

    public Integer getCartId() { 
        return cartId; 
    }
    public void setCartId(Integer cartId) { 
        this.cartId = cartId; 
    }

    public User getUser() { 
        return user; 
    }
    public void setUser(User user) { 
        this.user = user; 
    }

    public ProductVariant getProductVariant() { 
        return productVariant; 
    }
    public void setProductVariant(ProductVariant productVariant) { 
        this.productVariant = productVariant; 
    }

    public Integer getQuantity() { 
        return quantity; 
    }
    public void setQuantity(Integer quantity) { 
        this.quantity = quantity; 
    }
    public String getSize() {
        return (productVariant != null) ? productVariant.getSize() : null;
    }
    
    public Product getProduct() {
        return (productVariant != null) ? productVariant.getProduct() : null;
    }
}