package com.bank.auth.service;

import com.bank.auth.dto.LoginRequest;
import com.bank.auth.dto.LoginResponse;
import com.bank.auth.dto.RegisterRequest;
import com.bank.auth.dto.RegisterResponse;

public interface AuthService {

    LoginResponse login(LoginRequest request);

    RegisterResponse registerCustomer(RegisterRequest request);



    void updatePassword(String loginId, String newPassword);
}
