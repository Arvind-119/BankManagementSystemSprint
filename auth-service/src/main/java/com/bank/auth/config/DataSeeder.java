package com.bank.auth.config;

import com.bank.auth.entity.UserCredential;
import com.bank.auth.repository.UserCredentialRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataSeeder implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(DataSeeder.class);

    private final UserCredentialRepository credentialRepository;
    private final org.springframework.security.crypto.password.PasswordEncoder passwordEncoder;

    public DataSeeder(UserCredentialRepository credentialRepository,
                      org.springframework.security.crypto.password.PasswordEncoder passwordEncoder) {
        this.credentialRepository = credentialRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        // Seed the default manager account (manager1 / manager123)
        if (!credentialRepository.existsByLoginIdAndRole("manager1", "manager")) {
            UserCredential manager = new UserCredential();
            manager.setLoginId("manager1");
            manager.setPassword(passwordEncoder.encode("manager123"));
            manager.setRole("manager");
            manager.setName("Arvind Sahni");
            manager.setLinkedCustomerId(null);
            credentialRepository.save(manager);
            logger.info("Seeded default manager account: manager1 / manager123");
        }
    }
}
