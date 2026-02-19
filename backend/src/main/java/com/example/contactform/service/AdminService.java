package com.example.contactform.service;

import com.example.contactform.model.Admin;
import com.example.contactform.repository.AdminRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AdminService {

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // Register a new admin with hashed password
    public Admin registerAdmin(String username, String rawPassword) {
        String hashedPassword = passwordEncoder.encode(rawPassword);
        Admin admin = new Admin(username, hashedPassword);
        return adminRepository.save(admin);
    }

    // Authenticate admin using password encoder
    public boolean authenticate(String username, String rawPassword) {
        Optional<Admin> admin = adminRepository.findByUsername(username);
        return admin.isPresent() && passwordEncoder.matches(rawPassword, admin.get().getPassword());
    }
}