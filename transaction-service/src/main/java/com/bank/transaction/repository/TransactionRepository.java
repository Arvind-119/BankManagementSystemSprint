package com.bank.transaction.repository;

import com.bank.transaction.entity.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    List<Transaction> findByAccountNo(String accountNo);

    List<Transaction> findByAccountNoOrderByTransactionDateDesc(String accountNo);

    Optional<Transaction> findByTransactionId(String transactionId);

    List<Transaction> findByAccountNoAndTransactionDateBetween(String accountNo, LocalDateTime startDate, LocalDateTime endDate);
}
