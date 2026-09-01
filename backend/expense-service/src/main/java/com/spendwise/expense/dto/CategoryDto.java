package com.spendwise.expense.dto;

import java.math.BigDecimal;

public class CategoryDto {
    private Long id;
    private String name;
    private String description;
    private String icon;
    private String colorCode;
    private BigDecimal budgetLimit;

    public CategoryDto() {}

    public CategoryDto(Long id, String name, String description, String icon, String colorCode, BigDecimal budgetLimit) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.icon = icon;
        this.colorCode = colorCode;
        this.budgetLimit = budgetLimit;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private Long id;
        private String name;
        private String description;
        private String icon;
        private String colorCode;
        private BigDecimal budgetLimit;

        public Builder id(Long id) { this.id = id; return this; }
        public Builder name(String name) { this.name = name; return this; }
        public Builder description(String description) { this.description = description; return this; }
        public Builder icon(String icon) { this.icon = icon; return this; }
        public Builder colorCode(String colorCode) { this.colorCode = colorCode; return this; }
        public Builder budgetLimit(BigDecimal budgetLimit) { this.budgetLimit = budgetLimit; return this; }

        public CategoryDto build() {
            return new CategoryDto(id, name, description, icon, colorCode, budgetLimit);
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getIcon() { return icon; }
    public void setIcon(String icon) { this.icon = icon; }

    public String getColorCode() { return colorCode; }
    public void setColorCode(String colorCode) { this.colorCode = colorCode; }

    public BigDecimal getBudgetLimit() { return budgetLimit; }
    public void setBudgetLimit(BigDecimal budgetLimit) { this.budgetLimit = budgetLimit; }
}
