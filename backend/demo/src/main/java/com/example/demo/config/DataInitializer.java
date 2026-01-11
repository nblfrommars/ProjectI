package com.example.demo.config;

import com.example.demo.model.User;
import com.example.demo.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.context.annotation.Profile;
@Profile("dev")
@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initDatabase(
            UserRepository userRepository,
            CategoryRepository categoryRepository,
            ProductRepository productRepository,
            CartRepository cartRepository,
            OrderRepository orderRepository,
            OrderItemRepository orderItemRepository,
            PasswordEncoder passwordEncoder
    ) {
        return args -> {
            try {
                System.out.println(">>> Đang dọn dẹp Database...");
                
                orderItemRepository.deleteAll();
                orderRepository.deleteAll();
                cartRepository.deleteAll();
                productRepository.deleteAll();
                categoryRepository.deleteAll();
                userRepository.deleteAll();

                System.out.println(">>> Đang khởi tạo tài khoản Admin...");
                
                User admin = new User();
                admin.setEmail("adminbaolinh@.com");
                admin.setPassword(passwordEncoder.encode("admin"));
                admin.setRole("admin");
                
                userRepository.save(admin);

                System.out.println(" DATABASE ĐÃ SẴN SÀNG!");
                System.out.println("Admin: adminbaolinh@.com / Pass: admin");
                
            } catch (Exception e) {
                System.err.println("Lỗi khởi tạo Database: " + e.getMessage());
            }
        };
    }
}