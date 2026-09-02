package com.spendwise.report.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public class ExpenseDto {
    private Long id;
    private String title;
    private String description;
    private BigDecimal amount;
    private Long categoryId;
    private CategoryDto category;
    private Long userId;
    private LocalDate expenseDate;
    private LocalDate transactionDate;
    private String paymentMethod;
    private String type = "EXPENSE";

    public ExpenseDto() {}

    public ExpenseDto(Long id, String title, String description, BigDecimal amount, Long categoryId, CategoryDto category, Long userId, LocalDate expenseDate, String paymentMethod, String type) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.amount = amount;
        this.categoryId = categoryId;
        this.category = category;
        this.userId = userId;
        this.expenseDate = expenseDate;
        this.transactionDate = expenseDate;
        this.paymentMethod = paymentMethod;
        this.type = type != null ? type : "EXPENSE";
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

    public LocalDate getExpenseDate() { 
        return expenseDate != null ? expenseDate : transactionDate; 
    }
    public void setExpenseDate(LocalDate expenseDate) { 
        this.expenseDate = expenseDate; 
        if (this.transactionDate == null) this.transactionDate = expenseDate;
    }

    public LocalDate getTransactionDate() { return getExpenseDate(); }
    public void setTransactionDate(LocalDate transactionDate) { 
        this.transactionDate = transactionDate; 
        if (this.expenseDate == null) this.expenseDate = transactionDate;
    }

    public String getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }

    public String getType() { return type != null ? type : "EXPENSE"; }
    public void setType(String type) { this.type = type; }
}
