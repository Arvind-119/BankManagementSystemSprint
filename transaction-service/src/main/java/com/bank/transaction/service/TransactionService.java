package com.bank.transaction.service;

import com.bank.transaction.dto.TransactionRequestDTO;
import com.bank.transaction.dto.TransactionResponseDTO;

import java.util.List;

public interface TransactionService {

    TransactionResponseDTO createTransaction(TransactionRequestDTO request);

    List<TransactionResponseDTO> getAllTransactions();

    TransactionResponseDTO getTransactionById(Long id);

    TransactionResponseDTO getTransactionByTransactionId(String transactionId);

    List<TransactionResponseDTO> getTransactionsByAccountNo(String accountNo);
}
