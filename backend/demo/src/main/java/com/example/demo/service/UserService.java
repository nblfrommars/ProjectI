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

    public Optional<User> login(String email, String pw) {
        Optional<User> user = userRepository.findByEmail(email);
        if(user.isPresent() && user.get().getPw().equals(pw)) {
            return user;
        }
        return Optional.empty();
    }
}

