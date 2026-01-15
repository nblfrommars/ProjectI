package com.example.demo.service;

import com.example.demo.model.Category;
import com.example.demo.model.Product;
import com.example.demo.model.ProductVariant;
import com.example.demo.repository.CategoryRepository;
import com.example.demo.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private FileStorageService fileStorageService;

    public List<Product> getAll() {
        return productRepository.findAll();
    }

    public Product getById(Integer id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Sản phẩm không tồn tại: " + id));
    }

    @Transactional
    public Product save(Product product, MultipartFile imageFile) {
        if (product.getCategory() == null || product.getCategory().getCategoryId() == null) {
            throw new RuntimeException("Phải cung cấp ID danh mục");
        }
        Category cat = categoryRepository.findById(product.getCategory().getCategoryId())
                .orElseThrow(() -> new RuntimeException("Danh mục không hợp lệ"));
        product.setCategory(cat);

        if (imageFile != null && !imageFile.isEmpty()) {
            String fileName = fileStorageService.storeFile(imageFile);
            product.setImageUrl("/uploads/" + fileName);
        }

        if (product.getVariants() != null) {
            for (ProductVariant variant : product.getVariants()) {
                variant.setProduct(product);
            }
        }

        return productRepository.save(product);
    }

    @Transactional
    public Product update(Integer id, Product details, MultipartFile imageFile) {
        Product p = getById(id);
        
        p.setProductName(details.getProductName());
        p.setPrice(details.getPrice());
        p.setDes(details.getDes());
        
        if (details.getVariants() != null) {
            p.getVariants().clear(); 
            for (ProductVariant v : details.getVariants()) {
                v.setProduct(p);
                p.getVariants().add(v);
            }
        }

        if (details.getCategory() != null && details.getCategory().getCategoryId() != null) {
            Category cat = categoryRepository.findById(details.getCategory().getCategoryId())
                    .orElseThrow(() -> new RuntimeException("Danh mục không hợp lệ"));
            p.setCategory(cat);
        }

        if (imageFile != null && !imageFile.isEmpty()) {
            String fileName = fileStorageService.storeFile(imageFile);
            p.setImageUrl("/uploads/" + fileName);
        } else if (details.getImageUrl() != null) {
            p.setImageUrl(details.getImageUrl());
        }

        return productRepository.save(p);
    }

    public void delete(Integer id) {
        productRepository.deleteById(id);
    }
}