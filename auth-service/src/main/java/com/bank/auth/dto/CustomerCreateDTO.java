package com.bank.auth.dto;

import java.time.LocalDate;

/**
 * DTO for creating a customer via the customer-service Feign client.
 */
public class CustomerCreateDTO {

    private String snnId;
    private String firstName;
    private String lastName;
    private String email;
    private Integer age;
    private LocalDate dateOfBirth;
    private String bankAccountNo;
    private String aadharNo;
    private String panNo;
    private String contact;
    private String address;
    private String gender;
    private String maritalStatus;

    public CustomerCreateDTO() {}

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
