package com.example.contactform.service;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import java.util.List;

@Service
public class CaptchaValidator {

    @Value("${google.recaptcha.secret}")
    private String secret;

    private static final String VERIFY_URL = "https://www.google.com/recaptcha/api/siteverify";

    public boolean validate(String token) {
        RestTemplate restTemplate = new RestTemplate();

        MultiValueMap<String, String> requestMap = new LinkedMultiValueMap<>();
        requestMap.add("secret", secret);
        requestMap.add("response", token);

        RecaptchaResponse response = restTemplate.postForObject(VERIFY_URL, requestMap, RecaptchaResponse.class);
        // Log response
        if (response != null) {
            System.out.println("reCAPTCHA response: ");
            System.out.println("success: " + response.isSuccess());
            System.out.println("score: " + response.getScore());
            System.out.println("action: " + response.getAction());
            System.out.println("errors: " + response.getErrorCodes());
        } else {
            System.out.println("reCAPTCHA response is null.");
        }
        return response != null
                && response.isSuccess()
                && response.getScore() >= 0.5f
                && "submit".equals(response.getAction());

    }

    @Data
    private static class RecaptchaResponse {
        private boolean success;
        private float score;
        private String action;

        @JsonProperty("error-codes")
        private List<String> errorCodes;

    }
}
