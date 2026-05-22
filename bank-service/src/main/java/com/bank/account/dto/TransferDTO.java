package com.bank.account.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public class TransferDTO {

    @NotBlank(message = "Source account number is required")
    private String fromAccountNo;

    @NotBlank(message = "Destination account number is required")
    private String toAccountNo;

    @NotNull(message = "Amount is required")
    @jakarta.validation.constraints.Positive(message = "Amount must be positive")
    @jakarta.validation.constraints.Digits(integer = 10, fraction = 2, message = "Amount out of bounds")
    private BigDecimal amount;

    private String description;

    // No-arg constructor
    public TransferDTO() {
    }

    // Getters and Setters
    public String getFromAccountNo() {
        return fromAccountNo;
    }

    public void setFromAccountNo(String fromAccountNo) {
        this.fromAccountNo = fromAccountNo;
    }

    public String getToAccountNo() {
        return toAccountNo;
    }

    public void setToAccountNo(String toAccountNo) {
        this.toAccountNo = toAccountNo;
    }

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
