package com.example.demo.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.*;
import java.sql.Timestamp;
import java.time.Instant;
@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer userID;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String pw;

    @Column(nullable = false)
    private String role = "user"; // default user

    @Column(nullable = false, updatable = false)
    private Timestamp createdAt;

    public User() {
        this.createdAt = Timestamp.from(Instant.now());
    }

    public User(String email, String pw, String role) {
        this.email = email;
        this.pw = pw;
        this.role = role;
        this.createdAt = Timestamp.from(Instant.now());
    }

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
}