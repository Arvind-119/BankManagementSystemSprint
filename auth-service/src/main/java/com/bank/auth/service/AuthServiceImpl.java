package com.bank.auth.service;

import com.bank.auth.dto.CustomerCreateDTO;
import com.bank.auth.dto.CustomerDTO;
import com.bank.auth.dto.LoginRequest;
import com.bank.auth.dto.LoginResponse;
import com.bank.auth.dto.RegisterRequest;
import com.bank.auth.dto.RegisterResponse;
import com.bank.auth.entity.UserCredential;
import com.bank.auth.feign.CustomerClient;
import com.bank.auth.repository.UserCredentialRepository;
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

    public AuthServiceImpl(UserCredentialRepository credentialRepository,
                           CustomerClient customerClient) {
        this.credentialRepository = credentialRepository;
        this.customerClient = customerClient;
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

        if (!credential.getPassword().equals(request.getPassword())) {
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
            customerCreate.setAadharNo(request.getAadharNo() != null ? request.getAadharNo() : "");
            customerCreate.setPanNo(request.getPanNo() != null ? request.getPanNo() : "");
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
            } else {
                response.setMessage("Failed to register customer. Please try again.");
            }
            return response;
        }

        // Create credentials in auth-service
        UserCredential credential = new UserCredential();
        credential.setLoginId(request.getSsnId());
        credential.setPassword(password);
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
        response.setAccountNo(createdCustomer.getBankAccountNo());

        logger.info("Customer registered successfully: {} (ID: {})", response.getCustomerName(), createdCustomer.getId());
        return response;
    }
}
