package com.example.demo.dto;

import java.time.LocalDateTime;

public class OrderReviewDTO {

    public static class Request {
        private Integer userId;
        private Integer orderId;
        private Integer rating;
        private String comment;

        public Integer getUserId() { return userId; }
        public void setUserId(Integer userId) { this.userId = userId; }
        public Integer getOrderId() { return orderId; }
        public void setOrderId(Integer orderId) { this.orderId = orderId; }
        public Integer getRating() { return rating; }
        public void setRating(Integer rating) { this.rating = rating; }
        public String getComment() { return comment; }
        public void setComment(String comment) { this.comment = comment; }
    }

    public static class Response {
        private Integer reviewId;
        private Integer orderId;
        private String email;
        private Integer rating;
        private String comment;
        private LocalDateTime createdAt;

        public Integer getReviewId() { return reviewId; }
        public void setReviewId(Integer reviewId) { this.reviewId = reviewId; }
        public Integer getOrderId() { return orderId; }
        public void setOrderId(Integer orderId) { this.orderId = orderId; }
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public Integer getRating() { return rating; }
        public void setRating(Integer rating) { this.rating = rating; }
        public String getComment() { return comment; }
        public void setComment(String comment) { this.comment = comment; }
        public LocalDateTime getCreatedAt() { return createdAt; }
        public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    }
}
