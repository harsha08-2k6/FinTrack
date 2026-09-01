package com.spendwise.report.controller;

import com.spendwise.report.dto.CategoryBreakdownDto;
import com.spendwise.report.dto.DashboardReportDto;
import com.spendwise.report.dto.MonthlyTrendDto;
import com.spendwise.report.entity.BudgetAlert;
import com.spendwise.report.service.ReportService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reports")
public class ReportController {

    private final ReportService reportService;

    public ReportController(ReportService reportService) {
        this.reportService = reportService;
    }

    @GetMapping("/dashboard")
    public ResponseEntity<DashboardReportDto> getDashboardReport(
            @RequestHeader(value = "X-User-Id", required = false) Long headerUserId,
            @RequestParam(value = "userId", required = false, defaultValue = "1") Long paramUserId
    ) {
        Long userId = headerUserId != null ? headerUserId : paramUserId;
        return ResponseEntity.ok(reportService.getDashboardReport(userId));
    }

    @GetMapping("/category-breakdown")
    public ResponseEntity<List<CategoryBreakdownDto>> getCategoryBreakdown(
            @RequestHeader(value = "X-User-Id", required = false) Long headerUserId,
            @RequestParam(value = "userId", required = false, defaultValue = "1") Long paramUserId
    ) {
        Long userId = headerUserId != null ? headerUserId : paramUserId;
        return ResponseEntity.ok(reportService.getCategoryBreakdown(userId));
    }

    @GetMapping("/monthly-trends")
    public ResponseEntity<List<MonthlyTrendDto>> getMonthlyTrends(
            @RequestHeader(value = "X-User-Id", required = false) Long headerUserId,
            @RequestParam(value = "userId", required = false, defaultValue = "1") Long paramUserId
    ) {
        Long userId = headerUserId != null ? headerUserId : paramUserId;
        return ResponseEntity.ok(reportService.getMonthlyTrends(userId));
    }

    @GetMapping("/alerts")
    public ResponseEntity<List<BudgetAlert>> getBudgetAlerts(
            @RequestHeader(value = "X-User-Id", required = false) Long headerUserId,
            @RequestParam(value = "userId", required = false, defaultValue = "1") Long paramUserId
    ) {
        Long userId = headerUserId != null ? headerUserId : paramUserId;
        return ResponseEntity.ok(reportService.getBudgetAlerts(userId));
    }
}
