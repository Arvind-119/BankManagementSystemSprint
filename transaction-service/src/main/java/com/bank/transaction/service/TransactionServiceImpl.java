package com.bank.transaction.service;

import com.bank.transaction.dto.TransactionRequestDTO;
import com.bank.transaction.dto.TransactionResponseDTO;
import com.bank.transaction.entity.Transaction;
import com.bank.transaction.exception.ResourceNotFoundException;
import com.bank.transaction.repository.TransactionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional
public class TransactionServiceImpl implements TransactionService {

    private final TransactionRepository transactionRepository;

    public TransactionServiceImpl(TransactionRepository transactionRepository) {
        this.transactionRepository = transactionRepository;
    }

    @Override
    public TransactionResponseDTO createTransaction(TransactionRequestDTO request) {
        Transaction transaction = new Transaction();
        transaction.setTransactionId(UUID.randomUUID().toString());
        transaction.setAccountNo(request.getAccountNo());
        transaction.setTransactionType(request.getTransactionType());
        transaction.setAmount(request.getAmount());
        transaction.setFromAccount(request.getFromAccount());
        transaction.setToAccount(request.getToAccount());
        transaction.setTransactionDate(LocalDateTime.now());
        transaction.setDescription(request.getDescription());
        transaction.setBalanceAfterTransaction(request.getBalanceAfterTransaction());
        transaction.setStatus(request.getStatus());

        Transaction savedTransaction = transactionRepository.save(transaction);
        return mapToResponseDTO(savedTransaction);
    }

    @Override
    @Transactional(readOnly = true)
    public List<TransactionResponseDTO> getAllTransactions() {
        List<Transaction> transactions = transactionRepository.findAll();
        return transactions.stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public TransactionResponseDTO getTransactionById(Long id) {
        Transaction transaction = transactionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Transaction not found with id: " + id));
        return mapToResponseDTO(transaction);
    }

    @Override
    @Transactional(readOnly = true)
    public TransactionResponseDTO getTransactionByTransactionId(String transactionId) {
        Transaction transaction = transactionRepository.findByTransactionId(transactionId)
                .orElseThrow(() -> new ResourceNotFoundException("Transaction not found with transactionId: " + transactionId));
        return mapToResponseDTO(transaction);
    }

    @Override
    @Transactional(readOnly = true)
    public List<TransactionResponseDTO> getTransactionsByAccountNo(String accountNo) {
        List<Transaction> transactions = transactionRepository.findByAccountNoOrderByTransactionDateDesc(accountNo);
        return transactions.stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    private TransactionResponseDTO mapToResponseDTO(Transaction transaction) {
        TransactionResponseDTO dto = new TransactionResponseDTO();
        dto.setId(transaction.getId());
        dto.setTransactionId(transaction.getTransactionId());
        dto.setAccountNo(transaction.getAccountNo());
        dto.setTransactionType(transaction.getTransactionType());
        dto.setAmount(transaction.getAmount());
        dto.setFromAccount(transaction.getFromAccount());
        dto.setToAccount(transaction.getToAccount());
        dto.setTransactionDate(transaction.getTransactionDate());
        dto.setDescription(transaction.getDescription());
        dto.setBalanceAfterTransaction(transaction.getBalanceAfterTransaction());
        dto.setStatus(transaction.getStatus());
        return dto;
    }
}
