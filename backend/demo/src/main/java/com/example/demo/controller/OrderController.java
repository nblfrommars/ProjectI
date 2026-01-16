package com.example.demo.controller;

import com.example.demo.dto.OrderDTO;
import com.example.demo.service.OrderService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.view.RedirectView;

import java.util.HashMap;
import java.util.List;
import java.util.Map;


@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "*")
public class OrderController {
    
    @Autowired
    private OrderService orderService;

    @PostMapping("/create")
    public ResponseEntity<?> placeOrder(@RequestBody OrderDTO.Request request, HttpServletRequest httpServletRequest) {
        try {
            OrderDTO.Response response = orderService.createOrder(request);
             if ("VNPAY".equalsIgnoreCase(request.getPaymentMethod())) {
                String paymentUrl = orderService.createPaymentUrl(response, httpServletRequest);
                Map<String, Object> result = new HashMap<>();
                result.put("message", "Redirecting to VNPay");
                result.put("paymentUrl", paymentUrl);
                result.put("order", response); 
                return ResponseEntity.ok(result);
            }
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @GetMapping("/vnpay-callback")
    public RedirectView vnpayCallback(HttpServletRequest request) {
        int result = orderService.processPaymentReturn(request);
        
        String orderId = request.getParameter("vnp_TxnRef");

        if (result == 1) {
            return new RedirectView("http://localhost:3000/payment/success?orderId=" + orderId);
        } else {
            return new RedirectView("http://localhost:3000/payment/fail");
        }
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<OrderDTO.Response>> getUserOrders(@PathVariable Integer userId) {
        List<OrderDTO.Response> orders = orderService.getOrdersByUserId(userId);
        return ResponseEntity.ok(orders);
    }

    @GetMapping
    public ResponseEntity<List<OrderDTO.Response>> getAllOrders(){
        List<OrderDTO.Response> orders = orderService.getAllOrders();
        return ResponseEntity.ok(orders);
    }

    @GetMapping("/{orderId}")
    public ResponseEntity<OrderDTO.Response> getOrderDetail(@PathVariable Integer orderId) {
        try {
            OrderDTO.Response order = orderService.getOrderById(orderId);
            return ResponseEntity.ok(order);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{orderId}/status")
    public ResponseEntity<?> updateStatus(@PathVariable Integer orderId, @RequestParam String status) {
        try {
            OrderDTO.Response response = orderService.updateOrderStatus(orderId, status);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
}