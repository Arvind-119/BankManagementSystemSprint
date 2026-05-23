package com.bank.customer.repository;

import com.bank.customer.entity.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, Long> {

    Optional<Customer> findBySnnId(String snnId);

    Optional<Customer> findByEmail(String email);

    Optional<Customer> findByPanNo(String panNo);

    Optional<Customer> findByAadharNo(String aadharNo);

    boolean existsByEmail(String email);

    boolean existsBySnnId(String snnId);

    boolean existsByPanNo(String panNo);

    boolean existsByAadharNo(String aadharNo);

    @org.springframework.data.jpa.repository.Query("SELECT c FROM Customer c WHERE " +
            "LOWER(c.firstName) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(c.lastName) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(c.email) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "c.snnId LIKE CONCAT('%', :keyword, '%') OR " +
            "c.bankAccountNo LIKE CONCAT('%', :keyword, '%')")
    java.util.List<Customer> searchCustomers(@org.springframework.data.repository.query.Param("keyword") String keyword);
}
