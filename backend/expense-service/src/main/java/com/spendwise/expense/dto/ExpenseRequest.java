package com.spendwise.expense.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;
import java.time.LocalDate;

public class ExpenseRequest {

    @NotBlank(message = "Expense title is required")
    @Size(max = 150, message = "Title cannot exceed 150 characters")
    private String title;

    private String description;

    @NotNull(message = "Amount is required")
    @Positive(message = "Amount must be strictly positive")
    private BigDecimal amount;

    @NotNull(message = "Category ID is required")
    private Long categoryId;

    private Long userId;

    @NotNull(message = "Expense date is required")
    private LocalDate expenseDate;

    private String paymentMethod = "CARD";
    private String receiptUrl;

    public ExpenseRequest() {}

    public ExpenseRequest(String title, String description, BigDecimal amount, Long categoryId, Long userId, LocalDate expenseDate, String paymentMethod, String receiptUrl) {
        this.title = title;
        this.description = description;
        this.amount = amount;
        this.categoryId = categoryId;
        this.userId = userId;
        this.expenseDate = expenseDate;
        this.paymentMethod = paymentMethod != null ? paymentMethod : "CARD";
        this.receiptUrl = receiptUrl;
    }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }

    public Long getCategoryId() { return categoryId; }
    public void setCategoryId(Long categoryId) { this.categoryId = categoryId; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public LocalDate getExpenseDate() { return expenseDate; }
    public void setExpenseDate(LocalDate expenseDate) { this.expenseDate = expenseDate; }

    public String getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }

    public String getReceiptUrl() { return receiptUrl; }
    public void setReceiptUrl(String receiptUrl) { this.receiptUrl = receiptUrl; }
}
