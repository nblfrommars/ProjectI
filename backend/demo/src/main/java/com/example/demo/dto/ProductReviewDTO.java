package com.example.demo.dto;

import java.time.LocalDateTime;

public class ProductReviewDTO {

    public static class Request {
        private Integer userId;
        private Integer orderItemId;
        private Integer rating;
        private String comment;

        public Integer getUserId() { return userId; }
        public void setUserId(Integer userId) { this.userId = userId; }
        public Integer getOrderItemId() { return orderItemId; }
        public void setOrderItemId(Integer orderItemId) { this.orderItemId = orderItemId; }
        public Integer getRating() { return rating; }
        public void setRating(Integer rating) { this.rating = rating; }
        public String getComment() { return comment; }
        public void setComment(String comment) { this.comment = comment; }
    }

    public static class Response {
        private Integer reviewId;
        private String email; 
        private String productName;
        private String size;
        private Integer rating;
        private String comment;
        private LocalDateTime createdAt;

        public Integer getReviewId() { return reviewId; }
        public void setReviewId(Integer reviewId) { this.reviewId = reviewId; }
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getProductName() { return productName; }
        public void setProductName(String productName) { this.productName = productName; }
        public String getSize() { return size; }
        public void setSize(String size) { this.size = size; }
        public Integer getRating() { return rating; }
        public void setRating(Integer rating) { this.rating = rating; }
        public String getComment() { return comment; }
        public void setComment(String comment) { this.comment = comment; }
        public LocalDateTime getCreatedAt() { return createdAt; }
        public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    }
}