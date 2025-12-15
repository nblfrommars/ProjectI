package com.example.demo.model;

import com.fasterxml.jackson.annotation.JsonBackReference;

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

    //Mapping User
    @ManyToOne
    @JoinColumn(name = "userID", nullable = false)
    @JsonBackReference("user_cart")
    private User user;

    //Mapping Product
    @ManyToOne
    @JoinColumn(name = "productID", nullable = false)
    @JsonBackReference("product-cart")
    private Product product;

    @Column(name = "quantity", nullable = false)
    private Integer quantity = 1;

    // Constructors
    public Cart() {}

    public Cart(User user, Product product, Integer quantity) {
        this.user = user;
        this.product = product;
        this.quantity = quantity;
    }

    // Getters & Setters
    public Integer getCartID() {
        return cartID;
    }

    public void setCartID(Integer cartID) {
        this.cartID = cartID;
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
}
