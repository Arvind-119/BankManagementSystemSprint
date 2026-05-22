package com.bank.account.dto;

import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public class DepositWithdrawDTO {

    @NotNull(message = "Amount is required")
    @jakarta.validation.constraints.Positive(message = "Amount must be positive")
    @jakarta.validation.constraints.Digits(integer = 10, fraction = 2, message = "Amount out of bounds")
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
