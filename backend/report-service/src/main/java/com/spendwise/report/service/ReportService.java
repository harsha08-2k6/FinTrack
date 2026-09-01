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
        List<ExpenseDto> expenses = fetchExpensesForUser(userId);

        BigDecimal totalSpendAllTime = expenses.stream()
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

        BigDecimal currentMonthSpend = currentMonthExpenses.stream()
                .map(ExpenseDto::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal prevMonthSpend = prevMonthExpenses.stream()
                .map(ExpenseDto::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

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
        List<MonthlyTrendDto> monthlyTrends = calculateMonthlyTrends(expenses);

        String topCatName = "None";
        BigDecimal topCatAmount = BigDecimal.ZERO;
        if (!categoryBreakdowns.isEmpty()) {
            CategoryBreakdownDto top = categoryBreakdowns.get(0);
            topCatName = top.getCategoryName();
            topCatAmount = top.getTotalAmount();
        }

        return DashboardReportDto.builder()
                .totalSpendAllTime(totalSpendAllTime)
                .currentMonthSpend(currentMonthSpend)
                .previousMonthSpend(prevMonthSpend)
                .monthOverMonthChangePercentage(momChange)
                .totalTransactions(expenses.size())
                .averageDailySpend(avgDailySpend)
                .topSpendingCategory(topCatName)
                .topSpendingCategoryAmount(topCatAmount)
                .categoryBreakdowns(categoryBreakdowns)
                .monthlyTrends(monthlyTrends)
                .build();
    }

    public List<CategoryBreakdownDto> getCategoryBreakdown(Long userId) {
        List<ExpenseDto> expenses = fetchExpensesForUser(userId);
        return calculateCategoryBreakdown(expenses);
    }

    public List<MonthlyTrendDto> getMonthlyTrends(Long userId) {
        List<ExpenseDto> expenses = fetchExpensesForUser(userId);
        return calculateMonthlyTrends(expenses);
    }

    public List<BudgetAlert> getBudgetAlerts(Long userId) {
        return budgetAlertRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    private List<CategoryBreakdownDto> calculateCategoryBreakdown(List<ExpenseDto> expenses) {
        if (expenses.isEmpty()) {
            return Collections.emptyList();
        }

        BigDecimal totalSpend = expenses.stream()
                .map(ExpenseDto::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        Map<Long, List<ExpenseDto>> grouped = expenses.stream()
                .collect(Collectors.groupingBy(ExpenseDto::getCategoryId));

        List<CategoryBreakdownDto> result = new ArrayList<>();

        for (Map.Entry<Long, List<ExpenseDto>> entry : grouped.entrySet()) {
            List<ExpenseDto> catExpenses = entry.getValue();
            ExpenseDto sample = catExpenses.get(0);

            BigDecimal sum = catExpenses.stream()
                    .map(ExpenseDto::getAmount)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);

            double percentage = 0.0;
            if (totalSpend.compareTo(BigDecimal.ZERO) > 0) {
                percentage = sum.divide(totalSpend, 4, RoundingMode.HALF_UP)
                        .multiply(BigDecimal.valueOf(100))
                        .doubleValue();
            }

            String catName = sample.getCategory() != null ? sample.getCategory().getName() : "Category " + entry.getKey();
            String color = sample.getCategory() != null && sample.getCategory().getColorCode() != null ? sample.getCategory().getColorCode() : "#6366f1";
            String icon = sample.getCategory() != null && sample.getCategory().getIcon() != null ? sample.getCategory().getIcon() : "tag";
            BigDecimal budget = sample.getCategory() != null && sample.getCategory().getBudgetLimit() != null ? sample.getCategory().getBudgetLimit() : BigDecimal.ZERO;

            boolean overBudget = budget.compareTo(BigDecimal.ZERO) > 0 && sum.compareTo(budget) > 0;

            result.add(CategoryBreakdownDto.builder()
                    .categoryId(entry.getKey())
                    .categoryName(catName)
                    .colorCode(color)
                    .icon(icon)
                    .totalAmount(sum)
                    .percentage(percentage)
                    .transactionCount(catExpenses.size())
                    .budgetLimit(budget)
                    .overBudget(overBudget)
                    .build());
        }

        result.sort((a, b) -> b.getTotalAmount().compareTo(a.getTotalAmount()));
        return result;
    }

    private List<MonthlyTrendDto> calculateMonthlyTrends(List<ExpenseDto> expenses) {
        Map<YearMonth, List<ExpenseDto>> monthMap = expenses.stream()
                .filter(e -> e.getExpenseDate() != null)
                .collect(Collectors.groupingBy(e -> YearMonth.from(e.getExpenseDate())));

        DateTimeFormatter displayFormatter = DateTimeFormatter.ofPattern("MMM yyyy");
        DateTimeFormatter ymFormatter = DateTimeFormatter.ofPattern("yyyy-MM");

        List<MonthlyTrendDto> trends = new ArrayList<>();

        monthMap.entrySet().stream()
                .sorted(Map.Entry.comparingByKey())
                .forEach(entry -> {
                    YearMonth ym = entry.getKey();
                    List<ExpenseDto> list = entry.getValue();

                    BigDecimal total = list.stream()
                            .map(ExpenseDto::getAmount)
                            .reduce(BigDecimal.ZERO, BigDecimal::add);

                    BigDecimal avg = !list.isEmpty()
                            ? total.divide(BigDecimal.valueOf(list.size()), 2, RoundingMode.HALF_UP)
                            : BigDecimal.ZERO;

                    trends.add(MonthlyTrendDto.builder()
                            .month(ym.format(displayFormatter))
                            .yearMonth(ym.format(ymFormatter))
                            .totalSpent(total)
                            .transactionCount(list.size())
                            .averageTransactionAmount(avg)
                            .build());
                });

        return trends;
    }

    private List<ExpenseDto> fetchExpensesForUser(Long userId) {
        try {
            List<ExpenseDto> expenses = expenseClient.getAllExpenses(userId, null, null);
            return expenses != null ? expenses : Collections.emptyList();
        } catch (Exception e) {
            log.warn("Feign call to expense-service failed for user {}: {}", userId, e.getMessage());
            return Collections.emptyList();
        }
    }
}
