package com.example.demo.service;

import com.example.demo.dto.OrderDTO;
import com.example.demo.model.*;
import com.example.demo.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

import javax.management.RuntimeErrorException;
@Service
public class OrderService {
    @Autowired private OrderRepository orderRepository;
    @Autowired private UserRepository userRepository;
    @Autowired private ProductRepository productRepository;

    @Transactional
    public OrderDTO.Response createOrder(OrderDTO.Request request) {
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User không tồn tại"));

        Order order = new Order();
        order.setUser(user);
        order.setPhoneNumber(request.getPhoneNumber());
        order.setAddress(request.getAddress());
        order.setStatus("pending");
        order.setPaymentMethod(request.getPaymentMethod());

        BigDecimal totalOrderPrice = BigDecimal.ZERO;

        for (OrderDTO.OrderItemRequest itemReq : request.getItems()) {
            Product product = productRepository.findById(itemReq.getProductId())
                    .orElseThrow(() -> new RuntimeException("Sản phẩm ID " + itemReq.getProductId() + " không tồn tại"));

            if (product.getStock() < itemReq.getQuantity()) {
                throw new RuntimeException("Sản phẩm " + product.getProductName() + " không đủ hàng");
            }
            product.setStock(product.getStock() - itemReq.getQuantity());
            productRepository.save(product);

            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order);
            orderItem.setProduct(product);
            orderItem.setQuantity(itemReq.getQuantity());
            orderItem.setPrice(product.getPrice());
            orderItem.setSize(itemReq.getSize());
            
            BigDecimal subTotal = product.getPrice().multiply(new BigDecimal(itemReq.getQuantity()));
            orderItem.setSubTotal(subTotal);
            
            totalOrderPrice = totalOrderPrice.add(subTotal);
            order.getOrderItems().add(orderItem);
        }

        order.setTotalPrice(totalOrderPrice);
        Order savedOrder = orderRepository.save(order);

        return convertToResponseDTO(savedOrder);
    }

    public List<OrderDTO.Response> getOrdersByUserId(Integer userId) {
        return orderRepository.findByUser_IdOrderByCreatedAtDesc(userId)
                .stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }

    public OrderDTO.Response getOrderById(Integer orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Đơn hàng không tồn tại"));
        return convertToResponseDTO(order);
    }
    
    public List<OrderDTO.Response> getAllOrders (){
        return orderRepository.findAll()
        .stream()
        .map(this::convertToResponseDTO)
        .collect(Collectors.toList());
    }

    private OrderDTO.Response convertToResponseDTO(Order order) {
        OrderDTO.Response res = new OrderDTO.Response();
        res.setOrderId(order.getOrderId());
        if (order.getUser() != null) {
        res.setUserId(order.getUser().getId()); 
    }
        res.setTotalPrice(order.getTotalPrice());
        res.setStatus(order.getStatus());
        res.setCreatedAt(order.getCreatedAt());
        res.setPhoneNumber(order.getPhoneNumber());
        res.setAddress(order.getAddress());
        res.setPaymentMethod(order.getPaymentMethod());

        List<OrderDTO.OrderItemResponse> itemDTOs = order.getOrderItems().stream().map(item -> {
            OrderDTO.OrderItemResponse itemRes = new OrderDTO.OrderItemResponse();
            itemRes.setProductName(item.getProduct().getProductName());
            itemRes.setImageUrl(item.getProduct().getImageUrl());
            itemRes.setQuantity(item.getQuantity());
            itemRes.setPrice(item.getPrice());
            itemRes.setSize(item.getSize());
            itemRes.setSubTotal(item.getSubTotal());
            return itemRes;
        }).collect(Collectors.toList());

        res.setOrderItems(itemDTOs);
        return res;
    }
    public OrderDTO.Response updateOrderStatus(Integer orderId, String newStatus){

        Order order = orderRepository.findById(orderId)
        .orElseThrow(()-> new RuntimeException("Không tồn tại đơn hàng này!"));

        String oldStatus = order.getStatus();
        if (oldStatus.equalsIgnoreCase(newStatus))
        {
            return convertToResponseDTO(order);
        }
        if ("cancelled".equalsIgnoreCase(newStatus))
        {
            for (OrderItem item:order.getOrderItems())
                {
                    Product product = item.getProduct();
                    product.setStock(product.getStock()+item.getQuantity());
                    productRepository.save(product);
                } 
        }
        order.setStatus(newStatus.toLowerCase());
        Order updatedOrder = orderRepository.save(order);
        return convertToResponseDTO(updatedOrder);
    }
}

