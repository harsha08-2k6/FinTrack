package com.spendwise.report.dto;

import java.math.BigDecimal;

public class CategoryBreakdownDto {
    private Long categoryId;
    private String categoryName;
    private String colorCode;
    private String icon;
    private BigDecimal totalAmount;
    private Double percentage;
    private Integer transactionCount;
    private BigDecimal budgetLimit;
    private boolean overBudget;

    public CategoryBreakdownDto() {}

    public CategoryBreakdownDto(Long categoryId, String categoryName, String colorCode, String icon, BigDecimal totalAmount, Double percentage, Integer transactionCount, BigDecimal budgetLimit, boolean overBudget) {
        this.categoryId = categoryId;
        this.categoryName = categoryName;
        this.colorCode = colorCode;
        this.icon = icon;
        this.totalAmount = totalAmount;
        this.percentage = percentage;
        this.transactionCount = transactionCount;
        this.budgetLimit = budgetLimit;
        this.overBudget = overBudget;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private Long categoryId;
        private String categoryName;
        private String colorCode;
        private String icon;
        private BigDecimal totalAmount;
        private Double percentage;
        private Integer transactionCount;
        private BigDecimal budgetLimit;
        private boolean overBudget;

        public Builder categoryId(Long categoryId) { this.categoryId = categoryId; return this; }
        public Builder categoryName(String categoryName) { this.categoryName = categoryName; return this; }
        public Builder colorCode(String colorCode) { this.colorCode = colorCode; return this; }
        public Builder icon(String icon) { this.icon = icon; return this; }
        public Builder totalAmount(BigDecimal totalAmount) { this.totalAmount = totalAmount; return this; }
        public Builder percentage(Double percentage) { this.percentage = percentage; return this; }
        public Builder transactionCount(Integer transactionCount) { this.transactionCount = transactionCount; return this; }
        public Builder budgetLimit(BigDecimal budgetLimit) { this.budgetLimit = budgetLimit; return this; }
        public Builder overBudget(boolean overBudget) { this.overBudget = overBudget; return this; }

        public CategoryBreakdownDto build() {
            return new CategoryBreakdownDto(categoryId, categoryName, colorCode, icon, totalAmount, percentage, transactionCount, budgetLimit, overBudget);
        }
    }

    public Long getCategoryId() { return categoryId; }
    public void setCategoryId(Long categoryId) { this.categoryId = categoryId; }

    public String getCategoryName() { return categoryName; }
    public void setCategoryName(String categoryName) { this.categoryName = categoryName; }

    public String getColorCode() { return colorCode; }
    public void setColorCode(String colorCode) { this.colorCode = colorCode; }

    public String getIcon() { return icon; }
    public void setIcon(String icon) { this.icon = icon; }

    public BigDecimal getTotalAmount() { return totalAmount; }
    public void setTotalAmount(BigDecimal totalAmount) { this.totalAmount = totalAmount; }

    public Double getPercentage() { return percentage; }
    public void setPercentage(Double percentage) { this.percentage = percentage; }

    public Integer getTransactionCount() { return transactionCount; }
    public void setTransactionCount(Integer transactionCount) { this.transactionCount = transactionCount; }

    public BigDecimal getBudgetLimit() { return budgetLimit; }
    public void setBudgetLimit(BigDecimal budgetLimit) { this.budgetLimit = budgetLimit; }

    public boolean isOverBudget() { return overBudget; }
    public void setOverBudget(boolean overBudget) { this.overBudget = overBudget; }
}
