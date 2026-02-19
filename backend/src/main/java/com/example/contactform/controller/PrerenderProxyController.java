package com.example.contactform.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.http.*;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/prerender")
public class PrerenderProxyController {

    private static final String PRERENDER_TOKEN = "qDUnIo8kXIdydTi1ScyG"; 
    private static final String FRONTEND_BASE_URL = "https://www.dctiptop.co.uk";

    private static final List<String> BOT_USER_AGENTS = List.of(
            "googlebot", "bingbot", "yahoo", "facebookexternalhit",
            "twitterbot", "linkedinbot", "slackbot", "whatsapp"
    );

    private final RestTemplate restTemplate;

    @Autowired
    public PrerenderProxyController(RestTemplateBuilder builder) {
        this.restTemplate = builder.build();
    }

    @GetMapping("/blog.html")
    public ResponseEntity<String> proxyBlog(
            @RequestHeader(value = "User-Agent", defaultValue = "") String userAgent) {
        return handlePrerenderRequest("/blog.html", userAgent, null);
    }

    @GetMapping("/article.html")
    public ResponseEntity<String> proxyArticle(
            @RequestParam("id") String id,
            @RequestHeader(value = "User-Agent", defaultValue = "") String userAgent) {
        return handlePrerenderRequest("/article.html", userAgent, Map.of("id", id));
    }

    private ResponseEntity<String> handlePrerenderRequest(
            String path,
            String userAgent,
            Map<String, String> queryParams) {

        boolean isBot = BOT_USER_AGENTS.stream()
                .anyMatch(bot -> userAgent.toLowerCase().contains(bot.toLowerCase()));

        if (!isBot) {
            // user - go to frontend
            String url = UriComponentsBuilder.fromHttpUrl(FRONTEND_BASE_URL + path)
                    .queryParams(toMultiValueMap(queryParams))
                    .build()
                    .toUriString();

            return ResponseEntity.status(HttpStatus.FOUND)
                    .header(HttpHeaders.LOCATION, url)
                    .build();
        }

        //query - Prerender.io
        String fullUrl = UriComponentsBuilder.fromHttpUrl(FRONTEND_BASE_URL + path)
                .queryParams(toMultiValueMap(queryParams))
                .build()
                .toUriString();


        String prerenderUrl = "https://service.prerender.io/" + URLEncoder.encode(fullUrl, StandardCharsets.UTF_8);

        HttpHeaders headers = new HttpHeaders();
        headers.set("X-Prerender-Token", PRERENDER_TOKEN);
        headers.set("User-Agent", userAgent);

        HttpEntity<String> entity = new HttpEntity<>(headers);

        try {
            ResponseEntity<String> response = restTemplate.exchange(
                    prerenderUrl, HttpMethod.GET, entity, String.class
            );

            return ResponseEntity
                    .status(response.getStatusCode())
                    .body(response.getBody());

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Błąd podczas pobierania prerenderowanej wersji");
        }
    }

    private MultiValueMap<String, String> toMultiValueMap(Map<String, String> params) {
        MultiValueMap<String, String> map = new LinkedMultiValueMap<>();
        if (params != null) {
            params.forEach(map::add);
        }
        return map;
    }
}

