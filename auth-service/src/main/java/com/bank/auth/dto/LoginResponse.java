package com.bank.auth.dto;

public class LoginResponse {

    private Long id;
    private String loginId;
    private String name;
    private String role;
    private Long linkedCustomerId;
    private String message;
    private boolean success;

    public LoginResponse() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getLoginId() { return loginId; }
    public void setLoginId(String loginId) { this.loginId = loginId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public Long getLinkedCustomerId() { return linkedCustomerId; }
    public void setLinkedCustomerId(Long linkedCustomerId) { this.linkedCustomerId = linkedCustomerId; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public boolean isSuccess() { return success; }
    public void setSuccess(boolean success) { this.success = success; }
}
