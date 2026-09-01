package com.spendwise.report.repository;

import com.spendwise.report.entity.MonthlySummary;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MonthlySummaryRepository extends JpaRepository<MonthlySummary, Long> {
    Optional<MonthlySummary> findByUserIdAndYearMonth(Long userId, String yearMonth);
    List<MonthlySummary> findByUserIdOrderByYearMonthDesc(Long userId);
}
