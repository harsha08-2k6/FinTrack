package com.spendwise.expense.service;

import com.spendwise.expense.client.CategoryClient;
import com.spendwise.expense.dto.CategoryDto;
import com.spendwise.expense.dto.ExpenseRequest;
import com.spendwise.expense.dto.ExpenseResponse;
import com.spendwise.expense.dto.ExpenseSummaryDto;
import com.spendwise.expense.entity.Expense;
import com.spendwise.expense.repository.ExpenseRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class ExpenseService {

    private static final Logger log = LoggerFactory.getLogger(ExpenseService.class);

    private final ExpenseRepository expenseRepository;
    private final CategoryClient categoryClient;

    public ExpenseService(ExpenseRepository expenseRepository, CategoryClient categoryClient) {
        this.expenseRepository = expenseRepository;
        this.categoryClient = categoryClient;
    }

    public Page<ExpenseResponse> getExpensesPaginated(Long userId, Pageable pageable) {
        Page<Expense> page = expenseRepository.findByUserIdOrderByExpenseDateDesc(userId, pageable);
        return page.map(this::mapToResponseWithCategory);
    }

    public List<ExpenseResponse> getAllExpenses(Long userId, LocalDate startDate, LocalDate endDate, Long categoryId) {
        List<Expense> list;
        if (startDate != null && endDate != null) {
            list = expenseRepository.findByUserIdAndExpenseDateBetweenOrderByExpenseDateDesc(userId, startDate, endDate);
        } else if (categoryId != null) {
            list = expenseRepository.findByUserIdAndCategoryIdOrderByExpenseDateDesc(userId, categoryId);
        } else {
            list = expenseRepository.findByUserIdOrderByExpenseDateDesc(userId);
        }
        return list.stream()
                .map(this::mapToResponseWithCategory)
                .collect(Collectors.toList());
    }

    public ExpenseResponse getExpenseById(Long id, Long userId) {
        Expense expense = expenseRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Expense not found with id: " + id));

        if (userId != null && !expense.getUserId().equals(userId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access denied to requested expense");
        }

        return mapToResponseWithCategory(expense);
    }

    public ExpenseResponse createExpense(ExpenseRequest request, Long userId) {
        Long resolvedUserId = userId != null ? userId : request.getUserId();
        if (resolvedUserId == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "User ID is required");
        }

        Expense expense = Expense.builder()
                .title(request.getTitle().trim())
                .description(request.getDescription())
                .amount(request.getAmount())
                .categoryId(request.getCategoryId())
                .userId(resolvedUserId)
                .expenseDate(request.getExpenseDate())
                .paymentMethod(request.getPaymentMethod() != null ? request.getPaymentMethod() : "CARD")
                .receiptUrl(request.getReceiptUrl())
                .build();

        Expense saved = expenseRepository.save(expense);
        return mapToResponseWithCategory(saved);
    }

    public ExpenseResponse updateExpense(Long id, ExpenseRequest request, Long userId) {
        Expense expense = expenseRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Expense not found"));

        if (userId != null && !expense.getUserId().equals(userId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access denied to update this expense");
        }

        expense.setTitle(request.getTitle().trim());
        if (request.getDescription() != null) expense.setDescription(request.getDescription());
        expense.setAmount(request.getAmount());
        expense.setCategoryId(request.getCategoryId());
        expense.setExpenseDate(request.getExpenseDate());
        if (request.getPaymentMethod() != null) expense.setPaymentMethod(request.getPaymentMethod());
        if (request.getReceiptUrl() != null) expense.setReceiptUrl(request.getReceiptUrl());

        Expense updated = expenseRepository.save(expense);
        return mapToResponseWithCategory(updated);
    }

    public void deleteExpense(Long id, Long userId) {
        Expense expense = expenseRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Expense not found"));

        if (userId != null && !expense.getUserId().equals(userId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access denied to delete this expense");
        }

        expenseRepository.delete(expense);
    }

    public ExpenseSummaryDto getSummary(Long userId) {
        BigDecimal totalAllTime = expenseRepository.sumTotalByUserId(userId);

        YearMonth currentMonth = YearMonth.now();
        LocalDate startOfMonth = currentMonth.atDay(1);
        LocalDate endOfMonth = currentMonth.atEndOfMonth();
        BigDecimal totalCurrentMonth = expenseRepository.sumByUserIdAndDateRange(userId, startOfMonth, endOfMonth);

        List<Expense> allUserExpenses = expenseRepository.findByUserIdOrderByExpenseDateDesc(userId);
        long count = allUserExpenses.size();

        Map<String, BigDecimal> spendByCategory = new HashMap<>();
        List<Object[]> categorySums = expenseRepository.sumGroupedByCategory(userId);
        for (Object[] row : categorySums) {
            Long catId = (Long) row[0];
            BigDecimal sum = (BigDecimal) row[1];
            String categoryName = "Category " + catId;
            try {
                CategoryDto cat = categoryClient.getCategoryById(catId);
                if (cat != null && cat.getName() != null) {
                    categoryName = cat.getName();
                }
            } catch (Exception e) {
                log.warn("Unable to fetch category info via Feign for id: {}", catId);
            }
            spendByCategory.put(categoryName, sum);
        }

        return ExpenseSummaryDto.builder()
                .totalSpendAllTime(totalAllTime != null ? totalAllTime : BigDecimal.ZERO)
                .totalSpendCurrentMonth(totalCurrentMonth != null ? totalCurrentMonth : BigDecimal.ZERO)
                .totalTransactions(count)
                .spendByCategory(spendByCategory)
                .build();
    }

    private ExpenseResponse mapToResponseWithCategory(Expense expense) {
        CategoryDto categoryDto = null;
        try {
            categoryDto = categoryClient.getCategoryById(expense.getCategoryId());
        } catch (Exception e) {
            log.warn("Feign client call to Category Service failed for categoryId: {}", expense.getCategoryId());
            categoryDto = CategoryDto.builder()
                    .id(expense.getCategoryId())
                    .name("Category " + expense.getCategoryId())
                    .colorCode("#6366f1")
                    .icon("tag")
                    .build();
        }

        return ExpenseResponse.builder()
                .id(expense.getId())
                .title(expense.getTitle())
                .description(expense.getDescription())
                .amount(expense.getAmount())
                .categoryId(expense.getCategoryId())
                .category(categoryDto)
                .userId(expense.getUserId())
                .expenseDate(expense.getExpenseDate())
                .paymentMethod(expense.getPaymentMethod())
                .receiptUrl(expense.getReceiptUrl())
                .createdAt(expense.getCreatedAt())
                .build();
    }
}
