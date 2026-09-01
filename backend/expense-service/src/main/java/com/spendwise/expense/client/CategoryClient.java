package com.spendwise.expense.client;

import com.spendwise.expense.dto.CategoryDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;

@FeignClient(name = "category-service")
public interface CategoryClient {

    @GetMapping("/api/categories/{id}")
    CategoryDto getCategoryById(@PathVariable("id") Long id);

    @GetMapping("/api/categories")
    List<CategoryDto> getAllCategories();
}
