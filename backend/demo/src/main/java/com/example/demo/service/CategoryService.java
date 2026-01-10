package com.example.demo.service;

import com.example.demo.model.Category;
import com.example.demo.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.List;
import org.springframework.stereotype.Service;
@Service
public class CategoryService {
    @Autowired
    private CategoryRepository categoryRepository;
    public List<Category> getAll() { return categoryRepository.findAll(); }
    public Category getById(Integer id) { return categoryRepository.findById(id).orElse(null); }
    public Category save(Category category) { return categoryRepository.save(category); }
    public void delete(Integer id) { categoryRepository.deleteById(id); }
}
