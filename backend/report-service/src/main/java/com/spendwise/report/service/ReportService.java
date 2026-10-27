package com.spendwise.report.service;

import com.spendwise.report.client.ExpenseClient;
import com.spendwise.report.dto.*;
import com.spendwise.report.entity.BudgetAlert;
import com.spendwise.report.repository.BudgetAlertRepository;
import com.spendwise.report.repository.MonthlySummaryRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class ReportService {

    private static final Logger log = LoggerFactory.getLogger(ReportService.class);

    private final ExpenseClient expenseClient;
    private final MonthlySummaryRepository monthlySummaryRepository;
    private final BudgetAlertRepository budgetAlertRepository;

    public ReportService(ExpenseClient expenseClient, MonthlySummaryRepository monthlySummaryRepository, BudgetAlertRepository budgetAlertRepository) {
        this.expenseClient = expenseClient;
        this.monthlySummaryRepository = monthlySummaryRepository;
        this.budgetAlertRepository = budgetAlertRepository;
    }

    public DashboardReportDto getDashboardReport(Long userId) {
        List<ExpenseDto> allTransactions = fetchExpensesForUser(userId);

        // Separate Income and Expenses
        List<ExpenseDto> expenses = allTransactions.stream()
                .filter(t -> !"INCOME".equalsIgnoreCase(t.getType()))
                .collect(Collectors.toList());

        List<ExpenseDto> incomeList = allTransactions.stream()
                .filter(t -> "INCOME".equalsIgnoreCase(t.getType()))
                .collect(Collectors.toList());

        BigDecimal totalSpendAllTime = expenses.stream()
                .map(ExpenseDto::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal totalIncomeAllTime = incomeList.stream()
                .map(ExpenseDto::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        YearMonth currentYearMonth = YearMonth.now();
        YearMonth prevYearMonth = currentYearMonth.minusMonths(1);

        List<ExpenseDto> currentMonthExpenses = expenses.stream()
                .filter(e -> e.getExpenseDate() != null && YearMonth.from(e.getExpenseDate()).equals(currentYearMonth))
                .collect(Collectors.toList());

        List<ExpenseDto> prevMonthExpenses = expenses.stream()
                .filter(e -> e.getExpenseDate() != null && YearMonth.from(e.getExpenseDate()).equals(prevYearMonth))
                .collect(Collectors.toList());

        List<ExpenseDto> currentMonthIncomeList = incomeList.stream()
                .filter(e -> e.getExpenseDate() != null && YearMonth.from(e.getExpenseDate()).equals(currentYearMonth))
                .collect(Collectors.toList());

        BigDecimal currentMonthSpend = currentMonthExpenses.stream()
                .map(ExpenseDto::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal prevMonthSpend = prevMonthExpenses.stream()
                .map(ExpenseDto::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal currentMonthIncome = currentMonthIncomeList.stream()
                .map(ExpenseDto::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // Calculate Savings & Savings Rate
        BigDecimal totalSavings = totalIncomeAllTime.subtract(totalSpendAllTime);
        BigDecimal currentMonthSavings = currentMonthIncome.subtract(currentMonthSpend);

        Double savingsRate = 0.0;
        if (currentMonthIncome.compareTo(BigDecimal.ZERO) > 0) {
            savingsRate = currentMonthSavings.divide(currentMonthIncome, 4, RoundingMode.HALF_UP)
                    .multiply(BigDecimal.valueOf(100))
                    .doubleValue();
        } else if (totalIncomeAllTime.compareTo(BigDecimal.ZERO) > 0) {
            savingsRate = totalSavings.divide(totalIncomeAllTime, 4, RoundingMode.HALF_UP)
                    .multiply(BigDecimal.valueOf(100))
                    .doubleValue();
        }

        Double momChange = 0.0;
        if (prevMonthSpend.compareTo(BigDecimal.ZERO) > 0) {
            momChange = currentMonthSpend.subtract(prevMonthSpend)
                    .divide(prevMonthSpend, 4, RoundingMode.HALF_UP)
                    .multiply(BigDecimal.valueOf(100))
                    .doubleValue();
        }

        int daysInMonth = LocalDate.now().getDayOfMonth();
        BigDecimal avgDailySpend = daysInMonth > 0
                ? currentMonthSpend.divide(BigDecimal.valueOf(daysInMonth), 2, RoundingMode.HALF_UP)
                : BigDecimal.ZERO;

        List<CategoryBreakdownDto> categoryBreakdowns = calculateCategoryBreakdown(expenses);
        List<CategoryBreakdownDto> currentMonthCategoryBreakdowns = calculateCategoryBreakdown(currentMonthExpenses);
        List<MonthlyTrendDto> monthlyTrends = calculateMonthlyTrends(expenses);
        List<MonthlyTrendDto> incomeTrends = calculateMonthlyTrends(incomeList);

        String topCatName = "None";
        BigDecimal topCatAmount = BigDecimal.ZERO;
        if (!currentMonthCategoryBreakdowns.isEmpty()) {
            CategoryBreakdownDto top = currentMonthCategoryBreakdowns.get(0);
            topCatName = top.getCategoryName();
            topCatAmount = top.getTotalAmount();
        } else if (!categoryBreakdowns.isEmpty()) {
            CategoryBreakdownDto top = categoryBreakdowns.get(0);
            topCatName = top.getCategoryName();
            topCatAmount = top.getTotalAmount();
        }

        DashboardReportDto report = new DashboardReportDto();
        report.setTotalSpendAllTime(totalSpendAllTime);
        report.setCurrentMonthSpend(currentMonthSpend);
        report.setPreviousMonthSpend(prevMonthSpend);
        report.setMonthOverMonthChangePercentage(momChange);
        report.setTotalTransactions(allTransactions.size());
        report.setAverageDailySpend(avgDailySpend);
        report.setTopSpendingCategory(topCatName);
        report.setTopSpendingCategoryAmount(topCatAmount);
        report.setCategoryBreakdowns(categoryBreakdowns);
        report.setCurrentMonthCategoryBreakdowns(currentMonthCategoryBreakdowns);
        report.setMonthlyTrends(monthlyTrends);

        report.setTotalIncomeAllTime(totalIncomeAllTime);
        report.setCurrentMonthIncome(currentMonthIncome);
        report.setTotalSavings(totalSavings);
        report.setCurrentMonthSavings(currentMonthSavings);
        report.setSavingsRate(savingsRate);
        report.setIncomeTrends(incomeTrends);

        return report;
    }

    public List<CategoryBreakdownDto> getCategoryBreakdown(Long userId) {
        return getCategoryBreakdown(userId, null);
    }

    public List<CategoryBreakdownDto> getCategoryBreakdown(Long userId, String yearMonthStr) {
        List<ExpenseDto> transactions = fetchExpensesForUser(userId);
        List<ExpenseDto> expenses = transactions.stream()
                .filter(t -> !"INCOME".equalsIgnoreCase(t.getType()))
                .collect(Collectors.toList());

        if (yearMonthStr != null && !yearMonthStr.trim().isEmpty()) {
            try {
                YearMonth targetYm = YearMonth.parse(yearMonthStr.trim());
                expenses = expenses.stream()
                        .filter(e -> e.getExpenseDate() != null && YearMonth.from(e.getExpenseDate()).equals(targetYm))
                        .collect(Collectors.toList());
            } catch (Exception ignored) {
                // If invalid yearMonth provided, fall back to unfiltered
            }
        }

        return calculateCategoryBreakdown(expenses);
    }

    public List<MonthlyTrendDto> getMonthlyTrends(Long userId) {
        List<ExpenseDto> transactions = fetchExpensesForUser(userId);
        List<ExpenseDto> expenses = transactions.stream()
                .filter(t -> !"INCOME".equalsIgnoreCase(t.getType()))
                .collect(Collectors.toList());
        return calculateMonthlyTrends(expenses);
    }

    public List<BudgetAlert> getBudgetAlerts(Long userId) {
        List<CategoryBreakdownDto> breakdowns = getCategoryBreakdown(userId);
        List<BudgetAlert> alerts = new ArrayList<>();

        for (CategoryBreakdownDto b : breakdowns) {
            BigDecimal limit = b.getBudgetLimit();
            BigDecimal spent = b.getTotalAmount();

            if (limit != null && limit.compareTo(BigDecimal.ZERO) > 0) {
                if (b.isOverBudget()) {
                    alerts.add(BudgetAlert.builder()
                            .userId(userId)
                            .alertType("CRITICAL")
                            .title("Budget Exceeded: " + b.getCategoryName())
                            .message(String.format("You have exceeded your budget for %s by ₹%.2f (%.1f%% used).",
                                    b.getCategoryName(),
                                    spent.subtract(limit).doubleValue(),
                                    b.getPercentage()))
                            .build());
                } else if (b.getPercentage() >= 80.0) {
                    alerts.add(BudgetAlert.builder()
                            .userId(userId)
                            .alertType("WARNING")
                            .title("Approaching Budget: " + b.getCategoryName())
                            .message(String.format("You have used %.1f%% of your %s budget (₹%.2f remaining).",
                                    b.getPercentage(),
                                    b.getCategoryName(),
                                    limit.subtract(spent).doubleValue()))
                            .build());
                }
            }
        }
        return alerts;
    }

    private List<ExpenseDto> fetchExpensesForUser(Long userId) {
        try {
            List<ExpenseDto> result = expenseClient.getAllExpenses(userId, null, null);
            return result != null ? result : Collections.emptyList();
        } catch (Exception e) {
            log.error("Failed to fetch transactions from transaction-service: {}", e.getMessage());
            return Collections.emptyList();
        }
    }

    private List<CategoryBreakdownDto> calculateCategoryBreakdown(List<ExpenseDto> expenses) {
        if (expenses.isEmpty()) {
            return Collections.emptyList();
        }

        BigDecimal totalSpend = expenses.stream()
                .map(ExpenseDto::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        Map<Long, List<ExpenseDto>> byCategory = expenses.stream()
                .filter(e -> e.getCategoryId() != null)
                .collect(Collectors.groupingBy(ExpenseDto::getCategoryId));

        List<CategoryBreakdownDto> list = new ArrayList<>();

        for (Map.Entry<Long, List<ExpenseDto>> entry : byCategory.entrySet()) {
            Long catId = entry.getKey();
            List<ExpenseDto> catExpenses = entry.getValue();

            BigDecimal catTotal = catExpenses.stream()
                    .map(ExpenseDto::getAmount)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);

            String catName = "Unknown";
            String colorCode = "#64748b";
            BigDecimal budgetLimit = BigDecimal.ZERO;

            if (!catExpenses.isEmpty() && catExpenses.get(0).getCategory() != null) {
                CategoryDto cat = catExpenses.get(0).getCategory();
                catName = cat.getName();
                colorCode = cat.getColorCode() != null ? cat.getColorCode() : "#64748b";
                budgetLimit = cat.getBudgetLimit() != null ? cat.getBudgetLimit() : BigDecimal.ZERO;
            }

            // Calculate percentage based on budget limit if defined, otherwise based on total spend
            double percentage = 0.0;
            if (budgetLimit.compareTo(BigDecimal.ZERO) > 0) {
                percentage = catTotal.divide(budgetLimit, 4, RoundingMode.HALF_UP).multiply(BigDecimal.valueOf(100)).doubleValue();
            } else if (totalSpend.compareTo(BigDecimal.ZERO) > 0) {
                percentage = catTotal.divide(totalSpend, 4, RoundingMode.HALF_UP).multiply(BigDecimal.valueOf(100)).doubleValue();
            }

            boolean overBudget = budgetLimit.compareTo(BigDecimal.ZERO) > 0 && catTotal.compareTo(budgetLimit) > 0;

            list.add(CategoryBreakdownDto.builder()
                    .categoryId(catId)
                    .categoryName(catName)
                    .colorCode(colorCode)
                    .totalAmount(catTotal)
                    .percentage(percentage)
                    .budgetLimit(budgetLimit)
                    .overBudget(overBudget)
                    .transactionCount(catExpenses.size())
                    .build());
        }

        list.sort((a, b) -> b.getTotalAmount().compareTo(a.getTotalAmount()));
        return list;
    }

    private List<MonthlyTrendDto> calculateMonthlyTrends(List<ExpenseDto> expenses) {
        if (expenses.isEmpty()) {
            return Collections.emptyList();
        }

        DateTimeFormatter ymFormatter = DateTimeFormatter.ofPattern("yyyy-MM");
        DateTimeFormatter monthNameFormatter = DateTimeFormatter.ofPattern("MMMM yyyy");

        Map<String, List<ExpenseDto>> byMonth = expenses.stream()
                .filter(e -> e.getExpenseDate() != null)
                .collect(Collectors.groupingBy(e -> e.getExpenseDate().format(ymFormatter)));

        List<MonthlyTrendDto> trends = new ArrayList<>();

        for (Map.Entry<String, List<ExpenseDto>> entry : byMonth.entrySet()) {
            String yearMonthStr = entry.getKey();
            List<ExpenseDto> monthExpenses = entry.getValue();

            BigDecimal total = monthExpenses.stream()
                    .map(ExpenseDto::getAmount)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);

            YearMonth ym = YearMonth.parse(yearMonthStr);
            String displayMonth = ym.format(monthNameFormatter);

            trends.add(MonthlyTrendDto.builder()
                    .yearMonth(yearMonthStr)
                    .month(displayMonth)
                    .totalSpent(total)
                    .transactionCount(monthExpenses.size())
                    .build());
        }

        trends.sort(Comparator.comparing(MonthlyTrendDto::getYearMonth));
        return trends;
    }
}
