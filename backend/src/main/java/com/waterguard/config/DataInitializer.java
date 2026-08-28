package com.waterguard.config;

import com.waterguard.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @EventListener(ApplicationReadyEvent.class)
    @Transactional
    public void initDatabaseData() {
        log.info("Synchronizing Smart Water Platform user security credentials...");

        // Ensure BCrypt passwords are encrypted with current PasswordEncoder instance
        userRepository.findByEmail("admin@waterguard.io").ifPresent(admin -> {
            admin.setPasswordHash(passwordEncoder.encode("Admin@123"));
            userRepository.save(admin);
            log.info("Admin password updated: admin@waterguard.io / Admin@123");
        });

        userRepository.findByEmail("resident3@gmail.com").ifPresent(resident -> {
            resident.setPasswordHash(passwordEncoder.encode("Resident@123"));
            userRepository.save(resident);
            log.info("Resident password updated: resident3@gmail.com / Resident@123");
        });

        userRepository.findByEmail("rahul.sharma@waterguard.io").ifPresent(r -> {
            r.setPasswordHash(passwordEncoder.encode("Resident@123"));
            userRepository.save(r);
        });

        log.info("Platform database ready for operation!");
    }
}
