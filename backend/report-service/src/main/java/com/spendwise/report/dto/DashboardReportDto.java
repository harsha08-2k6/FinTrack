package com.spendwise.report.dto;

import java.math.BigDecimal;
import java.util.List;

public class DashboardReportDto {
    private BigDecimal totalSpendAllTime;
    private BigDecimal currentMonthSpend;
    private BigDecimal previousMonthSpend;
    private Double monthOverMonthChangePercentage;
    private Integer totalTransactions;
    private BigDecimal averageDailySpend;
    private String topSpendingCategory;
    private BigDecimal topSpendingCategoryAmount;
    private List<CategoryBreakdownDto> categoryBreakdowns;
    private List<MonthlyTrendDto> monthlyTrends;

    public DashboardReportDto() {}

    public DashboardReportDto(BigDecimal totalSpendAllTime, BigDecimal currentMonthSpend, BigDecimal previousMonthSpend, Double monthOverMonthChangePercentage, Integer totalTransactions, BigDecimal averageDailySpend, String topSpendingCategory, BigDecimal topSpendingCategoryAmount, List<CategoryBreakdownDto> categoryBreakdowns, List<MonthlyTrendDto> monthlyTrends) {
        this.totalSpendAllTime = totalSpendAllTime;
        this.currentMonthSpend = currentMonthSpend;
        this.previousMonthSpend = previousMonthSpend;
        this.monthOverMonthChangePercentage = monthOverMonthChangePercentage;
        this.totalTransactions = totalTransactions;
        this.averageDailySpend = averageDailySpend;
        this.topSpendingCategory = topSpendingCategory;
        this.topSpendingCategoryAmount = topSpendingCategoryAmount;
        this.categoryBreakdowns = categoryBreakdowns;
        this.monthlyTrends = monthlyTrends;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private BigDecimal totalSpendAllTime;
        private BigDecimal currentMonthSpend;
        private BigDecimal previousMonthSpend;
        private Double monthOverMonthChangePercentage;
        private Integer totalTransactions;
        private BigDecimal averageDailySpend;
        private String topSpendingCategory;
        private BigDecimal topSpendingCategoryAmount;
        private List<CategoryBreakdownDto> categoryBreakdowns;
        private List<MonthlyTrendDto> monthlyTrends;

        public Builder totalSpendAllTime(BigDecimal totalSpendAllTime) { this.totalSpendAllTime = totalSpendAllTime; return this; }
        public Builder currentMonthSpend(BigDecimal currentMonthSpend) { this.currentMonthSpend = currentMonthSpend; return this; }
        public Builder previousMonthSpend(BigDecimal previousMonthSpend) { this.previousMonthSpend = previousMonthSpend; return this; }
        public Builder monthOverMonthChangePercentage(Double monthOverMonthChangePercentage) { this.monthOverMonthChangePercentage = monthOverMonthChangePercentage; return this; }
        public Builder totalTransactions(Integer totalTransactions) { this.totalTransactions = totalTransactions; return this; }
        public Builder averageDailySpend(BigDecimal averageDailySpend) { this.averageDailySpend = averageDailySpend; return this; }
        public Builder topSpendingCategory(String topSpendingCategory) { this.topSpendingCategory = topSpendingCategory; return this; }
        public Builder topSpendingCategoryAmount(BigDecimal topSpendingCategoryAmount) { this.topSpendingCategoryAmount = topSpendingCategoryAmount; return this; }
        public Builder categoryBreakdowns(List<CategoryBreakdownDto> categoryBreakdowns) { this.categoryBreakdowns = categoryBreakdowns; return this; }
        public Builder monthlyTrends(List<MonthlyTrendDto> monthlyTrends) { this.monthlyTrends = monthlyTrends; return this; }

        public DashboardReportDto build() {
            return new DashboardReportDto(totalSpendAllTime, currentMonthSpend, previousMonthSpend, monthOverMonthChangePercentage, totalTransactions, averageDailySpend, topSpendingCategory, topSpendingCategoryAmount, categoryBreakdowns, monthlyTrends);
        }
    }

    public BigDecimal getTotalSpendAllTime() { return totalSpendAllTime; }
    public void setTotalSpendAllTime(BigDecimal totalSpendAllTime) { this.totalSpendAllTime = totalSpendAllTime; }

    public BigDecimal getCurrentMonthSpend() { return currentMonthSpend; }
    public void setCurrentMonthSpend(BigDecimal currentMonthSpend) { this.currentMonthSpend = currentMonthSpend; }

    public BigDecimal getPreviousMonthSpend() { return previousMonthSpend; }
    public void setPreviousMonthSpend(BigDecimal previousMonthSpend) { this.previousMonthSpend = previousMonthSpend; }

    public Double getMonthOverMonthChangePercentage() { return monthOverMonthChangePercentage; }
    public void setMonthOverMonthChangePercentage(Double monthOverMonthChangePercentage) { this.monthOverMonthChangePercentage = monthOverMonthChangePercentage; }

    public Integer getTotalTransactions() { return totalTransactions; }
    public void setTotalTransactions(Integer totalTransactions) { this.totalTransactions = totalTransactions; }

    public BigDecimal getAverageDailySpend() { return averageDailySpend; }
    public void setAverageDailySpend(BigDecimal averageDailySpend) { this.averageDailySpend = averageDailySpend; }

    public String getTopSpendingCategory() { return topSpendingCategory; }
    public void setTopSpendingCategory(String topSpendingCategory) { this.topSpendingCategory = topSpendingCategory; }

    public BigDecimal getTopSpendingCategoryAmount() { return topSpendingCategoryAmount; }
    public void setTopSpendingCategoryAmount(BigDecimal topSpendingCategoryAmount) { this.topSpendingCategoryAmount = topSpendingCategoryAmount; }

    public List<CategoryBreakdownDto> getCategoryBreakdowns() { return categoryBreakdowns; }
    public void setCategoryBreakdowns(List<CategoryBreakdownDto> categoryBreakdowns) { this.categoryBreakdowns = categoryBreakdowns; }

    public List<MonthlyTrendDto> getMonthlyTrends() { return monthlyTrends; }
    public void setMonthlyTrends(List<MonthlyTrendDto> monthlyTrends) { this.monthlyTrends = monthlyTrends; }
}
