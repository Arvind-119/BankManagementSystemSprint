package com.bank.customer.service;

import com.bank.customer.dto.CustomerRequestDTO;
import com.bank.customer.dto.CustomerResponseDTO;

import java.util.List;

public interface CustomerService {

    CustomerResponseDTO createCustomer(CustomerRequestDTO request);

    List<CustomerResponseDTO> getAllCustomers();

    CustomerResponseDTO getCustomerById(Long id);

    CustomerResponseDTO getCustomerBySsnId(String snnId);

    CustomerResponseDTO updateCustomer(Long id, CustomerRequestDTO request);

    void deleteCustomer(Long id);
}
