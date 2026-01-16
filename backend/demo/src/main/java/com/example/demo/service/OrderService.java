package com.example.demo.service;

import com.example.demo.config.VNPayConfig;
import com.example.demo.dto.OrderDTO;
import com.example.demo.model.*;
import com.example.demo.repository.*;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.UnsupportedEncodingException;
import java.math.BigDecimal;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.stream.Collectors;


@Service
public class OrderService {
    @Autowired private OrderRepository orderRepository;
    @Autowired private UserRepository userRepository;
    @Autowired private ProductVariantRepository variantRepository; 

    

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
        order.setOrderItems(new ArrayList<>()); 

        for (OrderDTO.OrderItemRequest itemReq : request.getItems()) {
            ProductVariant variant = variantRepository.findById(itemReq.getVariantId())
                    .orElseThrow(() -> new RuntimeException("Size có ID " + itemReq.getVariantId() + " không tồn tại"));

            if (variant.getStock() < itemReq.getQuantity()) {
                throw new RuntimeException("Sản phẩm " + variant.getProduct().getProductName() + 
                                           " size " + variant.getSize() + " không đủ hàng");
            }

            variant.setStock(variant.getStock() - itemReq.getQuantity());
            variantRepository.save(variant);

            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order);
            orderItem.setProductVariant(variant);
            orderItem.setQuantity(itemReq.getQuantity());
            
            BigDecimal unitPrice = variant.getProduct().getPrice();
            orderItem.setPrice(unitPrice);
            
            BigDecimal subTotal = unitPrice.multiply(new BigDecimal(itemReq.getQuantity()));
            orderItem.setSubTotal(subTotal);
            
            totalOrderPrice = totalOrderPrice.add(subTotal);
            order.getOrderItems().add(orderItem);
        }

        order.setTotalPrice(totalOrderPrice);
        Order savedOrder = orderRepository.save(order);

        return convertToResponseDTO(savedOrder);
    }

    @Value("${vnp.tmn.code}") private String vnp_TmnCode;
    @Value("${vnp.hash.secret}") private String vnp_HashSecret;
    @Value("${vnp.pay.url}") private String vnp_PayUrl;
    @Value("${vnp.return.url}") private String vnp_ReturnUrl;

    public String createPaymentUrl(OrderDTO.Response orderRes, HttpServletRequest request) {
        String vnp_Version = "2.1.0";
        String vnp_Command = "pay";
        String vnp_TxnRef = String.valueOf(orderRes.getOrderId());
        String vnp_IpAddr = VNPayConfig.getIpAddress(request);
        String vnp_TmnCode = this.vnp_TmnCode;

        Map<String, String> vnp_Params = new TreeMap<> ();
        vnp_Params.put("vnp_Version", vnp_Version);
        vnp_Params.put("vnp_Command", vnp_Command);
        vnp_Params.put("vnp_TmnCode", vnp_TmnCode);

        long amount = orderRes.getTotalPrice().multiply(new BigDecimal(100)).longValue();

        vnp_Params.put("vnp_Amount", String.valueOf(amount));
        vnp_Params.put("vnp_CurrCode", "VND");
        vnp_Params.put("vnp_TxnRef", vnp_TxnRef);
        vnp_Params.put("vnp_OrderInfo", "Thanh toan don hang #" + vnp_TxnRef);
        vnp_Params.put("vnp_OrderType", "other");
        vnp_Params.put("vnp_Locale", "vn");
        vnp_Params.put("vnp_ReturnUrl", vnp_ReturnUrl);
        vnp_Params.put("vnp_IpAddr", vnp_IpAddr);

        Calendar cld = Calendar.getInstance(TimeZone.getTimeZone("Etc/GMT+7"));
        SimpleDateFormat formatter = new SimpleDateFormat("yyyyMMddHHmmss");
        vnp_Params.put("vnp_CreateDate", formatter.format(cld.getTime()));

        StringBuilder hashData = new StringBuilder();
        StringBuilder query = new StringBuilder();
        Iterator<String> itr = vnp_Params.keySet().iterator();
        while (itr.hasNext()) {
            String fieldName = itr.next();
            String fieldValue = vnp_Params.get(fieldName);
            if ((fieldValue != null) && (fieldValue.length() > 0)) {
                hashData.append(fieldName).append('=').append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII));
                 query.append(URLEncoder.encode(fieldName, StandardCharsets.US_ASCII)).append('=').append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII));
            }
            if (itr.hasNext()) {
                    query.append('&');
                    hashData.append('&');
                }
        }
        String queryUrl = query.toString();
        String vnp_SecureHash = VNPayConfig.hmacSHA512(vnp_HashSecret, hashData.toString());
        queryUrl += "&vnp_SecureHash=" + vnp_SecureHash;
        return vnp_PayUrl + "?" + queryUrl;
    }

    @Transactional
    public int processPaymentReturn(HttpServletRequest request)
    {
        Map<String, String> fields = new HashMap<>();
        for (Enumeration<String> params = request.getParameterNames(); params.hasMoreElements();) {
            String fieldName = params.nextElement();
            String fieldValue = request.getParameter(fieldName);
            if ((fieldValue != null) && (fieldValue.length() > 0)) {
                fields.put(fieldName, fieldValue);
            }
        }
        String vnp_SecureHash = request.getParameter("vnp_SecureHash");
        fields.remove("vnp_SecureHash");

        StringBuilder hashData = new StringBuilder();
        List<String> fieldNames = new ArrayList<>(fields.keySet());
        Collections.sort(fieldNames);
        Iterator<String> itr = fieldNames.iterator();
        while (itr.hasNext()) {
            String fieldName = itr.next();
            String fieldValue = fields.get(fieldName);
            hashData.append(fieldName).append('=').append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII));
            if (itr.hasNext()) {
                hashData.append('&');
            }
        }

        String builtHash = VNPayConfig.hmacSHA512(vnp_HashSecret, hashData.toString());

        if (builtHash.equals(vnp_SecureHash)) {
            String responseCode = request.getParameter("vnp_ResponseCode");
            Integer orderId = Integer.parseInt(request.getParameter("vnp_TxnRef"));

            if ("00".equals(responseCode)) {
                updateOrderStatus(orderId, "paid");
                return 1;
            } else {
                updateOrderStatus(orderId, "cancelled");
                return 0;
            }
        }
        return -1;
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
            res.setEmail(order.getUser().getEmail()); 
        }
        res.setTotalPrice(order.getTotalPrice());
        res.setStatus(order.getStatus());
        res.setCreatedAt(order.getCreatedAt());
        res.setPhoneNumber(order.getPhoneNumber());
        res.setAddress(order.getAddress());
        res.setPaymentMethod(order.getPaymentMethod());

        List<OrderDTO.OrderItemResponse> itemDTOs = order.getOrderItems().stream().map(item -> {
            OrderDTO.OrderItemResponse itemRes = new OrderDTO.OrderItemResponse();
            Product product = item.getProductVariant().getProduct();
            itemRes.setOrderItemId(item.getOrderItemId());
            
            itemRes.setProductName(product.getProductName());
            itemRes.setImageUrl(product.getImageUrl());
            itemRes.setQuantity(item.getQuantity());
            itemRes.setPrice(item.getPrice());
            itemRes.setSize(item.getProductVariant().getSize());
            itemRes.setSubTotal(item.getSubTotal());
            return itemRes;
        }).collect(Collectors.toList());

        res.setOrderItems(itemDTOs);
        return res;
    }

    @Transactional
    public OrderDTO.Response updateOrderStatus(Integer orderId, String newStatus){
        Order order = orderRepository.findById(orderId)
                .orElseThrow(()-> new RuntimeException("Không tồn tại đơn hàng này!"));

        String oldStatus = order.getStatus();
        if (oldStatus.equalsIgnoreCase(newStatus)) {
            return convertToResponseDTO(order);
        }
        if ("cancelled".equalsIgnoreCase(newStatus)) {
            for (OrderItem item : order.getOrderItems()) {
                ProductVariant variant = item.getProductVariant();
                variant.setStock(variant.getStock() + item.getQuantity());
                variantRepository.save(variant);
            } 
        }

        order.setStatus(newStatus.toLowerCase());
        Order updatedOrder = orderRepository.save(order);
        return convertToResponseDTO(updatedOrder);
    }
}