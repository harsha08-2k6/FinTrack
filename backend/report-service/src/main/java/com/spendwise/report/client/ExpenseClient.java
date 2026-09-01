package com.spendwise.report.client;

import com.spendwise.report.dto.ExpenseDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

@FeignClient(name = "expense-service")
public interface ExpenseClient {

    @GetMapping("/api/expenses")
    List<ExpenseDto> getAllExpenses(
            @RequestParam(value = "userId", required = false) Long userId,
            @RequestParam(value = "startDate", required = false) String startDate,
            @RequestParam(value = "endDate", required = false) String endDate
    );
}
