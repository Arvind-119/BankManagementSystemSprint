package com.bank.auth.feign;

import com.bank.auth.dto.CustomerCreateDTO;
import com.bank.auth.dto.CustomerDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.DeleteMapping;

@FeignClient(name = "customer-service", url = "http://localhost:8081")
public interface CustomerClient {

    @PostMapping("/api/v1/customers")
    CustomerDTO createCustomer(@RequestBody CustomerCreateDTO request);

    @GetMapping("/api/v1/customers/{id}")
    CustomerDTO getCustomerById(@PathVariable("id") Long id);

    @GetMapping("/api/v1/customers/ssn/{snnId}")
    CustomerDTO getCustomerBySsn(@PathVariable("snnId") String snnId);

    @PutMapping("/api/v1/customers/{id}")
    CustomerDTO updateCustomer(@PathVariable("id") Long id, @RequestBody CustomerCreateDTO request);

    @DeleteMapping("/api/v1/customers/{id}")
    void deleteCustomer(@PathVariable("id") Long id);
}
