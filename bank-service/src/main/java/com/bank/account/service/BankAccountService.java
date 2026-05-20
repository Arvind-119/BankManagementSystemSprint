package com.bank.account.service;

import com.bank.account.dto.AccountRequestDTO;
import com.bank.account.dto.AccountResponseDTO;
import com.bank.account.dto.DepositWithdrawDTO;
import com.bank.account.dto.TransferDTO;

import java.math.BigDecimal;
import java.util.List;

public interface BankAccountService {

    AccountResponseDTO createAccount(AccountRequestDTO request);

    List<AccountResponseDTO> getAllAccounts();

    AccountResponseDTO getAccountByAccountNo(String accountNo);

    List<AccountResponseDTO> getAccountsByCustomerId(Long customerId);

    AccountResponseDTO deposit(String accountNo, DepositWithdrawDTO request);

    AccountResponseDTO withdraw(String accountNo, DepositWithdrawDTO request);

    AccountResponseDTO transfer(TransferDTO request);

    BigDecimal getBalance(String accountNo);
}
