package com.bank.account.feign;

import com.bank.account.dto.TransactionDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;

@FeignClient(name = "transaction-service", url = "http://localhost:8084")
public interface TransactionClient {

    @PostMapping("/api/v1/transactions")
    TransactionDTO createTransaction(@RequestBody TransactionDTO dto);

    @GetMapping("/api/v1/transactions/account/{accountNo}")
    List<TransactionDTO> getTransactionsByAccount(@PathVariable("accountNo") String accountNo);
}
