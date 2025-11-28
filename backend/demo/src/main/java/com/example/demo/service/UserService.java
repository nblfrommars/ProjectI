package com.example.demo.service;

import com.example.demo.model.User;
import com.example.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    // register
    public User register(User user) {
    if (userRepository.findByEmail(user.getEmail()).isPresent()) {
        throw new RuntimeException("Email đã tồn tại!");
    }
    if (user.getRole() == null) user.setRole("user");
    return userRepository.save(user);
}

    // login
    public Optional<User> login(String email, String pw) {
        return userRepository.findByEmailAndPw(email, pw);
    }
}
