package com.example.demo.model;

import jakarta.persistence.*;
import java.sql.Timestamp;


import com.fasterxml.jackson.annotation.JsonBackReference;
@Entity
@Table(name="products")
public class Product{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer productID;

    @Column(name="productName", columnDefinition = "VARCHAR(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci", nullable = false)
    private String productName;

    @ManyToOne
    @JoinColumn(name = "categoryID", nullable = false)
    @JsonBackReference
    private Category category;

    @Column(name="price")
    private Double price;

    @Column(name="des", columnDefinition = "TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci")
    private String des;
    private String image_url;
    private int stock;
    @Column(name="created_at")
    private Timestamp created_at;
//getters and setters
    public Integer getProductID() { return productID; }
    public String getProductName() { return productName; }
    public void setProductName(String productName) { this.productName = productName; }
    public Category getCategory() { return category; }
    public void setCategory(Category category) { this.category = category; }
    public Double getPrice() { return price; }
    public void setPrice(Double price) { this.price = price; }
    public String getDes() { return des; }
    public void setDes(String des) { this.des = des; }
    public String getImage_url() { return image_url; }
    public void setImage_url(String image_url) { this.image_url = image_url; }
    public Integer getStock() { return stock; }
    public void setStock(Integer stock) { this.stock = stock; }
    public Timestamp getCreated_at() { return created_at; }
    public void setCreated_at(Timestamp created_at) { this.created_at = created_at; }
    public Product() {}
    //chua viet khoi tao Product co thong tin
}
