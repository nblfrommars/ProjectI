package com.example.demo.model;

import jakarta.persistence.*;
import java.sql.Timestamp;
import java.time.Instant;
import java.util.List;
import java.util.ArrayList;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer userID;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    // @JsonProperty(access = JsonProperty.Access.WRITE_ONLY) 
    // Dòng trên giúp bảo mật: Cho phép gửi password lên nhưng không bao giờ hiện password ra khi lấy thông tin User
    private String pw;

    @Column(nullable = false)
    private String role = "user"; 

    @Column(nullable = false, updatable = false)
    private Timestamp createdAt;

    // Tự động gán thời gian tạo bằng PrePersist (Chuẩn JPA)
    @PrePersist
    protected void onCreate() {
        this.createdAt = Timestamp.from(Instant.now());
    }

    public User() {}

    public User(String email, String pw, String role) {
        this.email = email;
        this.pw = pw;
        this.role = role;
    }

    // Mapping Order
    @OneToMany(mappedBy = "user")
    @JsonIgnoreProperties("user") // Cắt vòng lặp: Khi xem User không hiện danh sách Order lồng User lồng Order...
    private List<Order> orders = new ArrayList<>();

    // Mapping Cart
    @OneToMany(mappedBy = "user")
    @JsonIgnoreProperties("user") // Tương tự với Cart
    private List<Cart> carts = new ArrayList<>();

    // getter & setter
    public Integer getUserID() { return userID; }
    public void setUserID(Integer userID) { this.userID = userID; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPw() { return pw; }
    public void setPw(String pw) { this.pw = pw; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public Timestamp getCreatedAt() { return createdAt; }
    public void setCreatedAt(Timestamp createdAt) { this.createdAt = createdAt; }

    public List<Order> getOrders() { return orders; }
    public void setOrders(List<Order> orders) { this.orders = orders; }

    public List<Cart> getCarts() { return carts; }
    public void setCarts(List<Cart> carts) { this.carts = carts; }
}