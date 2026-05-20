package com.bank.account.controller;

import com.bank.account.dto.AccountRequestDTO;
import com.bank.account.dto.AccountResponseDTO;
import com.bank.account.dto.DepositWithdrawDTO;
import com.bank.account.dto.TransferDTO;
import com.bank.account.service.BankAccountService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/v1/accounts")
@Tag(name = "Bank Account Management", description = "APIs for managing bank accounts")
public class BankAccountController {

    private final BankAccountService bankAccountService;

    public BankAccountController(BankAccountService bankAccountService) {
        this.bankAccountService = bankAccountService;
    }

    @PostMapping
    @Operation(summary = "Create a new bank account")
    public ResponseEntity<AccountResponseDTO> createAccount(@Valid @RequestBody AccountRequestDTO request) {
        AccountResponseDTO response = bankAccountService.createAccount(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping
    @Operation(summary = "Get all bank accounts")
    public ResponseEntity<List<AccountResponseDTO>> getAllAccounts() {
        List<AccountResponseDTO> accounts = bankAccountService.getAllAccounts();
        return new ResponseEntity<>(accounts, HttpStatus.OK);
    }

    @GetMapping("/{accountNo}")
    @Operation(summary = "Get bank account by account number")
    public ResponseEntity<AccountResponseDTO> getAccountByAccountNo(@PathVariable String accountNo) {
        AccountResponseDTO account = bankAccountService.getAccountByAccountNo(accountNo);
        return new ResponseEntity<>(account, HttpStatus.OK);
    }

    @GetMapping("/customer/{customerId}")
    @Operation(summary = "Get all accounts for a specific customer")
    public ResponseEntity<List<AccountResponseDTO>> getAccountsByCustomerId(@PathVariable Long customerId) {
        List<AccountResponseDTO> accounts = bankAccountService.getAccountsByCustomerId(customerId);
        return new ResponseEntity<>(accounts, HttpStatus.OK);
    }

    @PutMapping("/{accountNo}/deposit")
    @Operation(summary = "Deposit money into an account")
    public ResponseEntity<AccountResponseDTO> deposit(@PathVariable String accountNo,
                                                       @Valid @RequestBody DepositWithdrawDTO request) {
        AccountResponseDTO response = bankAccountService.deposit(accountNo, request);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PutMapping("/{accountNo}/withdraw")
    @Operation(summary = "Withdraw money from an account")
    public ResponseEntity<AccountResponseDTO> withdraw(@PathVariable String accountNo,
                                                        @Valid @RequestBody DepositWithdrawDTO request) {
        AccountResponseDTO response = bankAccountService.withdraw(accountNo, request);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PostMapping("/transfer")
    @Operation(summary = "Transfer money between accounts")
    public ResponseEntity<AccountResponseDTO> transfer(@Valid @RequestBody TransferDTO request) {
        AccountResponseDTO response = bankAccountService.transfer(request);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/{accountNo}/balance")
    @Operation(summary = "Get account balance")
    public ResponseEntity<BigDecimal> getBalance(@PathVariable String accountNo) {
        BigDecimal balance = bankAccountService.getBalance(accountNo);
        return new ResponseEntity<>(balance, HttpStatus.OK);
    }
}
