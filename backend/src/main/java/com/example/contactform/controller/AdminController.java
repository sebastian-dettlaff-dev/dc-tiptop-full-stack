//package com.example.contactform.controller;
//
//import com.example.contactform.service.AdminService;
//import jakarta.servlet.http.HttpSession;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.http.HttpStatus;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.*;
//
//import java.util.Map;
//
//@RestController
//@RequestMapping("/api/admin")
//@CrossOrigin(origins = "https://www.dctiptop.co.uk" , allowCredentials = "true")
//public class AdminController {
//    @Autowired
//    private AdminService adminService;
//    @PostMapping("/login")
//    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials, HttpSession session) {
//        String username = credentials.get("username");
//        String password = credentials.get("password");
//        if (adminService.authenticate(username, password)) {
//            // zapis w sesji
//            session.setAttribute("admin", true);
//            return ResponseEntity.ok().body(Map.of("message", "Login successful"));
//        } else {
//            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
//                    .body(Map.of("error", "Invalid credentials"));
//        }
//    }
//
//    @PostMapping("/logout")
//    public ResponseEntity<?> logout(HttpSession session) {
//        session.invalidate(); // wyczyść sesję
//        return ResponseEntity.ok().body(Map.of("message", "Logout successful"));
//    }
//
//}
package com.example.contactform.controller;

import com.example.contactform.service.AdminService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(
        origins = {
                "https://www.dctiptop.co.uk",
                "https://dctiptop.co.uk"
        },
        allowCredentials = "true"
)
public class AdminController {

    @Autowired
    private AdminService adminService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials, HttpServletRequest request) {
        String username = credentials.get("username");
        String password = credentials.get("password");

        if (adminService.authenticate(username, password)) {
            // Ustaw sesję
            request.getSession(true).setAttribute("admin", true);

            // 🔐 Ustaw autoryzację w Spring Security
            List<SimpleGrantedAuthority> authorities = List.of(new SimpleGrantedAuthority("ROLE_ADMIN"));
            UsernamePasswordAuthenticationToken authToken =
                    new UsernamePasswordAuthenticationToken(username, null, authorities);

//            SecurityContextHolder.getContext().setAuthentication(authToken);
            // ✅ Ustaw kontekst SecurityContextHolder
            SecurityContext context = SecurityContextHolder.getContext();
            context.setAuthentication(authToken);

            // 🔑 KLUCZOWY KROK — zapisz SecurityContext do sesji
            request.getSession(true).setAttribute(
                    HttpSessionSecurityContextRepository.SPRING_SECURITY_CONTEXT_KEY,
                    context
            );
            return ResponseEntity.ok(Map.of("message", "Login successful"));
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Invalid credentials"));
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletRequest request) {
        // Inwalidacja sesji + czyszczenie SecurityContext
        HttpSession session = request.getSession(false);
        if (session != null) {
            session.invalidate();
        }
        SecurityContextHolder.clearContext();

        return ResponseEntity.ok(Map.of("message", "Logout successful"));
    }
}
