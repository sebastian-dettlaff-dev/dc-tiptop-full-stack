package com.example.contactform.controller;

import com.example.contactform.dto.ContactFormDto;
import com.example.contactform.service.CaptchaValidator;
import com.example.contactform.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
public class ContactController {

    @Autowired
    private CaptchaValidator captchaValidator;

    @Autowired
    private EmailService emailService;


    @CrossOrigin(
            origins = {
                    "https://www.dctiptop.co.uk",
                    "https://dctiptop.co.uk"
            },
            allowCredentials = "true"
    )
    @PostMapping("/send-message")
    public ResponseEntity<?> handleForm(@RequestBody ContactFormDto dto) {
        if (!captchaValidator.validate(dto.getRecaptchaToken())) {
            return ResponseEntity.badRequest().body("Captcha mismatch, try again.");
        }

        emailService.sendContactEmail(dto);
        return ResponseEntity.ok("Message sent successfully");
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<String> handleException(Exception ex) {
        ex.printStackTrace();
        return ResponseEntity.status(500).body("Internal error: " + ex.getMessage());
    }

}
