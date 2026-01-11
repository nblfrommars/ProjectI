package com.example.demo.service;

import com.example.demo.model.Category;
import com.example.demo.model.Product;
import com.example.demo.repository.CategoryRepository;
import com.example.demo.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    public List<Product> getAll() {
        return productRepository.findAll();
    }

    public Product getById(Integer id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Sản phẩm không tồn tại: " + id));
    }

    public Product save(Product product) {
        if (product.getCategory() == null || product.getCategory().getCategoryId() == null) {
            throw new RuntimeException("Phải cung cấp ID danh mục");
        }
        Category cat = categoryRepository.findById(product.getCategory().getCategoryId())
                .orElseThrow(() -> new RuntimeException("Danh mục không hợp lệ"));
        product.setCategory(cat);
        return productRepository.save(product);
    }

    public Product update(Integer id, Product details) {
        Product p = getById(id);
        p.setProductName(details.getProductName());
        p.setPrice(details.getPrice());
        p.setDes(details.getDes());
        p.setImageUrl(details.getImageUrl());
        p.setStock(details.getStock());
        
        if (details.getCategory() != null && details.getCategory().getCategoryId() != null) {
            Category cat = categoryRepository.findById(details.getCategory().getCategoryId())
                    .orElseThrow(() -> new RuntimeException("Danh mục không hợp lệ"));
            p.setCategory(cat);
        }
        return productRepository.save(p);
    }

    public void delete(Integer id) {
        productRepository.deleteById(id);
    }
}