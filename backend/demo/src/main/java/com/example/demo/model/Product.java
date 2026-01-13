package com.example.demo.model;

import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.math.BigDecimal;
@Entity
@Table(name = "products")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer productId; 

    @Column( nullable = false)
    private String productName; 

    @ManyToOne
    @JoinColumn(name = "category_id", nullable = false) 
    @JsonIgnoreProperties("products") 
    private Category category;

    @Column(precision = 10, scale = 2)
    private BigDecimal price;

    @Column(columnDefinition = "TEXT")
    private String des;

    private String imageUrl; 

    private Integer stock;

    private LocalDateTime createdAt; 

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL)
    @JsonIgnoreProperties("product")
    private List<Cart> carts = new ArrayList<>();

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL)
    @JsonIgnoreProperties("product")
    private List<OrderItem> orderItems = new ArrayList<>();

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    public Product() {}

    // Getter & Setter
    public Integer getProductId() { return productId; }
    public void setProductId(Integer productId) { this.productId = productId; }

    public String getProductName() { return productName; }
    public void setProductName(String productName) { this.productName = productName; }

    public Category getCategory() { return category; }
    public void setCategory(Category category) { this.category = category; }

    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }

    public String getDes() { return des; }
    public void setDes(String des) { this.des = des; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public Integer getStock() { return stock; }
    public void setStock(Integer stock) { this.stock = stock; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public List<Cart> getCarts() { return carts; }
    public void setCarts(List<Cart> carts) { this.carts = carts; }

    public List<OrderItem> getOrderItems() { return orderItems; }
    public void setOrderItems(List<OrderItem> orderItems) { this.orderItems = orderItems; }
}