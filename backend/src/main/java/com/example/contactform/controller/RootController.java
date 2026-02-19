package com.example.contactform.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class RootController {
    @GetMapping("/")
    public String healthCheck() {
        return "Backend is up and running.";
    }
}

