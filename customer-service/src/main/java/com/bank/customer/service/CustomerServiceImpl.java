package com.bank.customer.service;

import com.bank.customer.dto.CustomerRequestDTO;
import com.bank.customer.dto.CustomerResponseDTO;
import com.bank.customer.entity.Customer;
import com.bank.customer.exception.ResourceNotFoundException;
import com.bank.customer.repository.CustomerRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
@SuppressWarnings("null")
public class CustomerServiceImpl implements CustomerService {

    private final CustomerRepository customerRepository;

    public CustomerServiceImpl(CustomerRepository customerRepository) {
        this.customerRepository = customerRepository;
    }

    @Override
    public CustomerResponseDTO createCustomer(CustomerRequestDTO request) {
        // Check for duplicate SSN
        if (customerRepository.existsBySnnId(request.getSnnId())) {
            throw new IllegalArgumentException("A customer with this SSN ID already exists.");
        }
        // Check for duplicate email
        if (customerRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("A customer with this email already exists.");
        }
        // Check for duplicate PAN
        if (request.getPanNo() != null && !request.getPanNo().trim().isEmpty() && customerRepository.existsByPanNo(request.getPanNo())) {
            throw new IllegalArgumentException("A customer with this PAN already exists.");
        }
        // Check for duplicate Aadhar
        if (request.getAadharNo() != null && !request.getAadharNo().trim().isEmpty() && customerRepository.existsByAadharNo(request.getAadharNo())) {
            throw new IllegalArgumentException("A customer with this Aadhar already exists.");
        }

        Customer customer = mapToEntity(request);
        Customer savedCustomer = customerRepository.save(customer);
        return mapToResponseDTO(savedCustomer);
    }

    @Override
    @Transactional(readOnly = true)
    public List<CustomerResponseDTO> getAllCustomers() {
        List<Customer> customers = customerRepository.findAll();
        return customers.stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public CustomerResponseDTO getCustomerById(Long id) {
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with id: " + id));
        return mapToResponseDTO(customer);
    }

    @Override
    @Transactional(readOnly = true)
    public CustomerResponseDTO getCustomerBySsnId(String snnId) {
        Customer customer = customerRepository.findBySnnId(snnId)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with SSN ID: " + snnId));
        return mapToResponseDTO(customer);
    }

    @Override
    public CustomerResponseDTO updateCustomer(Long id, CustomerRequestDTO request) {
        Customer existingCustomer = customerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with id: " + id));

        existingCustomer.setSnnId(request.getSnnId());
        existingCustomer.setFirstName(request.getFirstName());
        existingCustomer.setLastName(request.getLastName());
        existingCustomer.setEmail(request.getEmail());
        existingCustomer.setAge(request.getAge());
        existingCustomer.setDateOfBirth(request.getDateOfBirth());
        existingCustomer.setBankAccountNo(request.getBankAccountNo());
        existingCustomer.setAadharNo(request.getAadharNo());
        existingCustomer.setPanNo(request.getPanNo());
        existingCustomer.setContact(request.getContact());
        existingCustomer.setAddress(request.getAddress());
        existingCustomer.setGender(request.getGender());
        existingCustomer.setMaritalStatus(request.getMaritalStatus());

        Customer updatedCustomer = customerRepository.save(existingCustomer);
        return mapToResponseDTO(updatedCustomer);
    }

    @Override
    public void deleteCustomer(Long id) {
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with id: " + id));
        customerRepository.delete(customer);
    }

    // ---- Mapping Helpers ----

    private Customer mapToEntity(CustomerRequestDTO dto) {
        Customer customer = new Customer();
        customer.setSnnId(dto.getSnnId());
        customer.setFirstName(dto.getFirstName());
        customer.setLastName(dto.getLastName());
        customer.setEmail(dto.getEmail());
        customer.setAge(dto.getAge());
        customer.setDateOfBirth(dto.getDateOfBirth());
        customer.setBankAccountNo(dto.getBankAccountNo());
        customer.setAadharNo(dto.getAadharNo());
        customer.setPanNo(dto.getPanNo());
        customer.setContact(dto.getContact());
        customer.setAddress(dto.getAddress());
        customer.setGender(dto.getGender());
        customer.setMaritalStatus(dto.getMaritalStatus());
        return customer;
    }

    private CustomerResponseDTO mapToResponseDTO(Customer customer) {
        CustomerResponseDTO dto = new CustomerResponseDTO();
        dto.setId(customer.getId());
        dto.setSnnId(customer.getSnnId());
        dto.setFirstName(customer.getFirstName());
        dto.setLastName(customer.getLastName());
        dto.setEmail(customer.getEmail());
        dto.setAge(customer.getAge());
        dto.setDateOfBirth(customer.getDateOfBirth());
        dto.setBankAccountNo(customer.getBankAccountNo());
        dto.setAadharNo(customer.getAadharNo());
        dto.setPanNo(customer.getPanNo());
        dto.setContact(customer.getContact());
        dto.setAddress(customer.getAddress());
        dto.setGender(customer.getGender());
        dto.setMaritalStatus(customer.getMaritalStatus());
        dto.setCreatedAt(customer.getCreatedAt());
        dto.setUpdatedAt(customer.getUpdatedAt());
        return dto;
    }
}
