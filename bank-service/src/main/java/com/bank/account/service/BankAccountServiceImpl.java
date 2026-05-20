package com.bank.account.service;

import com.bank.account.dto.AccountRequestDTO;
import com.bank.account.dto.AccountResponseDTO;
import com.bank.account.dto.CustomerDTO;
import com.bank.account.dto.DepositWithdrawDTO;
import com.bank.account.dto.TransactionDTO;
import com.bank.account.dto.TransferDTO;
import com.bank.account.entity.BankAccount;
import com.bank.account.exception.InsufficientBalanceException;
import com.bank.account.exception.ResourceNotFoundException;
import com.bank.account.feign.CustomerClient;
import com.bank.account.feign.TransactionClient;
import com.bank.account.repository.BankAccountRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class BankAccountServiceImpl implements BankAccountService {

    private static final Logger logger = LoggerFactory.getLogger(BankAccountServiceImpl.class);

    private final BankAccountRepository bankAccountRepository;
    private final CustomerClient customerClient;
    private final TransactionClient transactionClient;

    public BankAccountServiceImpl(BankAccountRepository bankAccountRepository,
                                  CustomerClient customerClient,
                                  TransactionClient transactionClient) {
        this.bankAccountRepository = bankAccountRepository;
        this.customerClient = customerClient;
        this.transactionClient = transactionClient;
    }

    @Override
    public AccountResponseDTO createAccount(AccountRequestDTO request) {
        // Validate customer exists via Feign
        CustomerDTO customer = customerClient.getCustomerById(request.getCustomerId());
        if (customer == null) {
            throw new ResourceNotFoundException("Customer not found with ID: " + request.getCustomerId());
        }

        // Generate unique account number
        String accountNo = "ACC" + System.currentTimeMillis();

        // Create bank account entity
        BankAccount account = new BankAccount();
        account.setAccountNo(accountNo);
        account.setCustomerId(request.getCustomerId());
        account.setAccountType(request.getAccountType());
        account.setBranchName(request.getBranchName());
        account.setIfscCode(request.getIfscCode());
        account.setIsActive(true);

        // Set initial balance
        if (request.getInitialDeposit() != null && request.getInitialDeposit().compareTo(BigDecimal.ZERO) > 0) {
            account.setBalance(request.getInitialDeposit());
        } else {
            account.setBalance(BigDecimal.ZERO);
        }

        BankAccount savedAccount = bankAccountRepository.save(account);
        logger.info("Account created successfully: {}", savedAccount.getAccountNo());

        return mapToResponseDTO(savedAccount, customer);
    }

    @Override
    @Transactional(readOnly = true)
    public List<AccountResponseDTO> getAllAccounts() {
        return bankAccountRepository.findAll().stream()
                .map(account -> {
                    String customerName = fetchCustomerName(account.getCustomerId());
                    return mapToResponseDTO(account, customerName);
                })
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public AccountResponseDTO getAccountByAccountNo(String accountNo) {
        BankAccount account = bankAccountRepository.findByAccountNo(accountNo)
                .orElseThrow(() -> new ResourceNotFoundException("Account not found with account number: " + accountNo));
        String customerName = fetchCustomerName(account.getCustomerId());
        return mapToResponseDTO(account, customerName);
    }

    @Override
    @Transactional(readOnly = true)
    public List<AccountResponseDTO> getAccountsByCustomerId(Long customerId) {
        List<BankAccount> accounts = bankAccountRepository.findByCustomerId(customerId);
        return accounts.stream()
                .map(account -> {
                    String customerName = fetchCustomerName(account.getCustomerId());
                    return mapToResponseDTO(account, customerName);
                })
                .collect(Collectors.toList());
    }

    @Override
    public AccountResponseDTO deposit(String accountNo, DepositWithdrawDTO request) {
        BankAccount account = bankAccountRepository.findByAccountNo(accountNo)
                .orElseThrow(() -> new ResourceNotFoundException("Account not found with account number: " + accountNo));

        // Business rule borrowed from previous version: Minimum deposit is ₹100
        if (request.getAmount().compareTo(new BigDecimal("100")) < 0) {
            throw new InsufficientBalanceException("Minimum deposit amount is ₹100.");
        }

        account.setBalance(account.getBalance().add(request.getAmount()));
        BankAccount savedAccount = bankAccountRepository.save(account);
        logger.info("Deposit of {} to account {} successful. New balance: {}",
                request.getAmount(), accountNo, savedAccount.getBalance());

        // Log transaction via Feign (non-blocking — don't fail banking op if transaction service is down)
        try {
            TransactionDTO transaction = new TransactionDTO();
            transaction.setAccountNo(accountNo);
            transaction.setTransactionType("DEPOSIT");
            transaction.setAmount(request.getAmount());
            transaction.setDescription(request.getDescription());
            transaction.setBalanceAfterTransaction(savedAccount.getBalance());
            transaction.setTransactionDate(LocalDateTime.now());
            transaction.setStatus("SUCCESS");
            transactionClient.createTransaction(transaction);
        } catch (Exception ex) {
            logger.warn("Failed to log deposit transaction for account {}: {}", accountNo, ex.getMessage());
        }

        String customerName = fetchCustomerName(savedAccount.getCustomerId());
        return mapToResponseDTO(savedAccount, customerName);
    }

    @Override
    public AccountResponseDTO withdraw(String accountNo, DepositWithdrawDTO request) {
        BankAccount account = bankAccountRepository.findByAccountNo(accountNo)
                .orElseThrow(() -> new ResourceNotFoundException("Account not found with account number: " + accountNo));

        // Business rule borrowed from previous version: Minimum withdrawal is ₹1,000
        if (request.getAmount().compareTo(new BigDecimal("1000")) < 0) {
            throw new InsufficientBalanceException("Minimum withdrawal amount is ₹1,000.");
        }

        if (account.getBalance().compareTo(request.getAmount()) < 0) {
            throw new InsufficientBalanceException("Insufficient balance. Current balance: ₹" + account.getBalance());
        }

        // Business rule borrowed from previous version: Balance must remain at least ₹500 after withdrawal
        BigDecimal balanceAfter = account.getBalance().subtract(request.getAmount());
        if (balanceAfter.compareTo(new BigDecimal("500")) < 0) {
            throw new InsufficientBalanceException("Cannot withdraw. Minimum balance of ₹500 must be maintained. Available for withdrawal: ₹" + account.getBalance().subtract(new BigDecimal("500")));
        }

        account.setBalance(balanceAfter);
        BankAccount savedAccount = bankAccountRepository.save(account);
        logger.info("Withdrawal of {} from account {} successful. New balance: {}",
                request.getAmount(), accountNo, savedAccount.getBalance());

        // Log transaction via Feign
        try {
            TransactionDTO transaction = new TransactionDTO();
            transaction.setAccountNo(accountNo);
            transaction.setTransactionType("WITHDRAWAL");
            transaction.setAmount(request.getAmount());
            transaction.setDescription(request.getDescription());
            transaction.setBalanceAfterTransaction(savedAccount.getBalance());
            transaction.setTransactionDate(LocalDateTime.now());
            transaction.setStatus("SUCCESS");
            transactionClient.createTransaction(transaction);
        } catch (Exception ex) {
            logger.warn("Failed to log withdrawal transaction for account {}: {}", accountNo, ex.getMessage());
        }

        String customerName = fetchCustomerName(savedAccount.getCustomerId());
        return mapToResponseDTO(savedAccount, customerName);
    }

    @Override
    public AccountResponseDTO transfer(TransferDTO request) {
        BankAccount fromAccount = bankAccountRepository.findByAccountNo(request.getFromAccountNo())
                .orElseThrow(() -> new ResourceNotFoundException("Source account not found: " + request.getFromAccountNo()));

        BankAccount toAccount = bankAccountRepository.findByAccountNo(request.getToAccountNo())
                .orElseThrow(() -> new ResourceNotFoundException("Destination account not found: " + request.getToAccountNo()));

        if (fromAccount.getBalance().compareTo(request.getAmount()) < 0) {
            throw new InsufficientBalanceException("Insufficient balance in source account. Current balance: " + fromAccount.getBalance());
        }

        // Perform transfer
        fromAccount.setBalance(fromAccount.getBalance().subtract(request.getAmount()));
        toAccount.setBalance(toAccount.getBalance().add(request.getAmount()));

        bankAccountRepository.save(fromAccount);
        bankAccountRepository.save(toAccount);
        logger.info("Transfer of {} from {} to {} successful", request.getAmount(),
                request.getFromAccountNo(), request.getToAccountNo());

        // Log transaction via Feign
        try {
            TransactionDTO transaction = new TransactionDTO();
            transaction.setAccountNo(request.getFromAccountNo());
            transaction.setTransactionType("TRANSFER");
            transaction.setAmount(request.getAmount());
            transaction.setFromAccount(request.getFromAccountNo());
            transaction.setToAccount(request.getToAccountNo());
            transaction.setDescription(request.getDescription());
            transaction.setBalanceAfterTransaction(fromAccount.getBalance());
            transaction.setTransactionDate(LocalDateTime.now());
            transaction.setStatus("SUCCESS");
            transactionClient.createTransaction(transaction);
        } catch (Exception ex) {
            logger.warn("Failed to log transfer transaction from {} to {}: {}",
                    request.getFromAccountNo(), request.getToAccountNo(), ex.getMessage());
        }

        String customerName = fetchCustomerName(fromAccount.getCustomerId());
        return mapToResponseDTO(fromAccount, customerName);
    }

    @Override
    @Transactional(readOnly = true)
    public BigDecimal getBalance(String accountNo) {
        BankAccount account = bankAccountRepository.findByAccountNo(accountNo)
                .orElseThrow(() -> new ResourceNotFoundException("Account not found with account number: " + accountNo));
        return account.getBalance();
    }

    // ===================== Helper Methods =====================

    private String fetchCustomerName(Long customerId) {
        try {
            CustomerDTO customer = customerClient.getCustomerById(customerId);
            if (customer != null) {
                return customer.getFirstName() + " " + customer.getLastName();
            }
        } catch (Exception ex) {
            logger.warn("Failed to fetch customer name for customer ID {}: {}", customerId, ex.getMessage());
        }
        return "Unknown";
    }

    private AccountResponseDTO mapToResponseDTO(BankAccount account, CustomerDTO customer) {
        AccountResponseDTO dto = new AccountResponseDTO();
        dto.setId(account.getId());
        dto.setAccountNo(account.getAccountNo());
        dto.setCustomerId(account.getCustomerId());
        dto.setCustomerName(customer.getFirstName() + " " + customer.getLastName());
        dto.setAccountType(account.getAccountType());
        dto.setBalance(account.getBalance());
        dto.setBranchName(account.getBranchName());
        dto.setIfscCode(account.getIfscCode());
        dto.setIsActive(account.getIsActive());
        dto.setCreatedAt(account.getCreatedAt());
        dto.setUpdatedAt(account.getUpdatedAt());
        return dto;
    }

    private AccountResponseDTO mapToResponseDTO(BankAccount account, String customerName) {
        AccountResponseDTO dto = new AccountResponseDTO();
        dto.setId(account.getId());
        dto.setAccountNo(account.getAccountNo());
        dto.setCustomerId(account.getCustomerId());
        dto.setCustomerName(customerName);
        dto.setAccountType(account.getAccountType());
        dto.setBalance(account.getBalance());
        dto.setBranchName(account.getBranchName());
        dto.setIfscCode(account.getIfscCode());
        dto.setIsActive(account.getIsActive());
        dto.setCreatedAt(account.getCreatedAt());
        dto.setUpdatedAt(account.getUpdatedAt());
        return dto;
    }
}
