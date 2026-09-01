package com.spendwise.report.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "monthly_summaries", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"user_id", "year_month"})
})
public class MonthlySummary {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "year_month", nullable = false, length = 7)
    private String yearMonth;

    @Column(name = "total_spent", nullable = false, precision = 14, scale = 2)
    private BigDecimal totalSpent = BigDecimal.ZERO;

    @Column(name = "total_transactions", nullable = false)
    private Integer totalTransactions = 0;

    @Column(name = "top_category_name", length = 100)
    private String topCategoryName;

    @Column(name = "top_category_amount", precision = 14, scale = 2)
    private BigDecimal topCategoryAmount = BigDecimal.ZERO;

    @CreationTimestamp
    @Column(name = "generated_at", updatable = false)
    private LocalDateTime generatedAt;

    public MonthlySummary() {}

    public MonthlySummary(Long id, Long userId, String yearMonth, BigDecimal totalSpent, Integer totalTransactions, String topCategoryName, BigDecimal topCategoryAmount, LocalDateTime generatedAt) {
        this.id = id;
        this.userId = userId;
        this.yearMonth = yearMonth;
        this.totalSpent = totalSpent != null ? totalSpent : BigDecimal.ZERO;
        this.totalTransactions = totalTransactions != null ? totalTransactions : 0;
        this.topCategoryName = topCategoryName;
        this.topCategoryAmount = topCategoryAmount != null ? topCategoryAmount : BigDecimal.ZERO;
        this.generatedAt = generatedAt;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private Long id;
        private Long userId;
        private String yearMonth;
        private BigDecimal totalSpent = BigDecimal.ZERO;
        private Integer totalTransactions = 0;
        private String topCategoryName;
        private BigDecimal topCategoryAmount = BigDecimal.ZERO;
        private LocalDateTime generatedAt;

        public Builder id(Long id) { this.id = id; return this; }
        public Builder userId(Long userId) { this.userId = userId; return this; }
        public Builder yearMonth(String yearMonth) { this.yearMonth = yearMonth; return this; }
        public Builder totalSpent(BigDecimal totalSpent) { this.totalSpent = totalSpent; return this; }
        public Builder totalTransactions(Integer totalTransactions) { this.totalTransactions = totalTransactions; return this; }
        public Builder topCategoryName(String topCategoryName) { this.topCategoryName = topCategoryName; return this; }
        public Builder topCategoryAmount(BigDecimal topCategoryAmount) { this.topCategoryAmount = topCategoryAmount; return this; }
        public Builder generatedAt(LocalDateTime generatedAt) { this.generatedAt = generatedAt; return this; }

        public MonthlySummary build() {
            return new MonthlySummary(id, userId, yearMonth, totalSpent, totalTransactions, topCategoryName, topCategoryAmount, generatedAt);
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getYearMonth() { return yearMonth; }
    public void setYearMonth(String yearMonth) { this.yearMonth = yearMonth; }

    public BigDecimal getTotalSpent() { return totalSpent; }
    public void setTotalSpent(BigDecimal totalSpent) { this.totalSpent = totalSpent; }

    public Integer getTotalTransactions() { return totalTransactions; }
    public void setTotalTransactions(Integer totalTransactions) { this.totalTransactions = totalTransactions; }

    public String getTopCategoryName() { return topCategoryName; }
    public void setTopCategoryName(String topCategoryName) { this.topCategoryName = topCategoryName; }

    public BigDecimal getTopCategoryAmount() { return topCategoryAmount; }
    public void setTopCategoryAmount(BigDecimal topCategoryAmount) { this.topCategoryAmount = topCategoryAmount; }

    public LocalDateTime getGeneratedAt() { return generatedAt; }
    public void setGeneratedAt(LocalDateTime generatedAt) { this.generatedAt = generatedAt; }
}
