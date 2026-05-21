package com.bank.auth.feign;

import com.bank.auth.dto.AccountRequestDTO;
import com.bank.auth.dto.AccountResponseDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(name = "bank-service")
public interface BankAccountClient {

    @PostMapping("/api/v1/accounts")
    AccountResponseDTO createAccount(@RequestBody AccountRequestDTO request);
}
