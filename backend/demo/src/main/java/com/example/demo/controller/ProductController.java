package com.example.demo.controller;

import com.example.demo.model.Product;
import com.example.demo.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "*")
public class ProductController {

    @Autowired
    private ProductService productService;

    @GetMapping
    public List<Product> list() {
        return productService.getAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Product> detail(@PathVariable Integer id) {
        return ResponseEntity.ok(productService.getById(id));
    }

     @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public Product add(
            @RequestPart("product") Product product, 
            @RequestPart("image") MultipartFile image) {
        return productService.save(product, image);
    }

    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public Product edit(
            @PathVariable Integer id, 
            @RequestPart("product") Product product,
            @RequestPart(value = "image", required = false) MultipartFile image) {
        return productService.update(id, product, image);
    }

    @DeleteMapping("/{id}")
    public String delete(@PathVariable Integer id) {
        productService.delete(id);
        return "Xóa thành công!";
    }
}