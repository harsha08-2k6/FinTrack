package com.spendwise.report.client;

import com.spendwise.report.dto.ExpenseDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

@FeignClient(name = "transaction-service")
public interface ExpenseClient {

    @GetMapping("/api/transactions")
    List<ExpenseDto> getAllExpenses(
            @RequestHeader(value = "X-User-Id", required = false) Long userId,
            @RequestParam(value = "startDate", required = false) String startDate,
            @RequestParam(value = "endDate", required = false) String endDate
    );
}
