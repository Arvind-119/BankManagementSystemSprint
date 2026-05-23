package com.bank.customer.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
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

    @jakarta.validation.constraints.Min(value = 0, message = "Age cannot be negative")
    @jakarta.validation.constraints.Max(value = 150, message = "Age must be less than 150")
    private Integer age;

    private LocalDate dateOfBirth;

    private String bankAccountNo;

    @Pattern(regexp = "^\\d{12}$", message = "Aadhar must be exactly 12 digits")
    private String aadharNo;

    @Pattern(regexp = "^[A-Z]{5}[0-9]{4}[A-Z]{1}$", message = "PAN must follow 5 letters, 4 digits, 1 letter format")
    private String panNo;

    @Pattern(regexp = "^[6-9]\\d{9}$", message = "Contact must be a 10-digit number starting with 6, 7, 8, or 9")
    private String contact;

    @Size(max = 100, message = "Address cannot exceed 100 characters")
    private String address;

    private String gender;

    private String maritalStatus;

    // No-arg constructor
    public CustomerRequestDTO() {}

    // Getters and Setters
    public String getSnnId() { return snnId; }
    public void setSnnId(String snnId) { this.snnId = snnId; }

    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }

    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public Integer getAge() { return age; }
    public void setAge(Integer age) { this.age = age; }

    public LocalDate getDateOfBirth() { return dateOfBirth; }
    public void setDateOfBirth(LocalDate dateOfBirth) { this.dateOfBirth = dateOfBirth; }

    public String getBankAccountNo() { return bankAccountNo; }
    public void setBankAccountNo(String bankAccountNo) { this.bankAccountNo = bankAccountNo; }

    public String getAadharNo() { return aadharNo; }
    public void setAadharNo(String aadharNo) { this.aadharNo = aadharNo; }

    public String getPanNo() { return panNo; }
    public void setPanNo(String panNo) { this.panNo = panNo; }

    public String getContact() { return contact; }
    public void setContact(String contact) { this.contact = contact; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getGender() { return gender; }
    public void setGender(String gender) { this.gender = gender; }

    public String getMaritalStatus() { return maritalStatus; }
    public void setMaritalStatus(String maritalStatus) { this.maritalStatus = maritalStatus; }
}
