package com.example.demo.controller;

import com.example.demo.model.Product;
import com.example.demo.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/products")
@CrossOrigin("*")
public class ProductController {
    @Autowired
    private ProductService productService;

    @GetMapping
    public List<Product> getAll() { return productService.getAll(); }

    @GetMapping("/category/{categoryId}")
    public List<Product> getByCategory(@PathVariable Integer categoryId) {
        return productService.getByCategoryId(categoryId);
    }

    @GetMapping("/{id}")
    public Product getById(@PathVariable Integer id) { return productService.getById(id); }

    @PostMapping
    public Product add(@RequestBody Product product) {
        return productService.save(product);
    }

    @PutMapping("/{id}")
    public Product update(@PathVariable Integer id, @RequestBody Product product) {
        Product existing = productService.getById(id);
        if (existing != null) {
            existing.setProductName(product.getProductName());
            existing.setPrice(product.getPrice());
            existing.setDes(product.getDes());
            existing.setStock(product.getStock());
            existing.setImageUrl(product.getImageUrl());
            existing.setCategory(product.getCategory());
            return productService.save(existing);
        }
        return null;
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Integer id) { productService.delete(id); }
}