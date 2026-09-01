package com.spendwise.report.dto;

import java.math.BigDecimal;

public class MonthlyTrendDto {
    private String month;
    private String yearMonth;
    private BigDecimal totalSpent;
    private Integer transactionCount;
    private BigDecimal averageTransactionAmount;

    public MonthlyTrendDto() {}

    public MonthlyTrendDto(String month, String yearMonth, BigDecimal totalSpent, Integer transactionCount, BigDecimal averageTransactionAmount) {
        this.month = month;
        this.yearMonth = yearMonth;
        this.totalSpent = totalSpent;
        this.transactionCount = transactionCount;
        this.averageTransactionAmount = averageTransactionAmount;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private String month;
        private String yearMonth;
        private BigDecimal totalSpent;
        private Integer transactionCount;
        private BigDecimal averageTransactionAmount;

        public Builder month(String month) { this.month = month; return this; }
        public Builder yearMonth(String yearMonth) { this.yearMonth = yearMonth; return this; }
        public Builder totalSpent(BigDecimal totalSpent) { this.totalSpent = totalSpent; return this; }
        public Builder transactionCount(Integer transactionCount) { this.transactionCount = transactionCount; return this; }
        public Builder averageTransactionAmount(BigDecimal averageTransactionAmount) { this.averageTransactionAmount = averageTransactionAmount; return this; }

        public MonthlyTrendDto build() {
            return new MonthlyTrendDto(month, yearMonth, totalSpent, transactionCount, averageTransactionAmount);
        }
    }

    public String getMonth() { return month; }
    public void setMonth(String month) { this.month = month; }

    public String getYearMonth() { return yearMonth; }
    public void setYearMonth(String yearMonth) { this.yearMonth = yearMonth; }

    public BigDecimal getTotalSpent() { return totalSpent; }
    public void setTotalSpent(BigDecimal totalSpent) { this.totalSpent = totalSpent; }

    public Integer getTransactionCount() { return transactionCount; }
    public void setTransactionCount(Integer transactionCount) { this.transactionCount = transactionCount; }

    public BigDecimal getAverageTransactionAmount() { return averageTransactionAmount; }
    public void setAverageTransactionAmount(BigDecimal averageTransactionAmount) { this.averageTransactionAmount = averageTransactionAmount; }
}
