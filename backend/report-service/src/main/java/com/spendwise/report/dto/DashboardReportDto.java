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
    private List<CategoryBreakdownDto> currentMonthCategoryBreakdowns;
    private List<MonthlyTrendDto> monthlyTrends;

    // Income & Savings Pillars
    private BigDecimal totalIncomeAllTime;
    private BigDecimal currentMonthIncome;
    private BigDecimal totalSavings;
    private BigDecimal currentMonthSavings;
    private Double savingsRate;
    private List<MonthlyTrendDto> incomeTrends;
    private List<MonthlyTrendDto> savingsTrends;

    public DashboardReportDto() {}

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

    public List<CategoryBreakdownDto> getCurrentMonthCategoryBreakdowns() { return currentMonthCategoryBreakdowns; }
    public void setCurrentMonthCategoryBreakdowns(List<CategoryBreakdownDto> currentMonthCategoryBreakdowns) { this.currentMonthCategoryBreakdowns = currentMonthCategoryBreakdowns; }

    public List<MonthlyTrendDto> getMonthlyTrends() { return monthlyTrends; }
    public void setMonthlyTrends(List<MonthlyTrendDto> monthlyTrends) { this.monthlyTrends = monthlyTrends; }

    public BigDecimal getTotalIncomeAllTime() { return totalIncomeAllTime; }
    public void setTotalIncomeAllTime(BigDecimal totalIncomeAllTime) { this.totalIncomeAllTime = totalIncomeAllTime; }

    public BigDecimal getCurrentMonthIncome() { return currentMonthIncome; }
    public void setCurrentMonthIncome(BigDecimal currentMonthIncome) { this.currentMonthIncome = currentMonthIncome; }

    public BigDecimal getTotalSavings() { return totalSavings; }
    public void setTotalSavings(BigDecimal totalSavings) { this.totalSavings = totalSavings; }

    public BigDecimal getCurrentMonthSavings() { return currentMonthSavings; }
    public void setCurrentMonthSavings(BigDecimal currentMonthSavings) { this.currentMonthSavings = currentMonthSavings; }

    public Double getSavingsRate() { return savingsRate; }
    public void setSavingsRate(Double savingsRate) { this.savingsRate = savingsRate; }

    public List<MonthlyTrendDto> getIncomeTrends() { return incomeTrends; }
    public void setIncomeTrends(List<MonthlyTrendDto> incomeTrends) { this.incomeTrends = incomeTrends; }

    public List<MonthlyTrendDto> getSavingsTrends() { return savingsTrends; }
    public void setSavingsTrends(List<MonthlyTrendDto> savingsTrends) { this.savingsTrends = savingsTrends; }
}
