package com.example.contactform.config;

import com.example.contactform.model.Admin;
import com.example.contactform.repository.AdminRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.event.ContextRefreshedEvent;
import org.springframework.context.event.EventListener;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer {

    private final AdminRepository adminRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${admin.login}")
    private String adminLogin;

    @Value("${admin.password}")
    private String adminPassword;

    public DataInitializer(AdminRepository adminRepository, PasswordEncoder passwordEncoder) {
        this.adminRepository = adminRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @EventListener
    public void onApplicationEvent(ContextRefreshedEvent event) {
        if (adminRepository.findAll().isEmpty()) {
            Admin admin = new Admin(adminLogin, passwordEncoder.encode(adminPassword));
            adminRepository.save(admin);
        }
    }
}
