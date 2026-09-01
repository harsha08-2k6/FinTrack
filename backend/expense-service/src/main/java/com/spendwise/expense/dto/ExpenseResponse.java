package com.spendwise.expense.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class ExpenseResponse {
    private Long id;
    private String title;
    private String description;
    private BigDecimal amount;
    private Long categoryId;
    private CategoryDto category;
    private Long userId;
    private LocalDate expenseDate;
    private String paymentMethod;
    private String receiptUrl;
    private LocalDateTime createdAt;

    public ExpenseResponse() {}

    public ExpenseResponse(Long id, String title, String description, BigDecimal amount, Long categoryId, CategoryDto category, Long userId, LocalDate expenseDate, String paymentMethod, String receiptUrl, LocalDateTime createdAt) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.amount = amount;
        this.categoryId = categoryId;
        this.category = category;
        this.userId = userId;
        this.expenseDate = expenseDate;
        this.paymentMethod = paymentMethod;
        this.receiptUrl = receiptUrl;
        this.createdAt = createdAt;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private Long id;
        private String title;
        private String description;
        private BigDecimal amount;
        private Long categoryId;
        private CategoryDto category;
        private Long userId;
        private LocalDate expenseDate;
        private String paymentMethod;
        private String receiptUrl;
        private LocalDateTime createdAt;

        public Builder id(Long id) { this.id = id; return this; }
        public Builder title(String title) { this.title = title; return this; }
        public Builder description(String description) { this.description = description; return this; }
        public Builder amount(BigDecimal amount) { this.amount = amount; return this; }
        public Builder categoryId(Long categoryId) { this.categoryId = categoryId; return this; }
        public Builder category(CategoryDto category) { this.category = category; return this; }
        public Builder userId(Long userId) { this.userId = userId; return this; }
        public Builder expenseDate(LocalDate expenseDate) { this.expenseDate = expenseDate; return this; }
        public Builder paymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; return this; }
        public Builder receiptUrl(String receiptUrl) { this.receiptUrl = receiptUrl; return this; }
        public Builder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }

        public ExpenseResponse build() {
            return new ExpenseResponse(id, title, description, amount, categoryId, category, userId, expenseDate, paymentMethod, receiptUrl, createdAt);
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }

    public Long getCategoryId() { return categoryId; }
    public void setCategoryId(Long categoryId) { this.categoryId = categoryId; }

    public CategoryDto getCategory() { return category; }
    public void setCategory(CategoryDto category) { this.category = category; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public LocalDate getExpenseDate() { return expenseDate; }
    public void setExpenseDate(LocalDate expenseDate) { this.expenseDate = expenseDate; }

    public String getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }

    public String getReceiptUrl() { return receiptUrl; }
    public void setReceiptUrl(String receiptUrl) { this.receiptUrl = receiptUrl; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
