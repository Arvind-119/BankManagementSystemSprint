package com.bank.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;

public class RegisterRequest {

    @NotBlank(message = "SSN ID is required")
    @Size(min = 12, max = 12, message = "SSN ID must be exactly 12 digits")
    private String ssnId;

    @NotBlank(message = "First name is required")
    private String firstName;

    @NotBlank(message = "Last name is required")
    private String lastName;

    @NotBlank(message = "Email is required")
    @Email(message = "Email should be valid")
    private String email;

    @NotBlank(message = "Contact number is required")
    private String contact;

    @NotBlank(message = "Password is required")
    private String password;

    @NotBlank(message = "Address is required")
    private String address;

    // Optional fields
    private String aadharNo;
    private String panNo;
    private LocalDate dateOfBirth;
    private String gender;
    private String maritalStatus;
    private java.math.BigDecimal initialDeposit;

    public RegisterRequest() {}

    // Getters and Setters
    public String getSsnId() { return ssnId; }
    public void setSsnId(String ssnId) { this.ssnId = ssnId; }

    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }

    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getContact() { return contact; }
    public void setContact(String contact) { this.contact = contact; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getAadharNo() { return aadharNo; }
    public void setAadharNo(String aadharNo) { this.aadharNo = aadharNo; }

    public String getPanNo() { return panNo; }
    public void setPanNo(String panNo) { this.panNo = panNo; }

    public LocalDate getDateOfBirth() { return dateOfBirth; }
    public void setDateOfBirth(LocalDate dateOfBirth) { this.dateOfBirth = dateOfBirth; }

    public String getGender() { return gender; }
    public void setGender(String gender) { this.gender = gender; }

    public String getMaritalStatus() { return maritalStatus; }
    public void setMaritalStatus(String maritalStatus) { this.maritalStatus = maritalStatus; }

    public java.math.BigDecimal getInitialDeposit() { return initialDeposit; }
    public void setInitialDeposit(java.math.BigDecimal initialDeposit) { this.initialDeposit = initialDeposit; }
}
