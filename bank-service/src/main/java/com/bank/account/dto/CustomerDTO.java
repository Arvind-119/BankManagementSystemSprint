package com.bank.account.dto;

public class CustomerDTO {

    private Long id;
    private String snnId;
    private String firstName;
    private String lastName;
    private String email;

    // No-arg constructor
    public CustomerDTO() {
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

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
}
