package com.example.demo.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;

@Entity
@Table(
    name = "cart_items",
    uniqueConstraints = {
        @UniqueConstraint(columnNames = {"id", "product_id", "size"})
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
    @JoinColumn(name = "product_id", nullable = false)
    @JsonIgnoreProperties({"carts", "orderItems", "category"}) 
    private Product product;

    @Column(nullable = false)
    private Integer quantity = 1;

    @Column(length = 10)
    private String size;

    public Cart() {}

    public Cart(User user, Product product, Integer quantity, String size) {
        this.user = user;
        this.product = product;
        this.quantity = quantity;
        this.size = size;
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

    public Product getProduct() { 
        return product; 
    }
    public void setProduct(Product product) { 
        this.product = product; 
    }

    public Integer getQuantity() { 
        return quantity; 
    }
    public void setQuantity(Integer quantity) { 
        this.quantity = quantity; 
    }

    public String getSize() {
        return size;
    }
    public void setSize(String size) {
        this.size = size;
    }
}