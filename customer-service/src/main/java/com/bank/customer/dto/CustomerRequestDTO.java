package com.bank.customer.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;

public class CustomerRequestDTO {

    @NotBlank(message = "SNN ID is required")
    private String snnId;

    @NotBlank(message = "First name is required")
    private String firstName;

    @NotBlank(message = "Last name is required")
    private String lastName;

    @NotBlank(message = "Email is required")
    @Email(message = "Email should be valid")
    private String email;

    @NotNull(message = "Age is required")
    private Integer age;

    @NotNull(message = "Date of birth is required")
    private LocalDate dateOfBirth;

    private String bankAccountNo;

    @NotBlank(message = "Aadhar number is required")
    @Size(min = 12, max = 12, message = "Aadhar number must be exactly 12 characters")
    private String aadharNo;

    @NotBlank(message = "PAN number is required")
    @Size(min = 10, max = 10, message = "PAN number must be exactly 10 characters")
    private String panNo;

    // No-arg constructor
    public CustomerRequestDTO() {
    }

    // Getters and Setters
    public String getSnnId() {
        return snnId;
    }

    public void setSnnId(String snnId) {
        this.snnId = snnId;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Integer getAge() {
        return age;
    }

    public void setAge(Integer age) {
        this.age = age;
    }

    public LocalDate getDateOfBirth() {
        return dateOfBirth;
    }

    public void setDateOfBirth(LocalDate dateOfBirth) {
        this.dateOfBirth = dateOfBirth;
    }

    public String getBankAccountNo() {
        return bankAccountNo;
    }

    public void setBankAccountNo(String bankAccountNo) {
        this.bankAccountNo = bankAccountNo;
    }

    public String getAadharNo() {
        return aadharNo;
    }

    public void setAadharNo(String aadharNo) {
        this.aadharNo = aadharNo;
    }

    public String getPanNo() {
        return panNo;
    }

    public void setPanNo(String panNo) {
        this.panNo = panNo;
    }
}
