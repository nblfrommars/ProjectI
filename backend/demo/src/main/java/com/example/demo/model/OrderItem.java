package com.example.demo.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.example.demo.model.ProductVariant;

@Entity
@Table(name = "order_items")
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer orderItemId; 

    @ManyToOne
    @JoinColumn(name = "order_id", nullable = false)
    @JsonIgnoreProperties("orderItems")
    private Order order;

    @ManyToOne
    @JoinColumn(name = "variant_id", nullable = false)
    @JsonIgnoreProperties({"orderItems", "product"}) 
    private ProductVariant productVariant;

    private Integer quantity;

    @Column(precision = 10, scale = 2)
    private BigDecimal price; 

    @Column(precision = 10, scale = 2)
    private BigDecimal subTotal;

    public OrderItem() {}

    public OrderItem(Order order, ProductVariant variant, Integer quantity, BigDecimal price) {
        this.order = order;
        this.productVariant = variant;
        this.quantity = quantity;
        this.price = price;
        if (price != null && quantity != null) {
            this.subTotal = price.multiply(new BigDecimal(quantity));
        }
    }

    public Integer getOrderItemId() {
        return orderItemId;
    }

    public void setOrderItemId(Integer orderItemId) {
        this.orderItemId = orderItemId;
    }

    public Order getOrder() {
        return order;
    }

    public void setOrder(Order order) {
        this.order = order;
    }

    public ProductVariant getProductVariant() { return productVariant; }
    public void setProductVariant(ProductVariant productVariant) { this.productVariant = productVariant; }

    public String getSize() {
        return (productVariant != null) ? productVariant.getSize() : null;
    }


    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public BigDecimal getSubTotal() {
        return subTotal;
    }

    public void setSubTotal(BigDecimal subTotal) {
        this.subTotal = subTotal;
    }
}

