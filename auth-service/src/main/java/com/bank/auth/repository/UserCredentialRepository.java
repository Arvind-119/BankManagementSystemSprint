package com.bank.auth.repository;

import com.bank.auth.entity.UserCredential;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserCredentialRepository extends JpaRepository<UserCredential, Long> {

    Optional<UserCredential> findByLoginIdAndRole(String loginId, String role);

    boolean existsByLoginIdAndRole(String loginId, String role);

    Optional<UserCredential> findByLinkedCustomerId(Long customerId);
}
