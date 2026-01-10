package com.example.demo.model;

import jakarta.persistence.*;
import java.sql.Timestamp;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;


@Entity
@Table(name = "products")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "productID")
    private Integer productId; 

    @Column(nullable = false)
    private String productName; 

    @ManyToOne
    @JoinColumn(name = "categoryID", nullable = false) 
    @JsonIgnoreProperties("products") 
    private Category category;

    private Double price;

    private String des;

    private String imageUrl; 

    private Integer stock;

    @Column(updatable = false)
    private Timestamp createdAt; 

    @OneToMany(mappedBy = "product")
    @JsonIgnoreProperties("product")
    private List<Cart> carts = new ArrayList<>();

    @OneToMany(mappedBy = "product")
    @JsonIgnoreProperties("product")
    private List<OrderItem> orderItems = new ArrayList<>();

    @PrePersist
    protected void onCreate() {
        this.createdAt = Timestamp.from(Instant.now());
    }


    public Product() {}

    public Product(String productName, Category category, Double price, String des, String imageUrl, Integer stock) {
        this.productName = productName;
        this.category = category;
        this.price = price;
        this.des = des;
        this.imageUrl = imageUrl;
        this.stock = stock;
    }

    public Integer getProductId() { return productId; }
    public void setProductId(Integer productId) { this.productId = productId; }

    public String getProductName() { return productName; }
    public void setProductName(String productName) { this.productName = productName; }

    public Category getCategory() { return category; }
    public void setCategory(Category category) { this.category = category; }

    public Double getPrice() { return price; }
    public void setPrice(Double price) { this.price = price; }

    public String getDes() { return des; }
    public void setDes(String des) { this.des = des; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public Integer getStock() { return stock; }
    public void setStock(Integer stock) { this.stock = stock; }

    public Timestamp getCreatedAt() { return createdAt; }
    public void setCreatedAt(Timestamp createdAt) { this.createdAt = createdAt; }

    public List<Cart> getCarts() { return carts; }
    public void setCarts(List<Cart> carts) { this.carts = carts; }

    public List<OrderItem> getOrderItems() { return orderItems; }
    public void setOrderItems(List<OrderItem> orderItems) { this.orderItems = orderItems; }
}
