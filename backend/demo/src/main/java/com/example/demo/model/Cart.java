package com.example.demo.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;

@Entity
@Table(
    name = "cart_items",
    uniqueConstraints = {
        @UniqueConstraint(columnNames = {"userID", "productID"})
    }
)
public class Cart {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "cartID")
    private Integer cartID;

    @ManyToOne
    @JoinColumn(name = "userID", nullable = false)
    @JsonIgnoreProperties("carts") 
    private User user;

    @ManyToOne
    @JoinColumn(name = "productID", nullable = false)
    @JsonIgnoreProperties({"carts", "orderItems", "category"}) 
    private Product product;

    @Column(name = "quantity", nullable = false)
    private Integer quantity = 1;

    public Cart() {}

    public Cart(User user, Product product, Integer quantity) {
        this.user = user;
        this.product = product;
        this.quantity = quantity;
    }

    // Getters & Setters
    public Integer getCartID() { return cartID; }
    public void setCartID(Integer cartID) { this.cartID = cartID; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public Product getProduct() { return product; }
    public void setProduct(Product product) { this.product = product; }

    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }
}