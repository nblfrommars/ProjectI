package com.example.demo.service;

import com.example.demo.model.User;
import com.example.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.Optional;
import com.example.demo.config.SecurityConfig;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // register
    public User register(User user) {
    if (userRepository.findByEmail(user.getEmail()).isPresent()) {
        throw new RuntimeException("Email đã tồn tại!");
    }
    if (user.getRole() == null) user.setRole("user");
    user.setPw(passwordEncoder.encode(user.getPw()));
    return userRepository.save(user);
}

    // login
    public User login(String email, String pw) {
        User user = userRepository.findByEmail(email)
            .orElseThrow(() ->
                new RuntimeException("Email hoặc mật khẩu không đúng")
            );

        if (!passwordEncoder.matches(pw, user.getPw())) {
            throw new RuntimeException("Email hoặc mật khẩu không đúng");
        }

        return user;
    }
}
