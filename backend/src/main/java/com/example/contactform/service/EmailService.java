package com.example.contactform.service;

import com.example.contactform.dto.ContactFormDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {
    @Autowired
    private JavaMailSender mailSender;

    public void sendContactEmail(ContactFormDto form) {
        SimpleMailMessage message = new SimpleMailMessage();
        if (mailSender == null) {
            throw new IllegalStateException("mailSender is null — sprawdź konfigurację Spring Mail!");
        }
        message.setFrom("hello@dctiptop.co.uk");
        message.setTo("hello@dctiptop.co.uk");
        message.setSubject("New message from Contact Form!");
        message.setText(
                "Company: " + form.getCompany() + "\n" +
                        "Postcode: " + form.getPostcode() + "\n" +
                        "Phone: " + form.getPhone() + "\n" +
                        "Email: " + form.getEmail() + "\n" +
                        "Message: " + form.getMessage());
        mailSender.send(message);
    }

}
