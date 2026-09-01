package com.spendwise.expense.dto;

import java.math.BigDecimal;
import java.util.Map;

public class ExpenseSummaryDto {
    private BigDecimal totalSpendAllTime;
    private BigDecimal totalSpendCurrentMonth;
    private long totalTransactions;
    private Map<String, BigDecimal> spendByCategory;

    public ExpenseSummaryDto() {}

    public ExpenseSummaryDto(BigDecimal totalSpendAllTime, BigDecimal totalSpendCurrentMonth, long totalTransactions, Map<String, BigDecimal> spendByCategory) {
        this.totalSpendAllTime = totalSpendAllTime;
        this.totalSpendCurrentMonth = totalSpendCurrentMonth;
        this.totalTransactions = totalTransactions;
        this.spendByCategory = spendByCategory;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private BigDecimal totalSpendAllTime;
        private BigDecimal totalSpendCurrentMonth;
        private long totalTransactions;
        private Map<String, BigDecimal> spendByCategory;

        public Builder totalSpendAllTime(BigDecimal totalSpendAllTime) { this.totalSpendAllTime = totalSpendAllTime; return this; }
        public Builder totalSpendCurrentMonth(BigDecimal totalSpendCurrentMonth) { this.totalSpendCurrentMonth = totalSpendCurrentMonth; return this; }
        public Builder totalTransactions(long totalTransactions) { this.totalTransactions = totalTransactions; return this; }
        public Builder spendByCategory(Map<String, BigDecimal> spendByCategory) { this.spendByCategory = spendByCategory; return this; }

        public ExpenseSummaryDto build() {
            return new ExpenseSummaryDto(totalSpendAllTime, totalSpendCurrentMonth, totalTransactions, spendByCategory);
        }
    }

    public BigDecimal getTotalSpendAllTime() { return totalSpendAllTime; }
    public void setTotalSpendAllTime(BigDecimal totalSpendAllTime) { this.totalSpendAllTime = totalSpendAllTime; }

    public BigDecimal getTotalSpendCurrentMonth() { return totalSpendCurrentMonth; }
    public void setTotalSpendCurrentMonth(BigDecimal totalSpendCurrentMonth) { this.totalSpendCurrentMonth = totalSpendCurrentMonth; }

    public long getTotalTransactions() { return totalTransactions; }
    public void setTotalTransactions(long totalTransactions) { this.totalTransactions = totalTransactions; }

    public Map<String, BigDecimal> getSpendByCategory() { return spendByCategory; }
    public void setSpendByCategory(Map<String, BigDecimal> spendByCategory) { this.spendByCategory = spendByCategory; }
}
