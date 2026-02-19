package com.example.contactform.dto;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;




import lombok.Data;

@Data
public class ContactFormDto {
    @NotBlank
    private String company;
    @NotBlank
    private String postcode;
    @NotBlank
    private String phone;
    @Email
    @NotBlank
    private String email;
    private String recaptchaToken;
    @NotBlank
    private String message;


    public String getCompany() {
        return company;
    }

    public void setCompany(String company) {
        this.company = company;
    }

    public String getPostcode() {
        return postcode;
    }

    public void setPostcode(String postcode) {
        this.postcode = postcode;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getRecaptchaToken() {
        return recaptchaToken;
    }

    public void setRecaptchaToken(String recaptchaToken) {
        this.recaptchaToken = recaptchaToken;
    }

    public String getMessage() {
        return message;
    }
    public void  setMessage(String message) {
        this.message = message;
    }
}