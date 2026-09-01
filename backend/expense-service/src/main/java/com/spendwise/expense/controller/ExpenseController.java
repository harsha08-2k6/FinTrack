package com.spendwise.expense.controller;

import com.spendwise.expense.dto.ExpenseRequest;
import com.spendwise.expense.dto.ExpenseResponse;
import com.spendwise.expense.dto.ExpenseSummaryDto;
import com.spendwise.expense.service.ExpenseService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/expenses")
public class ExpenseController {

    private final ExpenseService expenseService;

    public ExpenseController(ExpenseService expenseService) {
        this.expenseService = expenseService;
    }

    @GetMapping
    public ResponseEntity<?> getExpenses(
            @RequestHeader(value = "X-User-Id", required = false) Long headerUserId,
            @RequestParam(value = "userId", required = false, defaultValue = "1") Long paramUserId,
            @RequestParam(value = "page", required = false) Integer page,
            @RequestParam(value = "size", required = false, defaultValue = "10") Integer size,
            @RequestParam(value = "startDate", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(value = "endDate", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(value = "categoryId", required = false) Long categoryId
    ) {
        Long userId = headerUserId != null ? headerUserId : paramUserId;

        if (page != null) {
            Pageable pageable = PageRequest.of(page, size);
            Page<ExpenseResponse> response = expenseService.getExpensesPaginated(userId, pageable);
            return ResponseEntity.ok(response);
        }

        List<ExpenseResponse> response = expenseService.getAllExpenses(userId, startDate, endDate, categoryId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ExpenseResponse> getExpenseById(
            @PathVariable Long id,
            @RequestHeader(value = "X-User-Id", required = false) Long headerUserId,
            @RequestParam(value = "userId", required = false, defaultValue = "1") Long paramUserId
    ) {
        Long userId = headerUserId != null ? headerUserId : paramUserId;
        return ResponseEntity.ok(expenseService.getExpenseById(id, userId));
    }

    @PostMapping
    public ResponseEntity<ExpenseResponse> createExpense(
            @Valid @RequestBody ExpenseRequest request,
            @RequestHeader(value = "X-User-Id", required = false) Long headerUserId
    ) {
        Long userId = headerUserId != null ? headerUserId : request.getUserId();
        ExpenseResponse response = expenseService.createExpense(request, userId);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ExpenseResponse> updateExpense(
            @PathVariable Long id,
            @Valid @RequestBody ExpenseRequest request,
            @RequestHeader(value = "X-User-Id", required = false) Long headerUserId,
            @RequestParam(value = "userId", required = false, defaultValue = "1") Long paramUserId
    ) {
        Long userId = headerUserId != null ? headerUserId : paramUserId;
        ExpenseResponse response = expenseService.updateExpense(id, request, userId);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteExpense(
            @PathVariable Long id,
            @RequestHeader(value = "X-User-Id", required = false) Long headerUserId,
            @RequestParam(value = "userId", required = false, defaultValue = "1") Long paramUserId
    ) {
        Long userId = headerUserId != null ? headerUserId : paramUserId;
        expenseService.deleteExpense(id, userId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/summary")
    public ResponseEntity<ExpenseSummaryDto> getSummary(
            @RequestHeader(value = "X-User-Id", required = false) Long headerUserId,
            @RequestParam(value = "userId", required = false, defaultValue = "1") Long paramUserId
    ) {
        Long userId = headerUserId != null ? headerUserId : paramUserId;
        return ResponseEntity.ok(expenseService.getSummary(userId));
    }
}
