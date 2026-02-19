//package com.example.contactform.config;
//
//import org.springframework.context.annotation.Bean;
//import org.springframework.context.annotation.Configuration;
//import org.springframework.security.config.Customizer;
//import org.springframework.security.config.annotation.web.builders.HttpSecurity;
//import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
//import org.springframework.security.crypto.password.PasswordEncoder;
//import org.springframework.security.web.SecurityFilterChain;
//import org.springframework.core.env.Environment;
//
//@Configuration
//public class SecurityConfig {
//
//    private final Environment env;
//
//    public SecurityConfig(Environment env) {
//        this.env = env;
//    }
//
//    @Bean
//    public PasswordEncoder passwordEncoder() {
//        return new BCryptPasswordEncoder();
//    }
//
//    @Bean
//    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
//        boolean isDev = env.acceptsProfiles("dev");
//
//        if (isDev) {
//            http
//
//                    .csrf(csrf -> csrf.disable())
//                    .authorizeHttpRequests(auth -> auth
//                            .requestMatchers("/send-message").permitAll()
//                            .anyRequest().permitAll()
//                    );
//        } else {
//            http
//                    .cors() // <-- TO JEST KLUCZOWE
//                    .and()
//                    .csrf(Customizer.withDefaults())
//                    .authorizeHttpRequests(auth -> auth
//                            .requestMatchers("/send-message").permitAll()
//                            .anyRequest().authenticated()
//                    );
//        }
//
//    }
//
//        return http.build();
//    }
//}
package com.example.contactform.config;

import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.core.env.Environment;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.security.config.http.SessionCreationPolicy;

import java.util.List;

@Configuration
public class SecurityConfig {

    private final Environment env;

    @Bean
    public RestTemplate restTemplate(RestTemplateBuilder builder) {
        return builder.build();
    }
    public SecurityConfig(Environment env) {
        this.env = env;
    }
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of("https://www.dctiptop.co.uk","https://dctiptop.co.uk" ));
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        boolean isDev = env.acceptsProfiles("dev");

        if (isDev) {
            http
                    .cors(Customizer.withDefaults())
                    .csrf(AbstractHttpConfigurer::disable)
                    .authorizeHttpRequests(auth -> auth

                            .requestMatchers(
                                    "/",
                                    "/send-message",
                                    "/api/articles",
                                    "/api/articles/**",
                                    "/api/admin/login",
                                    "/api/admin/logout",
                                    "/prerender/**"
                            ).permitAll()
                            .anyRequest().permitAll() // DEV: wszystko dozwolone
                    );
        } else {
//            tryb produkcyjny
            http
                    .cors(Customizer.withDefaults())
                    .csrf(AbstractHttpConfigurer::disable) // Jeśli chcesz, możesz zostawić włączony, ale wymaga tokenów CSRF z frontu
                    .formLogin(AbstractHttpConfigurer::disable)
                    .httpBasic(AbstractHttpConfigurer::disable)
                    .sessionManagement(session -> session
                    .sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED)
            )
                    .authorizeHttpRequests(auth -> auth
                            // PUBLIC ENDPOINTS
                            .requestMatchers("/", "/send-message","/sitemap.xml").permitAll()
                            .requestMatchers(HttpMethod.GET, "/api/articles", "/api/articles/**").permitAll()
                            .requestMatchers("/api/admin/login", "/api/admin/logout").permitAll()
                            .requestMatchers("/prerender/**").permitAll()


                            // ADMIN ONLY
                            .requestMatchers(HttpMethod.POST, "/api/articles/**").authenticated()
                            .requestMatchers(HttpMethod.PUT, "/api/articles/**").authenticated()
                            .requestMatchers(HttpMethod.DELETE, "/api/articles/**").authenticated()

                            // BLOKADA RESZTY
                            .anyRequest().denyAll()
                    );
        }

        return http.build();
    }

}
