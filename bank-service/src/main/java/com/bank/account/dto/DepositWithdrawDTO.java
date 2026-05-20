package com.bank.account.dto;

import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public class DepositWithdrawDTO {

    @NotNull(message = "Amount is required")
    private BigDecimal amount;

    private String description;

    // No-arg constructor
    public DepositWithdrawDTO() {
    }

    // Getters and Setters
    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}
