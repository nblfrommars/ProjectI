package com.example.demo.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.sql.Timestamp;
@Entity
@Table(name="orders")

public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer orderID;

    @ManyToOne
    @JoinColumn(name="userID",nullable = false)
    @JsonBackReference
    private User user;

    private BigDecimal total_price;

    public enum orderStatus{
    pending,
    paid,
    shipped,
    cancelled
}
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private orderStatus status;

    @Column(name="created_at")
    private Timestamp created_at;
    
    public Order(){}

//getters va setters
    public Integer getOrderID() {return this.orderID;}
    public orderStatus getOrderStatus() {return this.status;}
    public void getOrderStatus(orderStatus status) {this.status = status;}
    public BigDecimal getTotalPrice() {return this.total_price;}
}
