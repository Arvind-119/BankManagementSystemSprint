package com.bank.auth.service;

import com.bank.auth.dto.CustomerCreateDTO;
import com.bank.auth.dto.CustomerDTO;
import com.bank.auth.dto.LoginRequest;
import com.bank.auth.dto.LoginResponse;
import com.bank.auth.dto.RegisterRequest;
import com.bank.auth.dto.RegisterResponse;
import com.bank.auth.entity.UserCredential;
import com.bank.auth.feign.CustomerClient;
import com.bank.auth.feign.BankAccountClient;
import com.bank.auth.dto.AccountRequestDTO;
import com.bank.auth.dto.AccountResponseDTO;
import com.bank.auth.repository.UserCredentialRepository;
import com.bank.auth.security.JwtUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@Transactional
public class AuthServiceImpl implements AuthService {

    private static final Logger logger = LoggerFactory.getLogger(AuthServiceImpl.class);

    private final UserCredentialRepository credentialRepository;
    private final CustomerClient customerClient;
    private final BankAccountClient bankAccountClient;
    private final JwtUtil jwtUtil;
    private final org.springframework.security.crypto.password.PasswordEncoder passwordEncoder;

    public AuthServiceImpl(UserCredentialRepository credentialRepository,
                           CustomerClient customerClient,
                           BankAccountClient bankAccountClient,
                           JwtUtil jwtUtil,
                           org.springframework.security.crypto.password.PasswordEncoder passwordEncoder) {
        this.credentialRepository = credentialRepository;
        this.customerClient = customerClient;
        this.bankAccountClient = bankAccountClient;
        this.jwtUtil = jwtUtil;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public LoginResponse login(LoginRequest request) {
        LoginResponse response = new LoginResponse();

        Optional<UserCredential> credentialOpt =
                credentialRepository.findByLoginIdAndRole(request.getLoginId(), request.getRole());

        if (credentialOpt.isEmpty()) {
            response.setSuccess(false);
            if ("manager".equals(request.getRole())) {
                response.setMessage("Invalid manager credentials.");
            } else {
                response.setMessage("Invalid SSN ID or password.");
            }
            return response;
        }

        UserCredential credential = credentialOpt.get();

        if (!passwordEncoder.matches(request.getPassword(), credential.getPassword())) {
            response.setSuccess(false);
            if ("manager".equals(request.getRole())) {
                response.setMessage("Invalid manager credentials.");
            } else {
                response.setMessage("Invalid SSN ID or password.");
            }
            return response;
        }

        response.setSuccess(true);
        response.setId(credential.getId());
        response.setLoginId(credential.getLoginId());
        response.setName(credential.getName());
        response.setRole(credential.getRole());
        response.setLinkedCustomerId(credential.getLinkedCustomerId());
        response.setMessage("Login successful.");
        
        // Generate JWT Token
        String token = jwtUtil.generateToken(credential.getLoginId(), credential.getRole());
        response.setToken(token);

        logger.info("Login successful for user: {} role: {}", request.getLoginId(), request.getRole());
        return response;
    }

    @Override
    public RegisterResponse registerCustomer(RegisterRequest request) {
        return doRegisterCustomer(request, request.getPassword());
    }

    @Override
    public RegisterResponse registerCustomerByManager(RegisterRequest request) {
        // Manager-created customers use SSN as default password
        return doRegisterCustomer(request, request.getSsnId());
    }

    private RegisterResponse doRegisterCustomer(RegisterRequest request, String password) {
        RegisterResponse response = new RegisterResponse();

        // Check if SSN already has credentials
        if (credentialRepository.existsByLoginIdAndRole(request.getSsnId(), "customer")) {
            response.setSuccess(false);
            response.setMessage("A customer with this SSN ID already exists.");
            return response;
        }

        // Create customer in customer-service via Feign
        CustomerDTO createdCustomer;
        try {
            CustomerCreateDTO customerCreate = new CustomerCreateDTO();
            customerCreate.setSnnId(request.getSsnId());
            customerCreate.setFirstName(request.getFirstName());
            customerCreate.setLastName(request.getLastName());
            customerCreate.setEmail(request.getEmail());
            customerCreate.setContact(request.getContact());
            customerCreate.setAddress(request.getAddress());
            customerCreate.setAadharNo((request.getAadharNo() == null || request.getAadharNo().trim().isEmpty()) ? null : request.getAadharNo());
            customerCreate.setPanNo((request.getPanNo() == null || request.getPanNo().trim().isEmpty()) ? null : request.getPanNo());
            customerCreate.setDateOfBirth(request.getDateOfBirth());
            customerCreate.setGender(request.getGender());
            customerCreate.setMaritalStatus(request.getMaritalStatus());

            // Calculate age from DOB
            if (request.getDateOfBirth() != null) {
                int age = java.time.Period.between(request.getDateOfBirth(), java.time.LocalDate.now()).getYears();
                customerCreate.setAge(age);
            } else {
                customerCreate.setAge(0);
            }

            createdCustomer = customerClient.createCustomer(customerCreate);
        } catch (Exception ex) {
            logger.error("Failed to create customer in customer-service: {}", ex.getMessage());
            response.setSuccess(false);
            // Check if it's a duplicate email error
            if (ex.getMessage() != null && ex.getMessage().contains("email")) {
                response.setMessage("A customer with this email already exists.");
            } else if (ex.getMessage() != null && ex.getMessage().contains("SSN")) {
                response.setMessage("A customer with this SSN ID already exists.");
            } else if (ex.getMessage() != null && ex.getMessage().contains("PAN")) {
                response.setMessage("A customer with this PAN number already exists.");
            } else if (ex.getMessage() != null && ex.getMessage().contains("Aadhar")) {
                response.setMessage("A customer with this Aadhar number already exists.");
            } else {
                response.setMessage("Failed to register customer. Please try again.");
            }
            return response;
        }

        // Create default bank account — this is MANDATORY, not optional
        String bankAccountNo;
        try {
            AccountRequestDTO accountReq = new AccountRequestDTO();
            accountReq.setCustomerId(createdCustomer.getId());
            accountReq.setAccountType("SAVINGS");
            accountReq.setBranchName("Main Branch");
            accountReq.setIfscCode("BANK0000001");
            accountReq.setInitialDeposit(java.math.BigDecimal.ZERO);

            AccountResponseDTO accountRes = bankAccountClient.createAccount(accountReq);
            bankAccountNo = accountRes.getAccountNo();
            logger.info("Created bank account {} for customer {}", bankAccountNo, createdCustomer.getId());

            // Update customer record with the generated bank account number
            CustomerCreateDTO updateReq = new CustomerCreateDTO();
            updateReq.setSnnId(request.getSsnId());
            updateReq.setFirstName(request.getFirstName());
            updateReq.setLastName(request.getLastName());
            updateReq.setEmail(request.getEmail());
            updateReq.setContact(request.getContact());
            updateReq.setAddress(request.getAddress());
            updateReq.setAadharNo(request.getAadharNo());
            updateReq.setPanNo(request.getPanNo());
            updateReq.setDateOfBirth(request.getDateOfBirth());
            updateReq.setGender(request.getGender());
            updateReq.setMaritalStatus(request.getMaritalStatus());
            updateReq.setBankAccountNo(bankAccountNo);
            if (request.getDateOfBirth() != null) {
                updateReq.setAge(java.time.Period.between(request.getDateOfBirth(), java.time.LocalDate.now()).getYears());
            }
            customerClient.updateCustomer(createdCustomer.getId(), updateReq);
            logger.info("Updated customer {} with bank account {}", createdCustomer.getId(), bankAccountNo);
        } catch (Exception ex) {
            logger.error("Failed to create bank account for customer {}: {}", createdCustomer.getId(), ex.getMessage());
            
            // Compensating transaction: Delete the partially created customer
            try {
                logger.info("Initiating compensation: Deleting customer {} from customer-service", createdCustomer.getId());
                customerClient.deleteCustomer(createdCustomer.getId());
                logger.info("Compensation successful");
            } catch (Exception compEx) {
                logger.error("Failed compensation: Could not delete customer {}: {}", createdCustomer.getId(), compEx.getMessage());
            }

            response.setSuccess(false);
            response.setMessage("Registration failed: could not create bank account. Please ensure all services are running and try again.");
            return response;
        }

        // Create credentials in auth-service
        UserCredential credential = new UserCredential();
        credential.setLoginId(request.getSsnId());
        credential.setPassword(passwordEncoder.encode(password));
        credential.setRole("customer");
        credential.setLinkedCustomerId(createdCustomer.getId());
        credential.setName(request.getFirstName() + " " + request.getLastName());
        credentialRepository.save(credential);

        response.setSuccess(true);
        response.setMessage("Customer registered successfully.");
        response.setCustomerId(createdCustomer.getId());
        response.setCustomerName(request.getFirstName() + " " + request.getLastName());
        response.setEmail(request.getEmail());
        response.setSsnId(request.getSsnId());
        response.setAccountNo(bankAccountNo);

        logger.info("Customer registered successfully: {} (ID: {})", response.getCustomerName(), createdCustomer.getId());
        return response;
    }

    @Override
    public void updatePassword(String loginId, String newPassword) {
        UserCredential credential = credentialRepository.findByLoginIdAndRole(loginId, "customer")
                .orElseThrow(() -> new RuntimeException("User not found with login ID: " + loginId));
        
        credential.setPassword(passwordEncoder.encode(newPassword));
        credentialRepository.save(credential);
        logger.info("Password updated successfully for user: {}", loginId);
    }
}
