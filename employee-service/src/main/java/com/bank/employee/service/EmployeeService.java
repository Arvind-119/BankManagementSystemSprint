package com.bank.employee.service;

import com.bank.employee.dto.EmployeeRequestDTO;
import com.bank.employee.dto.EmployeeResponseDTO;

import java.util.List;

public interface EmployeeService {

    EmployeeResponseDTO createEmployee(EmployeeRequestDTO request);

    List<EmployeeResponseDTO> getAllEmployees();

    EmployeeResponseDTO getEmployeeById(Long id);

    EmployeeResponseDTO updateEmployee(Long id, EmployeeRequestDTO request);

    void deleteEmployee(Long id);

    List<EmployeeResponseDTO> getEmployeesByDepartment(String department);
}
