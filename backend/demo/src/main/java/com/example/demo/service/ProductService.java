package com.example.demo.service;

import com.example.demo.model.Product;
import com.example.demo.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ProductService {
    @Autowired
    private ProductRepository productRepository;

    public List<Product> getAll() { return productRepository.findAll(); }

    public List<Product> getByCategoryId(Integer categoryId) {
        return productRepository.findByCategory_CategoryID(categoryId);
    }

    public Product getById(Integer id) { return productRepository.findById(id).orElse(null); }

    public Product save(Product product) { return productRepository.save(product); }

    public void delete(Integer id) { productRepository.deleteById(id); }
}