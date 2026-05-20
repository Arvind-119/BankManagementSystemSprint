package com.bank.employee.service;

import com.bank.employee.dto.EmployeeRequestDTO;
import com.bank.employee.dto.EmployeeResponseDTO;
import com.bank.employee.entity.Employee;
import com.bank.employee.exception.ResourceNotFoundException;
import com.bank.employee.repository.EmployeeRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class EmployeeServiceImpl implements EmployeeService {

    private final EmployeeRepository employeeRepository;

    public EmployeeServiceImpl(EmployeeRepository employeeRepository) {
        this.employeeRepository = employeeRepository;
    }

    @Override
    public EmployeeResponseDTO createEmployee(EmployeeRequestDTO request) {
        Employee employee = mapToEntity(request);
        Employee savedEmployee = employeeRepository.save(employee);
        return mapToResponseDTO(savedEmployee);
    }

    @Override
    @Transactional(readOnly = true)
    public List<EmployeeResponseDTO> getAllEmployees() {
        return employeeRepository.findAll()
                .stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public EmployeeResponseDTO getEmployeeById(Long id) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found with id: " + id));
        return mapToResponseDTO(employee);
    }

    @Override
    public EmployeeResponseDTO updateEmployee(Long id, EmployeeRequestDTO request) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found with id: " + id));

        employee.setEmployeeId(request.getEmployeeId());
        employee.setFirstName(request.getFirstName());
        employee.setLastName(request.getLastName());
        employee.setEmail(request.getEmail());
        employee.setAge(request.getAge());
        employee.setDateOfBirth(request.getDateOfBirth());
        employee.setDepartment(request.getDepartment());
        employee.setAddress(request.getAddress());

        Employee updatedEmployee = employeeRepository.save(employee);
        return mapToResponseDTO(updatedEmployee);
    }

    @Override
    public void deleteEmployee(Long id) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found with id: " + id));
        employeeRepository.delete(employee);
    }

    @Override
    @Transactional(readOnly = true)
    public List<EmployeeResponseDTO> getEmployeesByDepartment(String department) {
        return employeeRepository.findByDepartment(department)
                .stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    private Employee mapToEntity(EmployeeRequestDTO request) {
        Employee employee = new Employee();
        employee.setEmployeeId(request.getEmployeeId());
        employee.setFirstName(request.getFirstName());
        employee.setLastName(request.getLastName());
        employee.setEmail(request.getEmail());
        employee.setAge(request.getAge());
        employee.setDateOfBirth(request.getDateOfBirth());
        employee.setDepartment(request.getDepartment());
        employee.setAddress(request.getAddress());
        return employee;
    }

    private EmployeeResponseDTO mapToResponseDTO(Employee employee) {
        EmployeeResponseDTO response = new EmployeeResponseDTO();
        response.setId(employee.getId());
        response.setEmployeeId(employee.getEmployeeId());
        response.setFirstName(employee.getFirstName());
        response.setLastName(employee.getLastName());
        response.setEmail(employee.getEmail());
        response.setAge(employee.getAge());
        response.setDateOfBirth(employee.getDateOfBirth());
        response.setDepartment(employee.getDepartment());
        response.setAddress(employee.getAddress());
        response.setCreatedAt(employee.getCreatedAt());
        response.setUpdatedAt(employee.getUpdatedAt());
        return response;
    }
}
